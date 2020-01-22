import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';
import { MatStepper } from '@angular/material';
import { EnumServiceService } from '../../../../../../../services/enum-service.service';
import { AuthService } from '../../../../../../../auth-service/authService';
// import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { DatePipe } from '@angular/common';
import { UtilService } from '../../../../../../../services/util.service';


@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class CreateSubscriptionComponent implements OnInit {

  feeModeData: any;
  isFlagPayee: boolean;
  payeeSettingData: any = null;
  advisorName;
  dateToShow: any;
  subDateToShow: any;
  billEveryMsg: any;

  constructor(private enumService: EnumServiceService, public subInjectService: SubscriptionInject,
    private eventService: EventService, private fb: FormBuilder,
    private subService: SubscriptionService, public datepipe: DatePipe) {
    // this.eventService.sidebarSubscribeData.subscribe(
    //   data => this.subFeeMode = data
    // );
    this.subInjectService.event.subscribe(
      data => {
        this.isFlagPayee = data.flag;
        setTimeout(
          this.payeesData = data.data, 500
        )

      }
    )
  }

  inputData;
  @Input()
  set data(data) {
    this.totalSelectedPayeeShare = 0;
    this.getSubStartDetails(data);
  }

  get data() {
    return this.inputData;
  }

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
  totalSelectedPayeeShare = 0;
  subscriptionDetails = this.fb.group({
    subscription: [, [Validators.required]],
    activationDate: [new Date(), [Validators.required]],
    invoiceSendingMode: [1, [Validators.required]],
    feeCollectionMode: [1, [Validators.required]],
    dueDateFrequency: [5, [Validators.required]]
  });
  subscriptionDetailsStepper = this.fb.group({
    subscriptionDetailsStepper: ['', [Validators.required]]
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
    console.log(AuthService.getClientData(), "123 AuthService.getUserInfo()");

    this.advisorName = AuthService.getUserInfo().fullName;
    this.isFlagPayee = true;
    this.feeCollectionMode = this.enumService.getFeeCollectionModeData();
    console.log(this.feeCollectionMode);
  }
  getPayeeFlagData(data) {
    console.log(data)
    this.isFlagPayee = data.flag
    this.payeeSettingData = data
  }

  preventDefault(e) {
    e.preventDefault();
  }

  goForward(/*stepper: MatStepper*/) {
    if (this.stepper) {
      this.stepper.next();
    }
    if (this.stepper == undefined) {
      return;
    }
    if (this.stepper.selectedIndex == 2) {
      let date = new Date(this.subscriptionDetails.controls.activationDate.value)
      console.log(date, "sub DAte");
      (this.clientData.billingCycle == 1) ? this.billEveryMsg = "monthly" : this.billEveryMsg = "yearly";
      if (this.clientData.feeTypeId == 1) {
        if (this.clientData.billingNature == "2") {

        }
        else {
          if (this.clientData.billingMode == '1') {
            console.log("start of period")
          }
          else {
            if (this.clientData.billingCycle == 1) {
              console.log("1")
              date.setMonth(date.getMonth() + this.clientData.billEvery)
            }
            else {
              console.log("2")
              date.setFullYear(date.getFullYear() + parseInt(this.clientData.billEvery));
            }
          }
        }
      }
      else {
        if (this.clientData.billingCycle == 1) {
          console.log("1")
          date.setMonth(date.getMonth() + this.clientData.billEvery)
        }
        else {
          console.log("2")
          date.setFullYear(date.getFullYear() + parseInt(this.clientData.billEvery));
        }
      }
      this.subDateToShow = date;
    }

    console.log(this.subscriptionDetails);
  }
  getSharesInfo(data) {
    if (data) {
      this.totalSelectedPayeeShare = data.share;
      this.selectedPayee.push({
        id: data.id,
        share: data.share
      })
    }
  }
  goBack() {
    this.stepper.previous();
  }

  nextStep(data) {
    console.log(data, "clientData 123");
    this.clientData = data;
    this.goForward();
  }
  getTotalPayeeData(data) {
    this.isFlagPayee = data
  }
  getSubStartDetails(data) {
    // this.clientData = data.data;
    this.feeModeData = data;
    this.clientData = data;
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
    this.totalSelectedPayeeShare = 0;
    data.forEach(singlePayee => {
      if (singlePayee.selected == 1) {
        const obj = {
          id: singlePayee.id,
          share: singlePayee.share
        };
        this.selectedPayee.push(obj);
        this.totalSelectedPayeeShare += singlePayee.share;
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
    console.log('getSubStartDetailsResponse: ', data, feeModeData);
    this.feeModeData = feeModeData;
    this.feeStructureData = data;
    this.subscriptionDetails.controls.subscription.setValue(data.subscriptionNo);
    this.billersData = data.billers;
    this.payeesData = data.payees;
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
    this.subInjectService.changeUpperRightSliderState({ state: 'close', refreshRequired: flag });
    this.stepper.selectedIndex = 0;
    this.subscriptionDetails.reset();
  }

  startSubscription() {
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
        startsOn: UtilService.convertDateObjectToDateString(this.datepipe, this.subscriptionDetails.get('activationDate').value),
        subscriptionNumber: this.feeStructureData.subscriptionNo,
        feeMode: this.subscriptionDetails.get('invoiceSendingMode').value,
        Status: 1,
        subscriptionPricing: {
          autoRenew: 0,
          billEvery: (this.clientData.billingNature == '2') ? 0 : this.clientData.billEvery,
          billingCycle: (this.clientData.billingNature == '2') ? 0 : this.clientData.billingCycle,
          billingMode: this.clientData.billingMode,
          billingNature: (this.clientData.billingNature == '2') ? 0 : this.clientData.billingNature,
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
        data => this.startSubscriptionResponse(data)
      );
    } else {

      // const subAsset = [];
      // this.clientData.subscriptionAssetPricingList[2].otherAssets.forEach(element => {
      //   subAsset.push(element.subAssetClassId);
      // });
      // const selectedPayee = [];
      // this.clientData;
      const obj = {
        id: this.clientData.subId,
        advisorId: this.advisorId,

        billerProfileId: this.selectedBiller.id,
        clientBillerProfiles: this.selectedPayee,
        clientId: this.clientData.clientId,
        dueDateFrequency: this.subscriptionDetails.get('dueDateFrequency').value,
        startsOn: UtilService.convertDateObjectToDateString(this.datepipe, this.subscriptionDetails.get('activationDate').value),
        subscriptionNumber: this.feeStructureData.subscriptionNo,
        feeMode: this.subscriptionDetails.get('invoiceSendingMode').value,
        Status: 1,
        subscriptionPricing: {
          autoRenew: 0,
          billEvery: this.clientData.billEvery,
          billingCycle: this.clientData.billingCycle,
          billingMode: this.clientData.billingMode,
          billingNature: this.clientData.billingNature,
          feeTypeId: this.clientData.feeTypeId,
          id: 0,
          subscriptionAssetPricingList: [
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
              subAssetIds: this.clientData.subscriptionAssetPricingList[2].subAssetIds,
              pricing: this.clientData.subscriptionAssetPricingList[2].pricing
            }
          ]
        }
      };
      console.log(obj, 'start subscription');
      this.subService.startSubscription(obj).subscribe(
        data => this.startSubscriptionResponse(data)
      );
    }
  }

  startSubscriptionResponse(data) {
    console.log(data);
    this.Close(true);
  }
}
