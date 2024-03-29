import { faPython } from '@fortawesome/free-brands-svg-icons';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Delete, DriveFileRenameOutline, FileCopy } from '@mui/icons-material';
import { FunctionComponent, useCallback, useMemo, useState } from "react";
import SmallIconButton from '../../../components/SmallIconButton';
import { timeAgoString } from '../../../timeStrings';
import { NSProjectFile } from '../../../types/neurosift-types';
import { useProject } from '../ProjectPageContext';
import './file-browser-table.css';
import formatByteCount from './formatByteCount';

type Props = {
    projectFiles: NSProjectFile[] | undefined
    onOpenFile: (path: string) => void
    onDeleteFile: (path: string) => void
    onDuplicateFile: (path: string) => void
    onRenameFile: (path: string) => void
}

type FileItem = {
    id: string
    name: string
    selected: boolean
    size: number
    timestampModified: number
}

const ProjectFileBrowser2: FunctionComponent<Props> = ({onOpenFile, onDeleteFile, onDuplicateFile, onRenameFile, projectFiles}) => {
    const {currentTabName} = useProject()

    const files = useMemo(() => {
        const ret: FileItem[] = []
        for (const x of projectFiles || []) {
            ret.push({
                id: x.fileName,
                name: x.fileName,
                selected: 'file:' + x.fileName === currentTabName,
                size: x.contentSize,
                timestampModified: x.timestampModified
            })
        }
        ret.sort((a, b) => (a.name.localeCompare(b.name)))
        return ret
    }, [projectFiles, currentTabName])

    const [contextMenu, setContextMenu] = useState<{visible: boolean, x: number, y: number, fileId: string}>({ visible: false, x: 0, y: 0, fileId: '' })

    const handleContextMenu = (evt: React.MouseEvent, fileId: string) => {
        evt.preventDefault()
        const boundingRect = evt.currentTarget.parentElement?.getBoundingClientRect()
        if (!boundingRect) return
        setContextMenu({ visible: true, x: evt.clientX - boundingRect.x, y: evt.clientY - boundingRect.y, fileId });
    }

    const handleClickFile = useCallback((fileId: string) => {
        onOpenFile(fileId)
        setContextMenu({ visible: false, x: 0, y: 0, fileId: '' })
    }, [onOpenFile])

    const handleContextMenuAction = useCallback((fileId: string, action: string) => {
        if (action === 'delete') {
            onDeleteFile(fileId)
        }
        else if (action === 'duplicate') {
            onDuplicateFile(fileId)
        }
        else if (action === 'rename') {
            onRenameFile(fileId)
        }
        setContextMenu({ visible: false, x: 0, y: 0, fileId: '' })
    }, [onDeleteFile, onDuplicateFile, onRenameFile])
    
    return (
        <div onMouseLeave={() => {setContextMenu({visible: false, x: 0, y: 0, fileId: ''})}} style={{position: 'absolute'}}>
            <table className="file-browser-table">
                <tbody>
                    {
                        files.map(x => (
                            <tr key={x.id} onClick={() => handleClickFile(x.id)} onContextMenu={(evt) => handleContextMenu(evt, x.id)} style={{cursor: 'pointer'}}>
                                <td><FileIcon fileName={x.name} /></td>
                                <td>{x.name}</td>
                                <td>{timeAgoString(x.timestampModified)}</td>
                                <td>{formatByteCount(x.size)}</td>
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
                        fileId={contextMenu.fileId}
                        onAction={handleContextMenuAction}
                    />
                )
            }
        </div>
    )
}

export const FileIcon: FunctionComponent<{fileName: string}> = ({fileName}) => {
    const ext = fileName.split('.').pop()
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

const ContextMenu: FunctionComponent<{ x: number, y: number, fileId: string, onAction: (fileId: string, a: string) => void}> = ({x, y, fileId, onAction}) => {
    const options = [
        {
            id: "delete",
            label: <span><SmallIconButton icon={<Delete />} /> delete {fileId}</span>
        }, {
            id: "rename",
            label: <span><SmallIconButton icon={<DriveFileRenameOutline />} /> rename...</span>
        }, {
            id: "duplicate",
            label: <span><SmallIconButton icon={<FileCopy />} /> duplicate...</span>
        }
    ]
  
    const onClick = (option: string) => {
      onAction(fileId, option)
    }
  
    return (
      <div className="file-browser-context-menu" style={{ position: 'absolute', top: y, left: x}}>
        {options.map(option => (
          <div key={option.id} onClick={() => onClick(option.id)}>{option.label}</div>
        ))}
      </div>
    )
}

export default ProjectFileBrowser2