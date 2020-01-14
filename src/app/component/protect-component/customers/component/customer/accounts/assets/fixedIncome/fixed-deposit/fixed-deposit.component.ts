import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';


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
  showHide = false;
  isownerName = false;
  showTenure = false;
  isDescription = false;
  isBankACNo = false;
  isInterestRate = false;
  isFDType = false;
  isAmountInvest = false;
  isCommencementDate = false;
  isInterestDate = false;
  isCompound = false;
  isMaturity = false;
  isMaturityDate = false;
  isFrequencyOfPayoutPerYear = false;
  isPayOpt = false;
  isOwnerType = false;
  isFdNo = false;
  isTenure = false;
  isInstitution = false;
  fixedDeposit: any;
  advisorId: any;
  dataSource: any;
  s: string[] = ['Sneha', 'gayatri', 'Shivani'];

  family: Observable<string[]>;
  options: any;
  fdYears: string[];
  fdMonths: string[];
  fdDays: string[];
  inputData: any;
  compoundValue = [
    { name: 'Daily', value: 2 },
    { name: 'Monthly', value: 3 },
    { name: 'Quarterly', value: 1 },
    { name: 'Semi annually ', value: 4 },
    { name: 'Annually', value: 5 }
  ];
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

  constructor( public utils: UtilService,private event: EventService, private router: Router,
    private fb: FormBuilder, private custumService: CustomerService,
    public subInjectService: SubscriptionInject, private datePipe: DatePipe) {

    console.log('This is constructor of FixedDepositComponent');
  }

  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of FixedDepositComponent ', data);

    if (this.isViewInitCalled) {
      this.getdataForm(data);
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
    this.fdMonths = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
      '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26',
      '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41',
      '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56',
      '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71',
      '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86',
      '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101',
      '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114',
      '115', '116', '117', '118', '119', '120'];
    this.fdDays = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14',
      '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    this.fdYears = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];

  }

  getOwnerListRes(data) {
    console.log('familymember', data);
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close',refreshRequired:flag });
  }

  display(value) {
    console.log('value selected', value);
    this.ownerName = value.userName;
    this.familyMemberId = value.id;
  }

  showLess(value) {
    if (value) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }

  intrestPayout(value) {
    if (value == 2) {
      this.showFreqPayOpt = true;
    }
  }

  keyPress(event: any) {
    var k = event.keyCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k==45 || k==47 || k == 8 || (k >= 48 && k <= 57));
  }

  haveMaturity(maturity) {
    if (maturity) {
      this.showTenure = false;
    } else {
      this.showTenure = true;
    }
  }

  getDateYMD() {
    // if(this.fixedDeposit.controls.maturityDate.invalid == true){
    //  let now = moment();
    moment(this.tenure = this.fixedDeposit.controls.commencementDate.value).add(this.fixedDeposit.controls.tenureM.value, 'months');
    moment(this.tenure = this.fixedDeposit.controls.commencementDate.value).add(this.fixedDeposit.controls.tenureY.value, 'years');
    moment(this.tenure = this.fixedDeposit.controls.commencementDate.value).add(this.fixedDeposit.controls.tenureD.value, 'days');
    this.getDate = this.datePipe.transform(this.tenure, 'yyyy-MM-dd');
    return this.getDate;
    // }else{
    //   this.tenure = this.fixedDeposit.controls.commencementDate.value.add(this.fixedDeposit.controls.tenureM.value, 'months');
    //   this.tenure = this.fixedDeposit.controls.commencementDate.value.add(this.fixedDeposit.controls.tenureY.value, 'years');
    //   this.tenure = this.fixedDeposit.controls.commencementDate.value.add(this.fixedDeposit.controls.tenureD.value, 'days');
    //   this.getDate = this.datePipe.transform(this.tenure, 'yyyy-MM-dd')
    //   return this.getDate;
    // }
  }

  getdataForm(data) {
    if (!data) {
      data = {};
    }
    if (this.dataSource) {
      data = this.dataSource;
    }
    this.fixedDeposit = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      amountInvest: [(!data) ? '' : data.amountInvested, [Validators.required]],
      commencementDate: [(!data) ? '' : new Date(data.commencementDate), [Validators.required]],
      interestRate: [(!data) ? '' : data.interestRate, [Validators.required]],
      maturity: [(!data) ? '' : data.maturity, [Validators.required]],
      compound: [(!data.interestCompoundingId) ? '' : (data.interestCompoundingId) + '', [Validators.required]],
      institution: [(!data) ? '' : data.institutionName, [Validators.required]],
      description: [(!data) ? '' : data.description, [Validators.required]],
      tenureY: [(!data) ? '' : data.tenureY, [Validators.required]],
      tenureM: [(!data) ? '' : data.tenureM, [Validators.required]],
      tenureD: [(!data) ? '' : data.tenureD, [Validators.required]],
      frequencyOfPayoutPerYear: [(!data.frequencyOfPayoutPerYear) ? '' : data.frequencyOfPayoutPerYear, [Validators.required]],
      maturityDate: [(!data) ? '' : new Date(data.maturityDate), [Validators.required]],
      payOpt: [(!data.interestPayoutOption) ? '' : (data.interestPayoutOption) + '', [Validators.required]],
      bankACNo: [(!data) ? '' : data.bankAcNumber, [Validators.required]],
      ownerType: [(!data.ownershipType) ? '' : (data.ownershipType) + '', [Validators.required]],
      fdNo: [(!data) ? '' : data.fdNumber, [Validators.required]],
      FDType: [(!data.fdType) ? '' : (data.fdType) + '', [Validators.required]],
      id: [(!data) ? '' : data.id, [Validators.required]],
      familyMemberId: [[(!data) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.getFormControl().ownerName.maxLength = 40;
    this.getFormControl().description.maxLength = 60;
    this.getFormControl().fdNo.maxLength = 10;
    this.getFormControl().bankACNo.maxLength = 15;
    this.ownerData = this.fixedDeposit.controls;
    this.familyMemberId = this.fixedDeposit.controls.familyMemberId.value;
    this.familyMemberId = this.familyMemberId[0];
    this.fixedDeposit.controls.maturityDate.setValue(new Date(data.maturityDate));
  }

  getFormControl(): any {
    return this.fixedDeposit.controls;
  }

  saveFixedDeposit() {
    if (this.fixedDeposit.controls.maturityDate.invalid) {
      this.tenure = this.getDateYMD();
      this.maturityDate = this.tenure;
    } else {
      this.maturityDate = this.fixedDeposit.controls.maturityDate.value;
    }
    if (this.fixedDeposit.get('FDType').invalid) {
      this.fixedDeposit.get('FDType').markAsTouched();
      return
    }
    else if (this.fixedDeposit.get('ownerName').invalid) {
      this.fixedDeposit.get('ownerName').markAsTouched();
      return
    }
    else if (this.fixedDeposit.get('amountInvest').invalid) {
      this.fixedDeposit.get('amountInvest').markAsTouched();
      return
    } 
    else if (this.fixedDeposit.get('commencementDate').invalid) {
      this.fixedDeposit.get('commencementDate').markAsTouched();
      return
    } 
    else if (this.fixedDeposit.get('interestRate').invalid) {
      this.fixedDeposit.get('interestRate').markAsTouched();
      return
    } 
    else if (this.fixedDeposit.get('compound').invalid) {
      this.fixedDeposit.get('compound').markAsTouched();
      return
    } else if (this.fixedDeposit.get('compound').invalid) {
      this.fixedDeposit.get('compound').markAsTouched();
      return
    } 
    else if (this.fixedDeposit.get('frequencyOfPayoutPerYear').invalid) {
      this.fixedDeposit.get('frequencyOfPayoutPerYear').markAsTouched();
      return
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
        frequencyOfPayoutPerYear: this.fixedDeposit.controls.frequencyOfPayoutPerYear.value,
        maturityDate: this.datePipe.transform(this.maturityDate, 'yyyy-MM-dd'),
        interestPayoutOption: this.fixedDeposit.controls.payOpt.value,
        bankAcNumber: this.fixedDeposit.controls.bankACNo.value,
        fdNumber: this.fixedDeposit.controls.fdNo.value,
        fdType: this.fixedDeposit.controls.FDType.value,
        interestCompoundingId: this.fixedDeposit.controls.compound.value,
        id: this.fixedDeposit.controls.id.value
      };
      console.log('fixedDeposit', obj);
      this.dataSource = obj;
      // this.getdataForm();
      if (this.fixedDeposit.controls.id.value) {
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
  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.fixedDeposit.get('interestRate').setValue(event.target.value);
    }
  }
  addFixedDepositRes(data) {
    console.log('addFixedDepositRes', data);
    this.event.openSnackBar('Added successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data,refreshRequired:true });
  }

  editFixedDepositRes(data) {
    this.event.openSnackBar('Updated successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data,refreshRequired:true });
  }
}
