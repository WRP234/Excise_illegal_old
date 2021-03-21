import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { appConfig } from "../../../app.config"

@Injectable()
export class StepWizardService {

    constructor(private httpClient: HttpClient) { }

    TimeLineListgetByCon(form: any): Observable<any> {
        return this.httpClient.post(`${appConfig.api1111}/TimeLineListgetByCon`, form);
    }
}
