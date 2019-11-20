import {Injectable} from '@angular/core';
import {UtilService} from './util.service';
import {SubscriptionService} from '../component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import {EnumServiceService} from './enum-service.service';

@Injectable({
  providedIn: 'root'
})
export class EnumDataService {

  constructor(private enumService: EnumServiceService, private subService: SubscriptionService) {
  }

  public getDataForSubscriptionEnumService() {
    const obj = {};
    console.log('getOtherAssetData EnumDataService getDataForSubscriptionEnumService ', this.enumService.getOtherAssetData());
    this.subService.getDataForCreateService(obj).subscribe(
      data => {
        console.log('data getDataForCreateService ', data);
        const newJsonForConsumption = {
          billingMode: [],
          assetTypes: [],
          feeTypes: [],
          billingNature: [],
          otherAssetTypes: [],
          feeCollectionMode: []
        };
        newJsonForConsumption.billingNature = UtilService.convertObjectToArray(data.billingNature);
        newJsonForConsumption.otherAssetTypes = UtilService.convertObjectToCustomArray(data.otherAssetTypes,
          'subAssetClassName', 'subAssetClassId');
        newJsonForConsumption.feeTypes = UtilService.convertObjectToArray(data.feeTypes);
        newJsonForConsumption.assetTypes = UtilService.convertObjectToArray(data.assetTypes);
        newJsonForConsumption.billingMode = UtilService.convertObjectToArray(data.billingMode);
        newJsonForConsumption.feeCollectionMode = UtilService.convertObjectToArray(data.paymentModes);
        console.log('data newJsonForConsumption ', newJsonForConsumption);

        this.enumService.addToGlobalEnumData(newJsonForConsumption);
        console.log(' post getOtherAssetData EnumDataService getDataForSubscriptionEnumService ', this.enumService.getOtherAssetData());

      }
    );
  }
}
