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
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-cash-in-hand',
  templateUrl: './cash-in-hand.component.html',
  styleUrls: ['./cash-in-hand.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class CashInHandComponent implements OnInit {
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
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  iscashInHand = false;
  isBalanceAsOn = false;
  ownerData: any;
  cashInHand: any;
  showHide = false;
  maxDate:Date= new Date();
  advisorId: any;
  private clientId: any;
    nomineesListFM: any = [];
  flag: any;
  adviceShowHeaderAndFooter: boolean = true;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  editData: any;
  callMethod: { methodName: string; ParamValue: any; };
  constructor(private fb: FormBuilder, private custumService: CustomerService,
    public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) {
  }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Cash in hand';

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
        this.cashInHand.controls.getCoOwnerName = con.owner;
      }
      if(con.nominee != null && con.nominee){
        this.cashInHand.controls.getNomineeName = con.nominee;
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
      return this.cashInHand.get('getCoOwnerName') as FormArray;
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
      if (this.cashInHand.value.getCoOwnerName.length == 1) {
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
      return this.cashInHand.get('getNomineeName') as FormArray;
    }
  
    removeNewNominee(item) {
      this.getNominee.removeAt(item);
      if (this.cashInHand.value.getNomineeName.length == 1) {
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

  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }

  getdataForm(data) {
    this.flag = data;
    // (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : ''

    if (data == undefined) {
      data = {};
      this.flag = "addCASHINHAND";
    }
    else {
      this.flag = "editCASHINHAND";
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editData = data;
    }
    this.cashInHand = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: ['', [Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      balanceAsOn: [(data.balanceAsOn == undefined) ? '' : new Date(data.balanceAsOn), [Validators.required]],
      cashBalance: [(data.cashValue == undefined) ? '' : data.cashValue, [Validators.required]],
      // bankAcNo: [(data.bankAccountNumber == undefined) ? '' : data.bankAccountNumber, [Validators.required]],
      description: [(data.description == undefined) ? '' : data.description,],
      familyMemberId: [[(data.familyMemberId == undefined) ? '' : data.familyMemberId],],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })]),
    });
       // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.cashInHand.value.getCoOwnerName.length == 1) {
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

    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.cashInHand }
    // ==============owner-nominee Data ========================\\
  }

  getFormControl(): any {
    return this.cashInHand.controls;
  }

  saveCashInHand() {
    if (this.cashInHand.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.cashInHand.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerList: this.cashInHand.value.getCoOwnerName,
        balanceAsOn: this.datePipe.transform(this.cashInHand.controls.balanceAsOn.value, 'yyyy-MM-dd'),
        cashValue: this.cashInHand.controls.cashBalance.value,
        // bankAccountNumber: this.cashInHand.controls.bankAcNo.value,
        description: this.cashInHand.controls.description.value,
        nomineeList: this.cashInHand.value.getNomineeName,

      };
      obj.nomineeList.forEach((element, index) => {
        if(element.name == ''){
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList= this.cashInHand.value.getNomineeName;
      let adviceObj = {
        // advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.flag == "addCASHINHAND") {
        this.custumService.addCashInHand(obj).subscribe(
          data => this.addCashInHandRes(data), (error) => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      } else if (this.flag == 'adviceCashInHand') {
        this.custumService.getAdviceCashInHand(adviceObj).subscribe(
          data => this.getAdviceCashInHandRes(data), (error) => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      } else {
        // edit call
        obj['id'] = this.editData.id;
        this.custumService.editCashInHand(obj).subscribe(
          data => this.editCashInHandRes(data), (error) => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      }
    }
  }
  getAdviceCashInHandRes(data) {
    this.barButtonOptions.active = false;
    this.eventService.openSnackBar('Cash in hand added successfully', 'OK');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });

  }
  addCashInHandRes(data) {
    this.barButtonOptions.active = false;
    console.log('addrecuringDepositRes', data);
    this.subInjectService.changeNewRightSliderState({ state: 'close', data: 2, refreshRequired: true });
    this.eventService.openSnackBar('Cash in hand added successfully', 'OK');

  }

  editCashInHandRes(data) {
    this.barButtonOptions.active = false;
    this.subInjectService.changeNewRightSliderState({ state: 'close', data: 2, refreshRequired: true });
    this.eventService.openSnackBar('Cash in hand edited successfully', 'OK');

  }

}
