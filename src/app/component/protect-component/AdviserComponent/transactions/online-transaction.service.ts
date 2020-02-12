import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { appConfig } from 'src/app/config/component-config';
import { apiConfig } from 'src/app/config/main-config';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OnlineTransactionService {

  constructor(private http: HttpService) { }
  addBSECredentilas(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_BSE_CREDENTIALS, data)
  }
  getBSECredentials(data) {
    return this.http.getEncoded(apiConfig.MAIN_URL + appConfig.GET_BSE_CREDENTIALS, data, 1)
  }
  getBSESubBrokerCredentials(data) {
    return this.http.getEncoded(apiConfig.MAIN_URL + appConfig.GET_BSE_SUB_BROKER_CREDENTIALS, data, 1)
  }
  getNewSchemes(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_NEW_SCHEMES, data, 1)
  }
  getSchemeDetails(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_SCHEME_DETAILS, data, 1);
  }
  getFamilyMemberList(data){
    return this.http.get(apiConfig.TRANSACT + appConfig.GET_FAMILY_MEMBER, data);
  }
  getDefaultDetails(data){
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_DEFAULT_DETAILS, data,1);
  }
  purchase(data){
    return this.http.postEncoded(apiConfig.TRANSACT + appConfig.PURCHASE, data)
  }
  getExistingSchemes(data){
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_EXISTING_SCHEMES, data, 1)
  }
  getFoliosAmcWise(data){
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_AMCWISE_FOLIO, data, 1)
  }
  getSchemeWiseFolios(data){
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_SCHEMEWISE_FOLIO, data, 1)
  }
  getMandateDetails(data){
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_MANDATE_DETAILS, data, 1)
  }
  getSipFrequency(data){
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_FREQUENCY, data, 1)
  }
  sipBSE(data){
    return this.http.postEncoded(apiConfig.TRANSACT + appConfig.SIP_BSE, data)
  }
}
