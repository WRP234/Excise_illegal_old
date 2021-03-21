export class UserAccountListItem {
    userAccountID: number;
    staffCode: string;
    roleID: number;
    userType: number;
    userName: string;
    password: string;
    isSignOn: boolean;
    signOnIP: string;
    approveCode: string;
    isActive: boolean;

    //staffCode: string;
    perType: number;
    titleName: string;
    firstName: string;
    lastName: string;
    operationPosCode: string;
    operationPosName: string;
    managementPosCode: string;
    managementPosName: string;
    posLevel: string;
    posLevelName: string;
    representationPosCode: string;
    representationPosName: string;
    operationDeptCode: string;
    operationDeptName: string;
    underDeptCode: string;
    underDeptName: string;
    deptLevel: string;
    officeCode: string;
    officeName: string;
    officeShortName: string;
    StatusCode: number;
    //isActive: boolean;

    public get FullName(): string {
        return this.titleName + "-" + this.firstName + "-" + this.lastName;
    }
}

export class UacUseraccount {
    userAccountID: number;
    staffCode: string;
    roleID: number;
    userType: number;
    userName: string;
    password: string;
    isSignOn: boolean;
    signOnIP: string;
    approveCode: string;
    isActive: boolean;
    masStaff: MasStaff;
}

export class MasStaff {
    staffCode: string;
    perType: number;
    titleName: string;
    firstName: string;
    lastName: string;
    operationPosCode: string;
    operationPosName: string;
    managementPosCode: string;
    managementPosName: string;
    posLevel: string;
    posLevelName: string;
    representationPosCode: string;
    representationPosName: string;
    operationDeptCode: string;
    operationDeptName: string;
    underDeptCode: string;
    underDeptName: string;
    deptLevel: string;
    officeCode: string;
    officeName: string;
    officeShortName: string;
    StatusCode: number;
    IsActive: boolean;

    public get FullName(): string {
        return this.titleName + " " + this.firstName + " " + this.lastName;
    }
}

export class UserAccountListItemResponse {
    IsSuccess: boolean;
    Msg: string;
    RunningID: number;
    Data: Array<UserAccountListItem>;
}

export class UserAccountListResponse {
    IsSuccess: boolean;
    Msg: string;
    RunningID: number;
    Data: Array<UacUseraccount>;
}

export class UserAccountListgetByKeywordRequest {
    TextSearch: string = "";
}

export class UserAccountListgetByConAdvRequest {
    //staffCode: string = "";
    //userName: string = "";
    staffName: string = "";
    operationPosName: string = "";
    //managementPosName: string = "";
    //representationPosName: string = "";
    //operationDeptName: string = "";
    //underDeptName: string = "";
    officeName: string = "";
}

export class UserAccountgetByConRequest {
    UserAccountID: number;
}

//== Role ======================================
export class RoleListItem {
    ROLE_ID: number;
    ROLE_NAME: string;
    ROLE_DESCRIPTION: number;
    IS_ACTIVE: number;
    ROLE_CODE: string;
}

export class RoleListgetByKeywordRequest {
    TEXT_SEARCH: string = "";
}

export class RoleListgetByConAdvRequest {
    ROLE_CODE: string = "";
    ROLE_NAME: string = "";
}


export class RoleListItemResponse {
    IsSuccess: boolean;
    Msg: string;
    RunningID: number;
    Data: Array<RoleListItem>;
}

export class RoleListResponse {
    IsSuccess: boolean;
    Msg: string;
    RunningID: number;
    //Data: Array<UacUseraccount>;
}

export class UacUserpermissionResponse {
    userAccountID: number;
    staffCode: string;
    roleID: number;
    userType: number;
    userName: string;
    password: string;
    isSignOn: boolean;
    signOnIP: string;
    approveCode: string;
    isActive: boolean;
    masStaff: MasStaff;
    uacRole: UacUserRole;
    uacUserpermissions: Array<UacUserpermission>;
}

export class UacUserRole {

    roleID: number;
    roleName: string;
    roleDescription: string;
    isActive: number;
    roleCode: string;

    uacRolepermissions: Array<UacUserpermission>;

}

export class UacUserpermission {

    userPermissionID: number = -1;
    userAccountID: number;
    programCode: string;
    isCreate: boolean = false;
    isRead: boolean = false;
    isUpdate: boolean = false;
    isDelete: boolean = false;
}

export class UserAccountinsAllRequest {

    //constructor() { this.uacUserpermissions = new Array<UacUserpermission>() }

    userAccountID: number = 1;
    staffCode: string = "";
    roleID: number = -1;
    userType: number = -1;
    userName: string = "";
    password: string = "";
    isSignOn: boolean = false;
    signOnIP: string = "";
    approveCode: string = "";
    isActive: boolean = false;

