import * as THREE from 'three';
import { Buffer } from 'buffer';
import { TxdParser, DffParser } from 'rw-parser';
import type { RwColor, RwDff, RwFrame, RwMaterial, RwMatrix3, RwTriangle, RwVector3 } from 'rw-parser';
import type { RwTextureNative, RwTxd } from 'rw-parser';

export enum MaterialType {
   TEXTURE,
   PHYSICAL_MATERIAL,
}

export class RwModel {
   private modelDff?: RwDff;
   private modelTxd: RwTxd[] = [];

   public async create(): Promise<THREE.Group> {
      const model = this.modelDff;

      if (!model) {
         throw new Error('Model is not loaded yet');
      }

      const frames = model.frameList?.frames;
      const geometries = model.geometryList?.geometries;
      const atomics = model.atomics;
      const dummies = model.dummies;

      // Model does not contain any frames.
      if (!frames) {
         throw new Error('Model does not contain any frames');
      }

      // Model does not contain any geometries.
      if (!geometries) {
         throw new Error('Model does not contain any geometries');
      }

      const groupGeometry = new THREE.Group();

      for (let frameIndex = 0; frameIndex < frames.length; ++frameIndex) {
         const frame = frames[frameIndex];
         const frameDummy = dummies[frameIndex];

         if (!frameDummy) continue;

         const atomicIndex = this.getFrameAtomicIndex(atomics, dummies, frameIndex, frameDummy);

         if (atomicIndex === null) continue;

         // console.log(`Creating frame ${frameDummy}...`);

         const atomic = atomics[atomicIndex];
         const geometry = geometries[atomicIndex];
         const geometryMaterials = geometry.materialList.materialData;

         let bufferGeometry = new THREE.BufferGeometry();

         // Process textures
         let materials = [];

         for (const material of geometryMaterials) {
            let threeMaterial: THREE.Material | undefined;
            if (material.isTextured) {
               const textureName = material.texture?.textureName ?? 'N/A';

               // console.log(`Applying texture ${material.texture?.textureName}`);

               for (const texture of this.modelTxd) {
                  for (const textureNative of texture.textureDictionary.textureNatives) {
                     if (textureNative.textureName === textureName) {

                        threeMaterial = this.createTextureMaterial(textureNative, material);

                        break;
                     }
                  }

                  if (threeMaterial) break;
               }

               if (!threeMaterial) {
                  console.warn(`Texture ${textureName} not found`);
                  threeMaterial = new THREE.MeshBasicMaterial({
                     color: 0xFF00FF,
                     userData: {
                        materialType: MaterialType.TEXTURE,
                        isTextureMissing: true,
                        textureName,
                     },
                  });
               }
            } else {
               threeMaterial = new THREE.MeshPhysicalMaterial({
                  color: new THREE.Color(material.color.r / 255, material.color.g / 255, material.color.b / 255),
                  reflectivity: material.specular,
                  aoMapIntensity: material.ambient,
                  userData: {
                     materialType: MaterialType.PHYSICAL_MATERIAL,
                  },
               });

               threeMaterial.alphaTest = 0.5;
               threeMaterial.side = THREE.DoubleSide;
               threeMaterial.opacity = material.color.a / 255;
            }

            materials.push(threeMaterial);
         }

         // Process vertices, normals and faces
         const vertices = this.getGeometryVertices(geometry.vertexInformation);

         let normals;
         if (geometry.hasNormals) {
            normals = this.getGeometryNormals(geometry.triangleInformation, geometry.normalInformation);
         }

         // Triangles are basically indices, telling us in what order vertices should be drawn
         const triangles = this.getGeometryTriangles(geometry.triangleInformation);

         // Vertex UV coordinate mapping
         const hasUvMapping1 = (geometry.textureCoordinatesCount > 0);
         const hasUvMapping2 = (geometry.textureCoordinatesCount > 1);

         const uvMapping1 = new Float32Array(geometry.vertexInformation.length * 2);
         const uvMapping2 = new Float32Array(geometry.vertexInformation.length * 2);
         for (let vertexIndex = 0; vertexIndex < geometry.vertexInformation.length; ++vertexIndex) {
            if (hasUvMapping1) {
               uvMapping1[vertexIndex * 2 + 0] = geometry.textureMappingInformation[0][vertexIndex].u;
               uvMapping1[vertexIndex * 2 + 1] = geometry.textureMappingInformation[0][vertexIndex].v;
            }

            if (hasUvMapping2) {
               uvMapping2[vertexIndex * 2 + 0] = geometry.textureMappingInformation[1][vertexIndex].u;
               uvMapping2[vertexIndex * 2 + 1] = geometry.textureMappingInformation[1][vertexIndex].v;
            }
         }

         // Colors
         const colors = this.getGeometryColors(geometry.vertexColorInformation);

         // Process bounding sphere, which is currently not being used
         if (geometry.boundingSphere) {
            bufferGeometry.boundingSphere = new THREE.Sphere(
               new THREE.Vector3(geometry.boundingSphere.vector.x, geometry.boundingSphere.vector.y, geometry.boundingSphere.vector.z),
               geometry.boundingSphere.radius
            );
         }

         this.setBufferGeometryAttributes(bufferGeometry, triangles, vertices, normals, colors, uvMapping1, uvMapping2);

         // Separate draw calls between components, otherwise UVs won't map correctly
         this.setBufferGeometryGroups(bufferGeometry, geometry.triangleInformation);

         this.setBufferGeometryRotationMatrix(bufferGeometry, frameDummy, frame.rotationMatrix);

         const mesh = this.createBufferGeometryMeshComponent(bufferGeometry, materials, frameDummy, frames, frameIndex, frame.parentFrame);

         groupGeometry.add(mesh);
      }

      groupGeometry.position.set(0, 0, 0);
      groupGeometry.rotation.set(270 * (Math.PI / 180), 0, 180 * (Math.PI));

      return groupGeometry;
   }

