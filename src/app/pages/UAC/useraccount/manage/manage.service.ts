import { Injectable } from '@angular/core';
import * as uacDataModel from '../../uac-user-datamodel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UacConfig } from '../../uac-config';
import { LoaderService } from "app/core/loader/loader.service";
import * as uacdatamodel from '../../uac-user-datamodel';
import { appConfig } from 'app/app.config';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class ManageService {

  constructor(private http:HttpClient,private loaderService:LoaderService) { }


  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };


  async userAccountgetByCon(obj:any) {
    const url = `${appConfig.api1111}/UserAccountgetByCon`;
    return await new Promise((resolve, reject) => {
      this.http
        .post(url,obj,this.httpOptions)
        .toPromise()
        .then(response => {
          // console.log('API Response : ', response);
          resolve(response);
        })
        
    });
  }

  async userAccountinsAll(obj:any) {
    const url = `${appConfig.api1111}/UserAccountinsAll`;
    return await new Promise((resolve, reject) => {
      this.http
        .post(url,obj,this.httpOptions)
        .toPromise()
        .then(response => {
          // console.log('API Response : ', response);
          resolve(response);
        })
        
    });
  }
  async userAccountupdByCon (obj:any) {
    const url = `${appConfig.api1111}/UserAccountupdByCon`;
    return await new Promise((resolve, reject) => {
      this.http
        .post(url,obj,this.httpOptions)
        .toPromise()
        .then(response => {
          // console.log('API Response : ', response);
          resolve(response);
        })
        
    });
  }

  async modulegetAll() {
    const url = `${appConfig.api1111}/ModulegetAll`;
    return await new Promise((resolve, reject) => {
      this.http
        .post(url,this.httpOptions)
        .toPromise()
        .then(response => {
          // console.log('API Response : ', response);
          resolve(response);
        })
        
    });
  }

  async searchStaff(obj:any) {
    const url = `${appConfig.api2222}/MasStaffgetByCon`;
    return await new Promise((resolve, reject) => {
      this.http
        .post(url,obj,this.httpOptions)
        .toPromise()
        .then(response => {
          // console.log('API Response : ', response);
          resolve(response);
        })
        
    });
  }

  async userAccountupdDelete(obj:any) {
    const url = `${appConfig.api1111}/UserAccountupdDelete`;
    return await new Promise((resolve, reject) => {
      this.http
        .post(url,obj,this.httpOptions)
        .toPromise()
        .then(response => {
          // console.log('API Response : ', response);
          resolve(response);
        })
        
    });
  }


 






 



 




  // public userAccountinsAll( userAccountRequest : uacdatamodel.UserAccountinsAllRequest, userPermissions:any): Promise<any> {
  //   this.loaderService.show();
  //   return new Promise((resolve, reject) => {
  //     this.getAPIResponse(userAccountRequest, UacConfig.UserAccountinsAll).then(result => {
  //       let userAccountinsAllResponse: uacDataModel.UserAccountinsAllResponse = result;
  //       if (userAccountinsAllResponse.IsSuccess) {
  //         resolve("OK");
  //         this.loaderService.hide();
  //       } else {
  //         this.loaderService.hide();
  //         reject("Data Inquiry Error::" + userAccountinsAllResponse.Msg);
  //       }
  //     }).catch(error => {
  //       this.loaderService.hide();
  //       reject("Data Submission Error::" + JSON.stringify(error));
  //     });
  //   });
  // }

  // public userAccountupdByCon(userAccountRequest : uacdatamodel.UserAccountinsAllRequest, userPermissions:any): Promise<any> {
  //   this.loaderService.show();
  //   return new Promise((resolve, reject) => {
  //     this.getAPIResponse(userAccountRequest, UacConfig.UserAccountupdByCon).then(result => {
  //       let userAccountupdByConResponse: uacDataModel.UserAccountupdByConResponse = result;
  //       if (userAccountupdByConResponse.IsSuccess) {
  //         this.loaderService.hide();
  //         resolve("OK");
  //       } else {
  //         this.loaderService.hide();
  //         reject("Data Inquiry Error::" + userAccountupdByConResponse.Msg);
  //       }
  //     }).catch(error => {
  //       this.loaderService.hide();
  //       reject("Data Submission Error::" + JSON.stringify(error));
  //     });
  //   });
  // }

  // public loadUserAccountgetByCon(userAccountID:number): Promise<any> {
  //   let userAccountgetByConRequest: uacDataModel.UserAccountgetByConRequest = new uacDataModel.UserAccountgetByConRequest();
  //   userAccountgetByConRequest.UserAccountID = userAccountID;
  //   this.loaderService.show();
  //   return new Promise((resolve, reject) => {
  //     if(userAccountgetByConRequest.UserAccountID == null){
  //       reject(userAccountgetByConRequest.UserAccountID == null);
  //     }
  //     this.getAPIResponse(userAccountgetByConRequest, UacConfig.UserAccountgetByCon).then(result => {
  //       let userAccountListResponse: uacDataModel.UserAccountListResponse = result;
  //       if (userAccountListResponse.IsSuccess) {
  //         if (userAccountListResponse.Data.length == 1) {
  //           this.loaderService.hide();
  //           resolve(userAccountListResponse.Data[0]); 
  //         }
  //       } else {
  //         this.loaderService.hide();
  //         reject("Data Inquiry Error::" + userAccountListResponse.Msg);
  //       }
  //     }).catch(error => {
  //       this.loaderService.hide();
  //       reject("Data Submission Error::" + JSON.stringify(error));
  //     });
  //   });
  // }
  //   public getAPIResponse(request: any, endpoint: string): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //       try {
  //         this.http.post(endpoint, request, httpOptions).
  //           toPromise().
  //           then(response => { // Success
  //             resolve(response);
  //           }).catch(err => {
  //             reject(err)
  //           });
  //       } catch (error) {
  //         reject(error);
  //       }
  //     });
  //   }
}