import { GetProjectResourcesRequest, GetProjectResourcesResponse } from "../../src/types/NeurosiftRequest";
import { isNSProjectResource } from "../../src/types/neurosift-types";
import getProject from "../getProject";
import { getMongoClient } from "../getMongoClient";
import getWorkspace from "../getWorkspace";
import { userCanReadWorkspace } from "../permissions";
import removeIdField from "../removeIdField";

const getProjectResourcesHandler = async (request: GetProjectResourcesRequest, o: {verifiedUserId?: string}): Promise<GetProjectResourcesResponse> => {
    const client = await getMongoClient()
    const projectResourcesCollection = client.db('neurosift').collection('projectResources')

    const project = await getProject(request.projectId, {useCache: true})
    
    const workspaceId = project.workspaceId
    const workspace = await getWorkspace(workspaceId, {useCache: true})
    if (!userCanReadWorkspace(workspace, o.verifiedUserId)) {
        throw new Error('User does not have permission to read this workspace')
    }

    const projectResources = removeIdField(await projectResourcesCollection.find({
        projectId: request.projectId
    }).toArray())
    for (const projectResource of projectResources) {
        if (!isNSProjectResource(projectResource)) {
            console.warn(projectResource)

            // // during development only:
            // await projectResourcesCollection.deleteOne({
            //     projectId: request.projectId,
            //     resourceName: projectResource.resourceName
            // })

            throw new Error('Invalid project resource in database (3)')
        }
    }
    return {
        type: 'getProjectResources',
        projectResources
    }
}

export default getProjectResourcesHandler