import validateObject, { isArrayOf, isBoolean, isEqualTo, isNumber, isOneOf, isString, optional } from "./validateObject"

export type NSUser = {
    userId: string
}

export type NSWorkspace = {
    workspaceId: string
    ownerId: string
    name: string
    description: string
    users: {
        userId: string
        role: 'admin' | 'editor' | 'viewer'
    }[]
    publiclyReadable: boolean
    listed: boolean
    timestampCreated: number
    timestampModified: number
    computeResourceId?: string
}

export const isNSWorkspace = (x: any): x is NSWorkspace => {
    return validateObject(x, {
        workspaceId: isString,
        ownerId: isString,
        name: isString,
        description: isString,
        users: isArrayOf(y => (validateObject(y, {
            userId: isString,
            role: isOneOf([isEqualTo('admin'), isEqualTo('editor'), isEqualTo('viewer')])
        }))),
        publiclyReadable: isBoolean,
        listed: isBoolean,
        timestampCreated: isNumber,
        timestampModified: isNumber,
        computeResourceId: optional(isString)
    })
}

export type NSProject = {
    projectId: string
    workspaceId: string
    name: string
    description: string
    timestampCreated: number
    timestampModified: number
}

export const isNSProject = (x: any): x is NSProject => {
    return validateObject(x, {
        projectId: isString,
        workspaceId: isString,
        name: isString,
        description: isString,
        timestampCreated: isNumber,
        timestampModified: isNumber
    })
}

export type NSProjectFile = {
    projectId: string
    workspaceId: string
    fileName: string
    contentSha1: string
    contentSize: number
    timestampModified: number
}

export const isNSProjectFile = (x: any): x is NSProjectFile => {
    return validateObject(x, {
        projectId: isString,
        workspaceId: isString,
        fileName: isString,
        contentSha1: isString,
        contentSize: isNumber,
        timestampModified: isNumber
    })
}

export type NSDataBlob = {
    workspaceId: string
    projectId: string
    sha1: string
    size: number
    content: string
}

export const isNSDataBlob = (x: any): x is NSDataBlob => {
    return validateObject(x, {
        workspaceId: isString,
        projectId: isString,
        sha1: isString,
        size: isNumber,
        content: isString
    })
}