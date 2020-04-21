import {Injectable} from '@angular/core';
import {HttpService} from 'src/app/http-service/http-service';
import {appConfig} from 'src/app/config/component-config';
import {apiConfig} from 'src/app/config/main-config';

@Injectable({
  providedIn: 'root'
})
export class OnlineTransactionService {

  constructor(private http: HttpService) {
  }

  addBSECredentilas(data) {
    return this.http.postEncoded(apiConfig.TRANSACT + appConfig.ADD_BSE_CREDENTIALS, data);
  }

  getBSECredentials(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_BSE_CREDENTIALS, data, 1);
  }

  getBSESubBrokerCredentials(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_BSE_SUB_BROKER_CREDENTIALS, data, 1);
  }

  getNewSchemes(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_NEW_SCHEMES, data, 1);
  }

  getSchemeDetails(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_SCHEME_DETAILS, data, 1);
  }

  getFamilyMemberList(data) {
    return this.http.get(apiConfig.TRANSACT + appConfig.GET_FAMILY_MEMBER, data);
  }

  getDefaultDetails(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_DEFAULT_DETAILS, data, 1);
  }

  transactionBSE(data) {
    return this.http.postEncoded(apiConfig.TRANSACT + appConfig.BSE_TRANSACTION, data);
  }

  getExistingSchemes(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_EXISTING_SCHEMES, data, 1);
  }

  getFoliosAmcWise(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_AMCWISE_FOLIO, data, 1);
  }

  getSchemeWiseFolios(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_SCHEMEWISE_FOLIO, data, 1);
  }

  getMandateDetails(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_MANDATE_DETAILS, data, 1);
  }

  getUnmappedClients(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_UNMAPPED_CLIENTS, data, 1);
  }

  getMapppedClients(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_MAPPED_CLIENTS, data, 1);
  }

  mapUnmappedClient(data) {
    return this.http.postEncoded(apiConfig.TRANSACT + appConfig.MAP_UNMAP_CLIENT, data);
  }

  unmapMappedClient(data) {
    return this.http.postEncoded(apiConfig.TRANSACT + appConfig.UNMAP_MAP_CLIENT, data);
  }

  mapUnmappedFolios(data) {
    return this.http.postEncoded(apiConfig.TRANSACT + appConfig.MAP_UNMAP_FOLIO, data);
  }

  unmapMappedFolios(data) {
    return this.http.postEncoded(apiConfig.TRANSACT + appConfig.UNMAP_MAP_FOLIO, data);
  }

  getSipFrequency(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_FREQUENCY, data, 1);
  }

  getNSEAchmandate(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_MANDATE_LIST, data, 1);
  }

  getBankDetailsNSE(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.BANK_DETAILS_NSE, data, 1);
  }

  getIINDetails(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GETIIN_DETAILS, data, 1);
  }

  getFolioMappedData(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_FOLIO_MAPPED, data, 1);
  }

  getFolioUnmappedData(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_FOLIO_UNMAPPED, data, 1);
  }

  getClientCodes(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_CLIENT_CODE, data, 1);
  }

  getHiddenAmcFromAdvisorIdAmcWise(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_EMPANELLED_AMC, data, 1);
  }

  addHiddenAmc(data) {
    return this.http.postEncoded(apiConfig.TRANSACT + appConfig.ADD_HIDDEN_AMC, data);
  }

  deleteHiddenAmc(data) {
    return this.http.postEncoded(apiConfig.TRANSACT + appConfig.DELETE_HIDDEN_AMC, data);
  }

  getSearchScheme(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.SEARCH_SCHEME, data, 1);
  }

  getTransactionDetail(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_TRANSACTION_DETAILS, data, 1);
  }

  getMandateList(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_MANDATE_LIST, data, 1);
  }

  getIINUCCRegistration(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_REGISTRATION_UCC_IIN, data, 1);
  }

  createIINUCC(data) {
    return this.http.postEncoded(apiConfig.TRANSACT + appConfig.CREATE_IIN_UCC, data, 1);
  }

  mandateView(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.MANDATE_VIEW, data, 1);
  }

  getToken(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_TOKEN, data, 1);
  }

  getBankDetailsMandate(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.BANK_MANDTAE, data, 1);
  }

  addMandate(data) {
    return this.http.postEncoded(apiConfig.TRANSACT + appConfig.ADD_MANDATE, data, 1);
  }

  getTaxMasterData(data) {
    return this.http.get(apiConfig.TRANSACT + appConfig.TAX_MASTER, data);
  }

  // sipBSE(data){
  //   return this.http.postEncoded(apiConfig.TRANSACT + appConfig.SIP_BSE, data)
  // }
}
