// https://github.com/andrewixz/DFFLoader & TextureDictionary

// @ts-nocheck
import * as THREE from 'three';
import DFFReader from './dff-reader';
import { TextureDictionary } from './util/txd';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';

export const DFFLoader: any = function(manager) {
   this.manager = manager || THREE.DefaultLoadingManager;
   this.textures = {};
};

DFFLoader.prototype = {
   constructor: DFFLoader,

   load: async function(url: string, onLoad, onProgress, onError) {
      const self = this;

      const loader = new THREE.FileLoader(this.manager);
      loader.setResponseType('arraybuffer');

      if (this.path !== undefined) loader.setPath(this.path);

      const txd = await TextureDictionary.load(url.replace('.dff', '.txd'));

      await Promise.all(
         txd.textures.map(async (texture) => {
            texture.decompressDxt();
            texture.convertTo32Bit();
            const url = URL.createObjectURL(new Blob([texture.tga()]));
            const tgaTexture = await new TGALoader().loadAsync(url);
            URL.revokeObjectURL(url);
            this.textures[texture.name] = tgaTexture;
            this.textures[texture.maskName] = tgaTexture;
         }),
      );

      loader.load(
         url,
         function(file) {
            onLoad(self.read(file));
         },
         onProgress,
         onError,
      );
   },

   setPath: function(value) {
      this.path = value;
      return this;
   },

   read: function(arraybuffer) {
      const reader = new DFFReader();
      const group = new THREE.Group();
      const clump = reader.parse(arraybuffer);
      const model = {};
      const meshes = [];

      clump.RWGeometryList.forEach(function(rwGeometry) {
         const geometry = new THREE.BufferGeometry();

         const triangleGroups = [];
         rwGeometry.triangles.forEach(function(triangle) {
            if (triangleGroups[triangle.materialId] === undefined)
               triangleGroups[triangle.materialId] = [];
            triangleGroups[triangle.materialId].push([
               triangle.vertex1,
               triangle.vertex2,
               triangle.vertex3,
            ]);
         });

         const triangleCount = Object.keys(triangleGroups).reduce(
            (sum, key) => sum + triangleGroups[key].length,
            0,
         );

         const positionBuffer = new THREE.BufferAttribute(
            new Float32Array(triangleCount * 3 * 3),
            3,
         );
         const normalBuffer =
            rwGeometry.morphTargets[0].hasNormals &&
            new THREE.BufferAttribute(
               new Float32Array(triangleCount * 3 * 3),
               3,
               true,
            );
         const colorBuffer =
            rwGeometry.prelitcolor &&
            new THREE.BufferAttribute(
               new Uint8Array(triangleCount * 3 * 3),
               3,
               true,
            );
         const uvBuffer =
            rwGeometry.texCoords &&
            new THREE.BufferAttribute(
               new Float32Array(triangleCount * 3 * 2),
               2,
               true,
            );

         let vertexPos = 0;
         const newVertexIndices = {};
         for (const materialIndex of Object.keys(triangleGroups)) {
            const faces = triangleGroups[materialIndex];
            geometry.addGroup(vertexPos, faces.length * 3, Number(materialIndex));
            for (const indices of faces) {
               for (const index of indices) {
                  const vertex = rwGeometry.morphTargets[0].vertices[index];
                  positionBuffer.setXYZ(vertexPos, vertex.x, vertex.y, vertex.z);
                  newVertexIndices[index] = newVertexIndices[index] || [];
                  newVertexIndices[index].push(vertexPos);
                  if (normalBuffer) {
                     const normal = rwGeometry.morphTargets[0].normals[index];
                     normalBuffer.setXYZ(vertexPos, normal.x, normal.y, normal.z);
                  }
                  if (uvBuffer) {
                     const uv = rwGeometry.texCoords[0][index];
                     uvBuffer.setXY(vertexPos, uv.u, 1 - uv.v);
                  }
                  if (colorBuffer) {
                     throw 'DFFLoader: Not implemented';
                     // todo
                     //const color = parseInt(rwGeometry.prelitcolor[index], 16);
                     //colorBuffer.setXYZ(vertexPos,
                     //    Math.min(((color & 0xFF0000) >> 8 * 2) * ColorCoefficent, 255),
                     //    Math.min(((color & 0x00FF00) >> 8 * 1) * ColorCoefficent, 255),
                     //    Math.min(((color & 0x0000FF) >> 8 * 0) * ColorCoefficent, 255),
                     //);
                  }
                  vertexPos += 1;
               }
            }
         }

         geometry.dynamic = false;
         geometry.addAttribute('position', positionBuffer);

         if (normalBuffer) geometry.addAttribute('normal', normalBuffer, true);
         else geometry.computeFaceNormals();

         if (colorBuffer) geometry.addAttribute('color', colorBuffer, true);

         if (uvBuffer) geometry.addAttribute('uv', uvBuffer);

         geometry.computeBoundingSphere();

         const materials = rwGeometry.RWMaterialList.map(function(material) {
            const result = new THREE.MeshStandardMaterial({
               vertexColors: colorBuffer ? THREE.VertexColors : THREE.NoColors,
               roughness: material.RWMaterial.diffuse,
            });

            if (material.RWMaterial.isTextured) {
               if (material.RWMaterial.RWTexture.name) {
                  const texture = this.textures[material.RWMaterial.RWTexture.name];
                  if (texture) {
                     result.map = texture;
                     material.needsUpdate = true;
                     result.map.wrapS = THREE.RepeatWrapping;
                     result.map.wrapT = THREE.RepeatWrapping;
                  }
               }

               if (material.RWMaterial.RWTexture.maskName) {
                  result.alphaMap =
                     this.textures[material.RWMaterial.RWTexture.maskName] ??
                     this.textures[material.RWMaterial.RWTexture.name];
                  result.needsUpdate = true;
                  result.alphaMap.wrapS = THREE.RepeatWrapping;
                  result.alphaMap.wrapT = THREE.RepeatWrapping;
                  result.transparent = true;
                  result.alphaTest = 0.05;
               }
            }
            return result;
         }, this);

         if (rwGeometry.RWExtension.CHUNK_SKIN) {
            const skinExtension = rwGeometry.RWExtension.CHUNK_SKIN;

            const indicesBuffer = new THREE.Float32BufferAttribute(
               positionBuffer.count * 4,
               4,
            );
            const weightsBuffer = new THREE.Float32BufferAttribute(
               positionBuffer.count * 4,
               4,
            );

            for (let index = 0; index < rwGeometry.numVertices; index++) {
               newVertexIndices[index].forEach(function(newIndex) {
                  indicesBuffer.setXYZW(
                     newIndex,
                     skinExtension.vertexBoneIndices[index].x,
                     skinExtension.vertexBoneIndices[index].y,
                     skinExtension.vertexBoneIndices[index].z,
                     skinExtension.vertexBoneIndices[index].w,
                  );
                  weightsBuffer.setXYZW(
                     newIndex,
                     skinExtension.vertexBoneWeights[index].x,
                     skinExtension.vertexBoneWeights[index].y,
                     skinExtension.vertexBoneWeights[index].z,
                     skinExtension.vertexBoneWeights[index].w,
                  );
               });
            }

            geometry.addAttribute('skinIndex', indicesBuffer);
            geometry.addAttribute('skinWeight', weightsBuffer);
         }

         meshes.push({ geometry: geometry, materials: materials });
      }, this);

      clump.RWAtomicList.forEach(function(atomic) {
         const geometry = meshes[atomic.geometryIndex].geometry;
         const materials = meshes[atomic.geometryIndex].materials;

         const nodelist = new Array(clump.RWFrameList.length);
         let nodeInfo = null;
         let parentNode = null;

         clump.RWFrameList.forEach(function(frame, i) {
            const rwFrame = frame.RWFrame;
            const bone = new THREE.Bone();
            bone.name = frame.RWExtension.CHUNK_FRAME;
            const transform = new THREE.Matrix4();

            transform.set(
               rwFrame.rotationMatrix[0],
               rwFrame.rotationMatrix[3],
               rwFrame.rotationMatrix[6],
               rwFrame.position[0],
               rwFrame.rotationMatrix[1],
               rwFrame.rotationMatrix[4],
               rwFrame.rotationMatrix[7],
               rwFrame.position[1],
               rwFrame.rotationMatrix[2],
               rwFrame.rotationMatrix[5],
               rwFrame.rotationMatrix[8],
               rwFrame.position[2],
               0,
               0,
               0,
               1,
            );

            bone.applyMatrix(transform);

            if (rwFrame.parentIndex >= 0) nodelist[rwFrame.parentIndex].add(bone);

            const hAnim = frame.RWExtension.CHUNK_HANIM;
            if (hAnim) {
               bone.nodeId = hAnim.nodeId;
               bone.nodeIndex = i;
               if (hAnim.numNodes > 0) {
                  parentNode = bone;
                  nodeInfo = hAnim.nodes.map(function(node, idx) {
                     return {
                        id: node.nodeId,
                        index: idx,
                        flags: node.flags,
                        frame: null,
                     };
                  });
               }
            }

            nodelist[i] = bone;
         });

         if (nodeInfo) {
            const bones = new Array(nodeInfo.length);

            function findUnattachedById(node, id) {
               if (!node) return null;
               if (node.nodeId >= 0 && node.nodeId == id && getIndex(node) == -1)
                  return node;
               return (
                  findUnattachedById(node.children[0], id) ||
                  findUnattachedById(nodelist[node.nodeIndex + 1], id)
               );
            }

            function getIndex(node) {
               for (let i = 0; i < nodeInfo.length; i++) {
                  if (nodeInfo[i].node == node) return i;
               }
               return -1;
            }

            // attach by index
            for (let i = 0; i < nodeInfo.length; i++) {
               nodeInfo[i].node = findUnattachedById(parentNode, nodeInfo[i].id);
               bones[i] = nodeInfo[i].node;
            }
            meshes[atomic.geometryIndex].skeleton = new THREE.Skeleton(bones);
         }
      });

      meshes.forEach(function(meshData) {
         let mesh;
         if (meshData.skeleton) {
            meshData.materials.forEach(function(material) {
               material.skinning = true;
            });
            mesh = new THREE.SkinnedMesh(meshData.geometry, meshData.materials);
            mesh.add(meshData.skeleton.bones[0]);
            mesh.bind(meshData.skeleton);
         } else {
            mesh = new THREE.Mesh(meshData.geometry, meshData.materials);
         }
         mesh.rotation.set(0, Math.PI, Math.PI / 2);
         group.add(mesh);
      });
      return group;
   },
};