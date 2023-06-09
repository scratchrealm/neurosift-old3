import { NSProject, NSProjectFile, NSWorkspace } from "../types/neurosift-types";
import { CloneProjectRequest, CreateProjectRequest, CreateWorkspaceRequest, DeleteProjectFileRequest, DeleteProjectRequest, DeleteWorkspaceRequest, DuplicateProjectFileRequest, GetDataBlobRequest, GetProjectFileRequest, GetProjectFilesRequest, GetProjectRequest, GetProjectsRequest, GetWorkspaceRequest, GetWorkspacesRequest, RenameProjectFileRequest, SetProjectFileRequest, SetProjectPropertyRequest, SetWorkspacePropertyRequest, SetWorkspaceUsersRequest } from "../types/NeurosiftRequest";
import postNeurosiftRequest from "./postNeurosiftRequest";

export const fetchWorkspaces = async (auth: Auth): Promise<NSWorkspace[]> => {
    const req: GetWorkspacesRequest = {
        type: 'getWorkspaces',
        timestamp: Date.now() / 1000
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'getWorkspaces') {
        throw Error(`Unexpected response type ${resp.type}. Expected getWorkspaces.`)
    }
    return resp.workspaces
}

export const fetchWorkspace = async (workspaceId: string, auth: Auth): Promise<NSWorkspace | undefined> => {
    const req: GetWorkspaceRequest = {
        type: 'getWorkspace',
        timestamp: Date.now() / 1000,
        workspaceId
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'getWorkspace') {
        throw Error(`Unexpected response type ${resp.type}. Expected getWorkspace.`)
    }
    return resp.workspace
}

type Auth = {
    githubAccessToken?: string
}

export const createWorkspace = async (workspaceName: string, auth: Auth): Promise<string> => {
    const req: CreateWorkspaceRequest = {
        type: 'createWorkspace',
        timestamp: Date.now() / 1000,
        name: workspaceName
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'createWorkspace') {
        throw Error(`Unexpected response type ${resp.type}. Expected createWorkspace.`)
    }
    return resp.workspaceId
}

export const fetchProjects = async (workspaceId: string, auth: Auth): Promise<NSProject[]> => {
    const req: GetProjectsRequest = {
        type: 'getProjects',
        timestamp: Date.now() / 1000,
        workspaceId
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'getProjects') {
        throw Error(`Unexpected response type ${resp.type}. Expected getProjects.`)
    }
    return resp.projects
}

export const createProject = async (workspaceId: string, projectName: string, auth: Auth): Promise<string> => {
    const req: CreateProjectRequest = {
        type: 'createProject',
        timestamp: Date.now() / 1000,
        workspaceId,
        name: projectName
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'createProject') {
        throw Error(`Unexpected response type ${resp.type}. Expected createProject.`)
    }
    return resp.projectId
}

export const setWorkspaceUsers = async (workspaceId: string, users: {userId: string, role: 'admin' | 'editor' | 'viewer'}[], auth: Auth): Promise<void> => {
    const req: SetWorkspaceUsersRequest = {
        type: 'setWorkspaceUsers',
        timestamp: Date.now() / 1000,
        workspaceId,
        users
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'setWorkspaceUsers') {
        throw Error(`Unexpected response type ${resp.type}. Expected setWorkspaceUsers.`)
    }
}

export const setWorkspaceProperty = async (workspaceId: string, property: 'name' | 'publiclyReadable' | 'listed' | 'computeResourceId', value: any, auth: Auth): Promise<void> => {
    const req: SetWorkspacePropertyRequest = {
        type: 'setWorkspaceProperty',
        timestamp: Date.now() / 1000,
        workspaceId,
        property,
        value
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'setWorkspaceProperty') {
        throw Error(`Unexpected response type ${resp.type}. Expected setWorkspaceProperty.`)
    }
}


export const deleteWorkspace = async (workspaceId: string, auth: Auth): Promise<void> => {
    const req: DeleteWorkspaceRequest = {
        type: 'deleteWorkspace',
        timestamp: Date.now() / 1000,
        workspaceId
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'deleteWorkspace') {
        throw Error(`Unexpected response type ${resp.type}. Expected deleteWorkspace.`)
    }
}

export const fetchProject = async (projectId: string, auth: Auth): Promise<NSProject | undefined> => {
    const req: GetProjectRequest = {
        type: 'getProject',
        timestamp: Date.now() / 1000,
        projectId
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'getProject') {
        throw Error(`Unexpected response type ${resp.type}. Expected getProject.`)
    }
    return resp.project
}

