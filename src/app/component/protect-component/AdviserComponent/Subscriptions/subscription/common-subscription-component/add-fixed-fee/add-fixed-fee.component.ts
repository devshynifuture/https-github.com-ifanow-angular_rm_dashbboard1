import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from '../../../../../../../auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { MatInput } from '@angular/material';

@Component({
  selector: 'app-add-fixed-fee',
  templateUrl: './add-fixed-fee.component.html',
  styleUrls: ['./add-fixed-fee.component.scss']
})
export class AddFixedFeeComponent implements OnInit {
  serviceId: any;
  dataToSend: {};
  validatorType = ValidatorType;
  _data: any;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'primary',
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
  };
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  constructor(public utils: UtilService, public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private subService: SubscriptionService, private eventService: EventService) {
  }

  isServiceValid;
  isCodeValid;
  isDescriptionValid;
  isFeesValid;
  isbillEvery;
  advisorId;
  ischeckFixedData;
  fixedFeeData = this.fb.group({
    serviceName: [, [Validators.required]],
    code: [, [Validators.required]],
    description: [, [Validators.required]],
    Duration: [1],
    fees: [, [Validators.required]],
    billingNature: [1],
    billEvery: [null, [Validators.required]],
    billingMode: [1]
  });

  @Input() set data(data) {
    this.ischeckFixedData = data;
    this.getFeeFormData(data);
  }

  @Output() outputFixedData = new EventEmitter();

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.setValidation(false);
    (this.ischeckFixedData) ? '' : this.createFixedFeeForm('');
  }

  createFixedFeeForm(data) {
    console.log('createFixedFeeForm data : ', data);
    this.fixedFeeData = this.fb.group({
      serviceName: [data, [Validators.required, Validators.maxLength(40)]],
      code: [data, [Validators.required]],
      description: [data],
      Duration: ['1'],
      fees: [data, [Validators.required]],
      billingNature: ['1'],
      billEvery: ['', [Validators.required]],
      billingMode: ['1']
    });
    this.getFormControl().serviceName.maxLength = 40;
    this.getFormControl().code.maxLength = 10;
    this.getFormControl().description.maxLength = 500;
    this.getFormControl().fees.maxLength = 10;
  }

  setValidation(flag) {
    this.isServiceValid = flag;
    this.isCodeValid = flag;
    this.isDescriptionValid = flag;
    this.isFeesValid = flag;
    this.isbillEvery = flag;
  }

  getFormControl(): any {
    return this.fixedFeeData.controls;
  }

  changedBillingNature(newOption) {
    console.log('changedBillingNature newOption :  ', newOption);
    if (newOption == 2) {
      this.getFormControl().billEvery.clearValidators();
      this.getFormControl().billEvery.clearAsyncValidators();
      this.getFormControl().billEvery.updateValueAndValidity();

    } else {
      this.getFormControl().billEvery.setValidators([Validators.required]);
      this.getFormControl().billEvery.updateValueAndValidity();
    }
  }

  getFeeFormData(data) {
    if (data == '') {
      this.createFixedFeeForm('');
      return;
    } else {
      this._data = data;
      this.serviceId = data.id;
      // data.servicePricing.billingNature = '1';

      // data.servicePricing.billingNature + ''
      this.fixedFeeData.controls.serviceName.setValue(data.serviceName);
      this.fixedFeeData.controls.code.setValue(data.serviceCode);
      this.fixedFeeData.controls.description.setValue(data.description);
      this.fixedFeeData.controls.Duration.setValue(String(data.servicePricing.billingCycle));
      this.fixedFeeData.controls.fees.setValue(data.servicePricing.pricingList[0].pricing);
      this.fixedFeeData.controls.billingNature.setValue(String(data.servicePricing.billingNature));
      // this.fixedFeeData.controls.billingNature.setValue('2');

      this.fixedFeeData.controls.billingMode.setValue(String(data.servicePricing.billingMode));
      this.fixedFeeData.controls.billEvery.setValue(String(data.servicePricing.billEvery));

      this.getFormControl().serviceName.maxLength = 40;
      this.getFormControl().code.maxLength = 10;
      this.getFormControl().description.maxLength = 500;
      this.getFormControl().fees.maxLength = 10;
    }

  }

  Close(state) {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
    this.setValidation(false);
    this.createFixedFeeForm('');
  }

  saveFeeTypeData(feeType, state) {
    if (this.fixedFeeData.invalid) {
      // for (let element in this.fixedFeeData.controls) {
      //   if (this.fixedFeeData.get(element).invalid) {
      //     this.inputs.find(input => !input.ngControl.valid).focus();
      //     this.fixedFeeData.controls[element].markAsTouched();
      //   }
      // }
      this.fixedFeeData.markAllAsTouched();
      return;
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        serviceRepoId: this.serviceId,
        advisorId: this.advisorId,
        // advisorId: 12345,
        description: this.fixedFeeData.controls.description.value,
        // global: false,
        serviceCode: this.fixedFeeData.controls.code.value,
        serviceName: this.fixedFeeData.controls.serviceName.value,
        servicePricing: {
          id: (this._data) ? this._data.servicePricing.id : 0,
          // autoRenew: 0,
          billEvery: this.fixedFeeData.controls.billEvery.value ? this.fixedFeeData.controls.billEvery.value : 0,
          billingCycle: this.fixedFeeData.get('Duration').value,
          billingMode: parseInt(this.fixedFeeData.controls.billingMode.value),
          billingNature: parseInt(this.fixedFeeData.controls.billingNature.value),
          feeTypeId: parseInt(feeType),
          pricingList: [
            {
              id: (this._data) ? this._data.servicePricing.pricingList[0].id : '',
              pricing: this.fixedFeeData.controls.fees.value,
              assetClassId: 1
            }
          ]

        }
      };
      this.dataToSend = obj;
      Object.assign(this.dataToSend, { id: this.serviceId });
      if (this.serviceId == undefined) {
        this.subService.createSettingService(obj).subscribe(
          data => {
            this.barButtonOptions.active = false;
            this.saveFeeTypeDataResponse(data, state);
          },
          err => {
            this.barButtonOptions.active = false;
          }
        );
      } else {
        this.subService.editSettingService(obj).subscribe(
          data => {
            this.barButtonOptions.active = false;
            this.saveFeeTypeDataEditResponse(data, state);
          },
          err => {
            this.barButtonOptions.active = false;
          }
        );
      }

    }
  }

  saveFeeTypeDataResponse(data, state) {
    // this.outputFixedData.emit(data)
    this.eventService.openSnackBar('Service is created', 'OK');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data });
  }

  saveFeeTypeDataEditResponse(data, state) {
    // this.outputFixedData.emit(this.dataToSend)
    this.eventService.openSnackBar('Service is created', 'OK');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data: this.dataToSend });
  }
}
