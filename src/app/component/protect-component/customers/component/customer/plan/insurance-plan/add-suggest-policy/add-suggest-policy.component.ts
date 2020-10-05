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
  options =[];
  selectedVal: any;
  policyDetails: any;
  constructor(private eventService:EventService,private planService:PlanService,private subInjectService: SubscriptionInject, private fb: FormBuilder,private customerService:CustomerService) { }
  validatorType = ValidatorType;
  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.insuranceData = data;
    this.getHolderNames(this.insuranceData);
    this.getdataForm(data);
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
    this.dataForEdit = data.data;
    this.suggestPolicyForm = this.fb.group({
      policyName: [(this.dataForEdit ? this.dataForEdit.policyName : null), [Validators.required]],
      premiumAmount: [(this.dataForEdit ? this.dataForEdit.premiumAmount : null), [Validators.required]],
      frequency: [(this.dataForEdit ? this.dataForEdit.frequency + '' : ''), [Validators.required]],
      insuranceAmount: [(this.dataForEdit ? this.dataForEdit.insuranceAmount : null), [Validators.required]],
      tenure: [(this.dataForEdit ? this.dataForEdit.tenure : null), [Validators.required]],
    })
  }
  checkRecommendation(value) {
    if (!value) {
      this.showRecommendation = true;
    } else {
      this.showRecommendation = false;
    }
  }
  close(flag) {

    this.subInjectService.changeNewRightSliderState({state: 'close', refreshRequired: flag});
  }
  findPolicyName(data){
    let value = data.target.value;
    const inpValue = this.suggestPolicyForm.get('policyName').value;
    const obj = {
      policyName: inpValue,
      insuranceSubTypeId: 0
    };
    this.customerService.getPolicyName(obj).subscribe(
        data => {
           if(data.policyDetails.length>0){
            this.options = data.policyDetails;
            this.checkValidPolicy(data,inpValue,value);
          }else{
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
  selectPolicy(value){
    this.selectedVal = value;
    this.policyDetails = value;
  }
  checkValidPolicy(value,input,typeValue){
    if(this.selectedVal){
      if(this.selectedVal.policyName != typeValue){
        this.suggestPolicyForm.controls.policyName.setErrors({ erroInPolicy: true });
        this.suggestPolicyForm.get('policyName').markAsTouched();
      }
    }else if(!this.selectedVal){
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
      const obj = {
        'clientId': this.clientId,
        'advisorId': this.advisorId,
        'familyMemberIdLifeAssured':this.insuranceData.familyMemberId == 0 ? this.clientId : this.insuranceData.familyMemberId  ? this.insuranceData.familyMemberId : this.insuranceData.familyMemberIds,
        'insuranceTypeId':this.policyDetails.insuranceTypeId,
        'insuranceSubTypeId':this.policyDetails.insuranceSubTypeId,
        'policyNumber':this.policyDetails.policyNumber,
        'policyId':this.policyDetails.id,
        'policyTypeId':this.policyDetails.policyTypeId,
        'policyName': this.suggestPolicyForm.get('policyName').value,
        'premiumAmount': this.suggestPolicyForm.get('premiumAmount').value,
        'frequency': this.suggestPolicyForm.get('frequency').value,
        'sumAssured': this.suggestPolicyForm.get('insuranceAmount').value,
        'policyTenure': this.suggestPolicyForm.get('tenure').value,
        'realOrFictitious':2,
        'suggestion': this.storeData ? this.storeData : null
      }
      this.planService.addSuggestNew(obj).subscribe(
        data => {
            console.log(data);
            this.close(true);
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
        }
      );
    }
  }
}
