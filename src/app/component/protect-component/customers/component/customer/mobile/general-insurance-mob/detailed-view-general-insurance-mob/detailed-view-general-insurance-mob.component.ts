import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { CustomerService } from '../../../customer.service';

@Component({
  selector: 'app-detailed-view-general-insurance-mob',
  templateUrl: './detailed-view-general-insurance-mob.component.html',
  styleUrls: ['./detailed-view-general-insurance-mob.component.scss']
})
export class DetailedViewGeneralInsuranceMobComponent implements OnInit {
  _data: any;
  insuranceSubTypeId: any;
  displayList: any;
  nominee: any;
  bankList: any;
  showInsurance: any;
  bankAccountDetails: { accountList: string; controleData: string; };
  allInsurance = [{ name: 'Term', id: 1 }, { name: 'Traditional', id: 2 }, { name: 'ULIP', id: 3 }, {
    name: 'Health',
    id: 5
  }, { name: 'Personal accident', id: 7 }, { name: 'Critical illness', id: 6 }, {
    name: 'Motor',
    id: 4
  }, { name: 'Travel', id: 8 }, { name: 'Home', id: 9 }, { name: 'Fire & special perils', id: 10 }];
  @Output() outputValue = new EventEmitter<any>();

  @Input()
  set data(inputData) {
    this.getGlobalDataInsurance();
    this._data = inputData;
    this.insuranceSubTypeId = inputData.insuranceSubTypeId;
    console.log('AddLiabilitiesComponent Input data : ', this._data);
    // this.displayList = inputData.displayList;
    // this.generalData = this._data.data
    this.nominee = this._data.nominees;
    // this.owners = this._data.realEstateOwners.filter(element => element.ownerName != this.realEstate.ownerName);

  }

  get data() {
    return this._data;
  }
  constructor(private subInjectService: SubscriptionInject,
    private enumService: EnumServiceService,private cusService : CustomerService) { }

  bankAccountList(value) {
    this.bankList = value;
    this.bankList.forEach(element => {
      if (element.id == this._data.linkedBankAccount) {
        this._data.bankName = element.bankName;
      }
    });
  }
  getGlobalDataInsurance() {
    const obj = {};
    this.cusService.getInsuranceGlobalData(obj).subscribe(
      data => {
        console.log(data),
          this.displayList = data;
          this.displayList.policyTypes.forEach(ele => {
            if (this._data.policyTypeId) {
              if (ele.id == this._data.policyTypeId) {
                this._data.policyType = ele.policy_type;
              }
            } 

          });
          this.getData();
      }
    );
  }
  getData(){
    this.bankAccountDetails = {accountList: '', controleData: ''};
    this._data.addOns = this.filter(this._data.addOns, this.displayList.addOns, 'id', 'addOnId', 'add_on');
    this._data.policyFeatures = this.filter(this._data.policyFeatures, this.displayList.policyFeature, 'id', 'policyFeatureId', 'type');
    // this._data.policyTypes = this.filter(this._data.policyTypes,this.displayList.policyFeature,'id','policyFeatureId','type')
    this.allInsurance.forEach(element => {
      if (element.id == this._data.insuranceSubTypeId) {
        this.showInsurance = element.name;
      }
    });
    this.bankAccountList(this.enumService.getBank());


    // this.displayList.policyTypes.forEach(ele => {
    //   if (this._data.policyTypeId) {
    //     if (ele.id == this._data.policyTypeId) {
    //       this._data.policyType = ele.policy_type
    //     }
    //   }

    // });
  }
  ngOnInit() {
   
  }

  filter(filter1, filter2, key, key2, key3) {
    if (filter1.length > 0) {
      filter2.forEach(element => {
        filter1.forEach(ele => {
          if (element[key] == ele[key2]) {
            ele[key3] = element[key3];
          }
        });
      });
    }
    return filter1;
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
  changeValue(flag){
    this.outputValue.emit(flag);
  }

}
