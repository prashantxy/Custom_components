'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Globe() {
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

    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    

    const textureLoader = new THREE.TextureLoader();

    const earthGeometry = new THREE.SphereGeometry(5, 64, 64);

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: textureLoader.load('/earth_lat.webp'),
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);

    scene.add(earth);

    

    const atmosphereGeometry = new THREE.SphereGeometry(5.2, 64, 64);

    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: {
          value: new THREE.Color(0x4da6ff),
        },
        viewVector: {
          value: camera.position,
        },
      },

      vertexShader: `
        uniform vec3 viewVector;

        varying float intensity;

        void main(){

            vec3 vNormal = normalize(normalMatrix * normal);
            vec3 vNormel = normalize(normalMatrix * viewVector);

            intensity = pow(
                0.8 - dot(vNormal,vNormel),
                5.0
            );

            gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
        }
      `,

      fragmentShader: `
        uniform vec3 glowColor;

        varying float intensity;

        void main(){

            gl_FragColor = vec4(glowColor,intensity);

        }
      `,

      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const atmosphere = new THREE.Mesh(
      atmosphereGeometry,
      atmosphereMaterial
    );

    scene.add(atmosphere);


    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const frontdirectional = new THREE.DirectionalLight(0xffffff, 3);
    frontdirectional.position.set(5, 3, 5);
     const backdirectional = new THREE.DirectionalLight(0xffffff, 3);
     backdirectional.position.set(5, 3, 5);
    scene.add(frontdirectional);
    scene.add(backdirectional);
      const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let hovered = false;
let targetX = 0;
let targetY = 0;
const onMouseMove = (event: MouseEvent) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(earth);

  hovered = intersects.length > 0;

  if (hovered) {
    targetY = mouse.x * 0.5;
    targetX = mouse.y * 0.3;
  }
};

window.addEventListener("mousemove", onMouseMove);


    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

 // -----------------------
// Stars
// -----------------------

const starCount = 10000;
const starRadius = 180;

const positions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  const x = starRadius * Math.sin(phi) * Math.cos(theta);
  const y = starRadius * Math.sin(phi) * Math.sin(theta);
  const z = starRadius * Math.cos(phi);

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
}

const starsGeometry = new THREE.BufferGeometry();

starsGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.08,
  sizeAttenuation: true,
});

const stars = new THREE.Points(
  starsGeometry,
  starsMaterial
);

scene.add(stars);
    function animate() {
      requestAnimationFrame(animate);

earth.rotation.y += 0.002;

if (hovered) {
  earth.rotation.x += (targetX - earth.rotation.x) * 0.05;

  earth.rotation.y += (targetY - earth.rotation.y) * 0.02;
}


      atmosphere.rotation.copy(earth.rotation);

      atmosphereMaterial.uniforms.viewVector.value = camera.position;

      controls.update();

    atmosphere.rotation.copy(earth.rotation);
      stars.rotation.y += 0.0001;
      stars.rotation.x += 0.00002;
      renderer.render(scene, camera);
    }

    animate();


    return () => {
      window.removeEventListener('resize', handleResize);

      controls.dispose();

      earthGeometry.dispose();
      atmosphereGeometry.dispose();

      earthMaterial.dispose();
      atmosphereMaterial.dispose();

      renderer.dispose();
      window.removeEventListener("mousemove", onMouseMove);

      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-screen h-screen bg-black"
    />
  );
}