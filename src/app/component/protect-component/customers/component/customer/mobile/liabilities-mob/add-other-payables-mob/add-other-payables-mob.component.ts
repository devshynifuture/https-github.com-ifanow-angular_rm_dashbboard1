import { Component, OnInit, QueryList, ViewChildren, Input } from '@angular/core';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { MatInput } from '@angular/material';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from '../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-other-payables-mob',
  templateUrl: './add-other-payables-mob.component.html',
  styleUrls: ['./add-other-payables-mob.component.scss']
})
export class AddOtherPayablesMobComponent implements OnInit {
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
  transactionData: any;

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
    this.getOtherPayable(null);

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
getFormData(data) {
  console.log(data)
  this.transactionData = data.controls
  return;
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
    name: [data ? data.name : '', [Validators.required]], share: [data ? data.share : '',[Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0],relationshipId: [data ? data.relationshipId : 0]
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
  if(item){
    if(this.getCoOwner.controls[item].value.id){
      let id = this.getCoOwner.controls[item].value.id;
      this.custumService.deleteBorrower(id).subscribe(
        data => {
          console.log('delete',data)
        }
      )
    }
  }
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
      let dateOfReceipt = this.datePipe.transform(this.otherLiabilityForm.controls.dateOfReceipt.value, 'yyyy/MM/dd')
      let dateOfRepayment = this.datePipe.transform(this.otherLiabilityForm.controls.dateOfRepayment.value, 'yyyy/MM/dd')
      if(dateOfRepayment <= dateOfReceipt){
        this.otherLiabilityForm.get('dateOfRepayment').setErrors({ max: 'Date of repayment' });
        this.otherLiabilityForm.get('dateOfRepayment').markAsTouched();
      }else{
        this.otherLiabilityForm.get('dateOfRepayment').setErrors();
      }
    }else{
      if(formValue){
        let dateOfRepayment = this.datePipe.transform(this.otherLiabilityForm.controls.dateOfRepayment.value, 'yyyy/MM/dd')
        let dateOfReceipt = this.datePipe.transform(this.otherLiabilityForm.controls.dateOfReceipt.value, 'yyyy/MM/dd')
        if(dateOfReceipt >= dateOfRepayment){
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
        isClient:0,
        relationshipId: 0
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

  if (data.borrowers) {
    if(data.borrowers.length > 0){
    this.getCoOwner.removeAt(0);
    data.borrowers.forEach(element => {
      this.addNewCoOwner(element);
    });
  }
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

this.ownerData = {Fmember: this.nomineesListFM, controleData:this.otherLiabilityForm}
    this.getFormControl().creditorName.maxLength = 20;
    this.getFormControl().amtBorrowed.maxLength = 10;
    this.getFormControl().interest.maxLength = 20;
    this.getFormControl().balance.maxLength = 10;
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

    let transactionFlag, finalTransctList = []
    if (this.transactionData && this.transactionData.length > 0) {
      this.transactionData.forEach(element => {
        if(element.controls.date.value || element.controls.amount.value){
          let obj = {
            "partPaymentDate": (element.controls.date.value) ? this.datePipe.transform(element.controls.date.value , 'yyyy-MM-dd') : element.controls.date.value,
            "partPayment": element.controls.amount.value,
            "option": 0,
            "id":(element.value.id) ? element.value.id : null,
            'edit':(element.value.id) ? true : false
          }
          finalTransctList.push(obj)
        }
      });
    }
    if (this.otherLiabilityForm.invalid) {
      this.otherLiabilityForm.markAllAsTouched();
      this.inputs.find(input => !input.ngControl.valid).focus();
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        // ownerName: (this.ownerName == null) ? this.otherLiabilityForm.controls.ownerName.value : this.ownerName,
        ownerName:this.otherLiabilityForm.value.getCoOwnerName[0].name,
        borrowers:this.otherLiabilityForm.value.getCoOwnerName,
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
      obj.dateOfReceipt = this.datePipe.transform(obj.dateOfReceipt, 'yyyy-MM-dd');
      obj.dateOfRepayment = this.datePipe.transform(obj.dateOfRepayment, 'yyyy-MM-dd');
      obj.interest = parseInt(obj.interest);

      // if (this._data == 'Add') {
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
          borrowers:obj.borrowers
        };
        console.log('obj', obj);
        this.custumService.addOtherPayables(objToSend).subscribe(
          data => this.addOtherPayablesRes(data)
        );
      // }
      //  else {
      //   const editObj = {
      //     familyMemberId: 160023,
      //     ownerName: obj.ownerName,
      //     creditorName: obj.creditorName,
      //     collateral: obj.collateral,
      //     amountBorrowed: obj.amtBorrowed,
      //     interest: obj.interest,
      //     outstandingBalance: obj.balance,
      //     dateOfReceived: obj.dateOfReceipt,
      //     dateOfRepayment: obj.dateOfRepayment,
      //     id: this._data.id,
      //     description: obj.description,
      //     borrowers:obj.borrowers
      //   };
      //   this.custumService.editOtherPayables(editObj).subscribe(
      //     data => this.editOtherPayablesRes(data)
      //   );
      // }


    }
  }

  addOtherPayablesRes(data) {
    this.barButtonOptions.active = false;
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
    this.barButtonOptions.active = false;
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
