import { GetDataBlobRequest, GetDataBlobResponse } from "../../src/types/NeurosiftRequest";
import { isNSDataBlob } from "../../src/types/neurosift-types";
import { getMongoClient } from "../getMongoClient";
import removeIdField from "../removeIdField";

const getDataBlobHandler = async (request: GetDataBlobRequest, o: {verifiedUserId?: string}): Promise<GetDataBlobResponse> => {
    const client = await getMongoClient()
    const dataBlobsCollection = client.db('neurosift').collection('dataBlobs')

    // For now we allow anonymous users to read data blobs because this is needed for the MCMC Monitor to work
    // const workspace = await getWorkspace(request.workspaceId, {useCache: true})
    // if (!userCanReadWorkspace(workspace, o.verifiedUserId)) {
    //     throw new Error('User does not have permission to read this workspace')
    // }
    
    const dataBlob = removeIdField(await dataBlobsCollection.findOne({
        workspaceId: request.workspaceId,
        projectId: request.projectId,
        sha1: request.sha1
    }))
    if (!dataBlob) {
        throw Error('Data blob not found')
    }
    if (!isNSDataBlob(dataBlob)) {
        console.warn(dataBlob)
        throw new Error('Invalid data blob in database')
    }

    return {
        type: 'getDataBlob',
        content: dataBlob.content
    }
}

export default getDataBlobHandler