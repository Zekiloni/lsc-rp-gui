import { ChunkType } from './chunk-types';


export enum GeometryFlag {
   rwTRISTRIP = 0x00000001,
   rwPOSITIONS = 0x00000002,
   rwTEXTURED = 0x00000004,
   rwPRELIT = 0x00000008,
   rwNORMALS = 0x00000010,
   rwLIGHT = 0x00000020,
   rwMODULATE_MATERIAL_COLOR = 0x00000040,
   rwTEXTURED2 = 0x00000080,
   rwNATIVE = 0x01000000,
   rwNATIVE_INSTANCE = 0x02000000,
   rwFLAGS_MASK = 0x000000FF,
   rwNATIVE_FLAGS_MASK = 0x0F000000
}

export class DFFReader {
   data: DataView;
   position: number;

   constructor() {
      this.data = new DataView(new ArrayBuffer(0));
      this.position = 0;
   }

   parse(arraybuffer: ArrayBuffer): any {
      this.data = new DataView(arraybuffer);
      this.position = 0;

      while (this.position < arraybuffer.byteLength) {
         const clump = this.readChunk(ChunkType.CHUNK_CLUMP);
         if (clump) return clump;
      }

      return null;
   }

   readHeader(parent?: any): any {
      const header: any = {};
      const position = this.position;

      header.type = this.readUInt32();
      header.name = this.getChunkName(header.type);
      header.length = this.readUInt32();
      header.build = this.readUInt32();
      header.version;

      if (header.build & 0xFFFF0000)
         header.version = ((header.build >> 14) & 0x3FF00) | ((header.build >> 16) & 0x3F) | 0x30000;
      else
         header.version = header.build << 8;

      if (parent !== undefined)
         header.parent = parent;

      return header;
   }

   getChunkName(type: number): string {
      const chunkNames = Object.keys(ChunkType);
      const chunkValues = Object.values(ChunkType);

      const index = chunkValues.indexOf(type);

      return index !== -1 ? chunkNames[index] : 'CHUNK_UNKNOWN';
   }

   readInt32(): number {
      const v = this.data.getInt32(this.position, true);
      this.position += 4;
      return v;
   }

   readUInt32(): number {
      const v = this.data.getUint32(this.position, true);
      this.position += 4;
      return v;
   }

   readUInt16(): number {
      const v = this.data.getUint16(this.position, true);
      this.position += 2;
      return v;
   }

   readUInt8(): number {
      const v = this.data.getUint8(this.position);
      this.position += 1;
      return v;
   }

   readFloat32(): number {
      const v = this.data.getFloat32(this.position, true);
      this.position += 4;
      return v;
   }

   readString(length: number): string {
      let v = '';
      let val = -1;
      const end = this.position + length;

      while (this.position < end) {
         const val = this.data.getUint8(this.position++);
         if (val == 0) {
            this.position = end;
            break;
         }
         v += String.fromCharCode(val);
      }

      return v.trim();
   }

   readChunk(type: ChunkType, parent?: any): any {
      const position = this.position;
      const header = this.readHeader(parent);

      if (type != header.type) {
         if (type != ChunkType.CHUNK_CLUMP) console.error('DFFLoader: Chunk "' + this.getChunkName(type) + '" not found at position ' + position);
         this.position += header.length;
         return null;
      }

      const chunk = this.readData(header);

      if (this.position < position + header.length) {
         console.warn('DFFLoader: Chunk ' + header.name + ' not read to end');
         this.position = position + header.length;
      } else if (this.position > position + header.length) {
         throw 'DFFLoader: Offset is outside the bounds of the chunk ' + header.name;
      }
      return chunk;
   }

