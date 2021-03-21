import { Injectable } from '@angular/core';
import { appConfig } from "../../app.config";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { HttpService } from "../../core/http.service";
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers, Jsonp, ResponseContentType } from '@angular/http'
import { stringify } from '@angular/compiler/src/util';
import { promise } from 'protractor';

@Injectable()
export class AuthService {

  constructor(private httpClient: HttpClient,
    private httpService: HttpService,
    private http: Http) { }


  signin(form: any) {
    // return res.map(user => {
    //   if (user && user.access_token) {
    localStorage.setItem('currentUser', JSON.stringify(form));
    //   }
    return form;
    // });
  }

  signout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  userAuth(params): Observable<any> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    const url = `${appConfig.api1120}/UACVerifyLogIn`
    console.log(url)
    console.log(params)
    return this.http.post(url, params, options)
      .map((res: Response) => res.json())
      .catch(this.handleErrorObservable);
  }

  /****************************(Used with in the Excise Only)***************************** */
  ssoService(params): Observable<any> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    const url = `${appConfig.XCS_DNS_SERVICE}/sso/ExciseUserInfomation`
    return this.http.post(url, params, options)
      .map((res: Response) => res.json())
      .catch(this.handleErrorObservable);
  }

  // userAndPrivilegeInfoOld(User): Observable<any> {
  //   // console.log('User : ',User)
  //   let options = new RequestOptions({ headers: this.getHeaders() });
  //   const url = `http://webtest.excise.go.th/edssows/ldap/userAndPrivilegeInformation?userID=${User}&systemID=Test010`
  //   return this.http.get(url)
  //     .map((res: Response) => res.json())
  //     .catch(this.handleErrorObservable);
  // }

  // eofficeInfoOld(params): Observable<any> {
  //   let options = new RequestOptions({ headers: this.getHeaders() });
  //   const url = `http://uat.eoffice.excise.go.th:7003/EOfficeWS/HrstPersonInformation `
  //   return this.http.post(url, params, options)
  //     .map((res: Response) => res.json())
  //     .catch(this.handleErrorObservable);
  // }

  userAndPrivilegeInfo(params): Observable<any> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    const url = `${appConfig.api8086}/userAndPrivilegeInfo`
    return this.http.post(url, params, options)
      .map((res: Response) => res.json())
      .catch(this.handleErrorObservable);
  }

  eofficeInfo(params): Observable<any> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    const url = `${appConfig.api8086}/eofficeInfo`
    return this.http.post(url, params, options)
      .map((res: Response) => res.json())
      .catch(this.handleErrorObservable);
  }

  LDPAGAuthen(params): Observable<any> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    const url = `${appConfig.api8086}/LDPAGAuthen`
    return this.http.post(url, params, options)
      .map((res: Response) => res.json())
    // .catch(this.handleErrorObservable);
  }
  /****************************(End Used with in the Excise Only)***************************** */

  AccessToken(username: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set("client_id", "da471738-db76-40cb-baf6-4fdee4140d46")
      .set("client_secret", "b6cbc79f-a802-4afc-baf4-2e5375cdedba")
      .set("grant_source", "int_ldap")
      .set("grant_type", "password")
      .set("password", password)
      .set("scope", "resource.READ")
      .set("username", username)

    const url = `${appConfig.XCS_API_GATEWAY}/api/oauth/token`
    return this.httpClient.post(url, body);
  }

  LDPAGAuthenViaOAG(params, AccessToken): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': `eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyMiIsImlhdCI6MTU4NDY3NjM2OSwic3ViIjoiSW50ZWdyYXRlZCBSZXF1ZXN0IFNlcnZpY2UiLCJpc3MiOiJjYXRhbG9nIiwiZXhwIjoxNTg0Njc2MzY5fQ.ERkrIB5aWJJ8lhqcJosfk7cmjy9e4O9o-4BraAAuO_I`,
        'Authorization': 'Bearer ' + AccessToken
      })
    };

    const url = `${appConfig.XCS_API_GATEWAY}/api/staff?serviceCode=ILLEGAL004`
    return this.httpClient.post(url, params, httpOptions);
  }

  private getHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }
}
