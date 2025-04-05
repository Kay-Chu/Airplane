import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

export default function Player() {
  const playerRef = useRef<THREE.Group>(null);
  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(0, 5, 10));
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());
  
  // Get keyboard controls state
  const [, get] = useKeyboardControls();
  
  useFrame((state, delta) => {
    if (!playerRef.current) return;
    
    const { forward, backward, left, right, ascend, descend } = get();
    
    // Calculate movement direction
    const moveX = (right ? 1 : 0) - (left ? 1 : 0);
    const moveZ = (backward ? 1 : 0) - (forward ? 1 : 0);
    const moveY = (ascend ? 1 : 0) - (descend ? 1 : 0);
    
    // Move the player with flying physics
    const moveSpeed = 8 * delta;
    const verticalSpeed = 6 * delta;
    
    // Apply movement
    playerRef.current.position.x += moveX * moveSpeed;
    playerRef.current.position.z += moveZ * moveSpeed;
    playerRef.current.position.y += moveY * verticalSpeed;
    
    // Add slight bobbing motion when flying
    playerRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.02;
    
    // Calculate flying direction vector
    const direction = new THREE.Vector3(
      moveX,
      moveY * 0.5, // Reduce vertical impact on forward direction
      moveZ
    ).normalize();
    
    // Smooth camera follow - positioned behind and slightly above the player
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(playerRef.current.position);
    cameraPosition.y += 3;
    cameraPosition.z += 7;
    
    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(playerRef.current.position);
    // Look slightly ahead in the direction of movement
    if (moveX !== 0 || moveZ !== 0) {
      cameraTarget.x += moveX * 2;
      cameraTarget.z += moveZ * 2;
    }
    
    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);
    
    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);
    
    // Rotate in the movement direction with banking effects
    if (moveX !== 0 || moveZ !== 0) {
      const angle = Math.atan2(moveX, moveZ);
      playerRef.current.rotation.y = THREE.MathUtils.lerp(
        playerRef.current.rotation.y,
        angle,
        5 * delta
      );
      
      // Bank the cube when turning (roll effect)
      playerRef.current.rotation.z = THREE.MathUtils.lerp(
        playerRef.current.rotation.z,
        -moveX * 0.3, // Bank proportional to turn sharpness
        3 * delta
      );
    } else {
      // Return to level when not turning
      playerRef.current.rotation.z = THREE.MathUtils.lerp(
        playerRef.current.rotation.z,
        0,
        2 * delta
      );
    }
    
    // Pitch up/down slightly based on vertical movement
    playerRef.current.rotation.x = THREE.MathUtils.lerp(
      playerRef.current.rotation.x,
      -moveY * 0.2,
      3 * delta
    );
  });

  return (
    <group ref={playerRef} position={[0, 10, 0]}>
      {/* Main cube body */}
      <mesh castShadow>
        <boxGeometry args={[1, 0.5, 1.5]} />
        <meshStandardMaterial color="#FF5733" />
      </mesh>
      
      {/* Wings */}
      <mesh position={[1.2, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.2, 0.8]} />
        <meshStandardMaterial color="#D35400" />
      </mesh>
      <mesh position={[-1.2, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.2, 0.8]} />
        <meshStandardMaterial color="#D35400" />
      </mesh>
      
      {/* Tail */}
      <mesh position={[0, 0.1, -1]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.8]} />
        <meshStandardMaterial color="#FF5733" />
      </mesh>
    </group>
  );
}