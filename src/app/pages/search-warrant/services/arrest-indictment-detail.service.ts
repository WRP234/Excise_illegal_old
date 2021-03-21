import { Injectable } from "@angular/core";
import { appConfig } from "app/app.config";
import { HttpService } from "app/core/http.service";
import { ArrestIndictmentDetail } from "../models/arrest-indictment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable() 
export class ArrestIndictmentDetailService {

    constructor(
        private http: HttpService,
        private httpClient :HttpClient
        ) { }

    private httpOptions = {
        headers: new HttpHeaders(
            {
                'Content-Type': 'application/json'
            })
    };
}