export const fetchProjectFiles = async (projectId: string, auth: Auth): Promise<NSProjectFile[]> => {
    const req: GetProjectFilesRequest = {
        type: 'getProjectFiles',
        timestamp: Date.now() / 1000,
        projectId
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'getProjectFiles') {
        throw Error(`Unexpected response type ${resp.type}. Expected getProjectFiles.`)
    }
    return resp.projectFiles
}

export const fetchProjectFile = async (projectId: string, fileName: string, auth: Auth): Promise<NSProjectFile | undefined> => {
    const req: GetProjectFileRequest = {
        type: 'getProjectFile',
        timestamp: Date.now() / 1000,
        projectId,
        fileName
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'getProjectFile') {
        throw Error(`Unexpected response type ${resp.type}. Expected getProjectFile.`)
    }
    return resp.projectFile
}

export const fetchDataBlob = async (workspaceId: string, projectId: string, sha1: string, auth: Auth): Promise<string | undefined> => {
    const req: GetDataBlobRequest = {
        type: 'getDataBlob',
        timestamp: Date.now() / 1000,
        workspaceId,
        projectId,
        sha1
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'getDataBlob') {
        throw Error(`Unexpected response type ${resp.type}. Expected getDataBlob.`)
    }
    return resp.content
}

export const setProjectFileContent = async (workspaceId: string, projectId: string, fileName: string, fileContent: string, auth: Auth): Promise<void> => {
    const req: SetProjectFileRequest = {
        type: 'setProjectFile',
        timestamp: Date.now() / 1000,
        projectId,
        workspaceId,
        fileName,
        fileContent
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'setProjectFile') {
        throw Error(`Unexpected response type ${resp.type}. Expected setProjectFile.`)
    }
}

export const deleteProjectFile = async (workspaceId: string, projectId: string, fileName: string, auth: Auth): Promise<void> => {
    const req: DeleteProjectFileRequest = {
        type: 'deleteProjectFile',
        timestamp: Date.now() / 1000,
        projectId,
        workspaceId,
        fileName
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'deleteProjectFile') {
        throw Error(`Unexpected response type ${resp.type}. Expected deleteProjectFile.`)
    }
}

export const duplicateProjectFile = async (workspaceId: string, projectId: string, fileName: string, newFileName: string, auth: Auth): Promise<void> => {
    const req: DuplicateProjectFileRequest = {
        type: 'duplicateProjectFile',
        timestamp: Date.now() / 1000,
        projectId,
        workspaceId,
        fileName,
        newFileName
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'duplicateProjectFile') {
        throw Error(`Unexpected response type ${resp.type}. Expected duplicateProjectFile.`)
    }
}

export const renameProjectFile = async (workspaceId: string, projectId: string, fileName: string, newFileName: string, auth: Auth): Promise<void> => {
    const req: RenameProjectFileRequest = {
        type: 'renameProjectFile',
        timestamp: Date.now() / 1000,
        projectId,
        workspaceId,
        fileName,
        newFileName
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'renameProjectFile') {
        throw Error(`Unexpected response type ${resp.type}. Expected renameProjectFile.`)
    }
}

export const deleteProject = async (workspaceId: string, projectId: string, auth: Auth): Promise<void> => {
    const req: DeleteProjectRequest = {
        type: 'deleteProject',
        timestamp: Date.now() / 1000,
        workspaceId,
        projectId
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'deleteProject') {
        throw Error(`Unexpected response type ${resp.type}. Expected deleteProject.`)
    }
}

export const cloneProject = async (workspaceId: string, projectId: string, newWorkspaceId: string, auth: Auth): Promise<string> => {
    const req: CloneProjectRequest = {
        type: 'cloneProject',
        timestamp: Date.now() / 1000,
        workspaceId,
        projectId,
        newWorkspaceId
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'cloneProject') {
        throw Error(`Unexpected response type ${resp.type}. Expected cloneProject.`)
    }
    return resp.newProjectId
}

export const setProjectProperty = async (projectId: string, property: 'name', value: any, auth: Auth): Promise<void> => {
    const req: SetProjectPropertyRequest = {
        type: 'setProjectProperty',
        timestamp: Date.now() / 1000,
        projectId,
        property,
        value
    }
    const resp = await postNeurosiftRequest(req, {...auth})
    if (resp.type !== 'setProjectProperty') {
        throw Error(`Unexpected response type ${resp.type}. Expected setProjectProperty.`)
    }
}