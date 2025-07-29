import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './orb-shader';

interface NewOrbProps {
  isSpeaking?: boolean;
  isListening?: boolean;
}

const OrbMesh: React.FC<NewOrbProps> = ({ isSpeaking = false, isListening = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_intensity: { value: 0.15 }, // Reduced for stability
      u_isSpeaking: { value: false },
      u_isListening: { value: false },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      // Smooth time progression
      materialRef.current.uniforms.u_time.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.u_isSpeaking.value = isSpeaking;
      materialRef.current.uniforms.u_isListening.value = isListening;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={false}
        side={THREE.FrontSide}
      />
    </mesh>
  );
};

const NewOrb: React.FC<NewOrbProps> = (props) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <Canvas
        camera={{ 
          position: [0, 0, 3.5], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'transparent'
        }}
        gl={{ 
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        {/* Optimized lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 2, 5]} intensity={0.6} />
        <pointLight position={[-2, -2, -5]} intensity={0.3} />
        
        <OrbMesh {...props} />
      </Canvas>
    </div>
  );
};

export default NewOrb; 