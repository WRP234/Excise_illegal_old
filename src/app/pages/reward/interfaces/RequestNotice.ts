export interface IRequestNotice {
  NoticeCode: string;
  ArrestCode: string;
  IsActive: number;
}

export interface IRequestNoticegetByArrestCode {
  ArrestCode?: string;
}
