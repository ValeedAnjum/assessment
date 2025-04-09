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
  const liveNodes = useStorage((root: any) => root.flowdata.nodes);
  const liveEdges = useStorage((root: any) => root.flowdata.edges);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const updateNodes = useMutation(({ storage }: any, nodes: any) => {
    storage.get("flowdata").set("nodes", nodes);
  }, []);
  const updateEdges = useMutation(({ storage }: any, edges: any) => {
    storage.get("flowdata").set("edges", edges);
  }, []);

  const skipNextSyncRef = useRef(false);
  const initializedRef = useRef(false);

  //state from Liveblocks on first mount
  useEffect(() => {
    if (!initializedRef.current && liveNodes && liveEdges) {
      initializedRef.current = true;

      const initNodes = liveNodes.length > 0 ? liveNodes : initialNodes;
      const initEdges = liveEdges.length > 0 ? liveEdges : initialEdges;

      setNodes(initNodes);
      setEdges(initEdges);

      // populate Liveblocks if empty
      if (liveNodes.length === 0) updateNodes(initNodes);
      if (liveEdges.length === 0) updateEdges(initEdges);
    }
  }, [liveNodes, liveEdges]);

  // Sync changes from Liveblocks (other users)
  useEffect(() => {
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }
    if (initializedRef.current && liveNodes) {
      setNodes(liveNodes);
    }
  }, [liveNodes]);

  useEffect(() => {
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }
    if (initializedRef.current && liveEdges) {
      setEdges(liveEdges);
    }
  }, [liveEdges]);

  const handleNodesChange = (changes: any) => {
    onNodesChange(changes);
    setNodes((currentNodes) => {
      skipNextSyncRef.current = true;
      queueMicrotask(() => updateNodes(currentNodes));
      return currentNodes;
    });
  };

  const handleEdgesChange = (changes: any) => {
    onEdgesChange(changes);
    setEdges((currentEdges) => {
      skipNextSyncRef.current = true;
      queueMicrotask(() => updateEdges(currentEdges));
      return currentEdges;
    });
  };

  const onConnect = (params: any) => {
    setEdges((eds) => {
      const newEdges = addEdge(params, eds);
      skipNextSyncRef.current = true;
      queueMicrotask(() => updateEdges(newEdges));
      return newEdges;
    });
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
