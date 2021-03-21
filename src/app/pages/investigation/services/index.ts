import { InvestgateService } from './investgate.service';
import { InvestgateDetailService } from './investgate-detail.service';
import { InvestgateMasLawbreakerService } from './investgate-mas-lawbreaker.service';
import { InvestgateMasSuspectService } from './investgate-mas-suspect.service';
import { MasStaffService } from './mas-staff.service';
import { MasterService } from './master.service';

export const services: any[] = [
    InvestgateService,
    InvestgateDetailService,
    InvestgateMasLawbreakerService,
    InvestgateMasSuspectService,
    MasStaffService,
    MasterService
]

export * from './investgate-detail.service'
export * from './investgate-mas-lawbreaker.service'
export * from './investgate-mas-suspect.service'
export * from './investgate.service'
export * from './mas-staff.service'

