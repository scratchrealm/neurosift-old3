import { NSWorkspace } from "../src/types/neurosift-types"
import getWorkspaceRole from './getWorkspaceRole'

export const userCanCreateProject = (workspace: NSWorkspace, userId: string | undefined): boolean => {
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return ((workspaceRole === 'admin' || workspaceRole === 'editor'))
}

export const userCanCreateWorkspace = (userId: string | undefined): boolean => {
    if (userId) {
        return true
    }
    return false
}

export const userCanDeleteProject = (workspace: NSWorkspace, userId: string | undefined): boolean => {
    if (!userId) return false
    const workspaceRole = getWorkspaceRole(workspace, userId)
    if (workspaceRole === 'admin' || workspaceRole === 'editor') {
        return true
    }
    return false
}

export const userCanDeleteWorkspace = (workspace: NSWorkspace, userId: string | undefined): boolean => {
    if (!userId) {
        return false
    }
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return workspaceRole === 'admin'
}

export const userCanReadWorkspace = (workspace: NSWorkspace, userId: string | undefined): boolean => {
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return ((workspaceRole === 'admin' || workspaceRole === 'editor' || workspaceRole === 'viewer'))
}

export const userCanSetProjectFile = (workspace: NSWorkspace, userId: string | undefined): boolean => {
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return ((workspaceRole === 'admin' || workspaceRole === 'editor'))
}

export const userCanDeleteProjectFile = (workspace: NSWorkspace, userId: string | undefined): boolean => {
    if (!userId) {
        // anonymous cannot delete
        return false
    }
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return ((workspaceRole === 'admin' || workspaceRole === 'editor'))
}

export const userCanSetWorkspaceProperty = (workspace: NSWorkspace, userId: string | undefined): boolean => {
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return (workspaceRole === 'admin')
}

export const userCanSetWorkspaceUsers = (workspace: NSWorkspace, userId: string | undefined): boolean => {
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return (workspaceRole === 'admin')
}

export const userCanSetProjectProperty = (workspace: NSWorkspace, userId: string | undefined, property: string): boolean => {
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return ((workspaceRole === 'admin' || workspaceRole === 'editor'))
}