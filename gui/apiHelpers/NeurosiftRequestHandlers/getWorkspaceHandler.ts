import { GetWorkspaceRequest, GetWorkspaceResponse } from "../../src/types/NeurosiftRequest";
import getWorkspace from "../getWorkspace";
import { userCanReadWorkspace } from "../permissions";

const getWorkspaceHandler = async (request: GetWorkspaceRequest, o: {verifiedUserId?: string}): Promise<GetWorkspaceResponse> => {
    const workspace = await getWorkspace(request.workspaceId, {useCache: false})

    if (!userCanReadWorkspace(workspace, o.verifiedUserId)) {
        throw new Error('User does not have permission to read this workspace')
    }

    return {
        type: 'getWorkspace',
        workspace
    }
}

export default getWorkspaceHandler