import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Optional } from '@angular/core';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
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
  insuranceSubId: any;
  insuranceTypeId: any;
  insuranceSubTypeId: any;
  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder, private customerService: CustomerService) { }
  addMoreFlag;
  insuranceFormFilledData: any;
  @ViewChild('chnageScrollPosition', { static: false }) eleRef: ElementRef
  @Input() set insuranceData(data) {
    this.setInsuranceDataFormField(data)
    console.log(data)
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
    surrenderName: ['', [Validators.required]],
    nomineeName: ['', [Validators.required]],
    vestedBonus: ['', [Validators.required]],
    assumedRate: ['', [Validators.required]]
  })
  cashFlowForm = this.fb.group({
    cashFlow: this.fb.array([this.fb.group({cashFlowType:null,
      year: null,
      approxAmt: null})])
    // cashFlowType: ['', [Validators.required]],
    // year: ['', [Validators.required]],
    // approxAmt: ['', [Validators.required]],
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
    advisorName: ['', [Validators.required]],
    serviceBranch: ['', [Validators.required]]
  })
  getLifeInsuranceFormFields(controlName) {
    return this.lifeInsuranceForm.get(controlName).value
  }
  get cashFlowEntries() {
    return this.cashFlowForm.get('cashFlow') as FormArray;
  }
    addTransaction(){
      this.cashFlowEntries.push(this.fb.group({ 
        cashFlowType: null,
        year: null,
        approxAmt: null
      }));
    }
    removeTransaction(item){
      this.cashFlowEntries.removeAt(item);
    }
  setInsuranceDataFormField(data) {
    console.log(data.data)
    this.editInsuranceData = data.data
    if (this.editInsuranceData == undefined) {
      this.insuranceTypeId = data.insuranceTypeId
      this.insuranceSubTypeId = data.insuranceSubTypeId
      console.log(this.insuranceTypeId, " ", this.insuranceSubTypeId)
      return;
    }
    else {
      // requiredFields
      this.insuranceId = this.editInsuranceData.id
      this.lifeInsuranceForm.controls.lifeAssured.setValue(this.editInsuranceData.lifeAssuredName)
      this.lifeInsuranceForm.controls.proposer.setValue('')
      this.lifeInsuranceForm.controls.policyName.setValue(this.editInsuranceData.policyName)
      this.lifeInsuranceForm.controls.policyNum.setValue(this.editInsuranceData.policyNumber)
      this.lifeInsuranceForm.controls.commencementDate.setValue(this.editInsuranceData.commencementDate)
      this.lifeInsuranceForm.controls.sumAssured.setValue(this.editInsuranceData.sumAssured)
      this.lifeInsuranceForm.controls.premiumDetailsAmount.setValue(this.editInsuranceData.premiumAmount)
      this.lifeInsuranceForm.controls.premiumDetailsFrequency.setValue(String(this.editInsuranceData.frequency))
      this.lifeInsuranceForm.controls.tenureDetailsPolicy.setValue(this.editInsuranceData.policyTenure)
      this.lifeInsuranceForm.controls.premiumPayingTerm.setValue(this.editInsuranceData.premiumPayingTerm)
      this.lifeInsuranceForm.controls.policyStatus.setValue(String(this.editInsuranceData.policyStatusId))
      this.lifeInsuranceForm.controls.policyStatusLastUnpaid.setValue('')

      // OptionalFields

      this.keyDetailsForm.controls.riskCover.setValue(data.riskCover)
      this.keyDetailsForm.controls.surrenderName.setValue(data.surrenderValue)
      this.keyDetailsForm.controls.nomineeName.setValue(data.nominee)
      this.keyDetailsForm.controls.vestedBonus.setValue(data.vestedBonus)
      // this.keyDetailsForm.controls.assumedRate.setValue(data)

      // this.cashFlowForm.controls.cashFlowType.setValue(data.cashFlowType)
      // this.cashFlowForm.controls.year.setValue(data.year)
      // this.cashFlowForm.controls.approxAmt.setValue(data.approxAmt)

      // if (data.cashFlows != undefined) {
      //   data.cashFlows.forEach(element => {
      //     this.cashFlowForm.controls.cashFlow.push(this.fb.group({
      //       name: [(element.name) + "", [Validators.required]],
      //       ownershipPer: [(element.ownershipPer + ""), Validators.required]
      //     }))
      //   })
      //   this.cashFlowEntries.removeAt(0);
      // }

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
      this.insuranceFormFilledData = {
        "familyMemberIdLifeAssured": 112233,
        "familyMemberIdProposer": 112233,
        "clientId": 2978,
        "advisorId": this.advisorId,
        "ownerName": "swapnil",
        "commencementDate": this.lifeInsuranceForm.get('commencementDate').value._d,
        "maturityDate": "2025-12-12",
        "sumAssured": this.getLifeInsuranceFormFields('sumAssured'),
        "policyStatusId": 1,
        "lastUnpaidPremium": this.getLifeInsuranceFormFields('policyStatusLastUnpaid'),
        "premiumAmount": this.getLifeInsuranceFormFields('premiumDetailsAmount'),
        "frequency": 1,
        "policyTenure": this.getLifeInsuranceFormFields('tenureDetailsPolicy'),
        "premiumPayingTerm": this.getLifeInsuranceFormFields('premiumPayingTerm'),
        "riskCover": this.keyDetailsForm.get('riskCover').value,
        "surrenderValue": this.keyDetailsForm.get('surrenderName').value,
        "nominee": this.keyDetailsForm.get('nomineeName').value,
        "vestedBonus": this.keyDetailsForm.get('vestedBonus').value,
        "assumedRate": 1000,
        "cashflowType": this.cashFlowForm.get('cashFlowType').value,
        "cashflowYear": this.cashFlowForm.get('year').value,
        "cashFlowApproxAmount": this.cashFlowForm.get('approxAmt').value,
        "ridersAccidentalBenifits": this.ridersForm.get('accidentalBenefit').value,
        "ridersDoubleAccidentalBenefit": this.ridersForm.get('doubleAccidental').value,
        "ridersTermWaiver": this.ridersForm.get('termWaiver').value,
        "ridersCriticalIllness": this.ridersForm.get('criticalIlleness').value,
        "ridersPremiumWaiver": this.ridersForm.get('premiumWaiver').value,
        "ridersFemaleCriticalIllness": this.ridersForm.get('femaleCriticalIlleness').value,
        "loanAvailable": this.loanDetailsForm.get('loanAvailable').value,
        "loanTaken": this.loanDetailsForm.get('loanTaken').value,
        "loanTakenOn": this.loanDetailsForm.get('loanTakenOn').value,
        "premiumPaymentMode": this.Miscellaneous.get('permiumPaymentMode').value,
        "advisorName": this.Miscellaneous.get('advisorName').value,
        "serviceBranch": this.Miscellaneous.get('serviceBranch').value,
        "policyName": this.getLifeInsuranceFormFields('policyName'),
        "policyTypeId": 1,
        "insuranceTypeId": this.insuranceTypeId,
        "insuranceSubTypeId": this.insuranceSubTypeId,
        "policyNumber": this.getLifeInsuranceFormFields('policyNum')
        // "id":''
      }
      console.log(this.insuranceFormFilledData)
      if (this.editInsuranceData) {
        this.insuranceFormFilledData.id = this.insuranceId;
        this.customerService.editLifeInsuranceData(this.insuranceFormFilledData).subscribe(
          data => console.log(data)
        )
      }
      else {
        this.customerService.addLifeInsurance(this.insuranceFormFilledData).subscribe(
          data => console.log(data)
        )
      }
    }
  }
  addLifeInsuranceResponse(data) {
    console.log("add life insurance data", data)
    this.close();
  }
  editLifeInsuranceDataResponse(data) {
    console.log("edit life insurance data", data)
    this.close();
  }

  close() {
    this.addMoreFlag = false
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}