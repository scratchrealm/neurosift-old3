import { useCallback, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export type Route = {
    page: 'home'
} | {
    page: 'about'
} | {
    page: 'project'
    projectId: string
} | {
    page: 'workspace'
    workspaceId: string
} | {
    page: 'github-auth'
}

const useRoute = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const p = location.pathname
    const route: Route = useMemo(() => {
        if (p === '/about') {
            return {
                page: 'about'
            }
        }
        else if (p.startsWith('/project/')) {
            const a = p.split('/')
            const projectId = a[2]
            return {
                page: 'project',
                projectId
            }
        }
        else if (p.startsWith('/workspace/')) {
            const a = p.split('/')
            const workspaceId = a[2]
            return {
                page: 'workspace',
                workspaceId
            }
        }
        else if (p === '/github/auth') {
            return {
                page: 'github-auth'
            }
        }
        else {
            return {
                page: 'home'
            }
        }
    }, [p])

    const setRoute = useCallback((r: Route) => {
        if (r.page === 'home') {
            navigate('/')
        }
        else if (r.page === 'about') {
            navigate('/about')
        }
        else if (r.page === 'project') {
            navigate(`/project/${r.projectId}`)
        }
        else if (r.page === 'workspace') {
            navigate(`/workspace/${r.workspaceId}`)
        }
        else if (r.page === 'github-auth') {
            navigate('/github/auth')
        }
    }, [navigate])

    return {
        route,
        setRoute
    }    
}

export default useRoute