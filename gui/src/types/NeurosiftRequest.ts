import { isNSProject, isNSProjectFile, isNSProjectResource, isNSWorkspace, NSProject, NSProjectFile, NSProjectResource, NSResourceType, NSWorkspace } from "./neurosift-types"
import validateObject, { isArrayOf, isEqualTo, isNumber, isOneOf, isString, optional } from "./validateObject"

// getWorkspaces

export type GetWorkspacesRequest = {
    type: 'getWorkspaces'
    timestamp: number
}

export const isGetWorkspacesRequest = (x: any): x is GetWorkspacesRequest => {
    return validateObject(x, {
        type: isEqualTo('getWorkspaces'),
        timestamp: isNumber
    })
}

export type GetWorkspacesResponse = {
    type: 'getWorkspaces'
    workspaces: NSWorkspace[]
}

export const isGetWorkspacesResponse = (x: any): x is GetWorkspacesResponse => {
    return validateObject(x, {
        type: isEqualTo('getWorkspaces'),
        workspaces: isArrayOf(isNSWorkspace)
    })
}

// getWorkspace

export type GetWorkspaceRequest = {
    type: 'getWorkspace'
    timestamp: number
    workspaceId: string
}

export const isGetWorkspaceRequest = (x: any): x is GetWorkspaceRequest => {
    return validateObject(x, {
        type: isEqualTo('getWorkspace'),
        timestamp: isNumber,
        workspaceId: isString
    })
}

export type GetWorkspaceResponse = {
    type: 'getWorkspace'
    workspace: NSWorkspace
}

export const isGetWorkspaceResponse = (x: any): x is GetWorkspaceResponse => {
    return validateObject(x, {
        type: isEqualTo('getWorkspace'),
        workspace: isNSWorkspace
    })
}

// createWorkspace

export type CreateWorkspaceRequest = {
    type: 'createWorkspace'
    timestamp: number
    name: string
}

export const isCreateWorkspaceRequest = (x: any): x is CreateWorkspaceRequest => {
    return validateObject(x, {
        type: isEqualTo('createWorkspace'),
        timestamp: isNumber,
        name: isString
    })
}

export type CreateWorkspaceResponse = {
    type: 'createWorkspace'
    workspaceId: string
}

export const isCreateWorkspaceResponse = (x: any): x is CreateWorkspaceResponse => {
    return validateObject(x, {
        type: isEqualTo('createWorkspace'),
        workspaceId: isString
    })
}

// getProjects

export type GetProjectsRequest = {
    type: 'getProjects'
    timestamp: number
    workspaceId: string
}

export const isGetProjectsRequest = (x: any): x is GetProjectsRequest => {
    return validateObject(x, {
        type: isEqualTo('getProjects'),
        timestamp: isNumber,
        workspaceId: isString
    })
}

export type GetProjectsResponse = {
    type: 'getProjects'
    projects: NSProject[]
}

export const isGetProjectsResponse = (x: any): x is GetProjectsResponse => {
    return validateObject(x, {
        type: isEqualTo('getProjects'),
        projects: isArrayOf(isNSProject)
    })
}

// getProject

export type GetProjectRequest = {
    type: 'getProject'
    timestamp: number
    projectId: string
}

export const isGetProjectRequest = (x: any): x is GetProjectRequest => {
    return validateObject(x, {
        type: isEqualTo('getProject'),
        timestamp: isNumber,
        projectId: isString
    })
}

export type GetProjectResponse = {
    type: 'getProject'
    project: NSProject
}

export const isGetProjectResponse = (x: any): x is GetProjectResponse => {
    return validateObject(x, {
        type: isEqualTo('getProject'),
        project: isNSProject
    })
}

// createProject

export type CreateProjectRequest = {
    type: 'createProject'
    timestamp: number
    workspaceId: string
    name: string
}

export const isCreateProjectRequest = (x: any): x is CreateProjectRequest => {
    return validateObject(x, {
        type: isEqualTo('createProject'),
        timestamp: isNumber,
        workspaceId: isString,
        name: isString
    })
}

export type CreateProjectResponse = {
    type: 'createProject'
    projectId: string
}

export const isCreateProjectResponse = (x: any): x is CreateProjectResponse => {
    return validateObject(x, {
        type: isEqualTo('createProject'),
        projectId: isString,
    })
}

// deleteWorkspace

export type DeleteWorkspaceRequest = {
    type: 'deleteWorkspace'
    timestamp: number
    workspaceId: string
}

