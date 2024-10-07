import * as THREE from 'three';
import { Buffer } from 'buffer';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RwModel } from '../../core/util/rw-model';

@Component({
   selector: 'app-skin-preview',
   standalone: true,
   imports: [],
   templateUrl: './skin-preview.component.html',
   styleUrl: './skin-preview.component.scss',
})
export class SkinPreviewComponent implements AfterViewInit, OnDestroy {
   @Input() skinId!: string;
   @ViewChild('viewport', { static: true }) viewportRef!: ElementRef;
   private scene!: THREE.Scene;
   private camera!: THREE.PerspectiveCamera;
   private renderer!: THREE.WebGLRenderer;
   private controls!: OrbitControls;
   private model!: THREE.Object3D | null;
   private frameId!: number;

   ngAfterViewInit(): void {
      this.setup();
      this.load();
      this.animate();
      window.addEventListener('resize', this.onResize.bind(this));
   }

   ngOnDestroy(): void {
      this.cleanup();
      window.removeEventListener('resize', this.onResize.bind(this));
   }

   private setup(): void {
      const width = this.viewportRef.nativeElement.clientWidth;
      const height = this.viewportRef.nativeElement.clientHeight;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      this.camera.position.z = 2;

      this.renderer = new THREE.WebGLRenderer({
         alpha: true,
         antialias: true,
      });

      this.renderer.setSize(width, height);
      this.scene.add(new THREE.AmbientLight());

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enablePan = false;

      this.viewportRef.nativeElement.appendChild(this.renderer.domElement);
   }

   private async load() {
      const dffResource = (await fetch(`../assets/models/skins/${this.skinId}.dff`)).arrayBuffer();
      const txdResource = (await fetch(`../assets/models/skins/${this.skinId}.txd`)).arrayBuffer();

      // Remove existing model from the scene if it exists
      if (this.model) {
         this.scene.remove(this.model);
      }

      const rwModel = new RwModel();
      await rwModel.loadModelFromBuffer(Buffer.from(await dffResource))
      await rwModel.loadTextureFromArrayBuffer(txdResource);
      const modelMesh = await rwModel.create();

      modelMesh.position.set(0, 0, 0);
      modelMesh.rotation.set(90 * (Math.PI / 180), 0, 90 * (Math.PI / 180), 'ZXY');
      this.scene.add(modelMesh);

      const ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
      const spotLight = new THREE.SpotLight(0xFFFFFF, 3);
      spotLight.position.set(-10, 5, -10);
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;
      spotLight.shadow.camera.near = 500;
      spotLight.shadow.camera.far = 4000;
      spotLight.shadow.camera.fov = 30;

      this.scene.add(ambientLight);
      this.scene.add(spotLight)

      this.camera.position.set(0, 0, this.camera.position.z)
      this.camera.fov = 60;
      this.camera.updateProjectionMatrix();
   }

   private animate(): void {
      this.renderer.render(this.scene, this.camera);
      this.frameId = requestAnimationFrame(() => this.animate());
   }

   private cleanup(): void {
      if (this.renderer && this.frameId) {
         this.viewportRef.nativeElement.removeChild(this.renderer.domElement);
         cancelAnimationFrame(this.frameId);
      }

      if (this.model) {
         this.scene.remove(this.model);
      }
   }

   private onResize(): void {
      const width = this.viewportRef.nativeElement.clientWidth;
      const height = this.viewportRef.nativeElement.clientHeight;

      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
   }
}