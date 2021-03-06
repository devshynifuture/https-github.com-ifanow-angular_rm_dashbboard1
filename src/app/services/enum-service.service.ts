import { Injectable } from '@angular/core';
import { element } from 'protractor';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnumServiceService {
  roleList: any = [];
  bankList: any = [];
  bankDematList: any = [];
  clientFamilybankList = [];
  clientViewbankList = new Subject();
  bankAC = new Subject();
  dematAC = new Subject();
  clientRoleList: any = [];
  proofTypeList: any = [];
  const;
  realEstateTypeList = [];

  constructor() {
  }

  private globalEnumData = {
    otherAssetTypes: [],
    feeCollectionMode: [],
    taxStatusList: [],
    taxStatusMap: {},
    corporateTaxList: [],
    individualTaxList: [],
    minorTaxList: [],
  };

  private cashflowAssetNaming: any[] = []

  setAssetShortForms(data) {
    this.cashflowAssetNaming = data;
  }

  getAssetNamings() {
    return this.cashflowAssetNaming;
  }

  public addToGlobalEnumData(data) {
    console.log(data, 'check data variable fee 2');
    Object.assign(this.globalEnumData, data);
  }

  getOtherAssetData() {
    console.log(this.globalEnumData.otherAssetTypes, 'check data variable fee 1');
    return this.globalEnumData.otherAssetTypes;
  }

  getFeeCollectionModeData() {
    return this.globalEnumData.feeCollectionMode;
  }

  getTaxStatus() {
    return this.globalEnumData.taxStatusMap;
  }

  getCorporateTaxList() {
    return this.globalEnumData.corporateTaxList;
  }

  //
  getTaxStatusList() {
    return this.globalEnumData.taxStatusList;
  }

  getMinorTaxList() {
    return this.globalEnumData.minorTaxList;
  }

  getIndividualTaxList() {
    return this.globalEnumData.individualTaxList;
  }

  public addRoles(data) {
    this.roleList = data;
  }

  public getRoles() {
    return this.roleList;
  }

  public proofType(data) {
    this.proofTypeList = data;
  }

  public getProofType() {
    return this.proofTypeList;
  }

  bondSeriesList: any;
  public getbondSeriesList() {
    return this.bondSeriesList;
  }
  public addBank(data) {
    this.bankList = data;
    this.bankAC.next([...data]);
  }

  public addDematBank(data) {
    this.bankDematList = data;
    this.dematAC.next([...data]);

  }

  public addclientFamilyBanks(data) {

    this.clientFamilybankList = data;
    this.clientViewbankList.next([...data]);
  }



  familyList: any;

  public getFamilyList(data) {
    this.familyList = data;
  }

  public FamilyList() {
    return this.familyList;
  }

  public getBank() {
    return this.bankList;
  }

  public getDematBank() {
    return this.bankDematList;
  }

  getclientFamilybankList() {
    return this.clientFamilybankList
  }

  getBankAC() {
    return this.bankAC.asObservable();
  }

  getDenatAC() {
    return this.dematAC.asObservable();
  }

  getclientViewbankList() {
    return this.clientViewbankList.asObservable();
  }

  public addClientRole(data) {
    this.clientRoleList = data;

  }

  public getClientRole() {
    return this.clientRoleList;
  }

  public filterTaxStatusList(taxStatusId) {
    let individualTaxData, minorTaxData, corporateTaxData;
    individualTaxData = this.globalEnumData.individualTaxList.filter(element => element.taxStatusCode == taxStatusId);
    minorTaxData = this.globalEnumData.minorTaxList.filter(element => element.taxStatusCode == taxStatusId);
    corporateTaxData = this.globalEnumData.corporateTaxList.filter(element => element.taxStatusCode == taxStatusId);
    return (individualTaxData.length > 0) ? individualTaxData : (minorTaxData.length > 0) ? minorTaxData : corporateTaxData;
  }

  getRealEstateType() {
    if (this.realEstateTypeList.length == 0) {
      this.realEstateTypeList.push({ value: '0', name: 'Self Occupied property' });
      this.realEstateTypeList.push({ value: '1', name: 'Let out property' });
      this.realEstateTypeList.push({ value: '2', name: 'Commercial property' });
      this.realEstateTypeList.push({ value: '3', name: 'Agricultural land' });
      this.realEstateTypeList.push({ value: '4', name: 'Non agricultural land' });
    }
    return this.realEstateTypeList;
  }

  getRealEstateTypeStringFromValue(value) {
    let name = '';
    this.getRealEstateType().forEach(singleType => {
      if (singleType.value == value) {
        name = singleType.name;
      }
    });
    return name;
  }
}
