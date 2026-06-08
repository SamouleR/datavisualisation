import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function CreativeThreeCanvas() {
    const mountRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // 1. Scene setup
        const scene = new THREE.Scene();
        
        // 2. Camera setup
        const width = currentMount.clientWidth || window.innerWidth;
        const height = currentMount.clientHeight || window.innerHeight;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.z = 8;

        // 3. Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        currentMount.appendChild(renderer.domElement);

        // 4. Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(5, 5, 5);
        dirLight.castShadow = true;
        scene.add(dirLight);

        const pointLight = new THREE.PointLight(0x60a5fa, 2, 20);
        pointLight.position.set(-3, -3, 3);
        scene.add(pointLight);

        // 5. Creating the 3D rotating disc with the SVG texture
        const textureLoader = new THREE.TextureLoader();
        let discMesh;
        let particles;

        textureLoader.load('/svg/Créa1.svg', (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

            // Front side material (the artwork)
            const material = new THREE.MeshPhysicalMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide,
                roughness: 0.1,
                metalness: 0.1,
                clearcoat: 0.8,
                clearcoatRoughness: 0.1,
                bumpScale: 0.05
            });

            const geometry = new THREE.CircleGeometry(2.5, 64);
            discMesh = new THREE.Mesh(geometry, material);
            discMesh.receiveShadow = true;
            discMesh.castShadow = true;
            scene.add(discMesh);

            setLoading(false);
        }, undefined, (err) => {
            console.error("Failed to load SVG texture", err);
            setLoading(false);
        });

        // 6. Particle system background
        const particleCount = 200;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 15;     // X
            positions[i + 1] = (Math.random() - 0.5) * 15; // Y
            positions[i + 2] = (Math.random() - 0.5) * 10; // Z
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x60a5fa,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // 7. Mouse interactions (tilt effect)
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const handleMouseMove = (event) => {
            mouseX = (event.clientX / window.innerWidth - 0.5) * 0.6;
            mouseY = (event.clientY / window.innerHeight - 0.5) * 0.6;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // 8. Animation loop
        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Rotate disc
            if (discMesh) {
                discMesh.rotation.z = elapsedTime * 0.08;
                
                // Tilt based on mouse
                targetX += (mouseX - targetX) * 0.05;
                targetY += (mouseY - targetY) * 0.05;
                discMesh.rotation.y = targetX;
                discMesh.rotation.x = -targetY;
            }

            // Gently animate particles
            if (particles) {
                particles.rotation.y = elapsedTime * 0.02;
                particles.rotation.x = elapsedTime * 0.01;
            }

            renderer.render(scene, camera);
        };

        animate();

        // 9. Resize handler
        const handleResize = () => {
            if (!currentMount) return;
            const w = currentMount.clientWidth;
            const h = currentMount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
            scene.clear();
        };
    }, []);

    return (
        <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'var(--text-main)',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    fontFamily: 'sans-serif'
                }}>
                    Initialisation de la scène 3D...
                </div>
            )}
        </div>
    );
}
