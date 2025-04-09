import { Avatar } from "@/components/atoms";
import { useOthers } from "@liveblocks/react/suspense";

export function LiveAvatars() {
  const users = useOthers();

  return (
    <>
      {users.map(({ connectionId }) => {
        return <Avatar key={connectionId} name={`${connectionId}`} />;
      })}
    </>
  );
}
