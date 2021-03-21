export interface PersonListAdv {

    PERSON_ID?: number;
    ENTITY_TYPE: number;
    PERSON_TYPE: number;
    LAWBREAKER_NAME: string;
    REFERENCE_ID: string;
    COMPANY_NAME: string;
    LAWBREAKER_ADDRESS: string;
    MISTREAT_NO: number;
}

export class PERSON_INFO {
    public PERSON_TYPE: any;
    public ENTITY_TYPE: any;
    public GENDER_TYPE: any;
    public ID_CARD: any;
    public TITLE_NAME_TH: any;
    public FIRST_NAME: any;
    public MIDDLE_NAME: any;
    public LAST_NAME: any;
    public OTHER_NAME: any;
    public BIRTH_DATE: any;
    public BLOOD_TYPE: any;
    public RACE_NAME_TH: any;
    public NATIONALITY_NAME_TH: any;
    public MARITAL_STATUS: any;
    public RELIGION_NAME_TH: any;
    public CAREER: any;
    public TEL_NO: any;
    public MISTREAT_NO: any;
    public EMAIL: string;
}

export class COMPANY_INFO {
    COMPANY_REGISTRATION_NO: any;
    COMPANY_FOUND_DATE: any;
    COMPANY_LICENSE_NO: any;
    COMPANY_LICENSE_DATE_FROM: any;
    COMPANY_LICENSE_DATE_TO: any;
    EXCISE_REGISTRATION_NO: any;
    ID_CARD: any;
}

export interface IFileList {
    FILE_NAME: string;
    IMAGE: string;
}

export interface suspectsImgList {
    SUSPECT_NAME: string;
    IMAGE: string;
    MISTREAT_NO: string;
    LAWBREAKER_ADDRESS: string;
    PERSON_TYPE: string;
}

export interface Document {
    DATA_SOURCE: string,
    DOCUMENT_ID: number,
    DOCUMENT_NAME: string,
    DOCUMENT_OLD_NAME: string,
    DOCUMENT_TYPE: number,
    FILE_TYPE: string,
    FOLDER: any,
    IS_ACTIVE: number,
    REFERENCE_CODE: string,
    CONTENT: ArrayBuffer | string;


    IMAGE_SHOW?: string;
    IsNewItem?: boolean;
}

export interface updDelete {
    DOCUMENT_ID: number,
}

export enum FileType {
    docx = 'docx',
    doc = 'doc',
    xlsx = 'xlsx',
    xls = 'xls',
    pdf = 'pdf'
}

export enum ImageDocument {
    xlsx = 'assets/images/document/xlsx-file.png',
    docx = 'assets/images/document/doc-file.png',
    pdf = 'assets/images/document/pdf-file.png'
}