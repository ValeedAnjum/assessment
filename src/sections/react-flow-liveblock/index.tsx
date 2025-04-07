"use client";

import { ReactFlow, MiniMap, Controls } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { useReactFlow } from "./use-react-flow";

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
    undoStack,
    redoStack,
  } = useReactFlow();
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
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
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <button onClick={undo} disabled={undoStack.length === 0}>
          Undo
        </button>
        <button onClick={redo} disabled={redoStack.length === 0}>
          Redo
        </button>
      </div>
    </div>
  );
}
