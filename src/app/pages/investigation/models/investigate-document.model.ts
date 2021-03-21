export class InvestigateDocumentModel {
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