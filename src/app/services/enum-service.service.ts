import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnumServiceService {

  constructor() {
  }

  private globalEnumData = {
    otherAssetTypes: [],
    feeCollectionMode: []
  };

  public addToGlobalEnumData(data) {
    // obj.forEach(element =>
    //   {
    //     element.selected=false;
    //   })
    // _.merge(this.globalEnumData, data);
    /*this.globalEnumData =*/
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
}
