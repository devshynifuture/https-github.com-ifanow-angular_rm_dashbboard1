import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { ActiityService } from '../../../../customer-activity/actiity.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';


@Component({
  selector: 'app-fixed-deposit',
  templateUrl: './fixed-deposit.component.html',
  styleUrls: ['./fixed-deposit.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class FixedDepositComponent implements OnInit {
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
  maxDate:Date = new Date();
  showHide = false;
  isownerName = false;
  showTenure = true;
  isDescription = false;
  isBankACNo = false;
  isInterestRate = false;
  isFDType = false;
  isAmountInvest = false;
  isCommencementDate = false;
  isInterestDate = false;
  isCompound = false;
  // isMaturity = false;
  isMaturityDate = false;
  isFrequencyOfPayoutPerYear = false;
  isPayOpt = false;
  isOwnerType = false;
  isFdNo = false;
  // isTenure = false;
  isInstitution = false;
  fixedDeposit;
  advisorId: any;
  dataSource: any;
  family: Observable<string[]>;
  options: any;
  inputData: any;
  validMaturity: any;
  showErrorOwner = false;
  callMethod: any;
  compoundValue = [
    { name: 'Daily', value: 2 },
    { name: 'Monthly', value: 3 },
    { name: 'Quarterly', value: 1 },
    { name: 'Semi annually ', value: 4 },
    { name: 'Annually', value: 5 }
  ];
  isOwnerPercent
  ownerData: any;
  nomineeData: any;
  tenure: any;
  getDate: string;
  ownerName: any;
  maturityDate: any;
  selectedFamilyData: any;
  showFreqPayOpt = false;
  familyMemberId: any;
  recuringDeposit: any;
  clientId: any;
  isViewInitCalled = false;
  nomineesListFM: any = [];
  flag: any;
  // reqError: boolean = false;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  fdMonths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
    '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26',
    '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41',
    '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56',
    '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71',
    '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86',
    '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101',
    '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114',
    '115', '116', '117', '118', '119', '120'];
  fdDays = ['0','7', '8', '9', '10', '11', '12', '13', '14',
    '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  fdYears = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
  addOwner: any;
  showError: boolean;
  nexNomineePer: number;
  showErrorCoOwner: boolean;
  adviceShowHeaderAndFooter: boolean = true;
  tenureFlag: boolean;

  constructor(public utils: UtilService, private event: EventService, private router: Router,
    private fb: FormBuilder, private custumService: CustomerService,
    public subInjectService: SubscriptionInject, private datePipe: DatePipe, public activityService: ActiityService) {
  }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of FixedDepositComponent ', data);

    if (this.isViewInitCalled) {
      this.getdataForm(data);
    }
  }


  @Input() popupHeaderText: string = 'Add Fixed deposit';


  get data() {
    return this.inputData;
  }
  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    console.log('This is ngOnInit data of FixedDepositComponent');
    this.getdataForm(this.inputData);

    this.isViewInitCalled = true;
    console.log('data', this.inputData);
    this.clientId = AuthService.getClientId();
    const obj = {
      clientId: this.clientId
    };
    this.advisorId = AuthService.getAdvisorId();
  }
  getOwnerListRes(data) {
    console.log('familymember', data);
  }

  checkDate() {
    this.validMaturity = new Date(new Date().setDate(new Date(this.getFormControl().commencementDate.value).getDate() + 7));
    console.log(this.validMaturity);
    // this.checkCommDateAndTenure();
  }
  // checkCommDateAndTenure() {
  //   if (this.tenure && this.getFormControl().commencementDate.value) {
  //     if (this.tenure._d < new Date()) {
  //       console.log("error");
  //       this.tenureFlag = true;
  //       return;
  //     }
  //     this.tenureFlag = false;
  //     return;
  //   }
  // }
  tenureError() {
    return { flag: true }
  }
  Close(flag) {
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
      methodName: "disabledMember",
      ParamValue: value,
      disControl: type
    }
  }

  displayControler(con) {
    console.log('value selected', con);
    if (con.owner != null && con.owner) {
      this.fixedDeposit.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.fixedDeposit.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: "onChangeJointOwnership",
      ParamValue: data
    }
  }

  /***owner***/

  get getCoOwner() {
    return this.fixedDeposit.get('getCoOwnerName') as FormArray;
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '', [Validators.required]], share: [data ? data.share : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0],isClient: [data ? data.isClient : 0]
    }));
    if (data) {
      setTimeout(() => {
        this.disabledMember(null, null);
      }, 1300);
    }

    if (this.getCoOwner.value.length > 1 && !data) {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        }
        else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }
    if (data) {
      setTimeout(() => {
        this.disabledMember(null, null);
      }, 1300);
    }
  }

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
    if (this.fixedDeposit.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    } else {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        }
        else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }
    this.disabledMember(null, null);
  }
  /***owner***/

  /***nominee***/

  get getNominee() {
    return this.fixedDeposit.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
  this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.fixedDeposit.value.getNomineeName.length == 1) {
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
    this.disabledMember(null, null);
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

    if(this.getNominee.value.length > 1){
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


  ownerDetails(value) {
    this.familyMemberId = value.id;
    // this.reqError = true;
  }





  showLess(value) {
    if (value) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }

  keyPress(event: any) {
    var k = event.keyCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 45 || k == 47 || k == 8 || (k >= 48 && k <= 57));
  }

  haveMaturity(maturity) {
    if (maturity) {
      this.showTenure = false;
      this.getFormControl().tenureD.setValidators(null);
      this.getFormControl().tenureM.setValidators(null);
      this.getFormControl().tenureY.setValidators(null);
      this.getFormControl().maturityDate.setValidators([Validators.required]);
    } else {
      this.showTenure = true;
      this.getFormControl().tenureD.setValidators([Validators.required]);
      this.getFormControl().tenureM.setValidators([Validators.required]);
      this.getFormControl().tenureY.setValidators([Validators.required]);
      this.getFormControl().maturityDate.setValidators(null);
      this.getFormControl().maturityDate.setValue('Invalid Date');
    }
  }

  tenureValid: boolean = true;
  getDateYMD() {
    let d = this.fixedDeposit.controls.tenureD.value;
    let m = this.fixedDeposit.controls.tenureM.value;
    let y = this.fixedDeposit.controls.tenureY.value;
    if ((d != 0 && d >= 7) || m != 0 || y != 0) {
      this.tenure = moment(this.fixedDeposit.controls.commencementDate.value).add(m, 'months');
      this.tenure = moment(this.tenure).add(y, 'years');
      this.tenure = moment(this.tenure).add(d, 'days');
      if (this.fixedDeposit.controls.commencementDate.valid) {
        this.getDate = this.datePipe.transform(this.tenure, 'yyyy-MM-dd');
        console.log(this.tenure, this.getDate);
        // this.checkCommDateAndTenure();
      }
      this.tenureValid = true;
      return this.getDate;
    }
    else {
      this.tenureValid = false;
      this.fixedDeposit.get('tenureD').setErrors(this.tenureValid)
    }
  }

  getdataForm(data) {
    this.flag = data;
    (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : ''
    if (this.dataSource) {
      data = this.dataSource;
    }

    this.fixedDeposit = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: ['', [Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      // ownerType: [(!data.ownershipType) ? '' : (data.ownershipType) + '', [Validators.required]],
      // ownerName: [(!data.ownerName) ? '' : data.ownerName],
      FDType: [(!data.fdType) ? '' : (data.fdType) + '', [Validators.required]],
      amountInvest: [(!data) ? '' : data.amountInvested, [Validators.required]],
      commencementDate: [(!data) ? '' : new Date(data.commencementDate), [Validators.required]],
      interestRate: [(!data) ? '' : data.interestRate, [Validators.required]],
      maturity: [!data.fdEndDateIn ? 1 : data.fdEndDateIn, [Validators.required]],
      compound: [(!data.interestCompoundingId) ? '' : data.interestCompoundingId],
      ownerPercent: [data.ownerPerc],
      institution: [(!data) ? '' : data.institutionName],
      description: [(!data) ? '' : data.description],
      tenureY: [(!data.tenureInYear) ? '0' : (data.fdEndDateIn == 2) ? 0 : data.tenureInYear.toString()],
      tenureM: [(!data.tenureInMonth) ? '0' : (data.fdEndDateIn == 2) ? 0 : data.tenureInMonth.toString()],
      tenureD: [(!data.tenureInDay) ? '0' : (data.fdEndDateIn == 2) ? 0 : data.tenureInDay.toString()],
      frequencyOfPayoutPerYear: [(!data.frequencyOfPayoutPerYear) ? '' : data.frequencyOfPayoutPerYear],
      maturityDate: [(!data) ? '' : (data.fdEndDateIn == 1) ? '' : new Date(data.maturityDate)],
      payOpt: [(!data.interestPayoutOption) ? '' : data.interestPayoutOption, [Validators.required]],
      bankACNo: [(!data) ? '' : data.bankAcNumber],
      fdNo: [(!data) ? '' : data.fdNumber],
      id: [(!data) ? '' : data.id,],
      familyMemberId: [(!data) ? '' : data.familyMemberId],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })])
    });
    if (this.fixedDeposit.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    }
    if (data.ownerList) {
      this.getCoOwner.removeAt(0);
      data.ownerList.forEach(element => {
        this.addNewCoOwner(element);
      });
    }

    /***nominee***/
    if (data.nomineeList) {
      this.getNominee.removeAt(0);
      data.nomineeList.forEach(element => {
        this.addNewNominee(element);
      });
    }
    /***nominee***/
    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.fixedDeposit }
    this.familyMemberId = this.fixedDeposit.controls.familyMemberId.value;
    this.fixedDeposit.controls.maturityDate.setValue(new Date(data.maturityDate));
  }
  getFormControl(): any {
    return this.fixedDeposit.controls;
  }

  getIntPayout() {
    if (this.fixedDeposit.value.payOpt == 1) {
      this.getFormControl().compound.setValidators([Validators.required]);
    }
    else {
      this.getFormControl().compound.setValidators(null);
    }
  }



  saveFixedDeposit() {
    if(this.fixedDeposit.value.maturity == 2){
      this.maturityDate = this.fixedDeposit.controls.maturityDate.value;
    }
    else{
      if (this.showTenure == true) {
        this.tenure = this.getDateYMD();
        this.maturityDate = this.tenure;
      } else {
        this.maturityDate = this.fixedDeposit.controls.maturityDate.value;
      }
    }
    if (this.tenureFlag) {
      return;
    }
    if (this.fixedDeposit.invalid || (!this.tenureValid && this.fixedDeposit.value.maturity != "2")) {
      // this.reqError = true;
      this.inputs.find(input => !input.ngControl.valid).focus();
      for (let element in this.fixedDeposit.controls) {
        console.log(element)
        this.fixedDeposit.controls[element].markAsTouched();
        if (element == 'getCoOwnerName') {
          for (let e in this.getCoOwner.controls) {
            const arrayCon: any = this.getCoOwner.controls[e];
            for (let i in arrayCon.controls) {
              arrayCon.controls[i].markAsTouched();
            }
          }
        }
        // if (this.fixedDeposit.controls[element].invalid) {
        // return;
        // }
      }

      // for (let element in this.getCoOwner.controls) {
      // console.log(element)
      // if (this.fixedDeposit.controls[element].invalid) {
      // this.getCoOwner.controls[element].markAsTouched();
      // return;
      // }
      // }
    } else {
      
      const obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        // familyMemberId: this.familyMemberId,
        ownerList: this.fixedDeposit.value.getCoOwnerName,
        amountInvested: this.fixedDeposit.controls.amountInvest.value,
        // ownershipType: this.fixedDeposit.controls.ownerType.value,
        interestRate: this.fixedDeposit.controls.interestRate.value,
        commencementDate: this.datePipe.transform(this.fixedDeposit.controls.commencementDate.value, 'yyyy-MM-dd'),
        institutionName: this.fixedDeposit.controls.institution.value,
        description: this.fixedDeposit.controls.description.value,
        frequencyOfPayoutPerYear: (this.fixedDeposit.controls.payOpt.value == 2) ? this.fixedDeposit.value.frequencyOfPayoutPerYear : null,
        maturityDate: this.datePipe.transform(this.maturityDate, 'yyyy-MM-dd'),
        interestPayoutOption: this.fixedDeposit.controls.payOpt.value,
        bankAcNumber: this.fixedDeposit.controls.bankACNo.value,
        fdNumber: this.fixedDeposit.controls.fdNo.value,
        fdType: this.fixedDeposit.controls.FDType.value,
        interestCompoundingId: (this.fixedDeposit.controls.payOpt.value == 1) ? this.fixedDeposit.value.compound : null,
        tenureInYear: this.fixedDeposit.controls.tenureY.value,
        tenureInMonth: this.fixedDeposit.controls.tenureM.value,
        tenureInDay: this.fixedDeposit.controls.tenureD.value,
        fdEndDateIn: this.fixedDeposit.controls.maturity.value,
        nomineeList: this.fixedDeposit.value.getNomineeName,
        id: this.fixedDeposit.controls.id.value
        // isEdit: this.fixedDeposit.controls.id.value?true:false
      };

      obj.nomineeList.forEach((element, index) => {
        if(element.name == ''){
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList= this.fixedDeposit.value.getNomineeName;
      console.log("fd log", obj);
      // return;
      this.barButtonOptions.active = true;
      console.log('fixedDeposit', obj);
      this.dataSource = obj;
      let adviceObj = {
        // advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }

      if (this.flag == 'adviceFixedDeposit') {
        this.custumService.getAdviceFd(adviceObj).subscribe(
          data => this.getAdviceFdRes(data),
          err =>{
            this.barButtonOptions.active = false;
            this.event.openSnackBar(err, "Dismiss")
          } 
        );
      }
      else if (this.fixedDeposit.controls.id.value) {
        // edit call
        this.custumService.editFixedDeposit(obj).subscribe(
          data => this.editFixedDepositRes(data),
          err =>{
            this.barButtonOptions.active = false;
            this.event.openSnackBar(err, "Dismiss")
          } 
        );
      } else {
        this.custumService.addFixedDeposit(obj).subscribe(
          data => this.addFixedDepositRes(data),
          err =>{
            this.barButtonOptions.active = false;
            this.event.openSnackBar(err, "Dismiss")
          }
        );
      }
    }
  }
  getMaturityDate(data) {
    console.log(data)
    if (data.value == '1') {
      if (this.flag.fdEndDateIn == "1") {
        // this.fixedDeposit.get('tenureM').updateValueAndValidity();
        // this.fixedDeposit.get('tenureY').updateValueAndValidity();
        // this.fixedDeposit.get('tenureD').updateValueAndValidity();
        let valueSet = {
          tenureY: this.flag.tenureInYear,
          tenureM: this.flag.tenureInMonth,
          tenureD: this.flag.tenureInDay
        }
        this.fixedDeposit.setValue(valueSet);
        // this.fixedDeposit.get('tenureY').setValue(this.flag.tenureInYear);
        // this.fixedDeposit.get('tenureD').setValue(this.flag.tenureInDay);

      }
      else {
        this.fixedDeposit.get('tenureY').setValue('0');
        this.fixedDeposit.get('tenureM').setValue('0');
        this.fixedDeposit.get('tenureD').setValue('0');
      }
    }
    else {
      if (this.flag.fdEndDateIn == "2") {
        this.fixedDeposit.get('maturityDate').setValue(new Date(this.flag.maturityDate));
      }
      else {
        this.fixedDeposit.get('maturityDate').reset();
      }
    }
  }
  getAdviceFdRes(data) {
    console.log('advice activity res ==>', data)
    this.barButtonOptions.active = false;
    this.event.openSnackBar('Fixed deposite added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
  }
  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.fixedDeposit.get('interestRate').setValue(event.target.value);
    }
  }




  addFixedDepositRes(data) {
    console.log('addFixedDepositRes', data);
    this.barButtonOptions.active = false;
    this.event.openSnackBar('Added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
  }
  editFixedDepositRes(data) {
    this.barButtonOptions.active = false;
    this.event.openSnackBar('Updated successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
  }
}
