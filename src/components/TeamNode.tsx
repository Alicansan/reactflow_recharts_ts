import React from "react";
import { Handle, Position } from "@xyflow/react";


interface TeamNodeProps {
  id: string;
  data: {
    label: string;
    teamId: string;
    description: string;
    isExpanded: boolean;
    childrenIds: string[];
  };
}

const TeamNode: React.FC<TeamNodeProps> = ({ data }) => {
  

  
  return (
    <div className="min-w-40 rounded border border-blue-300 bg-blue-100 p-3 hover:bg-blue-200">
      <Handle type="target" position={Position.Top} />

      <div className="font-semibold">{data.label}</div>
      <div className="font-medium">{data?.description } </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default TeamNode;
