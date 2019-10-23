import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {MatStepper} from '@angular/material';
import {EnumServiceService} from '../../enum-service.service';
import * as _ from 'lodash';


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

  ngOnInit() {
    this.stepper.selectedIndex = 0;
    this.feeCollectionMode = this.enumService.getFeeCollectionModeData();
    console.log(this.feeCollectionMode);
  }

  goForward(/*stepper: MatStepper*/) {
    this.stepper.next();
  }

  getSubStartDetails(data) {
    this.clientData = data;
    console.log(this.clientData, 'client Data');
    if (data.feeMode) {
      const obj = {
        advisorId: 2808,
        clientId: data.clientId,
        subId: data.id
      };
      this.subService.getSubscriptionStartData(obj).subscribe(
        subStartData => this.getSubStartDetailsResponse(subStartData)
      );
    } else {
      this.feeStructureFormData = data;
      this.stepper.next();
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
    this.selectedPayee.push(data);
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
    const obj = {
      id: this.clientData.id,
      advisorId: 2808,
      billerProfileId: this.selectedBiller.id,
      clientBillerProfiles: [
        {
          id: 5,
          share: 50
        },
        {
          id: 6,
          share: 50
        }
      ],
      clientId: this.clientData.clientId,
      dueDateFrequency: 30,
      startsOn: '2019-10-16',
      fromDate: '2019-10-16T13:54:25.983Z',
      subscriptionNumber: this.feeStructureData.subscriptionNo,
      feeMode: this.clientData.subscriptionPricing.feeTypeId,
      Status: 1,
      subscriptionPricing: {
        autoRenew: 0,
        billEvery: 0,
        billingCycle: 0,
        billingMode: 0,
        billingNature: 0,
        feeTypeId: 0,
        id: 0,
        pricing: 0,
        subscriptionAssetPricingList: [
          {
            assetClassId: 0,
            debtAllocation: 0,
            directRegular: 0,
            equityAllocation: 0,
            id: 0,
            liquidAllocation: 0,
            pricing: 0,
            subscriptionPricingId: 0,
            subscriptionSubAssets: [
              {
                id: 0,
                isActive: 0,
                selected: true,
                subAssetClassId: 0,
                subAssetClassName: 'string',
                subscriptionAssetPricingId: 0
              }
            ]
          }
        ]
      }
    };
    console.log(obj, 'start subscription');
  }

}
