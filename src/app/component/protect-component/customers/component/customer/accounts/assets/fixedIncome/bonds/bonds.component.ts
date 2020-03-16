import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';


@Component({
  selector: 'app-bonds',
  templateUrl: './bonds.component.html',
  styleUrls: ['./bonds.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class BondsComponent implements OnInit {
  validatorType = ValidatorType
  maxDate = new Date();
  dataSource: any;
  bonds: any;
  bondData: any;
  showHide = false;
  inputData: any;
  ownerName: any;
  isBondName = false
  isAmountInvest = false
  isCouponOption = false;
  isRateReturns = false;
  isType = false
  fdMonths: string[];
  tenure: any;
  maturityDate: any;
  getDate: string;
  nomineesList = [];
  selectedFamilyData: any;
  advisorId: any;
  familyMemberId: any;
  ownerData: any;
  nominees: any = [];
  clientId: any;
  nomineesListFM: any = [];
  callMethod:any;
  adviceShowHeaderAndFooter: boolean = true;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  constructor(public utils: UtilService, private eventService: EventService, private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe) {
  }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  @Input() popupHeaderText: string = 'Add Bond';

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    // this.getdataForm()
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.fdMonths = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120']
  }

  
  getFormDataNominee(data) {
    this.nomineesList = data.controls;
    console.log(this.nomineesList, "this.nomineesList 123")
  }
  
  ownerDetails(value) {
    this.familyMemberId = value.id;
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
      this.bonds.controls.getCoOwnerName = con.owner;
    }
    if(con.nominee != null && con.nominee){
      this.bonds.controls.getNomineeName = con.nominee;
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
    return this.bonds.get('getCoOwnerName') as FormArray;
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '', [Validators.required]], share: [data ? String(data.share) : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0]
    }));
    if (!data || this.getCoOwner.value.length < 1) {
      for (let e in this.getCoOwner.controls) {
        this.getCoOwner.controls[e].get('share').setValue('');
      }
    }
  }

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
    if (this.bonds.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    } else {
      for (let e in this.getCoOwner.controls) {
        this.getCoOwner.controls[e].get('share').setValue('');
      }
    }
  }
  /***owner***/ 

  /***nominee***/ 

  get getNominee() {
    return this.bonds.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.getNominee.removeAt(item);
    
  }


  
  addNewNominee(data) {
    this.getNominee.push(this.fb.group({
      name: [data ? data.name : ''], sharePercentage: [data ? String(data.sharePercentage) : ''], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0]
    }));
    if (!data || this.getNominee.value.length < 1) {
      for (let e in this.getNominee.controls) {
        this.getNominee.controls[e].get('sharePercentage').setValue('');
      }
    }
    
  }
  /***nominee***/ 
  // ===================owner-nominee directive=====================//

  getDateYMD() {
    let now = moment();
    this.tenure = moment(this.bonds.controls.commencementDate.value).add(this.bonds.controls.tenure.value, 'months');
    this.getDate = this.datePipe.transform(this.tenure, 'yyyy-MM-dd')
    return this.getDate;
  }
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }

  getdataForm(data) {
    if (data == undefined) {
      data = {}
    }
    this.bondData = data;
    this.bonds = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: ['',[Validators.required]],
        familyMemberId: null
      })]),
      // ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      bondName: [(data == undefined) ? '' : data.bondName, [Validators.required]],
      type: [(data.type == undefined) ? '' : (data.type) + "", [Validators.required]],
      amountInvest: [(data == undefined) ? '' : data.amountInvested, [Validators.required]],
      rateReturns: [(data == undefined) ? '' : data.rateOfReturn, [Validators.required]],
      couponOption: [(data.couponPayoutFrequencyId == undefined) ? '' : (data.couponPayoutFrequencyId) + "", [Validators.required]],
      commencementDate: [(data == undefined) ? '' : new Date(data.commencementDate), [Validators.required]],
      interestRate: [(data == undefined) ? '' : data.couponRate, [Validators.required]],
      compound: [(data.compounding == undefined) ? '' : (data.compounding) + "", [Validators.required]],
      linkBankAc: [(data == undefined) ? '' : data.linkedBankAccount,],
      tenure: [(data == undefined) ? '' : data.tenure, [Validators.required, Validators.min(1), Validators.max(120)]],
      description: [(data == undefined) ? '' : data.description,],
      // bankName: [(data == undefined) ? '' : data.bankName, [Validators.required]],
      id: [(data == undefined) ? '' : data.id,],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId],],
      nominees: this.nominees,
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [''],
        familyMemberId: [0],
        id:[0]
      })]),
    });

    this.getFormControl().description.maxLength = 60;
    // ==============owner-nominee Data ========================\\
  /***owner***/ 
    if(this.bonds.value.getCoOwnerName.length == 1){
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

  this.ownerData = {Fmember: this.nomineesListFM, controleData:this.bonds}
  // ==============owner-nominee Data ========================\\

    this.familyMemberId = this.bonds.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]
  }
  onChange(event, value) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.bonds.get(value).setValue(event.target.value);
    }
  }
  getFormControl(): any {
    return this.bonds.controls;
  }
  onlyTextNotSplChar(event: any) {
    var k = event.keyCode;
    return ((k > 64 && k < 91) || (k == 32) || (k > 96 && k < 123) || k == 8);
  }
  isMonthlyContribution;
  isInterestRate;
  isCompound;
  isCommencementDate;
  isTenure;

  saveBonds() {
    // this.tenure = this.getDateYMD()
    // this.maturityDate = this.tenure
    // this.nominees = [];
    // if (this.nomineesList) {

    //   this.nomineesList.forEach(element => {
    //     let obj = {
    //       "name": element.controls.name.value,
    //       "sharePercentage": element.controls.sharePercentage.value,
    //       "id": (element.controls.id.value) ? element.controls.id.value : 0,
    //       "familyMemberId": (element.controls.familyMemberId.value) ? element.controls.familyMemberId.value : 0
    //     }
    //     this.nominees.push(obj)
    //   });
    // }
    if (this.bonds.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.bonds.markAllAsTouched();
      return;
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        // familyMemberId: this.familyMemberId,
        // ownerName: this.bonds.getCoOwnerName.value,
        ownerList: this.bonds.value.getCoOwnerName,
        amountInvested: this.bonds.controls.amountInvest.value,
        bondName: this.bonds.controls.bondName.value,
        // couponAmount: this.bonds.controls.couponAmount.value,
        couponPayoutFrequencyId: this.bonds.controls.couponOption.value,
        couponRate: this.bonds.controls.interestRate.value,
        commencementDate: this.datePipe.transform(this.bonds.controls.commencementDate.value, 'yyyy-MM-dd'),
        rateOfReturn: this.bonds.controls.rateReturns.value,
        linkedBankAccount: this.bonds.controls.linkBankAc.value,
        description: this.bonds.controls.description.value,
        // maturityDate: this.datePipe.transform(this.maturityDate, 'yyyy-MM-dd'),
        // bankName: this.bonds.controls.bankName.value,
        nomineeList: this.bonds.value.getNomineeName,

        tenure: this.bonds.controls.tenure.value,
        type: this.bonds.controls.type.value,
        compounding: this.bonds.controls.compound.value,
        id: this.bonds.controls.id.value
      }
      console.log('bonds', obj)
      this.dataSource = obj
      if (this.bonds.controls.id.value == undefined) {
        this.custumService.addBonds(obj).subscribe(
          data => this.addBondsRes(data),
          error => this.eventService.showErrorMessage(error)
        );
      } else {
        //edit call
        this.custumService.editBonds(obj).subscribe(
          data => this.editBondsRes(data),
          error => this.eventService.showErrorMessage(error)
        );
      }
    }
  }
  addBondsRes(data) {
    console.log('addrecuringDepositRes', data)
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true })
    this.eventService.openSnackBar('Added successfully!', 'Dismiss');

  }
  editBondsRes(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true })
    this.eventService.openSnackBar('Updated successfully!', 'Dismiss');

  }

  isFormValuesForAdviceValid() {
    if (this.bonds.valid ||
      (this.bonds.valid && this.nomineesList.length !== 0)) {
      return true;
    } else {
      return false;
    }
  }
}
