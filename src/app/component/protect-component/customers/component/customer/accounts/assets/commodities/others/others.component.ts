import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss'], providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class OthersComponent implements OnInit {
  validatorType = ValidatorType
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  showHide = false;
  isTypeOfCommodity = false;
  isMarketValue = false;
  others: any;
  othersNominee: any;
  ownerData: any;
  advisorId: any;
  clientId: any;
    nomineesListFM: any = [];
  nomineesList: any;
  flag: any;
  otherData: any;
  adviceShowHeaderAndFooter: boolean = true;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  editData: any;
  callMethod: { methodName: string; ParamValue: any; };
  nominees: any;

  constructor(private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) {
  }

  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Others';

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getdataForm(this.data);
  }

  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
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
    //  disControl : type
    }
  }

  displayControler(con) {
    console.log('value selected', con);
    if(con.owner != null && con.owner){
      this.others.controls.getCoOwnerName = con.owner;
    }
    if(con.nominee != null && con.nominee){
      this.others.controls.getNomineeName = con.nominee;
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
    return this.others.get('getCoOwnerName') as FormArray;
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '', [Validators.required]], share: [data ? String(data.share) : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0],isClient: [data ? data.isClient : 0]
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
    if (this.others.value.getCoOwnerName.length == 1) {
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
    return this.others.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.getNominee.removeAt(item);
    if (this.others.value.getNomineeName.length == 1) {
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
      name: [data ? data.name : ''], sharePercentage: [data ? String(data.sharePercentage) : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0],isClient: [data ? data.isClient : 0]
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

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.others.get('growthRate').setValue(event.target.value);
    }
  }
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }

  getdataForm(data) {
    // this.flag = data;
    // (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : ''
    if (data == undefined) {
      data = {};
      this.flag = "addOTHERS";
    }
    else {
      this.flag = "editOTHERS";
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editData = data;
    }
    this.otherData = data;
    this.others = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: ['', [Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      typeOfCommodity: [(data.commodityTypeId == undefined) ? '' : (data.commodityTypeId) + '', [Validators.required]],
      marketValue: [(data.marketValue == undefined) ? '' : (data.marketValue), [Validators.required]],
      purchaseValue: [(data.purchaseValue == undefined) ? '' : (data.purchaseValue),],
      dateOfPurchase: [(data.dateOfPurchase == undefined) ? '' : new Date(data.dateOfPurchase)],
      growthRate: [(data.growthRate == undefined) ? '' : data.growthRate,],
      description: [(data.description == undefined) ? '' : data.description,],
      nominees: this.nominees,
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })]),
      familyMemberId: [[(data.familyMemberId == undefined) ? '' : data.familyMemberId],]
    });

        // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.others.value.getCoOwnerName.length == 1) {
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

    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.others }
    // ==============owner-nominee Data ========================\\


    // this.othersNominee = this.fb.group({})
    // this.ownerData = this.others.controls;
    // this.familyMemberId = data.familyMemberId;
  }
  // get nominee() {
  //   return this.othersNominee.get('NomineesList') as FormArray;
  // }

  getFormControl(): any {
    return this.others.controls;
  }

  saveOthers() {
    console.log("form group ::::::::::::", this.others);
    if (this.others.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.others.markAllAsTouched();
      return;
    } else {
      const obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerList: this.others.value.getCoOwnerName,
        ownerName: (this.ownerName == undefined) ? this.others.controls.ownerName.value : this.ownerName,
        commodityTypeId: this.others.controls.typeOfCommodity.value,
        marketValue: this.others.controls.marketValue.value,
        purchaseValue: this.others.controls.purchaseValue.value,
        growthRate: this.others.controls.growthRate.value,
        dateOfPurchase: (this.others.controls.dateOfPurchase.touched) ? this.datePipe.transform(this.others.controls.dateOfPurchase.value, 'yyyy-MM-dd') : this.others.controls.dateOfPurchase.value,
        description: this.others.controls.description.value,
        nomineeList:this.others.value.getNomineeName,
      };
      obj.nomineeList.forEach((element, index) => {
        if(element.name == ''){
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList= this.others.value.getNomineeName;
      let adviceObj = {
        // advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.flag == "addOTHERS") {
        this.custumService.addOthers(obj).subscribe(
          data => this.addOthersRes(data), (error) => {
            this.eventService.showErrorMessage(error);
          }
        );
      } else if (this.flag == 'adviceOTHERS') {
        this.custumService.getAdviceOthers(adviceObj).subscribe(
          data => this.getAdviceOthersRes(data), (error) => {
            this.eventService.showErrorMessage(error);
          }
        );
      } else {
        // edit call
        obj['id'] = this.editData.id;
        this.custumService.editOthers(obj).subscribe(
          data => this.editOthersRes(data), (error) => {
            this.eventService.showErrorMessage(error);
          }
        );
      }
    }
  }
  getAdviceOthersRes(data) {
    this.eventService.openSnackBar('Others added successfully', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });

  }
  addOthersRes(data) {
    console.log('addrecuringDepositRes', data);
    this.eventService.openSnackBar('Added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
  }

  editOthersRes(data) {
    this.eventService.openSnackBar('Updated successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
  }

}
