import { Canvas, useFrame } from "@react-three/fiber";
import {
  // OrbitControls,
  useTexture,
  Plane,
  // Stats,
  // useHelper,
} from "@react-three/drei";
import { useRef } from "react";
import {
  Mesh,
  // SpotLight,
  // SpotLightHelper,
  sRGBEncoding,
} from "three";
import {
  ChromaticAberration,
  EffectComposer,
  Noise,
} from "@react-three/postprocessing";

function Terrain() {
  // const spotlight1 = useRef<SpotLight>(null!);
  // useHelper(spotlight1, SpotLightHelper);

  // const spotlight2 = useRef<SpotLight>(null!);
  // useHelper(spotlight2, SpotLightHelper);

  const terrainTexture = useTexture({
    map: "./textures/grid.png",
    displacementMap: "./textures/displacement.png",
    metalnessMap: "./textures/metalness.png",
  });

  const plane1 = useRef<Mesh>(null!);
  const plane2 = useRef<Mesh>(null!);
  useFrame((state) => {
    const speed = 0.8;
    const elapsedTime = state.clock.getElapsedTime();
    plane1.current.position.z = (elapsedTime * speed) % 20;
    plane2.current.position.z = ((elapsedTime * speed) % 20) - 20;
  });

  return (
    <group>
      <spotLight
        // ref={spotlight1}
        position={[0.5, 2.75, 2.2]}
        distance={25}
        intensity={200}
        color={"#d53c3d"}
      />
      <spotLight
        // ref={spotlight2}
        position={[-0.5, 2.75, 2.2]}
        distance={25}
        intensity={200}
        color={"#d53c3d"}
      />
      <Plane
        args={[1, 2, 24, 24]}
        position={[0, 0, 0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        scale={10}
        ref={plane1}
      >
        <meshStandardMaterial
          {...terrainTexture}
          displacementScale={0.4}
          metalness={0.96}
          roughness={0.5}
        />
      </Plane>
      <Plane
        args={[1, 2, 24, 24]}
        position={[0, 0, -10]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        scale={10}
        ref={plane2}
      >
        <meshStandardMaterial
          {...terrainTexture}
          displacementScale={0.4}
          metalness={0.96}
          roughness={0.5}
        />
      </Plane>
    </group>
  );
}

export default function App() {
  return (
    <Canvas
      style={{ display: "flex", width: "100vw", height: "100vh" }}
      camera={{
        position: [0, 1, 0],
        rotation: [-Math.PI * 0.1, 0, 0],
      }}
      onCreated={({ gl }) => {
        gl.outputEncoding = sRGBEncoding;
      }}
      gl={{
        powerPreference: "high-performance",
        alpha: false,
        antialias: false,
        stencil: false,
        depth: false,
      }}
    >
      <fog attach="fog" args={["black", 0, 15]} />
      <color attach="background" args={["black"]} />
      <ambientLight color={"white"} intensity={10} />

      {/* <OrbitControls makeDefault /> */}
      <Terrain />
      <EffectComposer multisampling={0} disableNormalPass={true}>
        <Noise opacity={0.15} />
        <ChromaticAberration />
      </EffectComposer>
      {/* <Stats /> */}
    </Canvas>
  );
}
