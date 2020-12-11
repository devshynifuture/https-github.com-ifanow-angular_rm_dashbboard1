import { Component, OnInit, Input } from '@angular/core';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-view-insurance-planning',
  templateUrl: './detailed-view-insurance-planning.component.html',
  styleUrls: ['./detailed-view-insurance-planning.component.scss']
})
export class DetailedViewInsurancePlanningComponent implements OnInit {
  _data: any;
  nominee: any;
  cashFlowList: any;
  insuranceSubTypeId: any;
  showInsurance: any;
  bankList: any;
  displayList: any;

  constructor(private enumService: EnumServiceService, private subInjectService: SubscriptionInject) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData.data;
    this.insuranceSubTypeId = inputData.data.insuranceSubTypeId;
    this.showInsurance = inputData.showInsurance
    this.displayList = inputData.displayList;
    // this.owners = this._data.realEstateOwners.filter(element => element.ownerName != this.realEstate.ownerName);

  }

  get data() {
    return this._data;
  }

  ngOnInit() {
    this.bankList = this.enumService.getBank();
    this.bankList.forEach(element => {
      if (element.id == this._data.insurance.linkedBankAccountId) {
        this._data.insurance.bankName = element.bankName;
      }
    });

    this.displayList.policyTypes.forEach(ele => {
      if (this._data.insurance.policyTypeId) {
        if (ele.id == this._data.insurance.policyTypeId) {
          this._data.insurance.policyType = ele.policy_type
        }
      }

    });
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

}
