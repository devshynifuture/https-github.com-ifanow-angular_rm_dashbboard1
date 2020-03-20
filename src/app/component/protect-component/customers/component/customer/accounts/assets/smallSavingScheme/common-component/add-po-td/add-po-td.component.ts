import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { AssetValidationService } from './../../../asset-validation.service';

@Component({
  selector: 'app-add-po-td',
  templateUrl: './add-po-td.component.html',
  styleUrls: ['./add-po-td.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddPoTdComponent implements OnInit {
  validatorType = ValidatorType
  maxDate = new Date();
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  ownerData: any;
  POTDForm: any;
  callMethod:any;
  advisorId: any;
  isOptionalField: any;
  transactionData: any;
  editApi: any;
  clientId: any;
    nomineesListFM: any = [];
  nomineesList: any[] = [];
  nominees: any[];
  potdData: any;
  flag: any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  adviceShowHeaderAndFooter: boolean = true;

  constructor(public utils: UtilService, private fb: FormBuilder, private cusService: CustomerService, private eventService: EventService, private subInjectService: SubscriptionInject, private util: UtilService) { }
  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Post office time deposit (PO TD)';

  

// ===================owner-nominee directive=====================//
display(value) {
  console.log('value selected', value)
  this.ownerName = value.userName;
  this.familyMemberId = value.id
}

lisNominee(value) {
  this.ownerData.Fmember = value;
  this.nomineesListFM = Object.assign([], value);
}

disabledMember(value, type) {
  this.callMethod = {
    methodName : "disabledMember",
    ParamValue : value,
    disControl : type
  }
}

displayControler(con) {
  console.log('value selected', con);
  if(con.owner != null && con.owner){
    this.POTDForm.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.POTDForm.controls.getNomineeName = con.nominee;
  }
}

onChangeJointOwnership(data) {
  this.callMethod = {
    methodName : "onChangeJointOwnership",
    ParamValue : data
  }
}

/***owner***/ 

get getCoOwner() {
  return this.POTDForm.get('getCoOwnerName') as FormArray;
}

addNewCoOwner(data) {
  this.getCoOwner.push(this.fb.group({
    name: [data ? data.name : '', [Validators.required]], share: [data ? data.share : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0]
  }));
  if (data) {
    setTimeout(() => {
     this.disabledMember(null,null);
    }, 1300);
  }

  if(this.getCoOwner.value.length > 1 && !data){
   let share = 100/this.getCoOwner.value.length;
   for (let e in this.getCoOwner.controls) {
    if(!Number.isInteger(share) && e == "0"){
      this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
    }
    else{
      this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
    }
   }
  }
  
}

removeCoOwner(item) {
  this.getCoOwner.removeAt(item);
  if (this.POTDForm.value.getCoOwnerName.length == 1) {
    this.getCoOwner.controls['0'].get('share').setValue('100');
  } else {
    let share = 100/this.getCoOwner.value.length;
    for (let e in this.getCoOwner.controls) {
      if(!Number.isInteger(share) && e == "0"){
        this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
      }
      else{
        this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
      }
    }
  }
  this.disabledMember(null, null);
}
/***owner***/ 

/***nominee***/ 

get getNominee() {
  return this.POTDForm.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
  this.getNominee.removeAt(item);
  if (this.POTDForm.value.getNomineeName.length == 1) {
    this.getNominee.controls['0'].get('sharePercentage').setValue('100');
  } else {
    let share = 100/this.getNominee.value.length;
    for (let e in this.getNominee.controls) {
      if(!Number.isInteger(share) && e == "0"){
        this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
      }
      else{
        this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
      }
    }
  }
}



addNewNominee(data) {
  this.getNominee.push(this.fb.group({
    name: [data ? data.name : ''], sharePercentage: [data ? data.sharePercentage : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0]
  }));
  if (!data || this.getNominee.value.length < 1) {
    for (let e in this.getNominee.controls) {
      this.getNominee.controls[e].get('sharePercentage').setValue(0);
    }
  }

  if(this.getNominee.value.length > 1 && !data){
    let share = 100/this.getNominee.value.length;
    for (let e in this.getNominee.controls) {
      if(!Number.isInteger(share) && e == "0"){
        this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
      }
      else{
        this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
      }
    }
   }
   
  
}
/***nominee***/ 
// ===================owner-nominee directive=====================//

  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  getdataForm(data) {
    this.flag = data;
    (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : '';

    this.editApi = data.id ? data : undefined;
    this.potdData = data;
    this.POTDForm = this.fb.group({
      // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required, AssetValidationService.ageValidators(10)]],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: ['',[Validators.required]],
        familyMemberId: 0,
        id:0
      })]),
      amtInvested: [data.amountInvested, [Validators.required, Validators.min(200)]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      description: [data.description],

      // tenure: [(data.tenure) ? String(data.tenure) : '1', [Validators.required]],
      // ownershipType: [(data.ownerTypeId) ? String(data.ownerTypeId) : '1', [Validators.required]]
      poBranch: [],
      nominee: [],
      tdNum: [data.tdNumber],
      bankAccNum: [],
      // description: [data.description],
      id: [data.id],
      // nominees: this.nominees
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id:[0]
      })])
    })
    // ==============owner-nominee Data ========================\\
  /***owner***/ 
  if(this.POTDForm.value.getCoOwnerName.length == 1){
    this.getCoOwner.controls['0'].get('share').setValue('100');
  }

  if (data.ownerList) {
    this.getCoOwner.removeAt(0);
    data.ownerList.forEach(element => {
      this.addNewCoOwner(element);
    });
  }
  
