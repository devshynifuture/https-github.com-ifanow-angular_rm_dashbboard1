import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../customer.service';

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
  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder,private customerService:CustomerService) { }
  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.insuranceData = data;
    this.getHolderNames(this.insuranceData);
    this.getdataForm(data);
    console.log(data);
  }

  ngOnInit() {
    this.storeData = 'Here you can write recommendations';
  }
  saveData(data) {

  }
  getHolderNames(obj) {
    if (obj.owners && obj.owners.length > 0) {
      obj.displayHolderName = obj.owners[0].holderName;
      if (obj.owners.length > 1) {
        for (let i = 1; i < obj.owners.length; i++) {
          if (obj.owners[i].holderName) {
            const firstName = (obj.owners[i].holderName as string).split(' ')[0];
            obj.displayHolderName += ', ' + firstName;
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
  close() {

    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  findPolicyName(data){
    const inpValue = this.suggestPolicyForm.get('policyName').value;
    this.customerService.getCompanyNames(inpValue).subscribe(
        data => {
            console.log(data);
            this.options = data;
        },
        (error) => {
            console.log(error);
        }
    );
  }
  onChange(form, value, event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = '100';
      form.get(value).setValue(event.target.value);
    }
  }
  saveSuggestPolicy() {
    if (this.suggestPolicyForm.invalid) {
      this.suggestPolicyForm.markAllAsTouched();
    } else {
      const obj = {
        'clientId': this.clientId,
        'advisorId': this.advisorId,
        'policyName': this.suggestPolicyForm.get('policyName').value,
        'premiumAmount': this.suggestPolicyForm.get('premiumAmount').value,
        'frequency': this.suggestPolicyForm.get('frequency').value,
        'insuranceAmount': this.suggestPolicyForm.get('insuranceAmount').value,
        'tenure': this.suggestPolicyForm.get('tenure').value,
        'recommendation': this.storeData
      }
      console.log()
    }
  }
}
