import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatInput } from '@angular/material';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-other-payables',
  templateUrl: './add-other-payables.component.html',
  styleUrls: ['./add-other-payables.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class AddOtherPayablesComponent implements OnInit {
  otherLiabilityForm: any;
  ownerData: any;
  _inputData: any;
  ownerName: any;
  selectedFamilyData: any;
  show: boolean;
  isdateValid: boolean;
  isCreditorName: boolean;
  isAmtBorrowed: boolean;
  isinterestRate: boolean;
  isDateOfRepayment: boolean;
  isBalance: boolean;
  advisorId: any;
  clientId: number;
  nomineesList: any[] = [];
  _data: any;
  interestRate: number;
  showError: boolean;
    nomineesListFM: any = [];
    maxDate = new Date();

    @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  familyMemberId: any;
  callMethod: any;

  constructor(private datePipe: DatePipe,private fb: FormBuilder, public subInjectService: SubscriptionInject, public custumService: CustomerService, public eventService: EventService) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    this.getOtherPayable(inputData);

  }

  get data() {
    return this._data;
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();

    this.show = false;
  }
  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
   // ===================owner-nominee directive=====================//
 display(value) {
  console.log('value selected', value)
  this.ownerName = value.userName;
  this.familyMemberId = value.familyMemberId
  this.selectedFamilyData = value;
}

lisNominee(value) {
  this.ownerData.Fmember = value;
  this.nomineesListFM = Object.assign([], value);
}
selectOwner:any;
disabledMember(value, type) {
  this.callMethod = {
    methodName : "disabledMember",
    ParamValue : value,
    disControl : type
  }
  setTimeout(() => {
    this.selectOwner = this.nomineesListFM.filter((m)=> m.id == this.otherLiabilityForm.value.getCoOwnerName[0].familyMemberId)
   }, 1000);
  if(value == "owner"){
    this.otherLiabilityForm.get('commDate').reset();
  }
}

