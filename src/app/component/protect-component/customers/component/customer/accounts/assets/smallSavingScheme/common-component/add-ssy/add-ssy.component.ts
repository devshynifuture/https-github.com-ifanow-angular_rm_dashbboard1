import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-ssy',
  templateUrl: './add-ssy.component.html',
  styleUrls: ['./add-ssy.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddSsyComponent implements OnInit {
  validatorType = ValidatorType;
  maxDate = new Date();
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  ssySchemeForm: any;
  ownerData: any;
  isOptionalField: boolean;
  advisorId: any;
  editApi: any;
  transactionData: any[] = [];
  clientId: any;
  nomineesListFM: any = [];
  ssyData: any;
  nomineesList: any[] = [];
  nominees: any[];
  commencementDate: any;
  flag: any;
  callMethod:any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  transactionViewData =
    {
      optionList: [
        { name: 'Deposit', value: 1 },
        { name: 'Withdrawal', value: 2 }
      ],
      transactionHeader: ['Transaction Type', 'Date', 'Amount']
    }
  @Input() popupHeaderText: string = 'Add Sukanya samriddhi yojana (SSY)';
  adviceShowHeaderAndFooter: boolean = true;
  DOB: any;

  constructor(private dateFormatPipe: DatePipe, public utils: UtilService, private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService, private datePipe: DatePipe) { }

  @Input()
  set data(data) {
    this.clientId = AuthService.getClientId();
    this.isOptionalField = true
    this.advisorId = AuthService.getAdvisorId();
    this.getdataForm(data);
    this.inputData = data;
  }
 
  get data() {
    return this.inputData;
  }
  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  setCommencementDate(date) {
    this.commencementDate = date
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
    this.ssySchemeForm.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.ssySchemeForm.controls.getNomineeName = con.nominee;
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
  return this.ssySchemeForm.get('getCoOwnerName') as FormArray;
}

addNewCoOwner(data) {
  this.getCoOwner.push(this.fb.group({
    name: [data ? data.name : '', [Validators.required]], share: [data ? String(data.share) : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0]
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
  if (this.ssySchemeForm.value.getCoOwnerName.length == 1) {
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
  return this.ssySchemeForm.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
  this.getNominee.removeAt(item);
  if (this.ssySchemeForm.value.getNomineeName.length == 1) {
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
    name: [data ? data.name : ''], sharePercentage: [data ? String(data.sharePercentage) : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0]
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
  getdataForm(data) {
    if (data == undefined) {
      data = {};
      this.flag = "addSSY";
    }
    else {
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editApi = data;
      this.flag = "editSSY";
    }
    this.ssyData = data;
    this.ssySchemeForm = this.fb.group({
      // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: ['',[Validators.required]],
        familyMemberId: 0,
        id:0
      })]),
      guardian: [data.guardianName, [Validators.required]],
      accBalance: [data.accountBalance, [Validators.required, Validators.min(250), Validators.max(150000)]],
      balanceAsOn: [new Date(data.balanceAsOn), [Validators.required]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      futureAppx: [data.futureApproxContribution, [Validators.required]],
      frquency: [data.frequency ? String(data.frequency) : '1', [Validators.required]],
      description: [data.description],
      linkedAcc: [data.linkedBankAccount],
      bankName: [data.bankName],
      nominees: this.nominees,
      agentName: [data.agentName],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id:[0]
      })])
    })
    // ==============owner-nominee Data ========================\\
  /***owner***/ 
  if(this.ssySchemeForm.value.getCoOwnerName.length == 1){
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

this.ownerData = {Fmember: this.nomineesListFM, controleData:this.ssySchemeForm}
// ==============owner-nominee Data ========================\\ 
    this.DOB = data.dateOfBirth
    // this.ownerData = this.ssySchemeForm.controls;
    // this.familyMemberId = data.familyMemberId;
  }
  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
  getFormData(data) {
    console.log(data)
    this.commencementDate = this.ssySchemeForm.controls.commDate.value;
    this.transactionData = data.controls
  }

  addSSYScheme() {
    let transactionFlag, finalTransctList = []
    if (this.transactionData && this.transactionData.length > 0) {
      this.transactionData.forEach(element => {
        if (element.valid) {
          let obj = {
            "date": element.controls.date.value._d,
            "amount": element.controls.amount.value,
            "type": element.controls.type.value
          }
          finalTransctList.push(obj)
        }
        else {
          transactionFlag = false;
        }
      });
    }
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
    if (this.ssySchemeForm.invalid) {
      this.ssySchemeForm.markAllAsTouched();
    }
    else if (transactionFlag == false) {
      return;
    }
    else {
      
        let obj = {
          "id": this.editApi? this.editApi.id : 0,
          "familyMemberId": this.familyMemberId,
          // "ownerName": (this.ownerName == null) ? this.ssySchemeForm.controls.ownerName.value : this.ownerName.userName,
          "ownerList": this.ssySchemeForm.value.getCoOwnerName,
          "accountBalance": this.ssySchemeForm.get('accBalance').value,
          "balanceAsOn": this.ssySchemeForm.get('balanceAsOn').value,
          "commencementDate": this.ssySchemeForm.get('commDate').value,
          "description": this.ssySchemeForm.get('description').value,
          "bankName": this.ssySchemeForm.get('bankName').value,
          "linkedBankAccount": this.ssySchemeForm.get('linkedAcc').value,
          "agentName": this.ssySchemeForm.get('agentName').value,
          "guardianName": this.ssySchemeForm.get('guardian').value,
          "nominees": this.nominees,
          "ssyFutureContributionList": [{
            "futureApproxContribution": this.ssySchemeForm.get('futureAppx').value,
            "frequency": this.ssySchemeForm.get('futureAppx').value,
          }],
          "ssyTransactionList": finalTransctList,
          'nomineeList': this.ssySchemeForm.value.getNomineeName,
          'familyMemberDob': this.dateFormatPipe.transform(this.DOB, 'dd/MM/yyyy')
        }

        let adviceObj = {
          advice_id: this.advisorId,
          adviceStatusId: 5,
          stringObject: obj,
          adviceDescription: "manualAssetDescription"
        }

        obj.nomineeList.forEach((element, index) => {
          if(element.name == ''){
            this.removeNewNominee(index);
          }
        });
        obj.nomineeList= this.ssySchemeForm.value.getNomineeName;
      if(this.flag == 'editSSY') { 
        this.cusService.editSSYData(obj).subscribe(
          data => this.addSSYSchemeResponse(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
      else if (this.flag == 'addSSY') {
         this.cusService.addSSYScheme(obj).subscribe(
           data => this.addSSYSchemeResponse(data),
           error => this.eventService.showErrorMessage(error)
         )
       } else {
         this.cusService.getAdviceSsy(adviceObj).subscribe(
           data => this.getAdviceSsyRes(data),
           err => this.eventService.openSnackBar(err, "Dismiss")
         );
       }
        // let obj =
        // {
        //   "clientId": this.clientId,
        //   "advisorId": this.advisorId,
        //   "familyMemberId": this.familyMemberId,
        //   "ownerName": (this.ownerName == null) ? this.ssySchemeForm.controls.ownerName.value : this.ownerName.userName,
        //   "accountBalance": this.ssySchemeForm.get('accBalance').value,
        //   "balanceAsOn": this.ssySchemeForm.get('balanceAsOn').value,
        //   "commencementDate": this.ssySchemeForm.get('commDate').value,
        //   "description": this.ssySchemeForm.get('description').value,
        //   "bankName": this.ssySchemeForm.get('bankName').value,
        //   "linkedBankAccount": this.ssySchemeForm.get('linkedAcc').value,
        //   "agentName": this.ssySchemeForm.get('agentName').value,
        //   "guardianName": this.ssySchemeForm.get('guardian').value,
        //   "nominees": this.nominees,
        //   "ssyFutureContributionList": [{
        //     "futureApproxContribution": this.ssySchemeForm.get('futureAppx').value,
        //     "frequency": this.ssySchemeForm.get('futureAppx').value,
        //   }],
        //   "ssyTransactionList": finalTransctList,
        //   'familyMemberDob': this.dateFormatPipe.transform(this.ownerName.dateOfBirth, 'dd/MM/yyyy')
        // }
        

      
    }
  }
  getAdviceSsyRes(data) {
    console.log(data);
    this.eventService.openSnackBar("SSY is added", "Dismiss");
    this.close(true)

  }
  addSSYSchemeResponse(data) {
    (this.editApi) ? this.eventService.openSnackBar("Updated successfully!", "Dismiss") : this.eventService.openSnackBar("Added successfully!", "added")
    console.log(data)
    this.close(true)
  }

  close(flag) {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }


  isFormValuesForAdviceValid() {
    if (this.ssySchemeForm.valid ||
      (this.ssySchemeForm.valid && this.ssySchemeForm.valid) ||
      (this.ssySchemeForm.valid && this.ssySchemeForm.valid && this.nomineesList.length !== 0 && this.transactionData.length !== 0)) {
      return true;
    } else {
      return false;
    }
  }
}
