import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnumServiceService {
  roleList:any = [];
  bankList:any = [];
  proofTypeList:any = [];
  constructor() {
  }

  private globalEnumData = {
    otherAssetTypes: [],
    feeCollectionMode: [],
  };

 

  public addToGlobalEnumData(data) {
    console.log(data, "check data variable fee 2");

    Object.assign(this.globalEnumData, data);
  }

  getOtherAssetData() {
    console.log(this.globalEnumData.otherAssetTypes, "check data variable fee 1");
    
    return this.globalEnumData.otherAssetTypes;
  }

  getFeeCollectionModeData() {
    return this.globalEnumData.feeCollectionMode;
  }

  public addRoles(data){
    this.roleList = data;
  }

  public getRoles(){
    return this.roleList;
  }

  public proofType(data){
    this.proofTypeList = data;
  }

  public getProofType(){
    return this.proofTypeList;
  }
  public addBank(data){
    this.bankList = data;
  }

  public getBank(){
    return this.bankList;
  }
}