    uacUserpermissions: Array<UacUserpermission> = new Array<UacUserpermission>();

}

export class UserAccountinsAllResponse {
    /* {
        "IsSuccess": "True",
        "UserAccountID": "1",
        ""UserAccount Permission":
        [
            {
                ""UserAccount PermissionID": "1"
            },
            {
                ""UserAccount PermissionID": "2"	
            }
        ]
    } */
    UserAccountID: number;
    IsSuccess: boolean;
    Msg: string;
}

export class UserAccountgetByConResponse {
    UserAccountID: number;
    IsSuccess: boolean;
    Msg: string;
}

export class UserAccountupdByConResponse {
    UserAccountID: number;
    IsSuccess: boolean;
    Msg: string;
}

export class UserAccountupdByConRequest {
    userAccountID: number;
    staffCode: string;
    roleID: number;
    userType: number;
    userName: string;
    password: string;
    isSignOn: boolean;
    signOnIP: string;
    approveCode: string;
    isActive: boolean;

    uacUserpermissions: Array<UacUserpermission> = new Array<UacUserpermission>();
}



export class RoleinsAllRequest {

    //constructor() { this.uacUserpermissions = new Array<UacUserpermission>() }

    ROLE_ID: number;
    ROLE_NAME: string = "";
    ROLE_DESCRIPTION: string = "";
    IS_ACTIVE: boolean = false;
    ROLE_CODE: string = "";

    RolePermission: Array<RolePermission> = new Array<RolePermission>();

}

export class RolePermission {
    ROLE_PERMISSION_ID: number;
    ROLE_ID: number;
    MODULE_DETAIL_ID: number;
    MODULE_ID:number;
    // programCode: string = "";
    IS_CREATE: boolean = false;
    IS_READ: boolean = false;
    IS_UPDATE: boolean = false;
    IS_DELETE: boolean = false;
}
export class RolePermissionTest {

    ROLE_PERMISSION_ID: number;
    ROLE_ID: number;
    MODULE_DETAIL_ID: number;
    MODULE_ID:number;
    // programCode: string = "";
    IS_CREATE: number ;
    IS_READ: number ;
    IS_UPDATE: number ;
    IS_DELETE: number ;
}

export class RoleinsAllResponse {
    RoleID: number;
    IsSuccess: boolean;
    Msg: string;
}

export class RoleupdByConResponse {
    RoleID: number;
    IsSuccess: boolean;
    Msg: string;
}

export class RolegetByConRequest {
    ROLE_ID: number;
}

export class RolegetByConResponse {
    // IsSuccess: boolean;
    // Msg: string;
    // RunningID: number;
    // Data: Array<UacUseraccount>;

    ROLE_ID: number;
    ROLE_NAME: string = "";
    ROLE_DESCRIPTION: string = "";
    IS_ACTIVE: boolean = false;
    ROLE_CODE: string = "";

    RolePermission: Array<RolePermission> = new Array<RolePermission>();
}

export class UacRoleRequest {
    roleID: number = -1;
    roleName: string = "";
    roleDescription: string = "";
    isActive: boolean = false;
    roleCode: string = "";
    uacRolepermissions: Array<UacRolepermission> = new Array<UacRolepermission>();
}

export class UacRolepermission {
    ROLE_PERMISSION_ID: number;
    ROLE_ID: number;
    MODULE_DETAIL_ID: number;
    MODULE_ID:number;
    // programCode: string = "";
    IS_CREATE: boolean = false;
    IS_READ: boolean = false;
    IS_UPDATE: boolean = false;
    IS_DELETE: boolean = false;

    // rolePermissionID: number = -1;
    // roleID: number = -1;
    // programCode: string = "";
    // isCreate: boolean = false;
    // isRead: boolean = false;
    // isUpdate: boolean = false;
    // isDelete: boolean = false;
}
export class MasOperationPosition {
    OPERATION_POS_ID: number;
    OPERATION_POS_CODE: string = "";
    OPERATION_POS_NAME: string = "";
    IS_ACTIVE: number;
}
export class UacRolePermissionResponse {
    ROLE_ID: number;
    ROLE_NAME: string = "";
    ROLE_DESCRIPTION: string = "";
    IS_ACTIVE: boolean = false;
    ROLE_CODE: string = "";
    MasOperationPosition: MasOperationPosition;
    RolePermission: Array<RolePermission> = new Array<RolePermission>();
    // roleID: number = -1;
    // roleName: string = "";
    // roleDescription: string = "";
    // isActive: boolean = false;
    // roleCode: string = "";
    // RolePermission: Array<UacRolepermission> = new Array<UacRolepermission>();
}