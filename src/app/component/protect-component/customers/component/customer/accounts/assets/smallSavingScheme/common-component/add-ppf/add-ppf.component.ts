import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { MAT_DATE_FORMATS, MatInput, MatDialog } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import * as moment from 'moment';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
@Component({
  selector: 'app-add-ppf',
  templateUrl: './add-ppf.component.html',
  styleUrls: ['./add-ppf.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddPpfComponent implements OnInit {
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
  isOptionalField: boolean;
  advisorId: any;
  ownerName: any;
  familyMemberId: any;
  inputData: any;
  ownerData: any;
  ppfSchemeForm;
  transactionForm
  transactionList = [];
  addTransactionList: number;
  transactionData: any= [];
  editApi: any;
  clientId: number;
  nexNomineePer = 0;
  showError = false;
  nomineesListFM: any =[];
  dataFM: any;
  familyList: any;
  errorFieldName: string;
  nomineesList: any[] = [];
  ppfData: any;
  nominees: any[];
  commencementDate: any;
  flag: any;
  callMethod:any;
  bankList:any = [];

  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  transactionViewData =
    {
      optionList: [
        { name: 'Deposit', value: 1 },
        { name: 'Withdrawal', value: 2 }
      ],
      transactionHeader: ['Transaction Type', 'Date', 'Amount']
    }
  adviceShowHeaderAndFooter: boolean = true;
  dataSource: { "advisorId": any; "clientId": number; "ownerName": any; "familyMemberId": any; "accountBalance": any; "balanceAsOn": any; "commencementDate": any; "description": any; "bankName": any; "linkedBankAccount": any; "nominees": any[]; "frequency": any; "futureApproxcontribution": any; "publicprovidendfundtransactionlist": any[]; };
  constructor(public utils: UtilService, private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService, public dialog: MatDialog, private enumService: EnumServiceService) { }

  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Public provident fund (PPF)';

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
    this.calculateDate();
    this.bankList = this.enumService.getBank();

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
    this.ppfSchemeForm.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.ppfSchemeForm.controls.getNomineeName = con.nominee;
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
  return this.ppfSchemeForm.get('getCoOwnerName') as FormArray;
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
  if (this.ppfSchemeForm.value.getCoOwnerName.length == 1) {
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
  return this.ppfSchemeForm.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
  this.disabledMember(null, null);
  this.getNominee.removeAt(item);
  if (this.ppfSchemeForm.value.getNomineeName.length == 1) {
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
  

  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }

  get getExtendMaturity() {
    return this.ppfSchemeForm.get('extendedGroup') as FormArray;
  }

  addExtendedMaturity(){
    this.getExtendMaturity.push(this.fb.group({
      extenMaturity: ['']
    }));
  }
  
  askExtended:boolean= false;
  invalidExtended:boolean= false;
  setCommencementDate(extended) {
    let maturityDate:any = this.ppfSchemeForm.get('maturityDate').value;
    let arrOfExtend:any = this.ppfSchemeForm.get('extendedGroup').value
    let startDate:any
    let y:any;
    if(new Date(this.ppfSchemeForm.value.commencementDate).getMonth()> 3){
      y =  new Date(this.ppfSchemeForm.value.commencementDate).getFullYear() + 1;
      startDate = new Date(y , 3, 1);
    }
    else{
      y =  new Date(this.ppfSchemeForm.value.commencementDate).getFullYear();
      startDate = new Date(y , 3, 1);
    }
    // startDate =  new Date(this.ppfSchemeForm.value.commencementDate);
    maturityDate =startDate.setFullYear(startDate.getFullYear() + 15);
    if(extended == "yes"){
      arrOfExtend.forEach((element, index) => {
        maturityDate = new Date(maturityDate).setFullYear(new Date(maturityDate).getFullYear() + 5);
      });
    }else{
      while (this.getExtendMaturity.length !== 0) {
        this.getExtendMaturity.removeAt(0)
      }
      this.addExtendedMaturity();
      this.askExtended =false;
    }
   
    console.log('commencentDAte',new Date(maturityDate))
    if(new Date(this.maxDate).getTime() > maturityDate){
      this.askExtended =true;
      if(extended == "yes"){
        this.addExtendedMaturity();
      }
    }
    
    this.ppfSchemeForm.get('maturityDate').patchValue(new Date(maturityDate));
  }

  getMaturityDate($event){
    if($event.value == "1"){
      this.setCommencementDate('yes')
      this.invalidExtended = false;
    }
    else{
      this.invalidExtended = true;
    }
  }

  getdataForm(data) {
    this.flag = data;
    (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : ''

    this.editApi = data.id ? data : undefined;

    this.ppfData = data;
    this.ppfSchemeForm = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: [0,[Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      maturityDate:[data.maturityDate, [Validators.required]],
      // extenMaturity:['', [Validators.required]],
      // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      accountBalance: [data.accountBalance, [ Validators.min(500)]],//Validators.max(150000)
      balanceAsOn: [new Date(data.balanceAsOn)],
      commencementDate: [new Date(data.commencementDate), [Validators.required]],
      futureContribution: [data.futureApproxcontribution, [Validators.required]],
      extenMaturity: [''],
      frquency: [(data.frequency == undefined) ? "1" : String(data.frequency), [Validators.required]],
      description: [data.description],
      bankName: [data.userBankMappingId],
      linkedBankAccount: [data.linkedBankAccount],
      extendedGroup: this.fb.array([this.fb.group({
        extenMaturity: [''],
      })]),
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id:[0]
      })]),
      id: [data.id]
    })
   
      // ==============owner-nominee Data ========================\\
  /***owner***/ 
  if(this.ppfSchemeForm.value.getCoOwnerName.length == 1){
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

this.ownerData = {Fmember: this.nomineesListFM, controleData:this.ppfSchemeForm}
// ==============owner-nominee Data ========================\\
    this.commencementDate = data.commencementDate;
    // this.ownerData = this.ppfSchemeForm.controls;
    this.familyMemberId = data.familyMemberId;
  }
  get nominee() {
    return this.ppfSchemeForm.get('npsNomineesList') as FormArray;
  }
  check() {
    console.log(this.ppfSchemeForm)
  }
removedList:any=[];
  getFormData(data) {
    console.log(data)
    if(data.removed){
      this.transactionData = data.data.controls;
      this.removedList=data.removed;
    }else{
      this.commencementDate = this.ppfSchemeForm.controls.commencementDate.value;
      this.transactionData = data.controls
    }
  }

  calculateDate(){
    let startDate =  new Date(this.ppfSchemeForm.value.commencementDate);
    let maturityDate =startDate.setFullYear(startDate.getFullYear() + 15);
  }
  addPPF() {
    let transactionFlag, finalTransctList = []
    this.removedList.forEach(Fg => {
      if (Fg.value) {
        let obj = {
          "id":Fg.value.id,
          "transactionDate":Fg.value.date,
          "amount": Fg.value.amount,
          "transactionType":Fg.value.type,
          "isActive":Fg.value.isActive
        }
        finalTransctList.push(obj);
      }
    });
    if(new Date(this.maxDate).getTime() < new Date(this.ppfSchemeForm.get('commencementDate')).getTime()){
      this.invalidExtended = true;
    }
    // this.ppfSchemeForm.get('extendedGroup').value.forEach((element, index) => {
    //   if(element.extenMaturity == ""){
    //     this.invalidExtended = true;
    //   }
      // maturityDate = new Date(maturityDate).setFullYear(new Date(maturityDate).getFullYear() + 5);
    // });
  //   if (this.removedList.value) {
  //   // this.removedList.forEach(element => {
  //     // if (element.valid) {
  //       let obj = {
  //         "transactionDate":this.removedList.value.date,
  //         "amount": this.removedList.value.amount,
  //         "ppfTransactionType":this.removedList.value.type,
  //         "isActive":this.removedList.value.isActive
  //       }
  //       finalTransctList.push(obj);
  //     // }
     
  //   // });
  // }
    if (this.transactionData.length > 0) {
      this.ppfSchemeForm.get('accountBalance').setValidators("");
      this.ppfSchemeForm.get('accountBalance').updateValueAndValidity()
      this.ppfSchemeForm.get('balanceAsOn').setValidators(""),
      this.ppfSchemeForm.get('balanceAsOn').updateValueAndValidity()
      this.transactionData.forEach(element => {
        if (element.valid) {
          let obj = {
            "id":element.value.id,
            "transactionDate":element.controls.date.value._d?element.controls.date.value._d:element.controls.date.value,
            "amount": element.controls.amount.value,
            "transactionType": element.controls.type.value,
            "isActive":element.value.isActive == 0?element.value.isActive:1
          }
          finalTransctList.push(obj);
        }
        else {
          transactionFlag = false;
        }
      });
    }
    else{
      this.ppfSchemeForm.get('accountBalance').setValidators([Validators.required, Validators.min(500)]);
      this.ppfSchemeForm.get('accountBalance').updateValueAndValidity();
      this.ppfSchemeForm.get('balanceAsOn').setValidators([Validators.required]);
      // this.ppfSchemeForm.get('balanceAsOn').updateValueAndValidity();
    }
    // this.nominees = []
    if (this.nomineesList) {
      this.nomineesList.forEach(element => {
        let obj = {
          "name": element.controls.name.value,
          "sharePercentage": element.controls.sharePercentage.value,
          "id": (element.controls.id.value) ? element.controls.id.value : 0,
          "familyMemberId": (element.controls.familyMemberId.value) ? element.controls.familyMemberId.value : 0
        }
        this.nominees.push(obj)
      });
    }
    if (this.ppfSchemeForm.invalid || this.invalidExtended) {
      for (let element in this.ppfSchemeForm.controls) {
        console.log(element)
        if (this.ppfSchemeForm.get(element).invalid) {
          this.inputs.find(input => !input.ngControl.valid).focus();
          this.ppfSchemeForm.controls[element].markAsTouched();
        }
      }
    }
    else if (transactionFlag == false) {
      return;
    }
    else {
      let obj = {
        "advisorId": this.advisorId,
        "clientId": this.clientId,
        'ownerList': this.ppfSchemeForm.value.getCoOwnerName,
        'maturityDate': this.ppfSchemeForm.value.maturityDate,
        // "ownerName": (this.ownerName == undefined) ? this.ppfSchemeForm.get('ownerName').value : this.ownerName.userName,
        "familyMemberId": this.familyMemberId,
        "accountBalance":parseInt(this.ppfSchemeForm.get('accountBalance').value),
        "balanceAsOn": this.ppfSchemeForm.get('balanceAsOn').value,
        "commencementDate": this.ppfSchemeForm.get('commencementDate').value,
        "description": this.ppfSchemeForm.get('description').value,
        "bankName": this.ppfSchemeForm.get('bankName').value,
        "userBankMappingId": this.ppfSchemeForm.get('bankName').value,
        "linkedBankAccount": this.ppfSchemeForm.get('linkedBankAccount').value,
        "frequency": this.ppfSchemeForm.get('frquency').value,
        "futureApproxcontribution": parseInt(this.ppfSchemeForm.get('futureContribution').value),
        'nomineeList': this.ppfSchemeForm.value.getNomineeName,
        "transactionList": finalTransctList,
        "id":this.ppfSchemeForm.value.id,
        "agentName":"abc",
        "parentId":0,
        "realOrFictitious":1
      }
      this.barButtonOptions.active = true;
      obj.nomineeList.forEach((element, index) => {
        if(element.name == ''){
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList= this.ppfSchemeForm.value.getNomineeName;
      // this.dataSource = obj;
      let adviceObj = {
        // advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.flag == 'advicePPF') {
        this.cusService.getAdvicePpf(adviceObj).subscribe(
          data => this.getAdvicePpfRes(data),
          err => {
            this.barButtonOptions.active = false;
            this.eventService.openSnackBar(err, "Dismiss")
          }
        );
      } else if (this.editApi != undefined && this.editApi != 'advicePPF') {
        obj['id'] = this.editApi.id
        this.cusService.editPPF(obj).subscribe(
          data => this.addPPFResponse(data),
          error =>{
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error)
          }
        )
      }
      else {
        this.cusService.addPPFScheme(obj).subscribe(
          data => this.addPPFResponse(data),
          error =>{
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        )
      }
    }
  }
  getAdvicePpfRes(data) {
    this.barButtonOptions.active = false;
    console.log(data)
    this.eventService.openSnackBar("PPF is added", "Dismiss")
    this.close(true);

  }

  isFormValuesForAdviceValid() {
    
    if (this.ppfSchemeForm.valid ||
      (this.ppfSchemeForm.valid && this.ppfSchemeForm.valid) ||
      (this.ppfSchemeForm.valid && this.ppfSchemeForm.valid && this.nomineesList.length !== 0 && this.transactionData.length !== 0)) {
      return true;
    } else {
      return false;
    }
  }

  addPPFResponse(data) {
    this.barButtonOptions.active = false;
    (this.editApi) ? this.eventService.openSnackBar("Updated successfully!", "Dismiss") : this.eventService.openSnackBar("Added successfully!", "Dismiss")
    console.log(data)
    this.close(true);
  }
  close(flag) {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  //link bank
  openDialog(eventData): void {
    const dialogRef = this.dialog.open(LinkBankComponent, {
      width: '50%',
      data: this.bankList
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.bankList = this.enumService.getBank();
      }, 5000);
    })

  }
//link bank

}
