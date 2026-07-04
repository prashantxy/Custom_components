'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Animate3() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    console.log(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color:0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    
    // scene.add(cube);
    const planeGeometry = new THREE.PlaneGeometry(5,5,10,10);
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

           array[i+2] = x+Math.random();
           
    }
    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.05;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      renderer.dispose();

      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} />;
}