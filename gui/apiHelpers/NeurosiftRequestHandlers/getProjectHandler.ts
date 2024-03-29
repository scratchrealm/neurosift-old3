import { GetProjectRequest, GetProjectResponse } from "../../src/types/NeurosiftRequest";
import getProject from "../getProject";
import getWorkspace from "../getWorkspace";
import { userCanReadWorkspace } from "../permissions";

const getProjectHandler = async (request: GetProjectRequest, o: {verifiedUserId?: string}): Promise<GetProjectResponse> => {
    const project = await getProject(request.projectId, {useCache: false})

    const workspaceId = project.workspaceId
    const workspace = await getWorkspace(workspaceId, {useCache: true})
    if (!userCanReadWorkspace(workspace, o.verifiedUserId)) {
        throw new Error('User does not have permission to read this workspace')
    }

    return {
        type: 'getProject',
        project
    }
}

export default getProjectHandler