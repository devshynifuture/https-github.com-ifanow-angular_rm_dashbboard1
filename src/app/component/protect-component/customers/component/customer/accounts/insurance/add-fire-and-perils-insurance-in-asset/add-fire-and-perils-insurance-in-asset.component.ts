import { Component, OnInit, ViewChildren, QueryList, Input } from '@angular/core';
import { FormArray, Validators, FormBuilder } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatInput, MAT_DATE_FORMATS } from '@angular/material';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-fire-and-perils-insurance-in-asset',
  templateUrl: './add-fire-and-perils-insurance-in-asset.component.html',
  styleUrls: ['./add-fire-and-perils-insurance-in-asset.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class AddFireAndPerilsInsuranceInAssetComponent implements OnInit {
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
  fireInsuranceForm: any;
  displayList: any;
  nomineesList: any[] = [];
  policyList: any;
  addOns: any;
  dataForEdit: any;
  policyFeature: any;
  id: any;
  options: any;
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
    this.getFamilyMemberList();
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
      this.fireInsuranceForm.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.fireInsuranceForm.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: "onChangeJointOwnership",
      ParamValue: data
    }
  }

  /***owner***/
  get planFeatureForm() {
    return this.fireInsuranceForm.get('planFeatureForm') as FormArray;
  }
  get addOnForm() {
    return this.fireInsuranceForm.get('addOnForm') as FormArray;
  }
  get getCoOwner() {
    return this.fireInsuranceForm.get('getCoOwnerName') as FormArray;
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
    if (this.fireInsuranceForm.value.getCoOwnerName.length == 1) {
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
    return this.fireInsuranceForm.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.fireInsuranceForm.value.getNomineeName.length == 1) {
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
      name: [data ? data.name : ''], sharePercentage: [data ? data.sumInsured : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0],relationshipId:[data ? data.relationshipId :0] 
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
    this.fireInsuranceForm = this.fb.group({
      // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: [0,],
        familyMemberId: 0,
        id: 0,
        isClient: 0
      })]),
      name:[(this.dataForEdit ? this.dataForEdit.name : null)],
      PlanType: [(this.dataForEdit ? this.dataForEdit.policyTypeId+'' : null), [Validators.required]],
      policyNum: [(this.dataForEdit ? this.dataForEdit.policyNumber : null), [Validators.required]],
      premium: [(this.dataForEdit ? this.dataForEdit.premiumAmount : null), [Validators.required]],
      insurerName: [(this.dataForEdit ? this.dataForEdit.insurerName : null), [Validators.required]],
      financierName: [(this.dataForEdit ? this.dataForEdit.hypothetication : null)],
      planeName: [(this.dataForEdit ? this.dataForEdit.planName :null), [Validators.required]],
      policyStartDate: [this.dataForEdit ? new Date(this.dataForEdit.policyStartDate) : null, [Validators.required]],
      policyExpiryDate: [this.dataForEdit ? new Date(this.dataForEdit.policyExpiryDate) : null, [Validators.required]],
      copay: [(this.dataForEdit ? this.dataForEdit.copay : null)],
      copayType: [this.dataForEdit ? this.dataForEdit.copayRupeesOrPercent + '' : null],
      cumulativeBonus: [this.dataForEdit ? this.dataForEdit.cumulativeBonus : null],
      bonusType: [this.dataForEdit ? this.dataForEdit.cumulativeBonusRupeesOrPercent + '' : null],
      additionalCovers: [this.dataForEdit ? (this.dataForEdit.addOns > 0 ? this.dataForEdit.addOns[0].addOnId : null ) : null],
      coversAmount: [this.dataForEdit ? (this.dataForEdit.addOns > 0 ? this.dataForEdit.addOns[0].addOnSumInsured : null) : null],
      exclusion: [this.dataForEdit ? this.dataForEdit.exclusion :null],
      inceptionDate: [this.dataForEdit ? new Date(this.dataForEdit.policyInceptionDate) : null],
      tpaName: [this.dataForEdit ? this.dataForEdit.tpaName : null],
      advisorName: [this.dataForEdit ? this.dataForEdit.advisorName :null],
      serviceBranch: [this.dataForEdit ? this.dataForEdit.serviceBranch :null],
      bankAccount: [this.dataForEdit ? this.dataForEdit.linkedBankAccount : null],
      nominees: this.nominees,
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0],
        relationshipId:[0]
      })]),
      planFeatureForm: this.fb.array([this.fb.group({
        planfeatures: ['',[Validators.required]],
        sumInsured:['',[Validators.required]]
      })]),
      addOnForm: this.fb.array([this.fb.group({
        additionalCovers :[''],
        sumAddOns:null
      })])

    })
    // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.fireInsuranceForm.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    }

    // if (this.dataForEdit && this.dataForEdit.ownerList) {
    //   this.getCoOwner.removeAt(0);
    //   this.dataForEdit.ownerList.forEach(element => {
    //     this.addNewCoOwner(element);
    //   });
    // }

    if (this.dataForEdit) {
      this.getCoOwner.removeAt(0);
      const data={
        name:this.dataForEdit.policyHolderName,
        familyMemberId:this.dataForEdit.policyHolderId
      }
        this.addNewCoOwner(data);
    }

    /***owner***/

    /***nominee***/
    if (this.dataForEdit) {
      if(this.dataForEdit.nominees.length > 0){
      this.getNominee.removeAt(0);
      this.dataForEdit.nominees.forEach(element => {
        this.addNewNominee(element);
      });
    }
    }
    /***nominee***/
    if (this.dataForEdit) {
      if(this.dataForEdit.addOns.length > 0){
      this.addOnForm.removeAt(0);
      this.dataForEdit.addOns.forEach(element => {
        this.addNewAddOns(element);
      });
    }
    }
    if (this.dataForEdit) {
      if( this.dataForEdit.policyFeatures.length > 0){
        this.planFeatureForm.removeAt(0);
        this.dataForEdit.policyFeatures.forEach(element => {
          this.addNewFeature(element);
        });
      }
    }
    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.fireInsuranceForm }

    // this.finalCashFlowData = [];
    // ==============owner-nominee Data ========================\\ 
    // this.DOB = data.dateOfBirth
    // this.ownerData = this.fireInsuranceForm.controls;
    // this.familyMemberId = data.familyMemberId;
  }
  ngOnInit() {
    this.minDate.setFullYear(this.minDate.getFullYear() - 100);
  }
  dateChange(value,form,formValue){
    if(form=='policyExpiryDate' && formValue){
    let startDate =  new Date(this.fireInsuranceForm.controls.policyStartDate.value);
      let policyExpiryDate = this.datePipe.transform(this.fireInsuranceForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
      let comparedDate :any = new Date(this.fireInsuranceForm.controls.policyStartDate.value);
      comparedDate = comparedDate.setFullYear(startDate.getFullYear() + 1);
      comparedDate = this.datePipe.transform(comparedDate, 'yyyy/MM/dd')
      if(policyExpiryDate < comparedDate){
        this.fireInsuranceForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
        this.fireInsuranceForm.get('policyExpiryDate').markAsTouched();
      }else{
        this.fireInsuranceForm.get('policyExpiryDate').setErrors();
      }
    }else{
      if(formValue){
        let policyExpiryDate = this.datePipe.transform(this.fireInsuranceForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
        let policyStartDate = this.datePipe.transform(this.fireInsuranceForm.controls.policyStartDate.value, 'yyyy/MM/dd')

        if(policyStartDate >= policyExpiryDate){
          this.fireInsuranceForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
          this.fireInsuranceForm.get('policyExpiryDate').markAsTouched();
        }else{
          this.fireInsuranceForm.get('policyExpiryDate').setErrors();

        }
      }
    }
  
  }
  addNewAddOns(data) {
    this.addOnForm.push(this.fb.group({
      additionalCovers :[data ? data.addOnId +'' : ''],
      sumAddOns:[data ? data.addOnSumInsured : ''] 
    }));
  }
  removeNewAddOns(item) {
    let finalFeatureList = this.fireInsuranceForm.get('addOnForm') as FormArray 
    if(finalFeatureList.length > 1){
    this.addOnForm.removeAt(item);

    }
  }

  /***owner***/
  addNewFeature(data) {
    this.planFeatureForm.push(this.fb.group({
      planfeatures: [data ? data.policyFeatureId+'' : '',[Validators.required]],
      sumInsured:[data ? data.featureSumInsured : '',[Validators.required]]
    }));
  }
  removeNewFeature(item) {
    let finalFeatureList = this.fireInsuranceForm.get('planFeatureForm') as FormArray 
    if(finalFeatureList.length > 1){
    this.planFeatureForm.removeAt(item);

    }
  }
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
  preventDefault(e) {
    e.preventDefault();
  }
  findCompanyName(data) {
    const inpValue = this.fireInsuranceForm.get('insurerName').value;
    this.customerService.getCompanyNames(inpValue).subscribe(
      data => {
        console.log(data);
        this.options =data;
      }
    );
  }
  saveFireInsurance() {
    let featureList = [];
    let finalplanFeatureList = this.fireInsuranceForm.get('planFeatureForm') as FormArray
    finalplanFeatureList.controls.forEach(element => {
      if(element.get('planfeatures').value && element.get('sumInsured').value){
        let obj =
        {
          policyFeatureId : element.get('planfeatures').value,
          featureSumInsured : element.get('sumInsured').value,
        }
        featureList.push(obj)
      }
    })
    let addOns = [];
    let addOnList = this.fireInsuranceForm.get('addOnForm') as FormArray
    addOnList.controls.forEach(element => {
      if(element.get('additionalCovers').value && element.get('sumAddOns').value){
        let obj =
        {
          addOnId : element.get('additionalCovers').value,
          addOnSumInsured: element.get('sumAddOns').value,
        }
        addOns.push(obj)
      }
    })
    if (this.fireInsuranceForm.invalid) {
      this.fireInsuranceForm.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        "clientId": this.clientId,
        "advisorId": this.advisorId,
        "policyHolderId": this.fireInsuranceForm.value.getCoOwnerName[0].familyMemberId,
        "insurerName": this.fireInsuranceForm.get('insurerName').value,
        "policyNumber": this.fireInsuranceForm.get('policyNum').value,
        "policyTypeId": this.fireInsuranceForm.get('PlanType').value,
        "planName": this.fireInsuranceForm.get('planeName').value,
        "premiumAmount": this.fireInsuranceForm.get('premium').value,
        "policyStartDate":this.datePipe.transform(this.fireInsuranceForm.get('policyStartDate').value, 'yyyy-MM-dd'),
        "policyExpiryDate":this.datePipe.transform(this.fireInsuranceForm.get('policyExpiryDate').value, 'yyyy-MM-dd'),
        "exclusion": this.fireInsuranceForm.get('exclusion').value,
        "hypothetication": this.fireInsuranceForm.get('financierName').value,
        "advisorName": this.fireInsuranceForm.get('advisorName').value,
        "serviceBranch": this.fireInsuranceForm.get('serviceBranch').value,
        "insuranceSubTypeId": this.inputData.insuranceSubTypeId,
        "policyFeatures":featureList,
        "id":(this.id) ? this.id : null,
        "addOns": addOns,
        nominees: this.fireInsuranceForm.value.getNomineeName,
      }

      if (obj.nominees.length > 0) {
        obj.nominees.forEach((element, index) => {
          if (element.name == '') {
            this.removeNewNominee(index);
          }
        });
        obj.nominees = this.fireInsuranceForm.value.getNomineeName;
        obj.nominees.forEach(element => {
          if(element.sharePercentage){
            element.sumInsured = element.sharePercentage;
          }
           element.insuredOrNominee = 2
         });
      } else {
        obj.nominees = [];
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
