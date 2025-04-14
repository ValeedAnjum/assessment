import { useAuth } from "@/context/AuthContext";
import { useOthers } from "@liveblocks/react/suspense";
import { Avatar, AvatarGroup, Box } from "@mui/material";

const COLORS = [
  "#E57373",
  "#9575CD",
  "#4FC3F7",
  "#81C784",
  "#FFF176",
  "#FF8A65",
  "#F06292",
  "#7986CB",
];

export function LiveAvatars() {
  const users = useOthers();
  const { user }: any = useAuth();

  return (
    <Box sx={{ display: "flex" }}>
      <AvatarGroup max={4}>
        {users.map(({ connectionId }) => (
          <Avatar
            key={connectionId}
            alt={`${connectionId}`}
            sx={{ bgcolor: COLORS[connectionId % COLORS.length] }}
          >
            {user?.email[0] ?? connectionId}
          </Avatar>
        ))}
      </AvatarGroup>
    </Box>
  );
}
