import { FormControl } from '@angular/forms';

export class DeliveryStorageDocument {
    public DocumentID: string;
    public DocumentName: string;
    public ReferenceCode: string;
    public FilePath: string;
    public DataSource: string;
    public DocumentType: number;

    // --- Custom --- //
    public IsNewItem: boolean;
    public IsActive: number;
}

export const DeliveryStorageDocumentFormControl = {
    DocumentID: new FormControl(null),
    DocumentName: new FormControl(null),
    ReferenceCode: new FormControl(null),
    FilePath: new FormControl(null),
    DataSource: new FormControl(null),
    DocumentType: new FormControl(2),
    IsActive: new FormControl(1),
    IsNewItem: new FormControl(null)
}

export interface Document {
    DOC_SEQ?: number,
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


    FILE: any;
    IMAGE_SHOW?: string;
    IsNewItem?: boolean;
    IsDelItem?: boolean;
}

export interface updDelete {
    DOCUMENT_ID: number,
}

export enum FileType {
    docx = 'docx',
    doc = 'doc',
    xlsx = 'xlsx',
    xls = 'xls',
    pdf = 'pdf',
    jpg = 'jpg',
    jpeg = 'jpeg',
    png = 'png',
    gif = 'gif',
    mp4 = 'mp4',
    mov = 'mov',
    avi = 'avi',
    m4v = 'm4v',
    mpg = 'mpg',
    mpeg = 'mpeg',
}

export enum ImageDocument {
    xlsx = 'assets/images/document/xlsx-file.png',
    docx = 'assets/images/document/doc-file.png',
    pdf = 'assets/images/document/pdf-file.png'
}