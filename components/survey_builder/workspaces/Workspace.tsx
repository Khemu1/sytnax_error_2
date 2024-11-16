// Workspace.jsx
import React from "react";
import Image from "next/image";
import { WorkspaceProps } from "@/types/survey";

const Workspace: React.FC<WorkspaceProps> = ({
  selected,
  workspace,
  onSelect,
  length,
}) => {
  return (
    <div
      className={`workspace flex  ${selected ? "workspace_selected" : ""}`}
      onClick={() => onSelect(workspace)}
    >
      <div className="flex items-center gap-2">
        <div>
          <Image
            src="/assets/icons/folder.svg"
            alt="Folder icon"
            width={20}
            height={20}
          />
        </div>
        <p className="font-semibold text-ellipsis overflow-hidden px-2 text-nowrap whitespace-nowrap">
          {workspace.title}
        </p>
      </div>

      <div>
        <p>{length}</p>
      </div>
    </div>
  );
};

export default Workspace;