export const isDeleteWorkspaceRequest = (x: any): x is DeleteWorkspaceRequest => {
    return validateObject(x, {
        type: isEqualTo('deleteWorkspace'),
        timestamp: isNumber,
        workspaceId: isString
    })
}

export type DeleteWorkspaceResponse = {
    type: 'deleteWorkspace'
}

export const isDeleteWorkspaceResponse = (x: any): x is DeleteWorkspaceResponse => {
    return validateObject(x, {
        type: isEqualTo('deleteWorkspace')
    })
}

// setWorkspaceUsers

export type SetWorkspaceUsersRequest = {
    type: 'setWorkspaceUsers'
    timestamp: number
    workspaceId: string
    users: {
        userId: string
        role: 'admin' | 'editor' | 'viewer'
    }[]
}

export const isSetWorkspaceUsersRequest = (x: any): x is SetWorkspaceUsersRequest => {
    return validateObject(x, {
        type: isEqualTo('setWorkspaceUsers'),
        timestamp: isNumber,
        workspaceId: isString,
        users: isArrayOf(y => (validateObject(y, {
            userId: isString,
            role: isOneOf([isEqualTo('admin'), isEqualTo('editor'), isEqualTo('viewer')])
        })))
    })
}

export type SetWorkspaceUsersResponse = {
    type: 'setWorkspaceUsers'
}

export const isSetWorkspaceUsersResponse = (x: any): x is SetWorkspaceUsersResponse => {
    return validateObject(x, {
        type: isEqualTo('setWorkspaceUsers')
    })
}

// setWorkspaceProperty

export type SetWorkspacePropertyRequest = {
    type: 'setWorkspaceProperty'
    timestamp: number
    workspaceId: string
    property: 'name' | 'publiclyReadable' | 'listed' | 'computeResourceId'
    value: any
}

export const isSetWorkspacePropertyRequest = (x: any): x is SetWorkspacePropertyRequest => {
    return validateObject(x, {
        type: isEqualTo('setWorkspaceProperty'),
        timestamp: isNumber,
        workspaceId: isString,
        property: isOneOf([isEqualTo('name'), isEqualTo('publiclyReadable'), isEqualTo('listed'), isEqualTo('computeResourceId')]),
        value: () => (true)
    })
}

export type SetWorkspacePropertyResponse = {
    type: 'setWorkspaceProperty'
}

export const isSetWorkspacePropertyResponse = (x: any): x is SetWorkspacePropertyResponse => {
    return validateObject(x, {
        type: isEqualTo('setWorkspaceProperty')
    })
}

// getProjectFiles

export type GetProjectFilesRequest = {
    type: 'getProjectFiles'
    timestamp: number
    projectId: string
}

export const isGetProjectFilesRequest = (x: any): x is GetProjectFilesRequest => {
    return validateObject(x, {
        type: isEqualTo('getProjectFiles'),
        timestamp: isNumber,
        projectId: isString
    })
}

export type GetProjectFilesResponse = {
    type: 'getProjectFiles'
    projectFiles: NSProjectFile[]
}

export const isGetProjectFilesResponse = (x: any): x is GetProjectFilesResponse => {
    return validateObject(x, {
        type: isEqualTo('getProjectFiles'),
        projectFiles: isArrayOf(isNSProjectFile)
    })
}

// setProjectFile

export type SetProjectFileRequest = {
    type: 'setProjectFile'
    timestamp: number
    projectId: string
    workspaceId: string
    fileName: string
    fileContent: string
}

export const isSetProjectFileRequest = (x: any): x is SetProjectFileRequest => {
    return validateObject(x, {
        type: isEqualTo('setProjectFile'),
        timestamp: isNumber,
        projectId: isString,
        workspaceId: isString,
        fileName: isString,
        fileContent: isString
    })
}

export type SetProjectFileResponse = {
    type: 'setProjectFile'
}

export const isSetProjectFileResponse = (x: any): x is SetProjectFileResponse => {
    return validateObject(x, {
        type: isEqualTo('setProjectFile')
    })
}

// deleteProjectFile

export type DeleteProjectFileRequest = {
    type: 'deleteProjectFile'
    timestamp: number
    workspaceId: string
    projectId: string
    fileName: string
}

export const isDeleteProjectFileRequest = (x: any): x is DeleteProjectFileRequest => {
    return validateObject(x, {
        type: isEqualTo('deleteProjectFile'),
        timestamp: isNumber,
        workspaceId: isString,
        projectId: isString,
        fileName: isString
    })
}

export type DeleteProjectFileResponse = {
    type: 'deleteProjectFile'
}

