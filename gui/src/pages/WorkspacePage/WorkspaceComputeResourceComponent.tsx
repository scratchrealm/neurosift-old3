import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { useWorkspace } from "./WorkspacePageContext";

type Props = {
    // none
}

const WorkspaceComputeResourceComponent: FunctionComponent<Props> = () => {
    const {workspace, workspaceRole} = useWorkspace()
    const [editing, setEditing] = useState(false)

    return (
        <div>
            {
                workspace && !editing && workspaceRole === 'admin' && (
                    <IconButton onClick={() => setEditing(true)} title="Select a different compute resource">
                        <Edit />
                    </IconButton>
                )
            }
        </div>
    )
}

export default WorkspaceComputeResourceComponent;