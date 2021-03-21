import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { MainMasterService } from 'app/services/main-master.service';
import * as fromGobalModels from 'app/models'
import * as fromServices from '../services'
import * as fromModels from '../models'
import { NavigationService } from 'app/shared/header-navigation/navigation.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SidebarService } from 'app/shared/sidebar/sidebar.component';
import { LoaderService } from 'app/core/loader/loader.service';
import { Subject, Observable } from 'rxjs';
import { MyDatePickerOptions, getDateMyDatepicker, convertDateForSave, setDateMyDatepicker } from 'app/config/dateFormat';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Message } from 'app/config/message';
import { ImageType } from 'app/config/imageType';
import swal from 'sweetalert2';

@Component({
  selector: 'app-lawbreaker',
  templateUrl: './lawbreaker.component.html',
  styleUrls: ['./lawbreaker.component.scss']
})
export class LawbreakerComponent implements OnInit {

  constructor(
    private ngModalService: NgbModal,
    private router: Router,
    private s_mainMaster: MainMasterService,
    private s_masLawbreaker: fromServices.InvestgateMasLawbreakerService,
    private activatedRoute: ActivatedRoute,
    private navService: NavigationService,
    private fb: FormBuilder,
    private sidebarService: SidebarService,
    private loaderService: LoaderService,
    private s_invest: fromServices.InvestgateService
  ) {
    this.navService.setPrintButton(false);
    this.navService.setDeleteButton(false);
    this.navService.setPrevPageButton(false);
    this.navService.setInnerTextNextPageButton('ข้อกล่าวหา');
  }

  card1 = true;
  card2 = true;
  card3 = false;
  card4 = false;

  @ViewChild('imgNobody') imgNobody: ElementRef;
  @ViewChild('latitude') latitude: ElementRef;
  @ViewChild('longitude') longitude: ElementRef;

  // LawbreakerItem: Lawbreaker;
  LawbreakerFG: FormGroup;
  disableForeign = false;
  disableCompany = false;
  requiredPassport = false;
  requiredCompanyRegister = false;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  // param: Params
  private mode: string;
  // private arrestMode: string;
  // private arrestCode: string;
  // private indictmentDetailId: string;
  // private indictmentId: string;
  // private guiltbaseId: string;
  // private allegationMode: string;
  private lawbreakerId: string;

  myDatePickerOptions = MyDatePickerOptions;
  modal: any;
  showEditField: any;
  isRequired = false;
  visaTypes: fromGobalModels.DropDown[] = fromGobalModels.VISATypes;
  bloodTypes: fromGobalModels.DropDown[] = fromGobalModels.BloodTypes;
  entityTypes: fromGobalModels.DropDown[] = fromGobalModels.EntityTypes;
  genderTypes: fromGobalModels.DropDown[] = fromGobalModels.GenderTypes;
  LawbreakerTypes: fromGobalModels.DropDown[] = fromGobalModels.LawbreakerTypes;
  materialStatus: fromGobalModels.DropDown[] = fromGobalModels.MaritalStatuType;

  typeheadTitleNames = new Array<fromGobalModels.MasTitleModel>();
  typeheadRaces = new Array<fromGobalModels.MasRaceModel>();
  typeheadReligions = new Array<fromGobalModels.MasReligionModel>();
  typeheadRegion = new Array<fromGobalModels.RegionModel>();
  typeheadCountry = new Array<fromGobalModels.MasCountryModel>();
  typeheadNationality = new Array<fromGobalModels.MasNationalityModel>();

  async ngOnInit() {
    this.LawbreakerFG = this.createForm();
    this.sidebarService.setVersion(this.s_invest.version);

    await this.active_route();
    await this.navigate_service();
    // await this.setRegionStore();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.LawbreakerFG.reset();
    this.navService.setOnEdit(false);
    this.navService.setOnSave(false);
    this.navService.setOnDelete(false);
    this.navService.setOnCancel(false);
    this.navService.setOnSearch(false);
    this.navService.setOnPrint(false);
    this.navService.setOnNextPage(false);
    this.navService.setOnPrevPage(false);

    this.navService.setEditField(false);
    this.navService.setSearchBar(false);
    this.navService.setPrintButton(false);
    this.navService.setEditButton(false);
    this.navService.setDeleteButton(false);
    this.navService.setSaveButton(false);
    this.navService.setCancelButton(false);
    this.navService.setNewButton(false);
    this.navService.setNextPageButton(false);
    this.navService.setPrevPageButton(false);
  }

