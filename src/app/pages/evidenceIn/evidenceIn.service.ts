import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Evidence_In, EvidenceInItem, EvidenceStockBalance } from './evidenceIn';
import { appConfig } from '../../app.config';
import { Observable } from "rxjs/Observable";

@Injectable()
export class EvidenceService {

  constructor(
    private http: HttpClient
  ) { }

  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  // getByKeyword(Textsearch: string) {
  //   const params = Textsearch;
  //   const url = `${appConfig.api8776}/EvidenceInListgetByKeyword`;
  //   return this.http.post<Evidence_In[]>(url, params, this.httpOptions);
  // }
  
  async getByKeyword(Textsearch: any): Promise<any> {
    const params = JSON.stringify(Textsearch);
    const url = `${appConfig.api1111}/EvidenceInListgetByKeyword`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }


  async getByConAdv(form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/EvidenceInListgetByConAdv`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async StaffgetByKeyword(): Promise<any> {
    const params = {};
    const url = `${appConfig.api1111}/MasStaffMaingetAll`;
    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await alert(error);
    }
  }

  async EvidenceInArrestgetByProveID(PROVE_ID: string): Promise<any> {
    const params = { PROVE_ID };
    const url = `${appConfig.api1111}/EvidenceInArrestgetByProveID`;
    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await alert(error);
    }
  }

  async getByCon(EVIDENCE_IN_ID:string, PROVE_ID: string): Promise<any> {
    const params = { EVIDENCE_IN_ID, PROVE_ID };
    const url = `${appConfig.api1111}/EvidenceIngetByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async getProveProductUnit(Textsearch: string): Promise<any> {
    const params = {};
    const url = `${appConfig.api1111}/MasDutyUnitMaingetAll`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      // await alert(error);
      return [];
    }
  }

  async EvidenceIninsAll(oEvidence: Evidence_In): Promise<any> {
    const params = JSON.stringify(oEvidence);
    const url = `${appConfig.api1111}/EvidenceIninsAll`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async EvidenceInupdByCon(oEvidence: Evidence_In): Promise<any> {
    const params = JSON.stringify(oEvidence);
    const url = `${appConfig.api1111}/EvidenceInupdByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async EvidenceInupdDelete(EvidenceInID: string): Promise<any> {
    const params = { EvidenceInID };
    const url = `${appConfig.api1111}/EvidenceInupdDelete`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async MasProductMaingetAll(): Promise<any> {
    const params = {};
    const url = `${appConfig.api1111}/MasProductMaingetAll`;
    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await alert(error);
    }
  }

  async EvidenceInIteminsAll(oItem: any): Promise<any> {
    const params = JSON.stringify(oItem);
    const url = `${appConfig.api1111}/EvidenceInIteminsAll`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async EvidenceInItemupdByCon(oItem: any): Promise<any> {
    const params = JSON.stringify(oItem);
    const url = `${appConfig.api1111}/EvidenceInItemupdByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async EvidenceInItemupdDelete(oItem: any): Promise<any> {
    const params = JSON.stringify(oItem);
    const url = `${appConfig.api1111}/EvidenceInItemupdDelete`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }


  async TransactionRunningItemgetByCon(RunningPrefix, RunningGroupCode, RunningWarehouseID): Promise<any> {
    let pValue = {
      "RunningPrefix": RunningPrefix,
      "RunningGroupCode": RunningGroupCode,
      "RunningWarehouseID": RunningWarehouseID
    }

    const params = JSON.stringify(pValue);
    const url = `${appConfig.api1111}/TransactionRunningItemgetByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async TransactionRunningIteminsAll(RunningYear, RunningMonth, RunningPrefix, RunningGroupCode, RunningWarehouseID, RunningNo): Promise<any> {
    let pValue = {
      "RunningYear": RunningYear,
      "RunningMonth": RunningMonth,
      "RunningPrefix": RunningPrefix,
      "RunningGroupCode": RunningGroupCode,
      "RunningWarehouseID": RunningWarehouseID,
      "RunningNo": RunningNo
    }

    const params = JSON.stringify(pValue);
    const url = `${appConfig.api1111}/TransactionRunningIteminsAll`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async TransactionRunningItemupdByCon(RunningID): Promise<any> {
    const params = { RunningID };
    const url = `${appConfig.api1111}/TransactionRunningItemupdByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async getEvidenceInOutgetByWarehouseID(WAREHOUSE_ID: string): Promise<any> {
    const params = { WAREHOUSE_ID };
    const url = `${appConfig.api1111}/EvidenceInOutgetByWarehouseID`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) { }
  }

  async EvidenceInOutItemupdIsReturn(EvidenceOutItem: any): Promise<any> {
    const params =  JSON.stringify(EvidenceOutItem);
    const url = `${appConfig.api1111}/EvidenceInOutItemupdIsReturn`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) { }
  }

  async EvidenceInStockBalanceupdByCon(EvidenceStockBalance: any): Promise<any> {
    const params = { EvidenceStockBalance };
    const url = `${appConfig.api1111}/EvidenceInStockBalanceupdByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) { }
  }

  /*  ****************************************************
      ------------------- From Revenue ------------------- 
      ****************************************************
  */ 
  async TransactionRunninggetByCon(RunningTable, RunningOfficeCode): Promise<any> {
    let pValue = {
      "RunningTable": RunningTable,
      "RunningOfficeCode": RunningOfficeCode
    }

    const params = JSON.stringify(pValue);
    const url = `${appConfig.api1111}/TransactionRunninggetByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async TransactionRunninginsAll(RunningOfficeCode, RunningTable, RunningPrefix): Promise<any> {
    let pValue = {
      "RunningOfficeCode": RunningOfficeCode,
      "RunningTable": RunningTable,
      "RunningPrefix": RunningPrefix
    }

    const params = JSON.stringify(pValue);
    const url = `${appConfig.api1111}/TransactionRunninginsAll`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async TransactionRunningupdByCon(RunningID): Promise<any> {
    const params = { RunningID };
    const url = `${appConfig.api1111}/TransactionRunningupdByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }
  /*  ****************************************************
      ------------------- From Prove ------------------- 
      ****************************************************
  */ 
  async MasDocumentMaingetAll(ReferenceCode: string, _DocumentType: string): Promise<any> {
    let pValue = {
      "ReferenceCode" : ReferenceCode,
      "DocumentType" : _DocumentType
    }

    const params = JSON.stringify(pValue);
    const url = `${appConfig.api1111}/MasDocumentMaingetAll`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async MasDocumentMaininsAll(oProveDocument: Document): Promise<any> {
    const params = JSON.stringify(oProveDocument);
    const url = `${appConfig.api1111}/MasDocumentMaininsAll`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async MasDocumentMainupdByCon(oProveDocument: Document): Promise<any> {
    const params = JSON.stringify(oProveDocument);
    const url = `${appConfig.api1111}/MasDocumentMainupdByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async MasDocumentMainupdDelete(DocumentID: string): Promise<any> {
    const params = {DocumentID};
    const url = `${appConfig.api1111}/MasDocumentMainupdDelete`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }
}