export const isDeleteProjectFileResponse = (x: any): x is DeleteProjectFileResponse => {
    return validateObject(x, {
        type: isEqualTo('deleteProjectFile')
    })
}

// duplicateProjectFile

export type DuplicateProjectFileRequest = {
    type: 'duplicateProjectFile'
    timestamp: number
    workspaceId: string
    projectId: string
    fileName: string
    newFileName: string
}

export const isDuplicateProjectFileRequest = (x: any): x is DuplicateProjectFileRequest => {
    return validateObject(x, {
        type: isEqualTo('duplicateProjectFile'),
        timestamp: isNumber,
        workspaceId: isString,
        projectId: isString,
        fileName: isString,
        newFileName: isString
    })
}

export type DuplicateProjectFileResponse = {
    type: 'duplicateProjectFile'
}

export const isDuplicateProjectFileResponse = (x: any): x is DuplicateProjectFileResponse => {
    return validateObject(x, {
        type: isEqualTo('duplicateProjectFile')
    })
}

// renameProjectFile

export type RenameProjectFileRequest = {
    type: 'renameProjectFile'
    timestamp: number
    workspaceId: string
    projectId: string
    fileName: string
    newFileName: string
}

export const isRenameProjectFileRequest = (x: any): x is RenameProjectFileRequest => {
    return validateObject(x, {
        type: isEqualTo('renameProjectFile'),
        timestamp: isNumber,
        workspaceId: isString,
        projectId: isString,
        fileName: isString,
        newFileName: isString
    })
}

export type RenameProjectFileResponse = {
    type: 'renameProjectFile'
}

export const isRenameProjectFileResponse = (x: any): x is RenameProjectFileResponse => {
    return validateObject(x, {
        type: isEqualTo('renameProjectFile')
    })
}

// getProjectFile

export type GetProjectFileRequest = {
    type: 'getProjectFile'
    timestamp: number
    projectId: string
    fileName: string
}

export const isGetProjectFileRequest = (x: any): x is GetProjectFileRequest => {
    return validateObject(x, {
        type: isEqualTo('getProjectFile'),
        timestamp: isNumber,
        projectId: isString,
        fileName: isString
    })
}

export type GetProjectFileResponse = {
    type: 'getProjectFile'
    projectFile: NSProjectFile
}

export const isGetProjectFileResponse = (x: any): x is GetProjectFileResponse => {
    return validateObject(x, {
        type: isEqualTo('getProjectFile'),
        projectFile: isNSProjectFile
    })
}

// getProjectResources

export type GetProjectResourcesRequest = {
    type: 'getProjectResources'
    timestamp: number
    projectId: string
}

export const isGetProjectResourcesRequest = (x: any): x is GetProjectResourcesRequest => {
    return validateObject(x, {
        type: isEqualTo('getProjectResources'),
        timestamp: isNumber,
        projectId: isString
    })
}

export type GetProjectResourcesResponse = {
    type: 'getProjectResources'
    projectResources: NSProjectResource[]
}

export const isGetProjectResourcesResponse = (x: any): x is GetProjectResourcesResponse => {
    return validateObject(x, {
        type: isEqualTo('getProjectResources'),
        projectResources: isArrayOf(isNSProjectResource)
    })
}

// getProjectResource

export type GetProjectResourceRequest = {
    type: 'getProjectResource'
    timestamp: number
    projectId: string
    resourceName: string
}

export const isGetProjectResourceRequest = (x: any): x is GetProjectResourceRequest => {
    return validateObject(x, {
        type: isEqualTo('getProjectResource'),
        timestamp: isNumber,
        projectId: isString,
        resourceName: isString
    })
}

export type GetProjectResourceResponse = {
    type: 'getProjectResource'
    projectResource: NSProjectResource
}

export const isGetProjectResourceResponse = (x: any): x is GetProjectResourceResponse => {
    return validateObject(x, {
        type: isEqualTo('getProjectResource'),
        projectResource: isNSProjectResource
    })
}

// addProjectResource

export type AddProjectResourceRequest = {
    type: 'addProjectResource'
    timestamp: number
    projectId: string
    workspaceId: string
    resourceName: string
    resourceType: NSResourceType
    resourceFormat: string
    uri: string
}

export const isAddProjectResourceRequest = (x: any): x is AddProjectResourceRequest => {
    return validateObject(x, {
        type: isEqualTo('addProjectResource'),
        timestamp: isNumber,
        projectId: isString,
        workspaceId: isString,
        resourceName: isString,
        resourceType: isOneOf([isEqualTo('file'), isEqualTo('uri')]),
        resourceFormat: isString,
        uri: isString
    })
}

