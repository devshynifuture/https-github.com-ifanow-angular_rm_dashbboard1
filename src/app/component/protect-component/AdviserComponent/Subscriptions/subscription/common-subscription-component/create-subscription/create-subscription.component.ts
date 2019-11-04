import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {MatStepper} from '@angular/material';
import {EnumServiceService} from '../../enum-service.service';
import * as _ from 'lodash';
import {AuthService} from '../../../../../../../auth-service/authService';
// import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
// import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';

// const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: {month: 'short', year: 'numeric', day: 'numeric'},
  },
  display: {
    dateInput: 'input',
    monthYearLabel: {year: 'numeric', month: 'numeric'},
    dateA11yLabel: {
      year: 'numeric', month: 'long', day: 'numeric'
    },
    monthYearA11yLabel: {year: 'numeric', month: 'long'},
  }
};
export const MY_FORMATS2 = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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

  constructor(private enumService: EnumServiceService, public subInjectService: SubscriptionInject,
              private eventService: EventService, private fb: FormBuilder, private subService: SubscriptionService) {
    // this.subInjectService.singleProfileData.subscribe(
    //   data => this.getSubStartDetails(data)
    // );
    this.eventService.sidebarSubscribeData.subscribe(
      data => this.subFeeMode = data
    );
    // this.subInjectService.ta
  }

  inputData;

  @Input()
  set data(data) {
    this.inputData = data;
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
    activationDate: [, [Validators.required]],
    invoiceSendingMode: [1, [Validators.required]],
    feeCollectionMode: [, [Validators.required]],
    dueDateFrequency: [, [Validators.required]]
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

  getSubStartDetails(data) {
    this.clientData = data.obj;
    console.log('client Data: ', this.clientData);
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
    const obj = {
      id: data.id,
      share: data.share
    };
    this.selectedPayee.push(obj);
  }

  matSliderValue() {
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
        startsOn: this.subscriptionDetails.get('activationDate').value,
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
      );
    }
  }

  startSubscsriptionResponse(data) {
    console.log(data);

  }
}
