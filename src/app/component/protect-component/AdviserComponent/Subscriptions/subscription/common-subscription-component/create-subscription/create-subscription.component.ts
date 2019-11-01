import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';
import { MatStepper } from '@angular/material';
import { EnumServiceService } from '../../enum-service.service';
import * as _ from 'lodash';
import { AuthService } from "../../../../../../../auth-service/authService";
import { element } from 'protractor';


@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.scss']
})
export class CreateSubscriptionComponent implements OnInit {
  constructor(private enumService: EnumServiceService, public subInjectService: SubscriptionInject,
    private eventService: EventService, private fb: FormBuilder, private subService: SubscriptionService) {
    this.subInjectService.singleProfileData.subscribe(
      data => this.getSubStartDetails(data)
    );
  }

  @Input() modifyFeeTabChange;

  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  feeStructureData;
  clientData;
  feeMode;
  billersData;
  payeesData;
  feeCollectionMode;
  feeStructureFormData;
  selectedBiller;
  selectedPayee = [];
  subscriptionDetails = this.fb.group({
    subscription: [, [Validators.required]],
    activationDate: [, [Validators.required]],
    invoiceSendingMode: [1, [Validators.required]],
    feeCollectionMode: [, [Validators.required]],
    dueDateFrequency: [, [Validators.required]]
  });
  subscriptionDetailsStepper=this.fb.group({
    subscriptionDetailsStepper:[,[Validators.required]]
  })
  feeStructureForm = this.fb.group({
    feeStructure: ['', [Validators.required]]
  });
  billerSetting = this.fb.group({
    billerSetting: ['', [Validators.required]]
  });
  payeeSetting = this.fb.group({
    payeeSetting: ['', [Validators.required]]
  });
  create = this.fb.group({
    create: ['', [Validators.required]]
  });
  feeStructure = this.fb.group({});
  advisorId;

  ngOnInit() {

    // this.stepper.selectedIndex = 0;
    this.feeCollectionMode = this.enumService.getFeeCollectionModeData();
    console.log(this.feeCollectionMode);
  }

  goForward(/*stepper: MatStepper*/) {
    this.stepper.next();
    console.log(this.subscriptionDetails)
  }

  getSubStartDetails(data) {
    this.clientData = data;
    console.log(this.clientData, 'client Data');
    if (data.subscriptionPricing) {
      this.advisorId = AuthService.getAdvisorId();
      const obj = {
        // advisorId: 2808,
        advisorId: this.advisorId,
        clientId: data.clientId,
        subId: data.id
      };
      this.subService.getSubscriptionStartData(obj).subscribe(
        subStartData => this.getSubStartDetailsResponse(subStartData)
      );
    } else {
      this.feeStructureFormData = data;
      this.goForward();
      console.log(this.feeStructureFormData, 'feeStructureData');
    }


  }

  select(value, data) {
    if (value === 'biller') {
      this.selectedBiller = data;
      this.billersData.forEach(element => {
        (element.id === data.id) ? element.selected = true : element.selected = false;
      });
    } else {
      (data.selected === 1) ? this.unselectPayee(data) : this.selectPayee(data);
    }
  }

  selectPayee(data) {
    data.selected = 1;
    let obj = {
      id: data.id,
      share: data.share
    }
    this.selectedPayee.push(obj);
  }
  matSliderValue()
  {
    return;
  }
  unselectPayee(data) {
    if (this.selectedPayee.length === 0) {
      return;
    } else {
      data.selected = 0;
      _.remove(this.selectedPayee, delData => {
        return delData.id === data.id;
      });
    }
  }

  getSubStartDetailsResponse(data) {
    console.log(data);
    (this.clientData.subscriptionPricing.feeTypeId == 1) ? data.feeModeName = 'feeModify' : data.feeModeName = "variableModify"
    this.feeStructureData = data;
    this.subscriptionDetails.controls.subscription.setValue(data.subscriptionNo);
    this.billersData = data.billers;
    this.payeesData = data.payees;
  }