export type AddProjectResourceResponse = {
    type: 'addProjectResource'
}

export const isAddProjectResourceResponse = (x: any): x is AddProjectResourceResponse => {
    return validateObject(x, {
        type: isEqualTo('addProjectResource')
    })
}

// deleteProjectResource

export type DeleteProjectResourceRequest = {
    type: 'deleteProjectResource'
    timestamp: number
    projectId: string
    workspaceId: string
    resourceName: string
}

export const isDeleteProjectResourceRequest = (x: any): x is DeleteProjectResourceRequest => {
    return validateObject(x, {
        type: isEqualTo('deleteProjectResource'),
        timestamp: isNumber,
        projectId: isString,
        workspaceId: isString,
        resourceName: isString
    })
}

export type DeleteProjectResourceResponse = {
    type: 'deleteProjectResource'
}

export const isDeleteProjectResourceResponse = (x: any): x is DeleteProjectResourceResponse => {
    return validateObject(x, {
        type: isEqualTo('deleteProjectResource')
    })
}

// renameProjectResource

export type RenameProjectResourceRequest = {
    type: 'renameProjectResource'
    timestamp: number
    projectId: string
    workspaceId: string
    resourceName: string
    newResourceName: string
}

export const isRenameProjectResourceRequest = (x: any): x is RenameProjectResourceRequest => {
    return validateObject(x, {
        type: isEqualTo('renameProjectResource'),
        timestamp: isNumber,
        projectId: isString,
        workspaceId: isString,
        resourceName: isString,
        newResourceName: isString
    })
}

export type RenameProjectResourceResponse = {
    type: 'renameProjectResource'
}

export const isRenameProjectResourceResponse = (x: any): x is RenameProjectResourceResponse => {
    return validateObject(x, {
        type: isEqualTo('renameProjectResource')
    })
}

// getDataBlob

export type GetDataBlobRequest = {
    type: 'getDataBlob'
    timestamp: number
    workspaceId: string
    projectId: string
    sha1: string
}

export const isGetDataBlobRequest = (x: any): x is GetDataBlobRequest => {
    return validateObject(x, {
        type: isEqualTo('getDataBlob'),
        timestamp: isNumber,
        workspaceId: isString,
        projectId: isString,
        sha1: isString
    })
}

export type GetDataBlobResponse = {
    type: 'getDataBlob'
    content: string
}

export const isGetDataBlobResponse = (x: any): x is GetDataBlobResponse => {
    return validateObject(x, {
        type: isEqualTo('getDataBlob'),
        content: isString
    })
}

// deleteProject

export type DeleteProjectRequest = {
    type: 'deleteProject'
    timestamp: number
    workspaceId: string
    projectId: string
}

export const isDeleteProjectRequest = (x: any): x is DeleteProjectRequest => {
    return validateObject(x, {
        type: isEqualTo('deleteProject'),
        timestamp: isNumber,
        workspaceId: isString,
        projectId: isString
    })
}

export type DeleteProjectResponse = {
    type: 'deleteProject'
}

export const isDeleteProjectResponse = (x: any): x is DeleteProjectResponse => {
    return validateObject(x, {
        type: isEqualTo('deleteProject')
    })
}

// cloneProject

export type CloneProjectRequest = {
    type: 'cloneProject'
    timestamp: number
    workspaceId: string
    projectId: string
    newWorkspaceId: string
}

export const isCloneProjectRequest = (x: any): x is CloneProjectRequest => {
    return validateObject(x, {
        type: isEqualTo('cloneProject'),
        timestamp: isNumber,
        workspaceId: isString,
        projectId: isString,
        newWorkspaceId: isString
    })
}

export type CloneProjectResponse = {
    type: 'cloneProject'
    newProjectId: string
}

export const isCloneProjectResponse = (x: any): x is CloneProjectResponse => {
    return validateObject(x, {
        type: isEqualTo('cloneProject'),
        newProjectId: isString
    })
}

// setProjectProperty

export type SetProjectPropertyRequest = {
    type: 'setProjectProperty'
    timestamp: number
    projectId: string
    property: 'name'
    value: any
}

export const isSetProjectPropertyRequest = (x: any): x is SetProjectPropertyRequest => {
    return validateObject(x, {
        type: isEqualTo('setProjectProperty'),
        timestamp: isNumber,
        projectId: isString,
        property: isEqualTo('name'),
        value: () => (true)
    })
}

export type SetProjectPropertyResponse = {
    type: 'setProjectProperty'
}

