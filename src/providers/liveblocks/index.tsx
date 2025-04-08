"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveObject } from "@liveblocks/client";

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
export function LiveBlockRoom({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCK_PUBLIC_KEY!}
    >
      <RoomProvider
        id="ReactFlow_LiveBlock"
        initialPresence={{ cursor: null }}
        initialStorage={{
          myLiveObject: new LiveObject({ count: 0 }),
          flowdata: new LiveObject({
            nodes: initialNodes,
            edges: initialEdges,
          }),
        }}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
