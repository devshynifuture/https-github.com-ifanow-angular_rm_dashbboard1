import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-add-superannuation',
  templateUrl: './add-superannuation.component.html',
  styleUrls: ['./add-superannuation.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class AddSuperannuationComponent implements OnInit {
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
  showHide = false;
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  superannuation: any;
  ownerData: any;
  advisorId: any;
  isEmployeeContry = false
  isEmployerContry = false
  isGrowthEmployer = false
  isGrowthEmployee = false
  isAssumedRateReturn = false
  isFirstDateContry = false
  clientId: any;
  nomineesListFM: any = [];
  flag: any;
  adviceShowHeaderAndFooter: boolean = true;
  callMethod:any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  constructor(private event: EventService, private router: Router, private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService) { }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Superannuation';

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
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
    this.superannuation.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.superannuation.controls.getNomineeName = con.nominee;
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
  return this.superannuation.get('getCoOwnerName') as FormArray;
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
  if (this.superannuation.value.getCoOwnerName.length == 1) {
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
  return this.superannuation.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
  this.getNominee.removeAt(item);
  if (this.superannuation.value.getNomineeName.length == 1) {
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
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }
  onChange(event, value) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.superannuation.get(value).setValue(event.target.value);
    }
  }
  // getDateYMD(){
  //   let now = moment();
  //   this.tenure =moment(this.recuringDeposit.controls.commencementDate.value).add(this.recuringDeposit.controls.tenure.value, 'months');
  //   this.getDate = this.datePipe.transform(this.tenure , 'yyyy-MM-dd')
  //   return this.getDate;
  // }
  getdataForm(data) {
    this.flag = data;
    if (data == undefined) {
      data = {}
    }
    this.superannuation = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: [0,[Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      // ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      employeeContry: [(data == undefined) ? '' : data.annualEmployeeContribution, [Validators.required]],
      employerContry: [(data == undefined) ? '' : data.annualEmployerContribution, [Validators.required]],
      growthEmployer: [(data == undefined) ? '' : data.growthRateEmployerContribution, [Validators.required]],
      growthEmployee: [(data == undefined) ? '' : data.growthRateEmployeeContribution, [Validators.required]],
      firstDateContry: [(data == undefined) ? '' : new Date(data.firstContributionDate), [Validators.required]],
      assumedRateReturn: [(data == undefined) ? '' : (data.assumedRateOfReturn), [Validators.required]],
      linkBankAc: [(data == undefined) ? '' : data.bankAccountNumber,],
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
  if(this.superannuation.value.getCoOwnerName.length == 1){
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

this.ownerData = {Fmember: this.nomineesListFM, controleData:this.superannuation}
// ==============owner-nominee Data ========================\\ 
    // this.ownerData = this.superannuation.controls;
    // this.familyMemberId = this.superannuation.controls.familyMemberId.value
    // this.familyMemberId = this.familyMemberId[0]
    // this.superannuation.controls.maturityDate.setValue(new Date(data.maturityDate));
  }
  getFormControl(): any {
    return this.superannuation.controls;
  }
  saveSuperannuation() {
    if (this.superannuation.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.superannuation.markAllAsTouched();
      return;
    } else {

      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        ownerList: this.superannuation.value.getCoOwnerName,
        // familyMemberId: this.familyMemberId,
        // ownerName: (this.ownerName == undefined) ? this.superannuation.controls.ownerName.value : this.ownerName,
        annualEmployeeContribution: this.superannuation.controls.employeeContry.value,
        annualEmployerContribution: this.superannuation.controls.employerContry.value,
        growthRateEmployeeContribution: this.superannuation.controls.growthEmployee.value,
        growthRateEmployerContribution: this.superannuation.controls.growthEmployer.value,
        firstContributionDate: this.datePipe.transform(this.superannuation.controls.firstDateContry.value, 'yyyy-MM-dd'),
        assumedRateOfReturn: this.superannuation.controls.assumedRateReturn.value,
        bankAccountNumber: this.superannuation.controls.linkBankAc.value,
        description: this.superannuation.controls.description.value,
        nomineeList: this.superannuation.value.getNomineeName,
        id: this.superannuation.controls.id.value
      }
      this.barButtonOptions.active =true;
      obj.nomineeList.forEach((element, index) => {
        if(element.name == ''){
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList= this.superannuation.value.getNomineeName;

      let adviceObj = {
        // advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.superannuation.controls.id.value == undefined && this.flag != 'adviceSuperAnnuation') {
        this.custumService.addSuperannuation(obj).subscribe(
          data => this.addSuperannuationRes(data), (error) => {
            this.barButtonOptions.active =false;
            this.event.showErrorMessage(error);
          }
        );
      } else if (this.flag == 'adviceSuperAnnuation') {
        this.custumService.getAdviceSuperannuation(adviceObj).subscribe(
          data => this.getAdviceSuperAnnuationRes(data), (error) => {
            this.barButtonOptions.active =false;
            this.event.showErrorMessage(error);
          }
        );
      } else {
        //edit call
        this.custumService.editSuperannuation(obj).subscribe(
          data => this.editSuperannuationRes(data), (error) => {
            this.barButtonOptions.active =false;
            this.event.showErrorMessage(error);
          }
        );
      }
    }
  }
  getAdviceSuperAnnuationRes(data) {
            this.barButtonOptions.active =false;
            this.event.openSnackBar('Superannuation added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'addedSuperannuation', state: 'close', data, refreshRequired: true })
  }
  addSuperannuationRes(data) {
            this.barButtonOptions.active =false;
            console.log('addrecuringDepositRes', data)
    this.event.openSnackBar('Added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'addedSuperannuation', state: 'close', data, refreshRequired: true })
  }
  editSuperannuationRes(data) {
            this.barButtonOptions.active =false;
            this.event.openSnackBar('Updated successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'addedSuperannuation', state: 'close', data, refreshRequired: true })
  }
}