  Close(state) {
    this.subInjectService.rightSideData(state);
    this.subInjectService.rightSliderData(state);
    this.stepper.selectedIndex = 0;
    this.subscriptionDetails.reset();
  }

  startSubscsription() {
    console.log("payee", this.selectedPayee)
    console.log("biller", this.selectedBiller)
    console.log("subscription", this.subscriptionDetails)
    console.log("client", this.clientData)
    if (this.clientData.feeTypeId == 1) {
      const obj = {
        "id": this.clientData.subId,
        "advisorId": this.advisorId,
        "billerProfileId": this.selectedBiller.id,
        "clientBillerProfiles": this.selectedPayee,
        "clientId": this.clientData.clientId,
        "dueDateFrequency": this.subscriptionDetails.get('dueDateFrequency').value,
        "startsOn": this.subscriptionDetails.get('activationDate').value,
        "fromDate": "2019-10-16",
        "subscriptionNumber": this.feeStructureData.subscriptionNo,
        "feeMode": this.subscriptionDetails.get('invoiceSendingMode').value,
        "Status": 1,
        "subscriptionPricing": {
          "autoRenew": 0,
          "billEvery": this.clientData.billEvery,
          "billingCycle": 1,
          "billingMode": this.clientData.billingMode,
          "billingNature": this.clientData.billingNature,
          "feeTypeId": this.clientData.feeTypeId,
          "subscriptionAssetPricingList": [
            {
              "assetClassId": 1,
              "pricing": this.clientData.subscriptionAssetPricingList[0].pricing
            }
          ]
        }
      }
      console.log(obj, 'start subscription');
      this.subService.startSubscription(obj).subscribe(
        data => this.startSubscsriptionResponse(data)
      )
    }
    else {

      let subAsset = []
      this.clientData.subscriptionAssetPricingList[2].otherAssets.forEach(element => {
        subAsset.push(element.subAssetClassId)
      })
      let selectedPayee = []
      this.clientData
      const obj = {
        id: this.clientData.subId,
        advisorId: this.advisorId,

        billerProfileId: this.selectedBiller.id,
        clientBillerProfiles: this.selectedPayee,
        clientId: this.clientData.clientId,
        dueDateFrequency: this.subscriptionDetails.get('dueDateFrequency').value,
        startsOn: this.subscriptionDetails.get('activationDate').value,
        fromDate: '2019-10-16T13:54:25.983Z',
        subscriptionNumber: this.feeStructureData.subscriptionNo,
        feeMode: this.subscriptionDetails.get('invoiceSendingMode').value,
        Status: 1,
        subscriptionPricing: {
          autoRenew: 0,
          billEvery: this.clientData.billEvery,
          billingCycle: 0,
          billingMode: this.clientData.billingMode,
          billingNature: this.clientData.billingNature,
          feeTypeId: this.clientData.feeTypeId,
          id: 0,
          pricingList: [
            {
              directRegular: 1,
              assetClassId: 1,
              debtAllocation: this.clientData.subscriptionAssetPricingList[0].debtAllocation,
              equityAllocation: this.clientData.subscriptionAssetPricingList[0].equityAllocation,
              liquidAllocation: this.clientData.subscriptionAssetPricingList[0].liquidAllocation,
            }, {
              directRegular: 2,
              assetClassId: 1,
              debtAllocation: this.clientData.subscriptionAssetPricingList[1].debtAllocation,
              equityAllocation: this.clientData.subscriptionAssetPricingList[1].equityAllocation,
              liquidAllocation: this.clientData.subscriptionAssetPricingList[1].liquidAllocation,
            },
            {
              assetClassId: 2,
              subAssetIds: subAsset,
              pricing: this.clientData.subscriptionAssetPricingList[2].pricing
            }
          ]
        }
      };
      console.log(obj, 'start subscription');
      this.subService.startSubscription(obj).subscribe(
        data => this.startSubscsriptionResponse(data)
      )
    }
  }
  startSubscsriptionResponse(data) {
    console.log(data)

  }
}
