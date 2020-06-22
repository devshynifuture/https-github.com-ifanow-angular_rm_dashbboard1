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
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { BillerProfileAdvisorComponent } from '../biller-profile-advisor/biller-profile-advisor.component';


@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class CreateSubscriptionComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'CREATE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  }


  feeModeData: any;
  isFlagPayee: boolean = false;
  payeeSettingData: any = null;
  advisorName;
  dateToShow: any;
  subDateToShow: any;
  billEveryMsg: any;
  serviceData: any;


  constructor(private enumService: EnumServiceService, public subInjectService: SubscriptionInject,
    private eventService: EventService, private fb: FormBuilder,
    private subService: SubscriptionService, public datepipe: DatePipe) {
    // this.eventService.sidebarSubscribeData.subscribe(
    //   data => this.subFeeMode = data
    // );
    // this.subInjectService.event.subscribe(
    //   data => {
    //     this.isFlagPayee = data.flag;
    //     setTimeout(
    //       this.payeesData = data.data, 500
    //     )

    //   }
    // )
  }

  inputData;
  @Input()
  set data(data) {
    this.payeeSettingData = data
    this.totalSelectedPayeeShare = 0;
    this.getSubStartDetails(data);
  }

  get data() {
    return this.inputData;
  }

  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  stepper2: MatStepper
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
    this.advisorName = AuthService.getUserInfo().fullName;
    // this.isFlagPayee = true;
    this.feeCollectionMode = this.enumService.getFeeCollectionModeData();
  }
  getPayeeFlagData(data) {
    this.isFlagPayee = data
    if (!data) {
      setTimeout(() => {
        this.stepper.selectedIndex = 3;
        this.getSubStartDetails(this.payeeSettingData);
      }, 1);
    }
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
      let date = new Date(this.subscriptionDetails.controls.activationDate.value);
      let month, year;
      month = date.getMonth();
      year = date.getFullYear();
      if (this.serviceData.feeTypeId == 1) {
        if (this.serviceData.billingNature == "2") {
          this.billEveryMsg = "yearly";
        }
        else {
          (this.serviceData.billEvery == 1) ? this.billEveryMsg = "Monthly" : (this.serviceData.billEvery == '3') ? this.billEveryMsg = "Quarterly" : (this.serviceData.billEvery == 6) ? this.billEveryMsg = "Half-yearly" : this.billEveryMsg = "Yearly";
          if (this.serviceData.billingMode == 2) {
            date.setMonth(month + parseInt(this.serviceData.billEvery))
          }
        }
      }
      else {
        (this.serviceData.billEvery == 1) ? this.billEveryMsg = "Monthly" : (this.serviceData.billEvery == '3') ? this.billEveryMsg = "Quarterly" : (this.serviceData.billEvery == 6) ? this.billEveryMsg = "Half-yearly" : this.billEveryMsg = "Yearly";
        if (this.serviceData.billingMode == 2) {
          date.setMonth(month + parseInt(this.serviceData.billEvery))
        }
      }
      this.subDateToShow = date;
    }
    if (this.stepper.selectedIndex == 3) {
      if (!this.selectedBiller) {
        this.eventService.openSnackBar('Please select biller profie', 'OK');
        this.stepper.selectedIndex = 2
      }
    }
    if (this.stepper.selectedIndex == 4) {
      if (this.totalSelectedPayeeShare != 100) {
        this.eventService.openSnackBar('Total spliting ratio of selected payee should be equal to 100%', 'Dismiss')
        this.stepper.selectedIndex = 3
      }
    }
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
    this.serviceData = data;
    this.goForward();
  }
  // getTotalPayeeData(data) {
  //   this.isFlagPayee = data
  // }
  getSubStartDetails(data) {
    // this.clientData = data.data;
    this.feeModeData = data;
    this.clientData = data;
    if (data.subscriptionPricing) {
      this.advisorId = AuthService.getAdvisorId();
      const obj = {
        // advisorId: 2808,
        advisorId: this.advisorId,
        clientId: data.clientId,
        subId: !data.id ? data.subscriptionPricing.id : data.id
      };
      this.subService.getSubscriptionStartData(obj).subscribe(
        subStartData => this.getSubStartDetailsResponse(subStartData, data)
      );
    } else {
      // this.feeModeData=data
      this.goForward();
    }
  }


  Open(singleProfile, value) {
    // this.selected = 0;
    const fragmentData = {
      flag: value,
      data: singleProfile,
      id: 1,
      state: 'open',
      componentName: BillerProfileAdvisorComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          // this.getProfileBillerData()
          this.stepper.selectedIndex = 3
          rightSideDataSub.unsubscribe();
        }
      }

    );
    // this.billerProfileData = this.dataTOget.data
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
    this.feeModeData = feeModeData;
    this.feeStructureData = data;
    this.subscriptionDetails.controls.subscription.setValue(data.subscriptionNo);
    this.subscriptionDetails.controls.subscription.disable();
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
    if (this.serviceData.feeTypeId == 1) {
      const obj = {
        id: this.clientData.id,
        advisorId: this.advisorId,
        billerProfileId: this.selectedBiller.id,
        services: [
          {
            serviceName: this.payeeSettingData.serviceName,
            description: ''
          }],
        clientBillerProfiles: this.selectedPayee,
        clientId: this.clientData.clientId,
        dueDateFrequency: this.subscriptionDetails.get('dueDateFrequency').value,
        startsOn: UtilService.convertDateObjectToDateString(this.datepipe, this.subscriptionDetails.get('activationDate').value),
        subscriptionNumber: this.feeStructureData.subscriptionNo,
        feeMode: this.subscriptionDetails.get('feeCollectionMode').value,
        Status: 1,
        subscriptionPricing: {
          autoRenew: 0,
          billEvery: (this.serviceData.billingNature == '2') ? 0 : this.serviceData.billEvery,
          billingCycle: (this.serviceData.billingNature == '2') ? 0 : this.serviceData.billingCycle,
          billingMode: this.serviceData.billingMode,
          billingNature: (this.serviceData.billingNature == '2') ? 0 : this.serviceData.billingNature,
          feeTypeId: this.serviceData.feeTypeId,
          subscriptionAssetPricingList: [
            {
              assetClassId: 1,
              pricing: this.serviceData.subscriptionAssetPricingList[0].pricing
            }
          ]
        }
      };
      this.subService.startSubscription(obj).subscribe(
        data => this.startSubscriptionResponse(data)
      );
    } else {
      const obj = {
        id: this.clientData.id,
        advisorId: this.advisorId,
        billerProfileId: this.selectedBiller.id,
        services: [
          {
            serviceName: this.payeeSettingData.serviceName,
            description: ''
          }],
        clientBillerProfiles: this.selectedPayee,
        clientId: this.clientData.clientId,
        dueDateFrequency: this.subscriptionDetails.get('dueDateFrequency').value,
        startsOn: UtilService.convertDateObjectToDateString(this.datepipe, this.subscriptionDetails.get('activationDate').value),
        subscriptionNumber: this.feeStructureData.subscriptionNo,
        feeMode: this.subscriptionDetails.get('feeCollectionMode').value,
        Status: 1,
        subscriptionPricing: {
          autoRenew: 0,
          billEvery: this.serviceData.billEvery,
          billingCycle: this.serviceData.billingCycle,
          billingMode: this.serviceData.billingMode,
          billingNature: this.serviceData.billingNature,
          feeTypeId: this.serviceData.feeTypeId,
          id: 0,
          subscriptionAssetPricingList: [
            {
              directRegular: 1,
              assetClassId: 1,
              debtAllocation: this.serviceData.subscriptionAssetPricingList[0].debtAllocation,
              equityAllocation: this.serviceData.subscriptionAssetPricingList[0].equityAllocation,
              liquidAllocation: this.serviceData.subscriptionAssetPricingList[0].liquidAllocation,
            }, {
              directRegular: 2,
              assetClassId: 1,
              debtAllocation: this.serviceData.subscriptionAssetPricingList[1].debtAllocation,
              equityAllocation: this.serviceData.subscriptionAssetPricingList[1].equityAllocation,
              liquidAllocation: this.serviceData.subscriptionAssetPricingList[1].liquidAllocation,
            },
            {
              assetClassId: 2,
              subAssetIds: this.serviceData.subscriptionAssetPricingList[2].subAssetIds,
              pricing: this.serviceData.subscriptionAssetPricingList[2].pricing
            }
          ]
        }
      };
      this.subService.startSubscription(obj).subscribe(
        data => { this.startSubscriptionResponse(data) },
        err => {
          this.barButtonOptions.active = false;
        }
      );
    }
  }

  progressButtonClick(event) {
    this.barButtonOptions.active = true;
    this.startSubscription();
  }

  startSubscriptionResponse(data) {
    this.barButtonOptions.active = false;

    this.Close(true);
  }
}
