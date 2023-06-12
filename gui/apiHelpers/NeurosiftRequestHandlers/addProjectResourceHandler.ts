import { NSProjectResource } from "../../src/types/neurosift-types";
import { AddProjectResourceRequest, AddProjectResourceResponse } from "../../src/types/NeurosiftRequest";
import { getMongoClient } from "../getMongoClient";
import getProject from '../getProject';
import getWorkspace from '../getWorkspace';
import { userCanAddProjectResource } from '../permissions';

const addProjectResourceHandler = async (request: AddProjectResourceRequest, o: {verifiedUserId?: string}): Promise<AddProjectResourceResponse> => {
    const {verifiedUserId} = o

    const projectId = request.projectId

    const client = await getMongoClient()

    const project = await getProject(projectId, {useCache: false})
    if (project.workspaceId !== request.workspaceId) {
        throw new Error('Incorrect workspace ID')
    }

    const workspaceId = project.workspaceId

    const workspace = await getWorkspace(project.workspaceId, {useCache: true})
    if (!userCanAddProjectResource(workspace, verifiedUserId)) {
        throw new Error('User does not have permission to add a project resource in this workspace')
    }

    const projectResourcesCollection = client.db('neurosift').collection('projectResources')

    const projectResource = await projectResourcesCollection.findOne({
        projectId,
        resourceName: request.resourceName
    })
    if (projectResource) {
        throw new Error('Project resource already exists')
    }
    const newProjectResource: NSProjectResource = {
        projectId,
        workspaceId,
        resourceName: request.resourceName,
        resourceType: request.resourceType,
        resourceFormat: request.resourceFormat,
        timestampCreated: Date.now() / 1000,
        uri: request.uri
    }
    await projectResourcesCollection.insertOne(newProjectResource)

    const projectsCollection = client.db('neurosift').collection('projects')
    await projectsCollection.updateOne({projectId}, {$set: {timestampModified: Date.now() / 1000}})

    const workspacesCollection = client.db('neurosift').collection('workspaces')
    await workspacesCollection.updateOne({workspaceId}, {$set: {timestampModified: Date.now() / 1000}})

    return {
        type: 'addProjectResource'
    }
}

export default addProjectResourceHandler