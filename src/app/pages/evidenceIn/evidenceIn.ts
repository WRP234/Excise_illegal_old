export class Evidence_In {
    public EVIDENCE_IN_ID?: string;
    public PROVE_ID?: string;
    public EVIDENCE_IN_CODE?: string;
    public EVIDENCE_IN_DATE?: string;
    public EVIDENCE_IN_TIME?: string;
    public IS_RECEIVE?: string;
    public DELIVERY_NO?: string;
    public DELIVERY_DATE?: string;
    public DELIVERY_TIME?: string;
    public EVIDENCE_IN_TYPE?: string;
    public EvidenceInTypeName?: string; 
    public DeptNameSent?: string; 
    public DeptNameRecv?: string; 
    public REMARK?: string;
    public RETURN_DATE?: string;
    public IS_ACTIVE?: number;
    public IS_EDIT?: number;
    public EvidenceInItem?: EvidenceInItem[];
    public EvidenceInStaff?: EvidenceInStaff[];
}

export class EvidenceInStaff {
    public EVIDENCE_IN_STAFF_ID?: string;
    public ProveID?: string;
    public EVIDENCE_IN_ID?: string;
    public STAFF_CODE?: string;
    public TITLE_NAME_TH?: string;
    public FIRST_NAME?: string;
    public LAST_NAME?: string;
    public OPERATION_POS_CODE?: string;
    public OPREATION_POS_NAME?: string;
    public OPREATION_POS_LEVEL?: string;
    public OPERATION_POS_LEVEL_NAME?: string;
    public OPERATION_DEPT_CODE?: string;
    public OPERATION_DEPT_NAME?: string;
    public OPERATION_DEPT_LEVEL?: string;
    public OPERATION_OFFICE_CODE?: string;
    public OPERATION_OFFICE_NAME?: string;
    public OPERATION_OFFICE_SHORT_NAME?: string;
    public CONTRIBUTOR_ID?: string;
    public IS_ACTIVE?: string;
}

export class EvidenceInItem {
    public EVIDENCE_IN_ITEM_ID?: string;
    public EvidenceOutItemID?: string;
    public EVIDENCE_IN_ITEM_CODE?: string;
    public PRODUCT_SEQ?: number;
    public EVIDENCE_IN_ID?: string;
    public PRODUCT_GROUP_CODE?: string;
    public IS_DOMESTIC?: string;
    public PRODUCT_CODE?: string;
    public PRODUCT_BRAND_CODE ?: string;
    public PRODUCT_BRAND_NAME_TH?: string;
    public PRODUCT_BRAND_NAME_EN?: string;
    public PRODUCT_SUBBRAND_CODE?: string;
    public PRODUCT_SUBBRAND_NAME_TH?: string;
    public PRODUCT_SUBBRAND_NAME_EN?: string;
    public PRODUCT_MODEL_CODE?: string;
    public PRODUCT_MODEL_NAME_TH?: string;
    //public FixNo1?: string;
    public DegreeCode?: string;
    public DEGREE?: string;
    //public FixNo2?: string;
    //public SequenceNo?: string;
    public PRODUCT_DESC?: string;
    //public CarNo?: string;
    public DELIVERY_QTY?: string;
    public DELIVERY_QTY_UNIT?: string;
    public DELIVERY_SIZE?: string;
    public DELIVERY_SIZE_UNIT?: string;
    public DELIVERY_NET_VOLUMN?: string;
    public DELIVERY_NET_VOLUMN_UNIT?: string;
    public DAMAGE_QTY?: string;
    public DAMAGE_QTY_UNIT?: string;
    public DAMAGE_SIZE?: string;
    public DAMAGE_SIZE_UNIT?: string;
    public DAMAGE_NET_VOLUMN?: string;
    public DAMAGE_NET_VOLUMN_UNIT?: string;
    public IS_ACTIVE?: string;
    public REMARK?: string;
    public RECEIVE_QTY?: string;
    public RECEIVE_NET_VOLUMN?: string;
    public IsNewItem?: boolean;
    public IsDelItem?: boolean;
    public EvidenceOutStockBalance?: EvidenceStockBalance[];
}

export class EvidenceStockBalance{
    public StockID?: string;
    public EVIDENCE_IN_ITEM_ID?: string;
    public WAREHOUSE_ID?: string;
    public RECEIVE_QTY?: string;
    public RECEIVE_QTY_UNIT?: string;
    public RECEIVE_SIZE?: string;
    public RECEIVE_SIZE_UNIT?: string;
    public RECEIVE_NET_VOLUMN?: string;
    public RECEIVE_NET_VOLUMN_UNIT?: string;
    public BALANCE_QTY?: string;
    public BALANCE_QTY_UNIT?: string;
    public BALANCE_SIZE?: string;
    public BALANCE_SIZE_UNIT?: string;
    public BALANCE_NET_VOLUMN?: string;
    public BALANCE_NET_VOLUMN_UNIT?: string;
    public IS_FINISH?: string;
    public IS_RECEIVE?: string;
}

export class Document {
    public DocumentSeq?: number;
    public DocumentID?: string;
    public ReferenceCode?: string;
    public FilePath?: string;
    public DataSource?: string;
    public DocumentType?: string;
    public DocumentName?: string;
    public IsActive?: string;
    public IsNewItem?: boolean;
    public IsDelItem?: boolean;
}