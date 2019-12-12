import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AddPortfolioComponent } from '../add-portfolio/add-portfolio.component';
import { MatDialog } from '@angular/material';
import { AddScripComponent } from '../add-scrip/add-scrip.component';
import { element } from 'protractor';

@Component({
  selector: 'app-stock-scrip-level-holding',
  templateUrl: './stock-scrip-level-holding.component.html',
  styleUrls: ['./stock-scrip-level-holding.component.scss']
})
export class StockScripLevelHoldingComponent implements OnInit {
  scipLevelHoldingForm: any;
  ownerData: any;
  advisorId: any;
  clientId: any;
  portfolioList: any;
  scripList: any;
  ownerName: any;
  familyMemberId: any;
  familyWisePortfolio = [];

  constructor(public dialog: MatDialog, private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }

  ngOnInit() {
  }
  set data(data) {
    this.getFormData(data);
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getPortfolioList();
    this.getScripList();
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
  getScripList() {
    let obj = {}
    this.cusService.getScripList(obj).subscribe(
      data => this.getScripListRes(data),
      err => this.eventService.openSnackBar(err)
    )
  }
  display(value) {
    console.log('value selected', value)
    this.portfolioList.forEach(element => {
      if (element.id == value.id) {
        this.familyWisePortfolio.push(element)
      }
    });
    this.ownerName = value.userName;
    this.familyMemberId = value.id
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
  getScripListRes(data) {
    console.log(data)
    this.scripList = data.scripName;
  }
  getFormData(data) {
    if (data == null) {
      data = {};
      this.addHoldings();
    }
    this.scipLevelHoldingForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      portfolioName: [data.portfolioName, [Validators.required]]
    })
    if (data.transactionorHoldingSummaryList) {
      data.transactionorHoldingSummaryList.forEach(element => {
        this.HoldingArray.push(this.fb.group({
          scripName: [data.scripName, [Validators.required]],
          holdings: [element.quantity, [Validators.required]],
          holdingAsOn: [new Date(element.holdingOrTransactionDate), [Validators.required]],
          investedAmt: [element.investedOrTransactionAmount, [Validators.required]]
        }))
      });
    }
    this.ownerData = this.scipLevelHoldingForm.controls;
  }
  holdingListForm = this.fb.group({
    holdingListArray: new FormArray([])
  })
  get HoldingList() { return this.holdingListForm.controls };
  get HoldingArray() { return this.HoldingList.holdingListArray as FormArray };

  addHoldings() {
    this.HoldingArray.push(this.fb.group({
      scripName: [, [Validators.required]],
      holdings: [, [Validators.required]],
      holdingAsOn: [, [Validators.required]],
      investedAmt: [, [Validators.required]]
    }))
  }
  removeHoldings(index) {
    (this.HoldingArray.length == 1) ? console.log("cannot remove") : this.HoldingArray.removeAt(index)
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
  saveSchemeHolding() {
    if (this.scipLevelHoldingForm.get('portfolioName').invalid) {
      this.scipLevelHoldingForm.get('portfolioName').markAsTouched();
      return;
    };
    let finalStocks = []
    this.HoldingArray.controls.forEach(element => {
      let obj = {
        "scripNameId": element.get('scripName').value.id,
        "scripCurrentValue": element.get('scripName').value.currentValue,
        "stockType": 2,
        "transactionorHoldingSummaryList": [
          {
            "holdingOrTransaction": 1,
            "quantity": element.get('holdings').value,
            "holdingOrTransactionDate": element.get('holdingAsOn').value,
            "investedOrTransactionAmount": element.get('investedAmt').value
          }
        ]
      }
      finalStocks.push(obj)
    })

    const obj =
    {
      "id": this.scipLevelHoldingForm.get('portfolioName').value.id,
      "clientId": this.clientId,
      "advisorId": this.advisorId,
      "familyMemberId": this.familyMemberId,
      "ownerName": this.ownerName,
      "portfolioName": this.scipLevelHoldingForm.get('portfolioName').value.portfolioName,
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
