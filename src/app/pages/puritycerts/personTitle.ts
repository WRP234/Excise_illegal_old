
export class PersonTitle {
   public TitleId?: number;
   public TitleNameTh?: string;
   public TitleNameEn?: string;
   public TitleShortNameTh?: string;
   public TitleShortNameEn?: string;
   public TitleType?: string;
   public IsActive?: boolean;

}

export interface IMasTitle {
  TITLE_ID?: number,
  TITLE_NAME_TH: string,
  TITLE_NAME_EN: string,
  TITLE_SHORT_NAME_TH: string,
  TITLE_SHORT_NAME_EN: string,
  TITLE_TYPE: number,
  IS_ACTIVE: number,
  EFFECTIVE_DATE: string,
  EXPIRE_DATE: string
}