  private createForm(): FormGroup {
    fromModels.InvestigateMasLawbreakerFC.LinkPhoto = new FormControl("C:\\Image");
    fromModels.InvestigateMasLawbreakerFC.IsActive = new FormControl(1);
    return new FormGroup(fromModels.InvestigateMasLawbreakerFC);
  }

  private active_route() {

    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
      .map(results => ({ params: results[0], queryParams: results[1] }))
      .takeUntil(this.destroy$)
      .subscribe(async results => {
        this.mode = results.params.mode;
        this.lawbreakerId = results.params.code;
        this.enableBtnModeR();
        this.pageLoad();
      });
  }

  // private enableBtnModeC() {
  //     // set false
  //     this.navService.setEditButton(false);
  //     this.navService.setEditField(false);
  //     this.navService.setNextPageButton(false);
  //     // set true
  //     this.navService.setSaveButton(true);
  //     this.navService.setCancelButton(true);
  // }

  private enableBtnModeR() {
    // set false
    this.navService.setSaveButton(false);
    this.navService.setCancelButton(false);
    this.navService.setNextPageButton(false);
    // set true
    this.navService.setEditButton(true);
    this.navService.setEditField(true);
  }

  private async pageLoad() {

    this.loaderService.show();
    const promises = [
      await this.s_mainMaster.MasTitleMaingetAll(),
      await this.s_mainMaster.MasNationalityMaingetAll(),
      await this.s_mainMaster.MasRaceMaingetAll(),
      await this.s_mainMaster.MasReligionMaingetAll(),
      await this.s_mainMaster.MasCountryMaingetAll(),
      await this.s_mainMaster.MasDistrictMaingetAll()
    ];
    Promise.all(promises)
      .then((x) => {
        this.typeheadTitleNames = x[0];
        this.typeheadNationality = x[1];
        this.typeheadRaces = x[2];
        this.typeheadReligions = x[3];
        this.typeheadCountry = x[4];
        x[5].map(prov =>
          prov.MasDistrict.map(dis =>
            dis.MasSubDistrict.map(subdis => {
              this.typeheadRegion.push({
                SubdistrictCode: subdis.SubdistrictCode,
                SubdistrictNameTH: subdis.SubdistrictNameTH,
                DistrictCode: dis.DistrictCode,
                DistrictNameTH: dis.DistrictNameTH,
                ProvinceCode: prov.ProvinceCode,
                ProvinceNameTH: prov.ProvinceNameTH,
                ZipCode: null
              })
            })
          )
        );
      })

    await this.ArrestLawbreakerGetByCon(this.lawbreakerId);
    this.loaderService.hide();

    // switch (this.mode) {
    //     case 'C':
    //         break;

    //     case 'R':
    //         this.loaderService.show();
    //         this.ArrestLawbreakerGetByCon(this.lawbreakerId);
    //         this.loaderService.hide();
    //         break;
    // }
  }

  private navigate_service() {
    this.navService.showFieldEdit.takeUntil(this.destroy$).subscribe(p => {
      this.showEditField = p.valueOf();
    });

    this.navService.onSave.takeUntil(this.destroy$).subscribe(async status => {
      if (status) {
        await this.navService.setOnSave(false);

        if (this.LawbreakerFG.invalid) {
          this.isRequired = true;
          if (this.LawbreakerFG.controls.PassportNo.invalid) {
            swal('', 'กรุณาระบุ เลขหนังสือเดินทาง', 'warning');
          } else if (this.LawbreakerFG.controls.CompanyRegistrationNo.invalid) {
            swal('', 'กรุณาระบุ เลขทะเบียนนิติบุคคล', 'warning')
          } else {
            swal('', Message.checkData, 'warning')
          }
          return;
        }

        let _Lfg = this.LawbreakerFG.value;
        const birthDay = this.isObject(_Lfg.BirthDate)
          && getDateMyDatepicker(_Lfg.BirthDate);

        const passportDateIn = this.isObject(_Lfg.PassportDateIn)
          && getDateMyDatepicker(_Lfg.PassportDateIn);

        const passportDateOut = this.isObject(_Lfg.PassportDateOut)
          && getDateMyDatepicker(_Lfg.PassportDateOut);

        _Lfg.BirthDate = convertDateForSave(birthDay) || '';
        _Lfg.PassportDateIn = convertDateForSave(passportDateIn) || '';
        _Lfg.PassportDateOut = convertDateForSave(passportDateOut) || '';

        _Lfg.LawbreakerTitleName = _Lfg.LawbreakerTitleCode &&
          this.typeheadTitleNames
            .find(x => x.TITLE_ID == _Lfg.TITLE_ID).TITLE_SHORT_NAME_TH;

        _Lfg.NationalityNameTH = _Lfg.ReligionCode &&
          this.typeheadNationality
            .find(x => x.NATIONALITY_ID == _Lfg.NATIONALITY_ID).NATIONALITY_NAME_TH;

        _Lfg.ReligionName = _Lfg.ReligionCode &&
          this.typeheadReligions
            .find(x => x.RELIGION_ID == _Lfg.RELIGION_ID).RELIGION_NAME_TH;

        _Lfg.RaceName = _Lfg.RaceCode &&
          this.typeheadRaces
            .find(x => x.RACE_ID == _Lfg.RACE_ID).RACE_NAME_TH;

        if (_Lfg.EntityType == '2') {
          _Lfg.LawbreakerFirstName = _Lfg.CompanyName;
        }

        console.log(JSON.stringify(_Lfg));

        this.OnRevice(_Lfg);
        // switch (this.mode) {
        //     case 'C':
        //         this.OnCreate(_Lfg);
        //         break;
        //     case 'R':
        //         this.OnRevice(_Lfg);
        //         break;
        // }
      }
    })

    this.navService.onCancel.takeUntil(this.destroy$).subscribe(async status => {
      if (status) {
        await this.navService.setOnCancel(false);
        this.onCancel();
      }
    })
  }

