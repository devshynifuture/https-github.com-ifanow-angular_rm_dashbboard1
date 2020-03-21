import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {AuthService} from 'src/app/auth-service/authService';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {CustomerService} from '../../../../customer.service';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-stock-scrip-level-transaction',
  templateUrl: './stock-scrip-level-transaction.component.html',
  styleUrls: ['./stock-scrip-level-transaction.component.scss']
})
export class StockScripLevelTransactionComponent implements OnInit {
  ownerData: any;
  portfolioList: any;
  familyWisePortfolio = [];
  ownerName: any;
  familyMemberId: any;
  scipLevelTransactionForm: any;
  clientId: any;
  advisorId: any;
  scripList: any;
  editApiData: any;
  ownerInfo: any;
  portfolioData: any;
  scriptForm: any;
  portfolioFieldData: { familyMemberId: any; };
    nomineesListFM: any = [];
  checkValid:boolean = false;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private eventService: EventService, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
  @Input() set data(data) {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    this.getFormData(data);
  }
  ngOnInit() {
  }
  getFormData(data) {
    if (data == undefined) {
      data = {};
      this.addTransactions()
    }
    else {
      this.editApiData = data;
      this.familyMemberId = data.familyMemberId;
      this.ownerName = data.ownerName
    }
    this.scipLevelTransactionForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      scripName: [data.scripName, [Validators.required]],
      portfolioName: [data.portfolioName, [Validators.required]],
    })
    if (data.transactionorHoldingSummaryList) {
      data.transactionorHoldingSummaryList.forEach(element => {
        this.transactionArray.push(this.fb.group({
          transactionType: [String(element.transactionTypeOrScripNameId), [Validators.required]],
          date: [new Date(element.holdingOrTransactionDate), [Validators.required]],
          transactionAmount: [element.investedOrTransactionAmount, [Validators.required]],
          quantity: [element.quantity, [Validators.required]],
          id: [element.id]
        }))
      });
    }
    this.familyMemberId = data.familyMemberId;
    this.portfolioFieldData = {
      familyMemberId: this.familyMemberId
    }
    // this.ownerData = this.scipLevelTransactionForm.controls;
    this.scriptForm = { formData: this.scipLevelTransactionForm }
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
      quantity: [, [Validators.required]],
      id: []
    }))
  }
  removeTransactions(index) {
    (this.transactionArray.length == 1) ? console.log("cannot remove") : this.transactionArray.removeAt(index)
  }
  getPortfolioList() {
    const obj =
    {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.cusService.getPortfolioList(obj).subscribe(
      data => this.getPortfolioListRes(data),
      error => this.eventService.showErrorMessage(error)
    )
  }
  getPortfolioListRes(data) {
    console.log(data)
    this.portfolioList = data
  }
  selectScrip(value) {
    console.log(value)
  }

  display(value) {
    console.log('value selected', value)
    this.ownerInfo = value
    // this.ownerName = value.userName;
    this.scipLevelTransactionForm.get('ownerName').setValue(value.userName)
    this.familyMemberId = value.id
    this.portfolioFieldData = {
      familyMemberId: this.familyMemberId
    }
  }

  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  getPortfolioData(data) {
    console.log("", data)
    this.portfolioData = data;
    this.scipLevelTransactionForm.get('portfolioName').setValue(data.portfolioName)
  }
  saveSchemeHolding() {
    if (this.scipLevelTransactionForm.invalid) {
      this.checkValid = true;
      this.scipLevelTransactionForm.get('scripName').markAsTouched();
      this.scipLevelTransactionForm.get('portfolioName').markAsTouched();
      this.transactionArray.controls.forEach(element => {
        element.get('transactionType').markAsTouched();
        element.get('date').markAsTouched();
        element.get('transactionAmount').markAsTouched();
        element.get('quantity').markAsTouched();
      })
    }
    else{
      if (this.editApiData) {
        let finalStocks = [];
        this.transactionArray.controls.forEach(element => {
          let singleList =
          {
            "id": element.get('id').value,
            "stockId": this.editApiData.id,
            "holdingOrTransaction": 2,
            "transactionTypeOrScripNameId": element.get('transactionType').value,
            "quantity": element.get('quantity').value,
            "holdingOrTransactionDate": element.get('date').value,
            "investedOrTransactionAmount": element.get('transactionAmount').value
          }
          finalStocks.push(singleList);
        })
        let obj = {
          "stocks": [
            {
              "transactionorHoldingSummaryList": finalStocks
            }
          ]
        }
        this.cusService.editScriplevelHoldingAndTransaction(obj).subscribe(
          data => {
            console.log(data);
            this.Close();
          },
          error => this.eventService.showErrorMessage(error)
        )
      }
      else {
        let finalStocks = [];
        this.transactionArray.controls.forEach(element => {
          let obj = {
            "scripNameId": this.scipLevelTransactionForm.get('scripName').value.id,
            "scripCurrentValue": this.scipLevelTransactionForm.get('scripName').value.currentValue,
            "stockType": 3,
            "transactionorHoldingSummaryList": [
              {
                "holdingOrTransaction": 2,
                "quantity": element.get('quantity').value,
                "holdingOrTransactionDate": element.get('date').value,
                "transactionTypeOrScripNameId": element.get('transactionType').value,
                "investedOrTransactionAmount": element.get('transactionAmount').value
              }
            ]
          }
          finalStocks.push(obj)
        })
        console.log(finalStocks)
        const obj =
        {
          "id": this.scipLevelTransactionForm.get('portfolioName').value.id,
          "clientId": this.clientId,
          "advisorId": this.advisorId,
          "familyMemberId": this.familyMemberId,
          "ownerName": this.ownerName,
          "portfolioName": this.scipLevelTransactionForm.get('portfolioName').value.portfolioName,
          "stocks": finalStocks
        }
        console.log(obj)
        this.cusService.addAssetStocks(obj).subscribe(
          data => {
            console.log(data);
            this.Close();
          },
          error => this.eventService.showErrorMessage(error)
        )
      }
    }
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
