import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from "../../app.config";

@Injectable()
export class NavigationService {
    // ปุ่มที่แชร์กัน
    // modeSource = new BehaviorSubject<string>('');
    showAdvSearch = new BehaviorSubject<Boolean>(false);
    showNewButton = new BehaviorSubject<Boolean>(false);
    showPrevPageButton = new BehaviorSubject<Boolean>(false);
    showNextPageButton = new BehaviorSubject<Boolean>(false);
    showPrintButton = new BehaviorSubject<Boolean>(false);
    showEditButton = new BehaviorSubject<Boolean>(false);
    showSaveButton = new BehaviorSubject<Boolean>(false);
    showCancelButton = new BehaviorSubject<Boolean>(false);
    showDeleteButton = new BehaviorSubject<Boolean>(false);
    showProofButton = new BehaviorSubject<Boolean>(false);
    showSearchBar = new BehaviorSubject<Boolean>(false);
    showFieldEdit = new BehaviorSubject<Boolean>(true);
    showSendIncomeButton = new BehaviorSubject<Boolean>(false);

    onEdit = new BehaviorSubject<Boolean>(false);
    onSave = new BehaviorSubject<Boolean>(false);
    onDelete = new BehaviorSubject<Boolean>(false);
    onCancel = new BehaviorSubject<Boolean>(false);
    onSearch = new BehaviorSubject<Boolean>(false);
    onPrint = new BehaviorSubject<Boolean>(false);
    onNextPage = new BehaviorSubject<Boolean>(false);
    onPrevPage = new BehaviorSubject<Boolean>(false);
    onSendIncome = new BehaviorSubject<Boolean>(false);
    // onSendTarget = new BehaviorSubject<Boolean>(false);

    innerTextNextPageButton = new BehaviorSubject<string>(null);
    innerTextPrevPageButton = new BehaviorSubject<string>(null);
    searchByKeyword = new BehaviorSubject<any>(null);

    // เป้าปราบปราม
    showAdvSearch_target = new BehaviorSubject<Boolean>(false);
    showNewButton_target = new BehaviorSubject<Boolean>(false);
    showPrevPageButton_target = new BehaviorSubject<Boolean>(false);
    showNextPageButton_target = new BehaviorSubject<Boolean>(false);
    showPrintButton_target = new BehaviorSubject<Boolean>(false);
    showEditButton_target = new BehaviorSubject<Boolean>(false);
    showSaveButton_target = new BehaviorSubject<Boolean>(false);
    showCancelButton_target = new BehaviorSubject<Boolean>(false);
    showCancelButtonOnEdit_target = new BehaviorSubject<Boolean>(false);
    showDeleteButton_target = new BehaviorSubject<Boolean>(false);
    showProofButton_target = new BehaviorSubject<Boolean>(false);
    showSearchBar_target = new BehaviorSubject<Boolean>(false);
    showFieldEdit_target = new BehaviorSubject<Boolean>(true);
    showSendTargetButton = new BehaviorSubject<Boolean>(false);
    // showSendButton_target = new BehaviorSubject<Boolean>(false);
    onSendTarget = new BehaviorSubject<Boolean>(false);
    onEdit_Cancel_target = new BehaviorSubject<Boolean>(false);
    onSave_target = new BehaviorSubject<Boolean>(false);
    onCancel_target = new BehaviorSubject<Boolean>(false);

    // เป้า พื้นที่
    showsendTargetAreaButton = new BehaviorSubject<Boolean>(false);
    onSendTargetArea = new BehaviorSubject<Boolean>(false);
    showSearchBar_targetArea = new BehaviorSubject<Boolean>(false);

    constructor(private httpClient: HttpClient,) { }

    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    
     PermissionCheck(params: any): Promise<any> {
        return;
      }

    setInnerTextNextPageButton(text: string) {
        this.innerTextNextPageButton.next(text);
    }

    setInnerTextPrevPageButton(text: string) {
        this.innerTextPrevPageButton.next(text);
    }

    // -- Set Element share -- 
    setAdvSearch() {
        if (this.showAdvSearch.getValue()) {
            this.showAdvSearch.next(false);
        } else {
            this.showAdvSearch.next(true);
        }
    }

    setEditField(status: boolean) {
        this.showFieldEdit.next(status);
    }

    setSearchBar(status: boolean) {
        this.showSearchBar.next(status);
    }
    // setSearchBar(status: boolean) {
    //     this.showSearchBar.next(status);
    // }

