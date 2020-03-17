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

  getAumReconListGetValues(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_AUM_RECON_LIST, data)
  }

  putAumTransactionKeepOrRemove(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_PUT_AUM_TRANSACTION_KEEP_OR_REMOVE, data);
  }

  putAumTransactionMultipleDelete(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_PUT_AUM_TRANSACTION_MULTIPLE_DELETE, data);
  }
}