export const isSetProjectPropertyResponse = (x: any): x is SetProjectPropertyResponse => {
    return validateObject(x, {
        type: isEqualTo('setProjectProperty')
    })
}

// NeurosiftRequestPayload

export type NeurosiftRequestPayload =
    GetWorkspacesRequest |
    GetWorkspaceRequest |
    CreateWorkspaceRequest |
    GetProjectsRequest |
    GetProjectRequest |
    CreateProjectRequest |
    SetWorkspaceUsersRequest |
    SetWorkspacePropertyRequest |
    DeleteWorkspaceRequest |
    GetProjectFilesRequest |
    SetProjectFileRequest |
    DeleteProjectFileRequest |
    DuplicateProjectFileRequest |
    RenameProjectFileRequest |
    GetProjectFileRequest |
    GetProjectResourcesRequest |
    GetProjectResourceRequest |
    AddProjectResourceRequest |
    DeleteProjectResourceRequest |
    RenameProjectResourceRequest |
    GetDataBlobRequest |
    DeleteProjectRequest |
    CloneProjectRequest |
    SetProjectPropertyRequest

export const isNeurosiftRequestPayload = (x: any): x is NeurosiftRequestPayload => {
    return isOneOf([
        isGetWorkspacesRequest,
        isGetWorkspaceRequest,
        isCreateWorkspaceRequest,
        isGetProjectsRequest,
        isGetProjectRequest,
        isCreateProjectRequest,
        isSetWorkspaceUsersRequest,
        isSetWorkspacePropertyRequest,
        isDeleteWorkspaceRequest,
        isGetProjectFilesRequest,
        isSetProjectFileRequest,
        isDeleteProjectFileRequest,
        isDuplicateProjectFileRequest,
        isRenameProjectFileRequest,
        isGetProjectFileRequest,
        isGetProjectResourcesRequest,
        isGetProjectResourceRequest,
        isAddProjectResourceRequest,
        isDeleteProjectResourceRequest,
        isRenameProjectResourceRequest,
        isGetDataBlobRequest,
        isDeleteProjectRequest,
        isCloneProjectRequest,
        isSetProjectPropertyRequest
    ])(x)
}

// NeurosiftRequest

export type NeurosiftRequest = {
    payload: NeurosiftRequestPayload
    signature?: string
    userId?: string
    githubAccessToken?: string
}

export const isNeurosiftRequest = (x: any): x is NeurosiftRequest => {
    return validateObject(x, {
        payload: isNeurosiftRequestPayload,
        signature: optional(isString),
        userId: optional(isString),
        githubAccessToken: optional(isString)
    })
}

// NeurosiftResponse

export type NeurosiftResponse =
    GetWorkspacesResponse |
    GetWorkspaceResponse |
    CreateWorkspaceResponse |
    GetProjectsResponse |
    GetProjectResponse |
    CreateProjectResponse |
    SetWorkspaceUsersResponse |
    SetWorkspacePropertyResponse |
    DeleteWorkspaceResponse |
    GetProjectFilesResponse |
    SetProjectFileResponse |
    DeleteProjectFileResponse |
    DuplicateProjectFileResponse |
    RenameProjectFileResponse |
    GetProjectFileResponse |
    GetProjectResourcesResponse |
    GetProjectResourceResponse |
    AddProjectResourceResponse |
    DeleteProjectResourceResponse |
    RenameProjectResourceResponse |
    GetDataBlobResponse |
    DeleteProjectResponse |
    CloneProjectResponse |
    SetProjectPropertyResponse

export const isNeurosiftResponse = (x: any): x is NeurosiftResponse => {
    return isOneOf([
        isGetWorkspacesResponse,
        isGetWorkspaceResponse,
        isCreateWorkspaceResponse,
        isGetProjectsResponse,
        isGetProjectResponse,
        isCreateProjectResponse,
        isSetWorkspaceUsersResponse,
        isSetWorkspacePropertyResponse,
        isDeleteWorkspaceResponse,
        isGetProjectFilesResponse,
        isSetProjectFileResponse,
        isDeleteProjectFileResponse,
        isDuplicateProjectFileResponse,
        isRenameProjectFileResponse,
        isGetProjectFileResponse,
        isGetProjectResourcesResponse,
        isGetProjectResourceResponse,
        isAddProjectResourceResponse,
        isDeleteProjectResourceResponse,
        isRenameProjectResourceResponse,
        isGetDataBlobResponse,
        isDeleteProjectResponse,
        isCloneProjectResponse,
        isSetProjectPropertyResponse
    ])(x)
}
