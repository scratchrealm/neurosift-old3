import { isNSProject, NSProject } from "../src/types/neurosift-types"
import { getMongoClient } from "./getMongoClient"
import ObjectCache from "./ObjectCache"
import removeIdField from "./removeIdField"

const projectCache = new ObjectCache<NSProject>(1000 * 60 * 1)

const getProject = async (projectId: string, o: {useCache: boolean}) => {
    if (o.useCache) {
        const cachedProject = projectCache.get(projectId)
        if (cachedProject) {
            return cachedProject
        }
    }
    const client = await getMongoClient()
    const projectsCollection = client.db('neurosift').collection('projects')
    const project = removeIdField(await projectsCollection.findOne({projectId}))
    if (!project) {
        throw new Error('Project not found')
    }
    if (!isNSProject(project)) {
        console.warn(project)
        throw new Error('Invalid projects in database')
    }
    projectCache.set(projectId, project)
    return project
}

export const invalidateProjectCache = (projectId: string) => {
    projectCache.delete(projectId)
}

export default getProject