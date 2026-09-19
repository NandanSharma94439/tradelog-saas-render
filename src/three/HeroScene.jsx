import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const HeroScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Creating an abstract financial "data line" / wave
    const points = [];
    for (let i = 0; i < 100; i++) {
      points.push(new THREE.Vector3((i - 50) * 0.2, Math.sin(i * 0.2) + Math.sin(i * 0.05) * 2, 0));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: 0x6366f1, // brand-500
      linewidth: 2,
      transparent: true,
      opacity: 0.8
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    // Add some floating "data points"
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x10b981, // emerald-500
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Update line vertices for wave effect
      const positions = line.geometry.attributes.position.array;
      const time = Date.now() * 0.001;
      
      for(let i = 0; i < 100; i++) {
        positions[i*3 + 1] = Math.sin(i * 0.2 + time * 2) + Math.sin(i * 0.05 + time * 0.5) * 2;
      }
      line.geometry.attributes.position.needsUpdate = true;

      // Parallax effect on particles
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.001;
      
      // Camera follows mouse slightly
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(animationFrameId);
      
      // Cleanup Three.js resources
      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
    />
  );
};
