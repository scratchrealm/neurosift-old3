import { faPython } from '@fortawesome/free-brands-svg-icons';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Delete, DriveFileRenameOutline } from '@mui/icons-material';
import { FunctionComponent, useCallback, useMemo, useState } from "react";
import SmallIconButton from '../../../components/SmallIconButton';
import { NSProjectResource } from '../../../types/neurosift-types';
import { useProject } from '../ProjectPageContext';
import './resource-browser-table.css';

type Props = {
    projectResources: NSProjectResource[] | undefined
    onOpenResource: (path: string) => void
    onDeleteResource: (path: string) => void
    onRenameResource: (path: string) => void
}

type ResourceItem = {
    id: string
    name: string
    selected: boolean
}

const ProjectResourceBrowser: FunctionComponent<Props> = ({onOpenResource, onDeleteResource, onRenameResource, projectResources}) => {
    const {currentTabName} = useProject()

    const resources = useMemo(() => {
        const ret: ResourceItem[] = []
        for (const x of projectResources || []) {
            ret.push({
                id: x.resourceName,
                name: x.resourceName,
                selected: 'resource:' + x.resourceName === currentTabName
            })
        }
        ret.sort((a, b) => (a.name.localeCompare(b.name)))
        return ret
    }, [projectResources, currentTabName])

    const [contextMenu, setContextMenu] = useState<{visible: boolean, x: number, y: number, resourceId: string}>({ visible: false, x: 0, y: 0, resourceId: '' })

    const handleContextMenu = (evt: React.MouseEvent, resourceId: string) => {
        evt.preventDefault()
        const boundingRect = evt.currentTarget.parentElement?.getBoundingClientRect()
        if (!boundingRect) return
        setContextMenu({ visible: true, x: evt.clientX - boundingRect.x, y: evt.clientY - boundingRect.y, resourceId });
    }

    const handleClickResource = useCallback((resourceId: string) => {
        onOpenResource(resourceId)
        setContextMenu({ visible: false, x: 0, y: 0, resourceId: '' })
    }, [onOpenResource])

    const handleContextMenuAction = useCallback((resourceId: string, action: string) => {
        if (action === 'delete') {
            onDeleteResource(resourceId)
        }
        else if (action === 'rename') {
            onRenameResource(resourceId)
        }
        setContextMenu({ visible: false, x: 0, y: 0, resourceId: '' })
    }, [onDeleteResource, onRenameResource])
    
    return (
        <div onMouseLeave={() => {setContextMenu({visible: false, x: 0, y: 0, resourceId: ''})}} style={{position: 'absolute'}}>
            <table className="resource-browser-table">
                <tbody>
                    {
                        resources.map(x => (
                            <tr key={x.id} onClick={() => handleClickResource(x.id)} onContextMenu={(evt) => handleContextMenu(evt, x.id)} style={{cursor: 'pointer'}}>
                                <td><FileIcon resourceName={x.name} /></td>
                                <td>{x.name}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {
                contextMenu.visible && (
                    <ContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        resourceId={contextMenu.resourceId}
                        onAction={handleContextMenuAction}
                    />
                )
            }
        </div>
    )
}

export const FileIcon: FunctionComponent<{resourceName: string}> = ({resourceName}) => {
    const ext = resourceName.split('.').pop()
    if (ext === 'py') {
        return <FontAwesomeIcon icon={faPython} style={{color: 'darkblue'}} />
    }
    else if (ext === 'json') {
        return <FontAwesomeIcon icon={faFile as any} style={{color: 'black'}} />
    }
    else {
        return <FontAwesomeIcon icon={faFile as any} style={{color: 'gray'}} />
    }
}

const ContextMenu: FunctionComponent<{ x: number, y: number, resourceId: string, onAction: (resourceId: string, a: string) => void}> = ({x, y, resourceId, onAction}) => {
    const options = [
        {
            id: "delete",
            label: <span><SmallIconButton icon={<Delete />} /> delete {resourceId}</span>
        }, {
            id: "rename",
            label: <span><SmallIconButton icon={<DriveFileRenameOutline />} /> rename...</span>
        }
    ]
  
    const onClick = (option: string) => {
      onAction(resourceId, option)
    }
  
    return (
      <div className="resource-browser-context-menu" style={{ position: 'absolute', top: y, left: x}}>
        {options.map(option => (
          <div key={option.id} onClick={() => onClick(option.id)}>{option.label}</div>
        ))}
      </div>
    )
}

export default ProjectResourceBrowser