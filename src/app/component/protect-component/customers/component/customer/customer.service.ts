import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpService) { }

  addLifeInsurance(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_LIFE_INSURANCE, data)
  }
  addFixedDeposit(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_FIXEDDEPOSIT, data)
  }
  getLifeInsuranceData(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId).set('insuranceSubTypeId', data.insuranceSubTypeId).set('insuranceTypeId', data.insuranceTypeId)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIFE_INSURANCE, httpParams)
  }
  editLifeInsuranceData(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_LIFE_INSURANCE, data)
  }
  getInsuranceGlobalData(data) {
    let httpParams = new HttpParams();
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_INSURANCE_GLOBAL_API, httpParams)
  }
  addLiability(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_LIABILITY, data)
  }
  editLiability(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_LIABILITY, data)
  }
  getLiabilty(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIABILITY, httpParams);
  }
  editFixedDeposit(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_FIXEDDEPOSIT, data)
  }
  getListOfFamilyByClient(data) {
    let httpParams = new HttpParams();
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIST_FAMILY_MEMBER, data)
  }
  getFixedDeposit(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_FIXEDDEPOSIT, data)
  }
  getRecurringDeposit(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_RECURING_DEPOSIT, data)
  }
  getBonds(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_BONDS, data)
  }
  addRecurringDeposit(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_RECURRING_DEPOSIT, data)
  }
  addBonds(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_BOND, data)
  }
  editRecurringDeposit(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_RECURRING_DEPOSIT, data)
  }
  editBonds(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_BONDS, data)
  }
  getSmallSavingSchemePPFData(data) {
    let httpParams = new HttpParams().set("advisorId", data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_PPF, httpParams)
  }
  getSmallSavingSchemeNSCData(data) {
    let httpParams = new HttpParams().set("advisorId", data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_NSC, httpParams)
  }
  getSmallSavingSchemeSSYData(data) {
    let httpParams = new HttpParams().set("advisorId", data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_SSY, httpParams)
  }
  getSmallSavingSchemeKVPData(data) {
    let httpParams = new HttpParams().set("advisorId", data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_KVP, httpParams)
  }
  getSmallSavingSchemeSCSSData(data) {
    let httpParams = new HttpParams().set("advisorId", data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_SCSS, httpParams)
  }
  getSmallSavingSchemePOSAVINGData(data) {
    let httpParams = new HttpParams().set("advisorId", data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_POSAVING, httpParams)
  }
  getSmallSavingSchemePORDData(data) {
    let httpParams = new HttpParams().set("advisorId", data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_PO_RD, httpParams)
  }
  getSmallSavingSchemePOTDData(data) {
    let httpParams = new HttpParams().set("advisorId", data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_PO_TD, httpParams)
  }
  getSmallSavingSchemePOMISData(data) {
    let httpParams = new HttpParams().set("advisorId", data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_PO_MIS, httpParams)
  }
  getRealEstate(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_REAL_ESTATE, httpParams);
  }
  getEPF(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_EPF, data)
  }
  addEPF(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_EPF, data)
  }
  editEPF(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_EPF, data)
  }
  getNPS(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_NPS, data)
  }
  addNPS(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_NPS, data)
  }
  editNPS(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_NPS, data)
  }
  getGrauity(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_GRATUITY, data)
  }
  addGratuity(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_GRATUITY, data)
  }
  editGratuity(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_GRATUITY, data)
  }
  getSuperannuation(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUPERANNUATION, data)
  }
  addSuperannuation(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_SUPERANNUATION, data)
  }
  editSuperannuation(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_SUPERANNUATION, data)
  }
  getEPS(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_EPS, data)
  }
  addEPS(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_EPS, data)
  }
  editEPS(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_EPS, data)
  }
  getGlobal() {
    const httpParams = new HttpParams();
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_GLOBAl, httpParams)
  }
  getOtherPayables(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.OTHER_PAYABLES, data)
  }
  addOtherPayables(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_OTHER_PAYABLES, data)
  }
  editOtherPayables(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_OTHER_PAYABLES, data)
  }
  addRealEstate(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_REAL_ESTATE, data)
  }
  editRealEstate(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_REAL_ESTATE, data)
  }
  addPPFScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_PPF_SCHEME, data)
  }
  addNSCScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_NSC_SCHEME, data)
  }
  addSSYScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_SSY_SCHEME, data)
  }
  addSCSSScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_SCSS_SCHEME, data)
  }
  addPOSAVINGScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_PO_SAVING, data)
  }
  addPORDScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_PO_RD_SCHEME, data)
  }
  getBankAccounts(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_BANK_ACCOUNTS, data)
  }
  addBankAccounts(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_BANK_ACCOUNTS, data)
  }
  editBankAcounts(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_BANK_ACCOUNTS, data)
  }
  getCashInHand(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CASH_IN_HAND, data)
  }
  addCashInHand(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_CASH_IN_HAND, data)
  }
  editCashInHand(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_CASH_IN_HAND, data)
  }
  getGold(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_GOLD, data)
  }
  addGold(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_GOLD, data)
  }
  editGold(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_GOLD, data)
  }
  getOthers(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_OTHERS, data)
  }
  addOthers(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_OTHERS, data)
  }
  editOthers(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_OTHERS, data)
  }
  editNSCData(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_NSC_SCHEME, data)
  }
  editSSYData(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_SSY_SCHEME, data)
  }
  editSCSSData(data) {
    return this, this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_SCSS_SCHEME, data)
  }
  editPOSAVINGData(data) {
    return this, this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_POSAVING_SCHEME, data)
  }
  addPOMIS(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_POMIS, data)
  }
  editPOMIS(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_POMIS, data)
  }
  editPPF(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_PPF_SCHEME, data)
  }
  addKVP(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_KVP_SCHEME, data)
  }
  editKVP(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_KVP_SCHEME, data)
  }
  editPORD(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_PORD_SCHEME, data)
  }
  addPOTD(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_POTD_SCHEME, data)
  }
  editPOTD(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_POTD_SCHEME, data)
  }
  getAssetCountGlobalData(data)
  {
    let httpParams=new HttpParams().set('advisorId',data.advisorId).set('clientId',data.clientId)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_COUNT_GLOBAL_DATA,httpParams)
  }
  deletePPF(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_PPF_SCHEME, data)
  }
  deleteNSC(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_NSC_SCHEME, data)
  }
  deleteSSY(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_SSY_SCHEME, data)
  }
  deleteKVP(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_KVP_SCHEME, data)
  }
  deleteSCSS(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_SCSS_SCHEME, data)
  }
  deletePOSAVING(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_POSAVING_SCHEME, data)
  }
  deletePORD(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_PORD_SCHEME, data)
  }
  deletePOTD(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_POTD_SCHEME, data)
  }
  deletePOMIS(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_POMIS_SCHEME, data)
  }
}
