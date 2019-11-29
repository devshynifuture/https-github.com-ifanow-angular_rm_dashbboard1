import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Optional } from '@angular/core';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer/customer.service';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { MAT_DATE_FORMATS } from '@angular/material';
import * as _ from 'lodash';
import { element } from 'protractor';
import { DataComponent } from '../../../../../../interfaces/data.component';

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
export class AddInsuranceComponent implements OnInit, DataComponent {
  /*_data;
  @Input()
  set data(inputData) {
    this._data = inputData;
  }

  get data() {
    return this._data;
  }*/
  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder, private customerService: CustomerService) {
  }

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.setInsuranceDataFormField(data);
    this.getFamilyMemberList();
    console.log(data);
  }

  get cashFlowEntries() {
    return this.cashFlowForm.get('cashFlow') as FormArray;
  }
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
  clientId: any;
  options: void;
  policyData: any;
  FamilyMember: any;
  familyMemberLifeData: any;
  familyMemberProposerData: any;
  ProposerData: any;
  selectedProposerData: any;
  finalCashFlowData: any[];

  addMoreFlag;
  insuranceFormFilledData: any;
  @ViewChild('chnageScrollPosition', { static: false }) eleRef: ElementRef;

  lifeInsuranceForm = this.fb.group({
    lifeAssured: [, [Validators.required]],
    proposer: [, [Validators.required]],
    policyName: [, [Validators.required]],
    policyNum: [, [Validators.required]],
    commencementDate: [, [Validators.required]],
    sumAssured: [, [Validators.required]],
    premiumDetailsAmount: [, [Validators.required]],
    premiumDetailsFrequency: [, [Validators.required]],
    tenureDetailsPolicy: [, [Validators.required]],
    premiumPayingTerm: [, [Validators.required]],
    policyStatus: [, [Validators.required]],
    policyStatusLastUnpaid: [, [Validators.required]]
  });
  keyDetailsForm = this.fb.group({
    riskCover: [, [Validators.required]],
    surrenderName: [, [Validators.required]],
    nomineeName: [, [Validators.required]],
    vestedBonus: [, [Validators.required]],
    assumedRate: [, [Validators.required]],
    fundValue: []
  });
  cashFlowForm = this.fb.group({
    cashFlow: this.fb.array([this.fb.group({
      cashFlowType: null,
      year: null,
      approxAmt: null
    })])
  });
  ridersForm = this.fb.group({
    accidentalBenefit: [, [Validators.required]],
    doubleAccidental: [, [Validators.required]],
    termWaiver: [, [Validators.required]],
    criticalIlleness: [, [Validators.required]],
    premiumWaiver: [, [Validators.required]],
    femaleCriticalIlleness: [, [Validators.required]]
  });
  loanDetailsForm = this.fb.group({
    loanAvailable: [, [Validators.required]],
    loanTaken: [, [Validators.required]],
    loanTakenOn: [, [Validators.required]]
  });
  Miscellaneous = this.fb.group({
    permiumPaymentMode: [, [Validators.required]],
    advisorName: [, [Validators.required]],
    serviceBranch: [, [Validators.required]]
  });

  ngOnInit() {
    this.addMoreFlag = false;
  }

  addTransaction() {
    this.cashFlowEntries.push(this.fb.group({
      cashFlowType: null,
      year: null,
      approxAmt: null
    }));
  }

  removeTransaction(item) {
    this.cashFlowEntries.removeAt(item);
  }

  setInsuranceDataFormField(data) {
    console.log(data.data);
    this.editInsuranceData = data.data;
    if (this.editInsuranceData == undefined) {
      console.log(this.insuranceTypeId, " ", this.insuranceSubTypeId)
      return;
    } else {
      // requiredFields
      this.insuranceId = this.editInsuranceData.id
      this.lifeInsuranceForm.controls.lifeAssured.setValue(this.editInsuranceData.lifeAssuredName)
      this.lifeInsuranceForm.controls.proposer.setValue(this.editInsuranceData.familyMemberName)
      this.lifeInsuranceForm.controls.policyName.setValue(this.editInsuranceData.policyName)
      this.lifeInsuranceForm.controls.policyNum.setValue(this.editInsuranceData.policyNumber)
      this.lifeInsuranceForm.controls.commencementDate.setValue(new Date(this.editInsuranceData.commencementDate))
      this.lifeInsuranceForm.controls.sumAssured.setValue(this.editInsuranceData.sumAssured)
      this.lifeInsuranceForm.controls.premiumDetailsAmount.setValue(this.editInsuranceData.premiumAmount)
      this.lifeInsuranceForm.controls.premiumDetailsFrequency.setValue(String(this.editInsuranceData.frequency))
      this.lifeInsuranceForm.controls.tenureDetailsPolicy.setValue(String(this.editInsuranceData.policyTenure))
      this.lifeInsuranceForm.controls.premiumPayingTerm.setValue(this.editInsuranceData.premiumPayingTerm)
      this.lifeInsuranceForm.controls.policyStatus.setValue(String(this.editInsuranceData.policyStatusId))
      this.lifeInsuranceForm.controls.policyStatusLastUnpaid.setValue('')
      this.insuranceTypeId = this.editInsuranceData.insuranceTypeId
      this.insuranceSubTypeId = this.editInsuranceData.insuranceSubTypeId
      this.policyData = {}
      this.policyData.id = this.editInsuranceData.policyId,
        this.policyData.policyTypeId = this.editInsuranceData.policyTypeId,
        // OptionalFields

        this.keyDetailsForm.controls.riskCover.setValue(this.editInsuranceData.riskCover);
      this.keyDetailsForm.controls.surrenderName.setValue(this.editInsuranceData.surrenderValue);
      this.keyDetailsForm.controls.nomineeName.setValue(this.editInsuranceData.nominee);
      this.keyDetailsForm.controls.vestedBonus.setValue(this.editInsuranceData.vestedBonus);
      this.keyDetailsForm.controls.assumedRate.setValue(this.editInsuranceData.assumedRate);

      // this.cashFlowForm.controls.cashFlowType.setValue(this.editInsuranceData.cashFlowType)
      // this.cashFlowForm.controls.year.setValue(this.editInsuranceData.year)
      // this.cashFlowForm.controls.approxAmt.setValue(this.editInsuranceData.approxAmt)
      this.finalCashFlowData = [];
      if (this.editInsuranceData.insuranceCashflowList != undefined) {
        this.editInsuranceData.insuranceCashflowList.forEach(element => {
          (this.cashFlowForm.controls.cashFlow as FormArray).push(this.fb.group({
            cashFlowType: [element.cashFlowType, [Validators.required]],
            year: [element.cashFlowYear, Validators.required],
            approxAmt: [(element.cashFlowApproxAmount + ''), Validators.required]
          }));
          const obj = {
            cashFlowType: element.cashFlowType,
            cashFlowYear: element.cashFlowYear,
            cashFlowApproxAmount: element.cashFlowApproxAmount
          };
          this.finalCashFlowData.push(obj);
        });
        this.cashFlowEntries.removeAt(0);
      }

      console.log(this.cashFlowForm);

      this.ridersForm.controls.accidentalBenefit.setValue(this.editInsuranceData.ridersAccidentalBenifits);
      this.ridersForm.controls.doubleAccidental.setValue(this.editInsuranceData.ridersDoubleAccidentalBenefit);
      this.ridersForm.controls.termWaiver.setValue(this.editInsuranceData.ridersTermWaiver);
      this.ridersForm.controls.criticalIlleness.setValue(this.editInsuranceData.ridersCriticalIllness);
      this.ridersForm.controls.premiumWaiver.setValue(this.editInsuranceData.ridersPremiumWaiver);
      this.ridersForm.controls.femaleCriticalIlleness.setValue(this.editInsuranceData.ridersFemaleCriticalIllness);

      this.loanDetailsForm.controls.loanAvailable.setValue(this.editInsuranceData.loanAvailable);
      this.loanDetailsForm.controls.loanTaken.setValue(this.editInsuranceData.loanTaken);
      this.loanDetailsForm.controls.loanTakenOn.setValue(new Date(this.editInsuranceData.loanTakenOn));

      this.Miscellaneous.controls.permiumPaymentMode.setValue(this.editInsuranceData.premiumPaymentMode);
      this.Miscellaneous.controls.advisorName.setValue(this.editInsuranceData.advisorName);
      this.Miscellaneous.controls.serviceBranch.setValue(this.editInsuranceData.serviceBranch);
    }
    this.getFamilyMemberList();
  }

  getFamilyMemberList() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
    };
    this.customerService.getListOfFamilyByClient(obj).subscribe(
      data => this.getFamilyMemberListRes(data)
    );
  }

  getFamilyMemberListRes(data) {
    console.log(data);
    this.FamilyMember = data.familyMembersList;
    this.ProposerData = Object.assign([], data.familyMembersList);
    console.log('Proposer data', this.ProposerData);
  }

  getFamilyMember(data, index) {
    this.familyMemberLifeData = data;
    console.log('family Member', this.FamilyMember);
  }

  getProposerData(data, index) {
    this.selectedProposerData = data;
  }

  findPolicyName(data) {
    const inpValue = this.lifeInsuranceForm.get('policyName').value;
    const obj = {
      policyName: inpValue
    };
    this.customerService.getPolicyName(obj).subscribe(
      data => {
        console.log(data.policyDetails);
        this.options = data.policyDetails;
      }
    );
  }

  selectPolicy(policy) {
    this.policyData = policy;
    this.insuranceTypeId = policy.insuranceTypeId;
    this.insuranceSubTypeId = policy.insuranceSubTypeId;
  }

  openOptionField() {
    (this.addMoreFlag) ? this.addMoreFlag = false : this.addMoreFlag = true;
    this.eleRef.nativeElement.scrollTop = 200;
    console.log(this.eleRef.nativeElement.scrollTop);
  }

  getCashFlowData() {

  }

  saveAddInsurance() {
    let finalCashFlowList = [];
    let cashFlowArray = this.cashFlowForm.get('cashFlow') as FormArray
    cashFlowArray.controls.forEach(element => {
      let obj =
      {
        cashFlowType: element.get('cashFlowType').value,
        cashFlowYear: element.get('year').value,
        cashFlowApproxAmount: element.get('approxAmt').value
      }
      finalCashFlowList.push(obj)
    })
    this.lifeInsuranceForm.get('policyName').value
    if (this.lifeInsuranceForm.get('lifeAssured').invalid) {
      return
    }
    else if (this.lifeInsuranceForm.get('proposer').invalid) {
      return
    }
    else if (this.lifeInsuranceForm.get('policyName').invalid) {
      return
    }
    else if (this.lifeInsuranceForm.get('policyNum').invalid) {
      return
    }
    else if (this.lifeInsuranceForm.get('commencementDate').invalid) {
      return
    }
    else if (this.lifeInsuranceForm.get('sumAssured').invalid) {
      return
    }
    else if (this.lifeInsuranceForm.get('premiumDetailsAmount').invalid) {
      return
    }
    else if (this.lifeInsuranceForm.get('premiumDetailsFrequency').invalid) {
      return
    }
    else if (this.lifeInsuranceForm.get('tenureDetailsPolicy').invalid) {
      return
    }
    else if (this.lifeInsuranceForm.get('premiumPayingTerm').invalid) {
      return
    }
    else if (this.lifeInsuranceForm.get('policyStatus').invalid) {
      return
    }
    else if (this.lifeInsuranceForm.get('policyStatusLastUnpaid').invalid) {
      return
    }
    else {

      this.insuranceFormFilledData =
        {
          "familyMemberIdLifeAssured": this.familyMemberLifeData.id,
          "familyMemberIdProposer": this.selectedProposerData.id,
          "clientId": this.clientId,
          "advisorId": this.advisorId,
          "ownerName": "",
          "commencementDate": this.lifeInsuranceForm.get('commencementDate').value._d,
          "sumAssured": this.lifeInsuranceForm.get('sumAssured').value,
          "policyStatusId": this.lifeInsuranceForm.get('policyStatus').value,
          "lastUnpaidPremium": this.lifeInsuranceForm.get('policyStatusLastUnpaid').value,
          "premiumAmount": this.lifeInsuranceForm.get('premiumDetailsAmount').value,
          "frequency": this.lifeInsuranceForm.get('premiumDetailsFrequency').value,
          "policyTenure": this.lifeInsuranceForm.get('tenureDetailsPolicy').value,
          "premiumPayingTerm": this.lifeInsuranceForm.get('premiumPayingTerm').value,
          "riskCover": this.keyDetailsForm.get('riskCover').value,
          "surrenderValue": this.keyDetailsForm.get('surrenderName').value,
          "nominee": this.keyDetailsForm.get('nomineeName').value,
          "vestedBonus": this.keyDetailsForm.get('vestedBonus').value,
          "assumedRate": this.keyDetailsForm.get('assumedRate').value,
          "loanAvailable": this.loanDetailsForm.get('loanAvailable').value,
          "loanTaken": this.loanDetailsForm.get('loanTaken').value,
          "loanTakenOn": this.loanDetailsForm.get('loanTakenOn').value,
          "premiumPaymentMode": this.Miscellaneous.get('permiumPaymentMode').value,
          "advisorName": this.Miscellaneous.get('advisorName').value,
          "serviceBranch": this.Miscellaneous.get('serviceBranch').value,
          "policyId": this.policyData.id,
          "policyTypeId": this.policyData.policyTypeId,
          "description": "test data life insurance 22",
          "insuranceTypeId": this.insuranceTypeId,
          "insuranceSubTypeId": this.insuranceSubTypeId,
          "ridersAccidentalBenifits": this.ridersForm.get('accidentalBenefit').value,
          "ridersDoubleAccidentalBenefit": this.ridersForm.get('doubleAccidental').value,
          "ridersTermWaiver": this.ridersForm.get('termWaiver').value,
          "ridersCriticalIllness": this.ridersForm.get('criticalIlleness').value,
          "ridersPremiumWaiver": this.ridersForm.get('premiumWaiver').value,
          "ridersFemaleCriticalIllness": this.ridersForm.get('femaleCriticalIlleness').value,
          "insuranceCashflowList": finalCashFlowList
        }
      console.log(this.insuranceFormFilledData)
      const insuranceData =
      {
        insuranceTypeId: this.insuranceTypeId,
        insuranceSubTypeId: this.insuranceSubTypeId
      }
      if (this.editInsuranceData) {
        this.insuranceFormFilledData['id'] = this.editInsuranceData.id;
        this.insuranceFormFilledData['commencementDate'] = this.lifeInsuranceForm.get('commencementDate').value;
        this.customerService.editLifeInsuranceData(this.insuranceFormFilledData).subscribe(
          data => {
            console.log(data);
            const insuranceData =
            {
              insuranceTypeId: this.insuranceTypeId,
              insuranceSubTypeId: this.insuranceSubTypeId
            }
            this.close(insuranceData)
          }
        );
      } else {
        this.customerService.addLifeInsurance(this.insuranceFormFilledData).subscribe(
          data => {
            console.log(data);
            this.close(insuranceData)
          }
        );
      }
    }
  }

  close(data) {
    this.addMoreFlag = false;
    this.subInjectService.changeNewRightSliderState({ state: 'close', data });
  }

}
