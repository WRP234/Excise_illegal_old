import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { DropDown, RegionModel, VISATypes, BloodTypes, EntityTypes, GenderTypes, LawbreakerTypes, MaritalStatuType } from '../../../../models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Message } from 'app/config/message';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';
import { MyDatePickerOptions, getDateMyDatepicker, convertDateForSave, setDateMyDatepicker } from 'app/config/dateFormat';
import { ImageType } from 'app/config/imageType';
import { ArrestLawbreakerFormControl } from '../../models/arrest-lawbreaker';
import { MainMasterService } from 'app/services/main-master.service';
import { LoaderService } from 'app/core/loader/loader.service';
import * as fromServices from '../../services';
import * as fromModels from '../../models';
import * as fromMasterModel from 'app/models'
import { Subject } from 'rxjs/Subject';
import { SidebarService } from 'app/shared/sidebar/sidebar.component';
import 'rxjs/add/operator/takeUntil';
import { combineLatest } from 'rxjs/observable/combineLatest';
import swal from 'sweetalert2';
// import { removeObjectItem } from '../../arrest.helper';

@Component({
    selector: 'app-lawbreaker',
    templateUrl: './lawbreaker.component.html',
    styleUrls: ['./lawbreaker.component.scss']
})
export class LawbreakerComponent {
    // implements OnInit, OnDestroy 
    constructor(
        private ngModalService: NgbModal,
    //     private router: Router,
    //     private s_mainMaster: MainMasterService,
    //     private s_lawbreaker: fromServices.ArrestLawbreakerService,
    //     private s_masLawbreaker: fromServices.ArrestMasLawbreakerService,
    //     private s_arrest: fromServices.ArrestService,
    //     private activatedRoute: ActivatedRoute,
    //     private navService: NavigationService,
        private fb: FormBuilder,
    //     private sidebarService: SidebarService,
    //     private loaderService: LoaderService
    ) {
    //     this.navService.setPrintButton(false);
    //     this.navService.setDeleteButton(false);
    //     this.navService.setPrevPageButton(false);
    //     this.navService.setInnerTextNextPageButton('ข้อกล่าวหา');
    }

    // card1 = true;
    // card2 = true;
    // card3 = false;
    // card4 = false;

    // @ViewChild('imgNobody') imgNobody: ElementRef;
    // @ViewChild('latitude') latitude: ElementRef;
    // @ViewChild('longitude') longitude: ElementRef;

    // // LawbreakerItem: Lawbreaker;
    // LawbreakerFG: FormGroup;
    // disableForeign = false;
    // disableCompany = false;
    // requiredPassport = false;
    // requiredCompanyRegister = false;

    // private destroy$: Subject<boolean> = new Subject<boolean>();
    // // param: Params
    // private mode: string;
    // private arrestMode: string;
    // private arrestCode: string;
    // private indictmentDetailId: string;
    // private indictmentId: string;
    // private guiltbaseId: string;
    // private allegationMode: string;
    // private lawbreakerId: string;

    // myDatePickerOptions = MyDatePickerOptions;
    // modal: any;
    // showEditField: any;
    // isRequired = false;
    // visaTypes: DropDown[] = VISATypes;
    // bloodTypes: DropDown[] = BloodTypes;
    // entityTypes: DropDown[] = EntityTypes;
    // genderTypes: DropDown[] = GenderTypes;
    // LawbreakerTypes: DropDown[] = LawbreakerTypes;
    // materialStatus: DropDown[] = MaritalStatuType;

    // typeheadTitleNames = new Array<fromMasterModel.MasTitleModel>();
    // typeheadRaces = new Array<fromMasterModel.MasRaceModel>();
    // typeheadReligions = new Array<fromMasterModel.MasReligionModel>();
    // typeheadRegion = new Array<RegionModel>();
    // typeheadCountry = new Array<fromMasterModel.MasCountryModel>();
    // typeheadNationality = new Array<fromMasterModel.MasNationalityModel>();

    // async ngOnInit() {
    //     this.LawbreakerFG = this.createForm();
    //     this.sidebarService.setVersion(this.s_arrest.version);

    //     await this.active_route();
    //     await this.navigate_service();
    //     // await this.setRegionStore();

    // }

    // ngOnDestroy(): void {
    //     this.destroy$.next(true);
    //     this.destroy$.unsubscribe();
    //     this.LawbreakerFG.reset();
    // }

