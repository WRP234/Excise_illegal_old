import { RequestListService } from './RequestList.service';
import { RequestArrestLawsuitService } from './RequestArrestLawsuit.service';
import { RequestBribeRewardService } from './RequestBribeReward.service';
import { RequestRewardService } from './RequestReward.service';
import { RequestCommandService } from './RequestCommand.service';
import { RequestNoticeService } from './RequestNotice.service';
import { RequestBribeService } from './RequestBribe.service';
import { REWARD_MASTER_SERVICES } from './master';
import { RewardService } from '../reward.service';
import { TransactionRunningService } from './TransactionRunning.service';
import { RequestPaymentFineDetailService } from './RequestPaymentFineDetail.service';
import { RequestCompareService } from './RequestCompare.service';
import { NonRequestRewardStaffService } from './NonRequestRewardStaff.service';
import { RequstLawsuitJudgementService } from './RequstLawsuitJudgement.service';
import { RequestPaymentFineService } from './RequestPaymentFine.service';
import { RequestBribeDetailService } from './RequestBribeDetail.service';
import { RequestRewardDetailService } from './RequestRewardDetail.service';
import { RequestRewardStaffService } from './RequestRewardStaff.service';

export const REWARD_SERVICES = [
  ...REWARD_MASTER_SERVICES,
  RewardService,
  RequestListService,
  RequestArrestLawsuitService,
  RequestBribeRewardService,
  RequestRewardService,
  RequestCommandService,
  RequestNoticeService,
  RequestBribeService,
  RequestPaymentFineDetailService,
  TransactionRunningService,
  RequestCompareService,
  NonRequestRewardStaffService,
  RequstLawsuitJudgementService,
  RequestPaymentFineService,
  RequestBribeDetailService,
  RequestRewardDetailService,
  RequestRewardStaffService
];
