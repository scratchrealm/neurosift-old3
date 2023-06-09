import React, { useCallback, useEffect, useMemo } from 'react';
import { createWorkspace, fetchWorkspaces } from './dbInterface/dbInterface';
import { useGithubAuth } from './GithubAuth/useGithubAuth';
import { NSWorkspace } from './types/neurosift-types';


type NSMainContextType = {
    workspaces?: NSWorkspace[]
    createWorkspace: (workspaceName: string) => Promise<string>
    refreshWorkspaces: () => void
}

const NSMainContext = React.createContext<NSMainContextType>({workspaces: [], createWorkspace: async () => {return ''}, refreshWorkspaces: () => {}})

export const SetupNSMain = (props: {children: React.ReactNode}) => {
    const [workspaces, setWorkspaces] = React.useState<NSWorkspace[] | undefined>(undefined)
    const [refreshCode, setRefreshCode] = React.useState(0)
    const refreshWorkspaces = useCallback(() => setRefreshCode(rc => rc + 1), [])

    const {accessToken, userId} = useGithubAuth()
    const auth = useMemo(() => (accessToken ? {githubAccessToken: accessToken, userId} : {}), [accessToken, userId])

    const createWorkspaceHandler = useCallback(async (workspaceName: string) => {
        const newWorkspaceId = await createWorkspace(workspaceName, auth)
        setRefreshCode(rc => rc + 1)
        return newWorkspaceId
    }, [auth])

    useEffect(() => {
        (async () => {
            setWorkspaces(undefined)
            const workspaces = await fetchWorkspaces(auth)
            setWorkspaces(workspaces)
        })()
    }, [refreshCode, auth])

    const value = React.useMemo(() => ({
        workspaces,
        createWorkspace: createWorkspaceHandler,
        refreshWorkspaces
    }), [workspaces, createWorkspaceHandler, refreshWorkspaces])

    return (
        <NSMainContext.Provider value={value}>
            {props.children}
        </NSMainContext.Provider>
    )
}

export const useNSMain = () => {
    const context = React.useContext(NSMainContext)
    return {
        workspaces: context.workspaces,
        createWorkspace: context.createWorkspace,
        refreshWorkspaces: context.refreshWorkspaces
    }
}