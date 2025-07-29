import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './orb-shader';

interface NewOrbProps {
  isSpeaking?: boolean;
  isListening?: boolean;
}

const Orb: React.FC<NewOrbProps> = ({ isSpeaking, isListening }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_intensity: { value: 0.3 },
      u_isSpeaking: { value: false },
      u_isListening: { value: false },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
      materialRef.current.uniforms.u_isSpeaking.value = isSpeaking;
      materialRef.current.uniforms.u_isListening.value = isListening;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </Sphere>
  );
};

const NewOrb: React.FC<NewOrbProps> = (props) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Orb {...props} />
    </Canvas>
  );
};

export default NewOrb; 