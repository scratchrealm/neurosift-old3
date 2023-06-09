import { DeleteWorkspaceRequest, DeleteWorkspaceResponse } from "../../src/types/NeurosiftRequest";
import { getMongoClient } from "../getMongoClient";
import getWorkspace from "../getWorkspace";
import { userCanDeleteWorkspace } from "../permissions";

const deleteWorkspaceHandler = async (request: DeleteWorkspaceRequest, o: {verifiedUserId?: string}): Promise<DeleteWorkspaceResponse> => {
    const {verifiedUserId} = o

    const client = await getMongoClient()

    const workspace = await getWorkspace(request.workspaceId, {useCache: false})
    if (!userCanDeleteWorkspace(workspace, verifiedUserId)) {
        throw new Error('User does not have permission to delete this workspace')
    }

    const projectsCollection = client.db('neurosift').collection('projects')
    projectsCollection.deleteMany({workspaceId: request.workspaceId})

    const projectFilesCollection = client.db('neurosift').collection('projectFiles')
    projectFilesCollection.deleteMany({workspaceId: request.workspaceId})

    const dataBlobsCollection = client.db('neurosift').collection('dataBlobs')
    dataBlobsCollection.deleteMany({workspaceId: request.workspaceId})

    const workspacesCollection = client.db('neurosift').collection('workspaces')
    await workspacesCollection.deleteOne({workspaceId: request.workspaceId})

    return {
        type: 'deleteWorkspace'
    }
}

export default deleteWorkspaceHandler