displayControler(con) {
  console.log('value selected', con);
  if(con.owner != null && con.owner){
    this.otherLiabilityForm.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.otherLiabilityForm.controls.getNomineeName = con.nominee;
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
  return this.otherLiabilityForm.get('getCoOwnerName') as FormArray;
}

addNewCoOwner(data) {
  this.getCoOwner.push(this.fb.group({
    name: [data ? data.ownerName : '', [Validators.required]], share: [data ? data.share : ''], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0],isClient: [data ? data.isClient : 0]
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
  if (this.otherLiabilityForm.value.getCoOwnerName.length == 1) {
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
  return this.otherLiabilityForm.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
  this.disabledMember(null, null);
  this.getNominee.removeAt(item);
  if (this.otherLiabilityForm.value.getNomineeName.length == 1) {
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
  dateChange(value,form,formValue){
    if(form=='dateOfRepayment' && formValue){
      let dateOfReceipt = this.datePipe.transform(this.otherLiabilityForm.controls.dateOfReceipt.value, 'dd/MM/yyyy')
      if(value <= dateOfReceipt){
        this.otherLiabilityForm.get('dateOfRepayment').setErrors({ max: 'Date of repayment' });
        this.otherLiabilityForm.get('dateOfRepayment').markAsTouched();
      }else{
        this.otherLiabilityForm.get('dateOfRepayment').setErrors();
      }
    }else{
      if(formValue){
        let dateOfRepayment = this.datePipe.transform(this.otherLiabilityForm.controls.dateOfRepayment.value, 'dd/MM/yyyy')
        if(value >= dateOfRepayment){
          this.otherLiabilityForm.get('dateOfRepayment').setErrors({ max: 'Date of repayment' });
          this.otherLiabilityForm.get('dateOfRepayment').markAsTouched();
        }else{
          this.otherLiabilityForm.get('dateOfRepayment').setErrors();

        }
      }
    }
  
  }
  showMore() {
    this.show = true;
  }

  showLess() {
    this.show = false;
  }

  close(flag) {
    // let data=this._inputData.loanTypeId;
    this.subInjectService.changeNewRightSliderState({ state: 'close',refreshRequired:flag});
  }

  getOtherPayable(data) {
    if (data == undefined) {
      data = {};
    }
    this.otherLiabilityForm = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: [0,[Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      ownerName: [data.ownerName],
      dateOfReceipt: [new Date(data.dateOfReceived), [Validators.required]],
      creditorName: [data.creditorName, [Validators.required]],
      amtBorrowed: [data.amountBorrowed, [Validators.required]],
      interest: [data.interest, [Validators.required, Validators.min(1), Validators.max(100)]],
      description: [data.description],
      dateOfRepayment: [new Date(data.dateOfRepayment), [Validators.required]],
      balance: [data.outstandingBalance, [Validators.required]],
      collateral: [data.collateral],
    });
    // ==============owner-nominee Data ========================\\
  /***owner***/ 
  if(this.otherLiabilityForm.value.getCoOwnerName.length == 1){
    this.getCoOwner.controls['0'].get('share').setValue('100');
  }

  if (data) {
    this.getCoOwner.removeAt(0);
      this.addNewCoOwner(data);
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

this.ownerData = {Fmember: this.nomineesListFM, controleData:this.otherLiabilityForm}
    this.getFormControl().creditorName.maxLength = 20;
    this.getFormControl().amtBorrowed.maxLength = 20;
    this.getFormControl().interest.maxLength = 20;
    this.getFormControl().balance.maxLength = 20;
    this.getFormControl().collateral.maxLength = 20;
    this.getFormControl().description.maxLength = 20
    // this.ownerData = this.otherLiabilityForm.controls;

  }

  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.otherLiabilityForm.get('interest').setValue(event.target.value);
    }
  }
  onChangeGrowthRate(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.otherLiabilityForm.get('growthEmployer').setValue(event.target.value);
    }
  }
  getFormControl() {
    return this.otherLiabilityForm.controls;
  }

  // display(value) {
  //   console.log('value selected', value);
  //   this.ownerName = value.userName;
  //   this.selectedFamilyData = value;
  // }
  // lisNominee(value) {
  //   console.log(value)
  //   this.nomineesListFM = Object.assign([], value.familyMembersList);
  // }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  saveFormData() {
    // if (this.otherLiabilityForm.get('ownerName').invalid) {
    //   this.otherLiabilityForm.get('ownerName').markAsTouched();
    //   return;
    //  } else if (this.otherLiabilityForm.get('dateOfReceipt').invalid) {
    //   this.otherLiabilityForm.get('dateOfReceipt').markAsTouched();
    //   return;
    // } else if (this.otherLiabilityForm.get('ownerName').invalid) {
    //   this.otherLiabilityForm.get('ownerName').markAsTouched();
    //   return
    // } else if (this.otherLiabilityForm.get('creditorName').invalid) {
    //   this.otherLiabilityForm.get('creditorName').markAsTouched();
    //   return;
    // } else if (this.otherLiabilityForm.get('amtBorrowed').invalid) {
    //   this.otherLiabilityForm.get('amtBorrowed').markAsTouched();
    //   return;
    // } else if (this.otherLiabilityForm.get('interest').invalid) {
    //   this.otherLiabilityForm.get('interest').markAsTouched();
    //   return;
    // } else if (this.otherLiabilityForm.get('dateOfRepayment').invalid) {
    //   this.otherLiabilityForm.get('dateOfRepayment').markAsTouched();
    //   return;
    // } else if (this.otherLiabilityForm.get('balance').invalid) {
    //   this.otherLiabilityForm.get('balance').markAsTouched();
    //   return;
    if (this.otherLiabilityForm.invalid) {
      this.otherLiabilityForm.markAllAsTouched();
      this.inputs.find(input => !input.ngControl.valid).focus();
    } else {
      const obj = {
        // ownerName: (this.ownerName == null) ? this.otherLiabilityForm.controls.ownerName.value : this.ownerName,
        ownerName:this.otherLiabilityForm.value.getCoOwnerName[0].name,

        dateOfReceipt: this.otherLiabilityForm.controls.dateOfReceipt.value,
        creditorName: this.otherLiabilityForm.controls.creditorName.value,
        amtBorrowed: this.otherLiabilityForm.controls.amtBorrowed.value,
        interest: this.otherLiabilityForm.controls.interest.value,
        dateOfRepayment: this.otherLiabilityForm.controls.dateOfRepayment.value,
        balance: this.otherLiabilityForm.controls.balance.value,
        collateral: this.otherLiabilityForm.controls.collateral.value,
        description: this.otherLiabilityForm.controls.description.value,
      };
      obj.balance = parseInt(obj.balance);
      obj.amtBorrowed = parseInt(obj.amtBorrowed);
      obj.dateOfReceipt = obj.dateOfReceipt.toISOString().slice(0, 10);
      obj.dateOfRepayment = obj.dateOfRepayment.toISOString().slice(0, 10);
      obj.interest = parseInt(obj.interest);

      if (this._data == 'Add') {
        const objToSend = {
          advisorId: this.advisorId,
          clientId: this.clientId,
          // familyMemberId: this.selectedFamilyData.familyMemberId,
          familyMemberId: this.otherLiabilityForm.value.getCoOwnerName[0].familyMemberId,
          ownerName: obj.ownerName,
          creditorName: obj.creditorName,
          collateral: obj.collateral,
          amountBorrowed: obj.amtBorrowed,
          interest: obj.interest,
          outstandingBalance: obj.balance,
          dateOfReceived: obj.dateOfReceipt,
          dateOfRepayment: obj.dateOfRepayment,
          description: obj.description,
        };
        console.log('obj', obj);
        this.custumService.addOtherPayables(objToSend).subscribe(
          data => this.addOtherPayablesRes(data)
        );
      } else {
        const editObj = {
          familyMemberId: 160023,
          ownerName: obj.ownerName,
          creditorName: obj.creditorName,
          collateral: obj.collateral,
          amountBorrowed: obj.amtBorrowed,
          interest: obj.interest,
          outstandingBalance: obj.balance,
          dateOfReceived: obj.dateOfReceipt,
          dateOfRepayment: obj.dateOfRepayment,
          id: this._data.id,
          description: obj.description,
        };
        this.custumService.editOtherPayables(editObj).subscribe(
          data => this.editOtherPayablesRes(data)
        );
      }


    }
  }

  addOtherPayablesRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.close(true);
      // this.subInjectService.changeNewRightSliderState({ state: 'close' });
      this.eventService.openSnackBar('Other payables added successfully', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'Dismiss');

    }
  }

  editOtherPayablesRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.close(true);
      // this.subInjectService.changeNewRightSliderState({ state: 'close' });
      this.eventService.openSnackBar('other payables edited successfully', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'Dismiss');
    }
  }
}
