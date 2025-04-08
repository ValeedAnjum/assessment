"use client";

import { ReactFlow, MiniMap, Controls } from "@xyflow/react";
import { useOthers, useUpdateMyPresence } from "@liveblocks/react/suspense";
import "@xyflow/react/dist/style.css";
import { useReactFlow } from "./use-react-flow";
import { CollaborativeComments } from "./comments";

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
};

function Cursor({ color, x, y }: Props) {
  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
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
  );
}

export function ReactFlowLiveBlock() {
  const { nodes, edges, nodeTypes, onConnect, onNodesChange, onEdgesChange } =
    useReactFlow();
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
        defaultViewport={{ zoom: 5, x: 1, y: 1 }}
      >
        <Controls />
        <MiniMap />
        {/* <Background variant={BackgroundVariant.Dots} gap={12} size={1} /> */}
      </ReactFlow>
      {/* Undo and Redo buttons */}
      {/* <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <button onClick={undo} disabled={undoStack.length === 0}>
          Undo
        </button>
        <button onClick={redo} disabled={redoStack.length === 0}>
          Redo
        </button>
      </div> */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "20%",
        }}
      >
        <div>{userCount} users online</div>
        <CollaborativeComments />
      </div>
    </div>
  );
}
