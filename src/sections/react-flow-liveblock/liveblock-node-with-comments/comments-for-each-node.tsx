"use client";

import React, { useState, FormEvent } from "react";
import { useStorage, useMutation, useSelf } from "@liveblocks/react";
import {
  Box,
  Typography,
  TextField,
  Button,
  ListItem,
  Divider,
  Avatar,
  Stack,
  Tooltip,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Comment = {
  userId: string;
  text: string;
  timestamp: number;
};

type NodeCommentsProps = {
  nodeId: string;
};

function NodeComments({ nodeId }: NodeCommentsProps) {
  const [input, setInput] = useState<string>("");
  const self = useSelf();

  const commentsMap = useStorage((root) => root.comments) as Map<
    string,
    Comment[]
  >;
  const comments: Comment[] = commentsMap?.get(nodeId) || [];

  const addComment = useMutation(
    ({ storage }, nodeId: string, text: string) => {
      const map = storage.get("comments") as any;
      const prev: Comment[] = map.get(nodeId) || [];

      const newComment: Comment = {
        userId: self?.id || "anonymous",
        text,
        timestamp: Date.now(),
      };

      map.set(nodeId, [...prev, newComment]);
    },
    [self]
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    addComment(nodeId, input.trim());
    setInput("");
  };

  return (
    <Box
      sx={{
        overflow: "auto",
        height: "100%",
        position: "relative",
        flexGrow: 1,
      }}
    >
      {comments.length === 0 && (
        <Typography color="text.secondary" mt={1}>
          No comments yet. Be the first one!
        </Typography>
      )}
      {comments.length > 1 &&
        comments.map((c, i) => (
          <Box key={i}>
            <ListItem
              alignItems="flex-start"
              sx={{
                alignItems: "center",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  borderRadius: 1,
                },
                py: 1,
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                width="100%"
              >
                <Avatar
                  sx={{ bgcolor: deepPurple[500], width: 32, height: 32 }}
                >
                  {c.userId.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: deepPurple[700] }}
                  >
                    {c.userId}
                  </Typography>
                  <Typography variant="body2">{c.text}</Typography>
                  <Tooltip title={new Date(c.timestamp).toLocaleString()}>
                    <Typography
                      variant="caption"
                      sx={{ color: "gray", mt: 0.5 }}
                    >
                      {dayjs(c.timestamp).fromNow()}
                    </Typography>
                  </Tooltip>
                </Box>
              </Stack>
            </ListItem>
            {i < comments.length - 1 && <Divider />}
          </Box>
        ))}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", p: 1 }}
      >
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Type a comment..."
          value={input}
          sx={{
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
          }}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" variant="contained" disabled={!input.trim()}>
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default NodeComments;
