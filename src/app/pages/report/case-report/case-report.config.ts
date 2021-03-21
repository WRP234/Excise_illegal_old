export enum reportCode {
    ILG_12_1 = 'ILG60_00_12_001',
    ILG_12_2 = 'ILG60_00_12_002',
    ILG_12_3 = 'ILG60_00_12_003',
    ILLR8113 = 'ILG60_00_12_004',
    ILG_12_5 = 'ILG60_00_12_005',
}

export class caseReportConfig {
    public reportList: any[] = [
        { reportName: 'รายงานผลคดี ส.ส. 2/55', reportCode: reportCode.ILG_12_1 },
        { reportName: 'สถิติข้อมูลของงานข้อมูลผลคดี', reportCode: reportCode.ILG_12_2 },
        { reportName: 'รายงานสถานะผลคดี', reportCode: reportCode.ILG_12_3 },
        { reportName: 'สถิติการปราบปรามผู้กระทำผิด', reportCode: reportCode.ILLR8113 },
        { reportName: 'รายงานสรุปใบเสร็จนำส่งเงิน', reportCode: reportCode.ILG_12_5 },
    ];
}