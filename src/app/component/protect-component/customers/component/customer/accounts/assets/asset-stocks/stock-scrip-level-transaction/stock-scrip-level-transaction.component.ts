import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { MatDialog } from '@angular/material';


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
  maxDate = new Date();
  portfolioFieldData: { familyMemberId: any; };
  nomineesListFM: any = [];
  checkValid: boolean = false;
  transactionTypeList = [];
  callMethod: { methodName: string; ParamValue: any; };
  nomineesList: any[] = [];

  constructor(public dialog: MatDialog, private fb: FormBuilder, private eventService: EventService, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
  @Input() set data(data) {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    this.getFormData(data);
  }
  ngOnInit() {
    this.getTransactionTypeData();
  }

  getTransactionTypeData() {
    this.cusService.getTransactionTypeData({})
      .subscribe(res => {
        if (res) {
          this.transactionTypeList = res;
        } else {
          this.eventService.openSnackBar("No TransactionType Data Found", "Dismiss");
        }
      }, err => {
        this.eventService.openSnackBar(err, "Dismiss");
      })
  }

  // ===================owner-nominee directive=====================//
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }

  lisNominee(value) {
    this.ownerData.Fmember = value;
    this.nomineesListFM = Object.assign([], value);
  }

  disabledMember(value, type) {
    this.callMethod = {
      methodName: "disabledMember",
      ParamValue: value,
      //  disControl : type
    }

    setTimeout(() => {
      this.portfolioFieldData = {
        familyMemberId: this.scipLevelTransactionForm.value.getCoOwnerName[0].familyMemberId
      }
    }, 500);

  }

  displayControler(con) {
    console.log('value selected', con);
    if (con.owner != null && con.owner) {
      this.scipLevelTransactionForm.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.scipLevelTransactionForm.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: "onChangeJointOwnership",
      ParamValue: data
    }
  }

  /***owner***/

  get getCoOwner() {
    return this.scipLevelTransactionForm.get('getCoOwnerName') as FormArray;
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '', [Validators.required]], share: [data ? String(data.share) : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0]
    }));
    if (data) {
      setTimeout(() => {
        this.disabledMember(null, null);
      }, 1300);
    }

    if (this.getCoOwner.value.length > 1 && !data) {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        }
        else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }

  }

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
    if (this.scipLevelTransactionForm.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    } else {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        }
        else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }
    this.disabledMember(null, null);
  }
  /***owner***/

  /***nominee***/

  get getNominee() {
    return this.scipLevelTransactionForm.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.scipLevelTransactionForm.value.getNomineeName.length == 1) {
      this.getNominee.controls['0'].get('sharePercentage').setValue('100');
    } else {
      let share = 100 / this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        }
        else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }
  }



  addNewNominee(data) {
    this.getNominee.push(this.fb.group({
      name: [data ? data.name : ''], sharePercentage: [data ? String(data.sharePercentage) : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0]
    }));
    if (!data || this.getNominee.value.length < 1) {
      for (let e in this.getNominee.controls) {
        this.getNominee.controls[e].get('sharePercentage').setValue(0);
      }
    }

    if (this.getNominee.value.length > 1 && !data) {
      let share = 100 / this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        }
        else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }


  }
  /***nominee***/
  // ===================owner-nominee directive=====================//

  setTransactionType(id, formGroup) {
    formGroup.patchValue(id);
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
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: ['', [Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient: 0
      })]),
      scripName: [data.scripName, [Validators.required]],
      portfolioName: [data.portfolioName, [Validators.required]],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })]),
    })
    if (data.transactionOrHoldingSummaryList) {
      data.transactionOrHoldingSummaryList.forEach(element => {
        this.transactionArray.push(this.fb.group({
          transactionType: [element.transactionTypeOrScripNameId, [Validators.required]],
          date: [new Date(element.holdingOrTransactionDate), [Validators.required]],
          transactionAmount: [element.investedOrTransactionAmount, [Validators.required]],
          quantity: [element.quantity, [Validators.required]],
          isDeleted: [element.isDeleted, [Validators.required]],
          id: [element.id]
        }))
      });
    }
    this.familyMemberId = data.familyMemberId;

    // this.ownerData = this.scipLevelTransactionForm.controls;
    this.scriptForm = { formData: this.scipLevelTransactionForm }

    // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.scipLevelTransactionForm.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    }

    if (data.ownerList) {
      this.getCoOwner.removeAt(0);
      data.ownerList.forEach(element => {
        this.addNewCoOwner(element);
      });
    }

    /***owner***/

    /***nominee***/
    if (data.nomineeList) {
      this.getNominee.removeAt(0);
      data.nomineeList.forEach(element => {
        this.addNewNominee(element);
      });
    }
    /***nominee***/

    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.scipLevelTransactionForm }
    // ==============owner-nominee Data ========================\\
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
      isDeleted: [false],  
      id: []
    }))
  }
  removed:any=[];
  removeTransactions(index) {
    this.transactionArray.controls[index].get('isDeleted').setValue(true);
    const reControls = this.transactionArray.controls[index];
    this.removed.push(reControls.value);
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


  getPortfolioData(data) {
    console.log("", data)
    this.portfolioData = data;
    this.scipLevelTransactionForm.get('portfolioName').setValue(data.portfolioName)
  }
  saveSchemeHolding() {
    if (this.scipLevelTransactionForm.invalid) {
      this.checkValid = true;
      this.scipLevelTransactionForm.markAllAsTouched();
      this.transactionArray.controls.forEach(element => {
        element.get('transactionType').markAsTouched();
        element.get('date').markAsTouched();
        element.get('transactionAmount').markAsTouched();
        element.get('quantity').markAsTouched();
      })
    }
    else {
      // if (this.editApiData) {
      //   let finalStocks = [];
      //   this.transactionArray.controls.forEach(element => {
      //     let singleList =
      //     {
      //       "id": element.get('id').value,
      //       "stockId": this.editApiData.id,
      //       "holdingOrTransaction": 2,
      //       "transactionTypeOrScripNameId": element.get('transactionType').value,
      //       "quantity": element.get('quantity').value,
      //       "holdingOrTransactionDate": element.get('date').value,
      //       "investedOrTransactionAmount": element.get('transactionAmount').value
      //     }
      //     finalStocks.push(singleList);
      //   })
      //   let obj = {
      //     "stocks": [
      //       {
      //         "transactionOrHoldingSummaryList": finalStocks
      //       }
      //     ]
      //   }
      //   this.cusService.editScriplevelHoldingAndTransaction(obj).subscribe(
      //     data => {
      //       console.log(data);
      //       this.Close();
      //     },
      //     error => this.eventService.showErrorMessage(error)
      //   )
      // }
      // else {

        let finalStocks = [];
          let transObj = {
            "valueAsOn": null,
            "currentMarketValue": 0,
            "amountInvested": 0,
            "ownerList": this.scipLevelTransactionForm.value.getCoOwnerName,
            "scripNameId": this.scripData?this.scripData.id:this.editApiData.scripNameId,
            // "scripCurrentValue": this.scipLevelTransactionForm.get('scripName').value.currentValue,
            "stockType": 3,
            "id":this.editApiData?this.editApiData.id:null,
            "transactionOrHoldingSummaryList": []
          }
        this.transactionArray.controls.forEach(element => {
          let tran = {
            "id": element.get('id').value,
            "holdingOrTransaction": 2,
            "quantity": element.get('quantity').value,
            "holdingOrTransactionDate": element.get('date').value,
            "transactionTypeOrScripNameId": element.get('transactionType').value,
            "investedOrTransactionAmount": element.get('transactionAmount').value,
            'isDeleted':  element.get('isDeleted').value,  
          }
          transObj.transactionOrHoldingSummaryList.push(tran);

        })
            if(this.removed.length > 0){
              this.removed.forEach(d => {
                // for(let element in d.controls){
  
                // }
                let deleted = {
                  "id": d.id,
                    "holdingOrTransaction": 2,
                    "quantity": d.quantity,
                    "holdingOrTransactionDate": d.date,
                    "transactionTypeOrScripNameId": d.transactionType,
                    "investedOrTransactionAmount": d.transactionAmount,
                    'isDeleted':  d.isDeleted, 
                }
                transObj.transactionOrHoldingSummaryList.push(deleted);
                // d.controls.forEach(d => {
                  
                // });
              });
            }
        
      finalStocks.push(transObj)
      console.log(finalStocks)
      const obj =
      {
        "id": this.editApiData ? this.editApiData.portfolioId : this.portfolioData.id,
        "clientId": this.clientId,
        "advisorId": this.advisorId,
        "familyMemberId": this.scipLevelTransactionForm.value.getCoOwnerName[0].familyMemberId,
        "ownerList": this.scipLevelTransactionForm.value.getCoOwnerName,
        "portfolioName": this.portfolioData ? this.portfolioData.portfolioName : this.scipLevelTransactionForm.value.portfolioName,
        "stockList": finalStocks
      }
      console.log(obj)
      if (this.editApiData) {
        this.cusService.editStockData(obj).subscribe(
          data => {
            console.log(data);
            this.Close();
          },
          error => this.eventService.showErrorMessage(error)
        )
      } else {
        this.cusService.addAssetStocks(obj).subscribe(
          data => {
            console.log(data);
            this.Close();
          },
          error => this.eventService.showErrorMessage(error)
        )
      }

      // }
    }
  }
  scripData: any;
  getScript(data) {
    this.scripData = data;
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
