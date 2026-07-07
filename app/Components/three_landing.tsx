'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Animate3() {
  const [exploring, setExploring] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
const controlsRef = useRef<OrbitControls | null>(null);
const earthRef = useRef<THREE.Mesh | null>(null);
 
 const exploreEarth = () => {
  if (
    !cameraRef.current ||
    !controlsRef.current ||
    !earthRef.current
  )
    return;

  const camera = cameraRef.current;
  const controls = controlsRef.current;
  const earth = earthRef.current;

  gsap.to(camera.position, {
    x: earth.position.x,
    y: earth.position.y + 1,
    z: earth.position.z + 6,
    duration: 3,
    ease: "power2.inOut",
    onUpdate: () => {
      controls.update();
    },
  });

  gsap.to(controls.target, {
    x: earth.position.x,
    y: earth.position.y,
    z: earth.position.z,
    duration: 3,
    ease: "power2.inOut",
    onUpdate: () => {
      controls.update();
    },
  });

  setExploring(true);
};
  
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

cameraRef.current = camera;
    camera.position.z = 5;
   
    const renderer = new THREE.WebGLRenderer({ antialias: true,alpha: true, });
     console.log(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
controlsRef.current = controls;
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color:0x00ff00});
    // const cube = new THREE.Mesh(geometry, material);
    controls.enableDamping = true;
controls.dampingFactor = 0.05;
// Example: Limit zoom for a PerspectiveCamera
// controls.minDistance = 20;
// // controls.maxDistance = 200;


controls.enableZoom = true;
controls.enableRotate = true;
    // scene.add(cube);
    camera.position.z = 10;
    const planeGeometry = new THREE.PlaneGeometry(40,40,20,20);
    const PlaneMaterial = new THREE.MeshPhongMaterial({
       
        side : THREE.DoubleSide,
        flatShading: true,
        vertexColors:true,
    })



    const planeMesh = new THREE.Mesh(planeGeometry,PlaneMaterial)
   planeMesh.position.z = 2;
   planeMesh.rotation.x = -Math.PI / 3;
     const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(0, 0, 1);
    scene.add(frontLight);

   const backLight = new THREE.DirectionalLight(0xffffff, 1);
   backLight.position.set(0, 0, -1);
   scene.add(backLight);
    //  console.log(directionalLight);
     
     scene.add(planeMesh);

     const globeGroup = new THREE.Group();
scene.add(globeGroup);

const textureLoader = new THREE.TextureLoader();

const earthGeometry = new THREE.SphereGeometry(2, 64, 64);

const earthMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load("/earth_lat.webp"),
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earthRef.current = earth;



globeGroup.add(earth);
earth.position.set(0, 20, -50);

const atmosphereGeometry = new THREE.SphereGeometry(2.1, 64, 64);

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
});
  const nebula = new THREE.Mesh(
  new THREE.SphereGeometry(250, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0x0b3d91,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.08,
  })
);

scene.add(nebula);

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
  size: 0.1,
  transparent: true,
  opacity: 0.9,
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const stars = new THREE.Points(
  starsGeometry,
  starsMaterial
);

scene.add(stars);
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
//   console.log(position);
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
 earth.rotation.y += 0.002;

atmosphereMaterial.uniforms.viewVector.value.copy(
  camera.position
);
  controls.update();
  stars.rotation.y += 0.0001;
stars.rotation.x += 0.00002;
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
      starsGeometry.dispose();
starsMaterial.dispose();
  renderer.dispose();

  if (mountRef.current?.contains(renderer.domElement)) {
    mountRef.current.removeChild(renderer.domElement);
  }
};

  }, []);

   return (
  <div className="relative w-screen h-screen bg-black">
    <div ref={mountRef} className="absolute inset-0" />

    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      
      <button
  onClick={exploreEarth}
  className="absolute bottom-10 left-1/2 -translate-x-1/2
             px-8 py-3 rounded-full
             bg-blue-900 text-black font-semibold
             pointer-events-auto"
>
  Explore Earth
</button>
    </div>
  </div>
);
}