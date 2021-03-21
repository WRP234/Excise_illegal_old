import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from 'app/app.config';

@Injectable()
export class MasDocumentMainService {

  constructor(private httpClient: HttpClient
  ) { }

  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  MasDocumentMaininsAll(document: any) {
    const params = document;
    const url = `${appConfig.api1111}/MasDocumentMaininsAll`;
    return this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

}
