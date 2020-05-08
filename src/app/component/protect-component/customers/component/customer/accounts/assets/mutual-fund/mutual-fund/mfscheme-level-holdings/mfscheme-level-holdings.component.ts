import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material';
import { ValidatorType } from 'src/app/services/util.service';
import { MfServiceService } from '../../mf-service.service';
import { EventService } from '../../../../../../../../../../Data-service/event.service';
import { CustomerService } from '../../../../../customer.service';
import { UtilService } from '../../../../../../../../../../services/util.service';
import * as moment from 'moment';

@Component({
  selector: 'app-mfscheme-level-holdings',
  templateUrl: './mfscheme-level-holdings.component.html',
  styleUrls: ['./mfscheme-level-holdings.component.scss']
})
export class MFSchemeLevelHoldingsComponent implements OnInit {
  _data: any;
  schemeLevelHoldingForm: any = this.fb.group({
    ownerName: [, [Validators.required]],
    schemeName: [, [Validators.required]],
    folioNumber: [, [Validators.required]],
    sip: [, [Validators.required]],
    tag: [, [Validators.required]],
  });
  ownerData: any;
  ownerName: any;
  selectedFamilyData: any;
  nomineesListFM: any = [];
  transactionTypeList = [];
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  validatorType = ValidatorType

  constructor(
    public subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private eventService: EventService,
    private util: UtilService
  ) { }
  @Input()
  set data(data) {
    this._data = data;
    console.log("this is some data ::::", data);
  }
  get data() {
    return this._data;
  }
  ngOnInit() {
    this.getTransactionTypeData();
    this.transactionListForm.valueChanges.subscribe(res => console.log("this is transactionForm values::::", res));
    console.log(this._data)
  }

  setTransactionType(id, fg) {
    fg.patchValue(id);
  }

  getTransactionTypeData() {
    this.customerService.getTransactionTypeData({})
      .subscribe(res => {
        if (res) {
          console.log("this is transaction Type:::", res);
          this.transactionTypeList = res;
          this.getSchemeLevelHoldings(this.data);
        }
      }, err => {
        this.eventService.openSnackBar(err, "DISMISS");
      })
  }

  getSchemeLevelHoldings(data) {
    if (data == null) {
      data = {};
    }

    this.schemeLevelHoldingForm = this.fb.group({
      ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      schemeName: [data.schemeName, [Validators.required]],
      folioNumber: [data.folioNumber, [Validators.required]],
      sip: [data.sipAmount, [Validators.required]],
      tag: [data.tag, [Validators.required]],
    });
    if (data.mutualFundTransactions.length !== 0 && this.data.flag === 'editTransaction') {
      data.mutualFundTransactions.forEach(element => {
        this.transactionArray.push(this.fb.group({
          transactionType: [element.transactionTypeId, [Validators.required]],
          date: [new Date(element.transactionDate), [Validators.required]],
          transactionAmount: [element.amount, [Validators.required]],
          Units: [element.unit, [Validators.required]],
          id: [element.id]
        }))
      });
    } else {
      this.transactionArray.push(this.fb.group({
        transactionType: [, [Validators.required]],
        date: [, [Validators.required]],
        transactionAmount: [, [Validators.required]],
        Units: [, [Validators.required]],
        id: []
      }))
    }

    this.ownerData = this.schemeLevelHoldingForm.controls;
  }
  transactionListForm = this.fb.group({
    transactionListArray: new FormArray([])
  })
  get transactionList() { return this.transactionListForm.controls };
  get transactionArray() { return this.transactionList.transactionListArray as FormArray };
  addTransactions() {
    this.transactionArray.push(this.fb.group({
      transactionType: [, [Validators.required]],
      date: [, [Validators.required]],
      transactionAmount: [, [Validators.required]],
      Units: [, [Validators.required]],
      id: []
    }))
  }
  removeTransactions(index) {
    (this.transactionArray.length == 1) ? console.log("cannot remove") : this.transactionArray.removeAt(index)
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.selectedFamilyData = value
  }
  getTransactionName(id) {
    return this.transactionTypeList.find(c => c.id === id).transactionType;
  }

  getTransactionEffect(id) {
    return this.transactionTypeList.find(c => c.id === id).effect;
  }

  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  saveMfSchemeLevel() {
    if (this.schemeLevelHoldingForm.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.schemeLevelHoldingForm.get('ownerName').markAsTouched();
      this.schemeLevelHoldingForm.get('schemeName').markAsTouched();
      this.schemeLevelHoldingForm.get('folioNumber').markAsTouched();
      this.schemeLevelHoldingForm.get('sip').markAsTouched();
      this.schemeLevelHoldingForm.get('tag').markAsTouched();
      this.transactionArray.controls.forEach(element => {
        element.get('transactionType').markAsTouched();
        element.get('date').markAsTouched();
        element.get('transactionAmount').markAsTouched();
        element.get('Units').markAsTouched();
      });
    } else {
      let mutualFundTransactions = []
      this.transactionArray.value.forEach(element => {
        console.log("single element", element);

        if (element) {
          let obj1 = {
            investorName: (this.ownerName == null) ? this.schemeLevelHoldingForm.controls.ownerName.value : this.ownerName,
            schemeCode: this.data.schemeCode,
            folioNumber: this.schemeLevelHoldingForm.controls.folioNumber.value,
            mutualFundId: this.data.id,
            sip: this.schemeLevelHoldingForm.controls.sip.value,
            tag: this.schemeLevelHoldingForm.controls.tag.value,
            fwtransactionType: this.getTransactionName(element.transactionType),
            date: this.getDateFormatted(element.date),
            amount: element.transactionAmount,
            unit: element.Units,
            transactionTypeId: element.transactionType,
            effect: this.getTransactionEffect(element.transactionType)
          }
          mutualFundTransactions.push(obj1);
        }
      });
      console.log("this is object for adding transaction post::", mutualFundTransactions);
      let postObj = {
        id: this.data.id,
        mutualFundTransactions
      }

      if (this.data.flag == 'editTransaction') {
        console.log('edit Trnasaction:', postObj);
        this.customerService.postEditTransactionMutualFund(postObj)
          .subscribe(res => {
            if (res) {
              console.log("success::", res);
              this.Close(true)
            } else {
              this.eventService.openSnackBar(res, "DISMISS");
            }
          }, err => {
            this.eventService.openSnackBar(err, "DISMISS");
          })

      } else if (this.data.flag == 'addTransaction') {
        console.log("add transaction", postObj);
        this.customerService.postAddTransactionMutualFund(postObj)
          .subscribe(res => {
            if (res) {
              console.log("success::", res);
              this.Close(true);
            } else {
              this.eventService.openSnackBar(res, "DISMISS");
            }
          }, err => {
            this.eventService.openSnackBar(err, "DISMISS");
          })
      }


    }
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  getDateFormatted(dateObj) {
    if (this.data.flag === 'editTransaction') {
      return String(dateObj.getFullYear()) + "-" + this.util.addZeroBeforeNumber((dateObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(dateObj.getDate(), 2);
    } else if (this.data.flag === 'addTransaction') {
      dateObj = new Date(dateObj.format("YYYY-MM-DDTHH:mm:ssZ"));
      return String(dateObj.getFullYear()) + "-" + this.util.addZeroBeforeNumber((dateObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(dateObj.getDate(), 2);
    }
  }
}