   public async loadModelFromUri(modelUri: string) {
      const modelBuffer = (await fetch(modelUri)).arrayBuffer();
      await this.loadModelFromArrayBuffer(modelBuffer);
   }

   public async loadModelFromArrayBuffer(modelArrayBuffer: Promise<ArrayBuffer>) {
      await this.loadModelFromBuffer(Buffer.from(await modelArrayBuffer));
   }

   public async loadModelFromBuffer(modelBuffer: Buffer) {
      const dffParser = new DffParser(modelBuffer);
      this.modelDff = dffParser.parse();
      console.log(this.modelDff);
   }

   public async loadTextureFromUri(textureUri: string) {
      const textureBuffer = (await fetch(textureUri)).arrayBuffer();
      await this.loadTextureFromArrayBuffer(textureBuffer);
   }

   public async loadTextureFromArrayBuffer(modelArrayBuffer: Promise<ArrayBuffer>) {
      await this.loadTextureFromBuffer(Buffer.from(await modelArrayBuffer));
   }

   public async loadTextureFromBuffer(modelBuffer: Buffer) {
      const txdParser = new TxdParser(modelBuffer);
      this.modelTxd.push(txdParser.parse());
   }

   private getFrameAtomicIndex(atomics: number[], dummies: string[], frameIndex: number, frameDummyName: string): number | null {
      let atomicIndex = atomics.indexOf(frameIndex);

      if (frameDummyName === 'wheel' || frameDummyName.endsWith('_dam') || frameDummyName.endsWith('_vlo')) {
         return null;
      }

      if (frameDummyName.includes('wheel_')) {
         for (let i = 0; i < dummies.length; ++i) {
            if (dummies[i] === 'wheel') {
               atomicIndex = atomics.indexOf(i);
            }
         }
      }

      if (frameDummyName === 'bogie_rear') {
         for (let i = 0; i < dummies.length; ++i) {
            if (dummies[i] === 'bogie_front') {
               atomicIndex = atomics.indexOf(i);
            }
         }
      }

      if (atomicIndex === -1) {
         // Frame isn't indexed in atomics, might be parent frame
         return null;
      }

      return atomicIndex;
   }

   private getGeometryVertices(vertexInformation: RwVector3[]): Float32Array {
      let vertices = new Float32Array(vertexInformation.length * 3);

      // TODO: Test with simple push and convert to Float32Array for performance boost

      for (let vertexIndex = 0; vertexIndex < vertexInformation.length; ++vertexIndex) {
         const vertex = vertexInformation[vertexIndex];
         const vertexIndexOffset = vertexIndex * 3;
         vertices[vertexIndexOffset + 0] = vertex.x;
         vertices[vertexIndexOffset + 1] = vertex.y;
         vertices[vertexIndexOffset + 2] = vertex.z;
      }

      return vertices;
   }

