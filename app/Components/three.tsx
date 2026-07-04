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
    // console.log(renderer.domElement);
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
    const planeGeometry = new THREE.PlaneGeometry(10,10,10,10);
    const PlaneMaterial = new THREE.MeshPhongMaterial({
       
        side : THREE.DoubleSide,
        flatShading: true,
        vertexColors:true,
    })



    const planeMesh = new THREE.Mesh(planeGeometry,PlaneMaterial)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

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
    const {array} = planeMesh.geometry.attributes.position;
    for(let i = 0;i<array.length;i+=3){
            const x = array[i];
            const y = array[i+1];
            const z = array[i+2];
        //    console.log(array[i]);

           array[i+2] = x-Math.random();
           
    }
    const color = [];
    
    for(let i = 0;i<planeMesh.geometry.attributes.position.count;i++){
       color.push(0,0.19,0.4);
    }
    planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(color),3))
    planeGeometry.attributes.position.needsUpdate = true;
    planeGeometry.computeVertexNormals();   
    let animationId: number;
   const mouse = new THREE.Vector2();
   let previousFace: THREE.Face | null = null;
function animate() {
  animationId = requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse,camera)
  const intersect = raycaster.intersectObject(planeMesh);

  const intersects = raycaster.intersectObject(planeMesh);

if (intersects.length > 0 && intersects[0].face) {
  const face = intersects[0].face;
  const colors = planeGeometry.attributes.color as THREE.BufferAttribute;

  if (previousFace !== face) {
    previousFace = face;

    const color = {
      r: 0.1,
      g: 0.5,
      b: 1,
    };

    gsap.to(color, {
      r: 0,
      g: 0.19,
      b: 0.4,
      duration: 1,

      onUpdate: () => {
        colors.setXYZ(face.a, color.r, color.g, color.b);
        colors.setXYZ(face.b, color.r, color.g, color.b);
        colors.setXYZ(face.c, color.r, color.g, color.b);

        colors.needsUpdate = true;
      },
    });
   
  }
}
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
  <div
    ref={mountRef}
    className="w-screen h-screen"
  />
);
}