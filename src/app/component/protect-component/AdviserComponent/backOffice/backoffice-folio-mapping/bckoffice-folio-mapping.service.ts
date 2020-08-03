import { apiConfig } from './../../../../../config/main-config';
import { HttpService } from './../../../../../http-service/http-service';
import { Injectable } from '@angular/core';
import { appConfig } from 'src/app/config/component-config';

@Injectable({
  providedIn: 'root'
})
export class BackofficeFolioMappingService {
  constructor(
    private http: HttpService,
  ) { }

  getMutualFundUnmapFolio(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_MUTUAL_FUND_UNMAP_FOLIO_SCHEME_NAME_LIST, data);
  }

}