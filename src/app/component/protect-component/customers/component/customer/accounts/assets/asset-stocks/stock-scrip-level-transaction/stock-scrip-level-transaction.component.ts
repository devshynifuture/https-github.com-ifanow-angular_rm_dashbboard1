import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { AddScripComponent } from '../add-scrip/add-scrip.component';
import { MatDialog } from '@angular/material';
import { AddPortfolioComponent } from '../add-portfolio/add-portfolio.component';
import { threadId } from 'worker_threads';

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

  constructor(public dialog: MatDialog, private fb: FormBuilder, private eventService: EventService, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
  @Input() set data(data) {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    this.getFormData(data);
    this.getPortfolioList();
    this.getScripList();
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
          quantity: [element.quantity, [Validators.required]]
        }))
      });
    }
    this.ownerData = this.scipLevelTransactionForm.controls;
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
      quantity: [, [Validators.required]]
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
      err => this.eventService.openSnackBar(err)
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
    this.portfolioList.forEach(element => {
      if (element.familyMemberId == value.id) {
        this.familyWisePortfolio.push(element)
      }
    });
    console.log(this.familyWisePortfolio)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  addScrip() {
    const dialogRef = this.dialog.open(AddScripComponent, {
      width: '700px',
      height: '430px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openAddPortfolio() {
    if (this.ownerName == undefined) {
      this.eventService.openSnackBar("please select owner", "dismiss");
      return;
    }
    const dialogData =
    {
      positiveMethod: () => {
        const obj =
        {
          "clientId": this.clientId,
          "advisorId": this.advisorId,
          "portfolioName": this.ownerName,
          "familyMemberId": this.familyMemberId
        }
        this.cusService.addPortfolio(obj).subscribe(
          data => {
            dialogRef.close();
            this.eventService.openSnackBar("portfolio is added", "dismiss");
            this.getPortfolioList();
            this.portfolioList.forEach(element => {
              if (element.id == this.familyMemberId) {
                this.familyWisePortfolio.push(element)
              }
            });
          },
          err => this.eventService.openSnackBar(err, "dismiss")
        )
      },
      name: this.ownerName
    }
    const dialogRef = this.dialog.open(AddPortfolioComponent, {
      width: '390px',
      height: '220px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  getScripList() {
    let obj = {}
    this.cusService.getScripList(obj).subscribe(
      data => this.getScripListRes(data),
      err => this.eventService.openSnackBar(err)
    )
  }
  getScripListRes(data) {
    console.log(data)
    this.scripList = data.scripName;
  }
  saveSchemeHolding() {
    if (this.scipLevelTransactionForm.get('portfolioName').invalid) {
      this.scipLevelTransactionForm.get('portfolioName').markAsTouched();
      return;
    };
    let finalStocks = []
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
      "id": 14,
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
      err => this.eventService.openSnackBar(err, "dismiss")
    )
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
