import { isNSWorkspace, NSWorkspace } from "../src/types/neurosift-types"
import { getMongoClient } from "./getMongoClient"
import removeIdField from "./removeIdField"
import ObjectCache from './ObjectCache'

const workspaceCache = new ObjectCache<NSWorkspace>(1000 * 60 * 1)

const getWorkspace = async (workspaceId: string, o: {useCache: boolean}) => {
    if (o.useCache) {
        const cachedWorkspace = workspaceCache.get(workspaceId)
        if (cachedWorkspace) {
            return cachedWorkspace
        }
    }
    const client = await getMongoClient()
    const workspacesCollection = client.db('neurosift').collection('workspaces')
    const workspace = removeIdField(await workspacesCollection.findOne({workspaceId}))
    if (!workspace) {
        throw new Error(`Workspace ${workspaceId} not found (1)`)
    }
    if (!isNSWorkspace(workspace)) {
        console.warn(workspace)
        throw new Error('Invalid workspace in database (**)')
    }
    workspaceCache.set(workspaceId, workspace)
    return workspace
}

export const invalidateWorkspaceCache = (workspaceId: string) => {
    workspaceCache.delete(workspaceId)
}

export default getWorkspace