   readData(chunkHeader: any): any {
      let data: any = null;
      switch (chunkHeader.type) {
         case ChunkType.CHUNK_CLUMP:
            const header = this.readHeader();
            const numAtomics = this.readUInt32();
            let numLights = 0;
            let numCameras = 0;

            if (header.length == 0xC) {
               numLights = this.readUInt32();
               numCameras = this.readUInt32();
            }

            data = {};
            data.RWFrameList = this.readChunk(ChunkType.CHUNK_FRAMELIST);
            data.RWGeometryList = this.readChunk(ChunkType.CHUNK_GEOMETRYLIST);

            data.RWAtomicList = new Array(numAtomics);
            for (let i = 0; i < numAtomics; i++) {
               data.RWAtomicList[i] = this.readChunk(ChunkType.CHUNK_ATOMIC);
            }

            this.readExtension(data);
            break;
         case ChunkType.CHUNK_FRAMELIST:
            const headerFrameList = this.readHeader();
            const numFrames = this.readUInt32();

            data = new Array(numFrames);
            for (let i = 0; i < numFrames; i++) {
               const frame: any = {};

               frame.rotationMatrix = [
                  this.readFloat32(),
                  this.readFloat32(),
                  this.readFloat32(),
                  this.readFloat32(),
                  this.readFloat32(),
                  this.readFloat32(),
                  this.readFloat32(),
                  this.readFloat32(),
                  this.readFloat32(),
               ];

               frame.position = [
                  this.readFloat32(),
                  this.readFloat32(),
                  this.readFloat32(),
               ];

               frame.parentIndex = this.readInt32();
               frame.flags = this.readUInt32();

               data[i] = { RWFrame: frame };
            }

            for (let i = 0; i < numFrames; i++) {
               this.readExtension(data[i]);
            }
            break;
         case ChunkType.CHUNK_GEOMETRYLIST:
            const headerGeometryList = this.readHeader();
            const numGeometries = this.readUInt32();
            data = new Array(numGeometries);
            for (let i = 0; i < numGeometries; i++) {
               data[i] = this.readChunk(ChunkType.CHUNK_GEOMETRY);
            }
            break;
         case ChunkType.CHUNK_GEOMETRY:
            const headerGeometry = this.readHeader();

            data = {};
            data.format = this.readUInt32();
            data.numTriangles = this.readUInt32();
            data.numVertices = this.readUInt32();
            data.numMorphTargets = this.readUInt32();

            let numUVs = (data.format & 0x000FF000) >> 16;
            if (data.format & GeometryFlag.rwTEXTURED) numUVs = 1;

            if (headerGeometry.version < 0x34000) {
               data.ambient = this.readFloat32();
               data.specular = this.readFloat32();
               data.diffuse = this.readFloat32();
            }

            if ((data.format & GeometryFlag.rwNATIVE) == 0) {
               if (data.format & GeometryFlag.rwPRELIT) {
                  data.prelitcolor = new Array(data.numVertices);
                  for (let i = 0; i < data.numVertices; i++) {
                     data.prelitcolor[i] = {
                        r: this.readUInt8(),
                        g: this.readUInt8(),
                        b: this.readUInt8(),
                        a: this.readUInt8(),
                     };
                  }
               }

               if (data.format & (GeometryFlag.rwTEXTURED | GeometryFlag.rwTEXTURED2)) {
                  data.texCoords = new Array(numUVs);
                  for (let i = 0; i < numUVs; i++) {
                     data.texCoords[i] = new Array(data.numVertices);
                     for (let j = 0; j < data.numVertices; j++) {
                        data.texCoords[i][j] = {
                           u: this.readFloat32(),
                           v: this.readFloat32(),
                        };
                     }
                  }
               }

               // faces
               data.triangles = new Array(data.numTriangles);
               for (let i = 0; i < data.numTriangles; i++) {
                  data.triangles[i] = {
                     vertex2: this.readUInt16(),
                     vertex1: this.readUInt16(),
                     materialId: this.readUInt16(),
                     vertex3: this.readUInt16(),
                  };
               }
            }

            data.morphTargets = new Array(data.numMorphTargets);
            for (let i = 0; i < data.numMorphTargets; i++) {
               data.morphTargets[i] = {
                  boundingSphere: {
                     x: this.readFloat32(),
                     y: this.readFloat32(),
                     z: this.readFloat32(),
                     radius: this.readFloat32(),
                  },
                  hasVertices: this.readUInt32(),
                  hasNormals: this.readUInt32(),
               };

               if (data.morphTargets[i].hasVertices) {
                  data.morphTargets[i].vertices = new Array(data.numVertices);
                  for (let j = 0; j < data.numVertices; j++) {
                     data.morphTargets[i].vertices[j] = {
                        x: this.readFloat32(),
                        y: this.readFloat32(),
                        z: this.readFloat32(),
                     };
                  }
               }

               if (data.morphTargets[i].hasNormals) {
                  data.morphTargets[i].normals = new Array(data.numVertices);
                  for (let j = 0; j < data.numVertices; j++) {
                     data.morphTargets[i].normals[j] = {
                        x: this.readFloat32(),
                        y: this.readFloat32(),
                        z: this.readFloat32(),
                     };
                  }
               }
            }

            data.RWMaterialList = this.readChunk(ChunkType.CHUNK_MATERIALLIST);
            this.readExtension(data);
            break;
         case ChunkType.CHUNK_MATERIALLIST:
            const headerMaterialList = this.readHeader();
            const numMaterials = this.readUInt32();
            data = new Array(numMaterials);

            for (let i = 0; i < numMaterials; i++) {
               data[i] = {
                  id: this.readUInt32(),
               };
            }
            for (let i = 0; i < numMaterials; i++) {
               data[i].RWMaterial = this.readChunk(ChunkType.CHUNK_MATERIAL);
            }
            break;
         case ChunkType.CHUNK_MATERIAL:
            const headerMaterial = this.readHeader();
            data = {};
            data.flags = this.readUInt32();
            data.color = {
               r: this.readUInt8(),
               g: this.readUInt8(),
               b: this.readUInt8(),
               a: this.readUInt8(),
            };
            this.readUInt32(); // unused
            data.isTextured = this.readUInt32();
            if (headerMaterial.version > 0x30400) {
               data.ambient = this.readFloat32();
               data.specular = this.readFloat32();
               data.diffuse = this.readFloat32();
            }

            if (data.isTextured)
               data.RWTexture = this.readChunk(ChunkType.CHUNK_TEXTURE);

            this.readExtension(data);
            break;
         case ChunkType.CHUNK_TEXTURE:
            const headerTexture = this.readHeader();
            data = {};
            data.filterFlags = this.readUInt16();
            this.readUInt16(); // unused
            data.name = this.readChunk(ChunkType.CHUNK_STRING);
            data.maskName = this.readChunk(ChunkType.CHUNK_STRING);
            this.readExtension(data);
            break;
         case ChunkType.CHUNK_STRING:
            data = this.readString(chunkHeader.length);
            break;
         case ChunkType.CHUNK_ATOMIC:
            const headerAtomic = this.readHeader();
            data = {};
            data.frameIndex = this.readUInt32();
            data.geometryIndex = this.readUInt32();
            data.flags = this.readUInt32();
            this.readUInt32(); // unused
            this.readExtension(data);
            break;
         case ChunkType.CHUNK_EXTENSION:
            data = {};
            const chunkEnd = this.position + chunkHeader.length;
            while (this.position < chunkEnd) {
               const header = this.readHeader();
               let extension: any = {};
               const position = this.position;
               switch (header.type) {
                  case ChunkType.CHUNK_HANIM:
                     extension.hAnimVersion = this.readUInt32();
                     extension.nodeId = this.readUInt32();
                     extension.numNodes = this.readUInt32();
                     if (extension.numNodes) {
                        extension.flags = this.readUInt32();
                        extension.keyFrameSize = this.readUInt32();
                        extension.nodes = new Array(extension.numNodes);
                        for (let i = 0; i < extension.numNodes; i++) {
                           extension.nodes[i] = {
                              nodeId: this.readUInt32(),
                              nodeIndex: this.readUInt32(),
                              flags: this.readUInt32(),
                           };
                        }
                     }
                     break;
                  case ChunkType.CHUNK_FRAME:
                     extension = this.readString(header.length);
                     break;
                  case ChunkType.CHUNK_BINMESH:
                     extension.faceType = this.readUInt32(); // index ?
                     const numSplits = this.readUInt32();
                     extension.numIndices = this.readUInt32();
                     extension.splits = new Array(numSplits);
                     const hasData = header.length > 12 + numSplits * 8;
                     for (let i = 0; i < numSplits; i++) {
                        const numIndices = this.readUInt32();
                        extension.splits[i] = {};
                        extension.splits[i].matIndex = this.readUInt32();
                        if (hasData) {
                           extension.splits[i].indices = new Array(numIndices);
                           for (let j = 0; j < numIndices; j++)
                              extension.splits[i].indices[j] = this.readUInt32();
                        }
                     }
                     break;
                  case ChunkType.CHUNK_SKIN:
                     extension.numBones = this.readUInt8();
                     extension.numUsedBones = this.readUInt8(); // specialIndexCount
                     extension.maxWeightsPerVertex = this.readUInt8();
                     extension.padding = this.readUInt8(); // unused
                     extension.bonesUsed = new Array(extension.numUsedBones); //specialIndices
                     for (let i = 0; i < extension.numUsedBones; i++) {
                        extension.bonesUsed[i] = this.readUInt8();
                     }
                     extension.vertexBoneIndices = new Array(chunkHeader.parent.numVertices);
                     for (let i = 0; i < chunkHeader.parent.numVertices; i++) {
                        extension.vertexBoneIndices[i] = {
                           x: this.readUInt8(),
                           y: this.readUInt8(),
                           z: this.readUInt8(),
                           w: this.readUInt8(),
                        };
                     }
                     extension.vertexBoneWeights = new Array(chunkHeader.parent.numVertices);
                     for (let i = 0; i < chunkHeader.parent.numVertices; i++) {
                        extension.vertexBoneWeights[i] = {
                           x: this.readFloat32(),
                           y: this.readFloat32(),
                           z: this.readFloat32(),
                           w: this.readFloat32(),
                        };
                     }
                     extension.skinToBoneMatrix = new Array(extension.numBones);
                     for (let i = 0; i < extension.numBones; i++) {
                        if (extension.numUsedBones == 0) // todo - and version < 3.7.0.0
                           this.position += 4; // skip 0xDEADDEAD
                        extension.skinToBoneMatrix[i] = new Array(16);
                        for (let j = 0; j < 16; j++) {
                           extension.skinToBoneMatrix[i][j] = this.readFloat32();
                        }
                     }
                     break;
                  default:
                     console.warn('DFFLoader: Unknown extension chunk type ' + header.type);
                     this.position = chunkEnd;
                     break;
               }
            }
            break;
         default:
            console.warn('DFFLoader: Unknown chunk type ' + chunkHeader.type);
            this.position += chunkHeader.length;
            break;
      }
      return data;
   }

