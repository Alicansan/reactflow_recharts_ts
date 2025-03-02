import React, { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { useData } from "../context/DataContext";

interface UserNodeProps {
  id: string;
  data: {
    label: string;
    userId: string;
    role: string
  };
}

const UserNode: React.FC<UserNodeProps> = ({ data }) => {
  const { removeUser } = useData();

 

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (
        window.confirm(
          `${data.label} kullanıcısını silmek istediğinize emin misiniz?`,
        )
      ) {
        removeUser(data.userId);
      }
    },
    [data.label, data.userId, removeUser],
  );

  return (
    <div
      className="rounded border border-green-300 bg-green-100 p-3"
      onContextMenu={handleContextMenu}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="font-medium">{data.label}</div>
      <div className="font-medium">{data?.role}</div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default UserNode;
