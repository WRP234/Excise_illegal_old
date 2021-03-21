import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from "../../app.config";

@Injectable()
export class Nav_target_Service {
//    สาขา
    showAdvSearch = new BehaviorSubject<Boolean>(false);
    showNewButton = new BehaviorSubject<Boolean>(false);
    showPrintButton = new BehaviorSubject<Boolean>(false);
    showEditButton = new BehaviorSubject<Boolean>(false);
    showSaveButton = new BehaviorSubject<Boolean>(false);
    showCancelButton = new BehaviorSubject<Boolean>(false);
    showDeleteButton = new BehaviorSubject<Boolean>(false);
    showSearchBar = new BehaviorSubject<Boolean>(false);
    showFieldEdit = new BehaviorSubject<Boolean>(true);
    
    onEdit = new BehaviorSubject<Boolean>(false);
    onSave = new BehaviorSubject<Boolean>(false);
    onDelete = new BehaviorSubject<Boolean>(false);
    onCancel = new BehaviorSubject<Boolean>(false);
    onSearch = new BehaviorSubject<Boolean>(false);
    onPrint = new BehaviorSubject<Boolean>(false);
    onNextPage = new BehaviorSubject<Boolean>(false);
    onPrevPage = new BehaviorSubject<Boolean>(false);
    showSendTargetButton = new BehaviorSubject<Boolean>(false);
    onSendTarget = new BehaviorSubject<Boolean>(false);

    // พื้นที่ Area_target

    
    // ภาค

    constructor(private httpClient: HttpClient,) { }

    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    
     PermissionCheck(params: any): Promise<any> {
        return;
      }

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

    // setSearchBarArea_target(status: boolean) {
    //     this.showSearchBarArea_target.next(status);
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

   
    setOnSendTarget(status: boolean): void{

        this.onSendTarget.next(status);
    }

    setSendTargetButton_target(status: boolean) {
        this.showSendTargetButton.next(status);
    }

   
    
    setSendButton(status: boolean) {
        this.showSendTargetButton.next(status);
    }
      
    setOnsend_target(status: boolean){
        this.onSendTarget.next(status);
    }
    
    

}
