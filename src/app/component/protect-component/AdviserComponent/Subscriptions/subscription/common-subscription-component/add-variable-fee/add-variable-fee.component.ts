import {Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {EnumServiceService} from '../../../../../../../services/enum-service.service';
import {EventService} from 'src/app/Data-service/event.service';
import {AuthService} from '../../../../../../../auth-service/authService';
import {UtilService, ValidatorType} from 'src/app/services/util.service';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';
import {MatInput} from '@angular/material';

@Component({
  selector: 'app-add-variable-fee',
  templateUrl: './add-variable-fee.component.html',
  styleUrls: ['./add-variable-fee.component.scss']
})
export class AddVariableFeeComponent implements OnInit {
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
  isSelectOtherAssets = false;
  ischeckVariableData;
  mutualFundFees;
  validatorType = ValidatorType;
  isServiceValid;
  isCodeValid;
  idDesValid;
  isBillValid;
  variableFeeData;
  advisorId;
  otherAssetData;
  selectedOtherAssets = [];
  pricing = false;
  @ViewChild('htmlTag', {static: true}) htmltag: ElementRef;
  variableFees = true;
  serviceId: any;
  dataToSend: any;
  restrictMoreThan100Val;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  constructor(public utils: UtilService, public subInjectService: SubscriptionInject, private fb: FormBuilder,
              private subService: SubscriptionService, private enumService: EnumServiceService, private eventService: EventService) {
  }

  otherAssetDataId: any;
  _data: any;

  @Output() outputVariableData = new EventEmitter();

  @Input() set data(data) {
    const stock = this.enumService.getOtherAssetData().filter((x) => x.subAssetClassName == 'Stocks');
    console.log(stock, this.enumService.getOtherAssetData(), 'stock 123');

    if (data == '') {
      // this.otherAssetData=UtilService.
      this.otherAssetData = Object.assign([], stock);
      return;
    } else {
      this.ischeckVariableData = data;
      this.otherAssetData = Object.assign([], stock);
      this.getFeeFormUpperData(data);
    }
  }

  ngOnInit() {
    // if(this.enumService.getOtherAssetData().length <= 0 ){
    //   this.otherAssetData = Object.assign([], this.enumService.getOtherAssetData());
    // }
    // console.log(this.enumService.getOtherAssetData(), this.enumService.getOtherAssetData().length <= 0 , "check data variable fee");
    this.advisorId = AuthService.getAdvisorId();
    this.setValidation(false);
    (this.ischeckVariableData) ? console.log('fixed fee Data') : this.createVariableFeeForm('');
  }

  ngAfterViewInit() {
    console.log(this.htmltag);
  }

  restrictFrom100(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = 100;
    }
  }

  setValidation(flag) {
    this.isServiceValid = flag;
    this.isCodeValid = flag;
    this.idDesValid = flag;
    this.isBillValid = flag;
    this.mutualFundFees = flag;
    this.pricing = flag;
  }

  getFormControl() {
    return this.variableFeeData.controls;
  }

  createVariableFeeForm(data) {
    this.variableFeeData = this.fb.group({
      serviceName: [, [Validators.required]],
      code: [, [Validators.required]],
      description: [''],
      billEvery: [1, [Validators.required]],
      Duration: ['1'],
      directFees: this.fb.group({
        equity: [, [Validators.required]],
        debt: [, [Validators.required]],
        liquid: [, [Validators.required]]
      }),
      regularFees: this.fb.group({
        equity: [, [Validators.required]],
        debt: [, [Validators.required]],
        liquid: [, [Validators.required]]
      }),
      otherAssetClassFees: [],
      pricing: [, [Validators.required, Validators.min(0.00)]]
    });
    // , Validators.max(99)
    this.getFormControl().serviceName.maxLength = 40;
    this.getFormControl().code.maxLength = 10;
    this.getFormControl().description.maxLength = 500;
  }

  getFeeFormUpperData(data) {
    if (data == '') {
      this.createVariableFeeForm('');
      return;
    } else {
      this._data = data;
      this.serviceId = data.id;
      this.variableFeeData = this.fb.group({
        serviceName: [data.serviceName, [Validators.required]],
        code: [data.serviceCode, [Validators.required]],
        description: [data.description],
        billEvery: [data.servicePricing.billEvery, [Validators.required]],
        Duration: [String(data.servicePricing.billingCycle)],
        directFees: this.fb.group({
          equity: [data.servicePricing.pricingList[0].equityAllocation, [Validators.required]],
          debt: [data.servicePricing.pricingList[0].debtAllocation, [Validators.required]],
          liquid: [data.servicePricing.pricingList[0].liquidAllocation, [Validators.required]]
        }),
        regularFees: this.fb.group({
          equity: [data.servicePricing.pricingList[1].equityAllocation, [Validators.required]],
          debt: [data.servicePricing.pricingList[1].debtAllocation, [Validators.required]],
          liquid: [data.servicePricing.pricingList[1].liquidAllocation, [Validators.required]]
        }),
        otherAssetClassFees: [data.servicePricing.pricingList[2].serviceSubAssets],
        pricing: [data.servicePricing.pricingList[2].pricing, [Validators.required]]
      });
      if (data.servicePricing.pricingList[2].serviceSubAssets != undefined) {
        this.otherAssetData = data.servicePricing.pricingList[2].serviceSubAssets.filter((x) => x.subAssetClassName == 'Stocks');
      }
      // this.otherAssetData = data.servicePricing.pricingList[2].serviceSubAssets
      // this.otherAssetData = data.servicePricing.pricingList[2].serviceSubAssets
      this.otherAssetData.forEach(element => {
        if (element.isActive == 1) {
          this.selectedOtherAssets.push(element.subAssetClassId);
        }
      });
      console.log(this.otherAssetData);
      this.getFormControl().serviceName.maxLength = 40;
      this.getFormControl().code.maxLength = 10;
      this.getFormControl().description.maxLength = 500;
    }
  }

  Close(state) {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
    if (this.serviceId == undefined) {
      this.otherAssetData.forEach(element => {
        element.isActive = 0;
      });
    }
    this.setValidation(false);
    this.createVariableFeeForm('');
    this.otherAssetData = [];
  }

  validateFees() {
    const reg = this.getFormControl().regularFees.value;
    const dir = this.getFormControl().directFees.value;
    const sum = parseInt(reg.equity) + parseInt(reg.debt) + parseInt(reg.liquid) + parseInt(dir.equity) + parseInt(dir.debt) + parseInt(dir.liquid) + parseInt(this.variableFeeData.controls.pricing.value);
    if (sum >= 1) {
      return false;
    } else {
      this.variableFees = true;
      return true;
    }
  }

  saveVariableFeeData(feeType) {
    if (this.variableFeeData.invalid) {
      for (const element in this.variableFeeData.controls) {
        console.log(element);
        if (this.variableFeeData.get(element).invalid) {
          this.inputs.find(input => !input.ngControl.valid).focus();
          this.variableFeeData.controls[element].markAsTouched();
          this.getFormControl().regularFees.controls.equity.markAsTouched();
          this.getFormControl().regularFees.controls.debt.markAsTouched();
          this.getFormControl().regularFees.controls.liquid.markAsTouched();
          this.getFormControl().directFees.controls.equity.markAsTouched();
          this.getFormControl().directFees.controls.debt.markAsTouched();
          this.getFormControl().directFees.controls.liquid.markAsTouched();
          this.variableFeeData.controls.pricing.markAsTouched();
          if (this.variableFeeData.controls.pricing.invalid) {
            this.pricing = true;
          }
        }
      }
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        serviceRepoId: this.serviceId,
        advisorId: this.advisorId,
        // advisorId: 12345,
        description: this.variableFeeData.controls.description.value,
        serviceCode: this.variableFeeData.controls.code.value,
        serviceName: this.variableFeeData.controls.serviceName.value,
        servicePricing: {
          id: (this._data != undefined) ? this._data.servicePricing.id : '',
          billEvery: this.variableFeeData.controls.billEvery.value,
          billingCycle: this.variableFeeData.controls.Duration.value,
          feeTypeId: parseInt(feeType),
          pricingList: [
            {
              id: (this._data != undefined) ? this._data.servicePricing.id : '',
              directRegular: 1,
              assetClassId: 1,
              debtAllocation: this.variableFeeData.controls.directFees.controls.debt.value > 100 ? 100 : this.variableFeeData.controls.directFees.controls.debt.value,
              equityAllocation: this.variableFeeData.controls.directFees.controls.equity.value > 100 ? 100 : this.variableFeeData.controls.directFees.controls.equity.value,
              liquidAllocation: this.variableFeeData.controls.directFees.controls.liquid.value > 100 ? 100 : this.variableFeeData.controls.directFees.controls.liquid.value,
            }, {
              id: (this._data != undefined) ? this._data.servicePricing.pricingList[1].id : '',
              directRegular: 2,
              assetClassId: 1,
              debtAllocation: this.variableFeeData.controls.regularFees.controls.debt.value > 100 ? 100 : this.variableFeeData.controls.regularFees.controls.debt.value,
              equityAllocation: this.variableFeeData.controls.regularFees.controls.equity.value > 100 ? 100 : this.variableFeeData.controls.regularFees.controls.equity.value,
              liquidAllocation: this.variableFeeData.controls.regularFees.controls.liquid.value > 100 ? 100 : this.variableFeeData.controls.regularFees.controls.liquid.value,
            },
            {
              id: (this._data != undefined) ? this._data.servicePricing.pricingList[2].id : '',
              assetClassId: 2,
              otherAssets: this.selectedOtherAssets,
              pricing: this.variableFeeData.controls.pricing.value > 100 ? 100 : this.variableFeeData.controls.pricing.value
            }
          ]
        }
      };
      this.dataToSend = obj;
      Object.assign(this.dataToSend, {id: this.serviceId});
      console.log('jifsdfoisd', obj);
      if (this.serviceId == undefined) {
        this.subService.createSettingService(obj).subscribe(
          data => {
            this.saveVariableFeeDataResponse(data, obj);
            this.barButtonOptions.active = false;
          },
          err => {
            console.log('error createSettingService', err);
            this.barButtonOptions.active = false;
          }
        );
      } else {
        this.subService.editSettingService(obj).subscribe(
          data => {
            this.saveFeeTypeDataEditResponse(data);
            this.barButtonOptions.active = false;

          },
          err => {
            this.barButtonOptions.active = false;
            console.log('error editSettingService', err);
          }
        );
      }

    }

  }

  saveVariableFeeDataResponse(data, obj) {
    this.eventService.openSnackBar('Service is created', 'OK');
    this.subInjectService.changeNewRightSliderState({flag: 'added', state: 'close', data});
  }

  saveFeeTypeDataEditResponse(data) {
    this.dataToSend.servicePricing.pricingList[2].serviceSubAssets = this.otherAssetData;
    this.eventService.openSnackBar('Service is edited', 'OK');
    this.subInjectService.changeNewRightSliderState({state: 'close', data: this.dataToSend});
  }

  select(assetData) {
    this.pricing = false;
    (assetData.isActive == 1) ? this.unselectAssets(assetData) : this.selectAssets(assetData);
  }

  selectAssets(data) {
    console.log(data);
    data.isActive = 1;
    this.selectedOtherAssets.push(parseInt(data.subAssetClassId));
  }

  unselectAssets(data) {
    data.isActive = 0;
    this.selectedOtherAssets = this.selectedOtherAssets.filter(delData => delData != data.subAssetClassId);
  }
}
