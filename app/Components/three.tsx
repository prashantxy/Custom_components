'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Animate3() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const raycaster = new THREE.Raycaster()
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true,alpha: true, });
     console.log(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera,renderer.domElement);
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color:0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enableRotate = true;
    // scene.add(cube);
    camera.position.z = 10;
    const planeGeometry = new THREE.PlaneGeometry(34,34,17,17);
    const PlaneMaterial = new THREE.MeshPhongMaterial({
       
        side : THREE.DoubleSide,
        flatShading: true,
        vertexColors:true,
    })



    const planeMesh = new THREE.Mesh(planeGeometry,PlaneMaterial)
   
     const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(0, 0, 1);
    scene.add(frontLight);

   const backLight = new THREE.DirectionalLight(0xffffff, 1);
   backLight.position.set(0, 0, -1);
   scene.add(backLight);
    //  console.log(directionalLight);
     
     scene.add(planeMesh);
    // console.log(scene);
    // console.log(planeMesh.geometry.attributes.position.array);
  const position = planeGeometry.attributes.position as THREE.BufferAttribute;
const vertices = position.array as Float32Array;


for (let i = 0; i < vertices.length; i += 3) {
  vertices[i] += (Math.random() - 0.5) * 2;
  vertices[i + 1] += (Math.random() - 0.5);
  vertices[i + 2] += Math.random();
}

// Save original positions
const originalPosition = Float32Array.from(vertices);

// Create vertex colors
const colors: number[] = [];

for (let i = 0; i < position.count; i++) {
  colors.push(0, 0.19, 0.4);
}

planeGeometry.setAttribute(
  "color",
  new THREE.Float32BufferAttribute(colors, 3)
);

position.needsUpdate = true;
planeGeometry.computeVertexNormals();  
    let animationId: number;
   const mouse = new THREE.Vector2();
   let previousFace: THREE.Face | null = null;

   let frame = 0;

function animate() {
  animationId = requestAnimationFrame(animate);

  frame += 0.01;

  const position = planeGeometry.attributes.position as THREE.BufferAttribute;
  console.log(position);
  const vertices = position.array as Float32Array;

  for (let i = 0; i < vertices.length; i += 3) {
    vertices[i] =
      originalPosition[i] +
      Math.cos(frame + i * 0.1) * 0.05;

    vertices[i + 1] =
      originalPosition[i + 1] +
      Math.sin(frame + i * 0.1) * 0.10;
  }

  position.needsUpdate = true;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(planeMesh);

  if (intersects.length > 0 && intersects[0].face) {
    const face = intersects[0].face;
    const colors = planeGeometry.attributes.color as THREE.BufferAttribute;

    if (previousFace !== face) {
      previousFace = face;

      const hoverColor = {
        r: 0.1,
        g: 0.5,
        b: 1,
      };

      gsap.to(hoverColor, {
        r: 0,
        g: 0.19,
        b: 0.4,
        duration: 1,

        onUpdate: () => {
          colors.setXYZ(face.a, hoverColor.r, hoverColor.g, hoverColor.b);
          colors.setXYZ(face.b, hoverColor.r, hoverColor.g, hoverColor.b);
          colors.setXYZ(face.c, hoverColor.r, hoverColor.g, hoverColor.b);

          colors.needsUpdate = true;
        },
      });
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

addEventListener('mousemove',(event)=>{
    mouse.x = (event.clientX/innerWidth) * 2 - 1;
    mouse.y = -(event.clientY/innerHeight) * 2 + 1;

})



return () => {
  cancelAnimationFrame(animationId);
   controls.dispose();
  renderer.dispose();

  if (mountRef.current?.contains(renderer.domElement)) {
    mountRef.current.removeChild(renderer.domElement);
  }
};

  }, []);

  return (
  <div className="relative w-screen h-screen">
    <div ref={mountRef} className="absolute inset-0" />

    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <h1 className="text-white text-7xl font-bold">
        HELLO
      </h1>
    </div>
  </div>
);
}