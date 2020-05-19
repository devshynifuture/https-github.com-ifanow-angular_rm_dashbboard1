import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpService, private httpService: HttpClient) {
  }

  addLifeInsurance(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_LIFE_INSURANCE, data);
  }

  getBankAccount(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BANK_NAME_GET, data);
  }

  addGeneralInsurance(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_GENERAL_INSURANCE, data);
  }
  addFixedDeposit(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_FIXEDDEPOSIT, data);
  }
  deleteGeneralInsurance(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_GENERAL_INSURANCE, data);
  }
  getLifeInsuranceData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId).set('insuranceSubTypeId', data.insuranceSubTypeId).set('insuranceTypeId', data.insuranceTypeId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIFE_INSURANCE, httpParams);
  }
  getInsuranceCount(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.INSURANCE_COUNT_GET, httpParams);
  }
  editLifeInsuranceData(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_LIFE_INSURANCE, data);
  }
  editGeneralInsuranceData(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_GENERAL_INSURANCE, data);
  }
  getGeneralInsuranceData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId).set('insuranceSubTypeId', data.insuranceSubTypeId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_GENERAL_INSURANCE, httpParams);
  }

  getInsuranceGlobalData(data) {
    const httpParams = new HttpParams();
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_INSURANCE_GLOBAL_API, httpParams);
  }

  addLiability(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_LIABILITY, data);
  }

  editLiability(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_LIABILITY, data);
  }

  getLiabilty(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIABILITY, httpParams);
  }

  editFixedDeposit(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_FIXEDDEPOSIT, data);
  }

  getListOfFamilyByClient(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIST_FAMILY_MEMBER, httpParams);
  }

  getFixedDeposit(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_FIXEDDEPOSIT, data);
  }

  getRecurringDeposit(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_RECURING_DEPOSIT, data);
  }

  getBonds(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_BONDS, data);
  }
  geCalculatedEmi(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.CALCULATE_EMI, { request: JSON.stringify(data) });
  }

  addRecurringDeposit(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_RECURRING_DEPOSIT, data);
  }

  addBonds(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_BOND, data);
  }

  editRecurringDeposit(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_RECURRING_DEPOSIT, data);
  }

  editBonds(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_BONDS, data);
  }

  getSmallSavingSchemePPFData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_PPF, httpParams);
  }

  getSmallSavingSchemeNSCData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_NSC, httpParams);
  }

  getSmallSavingSchemeSSYData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_SSY, httpParams);
  }

  getSmallSavingSchemeKVPData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_KVP, httpParams);
  }

  getSmallSavingSchemeSCSSData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_SCSS, httpParams);
  }

  getSmallSavingSchemePOSAVINGData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_POSAVING, httpParams);
  }

  getSmallSavingSchemePORDData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId).set('requiredDate', data.requiredDate);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_PO_RD, httpParams);
  }

  getSmallSavingSchemePOTDData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_PO_TD, httpParams);
  }

  getSmallSavingSchemePOMISData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_SMALL_SAVING_SCHEME_PO_MIS, httpParams);
  }

  getRealEstate(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_REAL_ESTATE, httpParams);
  }

  getEPF_EPS(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_EPF_EPS, data);
  }

  addEPF_EPS(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_EPF_EPS, data);
  }

  editEPF_EPS(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_EPF_EPS, data);
  }

  deleteEPF_EPS(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_EPF_EPS, data);
  }

  getEPF(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_EPF, data);
  }

  addEPF(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_EPF, data);
  }

  editEPF(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_EPF, data);
  }

  getNPS(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_NPS, data);
  }

  addNPS(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_NPS, data);
  }

  editNPS(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_NPS, data);
  }

  getGrauity(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_GRATUITY, data);
  }

  addGratuity(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_GRATUITY, data);
  }

  editGratuity(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_GRATUITY, data);
  }

  getSuperannuation(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUPERANNUATION, data);
  }

  addSuperannuation(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_SUPERANNUATION, data);
  }

  editSuperannuation(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_SUPERANNUATION, data);
  }

  getEPS(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_EPS, data);
  }

  addEPS(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_EPS, data);
  }

  editEPS(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_EPS, data);
  }

  getGlobal() {
    const httpParams = new HttpParams();
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_GLOBAl, httpParams);
  }

  getOtherPayables(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.OTHER_PAYABLES, data);
  }

  addOtherPayables(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_OTHER_PAYABLES, data);
  }

  editOtherPayables(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_OTHER_PAYABLES, data);
  }

  addRealEstate(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_REAL_ESTATE, data);
  }

  editRealEstate(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_REAL_ESTATE, data);
  }

  addPPFScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_PPF_SCHEME, data);
  }

  addNSCScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_NSC_SCHEME, data);
  }

  addSSYScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_SSY_SCHEME, data);
  }

  addSCSSScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_SCSS_SCHEME, data);
  }

  addPOSAVINGScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_PO_SAVING, data);
  }

  addPORDScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_PO_RD_SCHEME, data);
  }

  getBankAccounts(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_BANK_ACCOUNTS, data);
  }

  addBankAccounts(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_BANK_ACCOUNTS, data);
  }

  editBankAcounts(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_BANK_ACCOUNTS, data);
  }

  getCashInHand(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CASH_IN_HAND, data);
  }

  addCashInHand(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_CASH_IN_HAND, data);
  }

  editCashInHand(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_CASH_IN_HAND, data);
  }

  getGold(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_GOLD, data);
  }

  addGold(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_GOLD, data);
  }

  editGold(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_GOLD, data);
  }

  getOthers(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_OTHERS, data);
  }

  addOthers(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_OTHERS, data);
  }

  editOthers(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_OTHERS, data);
  }

  editNSCData(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_NSC_SCHEME, data);
  }

  editSSYData(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_SSY_SCHEME, data);
  }

  editSCSSData(data) {
    return this, this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_SCSS_SCHEME, data);
  }

  editPOSAVINGData(data) {
    return this, this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_POSAVING_SCHEME, data);
  }

  addPOMIS(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_POMIS, data);
  }

  editPOMIS(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_POMIS, data);
  }

  editPPF(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_PPF_SCHEME, data);
  }

  addKVP(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_KVP_SCHEME, data);
  }

  editKVP(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_KVP_SCHEME, data);
  }

  editPORD(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_PORD_SCHEME, data);
  }

  addPOTD(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_POTD_SCHEME, data);
  }

  editPOTD(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_POTD_SCHEME, data);
  }

  getAssetCountGlobalData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_COUNT_GLOBAL_DATA, httpParams);
  }

  deletePPF(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_PPF_SCHEME, data);
  }

  deleteNSC(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_NSC_SCHEME, data);
  }

  deleteSSY(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_SSY_SCHEME, data);
  }

  deleteKVP(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_KVP_SCHEME, data);
  }

  deleteSCSS(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_SCSS_SCHEME, data);
  }

  deletePOSAVING(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_POSAVING_SCHEME, data);
  }

  deletePORD(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_PORD_SCHEME, data);
  }

  deletePOTD(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_POTD_SCHEME, data);
  }

  deletePOMIS(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_POMIS_SCHEME, data);
  }

  getPolicyName(data) {
    const httpParams = new HttpParams().set('policyName', data.policyName).set('insuranceSubTypeId', data.insuranceSubTypeId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_POLICY_NAME, httpParams);
  }
  getCompanyNames(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.COMPANY_LIST_GET, { query: data });
  }


  deleteInsurance(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_INSURANCE, data);
  }

  getInsuranceData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId).set('insuranceTypeId', data.insuranceTypeId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_GLOBAL_INSURANCE, data);
  }

  deleteRealEstate(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_REAL_ESTATE, data);
  }

  deleteOtherPayables(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_OTHER_PAYABLES, data);
  }

  deleteLiabilities(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_LIABILITIES, data);
  }

  deleteFixedDeposite(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_FIXED_DEPOSITE, data);
  }

  deleteRecurringDeposite(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_RECURRING_DEPOSITE, data);
  }

  deleteBond(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_BOND, data);
  }

  deleteEPF(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_EPF, data);
  }

  deleteNPS(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_NPS, data);
  }

  deleteGratuity(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_GRATUITY, data);
  }

  deleteSuperAnnuation(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_SUPERANNUATION, data);
  }

  deleteEPS(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_EPS, data);
  }

  deleteBankAccount(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_BANKACCOUNT, data);
  }

  deleteCashInHand(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_CASHINHAND, data);
  }

  deleteGold(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_GOLD, data);
  }

  deleteOther(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_OTHERS, data);
  }

  getGlobalLiabilities(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GLOBAL_LIABILITIES, data);
  }

  getAllFiles(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ALL_FILES, data);
  }

  downloadFile(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.DOWNLOAD_FILE, data);
  }

  deleteFile(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_FILE, data);
  }

  moveFiles(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.MOVE_FILES, data);
  }

  moveFolder(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.MOVE_FOLDER, data);
  }

  copyFiles(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.COPY_FILES, data);
  }

  renameFiles(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.RENAME_FILE, data);
  }

  renameFolder(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.RENAME_FOLDER, data);
  }
  sendSharebleLink(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.SEND_SHAREBLE_LINK, data);
  }
  deleteFolder(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_FOLDER, data);
  }
  deleteFolderPermnant(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_PERMANANT_FOLDER, data);
  }
  recovery(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.RECOVERY, data);
  }
  starFile(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.STAR_FILE, data);
  }

  viewActivityFile(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.VIEW_ACTIVITY_FILE, data);
  }

  viewActivityFolder(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.VIEW_ACTIVITY_FOLDER, data);
  }

  uploadFile(data) {
    // let httpParams=new HttpParams().set("advisorId",data.advisorId)
    // .set("clientId",data.clientId).set('folderId',data.folderId).set('fileName',data.fileName)
    return this.http.get(apiConfig.MAIN_URL + appConfig.UPLOAD_FILE, data);
  }
  fetchFileUpload(data){
    return this.http.get(apiConfig.MAIN_URL + appConfig.FETCH_FILE_UPLOAD_DATA, data);
  }
  fetchFileClientData(data){
    return this.http.get(apiConfig.MAIN_URL + appConfig.FETCH_CLIENT_FILE_UPLOAD, data);
  }
  getCountAllDocs(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_COUNT_DOCS, data);
  }
  clientUploadFile(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.CLIENT_UPLOAD_FILE, data);
  }

  deleteClientProof(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.DELETE_CLIENT_UPLOAD_FILE, data);
  }

  getClientProof(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CLIENT_PROOF, data);
  }

  saveClientUploadFile(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.SAVE_CLIENT_UPLOAD_FILE, data);

  }

  getClientUploadFile(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_CLIENT_UPLOAD_FILE, data, 1);

  }

  newFolder(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.NEW_FOLDER, data);
  }

  getAssetStockData(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_STOCK, data);
  }

  addAssetStocks(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_ASSET_STOCK, data);
  }

  getPortfolioList(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PORTFOLIO_LIST, data);
  }

  getScripList(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SCRIP_lIST, data);
  }

  addPortfolio(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_PORTFOLIO, data);
  }

  deleteStockData(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_STOCK, data);
  }

  editStockData(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_STOCK_PORTFOLIO, data);
  }

  addScrip(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_SCRIP, data);
  }

  editScriplevelHoldingAndTransaction(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_SCRIP_HOLDING_TRANSACTION, data);
  }
  getMutualFund(data) {

    return this.http.get(apiConfig.MAIN_URL + appConfig.MUTUAL_FUND_GET, data);
  }
  getNav(data) {

    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_NAV, data);
  }
  getReportWiseCalculations(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.REPORT_WISE_CALCULATION + '?advisorId=' + data.advisorId + '&clientId=' + data.clientId,{report:data.request});
  }
  getMfUnrealizedTransactions(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.UNREALIZED_TRANSACTION_GET, data);
  }
  getDatedReportWiseCalculations(data) {
    const obj ={
      lastDate : data.lastDate,
      report:data.reportType
    }
    return this.http.post(apiConfig.MAIN_URL + appConfig.GET_DATED_REPORT_WISE_CALCULATION+ '?advisorId=' + data.advisorId + '&clientId=' + data.clientId,obj);
  }
  capitalGainGet(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.CAPITAL_GAIN_GET, data);
  }
  getMfFolioMaster(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.FOLIO_MASTER_DETAILS, data);
  }
  getMfSipDetails(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.SIP_DETAILS, data);
  }
  searchFile(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.SEARCH_FILE, data);
  }
  getAdviceFd(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_FD, data)
  }
  getAdviceRd(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_RD, data)
  }
  getAdvicePpf(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_PPF, data)
  }
  getAdviceNsc(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_NSC, data)
  }
  getAdviceSsy(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_SSY, data)
  }
  getAdviceKvp(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_KVP, data)
  }
  getAdviceScss(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_SCSS, data)
  }
  getAdvicePoSaving(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_POSAVING, data)
  }
  getAdvicePord(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_PORD, data)
  }
  getAdvicePotd(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_POTD, data)
  }
  getAdvicePomis(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_POMIS, data)
  }
  getAdviceRealEstate(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_REALESTATE, data)
  }

  
  getAdviceEpf(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_EPF, data)
  }
  getAdviceNps(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_NPS, data)
  }
  getSchemeChoice() {
    let httpParams;
    // = new HttpParams().set('clientId', data.clientId).set("advisorId", data.advisorId).set("familyMemberId", data.familyMemberId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.SCHEME_CHOICE, httpParams)
  }

  getFilterSchemeChoice(data) {
    let httpParams = new HttpParams().set('query', data.name);
    return this.http.get(apiConfig.MAIN_URL + appConfig.SCHEME_FILTER_CHOICE, httpParams)
  }
  getAdviceGratuity(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_GRATUITY, data)
  }
  getAdviceSuperannuation(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_SUPERANNUATION, data)
  }
  getAdviceEps(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_EPS, data)
  }
  getAdviceBankAccount(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_BANKACCOUNT, data)
  }
  getAdviceCashInHand(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_CASHINHAND, data)
  }
  getAdviceGold(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_GOLD, data)
  }
  getAdviceOthers(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADVICE_ADD_OTHERS, data)
  }
  getAdviceDeploymentsData(data) {
    let httpParams = new HttpParams().set('clientId', data.clientId).set("advisorId", data.advisorId).set("familyMemberId", data.familyMemberId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.ADVICE_GET_DEPLOYMENTS, httpParams)
  }
  generateGroupId(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.GENERATE_GROUP_ID, data)
  }
  consentBypass(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.CONSENT_BYPASS_POST, data)
  }
  getAdviceConsent(data) {
    let httpParams = new HttpParams().set('adviceUuid', data);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_CONSENT, httpParams);
  }
  updateAssetConsent(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_ASSET_CONSENT, data)
  }
  sentEmailConsent(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.SENT_EMAIL_CONSENT, data)
  }
  giveAdviceOnGold(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.GIVE_ADVICE_ON_GOLD, data)
  }
  giveAdviceOnPoSavings(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.GIVE_ADVICE_ON_PO_SAVING, data)
  }
  giveAdviceOnRealEstate(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.GIVE_ADVICE_ON_REAL_ESTATE, data)
  }
  addFamilyMembers(data) {
    return this.http.postEncoded(apiConfig.MAIN_URL + appConfig.ADD_FAMILY_MEMBER, data);
  }
  getFamilyMembers(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_FAMILY_MEMBERS, data, 1);
  }
  deleteFamilyMember(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.DELETE_FAMILY_MEMBER, data);
  }
  getAddressList(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_ADDRESS_LIST, data, 1)
  }
  getDematList(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_DEMAT_LIST, data, 1)
  }
  getBankList(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_BANK_LIST, data, 1)
  }
  calculateTotalValues(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId).set('targetDate', data.targetDate);
    return this.http.get(apiConfig.MAIN_URL + appConfig.CALCULATE_TOTAL_VALUES, httpParams);
  }
  getSUmmaryList(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId).set('targetDate', data.targetDate);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUMMARY_LIST, httpParams);
  }
  getCashFlowList(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId).set('targetDate', data.targetDate);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CASHFLOW_LIST, httpParams);
  }
  getOutFlowValuesMonthWise(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId).set('targetDate', data.targetDate);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CASHFLOW_LIST, httpParams);
  }
  getStockFeeds() {
    return this.http.getAws("https://6ewakqcsma.execute-api.us-east-1.amazonaws.com/default/stockfeed");
  }
  getNiftyData() {
    return this.http.getAws("https://fzwxpcsz49.execute-api.us-east-1.amazonaws.com/default/nifty500");
  }
  getDeptData() {
    return this.http.getAws("https://qi8t9vk6pf.execute-api.us-east-1.amazonaws.com/default/debtindexfeed");
  }

  // overview - myfeed services
  getAllFeedsPortFolio(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.CALCULATE_TOTAL_VALUES, data);
  }
  getRTAFeeds(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_FEEDS_MF_DATA, data);
  }
  getDocumentsFeed(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_DOCUMENTS_FEED, data);
  }
  getRiskProfile(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_FEED_RISK_PROFILE, data);
  }
  getGlobalRiskProfile(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_GLOBAL_RISK_PROFILE, data);
  }
  getRecentTransactions(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.GET_FEED_RECENT_TRANSACTIONS, data, null);
  }
  getCashFlowFeeds(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CASHFLOW_FEEDS, data);
  }
  getCustomerFeedsProfile(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_CUSTOMER_FEEDS_PROFILE, data, null);
  }
  getTransactionTypeData(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.MUTUAL_FUND_TRANSACTION_TYPE_LIST_POST, data)
  }
  postAddTransactionMutualFund(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.MUTUAL_FUND_TRANSACTION_ADD, data);
  }
  postEditTransactionMutualFund(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.MUTUAL_FUND_TRANSACTION_EDIT, data);
  }
  postDeleteTransactionMutualFund(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.MUTUAL_FUND_TRANSACTION_DELETE, data);
  }
  getFamilyMemberListByClientId(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.FAMILY_MEMBER_LIST_GET_BY_CLIENT_ID, data);
  }
  getSchemeNameList(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.MUTUAL_FUND_SCHEME_NAME_LIST_GET, data);
  }
  postMutualFundAdd(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.MUTUAL_FUND_ADD, data);
  }
  postMutualFundEdit(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.MUTUAL_FUND_EDIT, data);
  }
  postMutualFundDelete(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.MUTUAL_FUND_DELETE, data);
  }

  updateClientProfilePic(data){
    return this.http.putEncoded(apiConfig.USER + appConfig.UPDATE_CLIENT_PROFILE_PIC, data);
  }
}

