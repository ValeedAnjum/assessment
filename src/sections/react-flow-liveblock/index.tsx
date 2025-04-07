"use client";

import React, { useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { LiveBlockNode } from "./liveblock-node";

const nodeTypes = {
  liveBlockNode: LiveBlockNode,
};

const initialNodes = [
  {
    type: "liveBlockNode",
    id: "1",
    position: { x: 100, y: 100 },
    data: {
      label: "Multiplayer",
      handles: [{ type: "source", position: "Bottom", id: "1-h1" }],
    },
    style: { border: "1px solid #1a192b", borderRadius: "5px" },
  },
  {
    type: "liveBlockNode",
    id: "2",
    position: { x: 100, y: 200 },
    data: {
      label: "Flowcharts",
      handles: [
        { type: "target", position: "Top", id: "2-h1" },
        { type: "source", position: "Bottom", id: "2-h2" },
      ],
    },
    style: { border: "1px solid #1a192b", borderRadius: "5px" },
  },
  {
    type: "liveBlockNode",
    id: "3",
    position: { x: 100, y: 300 },
    data: {
      label: "LiveBlock",
      handles: [{ type: "target", position: "Top", id: "3-h1" }],
    },
    style: { border: "1px solid rgb(148, 77, 250)", borderRadius: "5px" },
  },
  {
    id: "4",
    type: "liveBlockNode",
    position: { x: 400, y: 200 },
    data: {
      label: "Reactflow",
      handles: [
        { type: "target", position: "Top", id: "4-h1" },
        { type: "source", position: "Bottom", id: "4-h2" },
      ],
    },
    style: { border: "1px solid rgb(255, 0, 114)", borderRadius: "5px" },
  },
];
const initialEdges = [
  { id: "e4-3", source: "4", target: "3", animated: true, label: "and" },
];

export function ReactFlowLiveBlock() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [undoStack, setUndoStack] = useState<{ nodes: any; edges: any }[]>([]);
  const [redoStack, setRedoStack] = useState<{ nodes: any; edges: any }[]>([]);

  const handleHistory = (newNodes: any, newEdges: any) => {
    setUndoStack((prev) => [...prev, { nodes: newNodes, edges: newEdges }]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack[undoStack.length - 1];
      setNodes(lastState.nodes);
      setEdges(lastState.edges);
      setRedoStack([{ nodes, edges }, ...redoStack]);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const lastRedoState = redoStack[0];
      setNodes(lastRedoState.nodes);
      setEdges(lastRedoState.edges);
      setUndoStack([{ nodes, edges }, ...undoStack]);
      setRedoStack(redoStack.slice(1));
    }
  };
  const onConnect = (params: any) => {
    handleHistory(nodes, edges);

    setEdges((eds) => {
      const newEdges = addEdge(params, eds);
      return newEdges;
    });
  };
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
