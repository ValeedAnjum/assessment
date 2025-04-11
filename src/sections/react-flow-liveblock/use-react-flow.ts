import { useNodesState, useEdgesState, addEdge } from "@xyflow/react";
import { LiveBlockNode } from "./liveblock-node";
import { LiveBlockNodeWithComments } from "./liveblock-node-with-comments";
import {
  useCanRedo,
  useCanUndo,
  useMutation,
  useRedo,
  useStorage,
  useUndo,
} from "@liveblocks/react/suspense";
import { useEffect, useRef } from "react";
import { initialEdges, initialNodes } from "./data";
import { throttle } from "lodash";

const nodeTypes = {
  liveBlockNode: LiveBlockNode,
  liveBlockNodeWithComments: LiveBlockNodeWithComments,
};

export function useReactFlow() {
  const liveNodes = useStorage((root: any) => root.flowdata.nodes);
  const liveEdges = useStorage((root: any) => root.flowdata.edges);

  const undo = useUndo();
  const redo = useRedo();

  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const sendUpdateToServer = throttle(async ({ nodes, edges }) => {
    try {
      await fetch("http://localhost:5000/flow/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });
    } catch (error) {
      console.log(error);
    }
  }, 300);

  const updateNodes = useMutation(({ storage }: any, nodes: any) => {
    storage.get("flowdata").set("nodes", nodes);
    sendUpdateToServer({ nodes });
  }, []);
  const updateEdges = useMutation(({ storage }: any, edges: any) => {
    storage.get("flowdata").set("edges", edges);
    sendUpdateToServer({ edges });
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
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
