import { VercelRequest, VercelResponse } from '@vercel/node'
import githubVerifyAccessToken from '../apiHelpers/githubVerifyAccessToken'
import cloneProjectHandler from '../apiHelpers/NeurosiftRequestHandlers/cloneProjectHandler'
import createProjectHandler from '../apiHelpers/NeurosiftRequestHandlers/createProjectHandler'
import createWorkspaceHandler from '../apiHelpers/NeurosiftRequestHandlers/createWorkspaceHandler'
import deleteProjectFileHandler from '../apiHelpers/NeurosiftRequestHandlers/deleteProjectFileHandler'
import deleteProjectHandler from '../apiHelpers/NeurosiftRequestHandlers/deleteProjectHandler'
import deleteWorkspaceHandler from '../apiHelpers/NeurosiftRequestHandlers/deleteWorkspaceHandler'
import duplicateProjectFileHandler from '../apiHelpers/NeurosiftRequestHandlers/duplicateProjectFileHandler'
import getDataBlobHandler from '../apiHelpers/NeurosiftRequestHandlers/getDataBlobHandler'
import getProjectFileHandler from '../apiHelpers/NeurosiftRequestHandlers/getProjectFileHandler'
import getProjectFilesHandler from '../apiHelpers/NeurosiftRequestHandlers/getProjectFilesHandler'
import getProjectHandler from '../apiHelpers/NeurosiftRequestHandlers/getProjectHandler'
import getProjectsHandler from '../apiHelpers/NeurosiftRequestHandlers/getProjectsHandler'
import getWorkspaceHandler from '../apiHelpers/NeurosiftRequestHandlers/getWorkspaceHandler'
import getWorkspacesHandler from '../apiHelpers/NeurosiftRequestHandlers/getWorkspacesHandler'
import renameProjectFileHandler from '../apiHelpers/NeurosiftRequestHandlers/renameProjectFileHandler'
import setProjectFileHandler from '../apiHelpers/NeurosiftRequestHandlers/setProjectFileHandler'
import setProjectPropertyHandler from '../apiHelpers/NeurosiftRequestHandlers/setProjectPropertyHandler'
import setWorkspacePropertyHandler from '../apiHelpers/NeurosiftRequestHandlers/setWorkspacePropertyHandler'
import setWorkspaceUsersHandler from '../apiHelpers/NeurosiftRequestHandlers/setWorkspaceUsersHandler'
import getProjectResourcesHandler from '../apiHelpers/NeurosiftRequestHandlers/getProjectResourcesHandler'
import getProjectResourceHandler from '../apiHelpers/NeurosiftRequestHandlers/getProjectResourceHandler'
import addProjectResourceHandler from '../apiHelpers/NeurosiftRequestHandlers/addProjectResourceHandler'
import deleteProjectResourceHandler from '../apiHelpers/NeurosiftRequestHandlers/deleteProjectResourceHandler'
import renameProjectResourceHandler from '../apiHelpers/NeurosiftRequestHandlers/renameProjectResourceHandler'
import { isAddProjectResourceRequest, isCloneProjectRequest, isCreateProjectRequest, isCreateWorkspaceRequest, isDeleteProjectFileRequest, isDeleteProjectRequest, isDeleteProjectResourceRequest, isDeleteWorkspaceRequest, isDuplicateProjectFileRequest, isGetDataBlobRequest, isGetProjectFileRequest, isGetProjectFilesRequest, isGetProjectRequest, isGetProjectResourceRequest, isGetProjectResourcesRequest, isGetProjectsRequest, isGetWorkspaceRequest, isGetWorkspacesRequest, isNeurosiftRequest, isRenameProjectFileRequest, isRenameProjectResourceRequest, isSetProjectFileRequest, isSetProjectPropertyRequest, isSetWorkspacePropertyRequest, isSetWorkspaceUsersRequest } from '../src/types/NeurosiftRequest'

const ADMIN_USER_IDS = JSON.parse(process.env.ADMIN_USER_IDS || '[]') as string[]

