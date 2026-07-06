'use client'

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Globe(){

    const mountRef = useRef<HTMLDivElement>(null);


    useEffect(()=>{
     if(!mountRef.current){
        return;
     }

     const scene = new THREE.Scene();

     const camera = new THREE.PerspectiveCamera(
         75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
     );

     camera.position.z = 15;

     const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
     renderer.setSize(window.innerWidth,window.innerHeight);
     renderer.setPixelRatio(window.devicePixelRatio);
     renderer.setClearColor(0x000000,0);
     
     if(mountRef.current){
       mountRef.current.appendChild(renderer.domElement);
     }
     const controls = new OrbitControls(camera,renderer.domElement);

     const geometry = new THREE.SphereGeometry(5,20,20);
     const Material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('/earth_lat.webp')
    });
     const globe = new THREE.Mesh(geometry,Material);
     console.log(globe);
      controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.minDistance = 2;
controls.maxDistance = 10;

controls.enableZoom = true;
controls.enableRotate = true;

   scene.add(globe);
   const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

   function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();
return () => {
        controls.dispose();
        geometry.dispose();
        Material.dispose();
        renderer.dispose();

        if (mountRef.current) {
            mountRef.current.removeChild(renderer.domElement);
        }
    };
    },[]);
    return (
       <div
        ref={mountRef}
        className="bg-black w-screen h-screen"
    />
    );
}