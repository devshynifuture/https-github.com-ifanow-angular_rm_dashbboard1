import { Injectable } from '@angular/core';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class EnumServiceService {
  roleList: any = [];
  bankList: any = [];
  clientRoleList: any = [];
  proofTypeList: any = [];

  constructor() {
  }

  private globalEnumData = {
    otherAssetTypes: [],
    feeCollectionMode: [],
    taxStatusMap: {},
    corporateTaxList: [],
    individualTaxList: [],
    minorTaxList: [],
  };


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

  public addBank(data) {
    this.bankList = data;
  }

  public getBank() {
    return this.bankList;
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
    minorTaxData = this.globalEnumData.minorTaxList.filter(element => element.taxStatusCode == taxStatusId)
    corporateTaxData = this.globalEnumData.corporateTaxList.filter(element => element.taxStatusCode == taxStatusId)
    return (individualTaxData.length > 0) ? individualTaxData : (minorTaxData.length > 0) ? minorTaxData : corporateTaxData;
  }
}
