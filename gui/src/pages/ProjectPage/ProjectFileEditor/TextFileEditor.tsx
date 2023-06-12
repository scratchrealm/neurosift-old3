import { ViewAgenda } from "@mui/icons-material";
import { FunctionComponent, useMemo } from "react";
import { useProject } from "../ProjectPageContext";
import TextEditor, { ToolbarItem } from "./TextEditor";

type Props = {
    fileName: string
    fileContent: string
    onSaveContent: (text: string) => void
    editedFileContent: string
    setEditedFileContent: (text: string) => void
    readOnly: boolean
    width: number
    height: number
}

const TextFileEditor: FunctionComponent<Props> = ({fileName, fileContent, onSaveContent, editedFileContent, setEditedFileContent, readOnly, width, height}) => {
    const {openTab} = useProject()
    const language = fileName.endsWith('.json') ? (
        'json'
    ) : fileName.endsWith('.yaml') ? (
        'yaml'
    ) : fileName.endsWith('.yml') ? (
        'yaml'
    ) : fileName.endsWith('.py') ? (
        'python'
    ) : fileName.endsWith('.js') ? (
        'javascript'
    ) : fileName.endsWith('.md') ? (
        'markdown'
    ) : fileName.endsWith('.ns') ? (
        'yaml'
    ) : (
        'text'
    )

    const wordWrap = language === 'json' || language === 'markdown'

    const toolbarItems: ToolbarItem[] = useMemo(() => {
        if (fileName.endsWith('.ns')) {
            return [
                {
                    label: 'view',
                    icon: <ViewAgenda />,
                    onClick: () => {
                        openTab(`view:${fileName}`)
                    },
                    tooltip: 'View this Neurosift figure'    
                }
            ]
        }
        else {
            return []
        }
    }, [fileName, openTab])

    return (
        <TextEditor
            width={width}
            height={height}
            language={language}
            label={fileName}
            text={fileContent}
            onSaveText={onSaveContent}
            editedText={editedFileContent}
            onSetEditedText={setEditedFileContent}
            wordWrap={wordWrap}
            toolbarItems={toolbarItems}
            // onReload=
            readOnly={readOnly}
        />
    )
}

export default TextFileEditor