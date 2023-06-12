import { GetProjectResourceRequest, GetProjectResourceResponse } from "../../src/types/NeurosiftRequest";
import { isNSProjectResource } from "../../src/types/neurosift-types";
import { getMongoClient } from "../getMongoClient";
import removeIdField from "../removeIdField";

const getProjectResourceHandler = async (request: GetProjectResourceRequest, o: {verifiedUserId?: string}): Promise<GetProjectResourceResponse> => {
    const client = await getMongoClient()
    const projectResourcesCollection = client.db('neurosift').collection('projectResources')
    
    const projectResource = removeIdField(await projectResourcesCollection.findOne({
        projectId: request.projectId,
        resourceName: request.resourceName
    }))
    if (!projectResource) {
        throw Error('Project resource not found')
    }
    if (!isNSProjectResource(projectResource)) {
        console.warn(projectResource)
        throw new Error('Invalid project resource in database (2)')
    }

    // For now we allow anonymous users to read project resources
    // const workspace = await getWorkspace(projectResource.workspaceId, {useCache: true})
    // if (!userCanReadWorkspace(workspace, o.verifiedUserId)) {
    //     throw new Error('User does not have permission to read this workspace')
    // }

    return {
        type: 'getProjectResource',
        projectResource
    }
}

export default getProjectResourceHandler