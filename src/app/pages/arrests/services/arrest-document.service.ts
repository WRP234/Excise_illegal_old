import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IDocumentupdDelete, IArrestDocument, IGetDocumentByCon } from "../models";
import { ArrestHelperService } from "./arrest-helper.service";

@Injectable()
export class ArrestDocumentService extends ArrestHelperService {

    private httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
        })
    };

    constructor(
        private httpClient: HttpClient
    ) {
        super();
    }

    DocumentinsAll(form: IArrestDocument) {
        const formData = new FormData();
        formData.append('FILE', form.FILE);
        formData.append('DOCUMENT_NAME', form.DOCUMENT_NAME);
        formData.append('DOCUMENT_OLD_NAME', form.DOCUMENT_OLD_NAME);
        formData.append('DOCUMENT_TYPE', form.DOCUMENT_TYPE);
        formData.append('FOLDER', form.FOLDER);
        formData.append('REFERENCE_CODE', form.REFERENCE_CODE);
        const url = `${this.ArrestApiPrefixUrl}/DocumentinsAll`;
        return this.httpClient.post(url, formData);
    }

    DocumentupdDelete(form: IDocumentupdDelete) {
        const url = `${this.ArrestApiPrefixUrl}/DocumentupdDelete`;
        return this.httpClient.post(url, form);
    }

    GetDocumentByCon(form: IGetDocumentByCon) {
        const url = `${this.ArrestApiPrefixUrl}/GetDocumentByCon`;
        return this.httpClient.post(url, form);
    }

    downloadFile(DOCUMENT_ID: string) {
        const url = `${this.ArrestApiPrefixUrl}/downloadFile.html/${DOCUMENT_ID}`
        return this.httpClient.get(url, { responseType: 'arraybuffer', headers: this.httpOptions.headers });
    }
    getImage(DOCUMENT_ID: string) {
        return `${this.ArrestApiPrefixUrl}/getImage.html/${DOCUMENT_ID}`
    }

}   