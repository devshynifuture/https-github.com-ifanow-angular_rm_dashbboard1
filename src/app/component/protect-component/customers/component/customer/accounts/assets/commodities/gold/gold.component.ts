import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-gold',
  templateUrl: './gold.component.html',
  styleUrls: ['./gold.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class GoldComponent implements OnInit {
  inputData: any;
  familyMemberId: any;
  ownerName: any;
  gold: any;
  ownerData: any;
  iAppPurValue = false;
  isTotalsGrams = false
  isBalanceAsOn = false
  isNoTolasGramsPur = false
  isPurchaseYear = false
  isCarats = false
  showHide = false;
  advisorId: any;
  fdYears: string[];
  clientId: any;

  constructor(private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe) { }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId();
    this.fdYears = [
      '1950',	'1951',	'1952',	'1953',	'1954',	'1955',	'1956',	'1957',	'1958',	'1959',	'1960',	'1961',	'1962',	'1963',	'1964',	'1965',	'1966',	'1967',	'1968',	'1969',	'1970',	'1971',	'1972',	'1973',	'1974',	'1975',	'1976',	'1977',	'1978',	'1979',	'1980',	'1981',	'1982',	'1983',	'1984',	'1985',	'1986',	'1987',	'1988',	'1989',	'1990',	'1991',	'1992',	'1993',	'1994',	'1995',	'1996',	'1997',	'1998',	'1999',	'2000',	'2001',	'2002',	'2003',	'2004',	'2005',	'2006',	'2007',	'2008',	'2009',	'2010',	'2011',	'2012',	'2013',	'2014',	'2015',	'2016',	'2017',	'2018',	'2019']
  }

  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' })
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
    this.gold = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      appPurValue: [(data == undefined) ? '' : (data.approximatePurchaseValue) + "", [Validators.required]],
      totalsGrams: [(data == undefined) ? '' : (data.gramsOrTola) + "", [Validators.required]],
      noTolasGramsPur: [(data == undefined) ? '' : (data.purchasedGramsOrTola), [Validators.required]],
      tenure: [(data == undefined) ? '' : (data.purchaseYear), [Validators.required]],
      carats: [(data == undefined) ? '' : data.carat, [Validators.required]],
      balanceAsOn:[(data == undefined) ? '' : new Date(data.balanceAsOn), [Validators.required]],
      marketValue: [(data == undefined) ? '' : data.marketValue, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      bankAcNo: [(data == undefined) ? '' : data.bankAcNo, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.gold.controls;
    this.familyMemberId = this.gold.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]
  }
  getFormControl(): any {
    return this.gold.controls;
  }
  saveGold() {
    if (this.gold.controls.totalsGrams.invalid) {
      this.isTotalsGrams = true;
      return;
    } else if (this.gold.controls.appPurValue.invalid) {
      this.iAppPurValue = true;
      return;
    } else if (this.gold.controls.noTolasGramsPur.invalid) {
      this.isNoTolasGramsPur = true;
      return;
    } else if (this.gold.controls.tenure.invalid) {
      this.isPurchaseYear = true;
      return;
    } else if (this.gold.controls.balanceAsOn.invalid) {
      this.isBalanceAsOn = true;
      return;
    } else if (this.gold.controls.carats.invalid) {
      this.isCarats = true;
      return;
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined) ? this.gold.controls.ownerName.value : this.ownerName,
        approximatePurchaseValue: this.gold.controls.appPurValue.value,
        gramsOrTola: this.gold.controls.totalsGrams.value,
        purchasedGramsOrTola: this.gold.controls.noTolasGramsPur.value,
        totalsGrams: this.gold.controls.totalsGrams.value,
        purchaseYear: this.gold.controls.tenure.value,
        carat: this.gold.controls.carats.value,
        marketValue: this.gold.controls.marketValue.value,
        description: this.gold.controls.description.value,
        id: this.gold.controls.id.value
      }
      if (this.gold.controls.id.value == undefined) {
        this.custumService.addGold(obj).subscribe(
          data => this.addGoldRes(data)
        );
      } else {
        //edit call
        this.custumService.editGold(obj).subscribe(
          data => this.editGoldRes(data)
        );
      }
    }
  }
  addGoldRes(data) {
    console.log('addrecuringDepositRes', data)
    this.subInjectService.changeNewRightSliderState({flag:'addedGold', state: 'close', data })
  }
  editGoldRes(data) {
    this.subInjectService.changeNewRightSliderState({flag:'addedGold', state: 'close', data })
  }

}
