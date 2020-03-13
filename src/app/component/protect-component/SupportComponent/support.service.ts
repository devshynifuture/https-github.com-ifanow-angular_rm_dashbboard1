import { appConfig } from './../../../config/component-config';
import { apiConfig } from './../../../config/main-config';
import { Injectable } from '@angular/core';

import { HttpService } from './../../../http-service/http-service';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private http: HttpService) { }

  getMyIFAValues(data) {

  }

  getBackofficeAumOrderListValues(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_AUM_ORDER_LIST, data);
  }


}
