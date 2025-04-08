"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveObject } from "@liveblocks/client";

export function LiveBlockRoom({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCK_PUBLIC_KEY!}
    >
      <RoomProvider
        id="ReactFlow_LiveBlock"
        initialPresence={{ cursor: null }}
        initialStorage={{
          person: new LiveObject({ name: "Marie", age: 30 }),
        }}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
