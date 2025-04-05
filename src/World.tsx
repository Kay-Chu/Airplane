import React from 'react';
import * as THREE from 'three';
import Cloud from './Cloud';

export default function World() {

  // Create floating obstacles in the sky
  const obstacles = [
    { position: [5, 10, -15], scale: [2, 2, 2], color: '#3498db' },
    { position: [-12, 8, 5], scale: [1.5, 1.5, 1.5], color: '#2ecc71' },
    { position: [0, 15, -20], scale: [3, 3, 3], color: '#e74c3c' },
    { position: [-8, 12, -3], scale: [1.5, 1.5, 1.5], color: '#f1c40f' },
    { position: [8, 7, 10], scale: [2, 2, 2], color: '#9b59b6' },
    { position: [15, 9, 8], scale: [1, 1, 1], color: '#1abc9c' },
    { position: [-18, 11, -12], scale: [2.5, 2.5, 2.5], color: '#e67e22' },
    { position: [20, 14, 15], scale: [3, 3, 3], color: '#34495e' },
    // Add more floating obstacles at various heights
    { position: [3, 20, -5], scale: [2, 2, 2], color: '#1abc9c' },
    { position: [-7, 18, -18], scale: [1.5, 1.5, 1.5], color: '#3498db' },
    { position: [12, 5, -8], scale: [1, 1, 1], color: '#9b59b6' },
    { position: [-15, 6, 12], scale: [2, 2, 2], color: '#f1c40f' },
  ];

  return (
    <group>
      {/* Sky floor - far below */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#4CA1AF" />
      </mesh>
      
      {/* Clouds */}
      <Cloud position={[10, 5, 0]} />
      <Cloud position={[-15, 8, -10]} scale={[2, 1, 2]} />
      <Cloud position={[0, 12, -20]} scale={[3, 1.5, 3]} />
      <Cloud position={[20, 3, 10]} scale={[2.5, 1, 2.5]} />
      <Cloud position={[-5, 15, 5]} scale={[1.5, 0.8, 1.5]} />
      
      {/* Floating obstacles */}
      {obstacles.map((props, index) => (
        <Obstacle key={index} {...props} />
      ))}
    </group>
  );
}

function Obstacle({ position, scale, color }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <boxGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}