    setPrintButton(status: boolean) {
        this.showPrintButton.next(status);
    }

    setEditButton(status: boolean) {
        this.showEditButton.next(status);
    }

    setDeleteButton(status: boolean) {
        this.showDeleteButton.next(status);
    }

    setSaveButton(status: boolean) {
        this.showSaveButton.next(status);
    }

    setCancelButton(status: boolean) {
        this.showCancelButton.next(status);
    }

    setNewButton(status: boolean) {
        this.showNewButton.next(status);
    }

    setNextPageButton(status: boolean) {
        this.showNextPageButton.next(status);
    }

    setPrevPageButton(status: boolean) {
        this.showPrevPageButton.next(status);
    }

    setSendIncomeButton(status: boolean) {
        this.showSendIncomeButton.next(status);
    }

    // -- End Set Element share --

    // -- Set Event share --
    setOnEdit(status: boolean) {
        this.onEdit.next(status);
    }


    setOnSave(status: boolean) {
        this.onSave.next(status);
    }

    setOnDelete(status: boolean) {
        this.onDelete.next(status);
    }

    setOnCancel(status: boolean) {
        this.onCancel.next(status);
    }
    setOnCancelOnEdit(status: boolean) {
        this.onEdit_Cancel_target.next(status);
    }

    setOnSearch(textSearch: any) {
        this.searchByKeyword.next(textSearch);
    }

    setOnAdvSearch(object: any) {

    }

    setOnPrint(status: boolean) {
        this.onPrint.next(status);
    }

    setOnNextPage(status: boolean) {
        this.onNextPage.next(status);
    }

    setOnPrevPage(status: boolean) {
        this.onPrevPage.next(status);
    }

    setOnSendIncome(status: boolean): void {
        this.onSendIncome.next(status);
    }
    setOnSendTarget(status: boolean): void{

        this.onSendTarget.next(status);
    }

    // setOnSendTargetArea
    setOnSendTargetArea(status: boolean): void{

        this.onSendTargetArea.next(status);
    }
    // -- End Set Event share

    // -- Set Element target -- _target
    setAdvSearch_target() {
        if (this.showAdvSearch_target.getValue()) {
            this.showAdvSearch_target.next(false);
        } else {
            this.showAdvSearch_target.next(true);
        }
    }

    setEditField_target(status: boolean) {
        this.showFieldEdit_target.next(status);
    }

    setSearchBar_target(status: boolean) {
        this.showSearchBar_target.next(status);
    }
    setSearchBar_targetArea(status: boolean) {
        this.showSearchBar_targetArea.next(status);
    }

    setPrintButton_target(status: boolean) {
        this.showPrintButton_target.next(status);
    }

    setEditButton_target(status: boolean) {
        this.showEditButton_target.next(status);
    }

    setDeleteButton_target(status: boolean) {
        this.showDeleteButton_target.next(status);
    }

    setSaveButton_target(status: boolean) {
        this.showSaveButton_target.next(status);
    }

    setCancelButton_target(status: boolean) {
        this.showCancelButton_target.next(status);
    }

    setCancelButtonOnEdit_target(status: boolean) {
        this.showCancelButtonOnEdit_target.next(status);
    }

    setNewButton_target(status: boolean) {
        this.showNewButton_target.next(status);
    }

    setNextPageButton_target(status: boolean) {
        this.showNextPageButton_target.next(status);
    }

    setPrevPageButton_target(status: boolean) {
        this.showPrevPageButton_target.next(status);
    }

    setSendTargetButton_target(status: boolean) {
        this.showSendTargetButton.next(status);
    }

    // showsendTargetAreaButton
    setSendTargetAreaButton_target(status: boolean) {
        this.showsendTargetAreaButton.next(status);
    }
    
    setSendButton_target(status: boolean) {
        this.showSendTargetButton.next(status);
    }
    // setSendIncomeButton(status: boolean) {
    //     this.showSendIncomeButton.next(status);
    // }
    setOnSave_target(status: boolean) {
        this.onSave_target.next(status);
    }   
    setOnsend_target(status: boolean){
        this.onSendTarget.next(status);
    }
    setOnEditCancel(status: boolean) {
        this.onEdit_Cancel_target.next(status);
    }
    setOnCancel_target(status: boolean){
        this.onCancel_target.next(status);
    }
    // setOnSendIncome_target(status: boolean){
    //     this.onSave_target.next(status);
    // }
    // -- End Set Element share --

}