   private getGeometryNormals(triangleInformation: RwTriangle[], normalInformation: RwVector3[]) {
      let normals = new Float32Array(normalInformation.length * 3);

      for (let triangleIndex = 0; triangleIndex < triangleInformation.length; ++triangleIndex) {
         const triangleIndexOffset = triangleIndex * 3;

         const normal = normalInformation[triangleIndex];
         if (normal) {
            normals[triangleIndexOffset + 0] = normal.x;
            normals[triangleIndexOffset + 1] = normal.y;
            normals[triangleIndexOffset + 2] = normal.z;
         }
      }

      return normals
   }

   private getGeometryTriangles(triangleInformation: RwTriangle[]) {
      let triangles: number[] = [];

      for (let triangleIndex = 0; triangleIndex < triangleInformation.length; ++triangleIndex) {
         const triangle = triangleInformation[triangleIndex];
         triangles.push(triangle.vector.x, triangle.vector.y, triangle.vector.z);
      }

      return triangles;
   }

   private getGeometryColors(vertexColorInformation: RwColor[]) {
      const colors = new Float32Array(vertexColorInformation.length * 3);

      for (let colorIndex = 0; colorIndex < vertexColorInformation.length; ++colorIndex) {
         const color = vertexColorInformation[colorIndex];
         const colorIndexOffset = colorIndex * 3;
         colors[colorIndexOffset + 0] = color.r;
         colors[colorIndexOffset + 1] = color.g;
         colors[colorIndexOffset + 2] = color.b;
      }

      return colors;
   }

   private setBufferGeometryAttributes(
      bufferGeometry: THREE.BufferGeometry,
      faces: number[], vertices: Float32Array,
      normals?: Float32Array,
      colors?: Float32Array,
      uv1?: Float32Array,
      uv2?: Float32Array
   ) {
      // Set geometry attributes
      bufferGeometry.setIndex(faces);

      bufferGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

      if (normals) {
         bufferGeometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
      }

      if (colors) {
         bufferGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      }

      if (uv1) {
         bufferGeometry.setAttribute('uv', new THREE.BufferAttribute(uv1, 2));
      }

      if (uv2) {
         bufferGeometry.setAttribute('uv2', new THREE.BufferAttribute(uv2, 2));
      }

      // bufferGeometry.computeTangents();

      // Calculate vertex normals - the ones defined in DFF format seem incorrect according to testing
      bufferGeometry.computeVertexNormals();

      // Calculate bounding sphere and box for raytracing and frustum culling,
      // although we could use the one defined in DFF format
      bufferGeometry.computeBoundingSphere();
      bufferGeometry.computeBoundingBox();
   }

   private setBufferGeometryGroups(bufferGeometry: THREE.BufferGeometry, triangleInformation: RwTriangle[]) {
      let group;
      let materialIndex;

      for (let i = 0; i < triangleInformation.length; ++i) {
         const triangle = triangleInformation[i];

         if (triangle.materialId !== materialIndex) {
            materialIndex = triangle.materialId;

            if (group) {
               bufferGeometry.addGroup(group.start, (i * 3) - group.start, group.materialIndex);
            }

            group = {
               start: i * 3,
               materialIndex: materialIndex,
            };
         }
      }

      if (group) {
         bufferGeometry.addGroup(group.start, (triangleInformation.length * 3) - group.start, group.materialIndex);
      }
   }

   private setBufferGeometryRotationMatrix(bufferGeometry: THREE.BufferGeometry, frameDummy: string, frameRotationMatrix: RwMatrix3) {
      let rotationMatrix = new THREE.Matrix4(
         frameRotationMatrix.right.x, frameRotationMatrix.right.y, frameRotationMatrix.right.z, 0,
         frameRotationMatrix.up.x, frameRotationMatrix.up.y, frameRotationMatrix.up.z, 0,
         frameRotationMatrix.at.x, frameRotationMatrix.at.y, frameRotationMatrix.at.z, 0,
         0, 0, 0, 1
      );

      // Rotate left wheels, because they are instanced from the right ones
      if (frameDummy.startsWith('wheel_l')) {
         rotationMatrix.makeRotationY(180 * Math.PI / 180);
      }

      bufferGeometry.applyMatrix4(rotationMatrix);
   }

