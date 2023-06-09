import { DeleteProjectRequest, DeleteProjectResponse } from "../../src/types/NeurosiftRequest";
import getProject from "../getProject";
import { getMongoClient } from "../getMongoClient";
import getWorkspace from "../getWorkspace";
import { userCanDeleteProject } from "../permissions";

const deleteProjectHandler = async (request: DeleteProjectRequest, o: {verifiedUserId?: string}): Promise<DeleteProjectResponse> => {
    const {verifiedUserId} = o

    const client = await getMongoClient()

    const workspace = await getWorkspace(request.workspaceId, {useCache: false})
    if (!userCanDeleteProject(workspace, verifiedUserId)) {
        throw new Error('User does not have permission to delete an projects in this workspace')
    }

    const project = await getProject(request.projectId, {useCache: false})
    if (project.workspaceId !== request.workspaceId) {
        throw new Error('Incorrect workspace ID')
    }

    const projectFilesCollection = client.db('neurosift').collection('projectFiles')
    projectFilesCollection.deleteMany({projectId: request.projectId})

    const dataBlobsCollection = client.db('neurosift').collection('dataBlobs')
    dataBlobsCollection.deleteMany({projectId: request.projectId})

    const projectsCollection = client.db('neurosift').collection('projects')

    await projectsCollection.deleteOne({projectId: request.projectId})

    const workspacesCollection = client.db('neurosift').collection('workspaces')
    await workspacesCollection.updateOne({workspaceId: request.workspaceId}, {$set: {timestampModified: Date.now() / 1000}})

    return {
        type: 'deleteProject'
    }
}

export default deleteProjectHandler