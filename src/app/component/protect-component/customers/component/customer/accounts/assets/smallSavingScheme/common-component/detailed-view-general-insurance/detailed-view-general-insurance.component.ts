import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-view-general-insurance',
  templateUrl: './detailed-view-general-insurance.component.html',
  styleUrls: ['./detailed-view-general-insurance.component.scss']
})
export class DetailedViewGeneralInsuranceComponent implements OnInit {
  _data: any;
  generalData: any;
  nominee: any;
  displayList: any;
  allInsurance: any;
  showInsurance: any;
  insuranceSubTypeId: any;

  constructor(private subInjectService:SubscriptionInject) { }
  @Input()
  set data(inputData) {
    this._data = inputData.data;
    this.allInsurance=inputData.allInsurance;
    this.insuranceSubTypeId=inputData.insuranceSubTypeId;
    console.log('AddLiabilitiesComponent Input data : ', this._data);
    this.displayList = inputData.displayList;
    // this.generalData = this._data.data
    this.nominee = this._data.nominees;
    // this.owners = this._data.realEstateOwners.filter(element => element.ownerName != this.realEstate.ownerName);

  }

  get data() {
    return this._data;
  }
  ngOnInit() {
    this._data.addOns = this.filter(this._data.addOns,this.displayList.addOns,'id','addOnId','add_on');
    this._data.policyFeatures = this.filter(this._data.policyFeatures,this.displayList.policyFeature,'id','policyFeatureId','type')
    this.allInsurance.forEach(element => {
      if (element.id == this.insuranceSubTypeId) {
        this.showInsurance = element.name;
      } else if (this.insuranceSubTypeId == 0) {
        this.showInsurance = 'General';
      }
    });

  }
  filter(filter1,filter2,key,key2,key3){
    if(filter1.length > 0){
      filter2.forEach(element => {
        filter1.forEach(ele => {
          if(element[key] == ele[key2]){
            ele[key3] = element[key3];
          }
        });
      });
    }
    return filter1;
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
