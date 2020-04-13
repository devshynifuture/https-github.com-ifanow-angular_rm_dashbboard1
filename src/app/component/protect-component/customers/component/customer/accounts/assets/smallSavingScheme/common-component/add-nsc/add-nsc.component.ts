import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { DatePipe } from '@angular/common';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-add-nsc',
  templateUrl: './add-nsc.component.html',
  styleUrls: ['./add-nsc.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
    [DatePipe],
  ]
})
export class AddNscComponent implements OnInit {
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
  validatorType = ValidatorType
  maxDate = new Date();
  advisorId: any;
  inputData: any;
  ownerData: any;
  nscFormField: any;
  callMethod:any;
  ownerName: any;
  familyMemberId: any;
  editApi: any;
  transactionData: any;
  commDate: any;
  clientId: any;
  nomineesListFM: any = [];
  nscData: any;
  nomineesList: any[] = [];
  nominees: any;
  flag: any;
  dataSource: { "id": any; "familyMemberId": any; "ownerName": any; "amountInvested": any; "commencementDate": string; "tenure": any; "certificateNumber": any; "postOfficeBranch": any; "bankAccountNumber": any; "ownerTypeId": number; "nominees": any; "description": any; };
  adviceShowHeaderAndFooter: boolean = true;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  @Input()
  set data(data) {
    this.isOptionalField = true
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add National savings certificate (NSC)';

  constructor(private datePipe: DatePipe, public utils: UtilService, private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
  isOptionalField
  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true;
  }

  isFormValuesForAdviceValid() {
    if (this.nscFormField.valid ||
      (this.nscFormField.valid && this.nscFormField.valid && this.nomineesList.length !== 0)) {
      return true;
    } else {
      return false;
    }
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
    this.nscFormField.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.nscFormField.controls.getNomineeName = con.nominee;
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
  return this.nscFormField.get('getCoOwnerName') as FormArray;
}

addNewCoOwner(data) {
  this.getCoOwner.push(this.fb.group({
    name: [data ? data.name : '', [Validators.required]], share: [data ? data.share : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0],isClient: [data ? data.isClient : 0]
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
  if (this.nscFormField.value.getCoOwnerName.length == 1) {
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
  return this.nscFormField.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
  this.getNominee.removeAt(item);
  if (this.nscFormField.value.getNomineeName.length == 1) {
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
    name: [data ? data.name : ''], sharePercentage: [data ? data.sharePercentage : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0],isClient: [data ? data.isClient : 0]
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
    if (data == undefined) {
      data = {};
      this.flag = "addNSC";
    }
    else {
      this.flag = "editNSC";
      (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editApi = data;
      this.commDate = new Date(data.commencementDate)
    }
    this.nscData = data
    this.nscFormField = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: [0,[Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      amountInvested: [data.amountInvested, [Validators.required, Validators.min(100)]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      Tenure: [(data.tenure) ? String(data.tenure) : '5', [Validators.required]],
      ownershipType: [(data.ownerTypeId) ? String(data.ownerTypeId) : '1', [Validators.required]],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]],
      cNo: [data.certificateNumber],
      poBranch: [data.postOfficeBranch],
      nominees: this.nominees,
      linkedBankAccount: [data.bankAccountNumber],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id:[0]
      })]),
      description: [data.description]
    })
    // this.nscFormField = this.fb.group({
    // })
    // ==============owner-nominee Data ========================\\
  /***owner***/ 
  if(this.nscFormField.value.getCoOwnerName.length == 1){
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

this.ownerData = {Fmember: this.nomineesListFM, controleData:this.nscFormField}
// ==============owner-nominee Data ========================\\ 
    // this.ownerData = this.nscFormField.controls;
    // this.familyMemberId = this.nscFormField.controls.familyMemberId.value
    // this.familyMemberId = this.familyMemberId[0]

  }
  
  // getFormData(data) {
  //   console.log(data)
  //   this.transactionData = data.controls
  // }
  addNSC() {
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
    // if (this.transactionData) {
    //   let finalTransctList = []
    //   this.transactionData.forEach(element => {
    //     let obj = {
    //       "date": element.controls.date.value._d,
    //       "amount": element.controls.amount.value,
    //       "paymentType": element.controls.transactionType.value
    //     }
    //     finalTransctList.push(obj)
    //   });
    // }
    if (this.nscFormField.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.nscFormField.markAllAsTouched();
    }
    else {
      this.barButtonOptions.active = true;
      if (this.flag == "editNSC") {
        let obj =
        {
          "id": this.editApi.id,
          "familyMemberId": this.familyMemberId,
          "ownerList": this.nscFormField.value.getCoOwnerName,
          // "ownerName": (this.ownerName == undefined) ? this.nscFormField.controls.ownerName.value : this.ownerName.userName,
          "amountInvested": this.nscFormField.get('amountInvested').value,
          "commencementDate": this.datePipe.transform(this.nscFormField.get('commDate').value, 'yyyy-MM-dd'),
          "tenure": this.nscFormField.get('Tenure').value,
          "certificateNumber": this.nscFormField.get('cNo').value,
          "postOfficeBranch": this.nscFormField.get('poBranch').value,
          "bankAccountNumber": this.nscFormField.get('linkedBankAccount').value,
          "ownerTypeId": parseInt(this.nscFormField.get('ownershipType').value),
          "nominees": this.nominees,
          "nomineeList": this.nscFormField.value.getNomineeName,
          "description": this.nscFormField.get('description').value,
        }
        this.cusService.editNSCData(obj).subscribe(
          data => this.addNSCResponse(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
      else {
        let obj =
        {
          "clientId": this.clientId,
          "familyMemberId": this.familyMemberId,
          "advisorId": this.advisorId,
          "ownerList": this.nscFormField.value.getCoOwnerName,
          // "ownerName": (this.ownerName == undefined) ? this.nscFormField.controls.ownerName.value : this.ownerName.userName,
          "amountInvested": this.nscFormField.get('amountInvested').value,
          "commencementDate": this.datePipe.transform(this.nscFormField.get('commDate').value, 'yyyy-MM-dd'),
          "tenure": this.nscFormField.get('Tenure').value,
          "certificateNumber": this.nscFormField.get('cNo').value,
          "postOfficeBranch": this.nscFormField.get('poBranch').value,
          "bankAccountNumber": this.nscFormField.get('linkedBankAccount').value,
          "ownerTypeId": parseInt(this.nscFormField.get('ownershipType').value),
          "nominees": this.nominees,
          "nomineeList": this.nscFormField.value.getNomineeName,
          "description": this.nscFormField.get('description').value
        }
        console.log(obj)
        let adviceObj = {
          // advice_id: this.advisorId,
          adviceStatusId: 5,
          stringObject: obj,
          adviceDescription: "manualAssetDescription"
        }
        if (this.flag == 'adviceNSC') {
          this.cusService.getAdviceNsc(adviceObj).subscribe(
            data => this.getAdviceNscRes(data),
            err =>{
              this.barButtonOptions.active = false;
              this.eventService.openSnackBar(err, "Dismiss");
            }
          );
        } else {
          this.cusService.addNSCScheme(obj).subscribe(
            data => this.addNSCResponse(data),
            error =>{
              this.barButtonOptions.active = false;
              this.eventService.showErrorMessage(error)
            }
          )
        }
      }
    }
  }
  getAdviceNscRes(data) {
    console.log(data);
    this.barButtonOptions.active = false;
    this.eventService.openSnackBar("NSC is added", "ok")
    this.close(true);
  }
  addNSCResponse(data) {
    this.barButtonOptions.active = false;
    (this.editApi) ? this.eventService.openSnackBar("Updated successfully!", "Dismiss") : this.eventService.openSnackBar("Added successfully!", "Dismiss")
    console.log(data)
    this.close(true)
  }
  close(flag) {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
