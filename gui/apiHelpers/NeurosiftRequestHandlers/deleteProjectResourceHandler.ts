import { DeleteProjectResourceRequest, DeleteProjectResourceResponse } from "../../src/types/NeurosiftRequest";
import getProject from '../getProject';
import { getMongoClient } from "../getMongoClient";
import getWorkspace from '../getWorkspace';
import { userCanDeleteProjectResource } from "../permissions";

const deleteProjectResourceHandler = async (request: DeleteProjectResourceRequest, o: {verifiedUserId?: string}): Promise<DeleteProjectResourceResponse> => {
    const {verifiedUserId} = o

    const projectId = request.projectId

    const client = await getMongoClient()

    const project = await getProject(projectId, {useCache: false})
    if (project.workspaceId !== request.workspaceId) {
        throw new Error('Incorrect workspace ID')
    }

    const workspace = await getWorkspace(project.workspaceId, {useCache: true})
    if (!userCanDeleteProjectResource(workspace, verifiedUserId)) {
        throw new Error('User does not have permission to delete a project resource in this workspace')
    }

    const projectResourcesCollection = client.db('neurosift').collection('projectResources')

    const projectResource = await projectResourcesCollection.findOne({
        projectId,
        resourceName: request.resourceName
    })
    if (!projectResource) {
        throw new Error('Project resource does not exist')
    }

    await projectResourcesCollection.deleteOne({
        projectId,
        resourceName: request.resourceName
    })
    
    return {
        type: 'deleteProjectResource'
    }
}

export default deleteProjectResourceHandler