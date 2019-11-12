import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Optional } from '@angular/core';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer/customer.service';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { MAT_DATE_FORMATS } from '@angular/material';

@Component({
  selector: 'app-add-insurance',
  templateUrl: './add-insurance.component.html',
  styleUrls: ['./add-insurance.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },
    // { provide: MAT_DATE_LOCALE, useValue: 'en' },
    // [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class AddInsuranceComponent implements OnInit {
  // displayedColumns: string[] = [  'name', 'amountTable'];
  // dataSource = ELEMENT_DATA;

  // displayedColumns1: string[] = [  'name', 'amountTable'];
  // dataSource1 = ELEMENT_DATA1;

  // displayedColumns2: string[] = [  'name', 'amountTable'];
  // dataSource2 = ELEMENT_DATA2;

  // displayedColumns3: string[] = [  'tpye', 'year', 'amountTable'];
  // dataSource3 = ELEMENT_DATA3;
  advisorId: any;
  islifeAssured: any;
  isproposer: any;
  ispolicyName: any;
  ispolicyNum: any;
  iscommencementDate: any;
  issumAssured: any;
  ispremiumDetailsAmount: any;
  istenureDetailsPolicy: any;
  ispremiumDetailsFrequency: any;
  ispremiumPayingTerm: any;
  ispolicyStatus: any;
  ispolicyStatusLastUnpaid: any;
  editInsuranceData: any;
  insuranceId: any;
  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder, private customerService: CustomerService) { }
  addMoreFlag;
  @ViewChild('chnageScrollPosition', { static: false }) eleRef: ElementRef
  @Input() set insuranceData(data)
  {
    this.setInsuranceDataFormField(data)
  }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.addMoreFlag = false
    this.setValidations(false)
  }
  
  lifeInsuranceForm = this.fb.group({
    lifeAssured: ['', [Validators.required]],
    proposer: ['', [Validators.required]],
    policyName: ['', [Validators.required]],
    policyNum: ['', [Validators.required]],
    commencementDate: ['', [Validators.required]],
    sumAssured: ['', [Validators.required]],
    premiumDetailsAmount: ['', [Validators.required]],
    premiumDetailsFrequency: ['', [Validators.required]],
    tenureDetailsPolicy: ['', [Validators.required]],
    premiumPayingTerm: ['', [Validators.required]],
    policyStatus: ['', [Validators.required]],
    policyStatusLastUnpaid: ['', [Validators.required]]
  })
  keyDetailsForm = this.fb.group({
    riskCover: ['', [Validators.required]],
    surrenderName: ['',[Validators.required]],
    nomineeName: ['', [Validators.required]],
    vestedBonus: ['', [Validators.required]],
    assumedRate: ['', [Validators.required]]
  })
  ridersForm = this.fb.group({
    accidentalBenefit: ['', [Validators.required]],
    doubleAccidental: ['', [Validators.required]],
    termWaiver: ['', [Validators.required]],
    criticalIlleness: ['', [Validators.required]],
    premiumWaiver: ['', [Validators.required]],
    femaleCriticalIlleness: ['', [Validators.required]]
  })
  loanDetailsForm = this.fb.group({
    loanAvailable: ['', [Validators.required]],
    loanTaken: ['', [Validators.required]],
    loanTakenOn: ['', [Validators.required]]
  })
  Miscellaneous = this.fb.group({
    permiumPaymentMode: ['', [Validators.required]],
    advisorName:['', [Validators.required]],
    serviceBranch:['', [Validators.required]]
  })
  getLifeInsuranceFormFields(controlName) {
    return this.lifeInsuranceForm.get(controlName).value
  }
  setInsuranceDataFormField(data)
  {
    console.log(data)
    this.editInsuranceData=data
    if(data==undefined)
    {
      return;
    }
    else{
      // requiredFields
      this.insuranceId=data.id
      this.lifeInsuranceForm.controls.lifeAssured.setValue(data.lifeAssuredName)
      this.lifeInsuranceForm.controls.proposer.setValue('')
      this.lifeInsuranceForm.controls.policyName.setValue(data.policyName)
      this.lifeInsuranceForm.controls.policyNum.setValue(data.policyNumber)
      this.lifeInsuranceForm.controls.commencementDate.setValue(data.commencementDate)
      this.lifeInsuranceForm.controls.sumAssured.setValue(data.sumAssured)
      this.lifeInsuranceForm.controls.premiumDetailsAmount.setValue(data.premiumAmount)
      this.lifeInsuranceForm.controls.premiumDetailsFrequency.setValue(String(data.frequency))
      this.lifeInsuranceForm.controls.tenureDetailsPolicy.setValue(data.policyTenure)
      this.lifeInsuranceForm.controls.premiumPayingTerm.setValue(data.premiumPayingTerm)
      this.lifeInsuranceForm.controls.policyStatus.setValue(String(data.policyStatusId))
      this.lifeInsuranceForm.controls.policyStatusLastUnpaid.setValue('')

      // OptionalFields

      this.keyDetailsForm.controls.riskCover.setValue(data.riskCover)
      this.keyDetailsForm.controls.surrenderName.setValue(data.surrenderValue)
      this.keyDetailsForm.controls.nomineeName.setValue(data.nominee)
      this.keyDetailsForm.controls.vestedBonus.setValue(data.vestedBonus)
      // this.keyDetailsForm.controls.assumedRate.setValue(data)

      this.ridersForm.controls.accidentalBenefit.setValue(data.ridersAccidentalBenifits)
      this.ridersForm.controls.doubleAccidental.setValue(data.ridersDoubleAccidentalBenefit)
      this.ridersForm.controls.termWaiver.setValue(data.ridersTermWaiver)
      this.ridersForm.controls.criticalIlleness.setValue(data.ridersCriticalIllness)
      this.ridersForm.controls.premiumWaiver.setValue(data.ridersPremiumWaiver)
      this.ridersForm.controls.femaleCriticalIlleness.setValue(data.ridersFemaleCriticalIllness)

      this.loanDetailsForm.controls.loanAvailable.setValue(data.loanAvailable)
      this.loanDetailsForm.controls.loanTaken.setValue(data.loanTaken)
      this.loanDetailsForm.controls.loanTakenOn.setValue(data.loanTakenOn)
      
      this.Miscellaneous.controls.permiumPaymentMode.setValue(data.premiumPaymentMode)
      this.Miscellaneous.controls.advisorName.setValue(data.advisorName)
      this.Miscellaneous.controls.serviceBranch.setValue(data.serviceBranch)
    }
  }
  setValidations(flag) {
    this.islifeAssured = flag
    this.isproposer = flag
    this.ispolicyName = flag
    this.ispolicyNum = flag
    this.iscommencementDate = flag
    this.issumAssured = flag
    this.ispremiumDetailsAmount = flag
    this.ispremiumDetailsFrequency = flag
    this.istenureDetailsPolicy = flag
    this.ispremiumPayingTerm = flag
    this.ispolicyStatus = flag
    this.ispolicyStatusLastUnpaid = flag
  }
  openOptionField() {
    (this.addMoreFlag) ? this.addMoreFlag = false : this.addMoreFlag = true;
    this.eleRef.nativeElement.scrollTop = 200
    console.log(this.eleRef.nativeElement.scrollTop)
  }
  saveAddInsurance() {
    if (this.lifeInsuranceForm.get('lifeAssured').invalid) {
      this.islifeAssured = true
      return
    }
    else if (this.lifeInsuranceForm.get('proposer').invalid) {
      this.isproposer = true
      return
    }
    else if (this.lifeInsuranceForm.get('policyName').invalid) {
      this.ispolicyName = true
      return
    }
    else if (this.lifeInsuranceForm.get('policyNum').invalid) {
      this.ispolicyNum = true
      return
    }
    else if (this.lifeInsuranceForm.get('commencementDate').invalid) {
      this.iscommencementDate = true
      return
    }
    else if (this.lifeInsuranceForm.get('sumAssured').invalid) {
      this.issumAssured = true
      return
    }
    else if (this.lifeInsuranceForm.get('premiumDetailsAmount').invalid) {
      this.ispremiumDetailsAmount = true
      return
    }
    else if (this.lifeInsuranceForm.get('premiumDetailsFrequency').invalid) {
      this.ispremiumDetailsFrequency = true
      return
    }
    else if (this.lifeInsuranceForm.get('tenureDetailsPolicy').invalid) {
      this.istenureDetailsPolicy = true
      return
    }
    else if (this.lifeInsuranceForm.get('premiumPayingTerm').invalid) {
      this.ispremiumPayingTerm = true
      return
    }
    else if (this.lifeInsuranceForm.get('policyStatus').invalid) {
      this.ispolicyStatus = true
      return
    }
    else if (this.lifeInsuranceForm.get('policyStatusLastUnpaid').invalid) {
      this.ispolicyStatusLastUnpaid = true
      return
    }
    else {
      let obj = {
        "familyMemberIdLifeAssured": 112233,
        "familyMemberIdProposer": 112233,
        "clientId": 2978,
        "advisorId": this.advisorId,
        "ownerName": "swapnil",
        "commencementDate": this.getLifeInsuranceFormFields('commencementDate'),
        "sumAssured": this.getLifeInsuranceFormFields('sumAssured'),
        "policyStatusId": 1,
        "lastUnpaidPremium": this.getLifeInsuranceFormFields('policyStatusLastUnpaid'),
        "premiumAmount": this.getLifeInsuranceFormFields('premiumDetailsAmount'),
        "frequency": 1,
        "policyTenure": this.getLifeInsuranceFormFields('tenureDetailsPolicy'),
        "premiumPayingTerm": this.getLifeInsuranceFormFields('premiumPayingTerm'),
        "riskCover":this.keyDetailsForm.get('riskCover').value,
        "surrenderValue":this.keyDetailsForm.get('surrenderName').value,
        "nominee":this.keyDetailsForm.get('nomineeName').value,
        "vestedBonus":this.keyDetailsForm.get('vestedBonus').value,
        "assumedRate": 1000,
        "cashflowType": "cash flow 4",
        "cashflowYear": "2020-12-12",
        "cashFlowApproxAmount": 4000,
        "ridersAccidentalBenifits": this.ridersForm.get('accidentalBenefit').value,
        "ridersDoubleAccidentalBenefit":this.ridersForm.get('doubleAccidental').value,
        "ridersTermWaiver":this.ridersForm.get('termWaiver').value,
        "ridersCriticalIllness": this.ridersForm.get('criticalIlleness').value,
        "ridersPremiumWaiver":this.ridersForm.get('premiumWaiver').value,
        "ridersFemaleCriticalIllness": this.ridersForm.get('femaleCriticalIlleness').value,
        "loanAvailable":this.loanDetailsForm.get('loanAvailable').value,
        "loanTaken": this.loanDetailsForm.get('loanTaken').value,
        "loanTakenOn": this.loanDetailsForm.get('loanTakenOn').value,
        "premiumPaymentMode":this.Miscellaneous.get('permiumPaymentMode').value,
        "advisorName":this.Miscellaneous.get('advisorName').value,
        "serviceBranch":this.Miscellaneous.get('serviceBranch').value,
        "policyName": this.getLifeInsuranceFormFields('policyName'),
        "policyTypeId": 1,
        "id":'',
        "policyNumber": this.getLifeInsuranceFormFields('policyNum'),
        
      }
      if(this.editInsuranceData)
      {
        obj.id=this.insuranceId;
       this.customerService.editLifeInsuranceData(obj).subscribe(
         data=>console.log(data)
       )
      }
      else{
        this.customerService.addLifeInsurance(obj).subscribe(
          data => console.log(data)
        )    
      }
    }
  }
  close() {
    this.addMoreFlag = false
    this.subInjectService.changeNewRightSliderState({ state: 'close' });

  }

}

