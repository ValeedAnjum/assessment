"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveMap, LiveObject } from "@liveblocks/client";
import {
  initialEdges,
  initialNodes,
} from "@/sections/react-flow-liveblock/data";

export function LiveBlockRoom({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCK_PUBLIC_KEY!}
    >
      <RoomProvider
        id="ReactFlow_LiveBlock"
        initialPresence={{ cursor: null }}
        initialStorage={{
          comments: new LiveMap(),
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
