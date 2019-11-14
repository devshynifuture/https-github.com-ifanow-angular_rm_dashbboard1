import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { SatCalendarHeader } from 'saturn-datepicker';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';


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
  ]
  ownerData: any;
  tenure: any;
  getDate: string;
  ownerName: any;
  maturityDate: any;
  selectedFamilyData: any;
  showFreqPayOpt = false;
  constructor(private router: Router,private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    console.log('data', this.inputData)
    let obj = {
      clientId: 2980
    }
    this.advisorId = AuthService.getAdvisorId();
    this.fdMonths = ['0',	'1',	'2',	'3',	'4',	'5',	'6',	'7',	'8',	'9',	'10',	'11',	'12',	'13',	'14',	'15',	'16',	'17',	'18',	'19',	'20',	'21',	'22',	'23',	'24',	'25',	'26',	'27',	'28',	'29',	'30',	'31',	'32',	'33',	'34',	'35',	'36',	'37',	'38',	'39',	'40',	'41',	'42',	'43',	'44',	'45',	'46',	'47',	'48',	'49',	'50',	'51',	'52',	'53',	'54',	'55',	'56',	'57',	'58',	'59',	'60',	'61',	'62',	'63',	'64',	'65',	'66',	'67',	'68',	'69',	'70',	'71',	'72',	'73',	'74',	'75',	'76',	'77',	'78',	'79',	'80',	'81',	'82',	'83',	'84',	'85',	'86',	'87',	'88',	'89',	'90',	'91',	'92',	'93',	'94',	'95',	'96',	'97',	'98',	'99',	'100',	'101',	'102',	'103',	'104',	'105',	'106',	'107',	'108',	'109',	'110',	'111',	'112',	'113',	'114',	'115',	'116',	'117',	'118',	'119',	'120']
    this.fdDays = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
    this.fdYears = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
  }
  getOwnerListRes(data) {
    console.log('familymember', data)
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' })
  }
  display(value){
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.selectedFamilyData = value
  }
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }
  intrestPayout(value){
    if(value == 2){
      this.showFreqPayOpt = true
    }
  }
  haveMaturity(maturity) {
    if (maturity == true) {
      this.showTenure = false;
    } else {
      this.showTenure = true;
    }
  }
  getDateYMD(){
    this.tenure = this.fixedDeposit.controls.commencementDate.value.add(this.fixedDeposit.controls.tenureM.value, 'months');
    this.tenure = this.fixedDeposit.controls.commencementDate.value.add(this.fixedDeposit.controls.tenureY.value, 'years');
    this.tenure = this.fixedDeposit.controls.commencementDate.value.add(this.fixedDeposit.controls.tenureD.value, 'days');
    this.getDate = this.datePipe.transform(this.tenure , 'yyyy-MM-dd')
    return this.getDate;
  }
  getdataForm(data) {
    if(data == undefined){
      data = {}
    }
    if (this.dataSource != undefined) {
      var data = this.dataSource
    }
    this.fixedDeposit = this.fb.group({
      ownerName: [(data == undefined) ? '' : this.ownerName, [Validators.required]],
      amountInvest: [(data == undefined) ? '' : data.amountInvested, [Validators.required]],
      commencementDate: [(data == undefined) ? '' : new Date(data.commencementDate), [Validators.required]],
      interestRate: [(data == undefined) ? '' : data.interestRate, [Validators.required]],
      maturity:[(data == undefined) ? '' : data.maturity, [Validators.required]],
      compound: [(data == undefined)?'':(data.interestCompoundingId)+"", [Validators.required]],
      institution: [(data == undefined) ? '' : data.institutionName, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      tenureY: [(data == undefined) ? '' : data.tenureY, [Validators.required]],
      tenureM: [(data == undefined) ? '' : data.tenureM, [Validators.required]],
      tenureD: [(data == undefined) ? '' : data.tenureD, [Validators.required]],
      frequencyOfPayoutPerYear: [(data == undefined) ? '' : data.frequencyOfPayoutPerYear, [Validators.required]],
      maturityDate: [(data == undefined) ? '' : new Date(data.maturityDate), [Validators.required]],
      payOpt: [(data == undefined) ? '' : (data.interestPayoutOption)+"" ,[Validators.required]],
      bankACNo: [(data == undefined) ? '' : data.bankAcNumber, [Validators.required]],
      ownerType: [(data == undefined) ? '' : (data.ownershipType)+"", [Validators.required]],
      fdNo: [(data == undefined) ? '' : data.fdNumber, [Validators.required]],
      FDType: [(data == undefined) ? '' : (data.fdType)+"", [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]]
    });
    this.getFormControl().ownerName.maxLength = 40;
    this.getFormControl().description.maxLength = 60;
    this.getFormControl().fdNo.maxLength = 10;
    this.getFormControl().bankACNo.maxLength = 15;
    this.ownerData = this.fixedDeposit.controls;
    this.fixedDeposit.controls.maturityDate.setValue(new Date(data.maturityDate));
  }
  getFormControl(): any {
    return this.fixedDeposit.controls;
  }
  saveFixedDeposit() {
    if(this.fixedDeposit.controls.maturityDate.invalid == true){
      this.tenure = this.getDateYMD()
      this.maturityDate = this.tenure
    }else{
      this.maturityDate = this.fixedDeposit.controls.maturityDate.value
    }
  
   if (this.fixedDeposit.controls.amountInvest.invalid) {
      this.isAmountInvest = true;
      return;
    } else if (this.fixedDeposit.controls.ownerType.invalid) {
      this.isOwnerType = true;
      return;
    } else if (this.fixedDeposit.controls.commencementDate.invalid) {
      this.isCommencementDate = true;
      return;
    } else if (this.fixedDeposit.controls.interestRate.invalid) {
      this.isInterestRate = true;
      return;
    } else if (this.fixedDeposit.controls.compound.invalid) {
      this.isCompound = true;
      return;
    } else if (this.fixedDeposit.controls.payOpt.invalid) {
      this.isPayOpt = true;
      return;
    } else if (this.fixedDeposit.controls.FDType.invalid) {
      this.isFDType = true;
      return;
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: 2978,
        familyMemberId: this.selectedFamilyData.id,
        ownerName: this.ownerName,
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
        id:this.fixedDeposit.controls.id.value
      }
      console.log('fixedDeposit', obj)
      this.dataSource = obj
      //this.getdataForm();
      if (this.fixedDeposit.controls.id.value == undefined) {
        this.custumService.addFixedDeposit(obj).subscribe(
          data => this.addFixedDepositRes(data)
        );
      } else {
        //edit call
        this.custumService.editFixedDeposit(obj).subscribe(
          data => this.editFixedDepositRes(data)
        );
      }

    }
  }
  addFixedDepositRes(data) {
    console.log('addFixedDepositRes', data)
    this.subInjectService.changeNewRightSliderState({ state: 'close', data })
  }
  editFixedDepositRes(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', data })
  }
}
