import React, { useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useGLTFWithKTX2 } from "../utils/useGLTFWithKTX2";
import { convertMaterialsToMeshBasicMaterial } from "../utils/convertMaterial";
import { useModalStore } from "../stores/modalStore";

import About from "../../components/About/About";
import Project from "../../components/Project/Project";

export default function Model({ progress = 0, pulseIntensity = 0, ...props }) {
  const { nodes, materials } = useGLTFWithKTX2(
    `${import.meta.env.BASE_URL}models/DetailT-v1.glb`
  );
  const [hoveredMesh, setHoveredMesh] = useState(null);
  const { openModal } = useModalStore();

  // Load project images, full sign banner & About Me photos (1.jpeg, 2.jpeg, 3.jpeg, 4.jpeg)
  const [
    askDocsTex,
    senpaiTex,
    bitchordTex,
    haftXaiTex,
    fullSignTex,
    aboutFrame1Tex,
    aboutFrame2Tex,
    aboutFrame3Tex,
    aboutFrame4Tex,
  ] = useTexture([
    `${import.meta.env.BASE_URL}images/ask-my-docs.png`,
    `${import.meta.env.BASE_URL}images/senpai.png`,
    `${import.meta.env.BASE_URL}images/bitchord.png`,
    `${import.meta.env.BASE_URL}images/haft-xai.png`,
    `${import.meta.env.BASE_URL}images/full_sign_nishanth.png`,
    `${import.meta.env.BASE_URL}images/about/frame-1.jpg`,
    `${import.meta.env.BASE_URL}images/about/frame-2.jpg`,
    `${import.meta.env.BASE_URL}images/about/frame-3.jpg`,
    `${import.meta.env.BASE_URL}images/about/frame-4.jpg`,
  ]);

  const projectNames = {
    one: "Ask My Docs",
    two: "Senpai's PDF Workshop",
    three: "BitChord (Contributor)",
    four: "HAFT-XAI (IIoT NIDS)",
  };

  const handleClick = (elementID) => {
    if (elementID === "about") {
      openModal("About Nishanth", <About />, elementID);
    } else {
      openModal(
        projectNames[elementID],
        <Project projectID={elementID} />,
        elementID
      );
    }
  };

  const baseMaterial = materials["MergedBake_Baked.010"].clone();
  const brightHoveredMaterial = materials["MergedBake_Baked.010"].clone();
  brightHoveredMaterial.color = new THREE.Color(2.5, 2.5, 2.5);

  const pulsingMaterial = materials["MergedBake_Baked.010"].clone();

  convertMaterialsToMeshBasicMaterial(materials, 0);

  const getMaterial = (elementID, progressRange) => {
    if (hoveredMesh === elementID) return brightHoveredMaterial;

    const [min, max] = progressRange;
    if (progress >= min && progress <= max) {
      const pulseColor = 1 + pulseIntensity * 1.5;
      pulsingMaterial.color.setRGB(pulseColor, pulseColor, pulseColor);
      return pulsingMaterial;
    }
    return baseMaterial;
  };

  // Helper for picture plane material with hover & proximity pulse
  const getPicColor = (elementID, progressRange) => {
    if (hoveredMesh === elementID) return new THREE.Color(1.6, 1.6, 1.6);
    const [min, max] = progressRange;
    if (progress >= min && progress <= max) {
      const pulseVal = 1 + pulseIntensity * 0.6;
      return new THREE.Color(pulseVal, pulseVal, pulseVal);
    }
    return new THREE.Color(1.0, 1.0, 1.0);
  };

  const createLabelTexture = (text) => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    // Terracotta background matching wall
    ctx.fillStyle = "#8a4f36";
    ctx.fillRect(0, 0, 256, 64);

    // Darker outline
    ctx.strokeStyle = "#582f1f";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 252, 60);

    // Label Text
    ctx.fillStyle = "#1e110b";
    ctx.font = "bold 24px Minecraft, monospace, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 32);

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.LinearFilter;
    return tex;
  };

  const labelOneTex = useMemo(() => createLabelTexture("Ask My Docs"), []);
  const labelTwoTex = useMemo(() => createLabelTexture("Senpai PDF"), []);
  const labelThreeTex = useMemo(() => createLabelTexture("BitChord"), []);
  const labelFourTex = useMemo(() => createLabelTexture("HAFT-XAI"), []);

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        [labelOneTex, labelTwoTex, labelThreeTex, labelFourTex].forEach((tex) => {
          if (tex) tex.needsUpdate = true;
        });
      });
    }
  }, [labelOneTex, labelTwoTex, labelThreeTex, labelFourTex]);

  useEffect(() => {
    document.body.style.cursor = hoveredMesh ? "pointer" : "auto";
  }, [hoveredMesh]);

  const projects = [
    { id: "one", x: -10.528, tex: askDocsTex, labelTex: labelOneTex },
    { id: "two", x: -9.532, tex: senpaiTex, labelTex: labelTwoTex },
    { id: "three", x: -8.536, tex: bitchordTex, labelTex: labelThreeTex },
    { id: "four", x: -7.541, tex: haftXaiTex, labelTex: labelFourTex },
  ];

  // Geometries for the 4 About Me photo frames exactly matching in-game desk frames
  const frameOneGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array([
      -9.1052, 67.8842, 4.3047,
      -8.7831, 67.8869, 4.4184,
      -8.8185, 68.1875, 4.5117,
      -9.1052, 67.8842, 4.3047,
      -8.8185, 68.1875, 4.5117,
      -9.1406, 68.1848, 4.3980,
    ]);
    const uvs = new Float32Array([
      0, 0,  1, 0,  1, 1,
      0, 0,  1, 1,  0, 1,
    ]);
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geom.computeVertexNormals();
    return geom;
  }, []);

  const frameTwoGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array([
      -8.6155, 67.8842, 4.4156,
      -8.2754, 67.8869, 4.4466,
      -8.2868, 68.1875, 4.5458,
      -8.6155, 67.8842, 4.4156,
      -8.2868, 68.1875, 4.5458,
      -8.6269, 68.1848, 4.5147,
    ]);
    const uvs = new Float32Array([
      0, 0,  1, 0,  1, 1,
      0, 0,  1, 1,  0, 1,
    ]);
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geom.computeVertexNormals();
    return geom;
  }, []);

  const frameThreeGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array([
      -8.0132, 67.8902, 4.4027,
      -7.6711, 67.8929, 4.3602,
      -7.6611, 68.1963, 4.4604,
      -8.0132, 67.8902, 4.4027,
      -7.6611, 68.1963, 4.4604,
      -8.0032, 68.1936, 4.5029,
    ]);
    const uvs = new Float32Array([
      0, 0,  1, 0,  1, 1,
      0, 0,  1, 1,  0, 1,
    ]);
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geom.computeVertexNormals();
    return geom;
  }, []);

  const frameFourGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array([
      -7.5158, 67.8925, 4.2868,
      -7.1881, 67.8951, 4.2439,
      -7.1778, 68.1859, 4.3399,
      -7.5158, 67.8925, 4.2868,
      -7.1778, 68.1859, 4.3399,
      -7.5055, 68.1833, 4.3828,
    ]);
    const uvs = new Float32Array([
      0, 0,  1, 0,  1, 1,
      0, 0,  1, 1,  0, 1,
    ]);
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group {...props} dispose={null}>
      {/* Original detail geometry */}
      <mesh
        geometry={nodes.detail_Baked.geometry}
        material={materials["MergedBake_Baked.010"]}
        position={[-6.46, 69.669, -1.148]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes.About_Me_Pictures.geometry}
        material={getMaterial("about", [0.55, 0.65])}
        position={[-8.164, 68.036, 4.408]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={() => setHoveredMesh("about")}
        onPointerOut={() => setHoveredMesh(null)}
        onClick={() => {
          handleClick("about");
        }}
      />

      {/* Frame 1: Ask My Docs */}
      <mesh
        geometry={nodes.Project_One.geometry}
        material={getMaterial("one", [0.32, 0.43])}
        position={[-10.528, 69.422, -4.13]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={() => setHoveredMesh("one")}
        onPointerOut={() => setHoveredMesh(null)}
        onClick={() => {
          handleClick("one");
        }}
      />

      {/* Frame 2: Senpai PDF */}
      <mesh
        geometry={nodes.Project_Two.geometry}
        material={getMaterial("two", [0.32, 0.43])}
        position={[-9.532, 69.422, -4.13]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={() => setHoveredMesh("two")}
        onPointerOut={() => setHoveredMesh(null)}
        onClick={() => {
          handleClick("two");
        }}
      />

      {/* Frame 3: BitChord */}
      <mesh
        geometry={nodes.Project_Three.geometry}
        material={getMaterial("three", [0.32, 0.43])}
        position={[-8.536, 69.422, -4.13]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={() => setHoveredMesh("three")}
        onPointerOut={() => setHoveredMesh(null)}
        onClick={() => {
          handleClick("three");
        }}
      />

      {/* Frame 4: ShadowAssist */}
      <mesh
        geometry={nodes.Project_Four.geometry}
        material={getMaterial("four", [0.32, 0.43])}
        position={[-7.541, 69.422, -4.13]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={() => setHoveredMesh("four")}
        onPointerOut={() => setHoveredMesh(null)}
        onClick={() => {
          handleClick("four");
        }}
      />

      {/* 3D Overlays: Nishanth's Project Pictures inside the frames */}
      {projects.map((proj) => (
        <group key={proj.id}>
          {/* Screenshot inside the picture frame */}
          <mesh
            position={[proj.x, 69.422, -4.095]}
            onPointerOver={() => setHoveredMesh(proj.id)}
            onPointerOut={() => setHoveredMesh(null)}
            onClick={() => handleClick(proj.id)}
          >
            <planeGeometry args={[0.52, 0.50]} />
            <meshBasicMaterial
              map={proj.tex}
              color={getPicColor(proj.id, [0.32, 0.43])}
            />
          </mesh>

          {/* Minecraft Terracotta Label under the frame */}
          <mesh
            position={[proj.x, 69.05, -4.095]}
            onPointerOver={() => setHoveredMesh(proj.id)}
            onPointerOut={() => setHoveredMesh(null)}
            onClick={() => handleClick(proj.id)}
          >
            <planeGeometry args={[0.88, 0.16]} />
            <meshBasicMaterial
              map={proj.labelTex}
              color={getPicColor(proj.id, [0.32, 0.43])}
            />
          </mesh>
        </group>
      ))}

      {/* Upper dark wooden banner: Nishanth's Selected Works */}
      <mesh position={[-9.039, 70.356, -4.102]}>
        <planeGeometry args={[1.788, 0.565]} />
        <meshBasicMaterial map={fullSignTex} />
      </mesh>

      {/* 3D In-Game Photo Frames in About Me section */}
      <mesh
        geometry={frameOneGeom}
        onPointerOver={() => setHoveredMesh("about")}
        onPointerOut={() => setHoveredMesh(null)}
        onClick={() => handleClick("about")}
      >
        <meshBasicMaterial
          map={aboutFrame1Tex}
          color={getPicColor("about", [0.55, 0.65])}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh
        geometry={frameTwoGeom}
        onPointerOver={() => setHoveredMesh("about")}
        onPointerOut={() => setHoveredMesh(null)}
        onClick={() => handleClick("about")}
      >
        <meshBasicMaterial
          map={aboutFrame2Tex}
          color={getPicColor("about", [0.55, 0.65])}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh
        geometry={frameThreeGeom}
        onPointerOver={() => setHoveredMesh("about")}
        onPointerOut={() => setHoveredMesh(null)}
        onClick={() => handleClick("about")}
      >
        <meshBasicMaterial
          map={aboutFrame3Tex}
          color={getPicColor("about", [0.55, 0.65])}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh
        geometry={frameFourGeom}
        onPointerOver={() => setHoveredMesh("about")}
        onPointerOut={() => setHoveredMesh(null)}
        onClick={() => handleClick("about")}
      >
        <meshBasicMaterial
          map={aboutFrame4Tex}
          color={getPicColor("about", [0.55, 0.65])}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh
        geometry={nodes.about_me_text.geometry}
        material={materials["MergedBake_Baked.010"]}
        position={[-8.524, 68.356, 4.727]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}
