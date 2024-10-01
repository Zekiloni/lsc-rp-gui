import * as THREE from 'three';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { loadSkinModel } from '../../core/util/skin-viewport';

@Component({
   selector: 'app-skin-preview',
   standalone: true,
   imports: [],
   templateUrl: './skin-preview.component.html',
   styleUrl: './skin-preview.component.scss',
})
export class SkinPreviewComponent implements AfterViewInit, OnDestroy {
   @Input() skinId!: number;
   @ViewChild('viewport', { static: true }) viewportRef!: ElementRef;
   private scene!: THREE.Scene;
   private camera!: THREE.PerspectiveCamera;
   private renderer!: THREE.WebGLRenderer;
   private controls!: OrbitControls;
   private model!: THREE.Object3D;
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

   private load(): void {
      loadSkinModel(this.skinId).then((mesh) => {
         this.model = mesh;
         this.scene.add(this.model);
      });
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
   }

   private onResize(): void {
      const width = this.viewportRef.nativeElement.clientWidth;
      const height = this.viewportRef.nativeElement.clientHeight;

      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
   }
}
