import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
// import { MAT_DATE_FORMATS, MatInput } from '@angular/material/core';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { DatePipe } from '@angular/common';
import { AssetValidationService } from '../../../asset-validation.service';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-add-po-mis',
  templateUrl: './add-po-mis.component.html',
  styleUrls: ['./add-po-mis.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class AddPoMisComponent implements OnInit {
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
  show: boolean;
  _inputData: any;
  pomisForm: any;
  ownerData: any;
  ownerName: any;
  selectedFamilyData: any;
  isAmtValid: boolean;
  isDateValid: boolean;
  isTypeValid: boolean;
  advisorId: any;
  clientId: number;
  familyMemberId: any;
  nominees: any;
  nomineesList: any[] = [];
    nomineesListFM: any = [];
  pomisData: any;
  flag: any;
  callMethod:any;
  editApi: any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  adviceShowHeaderAndFooter: boolean = true;

  constructor(public utils: UtilService, private fb: FormBuilder, public subInjectService: SubscriptionInject,
    public custumService: CustomerService, public eventService: EventService) {
  }

  @Input()
  set data(inputData) {
    this._inputData = inputData;
  }

  get data() {
    return this._inputData;
  }

  @Input() popupHeaderText: string = 'Add Post office monthly income scheme (PO MIS)';

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.show = false;
    this.getPomisData(this.data);

  }

  close(flag) {
    // let data=this._inputData.loanTypeId;
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
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
    this.pomisForm.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.pomisForm.controls.getNomineeName = con.nominee;
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
  return this.pomisForm.get('getCoOwnerName') as FormArray;
}

addNewCoOwner(data) {
  this.pomisForm.controls["amtInvested"].setValue("");
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
  this.pomisForm.controls["amtInvested"].setValue("");
  this.getCoOwner.removeAt(item);
  if (this.pomisForm.value.getCoOwnerName.length == 1) {
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
  return this.pomisForm.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
  this.disabledMember(null, null);
  this.getNominee.removeAt(item);
  if (this.pomisForm.value.getNomineeName.length == 1) {
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

  
  getPomisData(data) {
    this.flag = data;
    (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : ''
    this.pomisData = data;
    if (data == undefined) {
      data = {};
    } else {
      this.editApi = data;
    }
    this.pomisForm = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: [0,[Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required, AssetValidationService.ageValidators(10)]],
      amtInvested: [data.amountInvested, [Validators.required, Validators.min(1500)]],
      commencementdate: [new Date(data.commencementDate), [Validators.required]],
      tenure: [(data.tenure) ? data.tenure : '5', [Validators.required]],
      ownershipType: [(data.ownerTypeId) ? data.ownerTypeId : '1', [Validators.required]],
      poBranch: [data.postOfficeBranch],
      nominees: [data.nominees],
      accNumber: [(data.bankAccountNumber)],
      description: [data.description],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id:[0]
      })]),
      id:[data.id]
    });
     // ==============owner-nominee Data ========================\\
  /***owner***/ 
  if(this.pomisForm.value.getCoOwnerName.length == 1){
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

this.ownerData = {Fmember: this.nomineesListFM, controleData:this.pomisForm}
// ==============owner-nominee Data ========================\\ 
    // this.ownerData = this.pomisForm.controls;
    // this.familyMemberId = data.familyMemberId;
  }

  join:boolean = false;
  checkOwnerType(){
    if(this.getCoOwner.length>1){
      this.pomisForm.controls["amtInvested"].setValidators(Validators.max(900000));
      this.pomisForm.controls["amtInvested"].updateValueAndValidity();
      this.join = true;
    }
    else{
      this.pomisForm.controls["amtInvested"].setValidators(Validators.max(450000));
      this.pomisForm.controls["amtInvested"].updateValueAndValidity();
      this.join = false;
    }
  }

  getFormControl() {
    return this.pomisForm.controls;
  }
  getFormData(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  changeMaxValue(data) {
    // console.log(data.value)
    (data.value == 1) ? this.pomisForm.get('amtInvested').setValidators([Validators.max(450000)]) : this.pomisForm.get('amtInvested').setValidators([Validators.max(900000)])
  }
  saveFormData(state) {
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
    if (this.pomisForm.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.pomisForm.markAllAsTouched();
    } else {
        this.barButtonOptions.active = true;
        const obj = {
          id: this.pomisForm.value.id,
          clientId: this.clientId,
          // familyMemberId: this.familyMemberId.id,
          advisorId: this.advisorId,
          ownerList: this.pomisForm.value.getCoOwnerName,
          // ownerName: (this.ownerName == undefined) ? this.pomisForm.controls.ownerName.value : this.ownerName.userName,
          amountInvested: this.pomisForm.controls.amtInvested.value,
          commencementDate: this.pomisForm.controls.commencementdate.value,
          postOfficeBranch: this.pomisForm.controls.poBranch.value,
          bankAccountNumber: this.pomisForm.controls.accNumber.value,
          ownerTypeId: this.pomisForm.controls.ownershipType.value,
          nomineeList: this.pomisForm.value.getNomineeName,
          // nominees: this.nominees,
          description: this.pomisForm.controls.description.value,
          // "createdDate":"2001-01-01"
          
        };

        obj.nomineeList.forEach((element, index) => {
          if(element.name == ''){
            this.removeNewNominee(index);
          }
        });
        obj.nomineeList= this.pomisForm.value.getNomineeName;

        let adviceObj = {
          // advice_id: this.advisorId,
          adviceStatusId: 5,
          // stringObject: obj,
          adviceDescription: "manualAssetDescription"
        }

        if (this.pomisForm.value.id != null) {
        this.custumService.editPOMIS(obj).subscribe(
          data => this.editPOMISRes(data),
        err => {
          this.barButtonOptions.active = false;
          this.eventService.openSnackBar(err, "Dismiss")
        }
        );
      } 
      else if (this.flag == 'advicePOMIS') {
          this.custumService.getAdvicePomis(adviceObj).subscribe(
            data => this.getAdvicePomisRes(data),
            err =>{
              this.barButtonOptions.active = false;
              this.eventService.openSnackBar(err, "Dismiss")
            }
          );
        } 
      else {
        this.custumService.addPOMIS(obj).subscribe(
          data => this.addPOMISRes(data),
          err => {
            this.barButtonOptions.active = false;
            this.eventService.openSnackBar(err, "Dismiss")
          }
        );
      }
    }
  }
  getAdvicePomisRes(data) {
    this.eventService.openSnackBar('Pomis added successfully', 'OK');
    this.close(true);
    this.barButtonOptions.active = false;
  }
  addPOMISRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
      this.eventService.openSnackBar('Added successfully!', 'OK');
      
    } else {
      this.eventService.openSnackBar('Error', 'Dismiss');

    }
    this.barButtonOptions.active = false;
  }

  editPOMISRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
      this.eventService.openSnackBar('Updated successfully!', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'Dismiss');
    }
    this.barButtonOptions.active = false;
  }

  showMore() {
    this.show = true;
  }

  showLess() {
    this.show = false;

  }
}
