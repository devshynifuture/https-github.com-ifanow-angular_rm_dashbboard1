import { Component, OnInit, ViewChildren, Input, QueryList } from '@angular/core';
import { FormArray, Validators, FormBuilder } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { MatInput, MAT_DATE_FORMATS } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-travel-insurance-in-asset',
  templateUrl: './add-travel-insurance-in-asset.component.html',
  styleUrls: ['./add-travel-insurance-in-asset.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class AddTravelInsuranceInAssetComponent implements OnInit {
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
  advisorId: any;
  clientId: any;
  inputData: any;
  addOns: any;
  policyFeature: any;
  nomineesList: any[] = [];
  ownerName: any;
  familyMemberId: any;
  ownerData: any;
  nomineesListFM: any = [];
  familyMemberLifeData: any;
  callMethod: any;
  travelInsuranceForm: any;
  dataForEdit: any;
  flag: string;
  nominees: any[];
  addMoreFlag = false;
  policyList: any;
  id: any;
  showinsuredMemberSum = true;
  showSumAssured = false;
  insuredMemberList: any;

  constructor(private datePipe: DatePipe,private fb: FormBuilder, private subInjectService: SubscriptionInject, private customerService: CustomerService, private eventService: EventService) { }
  validatorType = ValidatorType
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.inputData = data;
    this.policyList = data.displayList.policyTypes;
    this.policyFeature = data.displayList.policyFeature;
    this.addOns = data.displayList.addOns;
    this.getdataForm(data)
    // this.setInsuranceDataFormField(data);
    console.log(data);
  }
  get data() {
    return this.inputData;
  }
  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.familyMemberId
  }

  lisNominee(value) {
    this.ownerData.Fmember = value;
    this.nomineesListFM = Object.assign([], value);
    this.insuredMemberList = Object.assign([], value);
    this.insuredMemberList.forEach(item => item.isDisabled = false);
  }
  getFamilyMember(data, index) {
    this.familyMemberLifeData = data;
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
      this.travelInsuranceForm.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.travelInsuranceForm.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: "onChangeJointOwnership",
      ParamValue: data
    }
  }
  get insuredMembersForm() {
    return this.travelInsuranceForm.get('InsuredMemberForm') as FormArray;
  }
  get planFeatureForm() {
    return this.travelInsuranceForm.get('planFeatureForm') as FormArray;
  }
  get getCoOwner() {
    return this.travelInsuranceForm.get('getCoOwnerName') as FormArray;
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
    if (this.travelInsuranceForm.value.getCoOwnerName.length == 1) {
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
    return this.travelInsuranceForm.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.travelInsuranceForm.value.getNomineeName.length == 1) {
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
      name: [data ? data.name : ''], sharePercentage: [data ? data.sumInsured : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0], relationshipId: [data ? data.relationshipId : 0]
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
  addTransaction(data) {
    this.insuredMembersForm.push(this.fb.group({
      insuredMembers: [data ? data.name : '', [Validators.required]],
      sumAssured: [data ? data.sumInsured : '', [Validators.required]],
      id: [data ? data.id : ''],
      relationshipId: [data ? data.relationshipId : ''],
      familyMemberId: [data ? data.familyMemberId : ''],
      ttdSumAssured: [data ? data.ttdSumAssured : '']
    }));
    this.resetValue(this.insuredMemberList);
    this.getFamilyData(this.insuredMemberList);
    this.onChangeSetErrorsType(this.travelInsuranceForm.get('planDetails').value, 'planDetails')

  }
  removeTransaction(item) {
    let finalMemberList = this.travelInsuranceForm.get('InsuredMemberForm') as FormArray
    if (finalMemberList.length > 1) {
      this.insuredMembersForm.removeAt(item);

    }
    this.resetValue(this.insuredMemberList);
    this.getFamilyData(this.insuredMemberList);
  }
  resetValue(data){
    if(data){
      data.forEach(item => item.isDisabled = false);
    }
}
  addNewFeature(data) {
    this.planFeatureForm.push(this.fb.group({
      planfeatures: [data ? data.policyFeatureId + '' : ''],
    }));
  }
  removeNewFeature(item) {
    let finalFeatureList = this.travelInsuranceForm.get('planFeatureForm') as FormArray
    if (finalFeatureList.length > 1) {
      this.planFeatureForm.removeAt(item);

    }
  }
  openOptionField() {
    (this.addMoreFlag) ? this.addMoreFlag = false : this.addMoreFlag = true;
  }
  preventDefault(e) {
    e.preventDefault();
  }
  getFamilyData(data) {
    if(data){
      data.forEach(element => {
        for (let e in this.insuredMembersForm.controls) {
          let name = this.insuredMembersForm.controls[e].get('insuredMembers')
          if (element.userName == name.value) {
            this.insuredMembersForm.controls[e].get('insuredMembers').setValue(element.userName);
            this.insuredMembersForm.controls[e].get('familyMemberId').setValue(element.familyMemberId);
            this.insuredMembersForm.controls[e].get('relationshipId').setValue(element.relationshipId);
            element.isDisabled = true;
          }
        }
  
      });
    }
  }
  getdataForm(data) {
    this.dataForEdit = data.data;
    if (data.data == null) {
      data = {};
      this.dataForEdit = data.data;
      this.flag = "ADD";
    }
    else {
      this.dataForEdit = data.data;
      this.id = this.dataForEdit.id;
      this.flag = "EDIT";
    }
    this.travelInsuranceForm = this.fb.group({
      // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: [0,],
        familyMemberId: 0,
        id: 0,
        isClient: 0
      })]),
      name: [(this.dataForEdit ? this.dataForEdit.name : null)],
      PlanType: [(this.dataForEdit ? this.dataForEdit.policyTypeId + '' : null), [Validators.required]],
      planDetails: [(this.dataForEdit ? this.dataForEdit.policyFeatureId + '' : null), [Validators.required]],
      policyNum: [(this.dataForEdit ? this.dataForEdit.policyNumber : null), [Validators.required]],
      insurerName: [(this.dataForEdit ? this.dataForEdit.insurerName : null), [Validators.required]],
      sumAssuredIdv: [(this.dataForEdit) ? this.dataForEdit.sumInsuredIdv : null, [Validators.required]],
      planeName: [(this.dataForEdit ? this.dataForEdit.planName : null), [Validators.required]],
      premium: [(this.dataForEdit ? this.dataForEdit.premiumAmount : null), [Validators.required]],
      policyStartDate: [this.dataForEdit ? new Date(this.dataForEdit.policyStartDate) : null, [Validators.required]],
      policyExpiryDate: [this.dataForEdit ? new Date(this.dataForEdit.policyExpiryDate) : null, [Validators.required]],
      geography: [this.dataForEdit ? this.dataForEdit.geographyId + '' : null],
      exclusion: [this.dataForEdit ? this.dataForEdit.exclusion : null],
      tpaName: [this.dataForEdit ? this.dataForEdit.tpaName : null],
      advisorName: [this.dataForEdit ? this.dataForEdit.advisorName : null],
      serviceBranch: [this.dataForEdit ? this.dataForEdit.serviceBranch : null],
      nominees: this.nominees,
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0],
        relationshipId: [0]
      })]),
      InsuredMemberForm: this.fb.array([this.fb.group({
        insuredMembers: ['', [Validators.required]],
        sumAssured: [null, [Validators.required]],
        id: [0],
        familyMemberId: [''],
        relationshipId: [''],
        ttdSumAssured: ['']
      })]),
      planFeatureForm: this.fb.array([this.fb.group({
        planfeatures: [''],
      })])
    })
    // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.travelInsuranceForm.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    }

    if (this.dataForEdit) {
      this.getCoOwner.removeAt(0);
      const data = {
        name: this.dataForEdit.policyHolderName,
        familyMemberId: this.dataForEdit.policyHolderId
      }
      this.addNewCoOwner(data);
    }

    /***owner***/

    /***nominee***/
    if (this.dataForEdit) {
      this.getNominee.removeAt(0);
      this.dataForEdit.nominees.forEach(element => {
        this.addNewNominee(element);
      });
    }
    /***nominee***/
    if (this.dataForEdit) {
      this.insuredMembersForm.removeAt(0);
      this.dataForEdit.insuredMembers.forEach(element => {
        this.addTransaction(element);
      });
    }

    if (this.dataForEdit) {
      this.planFeatureForm.removeAt(0);
      this.dataForEdit.policyFeatures.forEach(element => {
        this.addNewFeature(element);
      });
    }
    if (this.dataForEdit) {
      this.dataForEdit.insuredMembers.forEach(element => {
        if (element.sumInsured == 0) {
          this.showinsuredMemberSum = false
        }
      });
    }

    if (this.travelInsuranceForm.get('planDetails').value == '1') {
      this.showSumAssured = true;
    } else {
      this.showSumAssured = false;
    }
    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.travelInsuranceForm }

    // this.finalCashFlowData = [];
    // ==============owner-nominee Data ========================\\ 
    // this.DOB = data.dateOfBirth
    // this.ownerData = this.travelInsuranceForm.controls;
    // this.familyMemberId = data.familyMemberId;
  }
  ngOnInit() {
    this.minDate.setFullYear(this.minDate.getFullYear() - 100);
  }
  dateChange(value,form,formValue){
    if(form=='policyExpiryDate' && formValue){
    let startDate =  new Date(this.travelInsuranceForm.controls.policyStartDate.value);
      let policyExpiryDate = this.datePipe.transform(this.travelInsuranceForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
      let comparedDate :any = new Date(this.travelInsuranceForm.controls.policyStartDate.value);
      comparedDate = comparedDate.setFullYear(startDate.getFullYear() + 1);
      comparedDate = this.datePipe.transform(comparedDate, 'yyyy/MM/dd')
      if(policyExpiryDate < comparedDate){
        this.travelInsuranceForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
        this.travelInsuranceForm.get('policyExpiryDate').markAsTouched();
      }else{
        this.travelInsuranceForm.get('policyExpiryDate').setErrors();
      }
    }else{
      if(formValue){
        let policyExpiryDate = this.datePipe.transform(this.travelInsuranceForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
        let policyStartDate = this.datePipe.transform(this.travelInsuranceForm.controls.policyStartDate.value, 'yyyy/MM/dd')

        if(policyStartDate >= policyExpiryDate){
          this.travelInsuranceForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
          this.travelInsuranceForm.get('policyExpiryDate').markAsTouched();
        }else{
          this.travelInsuranceForm.get('policyExpiryDate').setErrors();

        }
      }
    }
  
  }
  onChangeSetErrorsType(value, formName) {
    if (value == 1) {
      this.showSumAssured = true
      this.showinsuredMemberSum = false
      let list = this.travelInsuranceForm.get('InsuredMemberForm') as FormArray;
      list.controls.forEach(element => {
        element.get('sumAssured').setValue(null);
        if (element.get('sumAssured').value == '' || element.get('sumAssured').value == null) {
          element.get('sumAssured').setErrors(null);
          element.get('sumAssured').setValidators(null);
        }
      });
      if (!this.travelInsuranceForm.controls['sumAssuredIdv'].value) {
        this.travelInsuranceForm.controls['sumAssuredIdv'].setValue(null);
        this.travelInsuranceForm.get('sumAssuredIdv').setValidators([Validators.required]);
        this.travelInsuranceForm.get('sumAssuredIdv').updateValueAndValidity();
        this.travelInsuranceForm.controls['sumAssuredIdv'].setErrors({ 'required': true });
      }
    } else {
      this.showSumAssured = false
      this.showinsuredMemberSum = true
      this.travelInsuranceForm.controls['sumAssuredIdv'].setValue(null);
      this.travelInsuranceForm.controls['sumAssuredIdv'].setErrors(null);
      this.travelInsuranceForm.controls['sumAssuredIdv'].setValidators(null);
    }
  }
  saveTravelInsurance() {
    let memberList = [];
    let finalMemberList = this.travelInsuranceForm.get('InsuredMemberForm') as FormArray
    finalMemberList.controls.forEach(element => {
      let obj =
      {
        familyMemberId: element.get('familyMemberId').value,
        sumInsured: element.get('sumAssured').value,
        relationshipId: element.get('relationshipId').value,
        insuredOrNominee: 1,
        id: (element.get('id').value) ? element.get('id').value : null,
        ttdSumAssured: element.get('id').value
      }
      memberList.push(obj)
    })
    let featureList = [];
    let finalplanFeatureList = this.travelInsuranceForm.get('planFeatureForm') as FormArray
    finalplanFeatureList.controls.forEach(element => {
      if (element.get('planfeatures').value) {
        let obj =
        {
          policyFeatureId: element.get('planfeatures').value,
        }
        featureList.push(obj)
      }
    })
    if (this.travelInsuranceForm.invalid) {
      if (this.travelInsuranceForm.get('planDetails').value == '1') {
        this.travelInsuranceForm.controls['sumAssuredIdv'].setErrors({ 'required': true });
      }
      this.travelInsuranceForm.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        "clientId": this.clientId,
        "advisorId": this.advisorId,
        "policyHolderId": this.travelInsuranceForm.value.getCoOwnerName[0].familyMemberId,
        "policyTypeId": this.travelInsuranceForm.get('PlanType').value,
        "policyFeatureId": this.travelInsuranceForm.get('planDetails').value,
        "insurerName": this.travelInsuranceForm.get('insurerName').value,
        "policyNumber": this.travelInsuranceForm.get('policyNum').value,
        "planName": this.travelInsuranceForm.get('planeName').value,
        "premiumAmount": this.travelInsuranceForm.get('premium').value,
        "policyStartDate": this.travelInsuranceForm.get('policyStartDate').value,
        "policyExpiryDate": this.travelInsuranceForm.get('policyExpiryDate').value,
        "geographyId": this.travelInsuranceForm.get('geography').value,
        "exclusion": this.travelInsuranceForm.get('exclusion').value,
        "tpaName": this.travelInsuranceForm.get('tpaName').value,
        "advisorName": this.travelInsuranceForm.get('advisorName').value,
        "serviceBranch": this.travelInsuranceForm.get('serviceBranch').value,
        "insuranceSubTypeId": this.inputData.insuranceSubTypeId,
        'sumInsuredIdv': this.travelInsuranceForm.get('sumAssuredIdv').value,
        "policyFeatures": featureList,
        "id": (this.id) ? this.id : null,
        insuredMembers: memberList,
        nominees: this.travelInsuranceForm.value.getNomineeName,
      }

      if (obj.nominees.length > 0) {
        obj.nominees.forEach((element, index) => {
          if (element.name == '') {
            this.removeNewNominee(index);
          }
        });
        obj.nominees = this.travelInsuranceForm.value.getNomineeName;
        obj.nominees.forEach(element => {
          if (element.sharePercentage) {
            element.sumInsured = element.sharePercentage;
          }
          element.insuredOrNominee = 2
        });
      } else {
        obj.nominees = [];
      }
      if (obj.insuredMembers.length > 0) {
        obj.insuredMembers.forEach(element => {
          if (element.sumInsured == '') {
            element.sumInsured = null
          }
        });
      }
      console.log(obj);



      if (this.dataForEdit) {
        this.customerService.editGeneralInsuranceData(obj).subscribe(
          data => {
            this.barButtonOptions.active = false;
            console.log(data);
            this.eventService.openSnackBar("Updated successfully!", 'dismiss');
            const insuranceData =
            {
              insuranceTypeId: this.inputData.insuranceTypeId,
              insuranceSubTypeId: this.inputData.insuranceSubTypeId
            }
            this.close(insuranceData)
          }
        );
      } else {
        this.customerService.addGeneralInsurance(obj).subscribe(
          data => {
            this.barButtonOptions.active = false;
            console.log(data);
            this.eventService.openSnackBar("Added successfully!", 'dismiss');
            const insuranceData =
            {
              insuranceTypeId: this.inputData.insuranceTypeId,
              insuranceSubTypeId: this.inputData.insuranceSubTypeId
            }
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
