export interface UserAccountManagementPermission {
    USER_PERMISSION_ID:number;
    USER_ACCOUNT_ID:number;
    PROGRAM_CODE:string;
    IS_CREATE: boolean;
    IS_READ: boolean;
    IS_UPDATE: boolean;
    IS_DELETE: boolean;

}