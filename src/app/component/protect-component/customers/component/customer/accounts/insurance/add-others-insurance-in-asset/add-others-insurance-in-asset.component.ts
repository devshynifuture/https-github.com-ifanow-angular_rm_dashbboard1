import { Component, OnInit, QueryList, ViewChildren, Input } from '@angular/core';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { ValidatorType } from 'src/app/services/util.service';
import { MatInput, MatDialog } from '@angular/material';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';

@Component({
  selector: 'app-add-others-insurance-in-asset',
  templateUrl: './add-others-insurance-in-asset.component.html',
  styleUrls: ['./add-others-insurance-in-asset.component.scss']
})
export class AddOthersInsuranceInAssetComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  maxDate = new Date();
  minDate = new Date();
  inputData: any;
  ownerName: any;
  nomineesListFM: any = [];
  accountList: any = [];
  familyMemberId: any;
  advisorId: any;
  clientId: any;
  insuranceId: any;
  addMoreFlag = false;
  FamilyMember: any;
  ProposerData: any;
  familyMemberLifeData: any;
  nominees: any[];
  flag: string;
  ownerData: any;
  callMethod: any;
  otherAssetForm: any;
  displayList: any;
  nomineesList: any[] = [];
  policyList: any;
  addOns: any;
  dataForEdit: any;
  bankList: any;
  bankAccountDetails: any;
  id: any;
  floaterOrIndividual = false;
  validatorType = ValidatorType;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  showSumAssured = false;
  showinsuredMemberSum = true;
  showDeductibleSum = false;
  insuredMemberList: any;
  options: any;
  showHeader: any;
  clientData: any;

  constructor(private cusService:CustomerService,private enumService: EnumServiceService, private datePipe: DatePipe, private fb: FormBuilder, private subInjectService: SubscriptionInject, private customerService: CustomerService, private eventService: EventService, private dialog: MatDialog) {
  }

  get data() {
    return this.inputData;
  }

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.clientData = AuthService.getClientData();
    this.inputData = data;
    this.policyList = data.displayList.policyTypes;
    this.addOns = data.displayList.addOns;
    this.showHeader = data.flag;
    this.getFamilyMemberList();
    this.getdataForm(data);
    this.getBank();
    // this.setInsuranceDataFormField(data);
    console.log(data);
  }

  /***owner***/
  get getCoOwner() {
    return this.otherAssetForm.get('getCoOwnerName') as FormArray;
  }

  get insuredMembersForm() {
    return this.otherAssetForm.get('InsuredMemberForm') as FormArray;
  }
  get addOnForm() {
    return this.otherAssetForm.get('addOnForm') as FormArray;
  }
  get planFeatureForm() {
    return this.otherAssetForm.get('planFeatureForm') as FormArray;
  }
  /***nominee***/

  get getNominee() {
    return this.otherAssetForm.get('getNomineeName') as FormArray;
  }

  // bankAccountList(value) {
  //     this.bankList = value;
  // }

  getFormDataNominee(data) {
    console.log(data);
    this.nomineesList = data.controls;
  }

  display(value) {
    console.log('value selected', value);
    this.ownerName = value.userName;
    // this.familyMemberId = value.id
    this.familyMemberId = value.familyMemberId;

  }

  lisNominee(value) {
    this.ownerData.Fmember = value;
    this.nomineesListFM = Object.assign([], value);
    this.insuredMemberList = Object.assign([], value);
    this.insuredMemberList.forEach(item => item.isDisabled = false);

  }

  // getFamilyMember(data, index) {
  //     this.familyMemberLifeData = data;
  //     console.log('family Member', this.FamilyMember);
  // }

  disabledMember(value, type) {
    this.callMethod = {
      methodName: 'disabledMember',
      ParamValue: value,
      disControl: type
    };
  }

  displayControler(con) {
    console.log('value selected', con);
    if (con.owner != null && con.owner) {
      this.otherAssetForm.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.otherAssetForm.controls.getNomineeName = con.nominee;
    }
  }

  // get addBankAccount() {
  //   return this.otherAssetForm.get('addBankAccount') as FormArray;
  // }
  findCompanyName(data) {
    const inpValue = this.otherAssetForm.get('insurerName').value;
    this.customerService.getCompanyNames(inpValue).subscribe(
      data => {
        console.log(data);
        this.options = data;
        if (data.length > 0) {
          this.options = data;
        } else {
          this.otherAssetForm.controls.insurerName.setErrors({ erroInPolicy: true });
          this.otherAssetForm.get('insurerName').markAsTouched();
        }
      },
      err => {
        this.otherAssetForm.controls.insurerName.setErrors({ erroInPolicy: true });
        this.otherAssetForm.get('insurerName').markAsTouched();
      }
    );
  }

  getBank() {
    if (this.enumService.getBank().length > 0) {
      this.bankList = this.enumService.getBank();
    }
    else {
      this.bankList = [];
    }
    console.log(this.bankList, "this.bankList2");
  }
  changeType(value){
    if (this.otherAssetForm.get('floaterOrIndividual').value == true) {
      this.showSumAssured = true
      this.showinsuredMemberSum = false
      let list = this.otherAssetForm.get('InsuredMemberForm') as FormArray;
      list.controls.forEach(element => {
          element.get('sumAssured').setValue(null);
          if (element.get('sumAssured').value == '' || element.get('sumAssured').value == null) {
              element.get('sumAssured').setErrors(null);
              element.get('sumAssured').setValidators(null);
          }
      });
      if (!this.otherAssetForm.controls['sumAssuredIdv'].value) {
          this.otherAssetForm.controls['sumAssuredIdv'].setValue(null);
          this.otherAssetForm.get('sumAssuredIdv').setValidators([Validators.required]);
          this.otherAssetForm.get('sumAssuredIdv').updateValueAndValidity();
          this.otherAssetForm.controls['sumAssuredIdv'].setErrors({ 'required': true });
      }
  } else {
      this.showSumAssured = false
      this.showinsuredMemberSum = true
      this.otherAssetForm.controls['sumAssuredIdv'].setValue(null);
      this.otherAssetForm.controls['sumAssuredIdv'].setErrors(null);
      this.otherAssetForm.controls['sumAssuredIdv'].setValidators(null);
  }
  }
  openDialog(eventData): void {
    const dialogRef = this.dialog.open(LinkBankComponent, {
      width: '50%',
      data: { bankList: this.bankList, userInfo: true, ownerList: this.getCoOwner }
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.bankList = this.enumService.getBank();
      }, 5000);
    })

  }
  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: 'onChangeJointOwnership',
      ParamValue: data
    };
  }
  addNewAddOns(data) {
    this.addOnForm.push(this.fb.group({
      addOns: [data ? data.addOns + '' : ''],
      sumInsured: [data ? data.sumInsured : ''],
      id: [data ? data.id : ''],
      isActive: [data ? data.isActive : ''],
      isEdited: [data ? data.isEdited : ''],
      otherInsuranceId: [this.dataForEdit ? this.dataForEdit.id : null],
    }));
  }
  removeNewAddOns(item, element) {
    let finalFeatureList = this.otherAssetForm.get('addOnForm') as FormArray
    if (finalFeatureList.length > 1) {
      this.addOnForm.removeAt(item);

    }
    if (element.value.id) {
      this.customerService.deleteOtherAddonInsurance(element.value.id).subscribe(data => {

      });
    }
  }
  addNewFeature(data) {
    this.planFeatureForm.push(this.fb.group({
      feature: [data ? data.feature + '' : ''],
      id: [data ? data.id : null],
      isDeleted: [data ? data.isDeleted: null],
      isEdited: [data ? data.isEdited  : null],
      otherInsuranceId: [this.dataForEdit ? this.dataForEdit.id : null],
    }));
  }
  removeNewFeature(item, element) {
    let finalFeatureList = this.otherAssetForm.get('planFeatureForm') as FormArray
    if (finalFeatureList.length > 1) {
      this.planFeatureForm.removeAt(item);

    }
    if (element.value.id) {
      this.customerService.deleteOtherFeatureInsurance(element.value.id).subscribe(data => {

      });
    }
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '', [Validators.required]],
      share: [data ? data.share : ''],
      familyMemberId: [data ? data.familyMemberId : 0],
      id: [data ? data.id : 0],
      isClient: [data ? data.isClient : 0],
      clientId: [data ? data.clientId : 0],
      userType: [data ? data.userType : 0]

    }));
    if (data) {
      setTimeout(() => {
        this.disabledMember(null, null);
      }, 1300);
    }

    if (this.getCoOwner.value.length > 1 && !data) {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        } else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }

  }

  /***owner***/

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
    if (this.otherAssetForm.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    } else {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        } else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }
    this.disabledMember(null, null);
  }

  removeNewNominee(item,element) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.otherAssetForm.value.getNomineeName.length == 1) {
      this.getNominee.controls['0'].get('sharePercentage').setValue('100');
    } else {
      let share = 100 / this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        } else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }
    if (element && element.value.id) {
      this.customerService.deleteNomineeonInsurance(element.value.id).subscribe(data => {

      });
    }
  }


  addNewNominee(data) {
    this.getNominee.push(this.fb.group({
      name: [data ? data.name : ''],
      sharePercentage: [data ? data.sharePercentage : 0],
      familyMemberId: [data ? data.familyMemberId : 0],
      id: [data ? data.id : 0],
      isClient: [data ? (data.familyMemberId == this.clientId ? 1 : 0) : 0],
      relationshipId: [data ? data.relationshipId : 0]
    }));
    if (!data || this.getNominee.value.length < 1) {
      for (let e in this.getNominee.controls) {
        this.getNominee.controls[e].get('sharePercentage').setValue(0);
      }
    }

    if (this.getNominee.value.length > 1 && !data) {
      let share = 100 / this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        } else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }


  }
  showDeductible() {
    if (this.otherAssetForm.get('planDetails').value == '1' || this.otherAssetForm.get('planDetails').value == '2') {
      this.showDeductibleSum = true;
    } else {
      this.showDeductibleSum = false;
    }
  }
  onChangeSetErrorsType(value, formName) {
    if (value == 8) {
      this.showSumAssured = true
      this.showinsuredMemberSum = false
      let list = this.otherAssetForm.get('InsuredMemberForm') as FormArray;
      list.controls.forEach(element => {
        element.get('sumAssured').setValue(null);
        if (element.get('sumAssured').value == '' || element.get('sumAssured').value == null) {
          element.get('sumAssured').setErrors(null);
          element.get('sumAssured').setValidators(null);
        }
      });
      if (!this.otherAssetForm.controls['sumAssuredIdv'].value) {
        this.otherAssetForm.controls['sumAssuredIdv'].setValue(null);
        this.otherAssetForm.get('sumAssuredIdv').setValidators([Validators.required]);
        this.otherAssetForm.get('sumAssuredIdv').updateValueAndValidity();
        this.otherAssetForm.controls['sumAssuredIdv'].setErrors({ 'required': true });
      }
    } else {
      this.showSumAssured = false
      this.showinsuredMemberSum = true
      this.otherAssetForm.controls['sumAssuredIdv'].setValue(null);
      this.otherAssetForm.controls['sumAssuredIdv'].setErrors(null);
      this.otherAssetForm.controls['sumAssuredIdv'].setValidators(null);
    }
  }

  onChangeSetErrors(value, formName) {
    if (value != 0 && formName == 'planDetails') {
      if (!this.otherAssetForm.controls['deductibleAmt'].value) {
        this.otherAssetForm.controls['deductibleAmt'].setValue(null);
        this.otherAssetForm.get('deductibleAmt').setValidators([Validators.required]);
        this.otherAssetForm.get('deductibleAmt').updateValueAndValidity();
        this.otherAssetForm.controls['deductibleAmt'].setErrors({ 'required': true });
      }
    } else {
      this.otherAssetForm.controls['deductibleAmt'].setValue(null);
      this.otherAssetForm.controls['deductibleAmt'].setErrors(null);
      this.otherAssetForm.get('deductibleAmt').setValidators(null);
    }
  }
  getOwnerData(value, data) {

    data.forEach(element => {
      for (const e in this.getCoOwner.controls) {
        const name = this.getCoOwner.controls[e].get('name');
        if (element.userName == name.value) {
          this.getCoOwner.controls[e].get('name').setValue(element.userName);
          this.getCoOwner.controls[e].get('familyMemberId').setValue(element.id);
          this.getCoOwner.controls[e].get('clientId').setValue(element.clientId);
          this.getCoOwner.controls[e].get('userType').setValue(element.userType);

        }
      }

    });



  }
  getdataForm(data) {
    this.dataForEdit = data.data;
    if (data.data == null) {
      data = {};
      this.dataForEdit = data.data;
      this.flag = 'Add';
    } else {
      this.dataForEdit = data.data;
      this.id = this.dataForEdit.id;
      if (this.dataForEdit.hasOwnProperty('addOns') && this.dataForEdit.addOns.length > 0) {
        this.addOns.addOnId = this.dataForEdit.addOns[0].addOnId;
        this.addOns.addOnSumInsured = this.dataForEdit.addOns[0].addOnSumInsured;
      }
      this.flag = 'Edit';
    }
    this.otherAssetForm = this.fb.group({
      // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',],
        share: [0,],
        familyMemberId: null,
        id: 0,
        isClient: 0,
        clientId: 0,
        userType: 0
      })]),
      name: [(this.dataForEdit ? this.dataForEdit.name : null)],
      floaterOrIndividual: [(this.dataForEdit) ? (this.dataForEdit.isFloater == 1 ? true : false) : null],
      policyHolderName: [this.dataForEdit ? this.dataForEdit.policyHolderName : null],
      PlanType: [(this.dataForEdit ? this.dataForEdit.planType : ''), [Validators.required]],
      planDetails: [(this.dataForEdit ? this.dataForEdit.policyFeatureId + '' : null)],
      deductibleAmt: [(this.dataForEdit ? this.dataForEdit.deductibleSumInsured : null)],
      policyNum: [(this.dataForEdit ? this.dataForEdit.policyNumber : null), [Validators.required]],
      insurerName: [(this.dataForEdit ? this.dataForEdit.insurerName : null), [Validators.required]],
      planeName: [(this.dataForEdit ? this.dataForEdit.planName : null), [Validators.required]],
      premium: [(this.dataForEdit ? this.dataForEdit.premiumAmount : null), [Validators.required]],
      policyStartDate: [this.dataForEdit ? new Date(this.dataForEdit.policyStartDate) : null, [Validators.required]],
      policyExpiryDate: [this.dataForEdit ? new Date(this.dataForEdit.policyExpiryDate) : null, [Validators.required]],
      copay: [(this.dataForEdit ? this.dataForEdit.copay : null)],
      copayType: [this.dataForEdit ? this.dataForEdit.copayRupeesOrPercent + '' : '1'],
      cumulativeBonus: [this.dataForEdit ? this.dataForEdit.cumulativeBonus : null],
      bonusType: [this.dataForEdit ? this.dataForEdit.cumulativeBonusRupeesOrPercent + '' : '1'],
      exclusion: [this.dataForEdit ? this.dataForEdit.exclusion : null],
      financierName: [this.dataForEdit ? this.dataForEdit.financierName : null],
      inceptionDate: [(this.dataForEdit) ? ((this.dataForEdit.policyInceptionDate) ? new Date(this.dataForEdit.policyInceptionDate) : null) : null],
      tpaName: [this.dataForEdit ? this.dataForEdit.tpaName : null],
      advisorName: [this.dataForEdit ? this.dataForEdit.advisorName : null],
      serviceBranch: [this.dataForEdit ? this.dataForEdit.serviceBranch : null],
      bankAccount: [this.dataForEdit ? parseInt(this.dataForEdit.linkedBankAccountId) : null],
      additionalCovers: [(this.dataForEdit) ? this.addOns.addOnId + '' : null],
      sumAssuredIdv: [(this.dataForEdit) ? this.dataForEdit.sumInsuredIdv : null, [Validators.required]],
      coversAmount: [(this.dataForEdit) ? this.addOns.addOnSumInsured : null],
      nominees: this.nominees,
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        isClient:null,
        id: [0],
        relationshipId: [0]
      })]),
      InsuredMemberForm: this.fb.array([this.fb.group({
        insuredMembers: ['', [Validators.required]],
        sumAssured: ['', [Validators.required]],
        id: null,
        familyMemberId: [''],
        relationshipId: [''],
        clientId: [''],
        userType: [''],
        isActive:null,
        isClient:null,
        isEdited:null,
        otherInsuranceId:null

      })]),
      addOnForm: this.fb.array([this.fb.group({
        addOns: [''],
        id:null,
        isActive:null,
        isEdited:null,
        otherInsuranceId:null,
        sumInsured: null,
      })]),
      planFeatureForm: this.fb.array([this.fb.group({
        feature: [''],
        id: [''],
        isDeleted: [''],
        isEdited: [''],
        otherInsuranceId: [''],
      })])
      // addBankAccount: this.fb.array([this.fb.group({
      //   newBankAccount: [''],
      // })])
    });
    // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.otherAssetForm.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    }
    // this.addBankAccount.removeAt(0);

    // if (this.dataForEdit && this.dataForEdit.ownerList) {
    //   this.getCoOwner.removeAt(0);
    //   this.dataForEdit.ownerList.forEach(element => {
    //     this.addNewCoOwner(element);
    //   });
    // }

    if (this.dataForEdit) {
      this.getCoOwner.removeAt(0);
      const data = {
        name: this.dataForEdit.policyHolderName,
        familyMemberId: this.dataForEdit.policyHolderId
      };
      this.addNewCoOwner(data);
    }

    /***owner***/

    /***nominee***/
    if (this.dataForEdit) {
      if (this.dataForEdit.nominees && this.dataForEdit.hasOwnProperty('nominees') && this.dataForEdit.nominees.length > 0) {
        this.getNominee.removeAt(0);
        this.dataForEdit.nominees.forEach(element => {
          this.addNewNominee(element);
        });
      }
    }
    /***nominee***/
    if (this.dataForEdit) {
      if (this.dataForEdit.hasOwnProperty('insuredMembers') && this.dataForEdit.insuredMembers.length > 0) {
        this.insuredMembersForm.removeAt(0);
        this.dataForEdit.insuredMembers.forEach(element => {
          this.addTransaction(element);
        });
      }
    }
    // add ons
    if (this.dataForEdit) {
      if (this.dataForEdit.hasOwnProperty('addOns') && this.dataForEdit.addOns.length > 0) {
        this.addOnForm.removeAt(0);
        this.dataForEdit.addOns.forEach(element => {
          this.addNewAddOns(element);
        });
      }
    }
    // plan features
    if (this.dataForEdit) {
      if (this.dataForEdit.hasOwnProperty('policyFeatures') && this.dataForEdit.policyFeatures.length > 0) {
        this.planFeatureForm.removeAt(0);
        this.dataForEdit.policyFeatures.forEach(element => {
          this.addNewFeature(element);
        });
      }
    }
    if (this.dataForEdit) {
      if (this.dataForEdit.hasOwnProperty('insuredMembers')) {
        this.dataForEdit.insuredMembers.forEach(element => {
          if (element.sumInsured == 0) {
            this.showinsuredMemberSum = false
          }
        });
      }
    }

    if (this.otherAssetForm.get('PlanType').value == '8') {
      this.showSumAssured = true;
    } else {
      this.showSumAssured = false;
    }
    if (this.otherAssetForm.get('planDetails').value != '0') {
      this.showDeductibleSum = true;
    } else {
      this.showDeductibleSum = false;
    }

    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.otherAssetForm };
    this.bankAccountDetails = { accountList: this.accountList, controleData: this.otherAssetForm };

    // this.finalCashFlowData = [];
    // ==============owner-nominee Data ========================\\
    // this.DOB = data.dateOfBirth
    // this.ownerData = this.otherAssetForm.controls;
    // this.familyMemberId = data.familyMemberId;
  }

  ngOnInit() {
    this.bankList = this.enumService.getBank();
    this.getBankList(this.clientData);
    this.minDate.setFullYear(this.minDate.getFullYear() - 100);
  }
  getBankList(data) {
    const obj = [{
      userId: data.clientId,
      userType: data.userType
    }];
    this.cusService.getBankList(obj).subscribe(
      data => {
        console.log(data);
        if (data && data.length > 0) {
          this.bankList = data;

        }
      },
      err => {
        this.bankList = [];
        console.error(err);
      }
    );
  }
  dateChange(value, form, formValue) {
    if (form == 'policyExpiryDate' && formValue) {
      let startDate = new Date(this.otherAssetForm.controls.policyStartDate.value);
      let policyExpiryDate = this.datePipe.transform(this.otherAssetForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
      let comparedDate: any = startDate;
      comparedDate = comparedDate.setFullYear(startDate.getFullYear() + 1);
      comparedDate = new Date(comparedDate);
      comparedDate = comparedDate.setDate(comparedDate.getDate() - 1);
      comparedDate = this.datePipe.transform(comparedDate, 'yyyy/MM/dd')
      if (policyExpiryDate < comparedDate) {
        this.otherAssetForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
        this.otherAssetForm.get('policyExpiryDate').markAsTouched();
      } else {
        this.otherAssetForm.get('policyExpiryDate').setErrors();
      }
    } else {
      if (formValue) {
        let policyExpiryDate = this.datePipe.transform(this.otherAssetForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
        let policyStartDate = this.datePipe.transform(this.otherAssetForm.controls.policyStartDate.value, 'yyyy/MM/dd')

        if (policyStartDate >= policyExpiryDate) {
          this.otherAssetForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
          this.otherAssetForm.get('policyExpiryDate').markAsTouched();
        } else {
          this.otherAssetForm.get('policyExpiryDate').setErrors();

        }
      }
    }

  }
  changeSign(event, value, formValue) {
    this.otherAssetForm.get(value).setValue('');
    if (event == '2') {
      if (parseInt(formValue) > 100) {
        this.otherAssetForm.get(value).setValue('');
      }
    }
  }

  changeTheInput(form1, form2, event) {
    if (form1 == '2') {
      if (parseInt(event.target.value) > 100) {
        this.otherAssetForm.get(form2).setValue('100');
      }
    } else {
      this.otherAssetForm.get(form2).setValue(event.target.value);
    }

  }

  getFamilyData(data) {
    if (data) {
      data.forEach(element => {
        for (let e in this.insuredMembersForm.controls) {
          let name = this.insuredMembersForm.controls[e].get('insuredMembers');
          if (element.userName == name.value) {
            this.insuredMembersForm.controls[e].get('insuredMembers').setValue(element.name);
            this.insuredMembersForm.controls[e].get('familyMemberId').setValue(element.familyMemberId);
            this.insuredMembersForm.controls[e].get('relationshipId').setValue(element.relationshipId);
            this.insuredMembersForm.controls[e].get('clientId').setValue(element.clientId);
            this.insuredMembersForm.controls[e].get('userType').setValue(element.userType);
            this.insuredMembersForm.controls[e].get('isClient').setValue(element.familyMemberId == 0 ? 1 : 0);
            element.isDisabled = true;

          }
        }

      });
    }

  }


  addOtherInsurance() {

  }

  addTransaction(data) {
    this.insuredMembersForm.push(this.fb.group({
      insuredMembers: [data ? data.name : '', [Validators.required]],
      sumAssured: [data ? data.share : '', [Validators.required]],
      id: [data ? data.id : ''],
      relationshipId: [data ? data.relationshipId : ''],
      familyMemberId: [data ? data.familyMemberId : ''],
      clientId: [data ? data.clientId : ''],
      userType: [data ? data.userType : ''],
      isActive: [data ? data.isActive : ''],
      isClient: [data ? (data.familyMemberId == this.clientId ? 1 : 0) : ''],
      isEdited: [data ? data.isEdited : ''],
      otherInsuranceId: [this.dataForEdit ? this.dataForEdit.id : null],
    }));
    this.resetValue(this.insuredMemberList);
    this.getFamilyData(this.insuredMemberList);
    // this.onChangeSetErrorsType(this.otherAssetForm.get('PlanType').value, 'planType')
  }

  removeTransaction(item, element) {
    let finalMemberList = this.otherAssetForm.get('InsuredMemberForm') as FormArray;
    if (finalMemberList.length > 1) {
      this.insuredMembersForm.removeAt(item);

    }
    this.resetValue(this.insuredMemberList);
    this.getFamilyData(this.insuredMemberList);
    if (element.value.id) {
      this.customerService.deleteOtherMemberInsurance(element.value.id).subscribe(data => {
        
      }
      )
    }
  }
  resetValue(data) {
    if (data) {
      data.forEach(item => item.isDisabled = false);
    }
  }

  // addNewAccount(data) {
  //   this.addBankAccount.push(this.fb.group({
  //     newBankAccount: [data ? data.name : ''],
  //   }));
  // }

  // RemoveNewAccount(item) {
  //     this.addBankAccount.removeAt(item);
  // }
  /***owner***/

  openOptionField() {
    (this.addMoreFlag) ? this.addMoreFlag = false : this.addMoreFlag = true;
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
  getClientId() {
    this.nomineesListFM.forEach(element => {
      for (const e in this.getCoOwner.controls) {
        const id = this.getCoOwner.controls[e].get('familyMemberId');
        if (element.familyMemberId == id.value) {
          this.getCoOwner.controls[e].get('name').setValue(element.userName);
          this.getCoOwner.controls[e].get('familyMemberId').setValue(element.id);
          this.getCoOwner.controls[e].get('clientId').setValue(element.clientId);
          this.getCoOwner.controls[e].get('userType').setValue(element.userType);
          this.getCoOwner.controls[e].get('isClient').setValue(element.familyMemberId == this.clientId ? 1 : 0);
        }
      }

    });
  }
  getClientIdNominee(){
    this.nomineesListFM.forEach(element => {
      for (const e in this.getNominee.controls) {
        const id = this.getNominee.controls[e].get('familyMemberId');
        if (this.clientId == id.value) {
          this.getNominee.controls[e].get('isClient').setValue(1);
        }
      }

    });
  }
  getIndexOfSelectedElement(trn) {
    if(trn.get('id').value){
      trn.get('isEdited').setValue(1);
    }
  }
  preventDefault(e) {
    e.preventDefault();
  }

  saveOthersInsurance() {
    this.getClientId();
    this.getClientIdNominee();
    // let nominee = [];
    // let nomineeList = this.otherAssetForm.get('getNomineeName') as FormArray;
    // nomineeList.controls.forEach(element => {
    //   let obj =
    //   {
    //     familyMemberId: element.get('userType').value == 2 ? element.get('clientId').value : element.get('familyMemberId').value,
    //     id: (element.get('id').value) ? element.get('id').value : 0,
    //     insuredOrNominee: (element.get('insuredOrNominee').value) ? element.get('insuredOrNominee').value : 0,
    //     isClient: element.get('familyMemberId').value == this.clientId ? 1 : 0,
    //     name: element.get('name').value ? element.get('name').value : null,
    //     relationshipId: (element.get('relationshipId').value) ? element.get('relationshipId').value : 0,
    //     sharePercentage: (element.get('sharePercentage').value) ? element.get('sharePercentage').value : 0,
    //     sumInsured: (element.get('sumInsured').value) ? element.get('sumInsured').value : 0,
    //   };
    //   nominee.push(obj);
    // });
    let memberList = [];
    let finalMemberList = this.otherAssetForm.get('InsuredMemberForm') as FormArray;
    finalMemberList.controls.forEach(element => {
      let obj =
      {
        name: element.get('insuredMembers').value ? element.get('insuredMembers').value : 0,
        createdOn:null,
        // insuredMemberId: element.get('userType').value == 2 ? element.get('clientId').value : element.get('familyMemberId').value,
        share: element.get('sumAssured').value ? element.get('sumAssured').value : 0,
        // relationshipId: element.get('relationshipId').value,
        // insuredOrNominee: 1,
        id: (element.get('id').value) ? element.get('id').value : 0,
        // isActive: (element.get('isActive').value) ? element.get('isActive').value : 0,
        // isClient: (element.get('isClient').value) ? element.get('isClient').value : 0,
        isEdited: (element.get('isEdited').value) ? element.get('isEdited').value : 0,
        otherInsuranceId: this.dataForEdit ? this.dataForEdit.id : null
      };
      memberList.push(obj);
    });
    let addOns = [];
    let addOnList = this.otherAssetForm.get('addOnForm') as FormArray
    addOnList.controls.forEach(element => {
      if (element.get('addOns').value && element.get('sumInsured').value) {
        let obj =
        {
          addOns: element.get('addOns').value,
          id: element.get('id').value ? element.get('id').value : 0,
          isActive: element.get('isActive').value ? element.get('isActive').value : 0,
          isEdited: element.get('isEdited').value ?element.get('isEdited').value:0,
          otherInsuranceId: this.dataForEdit ? this.dataForEdit.id : null,
          sumInsured: element.get('sumInsured').value ? element.get('sumInsured').value :0,
        }
        addOns.push(obj)
      }
    })
    let featureList = [];
    let finalplanFeatureList = this.otherAssetForm.get('planFeatureForm') as FormArray
    finalplanFeatureList.controls.forEach(element => {
      if (element.get('feature').value) {
        let obj =
        {
          feature: element.get('feature').value,
          id: element.get('id').value ? element.get('id').value : 0,
          isDeleted: element.get('isDeleted').value ? element.get('isDeleted').value : 0,
          isEdited: element.get('isEdited').value ? element.get('isEdited').value : 0,
          otherInsuranceId: this.dataForEdit ? this.dataForEdit.id : null,
        }
        featureList.push(obj)
      }
    })
    this.otherAssetForm.get('inceptionDate').setErrors(null);
    if (this.otherAssetForm.invalid) {
      this.otherAssetForm.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        'clientId': this.clientId,
        'advisorId': this.advisorId,
        // 'policyHolderId': this.otherAssetForm.value.getCoOwnerName[0].familyMemberId == this.clientId ? this.clientId : this.otherAssetForm.value.getCoOwnerName[0].familyMemberId,
        'startDate': this.datePipe.transform(this.otherAssetForm.get('policyStartDate').value, 'yyyy-MM-dd'),
        'expiryDate': this.datePipe.transform(this.otherAssetForm.get('policyExpiryDate').value, 'yyyy-MM-dd'),
        'cumulativeBonus': this.otherAssetForm.get('cumulativeBonus').value,
        'cumulativeBonusRupeesOrPercent': this.otherAssetForm.get('bonusType').value,
        'policyTypeId': this.otherAssetForm.get('PlanType').value,
        'planType': this.otherAssetForm.get('PlanType').value,
        'specialCondition': this.otherAssetForm.get('exclusion').value,
        "financierName": this.otherAssetForm.get('financierName').value,
        'planName': this.otherAssetForm.get('planeName').value,
        'policyNumber': this.otherAssetForm.get('policyNum').value,
        'advisorName': this.otherAssetForm.get('advisorName').value,
        'isFloater': (this.otherAssetForm.get('floaterOrIndividual').value) ? 1 : 0,
        'serviceBranch': this.otherAssetForm.get('serviceBranch').value,
        'linkedBankAccountId': this.otherAssetForm.get('bankAccount').value,
        'insurerName': this.otherAssetForm.get('insurerName').value,
        'insuranceSubTypeId': this.inputData.insuranceSubTypeId,
        'premium': this.otherAssetForm.get('premium').value,
        'sumInsuredIdv': this.otherAssetForm.get('sumAssuredIdv').value,
        'id': (this.id) ? this.id : 0,
        // 'policyHolderName':this.otherAssetForm.value.getCoOwnerName[0].name,
        'policyHolderName':this.otherAssetForm.get('policyHolderName').value,
        // isClient:this.otherAssetForm.value.getCoOwnerName[0].familyMemberId == this.clientId ? 1 : 0,
        otherInsuranceInsuredMembers: memberList,
        otherInsuranceFeatureList:featureList,
        otherInsuranceAddCovers:addOns,
        nominees: this.otherAssetForm.value.getNomineeName,
        createdOn:null
      };
      // if (this.otherAssetForm.get('addOns').value && this.otherAssetForm.get('sumInsured').value) {
      //   obj.otherInsuranceAddCovers = [{
      //     'addOnId': (this.otherAssetForm.get('addOns').value),
      //     'addOnSumInsured': this.otherAssetForm.get('sumInsured').value
      //   }];
      // }
      if (obj.otherInsuranceInsuredMembers.length > 0) {
        obj.otherInsuranceInsuredMembers.forEach(element => {
          if (element.sumInsured == '') {
            element.sumInsured = null
          }
        });
      }
      if (obj.nominees.length > 0) {
        obj.nominees.forEach((element, index) => {
          if (element.name == '') {
            this.removeNewNominee(index,null);
          }
        });
        obj.nominees = this.otherAssetForm.value.getNomineeName;
        obj.nominees.forEach(element => {
          if (element.sharePercentage) {
            element.sumInsured = element.sharePercentage;
          }
          element.insuredOrNominee = 2;
        });
      } else {
        obj.nominees = [];
      }
      console.log(obj);


      if (this.dataForEdit) {
        this.customerService.editOtherInsurance(obj).subscribe(
          data => {
            this.barButtonOptions.active = false;
            console.log(data);
            this.eventService.openSnackBar('Updated successfully!', 'Dismiss');
            const insuranceData =
            {
              insuranceTypeId: this.inputData.insuranceTypeId,
              insuranceSubTypeId: 11,
              id: this.dataForEdit ? this.dataForEdit.id : null,
              isAdded: false
            };
            this.close(insuranceData);
          }
        );
      } else {
        this.customerService.addOtherInsurance(obj).subscribe(
          data => {
            this.barButtonOptions.active = false;
            console.log(data);
            this.eventService.openSnackBar('Added successfully!', 'Dismiss');
            const insuranceData =
            {
              insuranceTypeId: this.inputData.insuranceTypeId,
              insuranceSubTypeId: 11,
              id: data.id,
              Insdata:data,
              isAdded: true
            };
            this.close(insuranceData);
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
