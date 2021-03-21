import { ArrestStaff } from './arrest-staff';
import { ArrestIndictment } from './arrest-indictment';
import { ArrestLocale } from './arrest-locale';
import { ArrestLawbreaker } from './arrest-lawbreaker';
import { ArrestProduct } from './arrest-product';
import { ArrestDocument } from './arrest-document';

export class Arrest {
    public RowsId: number;
    public ArrestCode: string;
    public ArrestDate: string;
    public ArrestTime: string;
    public OccurrenceDate: string;
    public OccurrenceTime: string;
    public ArrestStationCode: string;
    public ArrestStation: string;
    public HaveCulprit: string;
    public Behaviour: string;
    public Testimony: string;
    public Prompt: string;
    public IsMatchNotice: string;
    public ArrestDesc: string;
    public NoticeCode: string;
    public InvestigationSurveyDocument: string;
    public InvestigationCode: string;
    public IsActive: string;
    public ArrestStaff: Array<ArrestStaff>;
    public ArrestLocale: Array<ArrestLocale>;
    public ArrestIndictment: Array<ArrestIndictment>;
    public ArrestLawbreaker: Array<ArrestLawbreaker>;
    public ArrestProduct: Array<ArrestProduct>;
    public ArrestDocument: Array<ArrestDocument>;
}
