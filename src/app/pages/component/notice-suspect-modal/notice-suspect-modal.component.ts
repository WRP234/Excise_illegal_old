import { Suspect } from './../../notices/suspect/suspect.interface';
import { Component, OnInit, Output, EventEmitter, Injectable, OnDestroy, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { pagination } from '../../../config/pagination';
import { appConfig } from '../../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Message } from '../../../config/message';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { NoticeMasSuspect, NoticeMasSuspect_New } from './notice-mas-suspect';
import { LawbreakerTypes, EntityTypes, EntityTypes_NEW, LawbreakerTypes_New } from 'app/models';
import { NoticeSuspect } from '../../notices/notice-suspect';
import { Router } from '@angular/router';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { Type } from '@angular/compiler/src/output/output_ast';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class NoticeSuspectService {

    constructor(private http: HttpClient) { }

    // tslint:disable-next-line:member-ordering
    private httpOptions = {
        headers: new HttpHeaders(
            {
                'Content-Type': 'application/json'
            })
    };

    SearchAdv(form: any): Promise<NoticeMasSuspect_New[]> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/ArrestMasPersongetByConAdv`;
        return this.http.post<any>(url, params, this.httpOptions).toPromise();
    }
    ArrestMasPersonGetByKeyword(TEXT_SEARCH: any): Promise<NoticeMasSuspect_New[]> {
        const params = { TEXT_SEARCH }
        const url = `${appConfig.api1111}/ArrestMasPersongetByKeyword`;
        return this.http.post<any>(url, params, this.httpOptions).toPromise();
    }
    MasPersongetByCon(TEXT_SEARCH: any): Promise<NoticeMasSuspect_New[]> {
        let PERSON_ID = "";
        const params = { TEXT_SEARCH, PERSON_ID }
        const url = `${appConfig.api2222}/MasPersongetByCon`;
        return this.http.post<any>(url, params, this.httpOptions).toPromise();
    }
}


@Component({
    selector: 'app-notice-suspect-modal',
    templateUrl: './notice-suspect-modal.component.html',
    styleUrls: ['./notice-suspect-modal.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class NoticeSuspectModalComponent implements OnInit, OnDestroy {

    @Output() Create = new EventEmitter<any>();
    @ViewChild('alertSwal') private alertSwal: SwalComponent;

    private sub: any;
    isOpen = false;
    isCheckAll = false;
    advSearch = true;
    suspect = new Array<NoticeMasSuspect_New>();
    public datas = new Array<any>();
    suspectTypes = LawbreakerTypes_New;
    entityType = EntityTypes_NEW;

    _EntityTypes_NEW = [
        {
            value: 1,
            text: 'ผู้ประกอบการ'
        },
        {
            value: 0,
            text: 'คนต่างชาติ'
        }, {
            value: 0,
            text: 'คนไทย'
        }
    ]

    paginage: any;

    suspectFormGroup: FormGroup;

    TableType: string = "Thai";
    thaiType: boolean = true;
    foreignTpye: boolean;
    plainType: boolean;
    LegalentityType: boolean;
    taskModel: Task = new Task();

    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();
    @Output() exportSuspectData = new EventEmitter<NoticeSuspect[]>();

    get Suspect(): FormArray {
        return this.suspectFormGroup.get('Suspect') as FormArray;
    }

    constructor(
        private _router: Router,
        private suspectService: NoticeSuspectService,
        private fb: FormBuilder,
        private modelService: NgbModal,
        private preloader: PreloaderService
    ) { }

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

    changeTypePerson(ev: any) {
        let type = ev.target.value
        if (type == 2) {
            this.taskModel.priority = "2";
            this.thaiType = true;
            this.foreignTpye = false;
            this.plainType = false;
            this.LegalentityType = false;
            this.TableType = "Thai";

        } else if (type == 1) {
            this.taskModel.priority = "1";
            this.thaiType = false;
            this.foreignTpye = true;
            this.plainType = false;
            this.LegalentityType = false;
            this.TableType = "foreign";
        } else if (type == 0) {
            this.taskModel.priority = "0";
            this.thaiType = false;
            this.foreignTpye = false;
            this.plainType = false;
            this.LegalentityType = true;
            this.TableType = "Operator";
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
        await this.suspectService.ArrestMasPersonGetByKeyword(f.TEXT_SEARCH).then(res => this.onCompleteAdv(res));
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
        await this.suspectService.SearchAdv(f).then(res => this.onCompleteAdv(res));
        this.preloader.setShowPreloader(false)
    }

    async onCompleteAdv(res: any) {
        if (!res || res.length == 0) {
            this.suspectFormGroup.setControl("Suspect", this.fb.array([]));
            this.alertSwal.text = Message.noRecord;
            this.alertSwal.show();
        } else {
            this.datas = res.map((item, i) => {
                item.RowId = i + 1;
                item.IsChecked = false;
                item.FULL_NAME = `${item.TITLE_SHORT_NAME_TH || ''}${item.FIRST_NAME || ''} ${item.MIDDLE_NAME || ''} ${item.LAST_NAME || ''}`;
                item.father_fname = '';
                item.mom_fname = '';

                item.ArrestMasPersonRelationship.map(m => {
                    if (m.RELATIONSHIP_ID === 1)
                        item.father_fname = `${item.TITLE_SHORT_NAME_TH || ''}${item.FIRST_NAME || ''} ${item.MIDDLE_NAME || ''} ${item.LAST_NAME || ''}`;
                    else if (m.RELATIONSHIP_ID === 2)
                        item.mom_fname = `${item.TITLE_SHORT_NAME_TH || ''}${item.FIRST_NAME || ''} ${item.MIDDLE_NAME || ''} ${item.LAST_NAME || ''}`;
                })
                return item;
            });

        }
        const __list = this.datas.slice(0, 5);
        this.setItemFormArray(__list, 'Suspect');
        this.paginage.TotalItems = res.length;
    }

    async onComplete(res: any) {
        if (!res.RESPONSE_DATA || res.RESPONSE_DATA.length == 0) {
            this.suspectFormGroup.setControl("Suspect", this.fb.array([]));
            this.alertSwal.text = Message.noRecord;
            this.alertSwal.show();
        } else {
            this.datas = await res.RESPONSE_DATA.map((item, i) => {
                item.RowId = i + 1;
                item.IsChecked = false;
                item.FULL_NAME = `${item.TITLE_SHORT_NAME_TH || ''}${item.FIRST_NAME || ''} ${item.MIDDLE_NAME || ''} ${item.LAST_NAME || ''}`
                item.father_fname = '';
                item.mom_fname = '';

                item.MAS_PERSON_RELATIONSHIP.map(m => {
                    if (m.RELATIONSHIP_ID === 1) {
                        var _father_fname = `${m.TITLE_SHORT_NAME_TH || ''}${m.FIRST_NAME || ''} ${m.LAST_NAME || ''}`
                        item.father_fname = _father_fname;

                    } else if (m.RELATIONSHIP_ID === 2) {
                        var _mom_fname = `${m.TITLE_SHORT_NAME_TH || ''}${m.FIRST_NAME || ''} ${m.LAST_NAME || ''}`
                        item.mom_fname = _mom_fname;
                    }
                })
                return item;
            });
        }

        const __list = this.datas.slice(0, 5);
        this.setItemFormArray(__list, 'Suspect');
        this.paginage.TotalItems = res.RESPONSE_DATA.length;
    }

    checkAll() {
        this.isCheckAll = !this.isCheckAll;
        this.Suspect.value.map(item => item.IsChecked = this.isCheckAll);
    }

    checkingBtnSelect(): boolean {
        return this.Suspect.value.some(s => s.IsChecked == true);
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
        let id = item.SuspectID;
        if (item.LawbreakerID) {
            id = item.LawbreakerID;
        }
        window.open(`#/notice/suspect/R/${id}`, "_blank");
    }

    async exportData() {
        let form = this.suspectFormGroup.value.Suspect;
        form = await form.filter(item => item.IsChecked === true);
        this.exportSuspectData.emit(form);
        this.close('Save click');
    }

    async pageChanges(event: any) {
        const list = await this.datas.slice(event.startIndex - 1, event.endIndex);
        this.setItemFormArray(list, 'Suspect');
    }

    ngOnDestroy() {
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

    CreaterViewSuspect(e: any, PERSON_ID, MISTREAT_NO) {
        this.Create.emit({ e: e, PERSON_ID: PERSON_ID, MISTREAT_NO: MISTREAT_NO });
        this.c.emit('Cross click');
    }

}
export class Task {
    title: string;
    priority: string;
    comment: string;

    constructor() {
        this.title = '';
        this.priority;
        this.comment = '';
    }
}
