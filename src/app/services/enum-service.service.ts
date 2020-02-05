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
    Object.assign(this.globalEnumData, data);
  }

  getOtherAssetData() {
    return this.globalEnumData.otherAssetTypes;
  }

  getFeeCollectionModeData() {
    return this.globalEnumData.feeCollectionMode;
  }
}
