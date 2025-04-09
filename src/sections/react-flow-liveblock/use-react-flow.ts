import { useNodesState, useEdgesState, addEdge } from "@xyflow/react";

import { LiveBlockNode } from "./liveblock-node";
import { useMutation, useStorage } from "@liveblocks/react/suspense";
import { useEffect, useRef } from "react";

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
  const liveEdges = useStorage((root: any) => root.flowdata.edges);
  const liveNodes = useStorage((root: any) => root.flowdata.nodes);
  // console.log(test);
  // Node and Edges state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // Track if we're in the middle of an update
  const isUpdatingRef = useRef(false);
  const updateNodes = useMutation(({ storage }: any, nodes: any) => {
    storage.get("flowdata").set("nodes", nodes);
  }, []);
  // Custom nodes change handler to sync with Liveblocks
  const handleNodesChange = (changes: any) => {
    onNodesChange(changes);

    // After React Flow processes the node changes, update Liveblocks
    setTimeout(() => {
      setNodes((currentNodes) => {
        updateNodes(currentNodes);
        return currentNodes;
      });
    }, 0);
  };
  const updateEdges = useMutation(
    // Mutation context is passed as the first argument
    ({ storage }: any, edges: any) => {
      // const count = storage.get("flowdata").get("edges");
      storage.get("flowdata").set("edges", edges);
    },
    []
  );

  const onConnect = (params: any) => {
    setEdges((eds) => {
      const newEdges = addEdge(params, eds);

      // Update Liveblocks storage
      setTimeout(() => {
        updateEdges(newEdges);
      }, 0);

      return newEdges;
    });
  };

  useEffect(() => {
    setEdges(liveEdges);
  }, [liveEdges, setEdges]);

  useEffect(() => {
    setNodes(liveNodes);
  }, [liveNodes, setNodes]);

  // Custom edges change handler to sync with Liveblocks - no useCallback
  const handleEdgesChange = (changes: any) => {
    onEdgesChange(changes);

    // After React Flow processes the edge changes, update Liveblocks
    setTimeout(() => {
      setEdges((currentEdges) => {
        updateEdges(currentEdges);
        return currentEdges;
      });
    }, 0);
  };

  return {
    nodes,
    edges,
    nodeTypes,
    onConnect,
    onNodesChange: handleNodesChange,
    onEdgesChange: handleEdgesChange,
  };
}
