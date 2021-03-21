import { Injectable } from '@angular/core';
import { MasterHelperService } from './MasterHelperService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MasDocumentMainService extends MasterHelperService {
  constructor(private http: HttpClient) {
    super();
  }

  public MasDocumentMaingetAll({
    DocumentType,
    ReferenceCode
  }): Observable<any> {
    return this.http.post(`${this.ApiPrefixUrl}/MasDocumentMaingetAll`, {
      DocumentType: DocumentType,
      ReferenceCode: ReferenceCode
    });
  }

  public MasDocumentMaininsAll(obj): Observable<any> {
    return this.http.post(`${this.ApiPrefixUrl}/MasDocumentMaininsAll`, obj);
  }

  public MasDocumentMainupdDelete({ DocumentID }): Observable<any> {
    return this.http.post(`${this.ApiPrefixUrl}/MasDocumentMainupdDelete`, {
      DocumentID: DocumentID
    });
  }
}
