import { UserAccountManagementPermission } from './user-account-permission-model';
export interface UserAccountManagement {


    USER_ACCOUNT_ID: number
    STAFF_ID: number
    ROLE_ID: number
    USER_TYPE: number
    USER_NAME: string
    PASSWORD: string
    IS_SIGN_ON: number
    SIGN_ON_IP: string,
    APPROVE_CODE: string,
    IS_ACTIVE: number,
    MasStaff: string,
    Role: string,
    UserAccountPermission : UserAccountManagementPermission[];
}