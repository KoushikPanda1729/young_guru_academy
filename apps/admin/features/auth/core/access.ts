import { adminAc, defaultStatements, ownerAc } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
    ...defaultStatements,
    marketing: ['create', 'update', 'delete', 'get'],
    testPortal: ['create', 'update', 'delete', 'get'],
    chat: ['create', 'update', 'delete', 'get'],
    coupon: ['create', 'update', 'delete', 'get'],
    people: ['create', 'update', 'delete', 'get'],
    analytics: ['create', 'update', 'delete', 'get'],
    dashboard: ['create', 'update', 'delete', 'get'],
    reportGeneration: ['create', 'update', 'delete', 'get'],
    course: ['create', 'update', 'delete', 'get'],
    community: ['create', 'update', 'delete', 'get'],
    user: ['create', 'update', 'delete', 'get'],
    call: ['create', 'update', 'delete', 'get'],
    review: ['create', 'update', 'delete', 'get'],
    users: ["create", "update", "delete", "get"],
    platform: ["create", "update", "delete", "get"],
} as const

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
    ...ownerAc.statements,
    marketing: ['create', 'update', 'delete', 'get'],
    testPortal: ['create', 'update', 'delete', 'get'],
    chat: ['create', 'update', 'delete', 'get'],
    coupon: ['create', 'update', 'delete', 'get'],
    people: ['create', 'update', 'delete', 'get'],
    analytics: ['create', 'update', 'delete', 'get'],
    dashboard: ['create', 'update', 'delete', 'get'],
    reportGeneration: ['create', 'update', 'delete', 'get'],
    course: ['create', 'update', 'delete', 'get'],
    community: ['create', 'update', 'delete', 'get'],
    call: ['create', 'update', 'delete', 'get'],
    review: ['create', 'update', 'delete', 'get'], 
    users: ["create", "update", "delete", "get"],
    platform: ["create", "update", "delete", "get"],
})

export const admin = ac.newRole({
    ...adminAc.statements,
    marketing: ['create', 'update', 'delete', 'get'],
    testPortal: ['create', 'update', 'delete', 'get'],
    chat: ['create', 'update', 'delete', 'get'],
    coupon: ['create', 'update', 'delete', 'get'],
    people: ['create', 'update', 'delete', 'get'],
    analytics: ['create', 'update', 'delete', 'get'],
    dashboard: ['create', 'update', 'delete', 'get'],
    reportGeneration: ['create', 'update', 'delete', 'get'],
    course: ['create', 'update', 'delete', 'get'],
    community: ['create', 'update', 'delete', 'get'],
    users: ['create', 'update', 'delete', 'get'],
    call: ['create', 'update', 'delete', 'get'],
    review: ['create', 'update', 'delete', 'get'],
    platform: ["create", "update", "delete", "get"], 
})
