import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-suggest-health-insurance',
  templateUrl: './suggest-health-insurance.component.html',
  styleUrls: ['./suggest-health-insurance.component.scss']
})
export class SuggestHealthInsuranceComponent implements OnInit {
  inputData: any;
  showInsurance: any;
  suggestPolicy: any;

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private custumService: CustomerService, ) { }

  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    console.log('heder', this.inputData)
    this.showInsurance = this.inputData
    this.getdataForm('');
  }
  close(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', data });
  }
  getdataForm(data) {

    this.suggestPolicy = this.fb.group({
      planType: [data ? '' : data.planType, [Validators.required]],
      planType2: [(!data) ? '' : data.planType2, [Validators.required]],
      nameOfInsurer: [(!data) ? '' : data.nameOfInsurer, [Validators.required]],
      planName: [(!data) ? '' : data.planName, [Validators.required]],
      nameOfPolicyHolder: [(!data) ? '' : data.nameOfPolicyHolder, [Validators.required]],
      MemberName: [(!data) ? '' : data.MemberName, [Validators.required]],
      sumInsured: [(!data) ? '' : data.sumInsured, [Validators.required]],
      appAnnualPremium: [(!data) ? '' : data.appAnnualPremium, [Validators.required]],

    });
  }
  getFormControl(): any {
    return this.suggestPolicy.controls;
  }
  saveSuggested() {

    if (this.suggestPolicy.get('planType').invalid) {
      this.suggestPolicy.get('planType').markAsTouched();
      return;
    } else if (this.suggestPolicy.get('planType2').invalid) {
      this.suggestPolicy.get('planType2').markAsTouched();
      return;
    } else if (this.suggestPolicy.get('nameOfInsurer').invalid) {
      this.suggestPolicy.get('nameOfInsurer').markAsTouched();
      return
    } else if (this.suggestPolicy.get('planName').invalid) {
      this.suggestPolicy.get('planName').markAsTouched();
      return;
    } else if (this.suggestPolicy.get('nameOfPolicyHolder').invalid) {
      this.suggestPolicy.get('nameOfPolicyHolder').markAsTouched();
      return;
    }else if (this.suggestPolicy.get('planName').invalid) {
      this.suggestPolicy.get('planName').markAsTouched();
      return;
    }else if (this.suggestPolicy.get('MemberName').invalid) {
      this.suggestPolicy.get('MemberName').markAsTouched();
      return;
    }else if (this.suggestPolicy.get('sumInsured').invalid) {
      this.suggestPolicy.get('sumInsured').markAsTouched();
      return;
    }else if (this.suggestPolicy.get('appAnnualPremium').invalid) {
      this.suggestPolicy.get('appAnnualPremium').markAsTouched();
      return;
    } else {
      let obj = {
        planType: this.suggestPolicy.controls.planType.value,
        planType2: this.suggestPolicy.controls.planType2.value,
        nameOfInsurer: this.suggestPolicy.controls.nameOfInsurer.value,
        planName: this.suggestPolicy.controls.planName.value,
        nameOfPolicyHolder: this.suggestPolicy.controls.nameOfPolicyHolder.value,
        MemberName: this.suggestPolicy.controls.MemberName.value,
        sumInsured: this.suggestPolicy.controls.sumInsured.value,
        appAnnualPremium: this.suggestPolicy.controls.appAnnualPremium.value,
      }
    }
  }
}
