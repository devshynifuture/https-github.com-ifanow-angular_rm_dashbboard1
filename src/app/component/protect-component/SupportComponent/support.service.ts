import { Injectable } from '@angular/core';

import { appConfig } from './../../../config/component-config';
import { apiConfig } from './../../../config/main-config';
import { HttpService } from './../../../http-service/http-service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private http: HttpService) { }

  private subject = new BehaviorSubject<any>('');

  getMyIFAValues(data) {
    return null;
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

  getBackofficeReports(data) {
    return null;
  }

  getDailyServicesStatusReport(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_DAILY_SERVICES_STATUS_REPORT, data);
  }

  getDailyFiles(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_DAILY_FILES, data);
  }

  getHistoricFilesReport(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.FILTER_HISTORICAL_REPORT, data);
  }

  getIfaMatricData(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_IFA_MATRIC_DATA, data);
  }
  // observable data sending

  sendDataThroughObs(value) {
    this.subject.next(value)
  }

  // get Observable Data
  getDataThroughObs(): Observable<any> {
    return this.subject.asObservable();
  }
}