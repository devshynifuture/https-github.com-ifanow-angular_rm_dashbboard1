import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { AssetValidationService } from './../../../asset-validation.service';

@Component({
  selector: 'app-add-po-saving',
  templateUrl: './add-po-saving.component.html',
  styleUrls: ['./add-po-saving.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddPoSavingComponent implements OnInit {
  validatorType = ValidatorType
  isOptionalField: any;
  advisorId: any;
  clientId: number;
  inputData: any;
  ownerData: any;
  poSavingForm: any;
  ownerName: any;
  familyMemberId: any;
  editApi: any;
  accBalance: number;
  nomineesListFM: any = [];
  posavingData: any;
  nomineesList: any[] = [];
  nominees: any[];
  flag: any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  adviceShowHeaderAndFooter: boolean = true;
  callMethod: { methodName: string; ParamValue: any; };

  constructor(public utils: UtilService, private fb: FormBuilder, private cusService: CustomerService,
    private eventService: EventService, private subInjectService: SubscriptionInject) {
  }

  @Input()
  set data(data) {
    this.inputData = data;
    this.accBalance = 1500000;
  }

  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Post office savings a/c';

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
    //disControl : type
  }
}

displayControler(con) {
  console.log('value selected', con);
  if(con.owner != null && con.owner){
    this.poSavingForm.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.poSavingForm.controls.getNomineeName = con.nominee;
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
  return this.poSavingForm.get('getCoOwnerName') as FormArray;
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
  if (this.poSavingForm.value.getCoOwnerName.length == 1) {
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
  return this.poSavingForm.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
  this.getNominee.removeAt(item);
  if (this.poSavingForm.value.getNomineeName.length == 1) {
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

  changeAccountBalance(data) {
    (this.poSavingForm.get('ownershipType').value == 1) ? (this.accBalance = 1500000,
      this.poSavingForm.get('ownershipType').setValidators([Validators.max(1500000)])
    ) : this.accBalance = 200000;
  }

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
  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {
        ownerTypeId: 1
      };
      this.flag = "addPOSAVING";
    } else {
      this.flag = "editPOSAVING";
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editApi = data;
    }
    this.posavingData = data
    this.poSavingForm = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required,AssetValidationService.ageValidators]],
        share: ['', [Validators.required]],
        familyMemberId: 0,
        id: 0
      })]),
      accBal: [data.accountBalance, [Validators.required, Validators.min(20)]],
      balAsOn: [new Date(data.balanceAsOn), [Validators.required]],
      ownershipType: [(data.ownerTypeId) ? String(data.ownerTypeId) : '1', [Validators.required]],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id:[0],
      })]),
      poBranch: [data.postOfficeBranch],
      nominees: this.nominees,
      bankAccNo: [data.acNumber],
      description: [data.description]

    });
    // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.poSavingForm.value.getCoOwnerName.length == 1) {
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
    if (data.nomineeList) {
      this.getNominee.removeAt(0);
      data.nomineeList.forEach(element => {
        this.addNewNominee(element);
      });
    }
    /***nominee***/

    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.poSavingForm }
    // ==============owner-nominee Data ========================\\ 
  }

  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true;
  }

  addPOSaving() {
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
    if (this.poSavingForm.invalid) {
      this.poSavingForm.markAllAsTouched();
    } else {
      if (this.flag == "editPOSAVING") {
        const obj = {
          id: this.editApi.id,
          familyMemberId: this.familyMemberId,
          balanceAsOn: this.poSavingForm.get('balAsOn').value,
          accountBalance: this.poSavingForm.get('accBal').value,
          postOfficeBranch: this.poSavingForm.get('poBranch').value,
          ownerTypeId: this.poSavingForm.get('ownershipType').value,
          ownerList: this.poSavingForm.value.getCoOwnerName,
          nomineeList: this.poSavingForm.value.getNomineeName,
          nominees: this.nominees,
          acNumber: this.poSavingForm.get('bankAccNo').value,
          description: this.poSavingForm.get('description').value,
          ownerName: (this.ownerName == undefined) ? this.poSavingForm.controls.ownerName.value : this.ownerName.userName
        };
        this.cusService.editPOSAVINGData(obj).subscribe(
          data => this.addPOSavingResponse(data),
          error => this.eventService.showErrorMessage(error)
        );
      } else {
        const obj = {
          clientId: this.clientId,
          advisorId: this.advisorId,
          familyMemberId: this.familyMemberId,
          balanceAsOn: this.poSavingForm.get('balAsOn').value,
          accountBalance: this.poSavingForm.get('accBal').value,
          postOfficeBranch: this.poSavingForm.get('poBranch').value,
          ownerTypeId: this.poSavingForm.get('ownershipType').value,
          ownerList: this.poSavingForm.value.getCoOwnerName,
          nomineeList: this.poSavingForm.value.getNomineeName,
          nominees: this.nominees,
          acNumber: this.poSavingForm.get('bankAccNo').value,
          description: this.poSavingForm.get('description').value,
        };
        obj.nomineeList.forEach((element, index) => {
          if(element.name == ''){
            this.removeNewNominee(index);
          }
        });
        obj.nomineeList= this.poSavingForm.value.getNomineeName;
        let adviceObj = {
          advice_id: this.advisorId,
          adviceStatusId: 5,
          stringObject: obj,
          adviceDescription: "manualAssetDescription"
        }
        if (this.flag == 'advicePoSaving') {
          this.cusService.getAdvicePoSaving(adviceObj).subscribe(
            data => this.getAdvicePosavingRes(data),
            err => this.eventService.openSnackBar(err, "Dismiss")
          );
        } else {
          this.cusService.addPOSAVINGScheme(obj).subscribe(
            data => this.addPOSavingResponse(data),
            error => this.eventService.showErrorMessage(error)
          );
        }
      }
    }
  }
  getAdvicePosavingRes(data) {
    this.eventService.openSnackBar('PO_SAVING is edited', 'added');
    this.close(true);
  }
  addPOSavingResponse(data) {
    this.close(true);
    console.log(data);
    (this.flag == "editPOSAVING") ? this.eventService.openSnackBar('Updated successfully!', 'Dismiss') : this.eventService.openSnackBar('Added successfully!', 'Dismiss');

  }

  close(flag) {
    this.isOptionalField = true;
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  isFormValuesForAdviceValid() {
    if (this.poSavingForm.valid ||
      (this.poSavingForm.valid && this.poSavingForm.valid && this.nomineesList.length !== 0)) {
      return true;
    } else {
      return false;
    }
  }
}
