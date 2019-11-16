import { Injectable } from '@angular/core';
import {HttpService} from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http:HttpService) { }

  addLifeInsurance(data)
  {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_LIFE_INSURANCE,data)
  }
  addFixedDeposit(data){
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_FIXEDDEPOSIT,data)
  }
  getLifeInsuranceData(data)
  {
    let httpParams=new HttpParams().set('advisorId',data.advisorId).set('clientId',data.clientId).set('insuranceSubTypeId',data.insuranceSubTypeId).set('insuranceTypeId',data.insuranceTypeId)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIFE_INSURANCE,httpParams)
  }
  editLifeInsuranceData(data)
  {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_LIFE_INSURANCE,data)
  }
  getInsuranceGlobalData(data)
  {
    let httpParams=new HttpParams();
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_INSURANCE_GLOBAL_API,httpParams)
  }
  addLiability(data){
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_LIABILITY,data)
  }
  editLiability(data)
  {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_LIABILITY,data)
  }
  getLiabilty(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIABILITY, httpParams);
  }
  editFixedDeposit(data){
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_FIXEDDEPOSIT,data)
  }
  getListOfFamilyByClient(data){
    let httpParams=new HttpParams();
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIST_FAMILY_MEMBER,data)
  }
  getFixedDeposit(data){
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_FIXEDDEPOSIT,data)
  }
  getRecurringDeposit(data){
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_RECURING_DEPOSIT,data)
  }
  getBonds(data){
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_BONDS,data)
  }
  addRecurringDeposit(data){
     return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_RECURRING_DEPOSIT,data)
  }
  addBonds(data){
     return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_BOND,data)
  }
  editRecurringDeposit(data){
     return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_RECURRING_DEPOSIT,data)
  }
  editBonds(data){
   return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_BONDS,data)    
  }
  getSmallSavingSchemePPFData(data)
  {
    let httpParams =new HttpParams().set("advisorId",data.advisorId).set('clientId',data.clientId);
    return this.http.get(apiConfig.MAIN_URL +appConfig.GET_ASSET_SMALL_SAVING_SCHEME_PPF,httpParams)
  }
  getSmallSavingSchemeNSCData(data)
  {
    let httpParams =new HttpParams().set("advisorId",data.advisorId).set('clientId',data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_NSC,httpParams)
  }
  getSmallSavingSchemeSSYData(data)
  {
    let httpParams =new HttpParams().set("advisorId",data.advisorId).set('clientId',data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_SSY,httpParams)
  }
  getSmallSavingSchemeKVPData(data)
  {
    let httpParams =new HttpParams().set("advisorId",data.advisorId).set('clientId',data.clientId).set('requiredDate',data.requiredDate);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_KVP,httpParams)
  }
  getSmallSavingSchemeSCSSData(data)
  {
    let httpParams =new HttpParams().set("advisorId",data.advisorId).set('clientId',data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_SCSS,httpParams)
  }
  getSmallSavingSchemePOSAVINGData(data)
  {
    let httpParams =new HttpParams().set("advisorId",data.advisorId).set('clientId',data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_POSAVING,httpParams)
  }
  getSmallSavingSchemePORDData(data)
  {
    let httpParams =new HttpParams().set("advisorId",data.advisorId).set('clientId',data.clientId).set('requiredDate',data.requiredDate);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_PO_RD,httpParams)
  }
  getSmallSavingSchemePOTDData(data)
  {
    let httpParams =new HttpParams().set("advisorId",data.advisorId).set('clientId',data.clientId).set('requiredDate',data.requiredDate);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_PO_TD,httpParams)
  }
  getSmallSavingSchemePOMISData(data)
  {
    let httpParams =new HttpParams().set("advisorId",data.advisorId).set('clientId',data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_PO_MIS,httpParams)
  }
  getRealEstate(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_REAL_ESTATE, httpParams);
  }
  getEPF(data){
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_EPF,data)
  }
  addEPF(data){
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_EPF,data)
  }
  editEPF(data){
   return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_EPF,data)
  }
  getNPS(data){
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_NPS,data)
  }
  addNPS(data){
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_NPS,data)
  }
  editNPS(data){
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_NPS,data)
  }
  getGrauity(data){
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_GRATUITY,data)
  }
  addGratuity(data){
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_GRATUITY,data)
  }
  editGratuity(data){
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_GRATUITY,data)
  }
  getSuperannuation(data){
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUPERANNUATION,data)
  }
  addSuperannuation(data){
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_SUPERANNUATION,data)
  }
  editSuperannuation(data){
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_SUPERANNUATION,data)
  }
  getEPS(data){
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_EPS,data)    
  }
  addEPS(data){
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_EPS,data)
  }
  editEPS(data){
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_EPS,data)
  }
}
