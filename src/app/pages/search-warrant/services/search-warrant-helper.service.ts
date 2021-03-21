import {environment} from 'environments/environment';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

export class SearchWarrantHelperService {
  protected DocumentApiPrefixUrl = `${environment.api_port}1111/XCS60`;
  protected SearchWarrantApiPrefixUrl = `${environment.api_port}1120/XCS60`;
  protected SearchWarrantMasterApiPrefixUrl = `${environment.api_port}1120/XCS60`;

  public PipeResponseData(obj: Observable<Object>) {
    return obj.pipe(map(x => {
      if (x === null || x === undefined) {
        return [];
      }

      if (x['SUCCESS'] === true) {
        return x['RESPONSE_DATA'];
      }
    }));
  }
}

