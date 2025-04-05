import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Cloud({ position = [0, 0, 0], scale = [1, 1, 1] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create a unique hovering animation based on position
  const hoverSpeed = 0.2 + Math.random() * 0.3;
  const hoverHeight = 0.2 + Math.random() * 0.5;
  const startPhase = Math.random() * Math.PI * 2;
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle hovering motion
      groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * hoverSpeed + startPhase) * hoverHeight;
    }
  });
  
  return (
    <group ref={groupRef} position={[position[0],position[1],position[2]]} scale={[scale[0],scale[1],scale[2]]}>
      {/* Create a cluster of spheres to form a cloud */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial color="white" roughness={1} />
      </mesh>
      <mesh position={[1.2, 0.3, 0]} castShadow>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="white" roughness={1} />
      </mesh>
      <mesh position={[-1.5, 0.2, 0.3]} castShadow>
        <sphereGeometry args={[1.3, 16, 16]} />
        <meshStandardMaterial color="white" roughness={1} />
      </mesh>
      <mesh position={[0.5, 0.4, 1]} castShadow>
        <sphereGeometry args={[1.1, 16, 16]} />
        <meshStandardMaterial color="white" roughness={1} />
      </mesh>
      <mesh position={[-0.5, 0.6, -0.8]} castShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="white" roughness={1} />
      </mesh>
    </group>
  );
}