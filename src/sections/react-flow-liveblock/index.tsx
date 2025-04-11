"use client";

import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import { useOthers, useUpdateMyPresence } from "@liveblocks/react/suspense";
import "@xyflow/react/dist/style.css";
import { useReactFlow } from "./use-react-flow";
import { CollaborativeComments } from "./comments";
import { LiveAvatars } from "./live-avatar";

// Diffrent Colors for users cursors
const COLORS = [
  "#E57373",
  "#9575CD",
  "#4FC3F7",
  "#81C784",
  "#FFF176",
  "#FF8A65",
  "#F06292",
  "#7986CB",
];

type Props = {
  color: string;
  x: number;
  y: number;
  connectionId: number;
};

const Cursor = ({ x, y, color, connectionId }: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translateX(${x}px) translateY(${y}px)`,
        pointerEvents: "none",
      }}
    >
      <svg
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
        />
      </svg>
      <p
        style={{
          position: "absolute",
          top: "-5%",
          left: "80%",
          fontSize: "0.625rem",
          padding: "0.5rem",
          borderRadius: "0.2rem",
        }}
      >
        {connectionId}
      </p>
    </div>
  );
};

export function ReactFlowLiveBlock() {
  const {
    nodes,
    edges,
    nodeTypes,
    onConnect,
    onNodesChange,
    onEdgesChange,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useReactFlow();
  const others = useOthers();
  const userCount = others.length;
  const updateMyPresence = useUpdateMyPresence();

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onPointerMove={(e) =>
        updateMyPresence({ cursor: { x: e.clientX, y: e.clientY } })
      }
      onPointerLeave={() => updateMyPresence({ cursor: null })}
    >
      {others.map(({ connectionId, presence }: any) =>
        presence.cursor ? (
          <Cursor
            connectionId={connectionId}
            key={connectionId}
            x={presence.cursor.x}
            y={presence.cursor.y}
            color={COLORS[connectionId % COLORS.length]}
          />
        ) : null
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        // defaultViewport={{ zoom: 5, x: 1, y: 1 }}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      {/* Undo and Redo buttons */}
      <div style={{ position: "absolute", top: "1.25rem", left: "1.25rem" }}>
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>
      </div>
      <div
        style={{
          position: "absolute",
          top: "1.25rem",
          right: "20%",
          width: "20%",
        }}
      >
        <div>
          {userCount} Avatars
          <LiveAvatars />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "1.25rem",
          right: "1.25rem",
          width: "20%",
        }}
      >
        <div>{userCount} users online</div>
        <CollaborativeComments />
      </div>
    </div>
  );
}
