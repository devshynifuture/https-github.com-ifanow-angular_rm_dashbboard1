import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  storeData: string;
  showRecommendation=false;
  insuranceData = [{
    value: '1',
    header: 'Add Health Insurance',
    smallHeading: 'health insurance',
    insuranceType: 5,
    logo: '/assets/images/svg/helth-insurance.svg',
    heading: 'Health insurance',
    subHeading: 'Select how you’d like to proceed with planning for health insurance policies.'
  }, {
    value: '2',
    logo: '/assets/images/svg/Criticalillness.svg',
    header: 'Add Critical Illness',
    smallHeading: 'critical illness',
    insuranceType: 6,
    heading: 'Critical illness',
    subHeading: 'Select how you’d like to proceed with planning for critical insurance policies.'
  }, {
    value: '3',
    logo: '/assets/images/svg/Cancercare.svg',
    header: 'Add Cancer Care',
    smallHeading: 'cancer care',
    insuranceType: 11,
    heading: 'Cancer care',
    subHeading: 'Select how you’d like to proceed with planning for cancer insurance policies.'
  }, {
    value: '4',
    logo: '/assets/images/svg/Personalaccident.svg',
    header: 'Add Personal Accident',
    heading: 'Personal accident',
    smallHeading: 'personal accident',
    insuranceType: 7,
    subHeading: 'Select how you’d like to proceed with planning for personal insurance policies.'
  }, {
    value: '5',
    logo: '/assets/images/svg/Householders.svg',
    header: 'Add Householders',
    smallHeading: 'householders',
    insuranceType: 9,
    heading: 'Householders',
    subHeading: 'Select how you’d like to proceed with planning for householders insurance policies.'
  }, {
    value: '6',
    logo: '/assets/images/svg/Fireinsurance.svg',
    header: 'Add Fire Insurance',
    smallHeading: 'fire insurance',
    insuranceType: 10,
    heading: 'Fire insurance',
    subHeading: 'Select how you’d like to proceed with planning for fire insurance policies.'
  },{
    value: '7',
    logo: '/assets/images/svg/Fireinsurance.svg',
    header: 'Add Travel Insurance',
    smallHeading: 'travel insurance',
    insuranceType: 8,
    heading: 'Travel insurance',
    subHeading: 'Select how you’d like to proceed with planning for travel insurance policies.'
  },{
    value: '8',
    logo: '/assets/images/svg/Fireinsurance.svg',
    header: 'Add Motor Insurance',
    smallHeading: 'motor insurance',
    insuranceType: 4,
    heading: 'Motor insurance',
    subHeading: 'Select how you’d like to proceed with planning for motor insurance policies.'
  }]
  insuranceType: number;
  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private custumService: CustomerService, ) { }
  @Output() sendOutput = new EventEmitter();

  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.storeData ='Here you can write recommendations';
    console.log('heder', this.inputData)
    this.insuranceData.forEach(element => {
      if (element.value == this.inputData.value) {
        this.showInsurance = element
        this.insuranceType = element.insuranceType
      }
    });
    this.getdataForm('');
  }
  close(data) {
    if(this.inputData.id){
      this.subInjectService.changeNewRightSliderState({ state: 'close', data });
    }else{
      this.sendOutput.emit(true);
    }
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
  saveData(data) {

  }
  checkRecommendation(value){
    if(!value){
      this.showRecommendation = true;
    }else{
      this.showRecommendation = false
    }
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
