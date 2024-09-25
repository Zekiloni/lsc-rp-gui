// import * as THREE from 'three';
// import { DFFReader } from './dff-reader.util';
//
// interface Triangle {
//    materialId: number;
//    vertex1: number;
//    vertex2: number;
//    vertex3: number;
// }
//
// interface RWGeometry {
//    triangles: Triangle[];
//    morphTargets: {
//       hasNormals: boolean;
//       vertices: THREE.Vector3[];
//       normals: THREE.Vector3[];
//    }[];
//    prelitcolor: any;
//    texCoords: any[][];
// }
//
// interface RWMaterial {
//    RWMaterial: {
//       diffuse: number;
//       isTextured: boolean;
//       RWTexture: {
//          name: string;
//          maskName: string;
//       };
//    };
// }
//
// interface Clump {
//    RWGeometryList: RWGeometry[];
//    RWMaterialList: RWMaterial[];
//    RWAtomicList: any[];
//    RWFrameList: any[];
//    RWExtension: {
//       CHUNK_SKIN?: any;
//       CHUNK_HANIM?: any;
//       CHUNK_FRAME?: any;
//    };
// }
// export class DFFLoader {
//    private readonly manager: THREE.LoadingManager;
//    private path?: string;
//
//    constructor(manager?: THREE.LoadingManager) {
//       this.manager = manager || THREE.DefaultLoadingManager;
//    }
//
//    load(url: string, onLoad: (group: THREE.Group) => void, onProgress?: (event: ProgressEvent) => void, onError?: (err: unknown) => void): void {
//       const self = this;
//       const loader = new THREE.FileLoader(this.manager);
//       loader.setResponseType('arraybuffer');
//
//       if (this.path !== undefined) {
//          loader.setPath(this.path);
//       }
//
//       loader.load(url, function (file: string | ArrayBuffer) {
//          if (file instanceof ArrayBuffer) {
//             onLoad(self.read(file));
//          } else {
//             console.error("Expected ArrayBuffer but received a string");
//          }
//       }, onProgress, onError); // Update the type of onError here
//    }
//
//    setPath(value: string): this {
//       this.path = value;
//       return this;
//    }
//
//    private read(arraybuffer: ArrayBuffer): THREE.Group {
//       const reader = new DFFReader();
//       const group = new THREE.Group();
//       const clump = reader.parse(arraybuffer);
//       const model: any = {};
//       const meshes: { geometry: THREE.BufferGeometry; materials: THREE.Material[]; skeleton?: THREE.Skeleton }[] = [];
//
//       clump.RWGeometryList.forEach((rwGeometry: any) => {
//          const geometry = new THREE.BufferGeometry();
//
//          const triangleGroups: { [key: number]: number[][] } = {};
//          rwGeometry.triangles.forEach((triangle: Triangle) => {
//             if (triangleGroups[triangle.materialId] === undefined) {
//                triangleGroups[triangle.materialId] = [];
//             }
//             triangleGroups[triangle.materialId].push([triangle.vertex1, triangle.vertex2, triangle.vertex3]);
//          });
//
//          const triangleCount = Object.keys(triangleGroups).reduce((sum, key) => (
//             sum + triangleGroups[key].length
//          ), 0);
//
//          const positionBuffer = new THREE.BufferAttribute(
//             new Float32Array(triangleCount * 3 * 3), 3
//          );
//          const normalBuffer = rwGeometry.morphTargets[0].hasNormals ? new THREE.BufferAttribute(
//             new Float32Array(triangleCount * 3 * 3), 3, true
//          ) : undefined;
//          const colorBuffer = rwGeometry.prelitcolor ? new THREE.BufferAttribute(
//             new Uint8Array(triangleCount * 3 * 3), 3, true
//          ) : undefined;
//          const uvBuffer = rwGeometry.texCoords ? new THREE.BufferAttribute(
//             new Float32Array(triangleCount * 3 * 2), 2, true
//          ) : undefined;
//
//          let vertexPos = 0;
//          const newVertexIndices: { [key: number]: number[] } = {};
//          for (const materialIndex of Object.keys(triangleGroups)) {
//             const faces = triangleGroups[materialIndex];
//             geometry.addGroup(vertexPos, faces.length * 3, Number(materialIndex));
//             for (const indices of faces) {
//                for (const index of indices) {
//                   const vertex = rwGeometry.morphTargets[0].vertices[index];
//                   positionBuffer.setXYZ(vertexPos, vertex.x, vertex.y, vertex.z);
//                   newVertexIndices[index] = newVertexIndices[index] || [];
//                   newVertexIndices[index].push(vertexPos);
//                   if (normalBuffer) {
//                      const normal = rwGeometry.morphTargets[0].normals[index];
//                      normalBuffer.setXYZ(vertexPos, normal.x, normal.y, normal.z);
//                   }
//                   if (uvBuffer) {
//                      const uv = rwGeometry.texCoords[0][index];
//                      uvBuffer.setXY(vertexPos, uv.u, 1 - uv.v);
//                   }
//                   if (colorBuffer) {
//                      throw "DFFLoader: Not implemented";
//                   }
//                   vertexPos += 1;
//                }
//             }
//          }
//
//          geometry.dynamic = false;
//          geometry.setAttribute('position', positionBuffer);
//
//          if (normalBuffer) {
//             geometry.setAttribute('normal', normalBuffer, true);
//          } else {
//             geometry.computeFaceNormals();
//          }
//
//          if (colorBuffer) {
//             geometry.setAttribute('color', colorBuffer, true);
//          }
//
//          if (uvBuffer) {
//             geometry.setAttribute('uv', uvBuffer);
//          }
//
//          geometry.computeBoundingSphere();
//
//          const materials = rwGeometry.RWMaterialList.map((material: any) => {
//             const result = new THREE.MeshStandardMaterial({
//                vertexColors: colorBuffer ? THREE.VertexColors : THREE.NoColors,
//                roughness: material.RWMaterial.diffuse
//             });
//
//             if (material.RWMaterial.isTextured) {
//                const loader = new THREE.TextureLoader();
//
//                if (this.path) {
//                   loader.setPath(this.path);
//                }
//
//                if (material.RWMaterial.RWTexture.name) {
//                   result.map = loader.load(material.RWMaterial.RWTexture.name + ".png", () => {
//                      material.needsUpdate = true;
//                   });
//                   result.map.wrapS = THREE.RepeatWrapping;
//                   result.map.wrapT = THREE.RepeatWrapping;
//                }
//
//                if (material.RWMaterial.RWTexture.maskName) {
//                   result.alphaMap = loader.load(material.RWMaterial.RWTexture.maskName + ".png", () => {
//                      result.needsUpdate = true;
//                   });
//                   result.alphaMap.wrapS = THREE.RepeatWrapping;
//                   result.alphaMap.wrapT = THREE.RepeatWrapping;
//                   result.transparent = true;
//                   result.alphaTest = 0.05;
//                }
//             }
//             return result;
//          });
//
//          if (rwGeometry.RWExtension.CHUNK_SKIN) {
//             const skinExtension = rwGeometry.RWExtension.CHUNK_SKIN;
//
//             const indicesBuffer = new THREE.Float32BufferAttribute(positionBuffer.count * 4, 4);
//             const weightsBuffer = new THREE.Float32BufferAttribute(positionBuffer.count * 4, 4);
//
//             for (let index = 0; index < rwGeometry.numVertices; index++) {
//                newVertexIndices[index].forEach((newIndex) => {
//                   indicesBuffer.setXYZW(newIndex,
//                      skinExtension.vertexBoneIndices[index].x,
//                      skinExtension.vertexBoneIndices[index].y,
//                      skinExtension.vertexBoneIndices[index].z,
//                      skinExtension.vertexBoneIndices[index].w
//                   );
//                   weightsBuffer.setXYZW(newIndex,
//                      skinExtension.vertexBoneWeights[index].x,
//                      skinExtension.vertexBoneWeights[index].y,
//                      skinExtension.vertexBoneWeights[index].z,
//                      skinExtension.vertexBoneWeights[index].w
//                   );
//                });
//             }
//
//             geometry.setAttribute('skinIndex', indicesBuffer);
//             geometry.setAttribute('skinWeight', weightsBuffer);
//          }
//
//          meshes.push({ geometry: geometry, materials: materials });
//       });
//
//       clump.RWAtomicList.forEach((atomic: any) => {
//          const geometry = meshes[atomic.geometryIndex].geometry;
//          const materials = meshes[atomic.geometryIndex].materials;
//
//          const nodelist: THREE.Bone[] = new Array(clump.RWFrameList.length);
//          let nodeInfo: any = null;
//          let parentNode: THREE.Bone | null = null;
//
//          clump.RWFrameList.forEach((frame: any, i: number) => {
//             const rwFrame = frame.RWFrame;
//             const bone = new THREE.Bone();
//             bone.name = frame.RWExtension.CHUNK_FRAME;
//             const transform = new THREE.Matrix4();
//
//             transform.set(
//                rwFrame.rotationMatrix[0], rwFrame.rotationMatrix[3], rwFrame.rotationMatrix[6], rwFrame.position[0],
//                rwFrame.rotationMatrix[1], rwFrame.rotationMatrix[4], rwFrame.rotationMatrix[7], rwFrame.position[1],
//                rwFrame.rotationMatrix[2], rwFrame.rotationMatrix[5], rwFrame.rotationMatrix[8], rwFrame.position[2],
//                0, 0, 0, 1
//             );
//
//             bone.applyMatrix4(transform);
//
//             if (rwFrame.parentIndex >= 0) {
//                nodelist[rwFrame.parentIndex].add(bone);
//             }
//
//             const hAnim = frame.RWExtension.CHUNK_HANIM;
//             if (hAnim) {
//                bone.nodeId = hAnim.nodeId;
//                bone.nodeIndex = i;
//                if (hAnim.numNodes > 0) {
//                   parentNode = bone;
//                   nodeInfo = hAnim.nodes.map((node: any, idx: number) => {
//                      return {
//                         id: node.nodeId,
//                         index: idx,
//                         flags: node.flags,
//                         frame: null
//                      };
//                   });
//                }
//             }
//
//             nodelist[i] = bone;
//          });
//
//          if (nodeInfo) {
//             const bones: THREE.Bone[] = new Array(nodeInfo.length);
//             function findUnattachedById(node: THREE.Bone | null, id: number): THREE.Bone | null {
//                if (!node) return null;
//                if (node.nodeId >= 0 && node.nodeId === id && getIndex(node) === -1) return node;
//                return findUnattachedById(node.children[0] as THREE.Bone, id) || findUnattachedById(nodelist[node.nodeIndex + 1], id);
//             }
//             function getIndex(node: THREE.Bone): number {
//                for (let i = 0; i < nodeInfo.length; i++) {
//                   if (nodeInfo[i].node === node) return i;
//                }
//                return -1;
//             }
//             // attach by index
//             for (let i = 0; i < nodeInfo.length; i++) {
//                nodeInfo[i].node = findUnattachedById(parentNode, nodeInfo[i].id);
//                bones[i] = nodeInfo[i].node;
//             }
//             meshes[atomic.geometryIndex].skeleton = new THREE.Skeleton(bones);
//          }
//       });
//
//       meshes.forEach((meshData) => {
//          let mesh: THREE.Mesh | THREE.SkinnedMesh;
//          if (meshData.skeleton) {
//             meshData.materials.forEach((material) => {
//                material.skinning = true;
//             });
//             mesh = new THREE.SkinnedMesh(meshData.geometry, meshData.materials);
//             mesh.add(meshData.skeleton.bones[0]);
//             mesh.bind(meshData.skeleton);
//          } else {
//             mesh = new THREE.Mesh(meshData.geometry, meshData.materials);
//          }
//          mesh.rotation.set(0, Math.PI, Math.PI / 2);
//          group.add(mesh);
//       });
//
//       console.log(clump);
//       return group;
//    }
// }
//
