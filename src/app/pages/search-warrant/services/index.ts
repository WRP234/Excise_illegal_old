import {SearchWarrantHelperService} from './search-warrant-helper.service';
import {SearchWarrantService} from './search-warrant.service';
import {ArrestService} from './arrest.service';
import {ArrestStaffService} from './arrest-staff.service';
import {ArrestProductService} from './arrest-product.service';
import {ArrestProductDetailService} from './arrest-product-detail.service';
import {ArrestNoticeService} from './arrest-notice.service';
import {ArrestLawbreakerService} from './arrest-lawbreaker.service';
import {ArrestIndictmentService} from './arrest-indictment.service';
import {ArrestIndictmentDetailService} from './arrest-indictment-detail.service';
import {MasterService} from './master.service';
import {PurityCertService} from './arrest-purity-cert.service';
import {ArrestSearchWarrantService} from './arrest-search-warrant.service';
import {ArrestMasPersonService} from './arrest-mas-person.service';
import {MasPersonService} from './mas-person.service';
import {TransactionRunningService} from './transaction-running.service';
import {MasStaffService} from './mas-staff.service';
import {ArrestMasGuiltBaseService} from './arrest-mas-guilt-base.service';
import {ArrestDocumentService} from './arrest-document.service';


export const services: any[] = [
  SearchWarrantService,
  SearchWarrantHelperService,
  ArrestService,
  ArrestStaffService,
  ArrestProductService,
  ArrestProductDetailService,
  ArrestNoticeService,
  ArrestLawbreakerService,
  ArrestIndictmentService,
  ArrestIndictmentDetailService,
  MasterService,
  PurityCertService,
  ArrestSearchWarrantService,
  ArrestMasPersonService,
  ArrestMasGuiltBaseService,
  MasStaffService,
  TransactionRunningService,
  MasPersonService,
  ArrestDocumentService
];

export * from './search-warrant.service';
export * from './arrest.service';
export * from './arrest-staff.service';
export * from './arrest-product.service';
export * from './arrest-product-detail.service';
export * from './arrest-notice.service';
export * from './arrest-lawbreaker.service';
export * from './arrest-indictment.service';
export * from './arrest-indictment-detail.service';
export * from './master.service';
export * from './arrest-purity-cert.service';
export * from './arrest-search-warrant.service';
export * from './arrest-mas-person.service';
export * from './arrest-mas-guilt-base.service';
export * from './mas-staff.service';
export * from './transaction-running.service';
export * from './mas-person.service';
export * from './mas-sub-district.service';
export * from './arrest-document.service';
