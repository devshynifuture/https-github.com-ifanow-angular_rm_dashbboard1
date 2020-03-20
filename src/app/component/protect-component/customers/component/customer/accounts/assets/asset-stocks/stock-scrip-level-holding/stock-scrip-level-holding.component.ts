import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {CustomerService} from '../../../../customer.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatDialog} from '@angular/material';
import {AuthService} from 'src/app/auth-service/authService';

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
  editApiData: any;
  ownerInfo: any;
  portfolioData: any;
  scripForm: any;
  portfolioFieldData: { familyMemberId: any; };
    nomineesListFM: any = [];
  checkValid:boolean= false;
  constructor(public dialog: MatDialog, private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  set data(data) {
    this.getFormData(data);
  }

  display(value) {
    // this.ownerInfo = value.userName
    console.log('value selected', value)
    // this.ownerName = value.userName;
    this.scipLevelHoldingForm.get('ownerName').setValue(value.userName)
    this.familyMemberId = value.id;
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
    this.scipLevelHoldingForm.get('portfolioName').setValue(data.portfolioName)
  }

  getFormData(data) {
    if (data == null) {
      data = {};
      this.addHoldings();
      // this.ownerName = '';
    }
    else {
      this.editApiData = data;
      this.familyMemberId = data.familyMemberId;
      this.ownerName = data.ownerName;
      // this.scipLevelHoldingForm.get('ownerName').setValue(this.ownerName)
    }
    this.scipLevelHoldingForm = this.fb.group({
      ownerName: [this.ownerName, [Validators.required]],
      portfolioName: [data.portfolioName, [Validators.required]]
    })
    if (data.transactionorHoldingSummaryList) {
      data.transactionorHoldingSummaryList.forEach(element => {
        let singleScripData = this.fb.group({
          scripName: [data.scripName, [Validators.required]],
          holdings: [element.quantity, [Validators.required]],
          holdingAsOn: [new Date(element.holdingOrTransactionDate), [Validators.required]],
          investedAmt: [element.investedOrTransactionAmount, [Validators.required]],
          id: [element.id]
        })

        
        this.HoldingArray.push(singleScripData);
      });
    }
    this.familyMemberId = data.familyMemberId;
    this.portfolioFieldData= {
      familyMemberId: this.familyMemberId
    }
    // this.ownerData = this.scipLevelHoldingForm.controls;
  }
  holdingListForm = this.fb.group({
    holdingListArray: new FormArray([])
  })
  get HoldingList() { return this.holdingListForm.controls };
  get HoldingArray() { return this.HoldingList.holdingListArray as FormArray };

    addHoldings() {
    let singleForm = this.fb.group({
      scripName: [, [Validators.required]],
      holdings: [, [Validators.required]],
      holdingAsOn: [, [Validators.required]],
      investedAmt: [, [Validators.required]],
      id: []
    });
    this.HoldingArray.push(singleForm);
  }
  removeHoldings(index) {
    (this.HoldingArray.length == 1) ? console.log("cannot remove") : this.HoldingArray.removeAt(index)
  }

  saveSchemeHolding() {
    // if (this.ownerData == undefined) {
    //   return;
    // }
    if (this.scipLevelHoldingForm.invalid || this.HoldingArray.invalid) {
      this.checkValid = true;
      this.scipLevelHoldingForm.get('portfolioName').markAsTouched();
      this.scipLevelHoldingForm.get('ownerName').markAsTouched();
      this.HoldingArray.controls.forEach(element => {
        element.get('holdingAsOn').markAsTouched();
        element.get('holdings').markAsTouched();
        element.get('investedAmt').markAsTouched();
        element.get('scripName').markAsTouched();
      })
    }
    else{
      if (this.editApiData) {
        let finalStocks = []
        this.HoldingArray.controls.forEach(element => {
          let singleList = {
  
            "id": element.get('id').value,
            "stockId": this.editApiData.id,
            "holdingOrTransaction": 1,
            "transactionTypeOrScripNameId": element.get('scripName').value.id,
            "quantity": element.get('holdings').value,
            "holdingOrTransactionDate": element.get('holdingAsOn').value,
            "investedOrTransactionAmount": element.get('investedAmt').value
          }
          finalStocks.push(singleList);
        });
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
          "id": this.portfolioData.id,
          "clientId": this.clientId,
          "advisorId": this.advisorId,
          "familyMemberId": this.familyMemberId,
          "ownerName": this.ownerName,
          "portfolioName": this.portfolioData.portfolioName,
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
