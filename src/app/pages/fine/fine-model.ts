import { ArrestLawbreaker } from '../model/arrest-lawbreaker';
import { Time } from '@angular/common';





export class CompareDetailFine {
    public CompareFineID?: number;
    public CompareDetailID?: number;
    public ProductID?: number;
    public ProductFine?: number;
    public VatValue?: number;
    public FineRate?: number;
    public IsActive?: number;
}






export class ICompareDetail
{
    public CompareDetailID?: number;
    public CompareID?: number;
    public IndictmentDetailID?: number;
    public Lawbreaker?: string;
    public CompareAction?: string;
    public LawbrakerTestimony?: string;
    public Fact?: string;
    public IsRequest?: number;
    public RequestForAction?: string;
    public IsProvisionalAcquittal?: number;
    public Bail?: string;
    public Guaruntee?: string;
    public CompareFine?: number;
    public PaymentFineDate?: Date;
    public PaymentFineAppointDate?: Date;
    public PaymentVatDate?: Date;
    public ApproveReportDate?: Date; 
    public ApproveReportType?: number;
    public CommandDate?: Date;
    
    public CompareReason?: string;
}

export class CompareStation
{
    public OfficeCode?: string;
    public OfficeName?: string;
}