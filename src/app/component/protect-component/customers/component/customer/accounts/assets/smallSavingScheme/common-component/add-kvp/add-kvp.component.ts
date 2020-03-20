import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { UtilService, ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-kvp',
  templateUrl: './add-kvp.component.html',
  styleUrls: ['./add-kvp.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddKvpComponent implements OnInit {
  validatorType = ValidatorType
  maxDate = new Date();
  inputData: any;
  advisorId: any;
  clientId: any; Outstanding
  familyMemberId: any;
  ownerName: any;
  editApi: any;
  ownerData: any;
  isOptionalField: boolean;
  KVPFormScheme: any;
    nomineesListFM: any = [];
  nomineesList: any[] = [];
  nominees: any[];
  kvpData;
  flag: any;
  callMethod:any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  adviceShowHeaderAndFooter: boolean = true;
  constructor(public utils: UtilService, private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }

  @Input()
  set data(data) {
    this.inputData = data;
  }
  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Kisan vikas patra (KVP)';

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.isOptionalField = true;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getdataForm(this.data);
  }

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
    this.KVPFormScheme.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.KVPFormScheme.controls.getNomineeName = con.nominee;
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
  return this.KVPFormScheme.get('getCoOwnerName') as FormArray;
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
  if (this.KVPFormScheme.value.getCoOwnerName.length == 1) {
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
  return this.KVPFormScheme.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
  this.getNominee.removeAt(item);
  if (this.KVPFormScheme.value.getNomineeName.length == 1) {
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

  
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  getdataForm(data) {

    if (data == undefined) {
      data = {};
      this.flag = 'addKVP';
    }
    else {
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editApi = data;
      this.flag = 'editKVP'
    }
    this.KVPFormScheme = this.fb.group({
      // ownerName: [data.ownerName, [Validators.required]],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: ['',[Validators.required]],
        familyMemberId: 0,
        id:0
      })]),
      amtInvested: [data.amountInvested, [Validators.required, Validators.min(1000)]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      ownerType: [data.ownershipTypeId ? String(data.ownershipTypeId) : '1', [Validators.required]],
      poBranch: [data.postOfficeBranch],
      nominees: this.nominees,
      bankAccNum: [data.bankAccountNumber],
      description: [data.description],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id:[0]
      })])
    })
    // ==============owner-nominee Data ========================\\
  /***owner***/ 
  if(this.KVPFormScheme.value.getCoOwnerName.length == 1){
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

this.ownerData = {Fmember: this.nomineesListFM, controleData:this.KVPFormScheme}
// ==============owner-nominee Data ========================\\ 
    // this.ownerData = this.KVPFormScheme.controls;
    // this.familyMemberId = data.familyMemberId;
  }

  addKVP() {
    // this.nominees = []
    // if (this.nomineesList) {

    //   this.nomineesList.forEach(element => {
    //     let obj = {
    //       "name": element.controls.name.value,
    //       "sharePercentage": element.controls.sharePercentage.value,
    //       "id": element.id,
    //       "familyMemberId": element.familyMemberId
    //     }
    //     this.nominees.push(obj)
    //   });
    // }
    if (this.KVPFormScheme.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.KVPFormScheme.markAllAsTouched();
      return;
    }
    else {
      let obj =
      {
        "clientId": this.clientId,
        "advisorId": this.advisorId,
        "ownerList": this.KVPFormScheme.value.getCoOwnerName,
        // "familyMemberId": this.familyMemberId,
        // "ownerName": (this.ownerName == undefined) ? this.KVPFormScheme.controls.ownerName.value : this.ownerName.userName,
        "amountInvested": this.KVPFormScheme.get('amtInvested').value,
        "commencementDate": this.KVPFormScheme.get('commDate').value,
        "postOfficeBranch": this.KVPFormScheme.get('poBranch').value,
        "ownershipTypeId": this.KVPFormScheme.get('ownerType').value,
        "nominees": this.nominees,
        "bankAccountNumber": this.KVPFormScheme.get('bankAccNum').value,
        "description": this.KVPFormScheme.get('description').value,
        "nomineeList": this.KVPFormScheme.value.getNomineeName,

      }

      obj.nomineeList.forEach((element, index) => {
        if(element.name == ''){
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList= this.KVPFormScheme.value.getNomineeName;
      let adviceObj = {
        advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.flag == 'adviceKVP') {
        this.cusService.getAdviceKvp(adviceObj).subscribe(
          data => this.getAdviceKvpRes(data),
          err => this.eventService.openSnackBar(err, "Dismiss")
        );
      } else if (this.flag == 'editKVP') {
        obj['id'] = this.editApi.id
        this.cusService.editKVP(obj).subscribe(
          data => this.addKVPResponse(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
      else {
        this.cusService.addKVP(obj).subscribe(
          data => this.addKVPResponse(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
    }
  }
  getAdviceKvpRes(data) {
    console.log(data);
    this.eventService.openSnackBar("KVP is added", "ok")
    this.close(true);
  }
  addKVPResponse(data) {
    (this.editApi) ? this.eventService.openSnackBar("Updated successfully!", "Dismiss") : this.eventService.openSnackBar("Added successfully!", "added")
    console.log(data)
    this.close(true);
  }
  close(flag) {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  isFormValuesForAdviceValid() {
    if (this.KVPFormScheme.valid || (this.KVPFormScheme.valid && this.KVPFormScheme.valid)) {
      return true;
    } else {
      return false;
    }
  }
}
