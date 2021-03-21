import { RewardHelper } from '../../reward.helper';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IRequestBribe } from '../../interfaces/RequestBribe.interface';
import { IRequestCommand } from '../../interfaces/RequestCommand';
import { IRequestReward } from '../../interfaces/RequestReward';
import { IRequestArrestLawsuit } from '../../interfaces/RequestArrestLawsuit.interface';

export class ManageConfig extends RewardHelper {

  public ILG60_08_02_00_00E08_EXPANDED = true;
  public ILG60_08_02_00_00E09_EXPANDED = true;
  public ILG60_08_02_00_00E11_EXPANDED = true;
  public ILG60_08_02_00_00E14_EXPANDED = true;

  public ILG60_08_02_00_00E08_DISABLED = false;
  public ILG60_08_02_00_00E09_DISABLED = false;
  public ILG60_08_02_00_00E11_DISABLED = false;
  public ILG60_08_02_00_00E14_DISABLED = false;

  public ILG60_08_02_00_00E11_BUTTON_DISABLED = false;
  public ILG60_08_02_00_00E14_BUTTON_DISABLED = false;
  
  public ILG60_08_02_00_00E09_EDIT = false;

  public ILG60_08_02_00_00E08_DATA$ = new BehaviorSubject<
    IRequestArrestLawsuit[]
  >(null);
  public ILG60_08_02_00_00E09_DATA$ = new BehaviorSubject<IRequestCommand[]>(
    null
  );
  public ILG60_08_02_00_00E11_DATA$ = new BehaviorSubject<IRequestBribe[]>(
    null
  );
  public ILG60_08_02_00_00E14_DATA$ = new BehaviorSubject<IRequestReward[]>(
    null
  );

  public ILG60_08_02_00_00E09_SAVE: IRequestCommand = {
    ArrestCode: '',
    CommandDate: '',
    CommandID: null,
    CommandNo: '',
    CommandTime: '',
    IsActive: 1,
    RequestCommandDetail: [],
    TotalPart: 0
  };

  public IndictmentID$ = new BehaviorSubject<number | null>(null);
  public ArrestCode$ = new BehaviorSubject<string | null>(null);

  public CommandID$ = new BehaviorSubject<number | null>(null);
  public PageLoadHaveNotice$ = new BehaviorSubject<number | null>(null);
  public RequestBribeRewardID$ = new BehaviorSubject<number | null>(null);

  public RequestArrestLawsuitgetByIndictmentID$ = new BehaviorSubject<any>(
    null
  );
  public RequestBribeRewardgetByIndictmentID$ = new BehaviorSubject<any>(null);
  public RequestRewardgetByRequestBribeRewardID$ = new BehaviorSubject<any>(
    null
  );
  public RequestNoticegetByArrestCode$ = new BehaviorSubject<any>(null);
  public RequestCommandinsAll$ = new BehaviorSubject<any>(null);

  public RequestBribeRewardinsAll$ = new BehaviorSubject<any>(null);

  public RequestCommandgetByArrestCode$ = new BehaviorSubject<any>(null);

  public RequestBribegetByRequestBribeRewardID$ = new BehaviorSubject<any>(
    null
  );

  public mode$ = new BehaviorSubject<any>('C');
}
