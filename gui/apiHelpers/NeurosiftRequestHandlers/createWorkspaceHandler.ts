import { CreateWorkspaceRequest, CreateWorkspaceResponse } from "../../src/types/NeurosiftRequest";
import { NSWorkspace } from "../../src/types/neurosift-types";
import createRandomId from "../createRandomId";
import { getMongoClient } from "../getMongoClient";
import { userCanCreateWorkspace } from "../permissions";

const createWorkspaceHandler = async (request: CreateWorkspaceRequest, o: {verifiedUserId?: string}): Promise<CreateWorkspaceResponse> => {
    const {verifiedUserId} = o

    if (!userCanCreateWorkspace(verifiedUserId)) {
        throw new Error('User does not have permission to create a workspace')
    }
    if (!verifiedUserId) {
        throw Error('Unexpected: no user ID')
    }

    const workspaceId = createRandomId(8)

    const workspace: NSWorkspace = {
        workspaceId,
        ownerId: verifiedUserId,
        name: request.name,
        description: '',
        users: [],
        publiclyReadable: true,
        listed: false,
        timestampCreated: Date.now() / 1000,
        timestampModified: Date.now() / 1000
    }

    const client = await getMongoClient()
    const workspacesCollection = client.db('neurosift').collection('workspaces')

    await workspacesCollection.insertOne(workspace)

    return {
        type: 'createWorkspace',
        workspaceId
    }
}

export default createWorkspaceHandler