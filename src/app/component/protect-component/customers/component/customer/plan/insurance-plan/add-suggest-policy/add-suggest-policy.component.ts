import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../customer.service';
import { MatInput } from '@angular/material';
import { ValidatorType } from 'src/app/services/util.service';
import { PlanService } from '../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-suggest-policy',
  templateUrl: './add-suggest-policy.component.html',
  styleUrls: ['./add-suggest-policy.component.scss']
})
export class AddSuggestPolicyComponent implements OnInit {
  insuranceData: any;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,

  };
  storeData: string;
  showRecommendation: boolean;
  dataForEdit: any;
  suggestPolicyForm: any;
  advisorId: any;
  clientId: any;
  options = [];
  selectedVal: any;
  policyDetails: any;
  isRecommended = false;
  recommendOrNot: any;
  ids =[];
  constructor(private datePipe: DatePipe,private eventService: EventService, private planService: PlanService, private subInjectService: SubscriptionInject, private fb: FormBuilder, private customerService: CustomerService) { }
  validatorType = ValidatorType;
  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.insuranceData = data.inputData;
    this.recommendOrNot = data.inputData.recommendOrNot;
    this.getHolderNames(data.inputData);
    this.getdataForm(data.insurance);
    console.log(data);
  }
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  ngOnInit() {
  }
  saveData(data) {

  }
  getHolderNames(obj) {
    obj.familyMemberIds = [];
    if (obj.owners && obj.owners.length > 0) {
      obj.displayHolderName = obj.owners[0].holderName;
      obj.familyMemberId = obj.owners[0].ownerId;
      if (obj.owners.length > 1) {
        for (let i = 1; i < obj.owners.length; i++) {
          if (obj.owners[i].holderName) {
            const firstName = (obj.owners[i].holderName as string).split(' ')[0];
            obj.displayHolderName += ', ' + firstName;
            obj.familyMemberIds.push(obj.owners[i].ownerId);
          }
        }
      }
    } else {
      obj.displayHolderName = '';
    }
  }
  getdataForm(data) {
    this.dataForEdit = data;
    this.suggestPolicyForm = this.fb.group({
      policyName: [(this.dataForEdit ? this.dataForEdit.policyName : null), [Validators.required]],
      premiumAmount: [(this.dataForEdit ? this.dataForEdit.premiumPay : null), [Validators.required]],
      frequency: [(this.dataForEdit ? this.dataForEdit.frequency + '' : ''), [Validators.required]],
      insuranceAmount: [(this.dataForEdit ? this.dataForEdit.sumAssured : null), [Validators.required]],
      tenure: [(this.dataForEdit ? this.dataForEdit.policyTenure : null), [Validators.required]],
      implementationDate: [(this.dataForEdit ? new Date(this.dataForEdit.commencementDate)  : null), [Validators.required]],
    })
    if (this.dataForEdit) {
      this.storeData = this.dataForEdit.suggestion;
      this.isRecommended = this.dataForEdit ? (this.dataForEdit.isRecommend ? true : false) : false
      this.showRecommendation = this.isRecommended;
    }

  }
  checkRecommendation(value) {
    if (value) {
      this.showRecommendation = true;
      // if (this.recommendOrNot) {
      //   this.eventService.openSnackBar('Cannot recommend more than one policy', 'Ok');
      //   this.showRecommendation = false;
      // }
    } else {
      this.showRecommendation = false;
    }
    console.log(this.isRecommended)
  }
  close(flag) {

    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
  findPolicyName(data) {
    let value = data.target.value;
    const inpValue = this.suggestPolicyForm.get('policyName').value;
    const obj = {
      policyName: inpValue,
      insuranceSubTypeId: 0
    };
    this.customerService.getPolicyName(obj).subscribe(
      data => {
        if (data.policyDetails.length > 0) {
          this.options = data.policyDetails;
          this.checkValidPolicy(data, inpValue, value);
        } else {
          this.suggestPolicyForm.controls.policyName.setErrors({ erroInPolicy: true });
          this.suggestPolicyForm.get('policyName').markAsTouched();
        }
      },
      (error) => {
        console.log(error);
        this.suggestPolicyForm.controls.policyName.setErrors({ erroInPolicy: true });
        this.suggestPolicyForm.get('policyName').markAsTouched();

      }
    );
  }
  selectPolicy(value) {
    this.selectedVal = value;
    this.policyDetails = value;
  }
  checkValidPolicy(value, input, typeValue) {
    if (this.selectedVal) {
      if (this.selectedVal.policyName != typeValue) {
        this.suggestPolicyForm.controls.policyName.setErrors({ erroInPolicy: true });
        this.suggestPolicyForm.get('policyName').markAsTouched();
      }
    } else if (!this.selectedVal) {
      this.suggestPolicyForm.controls.policyName.setErrors({ erroInPolicy: true });
      this.suggestPolicyForm.get('policyName').markAsTouched();
    }
  }
  onChange(form, value, event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = '100';
      form.get(value).setValue(event.target.value);
    }
  }
  saveSuggestPolicy() {
    if (this.suggestPolicyForm.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.suggestPolicyForm.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        'id': this.dataForEdit ? this.dataForEdit.id : null,
        'clientId': this.clientId,
        'advisorId': this.advisorId,
        'familyMemberIdLifeAssured': this.insuranceData.familyMemberId == 0 ? this.clientId : this.insuranceData.familyMemberId ? this.insuranceData.familyMemberId : this.insuranceData.familyMemberIds,
        'insuranceTypeId': this.policyDetails ? this.policyDetails.insuranceTypeId : this.dataForEdit.insuranceTypeId,
        'insuranceSubTypeId': this.policyDetails ? this.policyDetails.insuranceSubTypeId : this.dataForEdit.insuranceSubTypeId,
        'policyNumber': this.policyDetails ? this.policyDetails.policyNumber : this.dataForEdit.policyNumber,
        'policyId': this.policyDetails ? this.policyDetails.id : this.dataForEdit.policyId,
        'policyTypeId': this.policyDetails ? this.policyDetails.policyTypeId : this.dataForEdit.policyTypeId,
        'policyName': this.suggestPolicyForm.get('policyName').value,
        'premiumAmount': this.suggestPolicyForm.get('premiumAmount').value,
        'frequency': this.suggestPolicyForm.get('frequency').value,
        'sumAssured': this.suggestPolicyForm.get('insuranceAmount').value,
        'policyTenure': this.suggestPolicyForm.get('tenure').value,
        'commencementDate': this.datePipe.transform(this.suggestPolicyForm.get('implementationDate').value, 'yyyy-MM-dd') ,
        'realOrFictitious': 2,
        'suggestion': this.storeData,
        'isRecommend': this.showRecommendation ? 1 : 0,
      }
      if (this.dataForEdit) {
        this.planService.editSuggestNew(obj).subscribe(
          data => {
            console.log(data);
            this.barButtonOptions.active = false;
            this.eventService.openSnackBar('Suggest policy edited', 'Ok');
            this.close(true);
          },
          err => {
            this.eventService.openSnackBar(err, 'Dismiss');
          }
        );
      } else {
        this.planService.addSuggestNew(obj).subscribe(
          data => {
            console.log(data);
            this.ids.push(data);
            this.saveLifeInsurance();
            this.barButtonOptions.active = false;
            this.eventService.openSnackBar('Suggest policy added', 'Ok');
            this.close(true);
          },
          err => {
            this.eventService.openSnackBar(err, 'Dismiss');
          }
        );
      }

    }
  }
  saveLifeInsurance() {
    this.barButtonOptions.active = true;
    const obj = {
      id: this.insuranceData.id,
      needAnalysis: this.ids
    }
    this.planService.lifeInsurancePlanAdd(obj).subscribe(
      data => {
        console.log(data);
      },
      err => {
        // this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
}
