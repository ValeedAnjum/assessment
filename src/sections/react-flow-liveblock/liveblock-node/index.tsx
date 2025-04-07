import { Handle, Position } from "@xyflow/react";

export function LiveBlockNode({ data }: any) {
  const { label, handles } = data;
  return (
    <>
      <div
        style={{
          padding: "12px",
          width: "150px",
          textAlign: "center",
          borderRadius: "5px",
        }}
      >
        {label}
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
