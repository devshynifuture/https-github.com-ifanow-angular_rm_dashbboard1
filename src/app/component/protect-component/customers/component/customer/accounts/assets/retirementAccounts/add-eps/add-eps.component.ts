import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-add-eps',
  templateUrl: './add-eps.component.html',
  styleUrls: ['./add-eps.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class AddEPSComponent implements OnInit {
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
  validatorType = ValidatorType;
  maxDate = new Date();
  inputData: any;
  advisorId: any;
  ownerName: any;
  familyMemberId: any;
  showHide = false;
  eps: any;
  ownerData: any;
  isPensionAmount = false
  isDate = false;
  isPensionPayFreq = false;
  clientId: any;
  nomineesListFM: any = [];
  flag: any;
  callMethod:any;
  adviceShowHeaderAndFooter: boolean = true;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  constructor(private event: EventService, private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService) { }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  @Input() popupHeaderText: string = 'Add EPS';

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
 
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag })
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
    this.eps.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.eps.controls.getNomineeName = con.nominee;
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
  return this.eps.get('getCoOwnerName') as FormArray;
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
  if (this.eps.value.getCoOwnerName.length == 1) {
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
  return this.eps.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
  this.disabledMember(null, null);
  this.getNominee.removeAt(item);
  if (this.eps.value.getNomineeName.length == 1) {
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
  // getDateYMD(){
  //   let now = moment();
  //   this.tenure =moment(this.recuringDeposit.controls.commencementDate.value).add(this.recuringDeposit.controls.tenure.value, 'months');
  //   this.getDate = this.datePipe.transform(this.tenure , 'yyyy-MM-dd')
  //   return this.getDate;
  // }
  getdataForm(data) {
    if (data == undefined) {
      data = {};
      this.flag = "addEPS";
    }
    else {
      this.flag = "editEPS";
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : '';
    }

    this.eps = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: [0,[Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      // ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      commencementDate: [(data == undefined) ? '' : new Date(data.commencementDate), [Validators.required]],
      pensionAmount: [(data == undefined) ? '' : data.pensionAmount, [Validators.required]],
      pensionPayFreq: [(data.pensionPayoutFrequencyId == undefined) ? '' : (data.pensionPayoutFrequencyId) + "", [Validators.required]],
      bankAcNo: [(data == undefined) ? '' : data.linkedBankAccount,],
      description: [(data == undefined) ? '' : data.description,],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id:[0]
      })]),
      id: [(data == undefined) ? '' : data.id,],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId],]
    });
    // ==============owner-nominee Data ========================\\
  /***owner***/ 
  if(this.eps.value.getCoOwnerName.length == 1){
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
  if(data.nomineeList.length > 0){
      
    this.getNominee.removeAt(0);
    data.nomineeList.forEach(element => {
      this.addNewNominee(element);
    });
  }
}
/***nominee***/ 

this.ownerData = {Fmember: this.nomineesListFM, controleData:this.eps}
// ==============owner-nominee Data ========================\\ 
    // this.ownerData = this.eps.controls;
    // this.familyMemberId = this.eps.controls.familyMemberId.value
    // this.familyMemberId = this.familyMemberId[0]
    // this.epf.controls.maturityDate.setValue(new Date(data.maturityDate));
  }
  getFormControl(): any {
    return this.eps.controls;
  }

  saveEPF() {

    if (this.eps.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.eps.markAllAsTouched();
      return;
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        ownerList: this.eps.value.getCoOwnerName,
        // familyMemberId: this.familyMemberId,
        // ownerName: (this.ownerName == undefined) ? this.eps.controls.ownerName.value : this.ownerName,
        commencementDate: this.eps.controls.commencementDate.value,
        pensionAmount: this.eps.controls.pensionAmount.value,
        pensionPayoutFrequencyId: this.eps.controls.pensionPayFreq.value,
        linkedBankAccount: this.eps.controls.bankAcNo.value,
        description: this.eps.controls.description.value,
        nomineeList: this.eps.value.getNomineeName,
        id: this.eps.controls.id.value
      }
      this.barButtonOptions.active = true;
      obj.nomineeList.forEach((element, index) => {
        if(element.name == ''){
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList= this.eps.value.getNomineeName;
      let adviceObj = {
        // advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.flag == "addEPS") {
        this.custumService.addEPS(obj).subscribe(
          data => this.addEPSRes(data), (error) => {
            this.event.showErrorMessage(error);this.barButtonOptions.active = false;
          }
        );
      } else if (this.flag == 'adviceEPS') {
        this.custumService.getAdviceEps(adviceObj).subscribe(
          data => this.getAdviceEpsRes(data), (error) => {
            this.event.showErrorMessage(error);this.barButtonOptions.active = false;
          }
        );
      } else {
        //edit call
        this.custumService.editEPS(obj).subscribe(
          data => this.editEPSRes(data), (error) => {
            this.event.showErrorMessage(error);this.barButtonOptions.active = false;
          }
        );
      }
    }
  }
  getAdviceEpsRes(data) {
    this.barButtonOptions.active = false;
    this.event.openSnackBar('EPS added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'addedEps', state: 'close', data, refreshRequired: true })
  }
  addEPSRes(data) {
    this.barButtonOptions.active = false;
    console.log('addrecuringDepositRes', data)
    this.event.openSnackBar('Added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'addedEps', state: 'close', data, refreshRequired: true })
  }
  editEPSRes(data) {
    this.barButtonOptions.active = false;
    this.event.openSnackBar('Updated successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'addedEps', state: 'close', data, refreshRequired: true })
  }
}
