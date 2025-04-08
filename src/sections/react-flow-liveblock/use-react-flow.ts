import { useState } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";

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

export function useReactFlow() {
  // Node and Edges state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // For Undo And Redo funtioanlity
  const [undoStack, setUndoStack] = useState<{ nodes: any; edges: any }[]>([]);
  const [redoStack, setRedoStack] = useState<{ nodes: any; edges: any }[]>([]);

  // For isDargging state and snapshot state for
  // prevent too much state changes during node dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragSnapshot, setDragSnapshot] = useState<{
    nodes: any[];
    edges: any[];
  } | null>(null);

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

  // Store initial state while drag starts
  const onNodeDragStart = () => {
    setDragSnapshot({ nodes, edges });
    setIsDragging(true);
  };

  // Commit drag changes to undo stack when drag finish
  const onNodeDragStop = () => {
    if (!dragSnapshot) return;

    setIsDragging(false);
    handleHistory(dragSnapshot.nodes, dragSnapshot.edges);
    setDragSnapshot(null);
  };

  // drag detection added
  const onNodesChangeWrapped = (changes: NodeChange[]) => {
    if (!isDragging) {
      handleHistory(nodes, edges);
    }
    onNodesChange(changes as any);
  };

  const onEdgesChangeWrapped = (changes: EdgeChange[]) => {
    handleHistory(nodes, edges);
    onEdgesChange(changes as any);
  };

  return {
    nodes,
    edges,
    nodeTypes,
    onConnect,
    onNodesChange: onNodesChangeWrapped,
    onEdgesChange: onEdgesChangeWrapped,
    onNodeDragStart,
    onNodeDragStop,
    undo,
    redo,
    undoStack,
    redoStack,
    handleHistory,
  };
}
