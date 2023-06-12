import React, { FunctionComponent, PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { cloneProject, deleteProject, deleteProjectFile, deleteProjectResource, duplicateProjectFile, fetchProject, fetchProjectFiles, fetchProjectResources, renameProjectFile, setProjectProperty } from '../../dbInterface/dbInterface';
import { useGithubAuth } from '../../GithubAuth/useGithubAuth';
import { NSProject, NSProjectFile, NSProjectResource } from '../../types/neurosift-types';

type Props = {
    projectId: string
}

type OpenTabsState = {
    openTabs: {
        tabName: string
        content?: string
        editedContent?: string
    }[]
    currentTabName?: string
}

type OpenTabsAction = {
    type: 'openTab'
    tabName: string
} | {
    type: 'setTabContent'
    tabName: string
    content: string | undefined // undefined triggers a reload
} | {
    type: 'setTabEditedContent'
    tabName: string
    editedContent: string
} | {
    type: 'closeTab'
    tabName: string
} | {
    type: 'closeAllTabs'
} | {
    type: 'setCurrentTab'
    tabName: string
}

const openTabsReducer = (state: OpenTabsState, action: OpenTabsAction) => {
    switch (action.type) {
        case 'openTab':
            if (state.openTabs.find(x => x.tabName === action.tabName)) {
                return {
                    ...state,
                    currentTabName: action.tabName
                }
            }
            return {
                ...state,
                openTabs: [...state.openTabs, {tabName: action.tabName}],
                currentTabName: action.tabName
            }
        case 'setTabContent':
            return {
                ...state,
                openTabs: state.openTabs.map(x => {
                    if (x.tabName === action.tabName) {
                        return {
                            ...x,
                            content: action.content
                        }
                    }
                    return x
                })
            }
        case 'setTabEditedContent':
            return {
                ...state,
                openTabs: state.openTabs.map(x => {
                    if (x.tabName === action.tabName) {
                        return {
                            ...x,
                            editedContent: action.editedContent
                        }
                    }
                    return x
                })
            }
        case 'closeTab':
            if (!state.openTabs.find(x => x.tabName === action.tabName)) {
                return state
            }
            return {
                ...state,
                openTabs: state.openTabs.filter(x => x.tabName !== action.tabName),
                currentTabName: state.currentTabName === action.tabName ? state.openTabs[0]?.tabName : state.currentTabName
            }
        case 'closeAllTabs':
            return {
                ...state,
                openTabs: [],
                currentTabName: undefined
            }
        case 'setCurrentTab':
            if (!state.openTabs.find(x => x.tabName === action.tabName)) {
                return state
            }
            return {
                ...state,
                currentTabName: action.tabName
            }
    }
}

type ProjectPageContextType = {
    projectId: string
    workspaceId: string
    project?: NSProject
    projectFiles?: NSProjectFile[]
    projectResources?: NSProjectResource[]
    openTabs: {
        tabName: string
        content?: string
        editedContent?: string
    }[]
    currentTabName?: string
    openTab: (tabName: string) => void
    closeTab: (tabName: string) => void
    closeAllTabs: () => void
    setCurrentTab: (tabName: string) => void
    setTabContent: (tabName: string, content: string | undefined) => void
    setTabEditedContent: (tabName: string, editedContent: string) => void
    refreshFiles: () => void
    refreshResources: () => void
    deleteProject: () => Promise<void>
    cloneProject: (newWorkspaceId: string) => Promise<string>
    setProjectProperty: (property: 'name', value: any) => void
    deleteFile: (fileName: string) => void
    duplicateFile: (fileName: string, newFileName: string) => void
    renameFile: (fileName: string, newFileName: string) => void
    fileHasBeenEdited: (fileName: string) => boolean
    deleteResource: (resourceName: string) => void
    renameResource: (resourceName: string, newResourceName: string) => void
}

const ProjectPageContext = React.createContext<ProjectPageContextType>({
    projectId: '',
    workspaceId: '',
    openTabs: [],
    currentTabName: undefined,
    openTab: () => {},
    closeTab: () => {},
    closeAllTabs: () => {},
    setCurrentTab: () => {},
    setTabContent: () => {},
    setTabEditedContent: () => {},
    refreshFiles: () => {},
    refreshResources: () => {},
    deleteProject: async () => {},
    cloneProject: async () => {return ''},
    setProjectProperty: () => {},
    deleteFile: () => {},
    duplicateFile: () => {},
    renameFile: () => {},
    fileHasBeenEdited: () => false,
    deleteResource: () => {},
    renameResource: () => {}
})

export const SetupProjectPage: FunctionComponent<PropsWithChildren<Props>> = ({children, projectId}) => {
    const [project, setProject] = React.useState<NSProject | undefined>()
    const [projectFiles, setProjectFiles] = React.useState<NSProjectFile[] | undefined>()
    const [refreshFilesCode, setRefreshFilesCode] = React.useState(0)
    const refreshFiles = useCallback(() => setRefreshFilesCode(rfc => rfc + 1), [])

    const [projectResources, setProjectResources] = React.useState<NSProjectResource[] | undefined>()
    const [refreshResourcesCode, setRefreshResourcesCode] = React.useState(0)
    const refreshResources = useCallback(() => setRefreshResourcesCode(rrc => rrc + 1), [])

    const [refreshProjectCode, setRefreshProjectCode] = React.useState(0)
    const refreshProject = useCallback(() => setRefreshProjectCode(rac => rac + 1), [])

    const [openTabs, openTabsDispatch] = React.useReducer(openTabsReducer, {openTabs: [], currentTabName: undefined})

    const {accessToken, userId} = useGithubAuth()
    const auth = useMemo(() => (accessToken ? {githubAccessToken: accessToken, userId} : {}), [accessToken, userId])

    useEffect(() => {
        (async () => {
            setProject(undefined)
            if (!projectId) return
            const project = await fetchProject(projectId, auth)
            setProject(project)
        })()
    }, [projectId, auth, refreshProjectCode])

    useEffect(() => {
        (async () => {
            setProjectFiles(undefined)
            if (!projectId) return
            const af = await fetchProjectFiles(projectId, auth)
            setProjectFiles(af)
        })()
    }, [refreshFilesCode, projectId, auth])

    useEffect(() => {
        (async () => {
            setProjectResources(undefined)
            if (!projectId) return
            const ar = await fetchProjectResources(projectId, auth)
            setProjectResources(ar)
        })()
    }, [refreshResourcesCode, projectId, auth])

    const deleteProjectHandler = useMemo(() => (async () => {
        if (!project) return
        await deleteProject(project.workspaceId, projectId, auth)
    }), [project, projectId, auth])

    const cloneProjectHandler = useMemo(() => (async (newWorkspaceId: string) => {
        if (!project) return '' // should not happen
        const newProjectId = await cloneProject(project.workspaceId, projectId, newWorkspaceId, auth)
        return newProjectId
    }), [project, projectId, auth])

    const setProjectPropertyHandler = useCallback(async (property: 'name', val: any) => {
        await setProjectProperty(projectId, property, val, auth)
        refreshProject()
    }, [projectId, refreshProject, auth])

    const deleteFile = useCallback(async (fileName: string) => {
        if (!project) return
        await deleteProjectFile(project.workspaceId, projectId, fileName, auth)
        refreshFiles()
    }, [project, projectId, refreshFiles, auth])

    const duplicateFile = useCallback(async (fileName: string, newFileName: string) => {
        if (!project) return
        await duplicateProjectFile(project.workspaceId, projectId, fileName, newFileName, auth)
        refreshFiles()
    }, [project, projectId, refreshFiles, auth])

    const renameFile = useCallback(async (fileName: string, newFileName: string) => {
        if (!project) return
        await renameProjectFile(project.workspaceId, projectId, fileName, newFileName, auth)
        refreshFiles()
        openTabsDispatch({type: 'closeTab', tabName: `file:${fileName}`})
    }, [project, projectId, refreshFiles, auth])

    const deleteResource = useCallback(async (resourceName: string) => {
        if (!project) return
        await deleteProjectResource(project.workspaceId, projectId, resourceName, auth)
        refreshResources()
    }, [project, projectId, refreshResources, auth])

    const renameResource = useCallback(async (resourceName: string, newResourceName: string) => {
        if (!project) return
        await renameProjectFile(project.workspaceId, projectId, resourceName, newResourceName, auth)
        refreshResources()
    }, [project, projectId, refreshResources, auth])

    const fileHasBeenEdited = useMemo(() => ((fileName: string) => {
        const tab = openTabs.openTabs.find(x => x.tabName === `file:${fileName}`)
        if (!tab) return false
        return tab.editedContent !== tab.content
    }), [openTabs])

    const value: ProjectPageContextType = React.useMemo(() => ({
        projectId,
        workspaceId: project?.workspaceId ?? '',
        project,
        projectFiles,
        openTabs: openTabs.openTabs,
        currentTabName: openTabs.currentTabName,
        openTab: (tabName: string) => openTabsDispatch({type: 'openTab', tabName}),
        closeTab: (tabName: string) => openTabsDispatch({type: 'closeTab', tabName}),
        closeAllTabs: () => openTabsDispatch({type: 'closeAllTabs'}),
        setCurrentTab: (tabName: string) => openTabsDispatch({type: 'setCurrentTab', tabName}),
        setTabContent: (tabName: string, content: string | undefined) => openTabsDispatch({type: 'setTabContent', tabName, content}),
        setTabEditedContent: (tabName: string, editedContent: string) => openTabsDispatch({type: 'setTabEditedContent', tabName, editedContent}),
        refreshFiles,
        refreshResources,
        deleteProject: deleteProjectHandler,
        cloneProject: cloneProjectHandler,
        setProjectProperty: setProjectPropertyHandler,
        deleteFile,
        duplicateFile,
        renameFile,
        fileHasBeenEdited,
        deleteResource,
        renameResource
    }), [project, projectFiles, projectId, refreshFiles, openTabs, deleteProjectHandler, cloneProjectHandler, setProjectPropertyHandler, deleteFile, duplicateFile, renameFile, fileHasBeenEdited, refreshResources, deleteResource, renameResource])

    return (
        <ProjectPageContext.Provider value={value}>
            {children}
        </ProjectPageContext.Provider>
    )
}

export const useProject = () => {
    const context = React.useContext(ProjectPageContext)
    return context
}