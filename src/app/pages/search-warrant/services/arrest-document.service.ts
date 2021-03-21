import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IDocumentupdDelete, IArrestDocument } from "../models";
import { ArrestHelperService } from "./arrest-helper.service";

@Injectable()
export class ArrestDocumentService extends ArrestHelperService {

    constructor(
        private httpClient: HttpClient
    ) {
        super();
    }

    DocumentinsAll(form: IArrestDocument[]) {
        const url = `${this.DocumentApiPrefixUrl}/DocumentinsAll`;
        return this.httpClient.post(url, form);
    }

    DocumentupdDelete(form: IDocumentupdDelete) {
        const url = `${this.DocumentApiPrefixUrl}/DocumentupdDelete`;
        return this.httpClient.post(url, form);
    }
}   