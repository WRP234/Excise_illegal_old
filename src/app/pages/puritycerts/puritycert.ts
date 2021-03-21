import { SubDistrict } from './subDistrict';
import { PersonTitle } from './personTitle';
import { PuritycertStaff } from './puritycertStaffs';
import { PuritycertIndictments } from './puritycertIndictments';

export class Puritycert {
   public PuritycertId?: number;
   public ArrestId?: number;
   public OfficeId?: number;
   public OfficeCode?: string;
   public OfficeName?: string;
   public PuritycertCode?: string;
   public PutirycertDate?: string;
   public Gps?: string;
   public AddressNo?: string;
   public VillageNo?: string;
   public BuildingName?: string;
   public RoomNo?: string;
   public Floor?: string;
   public VillageName?: string;
   public Alley?: string;
   public Lane?: string;
   public Road?: string;
   public PersonTitleNameTh?: string;
   public PersonTitleNameEn?: string;
   public PersonTitleShortNameTh?: string;
   public PersonTitleShortNameEn?: string;
   public PersonFirstName?: string;
   public PersonMiddleName?: string;
   public PersonLastName?: string;
   public PersonOtherName?: string;
   public PersonIdCard?: string;
   public PersonAge?: number;
   public PersonCareer?: string;
   public PersonPosition?: string;
   public PersonDesc?: string;
   public PersonEmail?: string;
   public PersonTelNo?: string;
   public PersonStatus?: string;
   public ReasonBefore?: string;
   public ReasonAfter?: string;
   public Booking?: string;
   public IsArrest?: string;
   public isActive?: boolean;
   public CreateDate?: string;
   public CreateUserAccountId: number;
   public UpdateDate: string;
   public UpdateUserAccountId: number;
   public SubDistrictId: SubDistrict;
   public PersonTitleId: PersonTitle;
   public PuritycertStaffs: Array<PuritycertStaff>
   public PuritycertIndictments: Array<PuritycertIndictments>
}