    // private createForm(): FormGroup {
    //     // ArrestLawbreakerFormControl.LinkPhoto = new FormControl("C:\\Image");
    //     ArrestLawbreakerFormControl.IsActive = new FormControl(1);
    //     const newFormGroup = {
    //         ...ArrestLawbreakerFormControl,
    //         Latitude: new FormControl(),
    //         Longitude: new FormControl()
    //     }
    //     return new FormGroup(newFormGroup);
    // }

    // private active_route() {

    //     combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
    //         .map(results => ({ params: results[0], queryParams: results[1] }))
    //         .takeUntil(this.destroy$)
    //         .subscribe(async results => {
    //             this.mode = results.params.mode;
    //             this.lawbreakerId = results.params.code;
    //             this.arrestMode = results.queryParams.arrestMode;
    //             this.arrestCode = results.queryParams.arrestCode;
    //             this.indictmentId = results.queryParams.indictmentId;
    //             this.guiltbaseId = results.queryParams.guiltbaseId;
    //             this.allegationMode = results.queryParams.allegationMode;

    //             switch (this.mode) {
    //                 case 'C':
    //                     this.enableBtnModeC();
    //                     break;
    //                 case 'R':
    //                     this.enableBtnModeR();
    //                     break;
    //             }
    //             this.pageLoad();
    //         });
    // }

    // private enableBtnModeC() {
    //     // set false
    //     this.navService.setEditButton(false);
    //     this.navService.setEditField(false);
    //     this.navService.setNextPageButton(false);
    //     // set true
    //     this.navService.setSaveButton(true);
    //     this.navService.setCancelButton(true);
    // }

    // private enableBtnModeR() {
    //     // set false
    //     this.navService.setSaveButton(false);
    //     this.navService.setCancelButton(false);
    //     this.navService.setNextPageButton(false);
    //     // set true
    //     this.navService.setEditButton(true);
    //     this.navService.setEditField(true);
    // }

    // private async pageLoad() {

    //     this.loaderService.show();
    //     const promises = [
    //         await this.s_mainMaster.MasTitleMaingetAll(),
    //         await this.s_mainMaster.MasNationalityMaingetAll(),
    //         await this.s_mainMaster.MasRaceMaingetAll(),
    //         await this.s_mainMaster.MasReligionMaingetAll(),
    //         await this.s_mainMaster.MasCountryMaingetAll(),
    //         await this.s_mainMaster.MasDistrictMaingetAll()
    //     ];
    //     Promise.all(promises)
    //         .then((x) => {
    //             this.typeheadTitleNames = x[0];
    //             this.typeheadNationality = x[1];
    //             this.typeheadRaces = x[2];
    //             this.typeheadReligions = x[3];
    //             this.typeheadCountry = x[4];
    //             x[5].map(prov =>
    //                 prov.MasDistrict.map(dis =>
    //                     dis.MasSubDistrict.map(subdis => {
    //                         this.typeheadRegion.push({
    //                             SubdistrictCode: subdis.SubdistrictCode,
    //                             SubdistrictNameTH: subdis.SubdistrictNameTH,
    //                             DistrictCode: dis.DistrictCode,
    //                             DistrictNameTH: dis.DistrictNameTH,
    //                             ProvinceCode: prov.ProvinceCode,
    //                             ProvinceNameTH: prov.ProvinceNameTH,
    //                             ZipCode: null
    //                         })
    //                     })
    //                 )
    //             );
    //         })
    //     this.loaderService.hide();

    //     switch (this.mode) {
    //         case 'C':
    //             break;

    //         case 'R':
    //             this.loaderService.show();
    //             this.ArrestLawbreakerGetByCon(this.lawbreakerId);
    //             this.loaderService.hide();
    //             break;
    //     }
    // }

    // private navigate_service() {
    //     this.navService.showFieldEdit.takeUntil(this.destroy$).subscribe(p => {
    //         this.showEditField = p.valueOf();
    //     });

    //     this.navService.onSave.takeUntil(this.destroy$).subscribe(async status => {
    //         if (status) {
    //             await this.navService.setOnSave(false);

    //             if (this.LawbreakerFG.invalid) {
    //                 this.isRequired = true;
    //                 if (this.LawbreakerFG.controls.PassportNo.invalid) {
    //                     swal('', 'กรุณาระบุ เลขหนังสือเดินทาง', 'warning');
    //                     // swal('', Message.checkData, 'warning')
    //                 } else if (this.LawbreakerFG.controls.CompanyRegistrationNo.invalid) {
    //                     swal('', 'กรุณาระบุ เลขทะเบียนนิติบุคคล', 'warning')
    //                 } else {
    //                     swal('', Message.checkData, 'warning')
    //                 }
    //                 return;
    //             }

