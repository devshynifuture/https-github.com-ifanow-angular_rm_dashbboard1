import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS, MatDialog } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { AssetValidationService } from './../../../asset-validation.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
@Component({
  selector: 'app-add-scss',
  templateUrl: './add-scss.component.html',
  styleUrls: ['./add-scss.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddScssComponent implements OnInit {
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
  inputData: any;
  familyMemberId: any;
  ownerName: any;
  scssSchemeForm: any;
  callMethod: any;
  advisorId: any;
  clientId: number;
  ownerData: any;
  isOptionalField: any;
  editApi: any;
    nomineesListFM: any = [];
  scssData: any;
  nomineesList: any[] = [];
  nominees: any[];
  flag: any;
  bankList:any = [];

  @Input() popupHeaderText: string = 'Add Senior citizen savings scheme (SCSS)';
  adviceShowHeaderAndFooter: boolean = true;

  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder,
    private cusService: CustomerService, private eventService: EventService, public utils: UtilService, public dialog: MatDialog, private enumService: EnumServiceService) {
  }

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.bankList = this.enumService.getBank();

    this.getdataForm(this.data);
    this.isOptionalField = true;
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
    this.scssSchemeForm.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.scssSchemeForm.controls.getNomineeName = con.nominee;
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
  return this.scssSchemeForm.get('getCoOwnerName') as FormArray;
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
  if (this.scssSchemeForm.value.getCoOwnerName.length == 1) {
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
  return this.scssSchemeForm.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
  this.disabledMember(null, null);
  this.getNominee.removeAt(item);
  if (this.scssSchemeForm.value.getNomineeName.length == 1) {
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
      this.flag = "addSCSS";
    } else {
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editApi = data;
      this.flag = "editSCSS";
    }
    this.scssData = data;
    this.scssSchemeForm = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: [0,[Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required, AssetValidationService.ageValidators(60)]],
      amtInvested: [data.amountInvested?data.amountInvested:'', [Validators.required, Validators.min(1000), Validators.max(1500000)]],
      commDate: [data.commencementDate?new Date(data.commencementDate):'', [Validators.required]],
      poBranch: [data.postOfficeBranch?data.postOfficeBranch:''],
      nominees: this.nominees,
      bankAccNumber: [data.userBankMappingId?data.userBankMappingId:''],
      description: [data.description?data.description:''],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id:[0]
      })])
    });
    
    // ==============owner-nominee Data ========================\\
  /***owner***/ 
  if(this.scssSchemeForm.value.getCoOwnerName.length == 1){
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

this.ownerData = {Fmember: this.nomineesListFM, controleData:this.scssSchemeForm}
// ==============owner-nominee Data ========================\\ 
    // this.ownerData = this.scssSchemeForm.controls;
    // this.familyMemberId = data.familyMemberId
  }

  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true;
  }

  addScss() {
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
    if (this.scssSchemeForm.invalid) {
      this.scssSchemeForm.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        id: 0,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        advisorId: this.advisorId,
        ownerList: this.scssSchemeForm.value.getCoOwnerName,
        amountInvested: this.scssSchemeForm.get('amtInvested').value,
        commencementDate: this.scssSchemeForm.get('commDate').value,
        postOfficeBranch: this.scssSchemeForm.get('poBranch').value,
        bankAccountNumber: this.scssSchemeForm.get('bankAccNumber').value,
        userBankMappingId: this.scssSchemeForm.get('bankAccNumber').value,
        // ownerTypeId: this.scssSchemeForm.get('ownershipType').value,
        nomineeList: this.scssSchemeForm.value.getNomineeName,
        description: this.scssSchemeForm.get('description').value
      };

      obj.nomineeList.forEach((element, index) => {
        if(element.name == ''){
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList= this.scssSchemeForm.value.getNomineeName;
      let adviceObj = {
        // advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.flag == 'adviceSCSS') {
        this.cusService.getAdviceScss(adviceObj).subscribe(
          data => this.getAdviceScssRes(data),
          err =>{
            this.barButtonOptions.active = false;
            this.eventService.openSnackBar(err, "Dismiss")
          } 
        );
      } else if (this.flag == "editSCSS") {
        obj.id = this.editApi.id;
        this.cusService.editSCSSData(obj).subscribe(
          data => this.addScssResponse(data),
          error =>{
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error)
          } 
        );
      } else {
        this.cusService.addSCSSScheme(obj).subscribe(
          data => this.addScssResponse(data),
          error =>{
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error)
          } 
        );
      }
    }
  }
  getAdviceScssRes(data) {
    this.barButtonOptions.active = false;
    this.eventService.openSnackBar('Scss is added', "Dismiss");
    this.close(true);

  }
  addScssResponse(data) {
    this.barButtonOptions.active = false;
    console.log(data);
    this.close(true);
  }

  close(flag) {
    this.isOptionalField = true;
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  isFormValuesForAdviceValid() {
    if (this.scssSchemeForm.valid ||
      (this.scssSchemeForm.valid && this.scssSchemeForm.valid && this.nomineesList.length !== 0)) {
      return true
    } else {
      return false;
    }
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
