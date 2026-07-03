'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Animate3() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Inject canvas into React div
    mountRef.current.appendChild(renderer.domElement);

    // Cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
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