'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

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
    const planeGeometry = new THREE.PlaneGeometry(8,8,10,10);
    const PlaneMaterial = new THREE.MeshPhongMaterial({
        color : 0x00ff00,
        side : THREE.DoubleSide,
        flatShading: true
    })



    const planeMesh = new THREE.Mesh(planeGeometry,PlaneMaterial)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

     const directionalLight = new THREE.DirectionalLight(0x00ff00, 2);
      directionalLight.position.set(3, 3, 3);
     console.log(directionalLight);
     scene.add(directionalLight);
    scene.add(planeMesh);
    console.log(scene);
    console.log(planeMesh.geometry.attributes.position.array);
    const {array} = planeMesh.geometry.attributes.position;
    for(let i = 3;i<array.length;i+=3){
            const x = array[i];
            const y = array[i+1];
            const z = array[i+2];
           console.log(array[i]);

           array[i+2] = x-Math.random();
           
    }
    let animationId: number;
const mouse = new THREE.Vector2();
function animate() {
  animationId = requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse,camera)
}

animate();

addEventListener('mousemove',(event)=>{
    mouse.x = (event.clientX/innerWidth) * 2 - 1;
    mouse.y = -(event.clientY/innerHeight) * 2 + 1;

    console.log(mouse);
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
  <div
    ref={mountRef}
    className="fixed inset-0 -z-10"
  />
);
}