  async ArrestLawbreakerGetByCon(LawbreakerID: string) {

    await this.s_masLawbreaker.InvestigateMasLawbreakergetByCon(LawbreakerID)
      .then(async (x: fromModels.InvestigateMasLawbreakerModel[]) => {
        let law = x[0];

        law.BirthDate = law.BirthDate && setDateMyDatepicker(law.BirthDate);
        law.PassportDateIn = law.PassportDateIn && setDateMyDatepicker(law.PassportDateIn);
        law.PassportDateOut = law.PassportDateOut && setDateMyDatepicker(law.PassportDateOut);
        this.latitude.nativeElement.value = law.GPS && law.GPS.split(',')[0];
        this.longitude.nativeElement.value = law.GPS && law.GPS.split(',')[1];

        await this.s_invest.InvestigateLawsuitResultCountgetByLawbreakerID(LawbreakerID).then(x => {
          if (this.checkResponse(x)) {
            law.ResultCount = x.ResultCount;
          }
        })

        if (law.SubDistrictCode && law.DistrictCode && law.ProvinceCode) {
          law.Region = `${law.SubDistrict} ${law.District} ${law.Province}`;
        }

        this.LawbreakerFG.patchValue(law);
        if (law.LinkPhoto) {
          // this.imgNobody.nativeElement.src = law.LinkPhoto;
        }

        if (law.EntityType == 1 && law.LawbreakerType == 1) {
          // บุคคลธรรมดา
          this.card3 = false;
          this.card4 = false;

        } else if (law.EntityType == 1 && law.LawbreakerType == 0) {
          // ชาวต่างชาติ
          this.card3 = true;

        } else if (law.EntityType == 0) {
          // นิติบุคคล
          this.card4 = true;
        }
      })
  }

  onChangeGps() {
    let t = this.latitude.nativeElement.value;
    let g = this.longitude.nativeElement.value;
    this.LawbreakerFG.patchValue({
      GPS: `${t},${g}`
    })
  }

  toggleCard() {
    const e = this.LawbreakerFG.value.EntityType;
    const l = this.LawbreakerFG.value.LawbreakerType;

    this.disableForeign = false;
    this.disableCompany = false;
    this.requiredCompanyRegister = false;
    this.requiredPassport = false;

    setTimeout(() => {
      if (e == '1' && l == '0') {
        // บุคคลธรรมดา, ต่างชาติ
        this.disableCompany = true;
        this.requiredPassport = true;
        this.card3 = true;
        this.card4 = false;

      } else if (e == '1' && l == '1') {
        // บุคคลธรรมดา, ชาวไทย
        this.disableCompany = true;
        this.disableForeign = true;
        this.card3 = false;
        this.card4 = false;

      } else if (e == '2') {
        // นิติบุคคล
        this.disableForeign = true;
        this.requiredCompanyRegister = true;
        this.card3 = false;
        this.card4 = true;
      }
    }, 100);
  }


  openOffenseDetailModal(e: any) {
    this.modal = this.ngModalService.open(e, { size: 'lg', centered: true });
  }

  searchRegion = (text3$: Observable<string>) =>
    text3$
      .debounceTime(300)
      .distinctUntilChanged()
      .map(term => term === '' ? []
        : this.typeheadRegion
          .filter(v =>
            (`${v.SubdistrictNameTH} ${v.DistrictNameTH} ${v.ProvinceNameTH}`)
              .toLowerCase()
              .indexOf(term.toLowerCase()) > -1
          ).slice(0, 10));

