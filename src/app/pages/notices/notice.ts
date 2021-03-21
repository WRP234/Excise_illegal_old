import { NoticeStaff } from './notice-staff';
import { NoticeInformer } from './notice-informer';
import { NoticeLocale } from './notice-locale';
import { NoticeProduct } from './notice-product';
import { NoticeSuspect } from './notice-suspect';
import { NoticeDocument } from './notice-document';

export class Notice {
    public NOTICE_ID: string;
    public ARREST_ID: string;
    public OFFICE_ID: string;
    public NOTICE_CODE: string;
    public OFFICE_CODE: string;
    public OFFICE_NAME: string;
    public NOTICE_DATE: string;
    public NOTICE_DUE: string;
    public NOTICE_DUE_DATE: string;
    public NOTICE_DUE_TIME: string;
    public COMMUNICATION_CHANNEL: number;
    public IS_ARREST: number;
    public IS_AUTHORITY: number;
    public IS_ACTIVE: number;
    public IS_MATCH: number;
    public CREATE_DATE: string;
    public CREATE_USER_ACCOUNT_ID: string;
    public UPDATE_DATE: string;
    public UPDATE_USER_ACCOUNT_ID: string;
    // public NoticeCode: string;
    // public NoticeStationCode: string;
    // public NoticeStation: string;
    // public NoticeDate: string;
    // public NoticeTime: string;
    // public NoticeDue: string;
    // public NoticeDueDate: string;
    // public NoticeDueTime: string;
    // public GroupNameDesc: string;
    // public CommunicationChanelID: string;
    // public DataSource: string;
    // public FilePath: string;
    // public ArrestCode: string;
    // public IsActive: number;
    // public IsArrest: number;
    public NoticeStaff: Array<NoticeStaff>;
    public NoticeInformer: Array<NoticeInformer>;
    public NoticeLocale: Array<NoticeLocale>;
    public NoticeProduct: Array<NoticeProduct>;
    public NoticeSuspect: Array<NoticeSuspect>;
    // public NoticeDocument: Array<NoticeDocument>;

    // public RowId: number;
    // public IsChecked: boolean;
}

export interface notice_list {
    IS_ARREST: string;
    NOTICE_CODE: string;
    NOTICE_DATE: string;
    NOTICE_DATE_TH: string;
    NOTICE_DUE_DATE: string;
    NOTICE_ID: string;
    OFFICE_NAME: string;
    STAFF_FIRST_NAME: string;
    STAFF_LAST_NAME: string;
    STAFF_TITLE_NAME: string;
    STAFF_FULL_NAME: string;
    SUSPECT_FIRST_NAME: string;
    SUSPECT_LAST_NAME: string;
    SUSPECT_MIDDLE_NAME: string;
    SUSPECT_TITLE_NAME: string;
    SUSPECT_FULL_NAME: string;
    NoticeSuspect: any[];
    NoticeStaff: any[];

    //customs
    index: number;
}