    //             let _Lfg = this.LawbreakerFG.value;

    //             const birthDay = this.isObject(_Lfg.BirthDate)
    //                 && getDateMyDatepicker(_Lfg.BirthDate);

    //             const passportDateIn = this.isObject(_Lfg.PassportDateIn)
    //                 && getDateMyDatepicker(_Lfg.PassportDateIn);

    //             const passportDateOut = this.isObject(_Lfg.PassportDateOut)
    //                 && getDateMyDatepicker(_Lfg.PassportDateOut);

    //             _Lfg.BirthDate = convertDateForSave(birthDay) || '';
    //             _Lfg.PassportDateIn = convertDateForSave(passportDateIn) || '';
    //             _Lfg.PassportDateOut = convertDateForSave(passportDateOut) || '';

    //             _Lfg.LawbreakerTitleName = _Lfg.LawbreakerTitleCode &&
    //                 this.typeheadTitleNames
    //                     .find(x => x.TitleCode == _Lfg.LawbreakerTitleCode).TitleShortNameTH;

    //             _Lfg.NationalityNameTH = _Lfg.ReligionCode &&
    //                 this.typeheadNationality
    //                     .find(x => x.NationalityCode == _Lfg.NationalityCode).NationalityNameTh;

    //             _Lfg.ReligionName = _Lfg.ReligionCode &&
    //                 this.typeheadReligions
    //                     .find(x => x.ReligionCode == _Lfg.ReligionCode).ReligionNameTH;

    //             _Lfg.RaceName = _Lfg.RaceCode &&
    //                 this.typeheadRaces
    //                     .find(x => x.RaceCode == _Lfg.RaceCode).RaceNameTH;

    //             if (_Lfg.EntityType == '2') {
    //                 _Lfg.LawbreakerFirstName = _Lfg.CompanyName;
    //             }

    //             _Lfg.LinkPhoto = `C:\\Image\\${_Lfg.PhotoDesc}`;

    //             _Lfg = removeObjectItem(_Lfg, 'ResultCount');
    //             _Lfg = removeObjectItem(_Lfg, 'Latitude');
    //             _Lfg = removeObjectItem(_Lfg, 'Longitude');

    //             switch (this.mode) {
    //                 case 'C':
    //                     this.OnCreate(_Lfg);
    //                     break;
    //                 case 'R':
    //                     this.OnRevice(_Lfg);
    //                     break;
    //             }
    //         }
    //     })

    //     this.navService.onCancel.takeUntil(this.destroy$).subscribe(async status => {
    //         if (status) {
    //             await this.navService.setOnCancel(false);
    //             this.onCancel();
    //         }
    //     })

    //     this.navService.onNextPage.takeUntil(this.destroy$).subscribe(async status => {
    //         if (status) {
    //             await this.navService.setOnNextPage(false);
    //             this.router.navigate(
    //                 [`arrest/allegation`, this.allegationMode],
    //                 {
    //                     queryParams: {
    //                         arrestCode: this.arrestCode,
    //                         indictmentId: this.indictmentId,
    //                         guiltbaseId: this.guiltbaseId
    //                     }
    //                 });
    //         }
    //     })
    // }

    // async ArrestLawbreakerGetByCon(LawbreakerID: string) {

    //     await this.s_lawbreaker.ArrestMasLawbreakergetByCon(LawbreakerID)
    //         .then((x: fromModels.ArrestLawbreaker[]) => {
    //             let law = x[0];

    //             law.BirthDate = law.BirthDate && setDateMyDatepicker(law.BirthDate);
    //             law.PassportDateIn = law.PassportDateIn && setDateMyDatepicker(law.PassportDateIn);
    //             law.PassportDateOut = law.PassportDateOut && setDateMyDatepicker(law.PassportDateOut);
    //             this.latitude.nativeElement.value = law.GPS && law.GPS.split(',')[0];
    //             this.longitude.nativeElement.value = law.GPS && law.GPS.split(',')[1];

    //             law.ResultCount = this.s_masLawbreaker.ArrestLawsuitResultCountgetByLawbreakerID(LawbreakerID)

    //             if (law.SubDistrictCode && law.DistrictCode && law.ProvinceCode) {
    //                 law.Region = `${law.SubDistrict} ${law.District} ${law.Province}`;
    //             }

    //             this.LawbreakerFG.patchValue(law);
    //             if (law.LinkPhoto) {
    //                 // this.imgNobody.nativeElement.src = law.LinkPhoto;
    //             }

