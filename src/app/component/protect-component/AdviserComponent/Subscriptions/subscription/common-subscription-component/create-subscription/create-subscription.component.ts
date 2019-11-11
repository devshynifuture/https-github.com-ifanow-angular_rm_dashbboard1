import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {MatStepper} from '@angular/material';
import {EnumServiceService} from '../../../../../../../services/enum-service.service';
import * as _ from 'lodash';
import {AuthService} from '../../../../../../../auth-service/authService';
// import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MY_FORMATS2} from 'src/app/constants/date-format.constant';

@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2},
  ],
})
export class CreateSubscriptionComponent implements OnInit {
  @Input() subFeeMode;
  feeModeData: any;

  constructor(private enumService: EnumServiceService, public subInjectService: SubscriptionInject,
              private eventService: EventService, private fb: FormBuilder, private subService: SubscriptionService) {
    this.eventService.sidebarSubscribeData.subscribe(
      data => this.subFeeMode = data
    );
  }

  inputData;

  @Input()
  set data(data) {
    this.getSubStartDetails(data);
  }

  get data() {
    return this.inputData;
  }

  @ViewChild('stepper', {static: false}) stepper: MatStepper;
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
    activationDate: [new Date(), [Validators.required]],
    invoiceSendingMode: [1, [Validators.required]],
    feeCollectionMode: [1, [Validators.required]],
    dueDateFrequency: [5, [Validators.required]]
  });
  subscriptionDetailsStepper = this.fb.group({
    subscriptionDetailsStepper: [, [Validators.required]]
  });
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
    if (this.stepper) {
      this.stepper.next();
    }
    console.log(this.subscriptionDetails);
  }

  nextStep(data) {
    console.log(data);
    this.clientData = data;
    this.goForward();
  }

  getSubStartDetails(data) {
    // this.clientData = data.data;
    this.feeModeData = data;
    console.log('client Data: ', this.clientData);
    if (data.data.subscriptionPricing) {
      this.advisorId = AuthService.getAdvisorId();
      const obj = {
        // advisorId: 2808,
        advisorId: this.advisorId,
        clientId: data.data.clientId,
        subId: data.data.id
      };
      this.subService.getSubscriptionStartData(obj).subscribe(
        subStartData => this.getSubStartDetailsResponse(subStartData, data)
      );
    } else {
      // this.feeModeData=data
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
      // (data.selected === 1) ? this.unselectPayee(data) : this.selectPayee(data);
    }
  }

  selectPayee(data) {
    console.log('selectPayee getSubStartDetailsResponse: ', data);

    this.selectedPayee = [];
    data.forEach(singlePayee => {
      if (singlePayee.selected == 1) {
        const obj = {
          id: data.id,
          share: data.share
        };
        this.selectedPayee.push(obj);
      }
    });
    /*data.selected = 1;
    const obj = {
      id: data.id,
      share: data.share
    };
    this.selectedPayee.push(obj);*/
  }


  getSubStartDetailsResponse(data, feeModeData) {
    console.log('getSubStartDetailsResponse: ', data);
    this.feeModeData = feeModeData;
    this.feeStructureData = data;
    this.subscriptionDetails.controls.subscription.setValue(data.subscriptionNo);
    this.billersData = data.billers;
    this.payeesData = data.payees;
  }

  Close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
    this.subInjectService.changeUpperRightSliderState({state: 'close'});
    this.stepper.selectedIndex = 0;
    this.subscriptionDetails.reset();
  }

  startSubscsription() {
    console.log('payee', this.selectedPayee);
    console.log('biller', this.selectedBiller);
    console.log('subscription', this.subscriptionDetails);
    console.log('client', this.clientData);
    if (this.clientData.feeTypeId == 1) {
      const obj = {
        id: this.clientData.subId,
        advisorId: this.advisorId,
        billerProfileId: this.selectedBiller.id,
        clientBillerProfiles: this.selectedPayee,
        clientId: this.clientData.clientId,
        dueDateFrequency: this.subscriptionDetails.get('dueDateFrequency').value,
        startsOn: this.subscriptionDetails.get('activationDate').value._d,
        fromDate: '2019-10-16',
        subscriptionNumber: this.feeStructureData.subscriptionNo,
        feeMode: this.subscriptionDetails.get('invoiceSendingMode').value,
        Status: 1,
        subscriptionPricing: {
          autoRenew: 0,
          billEvery: this.clientData.billEvery,
          billingCycle: 1,
          billingMode: this.clientData.billingMode,
          billingNature: this.clientData.billingNature,
          feeTypeId: this.clientData.feeTypeId,
          subscriptionAssetPricingList: [
            {
              assetClassId: 1,
              pricing: this.clientData.subscriptionAssetPricingList[0].pricing
            }
          ]
        }
      };
      console.log(obj, 'start subscription');
      this.subService.startSubscription(obj).subscribe(
        data => this.startSubscsriptionResponse(data)
      );
    } else {

      const subAsset = [];
      this.clientData.subscriptionAssetPricingList[2].otherAssets.forEach(element => {
        subAsset.push(element.subAssetClassId);
      });
      const selectedPayee = [];
      this.clientData;
      const obj = {
        id: this.clientData.subId,
        advisorId: this.advisorId,

        billerProfileId: this.selectedBiller.id,
        clientBillerProfiles: this.selectedPayee,
        clientId: this.clientData.clientId,
        dueDateFrequency: this.subscriptionDetails.get('dueDateFrequency').value,
        startsOn: this.subscriptionDetails.get('activationDate').value._d,
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
      );
    }
  }

  startSubscsriptionResponse(data) {
    console.log(data);

  }
}
