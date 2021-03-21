import { FormControl } from "@angular/forms";

export class ArrestDocument {
  // public DocumentID = '';
  // public ReferenceCode = '';
  // public FilePath = '';
  // public DataSource = '';
  // DocumentType = '';
  // DocumentName = '';
  // public IsActive: number;
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

export const ArrestDocumentFormControl = {
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
  DocumentType: new FormControl(12),
  IsActive: new FormControl(1),
  IsNewItem: new FormControl(null)
};

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


  FILE: any;
  IMAGE_SHOW?: string;
  IsNewItem?: boolean;
}

export interface updDelete {
  DOCUMENT_ID: number
}

// export class NoticeDocument {
//   // public DocumentID = '';
//   // public ReferenceCode = '';
//   // public FilePath = '';
//   // public DataSource = '';
//   // DocumentType = '';
//   // DocumentName = '';
//   // public IsActive: number;
//   public DocumentID: string;
//   public DocumentName: string;
//   public ReferenceCode: string;
//   public FilePath: string;
//   public DataSource: string;
//   public DocumentType:number;
//
//   // --- Custom --- //
//   public IsNewItem: boolean;
//   public IsActive: number;
// }
