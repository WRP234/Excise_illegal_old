import { Component, OnInit, Output, EventEmitter, Injectable, OnDestroy, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { pagination } from '../../../config/pagination';
import { appConfig } from '../../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Message } from '../../../config/message';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { MasSuspect, MasSuspect_New } from '../models/mas-suspect';
import { Router } from '@angular/router';
import { InvestSuspectModalConfig } from './invest-suspect-modal.config';


@Injectable()
export class InvestSuspectService {

    constructor(private http: HttpClient) { }

    // tslint:disable-next-line:member-ordering
    private httpOptions = {
        headers: new HttpHeaders(
            {
                'Content-Type': 'application/json'
            })
    };

    // ################################# PH.2 NEW ####################################
    SearchAdv(form: any): Promise<MasSuspect_New[]> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/ArrestMasPersongetByConAdv`;
        return this.http.post<any>(url, params, this.httpOptions).toPromise();
    }
    MasPersongetByCon(TEXT_SEARCH: any): Promise<MasSuspect_New[]> {
        let PERSON_ID = "";
        const params = { TEXT_SEARCH, PERSON_ID }
        const url = `${appConfig.api1111}/ArrestMasPersongetByKeyword`;
        return this.http.post<any>(url, params, this.httpOptions).toPromise();
    }
    // #################################END PH.2 ####################################

}


@Component({
    selector: 'app-invest-suspect-modal',
    templateUrl: './invest-suspect-modal.component.html',
    styleUrls: ['./invest-suspect-modal.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class InvestSuspectModalComponent extends InvestSuspectModalConfig implements OnInit, OnDestroy, AfterViewInit {

    @Output() exportSuspectData = new EventEmitter<any[]>();
    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();

    constructor(
        private _router: Router,
        private suspectService: InvestSuspectService,
        private fb: FormBuilder,
        private preloader: PreloaderService
    ) {
        super();
    }

    ngOnInit() {
        this.paginage = pagination;
        this.paginage.TotalItems = 0;
        this.paginage.CurrentPage = 1;
        this.paginage.PageSize = 5;
        this.suspectFormGroup = this.fb.group({
            Suspect: this.fb.array([])
        });
        this.taskModel.priority = "2";
    }

    ngAfterViewInit(): void {
        this.suspectFormChange();
    }

    suspectFormChange() {
        this.suspectFormGroup
            .valueChanges
            .subscribe(x => {
                this.suspectSeleted = x['Suspect'].filter(f => f.IsChecked == true);
                if (!this.suspectSeleted.length) this.isCheckAll = false;
            })
    }

    changeTypePerson(ev: any) {
        console.log('ev : ', ev.target.value)

        let type = ev.target.value
        if (type == 2) {
            this.taskModel.priority = "2";
            this.thaiType = true;
            this.foreignTpye = false;
            this.plainType = false;
            this.LegalentityType = false;
        } else if (type == 1) {
            this.taskModel.priority = "1";
            this.thaiType = false;
            this.foreignTpye = true;
            this.plainType = false;
            this.LegalentityType = false;
        } else if (type == 0) {
            this.taskModel.priority = "0";
            this.thaiType = false;
            this.foreignTpye = false;
            this.plainType = false;
            this.LegalentityType = true;
        }


    }

    private setItemFormArray(array: any[], formControl: string) {
        if (array !== undefined && array.length) {
            const itemFGs = array.map(item => this.fb.group(item));
            const itemFormArray = this.fb.array(itemFGs);
            this.suspectFormGroup.setControl(formControl, itemFormArray);
        }
    }

    async onSearchByKeyword(f: any) {
        this.preloader.setShowPreloader(true)
        await this.suspectService.MasPersongetByCon(f.TEXT_SEARCH).then(res => this.onComplete(res));
        this.preloader.setShowPreloader(false)
    }

    async onSearchAdv(f, Type: string) {
        if (Type == 'thaiType') {
            f.ENTITY_TYPE = 0;
            f.PERSON_TYPE = 0;
        } else if (Type == 'foreignType') {
            f.ENTITY_TYPE = 0;
            f.PERSON_TYPE = 1;
        } else if (Type == 'LegalentityType') {
            f.ENTITY_TYPE = 1;
            f.PERSON_TYPE = "";
        }
        this.preloader.setShowPreloader(true)
        this.paginage.TotalItems = 0;
        await this.suspectService.SearchAdv(f).then(res => this.onCompleteAdv(res));
        this.preloader.setShowPreloader(false)
    }

    async onCompleteAdv(res: any) {
        console.log('onCompleteAdv res :', res)
        let datas = [];
        if (!res || res.length == 0) {
            this.swalFn('', Message.noRecord, 'warning')
        } else {
            datas = await res.map((item, i) => {
                item.RowId = i + 1;
                item.IsChecked = false;
                item.FULL_NAME = `${item.TITLE_NAME_TH || ''}${item.FIRST_NAME || ''} ${item.MIDDLE_NAME || ''} ${item.LAST_NAME || ''}`
                // item.FULL_NAME = item.FULL_NAME
                item.father_fname = '';
                item.mom_fname = '';

                item.ArrestMasPersonRelationship.map(m => {
                    // console.log('ArrestMasPersonRelationship : ',ArrestMasPersonRelationship);
                    if (m.RELATIONSHIP_ID === 1) {
                        // var _father_fname = `${m.TITLE_NAME_TH || ''}${m.FIRST_NAME || ''} ${m.LAST_NAME || ''}`
                        item.father_fname = m.RELATIONSHIP_NAME;

                    } else if (m.RELATIONSHIP_ID === 2) {
                        // var _mom_fname = `${m.TITLE_NAME_TH || ''}${m.FIRST_NAME || ''} ${m.LAST_NAME || ''}`
                        item.mom_fname = m.RELATIONSHIP_NAME
                    }
                })
                return item;
            });
        }

        this.suspect = datas;
        this.setItemFormArray(datas, 'Suspect');
        if (datas.length == 0) {
            this.suspectFormGroup.setControl("Suspect", this.fb.array([]));
        }
        this.paginage.TotalItems = this.suspect.length;
    }

    async onComplete(res: any) {
        let datas = [];
        if (!res.RESPONSE_DATA || res.RESPONSE_DATA.length == 0) {
            this.swalFn('', Message.noRecord, 'warning')
        } else {
            datas = await res.RESPONSE_DATA.map((item, i) => {
                item.RowId = i + 1;
                item.IsChecked = false;
                item.FULL_NAME = `${item.TITLE_NAME_TH || ''}${item.FIRST_NAME || ''} ${item.MIDDLE_NAME || ''} ${item.LAST_NAME || ''}`
                item.father_fname = '';
                item.mom_fname = '';

                item.MAS_PERSON_RELATIONSHIP.map(m => {
                    if (m.RELATIONSHIP_ID === 1) {
                        var _father_fname = `${m.TITLE_NAME_TH || ''}${m.FIRST_NAME || ''} ${m.LAST_NAME || ''}`
                        item.father_fname = _father_fname;

                    } else if (m.RELATIONSHIP_ID === 2) {
                        var _mom_fname = `${m.TITLE_NAME_TH || ''}${m.FIRST_NAME || ''} ${m.LAST_NAME || ''}`
                        item.mom_fname = _mom_fname;

                    }
                })
                return item;
            });
        }

        this.suspect = datas;
        this.setItemFormArray(datas, 'Suspect');
        if (datas.length == 0) {
            this.suspectFormGroup.setControl("Suspect", this.fb.array([]));
        }
        this.paginage.TotalItems = this.suspect.length;
    }

    checkAll() {
        this.isCheckAll = !this.isCheckAll;
        this.Suspect.value.map(item => item.IsChecked = this.isCheckAll);

        this.setItemFormArray(this.Suspect.value, 'Suspect');
    }

    toggle() {
        this.advSearch = !this.advSearch;
    }

    dismiss(e: any) {
        this.d.emit(e);
    }

    close(e: any) {
        this.c.emit(e);
    }

    view(item: any): void {
        this.close('View click');
        console.log(item);
        let id = item.SuspectID;
        if (item.LawbreakerID) {
            id = item.LawbreakerID;
        }
        window.open(`#/investigation/suspect/R/${id}`, "_blank");
    }

    async exportData() {
        let form = this.suspectFormGroup.value.Suspect;
        form = await form.filter(item => item.IsChecked === true);
        form.map(m => {
            console.log('m MISTREAT_NO : ', m.MISTREAT_NO)
        })
        // console.log('Fn exportData suspectFormGroup : ', form);
        this.exportSuspectData.emit(form);
        this.close('Save click');
    }

    async pageChanges(event: any) {
        const list = await this.suspect.slice(event.startIndex - 1, event.endIndex);
        this.setItemFormArray(list, 'Suspect')
    }

    ngOnDestroy() {
        this.paginage.TotalItems = 0;
    }

    getRefer(item: any, type: string) {
        item = item.value;
        if (item.ENTITY_TYPE == 0 && item.PERSON_TYPE == 0) {
            if (type == 'getRefer') { return item.ID_CARD; } else if (type == 'getEntity') { return this._EntityTypes_NEW[2].text; }
        } else if (item.ENTITY_TYPE == 0 && item.PERSON_TYPE == 1) {
            if (type == 'getRefer') { return item.PASSPORT_NO; } else if (type == 'getEntity') { return this._EntityTypes_NEW[1].text; }
        } else if (item.ENTITY_TYPE == 1) {
            if (type == 'getRefer') { return item.COMPANY_REGISTRATION_NO; } else if (type == 'getEntity') { return this._EntityTypes_NEW[0].text; }
        } else {
            return "";
        }
    }

}