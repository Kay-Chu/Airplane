import React from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import World from './World';
import Player from './Player';
import { useControls } from 'leva';

export default function Game() {
  const { bgColor } = useControls({
    bgColor: '#519ab7'
  });

  return (
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
        { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
        { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
        { name: 'right', keys: ['ArrowRight', 'KeyD'] },
        { name: 'ascend', keys: ['Space'] },
        { name: 'descend', keys: ['ShiftLeft', 'KeyC'] },
      ]}
    >
      <Canvas shadows camera={{ position: [0, 5, 30], fov: 70 }} style={{width: '100vw', height: '100vh'}}>
        <color attach="background" args={[bgColor]} />
        {/* <fog attach="fog" args={['#87CEEB', 30, 40]} /> */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <World />
        <Player />
      </Canvas>
      <div style={overlayStyle}>
        <div style={instructionsStyle}>
          <h2>3D Flying Cube</h2>
          <p>WASD/Arrows: Move | Space: Ascend | Shift: Descend</p>
        </div>
      </div>
    </KeyboardControls>
  );
}

const overlayStyle:React.CSSProperties = {
  position: 'absolute',
  bottom: '20px',
  // left: '20px',
  pointerEvents: 'none',
};

const instructionsStyle:React.CSSProperties = {
  background: 'rgba(0,0,0,0.5)',
  color: 'white',
  padding: '10px 10px',
  // borderRadius: '10px',
  fontFamily: 'Arial, sans-serif',
};