    //             if (law.EntityType == 1 && law.LawbreakerType == 1) {
    //                 // บุคคลธรรมดา
    //                 this.card3 = false;
    //                 this.card4 = false;

    //             } else if (law.EntityType == 1 && law.LawbreakerType == 0) {
    //                 // ชาวต่างชาติ
    //                 this.card3 = true;

    //             } else if (law.EntityType == 0) {
    //                 // นิติบุคคล
    //                 this.card4 = true;
    //             }
    //         })
    // }

    // onChangeGps() {
    //     let t = this.latitude.nativeElement.value;
    //     let g = this.longitude.nativeElement.value;
    //     this.LawbreakerFG.patchValue({
    //         GPS: `${t},${g}`
    //     })
    // }

    // toggleCard() {
    //     const e = this.LawbreakerFG.value.EntityType;
    //     const l = this.LawbreakerFG.value.LawbreakerType;

    //     this.disableForeign = false;
    //     this.disableCompany = false;
    //     this.requiredCompanyRegister = false;
    //     this.requiredPassport = false;

    //     setTimeout(() => {
    //         if (e == '1' && l == '0') {
    //             // บุคคลธรรมดา, ต่างชาติ
    //             this.disableCompany = true;
    //             this.requiredPassport = true;
    //             this.card3 = true;
    //             this.card4 = false;
                
    //         } else if (e == '1' && l == '1') {
    //             // บุคคลธรรมดา, ชาวไทย
    //             this.disableCompany = true;
    //             this.disableForeign = true;
    //             this.card3 = false;
    //             this.card4 = false;

    //         } else if (e == '2') {
    //             // นิติบุคคล
    //             this.disableForeign = true;
    //             this.requiredCompanyRegister = true;
    //             this.card3 = false;
    //             this.card4 = true;
    //         }
    //     }, 100);

    // }

    // openOffenseDetailModal(e: any) {
    //     this.modal = this.ngModalService.open(e, { size: 'lg', centered: true });
    // }

    // searchRegion = (text3$: Observable<string>) =>
    //     text3$
    //         .debounceTime(300)
    //         .distinctUntilChanged()
    //         .map(term => term === '' ? []
    //             : this.typeheadRegion
    //                 .filter(v =>
    //                     (`${v.SubdistrictNameTH} ${v.DistrictNameTH} ${v.ProvinceNameTH}`)
    //                         .toLowerCase()
    //                         .indexOf(term.toLowerCase()) > -1
    //                 ).slice(0, 10));

    // searchTitleName = (text$: Observable<string>) =>
    //     text$
    //         .debounceTime(300)
    //         .distinctUntilChanged()
    //         .map(term => term == '' ? []
    //             : this.typeheadTitleNames
    //                 .filter(v =>
    //                     v.TitleShortNameTH.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
    //                     v.TitleNameTH.toLowerCase().indexOf(term.toLowerCase()) > -1
    //                 ).slice(0, 10));

    // searchNationality = (text$: Observable<string>) =>
    //     text$
    //         .debounceTime(300)
    //         .distinctUntilChanged()
    //         .map(term => term == '' ? []
    //             : this.typeheadNationality.filter(v => v.NationalityNameTh.indexOf(term) > -1).slice(0, 10))

    // searchRace = (text$: Observable<string>) =>
    //     text$
    //         .debounceTime(300)
    //         .distinctUntilChanged()
    //         .map(term => term == '' ? []
    //             : this.typeheadRaces.filter(v => v.RaceNameTH.indexOf(term) > -1).slice(0, 10));

    // searchReligion = (text$: Observable<string>) =>
    //     text$
    //         .debounceTime(300)
    //         .distinctUntilChanged()
    //         .map(term => term == '' ? []
    //             : this.typeheadReligions.filter(v => v.ReligionNameTH.indexOf(term) > -1).slice(0, 10));

    // searchCountry = (text$: Observable<string>) =>
    //     text$
    //         .debounceTime(300)
    //         .distinctUntilChanged()
    //         .map(term => term == '' ? []
    //             : this.typeheadCountry.filter(v => v.CountryNameEN.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

    // formatterRegion = (x: { SubdistrictNameTH: string, DistrictNameTH: string, ProvinceNameTH: string }) =>
    //     `${x.SubdistrictNameTH} ${x.DistrictNameTH} ${x.ProvinceNameTH}`;

    // formatterTitleName = (x: { TitleNameTH: string }) => x.TitleNameTH;

