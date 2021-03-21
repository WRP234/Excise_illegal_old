import { FormControl } from '@angular/forms';
export class compareDocument {
  public RowsId: number;
  public DocumentID: number;
  public ReferenceCode: string;
  public FilePath: string;
  public DataSource: string;
  public DocumentType: number;
  public DocumentName: string;
  public IsActive: number;
  public IsNewItem: boolean;
}

export const compareDocumentFormControl = {
  // DocumentID: new FormControl(null),
  // ReferenceCode: new FormControl(null),
  // FilePath: new FormControl(null),
  // DataSource: new FormControl(null),
  // DocumentType: new FormControl(null),
  // DocumentName: new FormControl(null),
  // IsActive: new FormControl(null),
  // IsNewItem: new FormControl(null)
  DocumentID: new FormControl(null),
  DocumentName: new FormControl(null),
  ReferenceCode: new FormControl(null),
  FilePath: new FormControl(null),
  DataSource: new FormControl(null),
  IsActive: new FormControl(null),
  IsNewItem: new FormControl(null)
}

export interface Document {
  FILE: any;
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