export interface PeriodicElement {
  name: string;
  amountTable: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Life assured', amountTable: 'Rahul Jain' },
  { name: 'Proposer', amountTable: 'Aryan Jain' },
  { name: 'Policy name', amountTable: 'LIC Jeevan Saral' },
  { name: 'Policy type', amountTable: 'Money back' },
  { name: 'Policy number', amountTable: '9090889898' },
  { name: 'Life assured', amountTable: 'Rahul Jain' },
  { name: 'Proposer', amountTable: 'Aryan Jain' },
  { name: 'Policy name', amountTable: 'LIC Jeevan Saral' },
  { name: 'Policy type', amountTable: 'Money back' },
  { name: 'Policy number', amountTable: '9090889898' },
  { name: 'Life assured', amountTable: 'Rahul Jain' },
  { name: 'Proposer', amountTable: 'Aryan Jain' },
  { name: 'Policy name', amountTable: 'LIC Jeevan Saral' },
  { name: 'Policy type', amountTable: 'Money back' },
  { name: 'Policy number', amountTable: '9090889898' },
];


export interface PeriodicElement1 {
  name: string;
  amountTable: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'Life assured', amountTable: 'Rahul Jain' },
  { name: 'Proposer', amountTable: 'Aryan Jain' },
  { name: 'Policy name', amountTable: 'LIC Jeevan Saral' },
  { name: 'Policy type', amountTable: 'Money back' },
  { name: 'Policy number', amountTable: '9090889898' },
];



export interface PeriodicElement2 {
  name: string;
  amountTable: string;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { name: 'Life assured', amountTable: 'Rahul Jain' },
  { name: 'Proposer', amountTable: '-' },
  { name: 'Policy name', amountTable: '-' },

];



export interface PeriodicElement3 {
  tpye: string;
  year: string;
  amountTable: string;

}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { tpye: 'Survival benefit', year: '2024', amountTable: '37,660' },
  { tpye: 'Survival benefit', year: '2029', amountTable: '37,660' },
  { tpye: 'Survival benefit', year: '2034', amountTable: '37,660' },
  { tpye: 'Survival benefit', year: '2049', amountTable: '37,660' },


];