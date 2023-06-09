import { DeleteProjectFileRequest, DeleteProjectFileResponse } from "../../src/types/NeurosiftRequest";
import getProject from '../getProject';
import { getMongoClient } from "../getMongoClient";
import getWorkspace from '../getWorkspace';
import { userCanDeleteProjectFile } from "../permissions";

const deleteProjectFileHandler = async (request: DeleteProjectFileRequest, o: {verifiedUserId?: string}): Promise<DeleteProjectFileResponse> => {
    const {verifiedUserId} = o

    const projectId = request.projectId

    const client = await getMongoClient()

    const project = await getProject(projectId, {useCache: false})
    if (project.workspaceId !== request.workspaceId) {
        throw new Error('Incorrect workspace ID')
    }

    const workspace = await getWorkspace(project.workspaceId, {useCache: true})
    if (!userCanDeleteProjectFile(workspace, verifiedUserId)) {
        throw new Error('User does not have permission to delete an projects file in this workspace')
    }

    const projectFilesCollection = client.db('neurosift').collection('projectFiles')

    const projectFile = await projectFilesCollection.findOne({
        projectId,
        fileName: request.fileName
    })
    if (!projectFile) {
        throw new Error('Project file does not exist')
    }

    await projectFilesCollection.deleteOne({
        projectId,
        fileName: request.fileName
    })

    // remove data blobs that are no longer referenced
    const contentSha1s = await projectFilesCollection.distinct('contentSha1', {projectId})
    const dataBlobsCollection = client.db('neurosift').collection('dataBlobs')
    await dataBlobsCollection.deleteMany({
        projectId,
        sha1: {$nin: contentSha1s}
    })
    
    return {
        type: 'deleteProjectFile'
    }
}

export default deleteProjectFileHandler