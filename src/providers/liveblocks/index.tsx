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
import { Box, CircularProgress, Container, CssBaseline } from "@mui/material";

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
        <ClientSideSuspense
          fallback={
            <Container component="main" maxWidth="md">
              <CssBaseline />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <CircularProgress />
              </Box>
            </Container>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