    // formatterNationality = (x: { NationalityNameTh: string }) => x.NationalityNameTh;

    // formatterRace = (x: { RaceNameTH: string }) => x.RaceNameTH;

    // formatterReligion = (x: { ReligionNameTH: string }) => x.ReligionNameTH;

    // formatterCountry = (CountryNameTH: string) => CountryNameTH;

    // selectItemRegion(ele: any) {
    //     this.LawbreakerFG.patchValue({
    //         SubDistrictCode: ele.item.SubdistrictCode,
    //         SubDistrict: ele.item.SubdistrictNameTH,
    //         DistrictCode: ele.item.DistrictCode,
    //         District: ele.item.DistrictNameTH,
    //         ProvinceCode: ele.item.ProvinceCode,
    //         Province: ele.item.ProvinceNameTH,
    //         Region: `${ele.item.SubdistrictNameTH} ${ele.item.DistrictNameTH} ${ele.item.ProvinceNameTH}`
    //     });
    // }

    // selectItemTitleName = (e: any) => this.LawbreakerFG.patchValue({
    //     LawbreakerTitleCode: e.item.TitleCode,
    //     LawbreakerTitleName: e.item.TitleNameTH
    // });

    // selectItemNationality = (e: any) => this.LawbreakerFG.patchValue({
    //     NationalityCode: e.item.NationalityCode,
    //     NationalityNameTH: e.item.NationalityNameTh
    // })

    // selectItemRace = (e: any) => this.LawbreakerFG.patchValue({
    //     RaceCode: e.item.RaceCode,
    //     RaceName: e.item.RaceNameTH
    // })

    // selectItemReligion = (e: any) => this.LawbreakerFG.patchValue({
    //     ReligionCode: e.item.ReligionCode,
    //     ReligionName: e.item.ReligionNameTH
    // })

    // selectItemCountry = (e: any) => this.LawbreakerFG.patchValue({
    //     PassportCountryCode: e.item.CountryCode,
    //     PassportCountryName: e.item.CountryNameEN
    // })

    // changeImage(e: any, img: any) {

    //     let file = e.target.files[0];
    //     let isMatch: boolean | false;

    //     ImageType.filter(item => file.type == item.type).map(() => isMatch = true);

    //     if (!isMatch) {
    //         swal('', Message.checkImageType, 'warning')
    //         return
    //     }

    //     let reader = new FileReader();
    //     reader.onload = () => {
    //         img.src = reader.result;
    //         this.LawbreakerFG.patchValue({
    //             LinkPhoto: reader.result,
    //             PhotoDesc: reader.result
    //         })
    //     };

    //     reader.readAsDataURL(file);
    // }

    // catchError(error: any) {
    //     console.log(error);
    //     this.endLoader();
    // }

    // endLoader = () => this.loaderService.hide();

    // isObject = (obj) => obj === Object(obj);

    // checkResponse(res: any) {
    //     switch (res.IsSuccess) {
    //         case 'False':
    //         case false:
    //             return false;
    //         default:
    //             return true;
    //     }
    // }

    // OnCreate(lawbreaker: fromModels.ArrestLawbreaker) {
    //     this.s_masLawbreaker.ArrestMasLawbreakerinsAll(lawbreaker)
    //         .takeUntil(this.destroy$)
    //         .subscribe(res => {
    //             if (!this.checkResponse(res)) {
    //                 swal('', Message.saveFail, 'error');
    //                 return;
    //             }
    //             swal('', Message.saveComplete, 'success');
    //             this.router.navigate([`/arrest/lawbreaker/R/${res.LawbreakerID}`]);
    //         });
    // }

    // OnRevice(lawbreaker: fromModels.ArrestLawbreaker) {
    //     this.s_masLawbreaker.ArrestMasLawbreakerupdByCon(lawbreaker)
    //         .takeUntil(this.destroy$)
    //         .subscribe(res => {
    //             if (!this.checkResponse(res)) {
    //                 swal('', Message.saveFail, 'error');
    //                 return;
    //             }
    //             swal('', Message.saveComplete, 'success');
    //             this.enableBtnModeR();
    //         })
    // }

    // onCancel() {
    //     swal({
    //         title: '',
    //         text: Message.confirmAction,
    //         type: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Confirm!'
    //     }).then((result) => {
    //         if (result.value) {
    //             switch (this.mode) {
    //                 case 'C':
    //                     this.LawbreakerFG.reset();
    //                     break;

    //                 case 'R':
    //                     this.enableBtnModeR();
    //                     break;
    //             }
    //         }
    //     })

    // }
}
