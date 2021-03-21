
export interface IArrestDocument {
    DATA_SOURCE: string,
    DOCUMENT_ID: number,
    DOCUMENT_NAME: string,
    DOCUMENT_OLD_NAME: string,
    DOCUMENT_TYPE: string,
    FILE_TYPE: string,
    FOLDER: string,
    IS_ACTIVE: number,
    REFERENCE_CODE: string,
    CONTENT: ArrayBuffer | string;

    IMAGE_SHOW?: string;
}

export interface IDocumentupdDelete {
    DOCUMENT_ID: number,
}