module.exports = (req: VercelRequest, res: VercelResponse) => {
    const {body: request} = req

    // CORS ///////////////////////////////////
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    if ([
        'http://localhost:3000',
        'http://localhost:5173',
        'https://flatironinstitute.github.io', // this is important for mcmc monitor
        'https://scratchrealm.github.io'
    ].includes(req.headers.origin || '')) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '')
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    ///////////////////////////////////////////

    if (!isNeurosiftRequest(request)) {
        res.status(400).send(`Invalid request: ${JSON.stringify(request)}`)
        return
    }

    const { payload, userId, githubAccessToken } = request
    const { timestamp } = payload
    const elapsed = (Date.now() / 1000) - timestamp
    if ((elapsed > 30) || (elapsed < -30)) { 
        // Note the range used to be narrower, but was running into problems
        // For example, got elapsed = -0.662
        // Not sure the best way to do this check
        throw Error(`Invalid timestamp. ${timestamp} ${Date.now() / 1000} ${elapsed}`)
    }

    (async () => {
        let verifiedUserId: string | undefined = undefined
        if ((userId) && (userId.startsWith('github|')) && (githubAccessToken)) {
            if (!(await githubVerifyAccessToken(userId.slice('github|'.length), githubAccessToken))) {
                throw Error('Unable to verify github user ID')
            }
            verifiedUserId = userId
        }
        else if ((userId) && (userId.startsWith('admin|'))) {
            const x = userId.slice('admin|'.length)
            if (!ADMIN_USER_IDS.includes(x)) {
                throw Error('Invalid admin user ID')
            }
            if (!x.startsWith('github|')) {
                throw Error('Invalid admin user ID (does not start with github|)')
            }
            if (!(await githubVerifyAccessToken(x.slice('github|'.length), githubAccessToken))) {
                throw Error('Unable to verify github user ID (for admin)')
            }
            verifiedUserId = userId
        }
        
        if (isGetWorkspacesRequest(payload)) {
            return await getWorkspacesHandler(payload, {verifiedUserId})
        }
        else if (isGetWorkspaceRequest(payload)) {
            return await getWorkspaceHandler(payload, {verifiedUserId})
        }
        else if (isCreateWorkspaceRequest(payload)) {
            return await createWorkspaceHandler(payload, {verifiedUserId})
        }
        else if (isGetProjectsRequest(payload)) {
            return await getProjectsHandler(payload, {verifiedUserId})
        }
        else if (isGetProjectRequest(payload)) {
            return await getProjectHandler(payload, {verifiedUserId})
        }
        else if (isCreateProjectRequest(payload)) {
            return await createProjectHandler(payload, {verifiedUserId})
        }
        else if (isDeleteWorkspaceRequest(payload)) {
            return await deleteWorkspaceHandler(payload, {verifiedUserId})
        }
        else if (isGetProjectFilesRequest(payload)) {
            return await getProjectFilesHandler(payload, {verifiedUserId})
        }
        else if (isSetProjectFileRequest(payload)) {
            return await setProjectFileHandler(payload, {verifiedUserId})
        }
        else if (isGetProjectFileRequest(payload)) {
            return await getProjectFileHandler(payload, {verifiedUserId})
        }
        else if (isGetProjectResourcesRequest(payload)) {
            return await getProjectResourcesHandler(payload, {verifiedUserId})
        }
        else if (isGetProjectResourceRequest(payload)) {
            return await getProjectResourceHandler(payload, {verifiedUserId})
        }
        else if (isAddProjectResourceRequest(payload)) {
            return await addProjectResourceHandler(payload, {verifiedUserId})
        }
        else if (isDeleteProjectResourceRequest(payload)) {
            return await deleteProjectResourceHandler(payload, {verifiedUserId})
        }
        else if (isRenameProjectResourceRequest(payload)) {
            return await renameProjectResourceHandler(payload, {verifiedUserId})
        }
        else if (isSetWorkspaceUsersRequest(payload)) {
            return await setWorkspaceUsersHandler(payload, {verifiedUserId})
        }
        else if (isSetWorkspacePropertyRequest(payload)) {
            return await setWorkspacePropertyHandler(payload, {verifiedUserId})
        }
        else if (isGetDataBlobRequest(payload)) {
            return await getDataBlobHandler(payload, {verifiedUserId})
        }
        else if (isDeleteProjectRequest(payload)) {
            return await deleteProjectHandler(payload, {verifiedUserId})
        }
        else if (isCloneProjectRequest(payload)) {
            return await cloneProjectHandler(payload, {verifiedUserId})
        }
        else if (isSetProjectPropertyRequest(payload)) {
            return await setProjectPropertyHandler(payload, {verifiedUserId})
        }
        else if (isDeleteProjectFileRequest(payload)) {
            return await deleteProjectFileHandler(payload, {verifiedUserId})
        }
        else if (isDuplicateProjectFileRequest(payload)) {
            return await duplicateProjectFileHandler(payload, {verifiedUserId})
        }
        else if (isRenameProjectFileRequest(payload)) {
            return await renameProjectFileHandler(payload, {verifiedUserId})
        }
        else {
            throw Error(`Unexpected request type: ${(payload as any).type}`)
        }
    })().then((response) => {
        res.json(response)
    }).catch((error: Error) => {
        console.warn(error.message)
        res.status(500).send(`Error: ${error.message}`)
    })
}