   private createBufferGeometryMeshComponent(bufferGeometry: THREE.BufferGeometry, materials: THREE.Material[], frameDummy: string, frames: RwFrame[], frameIndex: number, frameParent: number) {
      // const material = new THREE.MeshNormalMaterial({ wireframe: false });
      // console.log(`Rendering`, materials, `for ${frameDummy}`);
      const mesh = new THREE.Mesh(bufferGeometry, materials);

      // Offset the geometry position based on parent frame
      let parentFrame = frameParent;
      let offset;

      while (parentFrame > -1 && parentFrame != null) {
         offset = frames[parentFrame].coordinatesOffset;
         mesh.position.x += offset.x;
         mesh.position.y += offset.y;
         mesh.position.z += offset.z;

         parentFrame = frames[parentFrame].parentFrame;
      }

      offset = frames[frameIndex].coordinatesOffset;
      mesh.position.x += offset.x;
      mesh.position.y += offset.y;
      mesh.position.z += offset.z;

      mesh.name = frameDummy;

      return mesh;
   }

   private createTextureMaterial(textureNative: RwTextureNative, material: RwMaterial) {
      const threeTexture = new THREE.DataTexture(
         Uint8Array.from(textureNative.mipmaps[0]),
         textureNative.width, textureNative.height,
         THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping
      );

      threeTexture.name = textureNative.textureName;
      threeTexture.colorSpace = THREE.SRGBColorSpace;
      threeTexture.minFilter = THREE.LinearMipMapLinearFilter;
      threeTexture.magFilter = THREE.LinearFilter;
      // threeTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      // Texture filtering
      if (textureNative.filterMode & 0x1) {
         threeTexture.magFilter = THREE.NearestFilter;
      }

      if (textureNative.filterMode & 0x2) {
         threeTexture.magFilter = THREE.LinearFilter;
      }

      if (textureNative.filterMode & 0x3) {
         threeTexture.magFilter = THREE.NearestFilter;
         threeTexture.minFilter = THREE.NearestMipMapNearestFilter;
      }

      if (textureNative.filterMode & 0x4) {
         threeTexture.magFilter = THREE.LinearFilter;
         threeTexture.minFilter = THREE.NearestMipMapLinearFilter;
      }

      if (textureNative.filterMode & 0x5) {
         threeTexture.magFilter = THREE.NearestFilter;
         threeTexture.minFilter = THREE.LinearMipMapNearestFilter;
      }

      if (textureNative.filterMode & 0x6) {
         threeTexture.magFilter = THREE.LinearFilter;
         threeTexture.minFilter = THREE.LinearMipMapLinearFilter
      }

      // Texture wrapping
      if (textureNative.uAddressing & 0x1) {
         threeTexture.wrapS = THREE.RepeatWrapping;
      } else if (textureNative.uAddressing & 0x2) {
         threeTexture.wrapS = THREE.MirroredRepeatWrapping;
      } else if (textureNative.uAddressing & 0x3) {
         threeTexture.wrapS = THREE.ClampToEdgeWrapping;
      }

      if (textureNative.vAddressing & 0x1) {
         threeTexture.wrapT = THREE.RepeatWrapping;
      } else if (textureNative.vAddressing & 0x2) {
         threeTexture.wrapT = THREE.MirroredRepeatWrapping;
      } else if (textureNative.vAddressing & 0x3) {
         threeTexture.wrapT = THREE.ClampToEdgeWrapping;
      }

      threeTexture.needsUpdate = true;

      const threeMaterial = new THREE.MeshPhysicalMaterial({
         color: new THREE.Color(material.color.r / 255, material.color.g / 255, material.color.b / 255),
         map: threeTexture,
         reflectivity: material.specular,
         aoMapIntensity: material.ambient,
      });

      threeMaterial.alphaTest = 0.5;
      threeMaterial.side = THREE.DoubleSide;
      threeMaterial.opacity = material.color.a / 255;

      if (textureNative.alpha || threeMaterial.opacity < 1) {
         threeMaterial.transparent = true;
      }

      threeMaterial.name = textureNative.textureName;

      return threeMaterial;
   }
}