/***owner***/ 

/***nominee***/ 
if(data.nomineeList){
  this.getNominee.removeAt(0);
  data.nomineeList.forEach(element => {
    this.addNewNominee(element);
  });
}
/***nominee***/ 

this.ownerData = {Fmember: this.nomineesListFM, controleData:this.POTDForm}
// ==============owner-nominee Data ========================\\ 
    // this.ownerData = this.POTDForm.controls;
    // this.familyMemberId = data.familyMemberId;
  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.getdataForm(this.data);
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.isOptionalField = true;
  }
  getFormData(data) {
    console.log(data)
    this.transactionData = data.controls
  }
  addPOTD() {
    let finalTransctList = []
    if (this.transactionData) {

      this.transactionData.forEach(element => {
        let obj = {
          "date": element.controls.date.value,
          "amount": element.controls.amount.value,
          "paymentType": element.controls.transactionType.value
        }
        finalTransctList.push(obj)
      });
    }
    this.nominees = []
    if (this.nomineesList) {

      this.nomineesList.forEach(element => {
        let obj = {
          "name": element.controls.name.value,
          "sharePercentage": element.controls.sharePercentage.value,
          "id": element.id,
          "familyMemberId": element.familyMemberId
        }
        this.nominees.push(obj)
      });
    }
    if (this.POTDForm.invalid) {
      // this.inputs.find(input => !input.ngControl.valid).focus();
      this.POTDForm.markAllAsTouched();
    }
    else {
        let obj = {
          "advice_id": this.advisorId,
          "clientId": this.clientId,
          "familyMemberId": this.familyMemberId,
          "ownerList": this.POTDForm.value.getCoOwnerName,
          // "ownerName": (this.ownerName == null) ? this.POTDForm.controls.ownerName.value : this.ownerName.userName,
          "amountInvested": this.POTDForm.get('amtInvested').value,
          "commencementDate": this.POTDForm.get('commDate').value,
          // "tenure": this.POTDForm.get('tenure').value,
          "postOfficeBranch": this.POTDForm.get('poBranch').value,
          // "ownerTypeId": this.POTDForm.get('ownershipType').value,
          // "nominees": this.nominees,
          "tdNumber": this.POTDForm.get('tdNum').value,
          "bankAccountNumber": this.POTDForm.get('bankAccNum').value,
          "description": this.POTDForm.get('description').value,
          "nomineeList": this.POTDForm.value.getNomineeName,
          "id": this.POTDForm.get('id').value
        }

        obj.nomineeList.forEach((element, index) => {
          if(element.name == ''){
            this.removeNewNominee(index);
          }
        });
        obj.nomineeList= this.POTDForm.value.getNomineeName;

        let adviceObj = {
          advice_id: this.advisorId,
          adviceStatusId: 5,
          stringObject: obj,
          adviceDescription: "manualAssetDescription"
        }
      if (this.editApi != undefined && this.editApi != 'advicePOTD') {

        this.cusService.editPOTD(obj).subscribe(
          data => this.response(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
      else if (this.flag == 'advicePOTD') {
      this.cusService.getAdvicePord(adviceObj).subscribe(
        data => this.getAdvicePotdRes(data),
        err => this.eventService.openSnackBar(err, "Dismiss")
      );
      } else {
        this.cusService.addPOTD(obj).subscribe(
          data => this.response(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
    }
  }
  getAdvicePotdRes(data) {
    this.eventService.openSnackBar("PO_TD is added", "added");
    this.close(true);

  }
  response(data) {
    (this.editApi) ? this.eventService.openSnackBar("Updated successfully!", "Dismiss") : this.eventService.openSnackBar("Added successfully!", "added")
    console.log(data)
    this.close(true);
  }
  close(flag) {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  isFormValuesForAdviceValid() {
    if (this.POTDForm.valid ||
      (this.POTDForm.valid && this.POTDForm.valid && this.nomineesList.length !== 0)) {
      return true;
    } else {
      return false;
    }
  }

}
