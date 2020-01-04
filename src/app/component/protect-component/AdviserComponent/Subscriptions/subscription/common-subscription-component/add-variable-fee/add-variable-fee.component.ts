import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {EnumServiceService} from '../../../../../../../services/enum-service.service';
import * as _ from 'lodash';
import {EventService} from 'src/app/Data-service/event.service';
import {AuthService} from "../../../../../../../auth-service/authService";
import {UtilService, ValidatorType} from 'src/app/services/util.service';

@Component({
  selector: 'app-add-variable-fee',
  templateUrl: './add-variable-fee.component.html',
  styleUrls: ['./add-variable-fee.component.scss']
})
export class AddVariableFeeComponent implements OnInit {

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
  pricing;
  ischeckVariableData
  serviceId: any;
  dataToSend: any;
  data: any;
  restrictMoreThan100Val;

  @Input() set variableFee(data) {
    this.ischeckVariableData = data
    this.getFeeFormUpperData(data)
  }

  @Output() outputVariableData = new EventEmitter();

  constructor(public utils: UtilService, public subInjectService: SubscriptionInject, private fb: FormBuilder,
              private subService: SubscriptionService, private enumService: EnumServiceService, private eventService: EventService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.setValidation(false);
    this.otherAssetData = [];
    this.enumService.getOtherAssetData().forEach(element => {
      this.otherAssetData.push(Object.assign({}, element));
    });
    (this.ischeckVariableData) ? console.log("fixed fee Data") : this.createVariableFeeForm('');
    console.log(this.otherAssetData);
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
      description: [, [Validators.required]],
      billEvery: [, [Validators.required]],
      Duration: [1],
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
      pricing: [, [Validators.required, Validators.min(0.01), Validators.max(99)]]
    });
    this.getFormControl().serviceName.maxLength = 40;
    this.getFormControl().code.maxLength = 10;
    this.getFormControl().description.maxLength = 160;
  }

  getFeeFormUpperData(data) {
    if (data == '') {
      this.createVariableFeeForm('')
      return;
    } else {
      this.data = data;
      this.serviceId = data.id;
      this.variableFeeData = this.fb.group({
        serviceName: [data.serviceName, [Validators.required]],
        code: [data.serviceCode, [Validators.required]],
        description: [data.description, [Validators.required]],
        billEvery: [data.servicePricing.billEvery, [Validators.required]],
        Duration: [data.servicePricing.billingCycle],
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
      this.otherAssetData = data.servicePricing.pricingList[2].serviceSubAssets
      this.otherAssetData.forEach(element => {
        if (element.isActive == 1) {
          this.selectedOtherAssets.push(element.subAssetClassId)
        }
      })
      this.getFormControl().serviceName.maxLength = 40;
      this.getFormControl().code.maxLength = 10;
      this.getFormControl().description.maxLength = 160;
    }
  }

  Close(state) {
    this.subInjectService.changeUpperRightSliderState({state: 'close'});
    this.setValidation(false);
    this.createVariableFeeForm('')
  }

  closeTab(state, value) {
    console.log(value);
    this.subInjectService.rightSliderData(state);
    this.subInjectService.closeSlider(value);
  }

  saveVariableFeeData(feeType) {

    if (this.variableFeeData.controls.serviceName.invalid) {
      this.isServiceValid = true;
      return;
    } else if (this.variableFeeData.controls.code.invalid) {
      this.isCodeValid = true;
      return;
    } else if (this.variableFeeData.controls.billEvery.invalid) {
      this.isBillValid = true;
      return;
    } else if (this.variableFeeData.controls.directFees.invalid || this.variableFeeData.controls.regularFees.invalid) {
      this.mutualFundFees = true;
      return;
    } else if (this.variableFeeData.controls.pricing.invalid) {
      this.pricing = true;
      return;
    } else if (this.selectedOtherAssets.length == 0) {
      this.pricing = true;
      return;
    } else {
      const obj = {
        serviceRepoId: this.serviceId,
        advisorId: this.advisorId,
        // advisorId: 12345,
        description: this.variableFeeData.controls.description.value,
        serviceCode: this.variableFeeData.controls.code.value,
        serviceName: this.variableFeeData.controls.serviceName.value,
        servicePricing: {
          id:(this.data!=undefined)?this.data.servicePricing.id:'',
          billEvery: parseInt(this.variableFeeData.controls.billEvery.value) * parseInt(this.variableFeeData.controls.Duration.value),
          feeTypeId: parseInt(feeType),
          pricingList: [
            {
              id: (this.data!=undefined)?this.data.servicePricing.id:'',
              directRegular: 1,
              assetClassId: 1,
              debtAllocation: this.variableFeeData.controls.directFees.controls.debt.value,
              equityAllocation: this.variableFeeData.controls.directFees.controls.equity.value,
              liquidAllocation: this.variableFeeData.controls.directFees.controls.liquid.value,
            }, {
              id: (this.data!=undefined)?this.data.servicePricing.pricingList[1].id:'',
              directRegular: 2,
              assetClassId: 1,
              debtAllocation: this.variableFeeData.controls.regularFees.controls.debt.value,
              equityAllocation: this.variableFeeData.controls.regularFees.controls.equity.value,
              liquidAllocation: this.variableFeeData.controls.regularFees.controls.liquid.value,
            },
            {
              id: (this.data!=undefined)?this.data.servicePricing.pricingList[2].id:'',
              assetClassId: 2,
              otherAssets: this.selectedOtherAssets,
              pricing: this.variableFeeData.controls.pricing.value
            }
          ]
        }
      };
      this.dataToSend = obj;
      Object.assign(this.dataToSend, {id: this.serviceId});
      console.log('jifsdfoisd', obj);
      if (this.serviceId == undefined) {
        this.subService.createSettingService(obj).subscribe(
          data => this.saveVariableFeeDataResponse(data, obj)
        );
      } else {
        this.subService.editSettingService(obj).subscribe(
          data => this.saveFeeTypeDataEditResponse(data)
        );
      }

    }

  }

  saveVariableFeeDataResponse(data, obj) {
    this.outputVariableData.emit(data)
    this.eventService.openSnackBar('Service is Created', 'OK');
    this.subInjectService.changeUpperRightSliderState({flag: 'added', state: 'close', data});
  }

  saveFeeTypeDataEditResponse(data) {
    this.outputVariableData.emit(this.dataToSend)
    this.eventService.openSnackBar('Service is Created', 'OK');
    this.subInjectService.changeUpperRightSliderState({state: 'close'});
  }

  select(assetData) {
    (assetData.isActive == 1) ? this.unselectAssets(assetData) : this.selectAssets(assetData);
  }

  selectAssets(data) {
    console.log(data);
    data.isActive = 1;
    this.selectedOtherAssets.push(parseInt(data.subAssetClassId));
  }

  unselectAssets(data) {
    data.isActive = 0;
    _.remove(this.selectedOtherAssets, function (delData) {
      return delData.subAssetClassId == data.subAssetClassId;
    });
  }
}
