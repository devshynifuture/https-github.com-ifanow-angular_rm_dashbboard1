import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { MAT_DATE_FORMATS } from '@angular/material';
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
  validatorType = ValidatorType
  maxDate = new Date();
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
  fixedDeposit: any;
  advisorId: any;
  dataSource: any;
  family: Observable<string[]>;
  options: any;
  inputData: any;
  validMaturity: any;
  showErrorOwner = false;
  compoundValue = [
    { name: 'Daily', value: 2 },
    { name: 'Monthly', value: 3 },
    { name: 'Quarterly', value: 1 },
    { name: 'Semi annually ', value: 4 },
    { name: 'Annually', value: 5 }
  ];
  isOwnerPercent
  ownerData: any;
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
  nomineesListFM: any;
  flag: string;
  fdMonths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
    '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26',
    '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41',
    '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56',
    '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71',
    '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86',
    '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101',
    '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114',
    '115', '116', '117', '118', '119', '120'];
  fdDays = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14',
    '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  fdYears = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
  addOwner: any;
  showError: boolean;
  nexNomineePer: number;
  showErrorCoOwner: boolean;

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

  get getCoOwner() {
    return this.fixedDeposit.get('getCoOwnerName') as FormArray;
  }
  @Input() popupHeaderText: string = 'Add Fixed deposit';

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
  }

  ownerList(value) {
    console.log(value)
    this.familyMemberId = value.id
  }

  addNewCoOwner(data) {
    if (this.addOwner == data) {
      if (this.showErrorOwner == false) {
        this.getCoOwner.push(this.fb.group({
          ownerName: "", ownershipPerc: null, familyMemberId: null
        }));
      }
    } else {
      if (this.showErrorOwner == false) {
        this.addOwner = data;
        if (this.getCoOwner.value.length == 0) {
          this.getCoOwner.push(this.fb.group({
            ownerName: "", ownershipPerc: null, familyMemberId: null
          }));
        }
      }
    }
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
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
    this.validMaturity = new Date(new Date().setDate(new Date(this.getFormControl().commencementDate.value).getDate() + 1))
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
  display(value) {
    console.log('value selected', value);
    this.ownerName = value.userName;
    this.familyMemberId = value.id;
  }
  ownerDetails(value) {
    this.familyMemberId = value.id;
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  showLess(value) {
    if (value) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }

  // intrestPayout(value) {
  //   if (value == 2) {
  //     this.showFreqPayOpt = true;
  //   } else {
  //     this.showFreqPayOpt = false;
  //   }
  // }
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
    if (d != 0 || m != 0 || y != 0) {
      this.tenure = moment(this.fixedDeposit.controls.commencementDate.value).add(m, 'months');
      this.tenure = moment(this.tenure).add(y, 'years');
      this.tenure = moment(this.tenure).add(d, 'days');
      this.getDate = this.datePipe.transform(this.tenure, 'yyyy-MM-dd');
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
      ownerName: [(!data.ownerName) ? '' : data.ownerName, [Validators.required]],
      getCoOwnerName: this.fb.array([this.fb.group({
        ownerName: '',
        ownershipPerc: null,
        familyMemberId: null
      })]),
      ownerPercent: [data.ownerPerc, [Validators.required]],
      amountInvest: [(!data) ? '' : data.amountInvested, [Validators.required]],
      commencementDate: [(!data) ? '' : new Date(data.commencementDate), [Validators.required]],
      interestRate: [(!data) ? '' : data.interestRate, [Validators.required]],
      maturity: [!data.maturity ? 1 : data.maturity, [Validators.required]],
      compound: [(!data.interestCompoundingId) ? '' : data.interestCompoundingId],
      institution: [(!data) ? '' : data.institutionName],
      description: [(!data) ? '' : data.description],
      tenureY: [(!data.tenureY) ? '0' : data.tenureY.toString()],
      tenureM: [(!data.tenureM) ? '0' : data.tenureM.toString()],
      tenureD: [(!data.tenureD) ? '0' : data.tenureD.toString()],
      frequencyOfPayoutPerYear: [(!data.frequencyOfPayoutPerYear) ? '' : data.frequencyOfPayoutPerYear],
      maturityDate: [(!data) ? '' : new Date(data.maturityDate)],
      payOpt: [(!data.interestPayoutOption) ? '' : data.interestPayoutOption, [Validators.required]],
      bankACNo: [(!data) ? '' : data.bankAcNumber],
      ownerType: [(!data.ownershipType) ? '' : (data.ownershipType) + '', [Validators.required]],
      fdNo: [(!data) ? '' : data.fdNumber],
      FDType: [(!data.fdType) ? '' : (data.fdType) + '', [Validators.required]],
      id: [(!data) ? '' : data.id,],
      familyMemberId: [(!data) ? '' : data.familyMemberId],
      getNomineeName: this.fb.array([this.fb.group({
        name: null,
        ownershipPer: null,
      })])
    });

    this.ownerData = this.fixedDeposit.controls;
    this.familyMemberId = this.fixedDeposit.controls.familyMemberId.value;
    // this.familyMemberId = this.familyMemberId[0];
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
    if (this.showTenure == true) {
      this.tenure = this.getDateYMD();
      this.maturityDate = this.tenure;
    } else {
      this.maturityDate = this.fixedDeposit.controls.maturityDate.value;
    }
    if (this.fixedDeposit.invalid || !this.tenureValid) {
      this.fixedDeposit.get('ownerName').markAsTouched();
      this.fixedDeposit.get('FDType').markAsTouched();
      this.fixedDeposit.get('maturityDate').markAsTouched();
      this.fixedDeposit.get('amountInvest').markAsTouched();
      this.fixedDeposit.get('commencementDate').markAsTouched();
      this.fixedDeposit.get('interestRate').markAsTouched();
      this.fixedDeposit.get('compound').markAsTouched();
      this.fixedDeposit.get('frequencyOfPayoutPerYear').markAsTouched();
      this.fixedDeposit.get('ownerType').markAsTouched();
      this.fixedDeposit.get('payOpt').markAsTouched();
    } else {
      const obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerName: this.ownerName ? this.ownerName : this.fixedDeposit.controls.ownerName.value,
        amountInvested: this.fixedDeposit.controls.amountInvest.value,
        ownershipType: this.fixedDeposit.controls.ownerType.value,
        interestRate: this.fixedDeposit.controls.interestRate.value,
        commencementDate: this.datePipe.transform(this.fixedDeposit.controls.commencementDate.value, 'yyyy-MM-dd'),
        institutionName: this.fixedDeposit.controls.institution.value,
        description: this.fixedDeposit.controls.description.value,
        frequencyOfPayoutPerYear: this.fixedDeposit.value.compound == '' ? this.fixedDeposit.value.frequencyOfPayoutPerYear : this.fixedDeposit.value.compound,
        maturityDate: this.datePipe.transform(this.maturityDate, 'yyyy-MM-dd'),
        interestPayoutOption: this.fixedDeposit.controls.payOpt.value,
        bankAcNumber: this.fixedDeposit.controls.bankACNo.value,
        fdNumber: this.fixedDeposit.controls.fdNo.value,
        fdType: this.fixedDeposit.controls.FDType.value,
        interestCompoundingId: this.fixedDeposit.value.compound == "" ? 0 : this.fixedDeposit.value.compound,
        tenureInYear: this.fixedDeposit.controls.tenureY.value,
        tenureInMonth: this.fixedDeposit.controls.tenureM.value,
        tenureInDay: this.fixedDeposit.controls.tenureD.value,
        fdEndDateIn: this.fixedDeposit.controls.maturity.value,
        id: this.fixedDeposit.controls.id.value
      };
      console.log('fixedDeposit', obj);
      this.dataSource = obj;
      let adviceObj = {
        advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }

      if (this.flag == 'adviceFixedDeposit') {
        this.custumService.getAdviceFd(adviceObj).subscribe(
          data => this.getAdviceFdRes(data),
        );
      }
      else if (this.fixedDeposit.controls.id.value) {
        // edit call
        this.custumService.editFixedDeposit(obj).subscribe(
          data => this.editFixedDepositRes(data),
          err => this.event.openSnackBar(err, "dismiss")
        );
      } else {
        this.custumService.addFixedDeposit(obj).subscribe(
          data => this.addFixedDepositRes(data),
          err => this.event.openSnackBar(err, "dismiss")
        );
      }
    }
  }
  getAdviceFdRes(data) {
    console.log('advice activity res ==>', data)
    this.event.openSnackBar('Fixed deposite added successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
  }
  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.fixedDeposit.get('interestRate').setValue(event.target.value);
    }
  }

  get getNominee() {
    return this.fixedDeposit.get('getNomineeName') as FormArray;
  }

  onChangeJointOwnership(data) {
    if (data == 'owner') {
      this.nexNomineePer = 0;
      this.getCoOwner.value.forEach(element => {
        this.nexNomineePer += (element.ownershipPerc) ? parseInt(element.ownershipPerc) : null;
      });
      this.nexNomineePer = this.fixedDeposit.controls.ownerPercent.value + this.nexNomineePer
      if (this.nexNomineePer > 100) {
        this.showErrorOwner = true;
        console.log('show error Percent cannot be more than 100%')
      } else {
        this.showErrorOwner = false
        this.showErrorCoOwner = false;
      }
    } else {
      this.nexNomineePer = 0;

      this.getNominee.value.forEach(element => {
        this.nexNomineePer += (element.ownershipPer) ? parseInt(element.ownershipPer) : null;
      });
      if (this.nexNomineePer > 100) {
        this.showError = true
        console.log('show error Percent cannot be more than 100%')
      } else {
        this.showError = false
      }
    }
  }
  addFixedDepositRes(data) {
    console.log('addFixedDepositRes', data);
    this.event.openSnackBar('Added successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
  }
  editFixedDepositRes(data) {
    this.event.openSnackBar('Updated successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
  }
}