  searchTitleName = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .map(term => term == '' ? []
        : this.typeheadTitleNames
          .filter(v =>
            v.TITLE_SHORT_NAME_TH.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
            v.TITLE_NAME_TH.toLowerCase().indexOf(term.toLowerCase()) > -1
          ).slice(0, 10));

  searchNationality = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .map(term => term == '' ? []
        : this.typeheadNationality.filter(v => v.NATIONALITY_NAME_TH.indexOf(term) > -1).slice(0, 10))

  searchRace = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .map(term => term == '' ? []
        : this.typeheadRaces.filter(v => v.RACE_NAME_TH.indexOf(term) > -1).slice(0, 10));

  searchReligion = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .map(term => term == '' ? []
        : this.typeheadReligions.filter(v => v.RELIGION_NAME_TH.indexOf(term) > -1).slice(0, 10));

  searchCountry = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .map(term => term == '' ? []
        : this.typeheadCountry.filter(v => v.COUNTRY_NAME_TH.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  formatterRegion = (x: { SubdistrictNameTH: string, DistrictNameTH: string, ProvinceNameTH: string }) =>
    `${x.SubdistrictNameTH} ${x.DistrictNameTH} ${x.ProvinceNameTH}`;

  formatterTitleName = (x: { TitleNameTH: string }) => x.TitleNameTH;

  formatterNationality = (x: { NationalityNameTh: string }) => x.NationalityNameTh;

  formatterRace = (x: { RaceNameTH: string }) => x.RaceNameTH;

  formatterReligion = (x: { ReligionNameTH: string }) => x.ReligionNameTH;

  formatterCountry = (CountryNameTH: string) => CountryNameTH;

  selectItemRegion(ele: any) {
    this.LawbreakerFG.patchValue({
      SubDistrictCode: ele.item.SubdistrictCode,
      SubDistrict: ele.item.SubdistrictNameTH,
      DistrictCode: ele.item.DistrictCode,
      District: ele.item.DistrictNameTH,
      ProvinceCode: ele.item.ProvinceCode,
      Province: ele.item.ProvinceNameTH
    });
  }

  selectItemTitleName = (e: any) => this.LawbreakerFG.patchValue({
    LawbreakerTitleCode: e.item.TitleCode,
    LawbreakerTitleName: e.item.TitleNameTH
  });

  selectItemNationality = (e: any) => this.LawbreakerFG.patchValue({
    NationalityCode: e.item.NationalityCode,
    NationalityNameTH: e.item.NationalityNameTh
  })

  selectItemRace = (e: any) => this.LawbreakerFG.patchValue({
    RaceCode: e.item.RaceCode,
    RaceName: e.item.RaceNameTH
  })

  selectItemReligion = (e: any) => this.LawbreakerFG.patchValue({
    ReligionCode: e.item.ReligionCode,
    ReligionName: e.item.ReligionNameTH
  })

  selectItemCountry = (e: any) => this.LawbreakerFG.patchValue({
    PassportCountryCode: e.item.CountryCode,
    PassportCountryName: e.item.CountryNameEN
  })

  changeImage(e: any, img: any) {

    let file = e.target.files[0];
    let isMatch: boolean | false;

    ImageType.filter(item => file.type == item.type).map(() => isMatch = true);

    if (!isMatch) {
      swal('', Message.checkImageType, 'warning')
      return
    }

    let reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result;
      this.LawbreakerFG.patchValue({
        LinkPhoto: reader.result,
        PhotoDesc: file.name
      })
    };

    reader.readAsDataURL(file);
  }

  catchError(error: any) {
    console.log(error);
    this.endLoader();
  }

  endLoader = () => this.loaderService.hide();

  isObject = (obj) => obj === Object(obj);

  checkResponse(res: any) {
    switch (res.IsSuccess) {
      case 'False':
      case false:
        return false;
      default:
        return true;
    }
  }

  OnRevice(lawbreaker: fromModels.InvestigateMasLawbreakerModel) {
    this.s_masLawbreaker.InvestigateMasLawbreakerupdByCon(lawbreaker)
      .takeUntil(this.destroy$)
      .subscribe(res => {
        if (!this.checkResponse(res)) {
          swal('', Message.saveFail, 'warning');
          return;
        }
        swal('', Message.saveComplete, 'success');
        this.enableBtnModeR();
      })
  }

  onCancel() {
    swal({
      title: '',
      text: Message.confirmAction,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm!'
    }).then((result) => {
      if (result.value) {
        this.router.navigate([`investigation/lawbreaker`, this.mode, this.lawbreakerId]);
      }
    })

  }

}
