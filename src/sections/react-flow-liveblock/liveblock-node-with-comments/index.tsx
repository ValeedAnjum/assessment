import { Handle, Position } from "@xyflow/react";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import { Box, IconButton } from "@mui/material";
import { useRef, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import NodeComments from "./comments-for-each-node";
export function LiveBlockNodeWithComments({ id, data }: any) {
  const hideTimeoutRef: any = useRef(null);
  const [displayComments, setDisplayComments] = useState(false);
  const { label, handles } = data;

  return (
    <>
      <div
        style={{
          padding: "12px",
          width: "150px",
          textAlign: "center",
          borderRadius: "5px",
          position: "relative",
          transition: "all 0.3s ease-in-out",
        }}
        onMouseEnter={(e) => {
          const icon: any = e.currentTarget.querySelector(".hover-icon");
          icon.style.opacity = 1;
          icon.style.transform = "translate(100%, -100%) scale(1)";
        }}
        onMouseLeave={(e) => {
          const icon: any = e.currentTarget.querySelector(".hover-icon");
          hideTimeoutRef.current = setTimeout(() => {
            icon.style.opacity = 0;
            icon.style.transform = "translate(100%, -100%) scale(0.8)";
          }, 3000);
        }}
      >
        {label}
        <MapsUgcIcon
          className="hover-icon"
          onClick={() => setDisplayComments(true)}
          sx={{
            position: "absolute",
            top: "0",
            right: "0",
            transform: "translate(100%, -100%) scale(0.8)",
            transition: "all 0.1s ease",
            opacity: 0,
            fontSize: "1rem",
            cursor: "pointer",
            pointerEvents: "auto",
          }}
        />
        {displayComments && (
          <Box
            sx={{
              position: "absolute",
              left: "110%",
              transform: "translate(0,-50%)",
              width: "300px",
              height: "400px",
              border: "1px solid black",
              borderRadius: "5px",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box>
              <h1
                style={{
                  borderBottom: "1px solid black",
                  padding: "0.5rem",
                  textAlign: "left",
                }}
              >
                Comments
              </h1>
            </Box>
            <NodeComments nodeId={id} />
            <IconButton
              sx={{
                position: "absolute",
                top: "0",
                right: "0",
              }}
              onClick={() => setDisplayComments(false)}
            >
              <ClearIcon />
            </IconButton>
          </Box>
        )}
      </div>
      {handles?.length > 0 &&
        handles.map(
          (
            handle: {
              type: "source" | "target";
              position: "Bottom" | "Top" | "Left" | "Rigth";
              id: string;
            },
            index: number
          ) => (
            <Handle
              key={index}
              type={handle.type}
              position={Position[handle.position as keyof typeof Position]}
              id={handle.id}
            />
          )
        )}
    </>
  );
}