   readExtension(data: any): void {
      const chunkEnd = this.position + data.length;
      while (this.position < chunkEnd) {
         const header = this.readHeader();
         let extension: any = {};
         const position = this.position;
         switch (header.type) {
            case ChunkType.CHUNK_HANIM:
               extension.hAnimVersion = this.readUInt32();
               extension.nodeId = this.readUInt32();
               extension.numNodes = this.readUInt32();
               if (extension.numNodes) {
                  extension.flags = this.readUInt32();
                  extension.keyFrameSize = this.readUInt32();
                  extension.nodes = new Array(extension.numNodes);
                  for (let i = 0; i < extension.numNodes; i++) {
                     extension.nodes[i] = {
                        nodeId: this.readUInt32(),
                        nodeIndex: this.readUInt32(),
                        flags: this.readUInt32(),
                     };
                  }
               }
               break;
            case ChunkType.CHUNK_FRAME:
               extension = this.readString(header.length);
               break;
            case ChunkType.CHUNK_BINMESH:
               extension.faceType = this.readUInt32(); // index ?
               const numSplits = this.readUInt32();
               extension.numIndices = this.readUInt32();
               extension.splits = new Array(numSplits);
               const hasData = header.length > 12 + numSplits * 8;
               for (let i = 0; i < numSplits; i++) {
                  const numIndices = this.readUInt32();
                  extension.splits[i] = {};
                  extension.splits[i].matIndex = this.readUInt32();
                  if (hasData) {
                     extension.splits[i].indices = new Array(numIndices);
                     for (let j = 0; j < numIndices; j++)
                        extension.splits[i].indices[j] = this.readUInt32();
                  }
               }
               break;
            case ChunkType.CHUNK_SKIN:
               extension.numBones = this.readUInt8();
               extension.numUsedBones = this.readUInt8(); // specialIndexCount
               extension.maxWeightsPerVertex = this.readUInt8();
               extension.padding = this.readUInt8(); // unused
               extension.bonesUsed = new Array(extension.numUsedBones); //specialIndices
               for (let i = 0; i < extension.numUsedBones; i++) {
                  extension.bonesUsed[i] = this.readUInt8();
               }
               extension.vertexBoneIndices = new Array(data.parent.numVertices);
               for (let i = 0; i < data.parent.numVertices; i++) {
                  extension.vertexBoneIndices[i] = {
                     x: this.readUInt8(),
                     y: this.readUInt8(),
                     z: this.readUInt8(),
                     w: this.readUInt8(),
                  };
               }
               extension.vertexBoneWeights = new Array(data.parent.numVertices);
               for (let i = 0; i < data.parent.numVertices; i++) {
                  extension.vertexBoneWeights[i] = {
                     x: this.readFloat32(),
                     y: this.readFloat32(),
                     z: this.readFloat32(),
                     w: this.readFloat32(),
                  };
               }
               extension.skinToBoneMatrix = new Array(extension.numBones);
               for (let i = 0; i < extension.numBones; i++) {
                  if (extension.numUsedBones == 0) // todo - and version < 3.7.0.0
                     this.position += 4; // skip 0xDEADDEAD
                  extension.skinToBoneMatrix[i] = new Array(16);
                  for (let j = 0; j < 16; j++) {
                     extension.skinToBoneMatrix[i][j] = this.readFloat32();
                  }
               }
               break;
            default:
               console.warn('DFFLoader: Unknown extension chunk type ' + header.type);
               this.position = chunkEnd;
               break;
         }
      }
   }
}

