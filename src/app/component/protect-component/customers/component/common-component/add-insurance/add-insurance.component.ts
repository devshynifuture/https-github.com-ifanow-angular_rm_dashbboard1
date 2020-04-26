import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Optional, ViewChildren, QueryList } from '@angular/core';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer/customer.service';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { DataComponent } from '../../../../../../interfaces/data.component';
import { ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

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
  maxDate = new Date();
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  ownerName: any;
  familyMemberId: any;
  ownerData: any;
  callMethod:any;
  /*_data;
  @Input()
  set data(inputData) {
    this._data = inputData;
  }

  get data() {
    return this._data;
  }*/
  constructor(private eventService: EventService, private subInjectService: SubscriptionInject, private fb: FormBuilder, private customerService: CustomerService) {
  }
  validatorType = ValidatorType
  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getFamilyMemberList();
    this.setInsuranceDataFormField(data);
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
  nomineesListFM: any = [];
  nomineesList: any[] = [];

  addMoreFlag;
  insuranceFormFilledData: any;
  @ViewChild('chnageScrollPosition', { static: false }) eleRef: ElementRef;

  lifeInsuranceForm = this.fb.group({
    lifeAssured: [],
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
    policyStatusLastUnpaid: [, [Validators.required]],
    getCoOwnerName: this.fb.array([this.fb.group({
      name: ['', [Validators.required]],
      share: [0,],
      familyMemberId: 0,
      id: 0,
      isClient: 0
    })]),
  });
  keyDetailsForm = this.fb.group({
    riskCover: [, [Validators.required]],
    surrenderName: [, [Validators.required]],
    nomineeName: [, [Validators.required]],
    vestedBonus: [, [Validators.required]],
    assumedRate: [, [Validators.required]],
    fundValue: [],
    getNomineeName: this.fb.array([this.fb.group({
      name: [''],
      sharePercentage: [0],
      familyMemberId: [0],
      id: [0]
    })]),
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

  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }

  lisNominee(value) {
    this.ownerData.Fmember = value;
    this.nomineesListFM = Object.assign([], value);
  }
  getFamilyMember(data, index) {
    this.familyMemberLifeData = data;
    console.log('family Member', this.FamilyMember);
  }


  disabledMember(value, type) {
    this.callMethod = {
      methodName: "disabledMember",
      ParamValue: value,
      disControl: type
    }
  }

  displayControler(con) {
    console.log('value selected', con);
    if (con.owner != null && con.owner) {
      this.lifeInsuranceForm.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.lifeInsuranceForm.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: "onChangeJointOwnership",
      ParamValue: data
    }
  }
  /***owner***/
  get getCoOwner() {
    return this.lifeInsuranceForm.get('getCoOwnerName') as FormArray;
  }
  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '', [Validators.required]], share: [data ? data.share : ''], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0]
    }));
    if (data) {
      setTimeout(() => {
        this.disabledMember(null, null);
      }, 1300);
    }

    if (this.getCoOwner.value.length > 1 && !data) {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        }
        else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }

  }

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
    if (this.lifeInsuranceForm.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    } else {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        }
        else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }
    this.disabledMember(null, null);
  }
  /***owner***/

  /***nominee***/

  get getNominee() {
    return this.keyDetailsForm.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.keyDetailsForm.value.getNomineeName.length == 1) {
      this.getNominee.controls['0'].get('sharePercentage').setValue('100');
    } else {
      let share = 100 / this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        }
        else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }
  }



  addNewNominee(data) {
    this.getNominee.push(this.fb.group({
      name: [data ? data.name : ''], sharePercentage: [data ? data.sumInsured : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0]
    }));
    if (!data || this.getNominee.value.length < 1) {
      for (let e in this.getNominee.controls) {
        this.getNominee.controls[e].get('sharePercentage').setValue(0);
      }
    }

    if (this.getNominee.value.length > 1 && !data) {
      let share = 100 / this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        }
        else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }


  }
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
  preventDefault(e) {
    e.preventDefault();
  }

  removeTransaction(item) {
    this.cashFlowEntries.removeAt(item);
  }

  setInsuranceDataFormField(data) {
    console.log(data.data);
    this.editInsuranceData = data.data;
    if (this.editInsuranceData == undefined) {
      console.log(this.insuranceTypeId, " ", this.insuranceSubTypeId)
      this.ownerData = { Fmember: this.nomineesListFM, controleData: this.lifeInsuranceForm }
      return;
    } else {
      // requiredFields
      this.insuranceId = this.editInsuranceData.id
      // this.lifeInsuranceForm.controls.lifeAssured.setValue(this.editInsuranceData.lifeAssuredName)
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
      this.lifeInsuranceForm.controls.policyStatusLastUnpaid.setValue(this.editInsuranceData.lastUnpaidPremium)
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
      if (this.editInsuranceData) {
        this.getCoOwner.removeAt(0);
        const data={
          name:this.editInsuranceData.lifeAssuredName,
          familyMemberId:this.editInsuranceData.familyMemberIdLifeAssured
        }
          this.addNewCoOwner(data);
      }
  
      /***owner***/
  
      /***nominee***/
      if (this.editInsuranceData.nominees) {
        this.getNominee.removeAt(0);
        this.editInsuranceData.nominees.forEach(element => {
          this.addNewNominee(element);
        });
      }
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
      this.ownerData = { Fmember: this.nomineesListFM, controleData: this.lifeInsuranceForm }
    }

    this.getFamilyMemberList();
  }
  getFamilyData(value,data){

    data.forEach(element => {
      for (let e in this.getNominee.controls) {
        let name = this.getNominee.controls[e].get('name')
        if(element.userName == name.value){
          this.getNominee.controls[e].get('name').setValue(element.userName);
          this.getNominee.controls[e].get('familyMemberId').setValue(element.id);
        }
      }
     
    });
    

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

  // getFamilyMember(data, index) {
  //   this.familyMemberLifeData = data;
  //   console.log('family Member', this.FamilyMember);
  // }

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
  getFamilyMemberIdSelectedData(data){
    this.ProposerData.forEach(element => {
      if(element.userName == data){
        this.selectedProposerData = element;
      }
    });
  }
  getCashFlowData() {

  }

  saveAddInsurance() {
    this.getFamilyMemberIdSelectedData(this.lifeInsuranceForm.get('proposer').value);
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
    this.lifeInsuranceForm.get('policyName').value;

    if (this.lifeInsuranceForm.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.lifeInsuranceForm.markAllAsTouched();
      return
    }
    else {

      this.insuranceFormFilledData =
      {
        "familyMemberIdLifeAssured":this.lifeInsuranceForm.value.getCoOwnerName[0].familyMemberId,
        // "familyMemberIdLifeAssured": this.familyMemberLifeData.id,
        "familyMemberIdProposer": (this.selectedProposerData) ? this.selectedProposerData.id : null,
        "clientId": this.clientId,
        "advisorId": this.advisorId,
        "ownerName": "",
        "commencementDate": this.lifeInsuranceForm.get('commencementDate').value,
        "policyNumber": this.lifeInsuranceForm.get('policyNum').value,
        "policyName": this.lifeInsuranceForm.get('policyName').value,
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
        "insuranceCashflowList": finalCashFlowList,
        "nominees": this.keyDetailsForm.value.getNomineeName,

      }
      this.insuranceFormFilledData.policyStatusId = parseInt(this.insuranceFormFilledData.policyStatusId)
      if (this.insuranceFormFilledData.nominees.length > 0) {
        this.insuranceFormFilledData.nominees.forEach((element, index) => {
          if (element.name == '') {
            this.removeNewNominee(index);
          }
        });
        this.insuranceFormFilledData.nominees = this.keyDetailsForm.value.getNomineeName;
        this.insuranceFormFilledData.nominees.forEach(element => {
          if(element.sharePercentage){
            element.sumInsured = element.sharePercentage;
          }
           element.insuredOrNominee = 2
         });
      } else {
        this.insuranceFormFilledData.nominees = [];
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
            this.eventService.openSnackBar("Updated successfully!", 'dismiss');
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
            this.eventService.openSnackBar("Added successfully!", 'dismiss');
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
