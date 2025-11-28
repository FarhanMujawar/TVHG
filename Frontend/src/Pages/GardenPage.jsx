import React, { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Stage, PointerLockControls, OrbitControls, Html } from "@react-three/drei";

// Preload models that live in public/
useGLTF.preload && useGLTF.preload("/VirtualGarden.glb");
useGLTF.preload && useGLTF.preload("/aloevera.gltf");
useGLTF.preload && useGLTF.preload("/cactus.gltf");
useGLTF.preload && useGLTF.preload("/salviaRosmarinus.gltf");

// Plant data with descriptions
const PLANTS_DATA = [
  {
    url: "/aloevera.gltf",
    name: "Aloe Vera",
    position: [-2, 0.5, -7],
    scale: 0.15,
    description: "Succulent plant known for healing gel. Treats burns and skin conditions."
  },
  {
    url: "/cactus.gltf",
    name: "Cactus",
    position: [3.0, 0.0, -7],
    scale: 0.005,
    description: "Desert plant adapted to dry climates. Stores water in its stem."
  },
  {
    url: "/salviaRosmarinus.gltf",
    name: "Salvia Rosmarinus",
    position: [2.4, 1.0, -18.5],
    scale: 4.5,
    description: "Aromatic herb used in cooking. Supports memory and concentration."
  }
];

function VirtualGarden() {
  const { scene } = useGLTF("/VirtualGarden.glb");
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    ref.current.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  );
}

function Plant({ url, name, description, position = [0, 0, 0], scale = 0.05, onSelect, onProximity }) {
  const { scene } = useGLTF(url);
  const ref = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (!ref.current) return;

    // enable shadows on meshes
    ref.current.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });
  }, [scene]);

  // Track proximity to camera
  useFrame(() => {
    if (!ref.current) return;
    const distance = ref.current.position.distanceTo(camera.position);
    onProximity && onProximity({ name, description, distance, position });
  });

  return (
    <group
      ref={ref}
      position={position}
      scale={scale}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect && onSelect({ name, description });
      }}
    >
      <primitive object={scene} />
    </group>
  );
}

function FirstPersonMovement({ enabled = true, speed = 2 }) {
  const { camera } = useThree();
  const plRef = useRef(null);
  const move = useRef({ forward: 0, back: 0, left: 0, right: 0 });

  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          move.current.forward = 1;
          break;
        case "KeyS":
        case "ArrowDown":
          move.current.back = 1;
          break;
        case "KeyA":
        case "ArrowLeft":
          move.current.left = 1;
          break;
        case "KeyD":
        case "ArrowRight":
          move.current.right = 1;
          break;
        default:
          break;
      }
    };
    const onKeyUp = (e) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          move.current.forward = 0;
          break;
        case "KeyS":
        case "ArrowDown":
          move.current.back = 0;
          break;
        case "KeyA":
        case "ArrowLeft":
          move.current.left = 0;
          break;
        case "KeyD":
        case "ArrowRight":
          move.current.right = 0;
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      // Exit pointer lock when component unmounts
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    };
  }, []);

  useFrame((_, delta) => {
    if (!enabled) return;
    const forward = move.current.forward - move.current.back;
    const sideways = move.current.right - move.current.left;
    if (forward === 0 && sideways === 0) return;

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();

    if (forward !== 0) camera.position.addScaledVector(dir, forward * speed * delta);
    if (sideways !== 0) camera.position.addScaledVector(right, sideways * speed * delta);
  });

  return (
    <PointerLockControls
      ref={plRef}
      onError={(err) => {
        console.warn("PointerLockControls error:", err);
        // Silently handle pointer lock errors
      }}
    />
  );
}

export default function GardenPage() {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [walkMode, setWalkMode] = useState(true);
  const [nearbyPlant, setNearbyPlant] = useState(null);

  const handleProximity = (plantInfo) => {
    // Show label if within 5 units
    if (plantInfo.distance < 5) {
      setNearbyPlant(plantInfo);
    } else {
      setNearbyPlant(null);
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", overflow: "hidden" }}>
      <Canvas
        shadows
        camera={{ fov: 75, position: [0, 2, 5] }}
        style={{ width: "100%", height: "100%" }}
        onCreated={({ gl }) => {
          gl.domElement.style.touchAction = "none";
          gl.domElement.style.userSelect = "none";
        }}
      >
        <color attach="background" args={["#dfeee6"]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />

        {/* ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#9bd49b" />
        </mesh>

        <Suspense fallback={null}>
          {/* Virtual Garden Background */}
          <VirtualGarden />
          
          {/* Individual plants positioned inside the garden */}
          {PLANTS_DATA.map((plant, idx) => (
            <Plant
              key={idx}
              url={plant.url}
              name={plant.name}
              description={plant.description}
              position={plant.position}
              scale={plant.scale}
              onSelect={setSelectedPlant}
              onProximity={handleProximity}
            />
          ))}

          <Stage environment={"sunset"} intensity={1} contactShadow={true} shadows={true}>
            {/* optional scene content */}
          </Stage>
        </Suspense>

        {/* Controls */}
        {walkMode ? <FirstPersonMovement enabled={true} speed={5} /> : <OrbitControls makeDefault />}
      </Canvas>

      {/* UI overlay - Click to view details */}
      {selectedPlant && (
        <div style={{ position: "absolute", left: 20, bottom: 20, background: "rgba(255,255,255,0.95)", padding: 16, borderRadius: 8, maxWidth: 300 }}>
          <strong style={{ fontSize: "18px" }}>{selectedPlant.name}</strong>
          <p style={{ fontSize: "14px", color: "#555", marginTop: 8 }}>{selectedPlant.description}</p>
        </div>
      )}

      {/* UI overlay - Proximity label (appears when near plant) */}
      {nearbyPlant && !selectedPlant && (
        <div style={{ position: "absolute", top: 40, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.8)", color: "#fff", padding: 12, borderRadius: 8, textAlign: "center", maxWidth: 300 }}>
          <strong style={{ fontSize: "16px" }}>{nearbyPlant.name}</strong>
          <p style={{ fontSize: "12px", marginTop: 6 }}>{nearbyPlant.description}</p>
        </div>
      )}

      <div style={{ position: "absolute", right: 20, top: 20 }}>
        <button onClick={() => setWalkMode((s) => !s)} style={{ padding: "8px 12px" }}>
          {walkMode ? "Switch to Orbit" : "Switch to Walk"}
        </button>
      </div>
    </div>
  );
}
