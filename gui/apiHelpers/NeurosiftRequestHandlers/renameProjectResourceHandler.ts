import { RenameProjectResourceRequest, RenameProjectResourceResponse } from "../../src/types/NeurosiftRequest";
import { getMongoClient } from "../getMongoClient";
import getProject from '../getProject';
import getWorkspace from '../getWorkspace';
import getWorkspaceRole from "../getWorkspaceRole";
import removeIdField from "../removeIdField";

const renameProjectResourceHandler = async (request: RenameProjectResourceRequest, o: {verifiedUserId?: string}): Promise<RenameProjectResourceResponse> => {
    const {verifiedUserId} = o

    const projectId = request.projectId

    const client = await getMongoClient()

    const project = await getProject(projectId, {useCache: false})
    if (project.workspaceId !== request.workspaceId) {
        throw new Error('Incorrect workspace ID')
    }

    const workspace = await getWorkspace(project.workspaceId, {useCache: true})
    const workspaceRole = getWorkspaceRole(workspace, verifiedUserId)
    const canEdit = workspaceRole === 'admin' || workspaceRole === 'editor'
    if (!canEdit) {
        throw new Error('User does not have permission to rename a project resource in this workspace')
    }

    const projectResourcesCollection = client.db('neurosift').collection('projectResources')

    const projectResource = removeIdField(await projectResourcesCollection.findOne({
        projectId,
        resourceName: request.resourceName
    }))
    if (!projectResource) {
        throw new Error('Project resource does not exist')
    }

    const existingProjectResource = await projectResourcesCollection.findOne({
        projectId,
        resourceName: request.newResourceName
    })
    if (existingProjectResource) {
        throw new Error('Project resource already exists')
    }

    await projectResourcesCollection.updateOne({
        projectId,
        resourceName: request.resourceName
    }, {
        $set: {
            resourceName: request.newResourceName
        }
    })
    
    return {
        type: 'renameProjectResource'
    }
}

export default renameProjectResourceHandler