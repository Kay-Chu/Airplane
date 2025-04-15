import React, { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

const BOUNDARY = {
  xMin: -20,
  xMax: 20,
  yMin: 0,
  yMax: 20,
  zMin: -20,
  zMax: 20,
};

const Player = memo(() => {
  const playerRef = useRef<THREE.Group>(null);
  const [, get] = useKeyboardControls();

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const { forward, backward, left, right, ascend, descend } = get();

    // --- Movement ---
    const moveSpeed = 8 * delta;
    const verticalSpeed = 6 * delta;

    const moveY = (ascend ? 1 : 0) - (descend ? 1 : 0);

    // Get current forward direction
    const direction = new THREE.Vector3();
    playerRef.current.getWorldDirection(direction);
    direction.multiplyScalar(-1);
    direction.y = 0;
    direction.normalize();

    // Get right vector (perpendicular to direction)
    const rightVector = new THREE.Vector3();
    rightVector.crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();

    // Combine movement
    const finalDirection = new THREE.Vector3();
    finalDirection
      .addScaledVector(direction, (forward ? 1 : 0) - (backward ? 1 : 0))
      .addScaledVector(rightVector, (right ? 1 : 0) - (left ? 1 : 0))
      .normalize();

    // Apply movement
    playerRef.current.position.addScaledVector(finalDirection, moveSpeed);
    playerRef.current.position.y += moveY * verticalSpeed;

    // Slight bobbing
    playerRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.02;

    // --- Camera (first-person) ---
    const cameraOffset = new THREE.Vector3(0, 0.2, 0.5); 
    cameraOffset.applyQuaternion(playerRef.current.quaternion);
    const cameraPosition = playerRef.current.position.clone().add(cameraOffset);
    state.camera.position.copy(cameraPosition);
    state.camera.quaternion.copy(playerRef.current.quaternion);

    // Pitch for vertical movement
    playerRef.current.rotation.x = THREE.MathUtils.lerp(
      playerRef.current.rotation.x,
      -moveY * 0.2,
      3 * delta
    );
    // Bank the plane when strafing
    playerRef.current.rotation.z = THREE.MathUtils.lerp(
      playerRef.current.rotation.z,
      -((right ? 1 : 0) - (left ? 1 : 0)) * 0.3,
      3 * delta
    );


    // --- Boundary Clamp ---
    const pos = playerRef.current.position;
    pos.x = THREE.MathUtils.clamp(pos.x, BOUNDARY.xMin, BOUNDARY.xMax);
    pos.y = THREE.MathUtils.clamp(pos.y, BOUNDARY.yMin, BOUNDARY.yMax);
    pos.z = THREE.MathUtils.clamp(pos.z, BOUNDARY.zMin, BOUNDARY.zMax);
  });

  return (
    <group ref={playerRef} position={[0, 10, 0]}>
      {/* Main body */}
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
      {/* <mesh position={[0, 0.1, -1]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.8]} />
        <meshStandardMaterial color="#FF5733" />
      </mesh> */}
    </group>
  );
});

export default Player;
