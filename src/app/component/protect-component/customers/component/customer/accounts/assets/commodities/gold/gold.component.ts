import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

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
  validatorType = ValidatorType
  maxDate = new Date();
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
  nomineesListFM: any;
  flag: any;
  currentYear: any = new Date().getFullYear();
  adviceFlagShowHeaderFooter: boolean = true;

  constructor(private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }

  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Gold';
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;


  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceFlagShowHeaderFooter = false;
    } else {
      this.adviceFlagShowHeaderFooter = true;
    }
    console.log('this is flag::::::', this.data)
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId();
    this.getdataForm(this.data);
    this.fdYears = [
      '1950', '1951', '1952', '1953', '1954', '1955', '1956', '1957', '1958', '1959', '1960', '1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
  }

  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  Close(flag) {

    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag, sagar: false })
  }
  saveInternal(flag) {

    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag, sagar: false })
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
      data = {};
      this.flag = "addGOLD";
    }
    else {
      // (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice:this.editGoldRes
      this.flag = "editGOLD";
    }
    this.gold = this.fb.group({
      ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      appPurValue: [data.approximatePurchaseValue, [Validators.required]],
      totalsGrams: [(data.gramsOrTola == undefined) ? '' : (data.gramsOrTola) + "", [Validators.required]],
      noTolasGramsPur: [(data.purchasedGramsOrTola == undefined) ? '' : (data.purchasedGramsOrTola), [Validators.required]],
      tenure: [(data.purchaseYear == undefined) ? '' : (data.purchaseYear), [Validators.required, Validators.minLength(4), Validators.min(1900), Validators.max(this.currentYear)]],
      carats: [(data.carat == undefined) ? '' : (data.carat) + "", [Validators.required]],
      // balanceAsOn: [(data.balanceAsOn == undefined) ? '' : new Date(data.balanceAsOn), [Validators.required]],
      marketValue: [(data.marketValue == undefined) ? '' : data.marketValue],
      description: [(data.description == undefined) ? '' : data.description],
      bankAcNo: [(data.bankAcNo == undefined) ? '' : data.bankAcNo],
      id: [(data.id == undefined) ? '' : data.id],
      familyMemberId: [(data.familyMemberId == undefined) ? '' : data.familyMemberId]
    });
    this.ownerData = this.gold.controls;
    this.familyMemberId = this.gold.value.familyMemberId

  }
  getFormControl(): any {
    return this.gold.controls;
  }

  // validateYear(){
  //   if(parseInt(this.gold.get('tenure').value) > new Date().getFullYear() && parseInt(this.gold.get('tenure').value) < 1900){

  //   }
  //   console.log(parseInt(this.gold.get('tenure').value), new Date().getFullYear(),"new Date().getFullYear");
  // }
  saveGold() {
    if (this.gold.invalid) {
      this.gold.markAllAsTouched();
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined) ? this.gold.controls.ownerName.value : this.ownerName,
        approximatePurchaseValue: this.gold.controls.appPurValue.value,
        gramsOrTola: this.gold.controls.totalsGrams.value,
        // balanceAsOn: this.gold.controls.balanceAsOn.value,
        purchasedGramsOrTola: this.gold.controls.noTolasGramsPur.value,
        totalsGrams: this.gold.controls.totalsGrams.value,
        purchaseYear: this.gold.controls.tenure.value,
        carat: this.gold.controls.carats.value,
        marketValue: this.gold.controls.marketValue.value,
        description: this.gold.controls.description.value,
        id: this.gold.controls.id.value
      }
      let adviceObj = {
        advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.flag == "addGOLD") {
        this.custumService.addGold(obj).subscribe(
          data => this.addGoldRes(data), (error) => {
            this.eventService.showErrorMessage(error);
          }
        );
      } else if (this.flag == 'adviceGOLD') {
        this.custumService.getAdviceGold(adviceObj).subscribe(
          data => this.getAdviceGoldRes(data), (error) => {
            this.eventService.showErrorMessage(error);
          }
        );
      } else {
        //edit call
        this.custumService.editGold(obj).subscribe(
          data => this.editGoldRes(data), (error) => {
            this.eventService.showErrorMessage(error);
          }
        );
      }
    }
  }
  getAdviceGoldRes(data) {
    this.eventService.openSnackBar('Gold added successfully', 'OK');
    this.subInjectService.changeNewRightSliderState({ flag: 'addedGold', state: 'close', data, refreshRequired: true })
  }
  addGoldRes(data) {
    console.log('addrecuringDepositRes', data)
    this.subInjectService.changeNewRightSliderState({ flag: 'addedGold', state: 'close', data, refreshRequired: true })
    this.eventService.openSnackBar('Added successfully!', 'OK');

  }
  editGoldRes(data) {
    this.subInjectService.changeNewRightSliderState({ flag: 'addedGold', state: 'close', data, refreshRequired: true })
    this.eventService.openSnackBar('Updated successfully!', 'OK');

  }

}
