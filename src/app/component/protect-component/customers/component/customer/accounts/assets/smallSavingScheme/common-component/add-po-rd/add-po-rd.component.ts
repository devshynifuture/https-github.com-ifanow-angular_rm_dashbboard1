import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { UtilService, ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-po-rd',
  templateUrl: './add-po-rd.component.html',
  styleUrls: ['./add-po-rd.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddPoRdComponent implements OnInit {
  validatorType = ValidatorType
  maxDate = new Date();
  isOptionalField: any;
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  advisorId: any;
  clientId: number;
  ownerData: any;
  PORDForm: any;
  callMethod: any;
  editApi: any;
    nomineesListFM: any = [];
  pordData: any;
  nomineesList: any[] = [];
  nominees: any[];
  flag: any;
  multiplesOfFive: boolean = true;
  adviceShowHeaderAndFooter: boolean = true;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  constructor(public utils: UtilService, private fb: FormBuilder, private cusService: CustomerService, private eventService: EventService,
    private subInjectService: SubscriptionInject) {
  }

  @Input() popupHeaderText: string = 'Add Post office recurring deposit (PO RD)';

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

  numberMultiplesOfFive(event) {
    const val = event.target.value;
    if (val % 5 !== 0) {
      event.target.value = (Math.round(val / 5) + 1) * 5;
      this.multiplesOfFive = false;
    } else {
      event.target.value = val;
    }
  }

  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true;
  }

  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
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
    this.PORDForm.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.PORDForm.controls.getNomineeName = con.nominee;
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
  return this.PORDForm.get('getCoOwnerName') as FormArray;
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
  if (this.PORDForm.value.getCoOwnerName.length == 1) {
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
  return this.PORDForm.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
  this.getNominee.removeAt(item);
  if (this.PORDForm.value.getNomineeName.length == 1) {
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

checkValue(){
  if(this.PORDForm.get('tenure').value%5 != 0){
    this.PORDForm.get('tenure').setErrors({incorrect: true});
  }
  else{
    this.PORDForm.get('tenure').setErrors({incorrect: false});
  }
}
  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {};
      this.flag = "addPORD";
    } else {
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editApi = data;
      this.flag = "editPORD";
    }
    this.pordData = data;
    this.PORDForm = this.fb.group({
      // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: ['',[Validators.required]],
        familyMemberId: 0,
        id:0
      })]),
      monthlyContribution: [data.monthlyContribution, [Validators.required, Validators.min(10)]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      tenure: [(data.tenure) ? data.tenure : 5, [Validators.required]],
      ownership: [(data.ownerTypeId) ? String(data.ownerTypeId) : '1', [Validators.required]],
      interestRate: [!data.interestRate ? '7.2' : data.interestRate, [Validators.required]],
      compound: [(!data.compound) ? '3' : data.compound, [Validators.required]],
      rdNum: [data.rdNumber],
      poBranch: [data.postOfficeBranch],
      nominees: this.nominees,
      linkedBankAcc: [data.linkedBankAccount],
      description: [data.description],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id:[0]
      })])
    });
    

    // ==============owner-nominee Data ========================\\
  /***owner***/ 
  if(this.PORDForm.value.getCoOwnerName.length == 1){
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

this.ownerData = {Fmember: this.nomineesListFM, controleData:this.PORDForm}
// ==============owner-nominee Data ========================\\ 
    // this.ownerData = this.PORDForm.controls;
    // this.familyMemberId = data.familyMemberId;
  }

  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.PORDForm.get('interestRate').setValue(event.target.value);
    }
  }

  addPORD() {
    this.nominees = []
    if (this.nomineesList) {

      this.nomineesList.forEach(element => {
        let obj = {
          "name": element.controls.name.value,
          "sharePercentage": element.controls.sharePercentage.value,
          "id": element.controls.id.value,
          "familyMemberId": element.controls.familyMemberId.value
        }
        this.nominees.push(obj)
      });
    }
    if (this.PORDForm.invalid) {
      this.PORDForm.markAllAsTouched();
    } else {
      const obj = {
        clientId: this.clientId,
        advisorId: this.advisorId,
        ownerList: this.PORDForm.value.getCoOwnerName,
        // familyMemberId: this.familyMemberId,
        // ownerName: (this.ownerName == undefined) ? this.PORDForm.controls.ownerName.value : this.ownerName.userName,
        monthlyContribution: this.PORDForm.get('monthlyContribution').value,
        commencementDate: this.PORDForm.get('commDate').value,
        rdNumber: this.PORDForm.get('rdNum').value,
        postOfficeBranch: this.PORDForm.get('poBranch').value,
        nominees: this.nominees,
        description: this.PORDForm.get('description').value,
        interestRate: this.PORDForm.get('interestRate').value,
        ownerTypeId: this.PORDForm.get('ownership').value,
        interestCompounding: this.PORDForm.get('compound').value,
        linkedBankAccount: this.PORDForm.get('linkedBankAcc').value,
        nomineeList: this.PORDForm.value.getNomineeName,
        isActive: 1,
      };

      obj.nomineeList.forEach((element, index) => {
        if(element.name == ''){
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList= this.PORDForm.value.getNomineeName;

      if (this.flag == "editPORD") {
        obj['id'] = this.editApi.id;
        this.cusService.editPORD(obj).subscribe(
          data => this.addPORDResponse(data),
          error => this.eventService.showErrorMessage(error)
        );
      } else {
        if (this.flag == 'advicePORD') {
          let adviceObj = {
            advice_id: this.advisorId,
            adviceStatusId: 5,
            stringObject: obj,
            adviceDescription: "manualAssetDescription"
          }
          this.cusService.getAdvicePord(adviceObj).subscribe(
            data => this.getAdvicePordRes(data),
            err => this.eventService.openSnackBar(err, "Dismiss")
          );
        } else {
          this.cusService.addPORDScheme(obj).subscribe(
            data => this.addPORDResponse(data),
            error => this.eventService.showErrorMessage(error)
          );
        }
      }
    }
  }
  getAdvicePordRes(data) {
    this.eventService.openSnackBar('PO_RD is added', 'added');
    this.close(true);
  }
  addPORDResponse(data) {
    (this.flag = "editPORD") ? this.eventService.openSnackBar('Updated successfully!', 'Dismiss') : this.eventService.openSnackBar('Added successfully!', 'Dismiss');
    console.log(data);
    this.close(true);
  }

  close(flag) {
    this.isOptionalField = true;
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  isFormValuesForAdviceValid() {
    if (this.PORDForm.valid ||
      (this.PORDForm.valid && this.PORDForm.valid && this.nomineesList.length !== 0)) {
      return true;
    } else {
      return false;
    }
  }
}
