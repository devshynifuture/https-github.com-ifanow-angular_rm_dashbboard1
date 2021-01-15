import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { MatDialog } from '@angular/material';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { DatePipe } from '@angular/common';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { ClientDematComponent } from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/client-demat/client-demat.component';
import { MsgDailogComponent } from 'src/app/component/protect-component/common-component/msg-dailog/msg-dailog.component';
import { Subscription } from 'rxjs';
import { AssetValidationService } from '../../asset-validation.service';
import { CustomerOverviewService } from '../../../../customer-overview/customer-overview.service';


@Component({
  selector: 'app-stock-scrip-level-transaction',
  templateUrl: './stock-scrip-level-transaction.component.html',
  styleUrls: ['./stock-scrip-level-transaction.component.scss']
})
export class StockScripLevelTransactionComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  optionForm;
  ownerData: any;
  newPorfolio: any;
  portfolioList: any;
  familyWisePortfolio = [];
  ownerName: any;
  familyMemberId: any;
  oldOwner: any;
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
  Holdings: any;
  oldOwnerFM: number;
  oldOwnerID: number;
  private unSubcripBank: Subscription;
  private unSubcripDemat: Subscription;
  constructor(public dialog: MatDialog, private assetValidation: AssetValidationService, private enumService: EnumServiceService, private fb: FormBuilder, private datePipe: DatePipe, private eventService: EventService, private subInjectService: SubscriptionInject, private cusService: CustomerService,
    private customerOverview: CustomerOverviewService) { }
  @ViewChild('holding', { static: false }) holding;
  @Input() set data(data) {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    console.log(data, ' edit data');
    if (data) {
      data.stockListForEditView.forEach(h => {
        if (h.stockType == 2) {
          h['ownerList'] = data.ownerList;
          h['portfolioOwner'] = data.owerList;
          h['portfolioName'] = data.portfolioName;
          h['nomineeList'] = data.nomineeList;
          h['linkedBankAccount'] = data.linkedBankAccount;
          h['linkedDematAccount'] = data.linkedDematAccount;
          h['description'] = data.description;
          h['stockListForEditView'] = [h];
          this.Holdings = h;
        }
      });
      this.oldOwnerFM = data.ownerList[0].familyMemberId;
      this.oldOwnerID = data.ownerList[0].id;
    }
    this.getFormData(data);
  }
  ngOnInit() {
    this.getTransactionTypeData();
    this.unSubcripBank = this.enumService.getBankAC().subscribe((data: any) => {
      this.bankList = data;
    });

    this.unSubcripDemat = this.enumService.getDenatAC().subscribe((data: any) => {
      this.bankDematList = data;
    });
  }

  ngOnDestroy() {
    this.unSubcripBank.unsubscribe();
    this.unSubcripDemat.unsubscribe();
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

  scriptOwner: any;
  disabledMember(value, type) {
    this.callMethod = {
      methodName: "disabledMember",
      ParamValue: value,
      //  disControl : type
    }
    // this.scipLevelTransactionForm.get('getNomineeName').setValue(this.optionForm.get('getNomineeName').value);

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
      this.oldOwner = data.ownerList;
      this.ownerName = data.ownerName;
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
      linkedBankAccount: [''],
      linkedDematAccount: [''],
      description: ['']
    })

    this.optionForm = this.fb.group({
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })]),
      linkedBankAccount: [''],
      linkedDematAccount: [''],
      description: ['']
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

    if (data.ownerList && data.ownerList.length > 0) {
      this.getCoOwner.removeAt(0);
      data.ownerList.forEach(element => {
        this.addNewCoOwner(element);
      });
    }

    /***owner***/

    /***nominee***/
    if (data.nomineeList) {
      if (data.nomineeList.length > 0) {
        this.getNominee.removeAt(0);
        // this.scipLevelHoldingForm.get('getNomineeName').removeAt(0);
        data.nomineeList.forEach(element => {
          this.addNewNominee(element);
        });
      }
    }
    /***nominee***/
    this.scipLevelTransactionForm.get('linkedBankAccount').setValue(data.linkedBankAccount);
    this.scipLevelTransactionForm.get('linkedDematAccount').setValue(data.linkedDematAccount);
    this.scipLevelTransactionForm.get('description').setValue(data.description);
    // this.scipLevelTransactionForm.get('getNomineeName').setValue(this.optionForm.get('getNomineeName').value);
    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.scipLevelTransactionForm }
    // ==============owner-nominee Data ========================\\
  }
  transactionListForm = this.fb.group({
    transactionListArray: new FormArray([]),
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
  removed: any = [];
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
    this.portfolioData['ownerT'] = this.scipLevelTransactionForm.get('getCoOwnerName').value;
    if (this.editApiData) {
      this.portfolioData['currentPorfolioId'] = this.editApiData.portfolioId;
    }
    if (this.portfolioData) {
      this.scriptOwner = this.portfolioData;
    }
    this.scipLevelTransactionForm.get('portfolioName').setValue(data.portfolioName);
    data.linkedBankAccount != 0 ? this.scipLevelTransactionForm.get('linkedBankAccount').setValue(data.linkedBankAccount) : '';
    data.linkedDematAccount != 0 ? this.scipLevelTransactionForm.get('linkedDematAccount').setValue(data.linkedDematAccount) : '';
    data.description != 0 ? this.scipLevelTransactionForm.get('description').setValue(data.description) : '';
    if (data.nomineeList) {
      if (data.nomineeList.length > 0) {
        this.getNominee.removeAt(0);
        // this.scipLevelHoldingForm.get('getNomineeName').removeAt(0);
        data.nomineeList.forEach(element => {
          this.addNewNominee(element);
        });
      }
    }
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
      this.barButtonOptions.active = true;

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
        // "ownerList": this.scipLevelTransactionForm.value.getCoOwnerName,
        "scripNameId": this.scripData ? this.scripData.id : this.editApiData.scripNameId,
        "scripName": this.scripData ? this.scripData.name : this.editApiData.name,
        // "scripCurrentValue": this.scipLevelTransactionForm.get('scripName').value.currentValue,
        "stockType": 3,
        "id": this.editApiData ? this.editApiData.id : null,
        "portfolioId": this.portfolioData.id,
        "transactionOrHoldingSummaryList": []
      }
      this.transactionArray.controls.forEach(element => {
        let tran = {
          "id": element.get('id').value,
          "holdingOrTransaction": 2,
          "quantity": element.get('quantity').value,
          "holdingOrTransactionDate": this.datePipe.transform(element.get('date').value, 'yyyy-MM-dd'),
          "transactionTypeOrScripNameId": element.get('transactionType').value,
          "investedOrTransactionAmount": element.get('transactionAmount').value,
          'isDeleted': element.get('isDeleted').value,
        }
        transObj.transactionOrHoldingSummaryList.push(tran);

      })
      if (this.removed.length > 0) {
        this.removed.forEach(d => {
          // for(let element in d.controls){

          // }
          let deleted = {
            "id": d.id,
            "holdingOrTransaction": 2,
            "quantity": d.quantity,
            "holdingOrTransactionDate": this.datePipe.transform(d.date, 'yyyy-MM-dd'),
            "transactionTypeOrScripNameId": d.transactionType,
            "investedOrTransactionAmount": d.transactionAmount,
            'isDeleted': d.isDeleted,
          }
          transObj.transactionOrHoldingSummaryList.push(deleted);
          // d.controls.forEach(d => {

          // });
        });
      }
      if (this.editApiData && this.portfolioData.id == 0) {
        // transObj.ownerList[0].id = null;
      }
      finalStocks.push(transObj)
      console.log(finalStocks)
      const obj =
      {
        "id": this.editApiData && this.portfolioData.id != 0 ? this.editApiData.portfolioId : this.portfolioData.id,
        "clientId": this.clientId,
        "advisorId": this.advisorId,
        "familyMemberId": this.scipLevelTransactionForm.value.getCoOwnerName[0].familyMemberId,
        "ownerList": this.editApiData && this.portfolioData.id != 0 ? this.editApiData.portfolioOwner : this.scipLevelTransactionForm.value.getCoOwnerName,
        "portfolioName": this.editApiData ? this.editApiData.portfolioName : this.scipLevelTransactionForm.value.portfolioName,
        "nomineeList": this.scipLevelTransactionForm.value.getNomineeName,
        "linkedBankAccount": this.scipLevelTransactionForm.value.linkedBankAccount,
        "linkedDematAccount": this.scipLevelTransactionForm.value.linkedDematAccount,
        "description": this.scipLevelTransactionForm.value.description,
        "stockList": finalStocks
      }
      if (this.editApiData && this.portfolioData.id == 0) {
        obj.ownerList[0].id = null;
      }
      if (this.portfolioData.id != 0) {
        obj.ownerList[0].id = this.portfolioData.ownerList[0].id;
        obj.ownerList[0].familyMemberId = this.portfolioData.ownerList[0].familyMemberId;

      }

      obj.nomineeList.forEach((element, index) => {
        if (element.name == '') {
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList = this.scipLevelTransactionForm.value.getNomineeName;

      console.log(obj)
      if (this.editApiData) {
        if (obj.id != 0) {
          obj.ownerList[0].id = this.oldOwnerID;
          obj.ownerList[0].familyMemberId = this.oldOwnerFM;
          if (this.holding) {
            this.holding.saveSchemeHolding();
          }
        }
        this.cusService.editStockData(obj).subscribe(
          data => {
            console.log(data);
            this.customerOverview.portFolioData = null;
            this.customerOverview.assetAllocationChart = null;
            if (obj.id == 0) {
              data.stockList[0]['stockListForEditView'] = data.stockList;
              data.stockList[0]['portfolioId'] = data.id;
              data.stockList[0]['ownerList'] = data.ownerList;
              data.stockList[0]['linkedBankAccount'] = data.linkedBankAccount;
              data.stockList[0]['linkedDematAccount'] = data.linkedDematAccount;
              data.stockList[0]['description'] = data.description;
              this.newPorfolio = data;
            }
            else {
              this.Close();
              this.barButtonOptions.active = false;
            }
          },
          error => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error)
          }
        )
      } else {
        this.cusService.addAssetStocks(obj).subscribe(
          data => {
            this.customerOverview.portFolioData = null;
            this.customerOverview.assetAllocationChart = null;
            console.log(data);
            this.assetValidation.addAssetCount({ type: 'Add', value: 'STOCKS' })
            this.barButtonOptions.active = false;
            this.showPresentMsg(data)
            this.Close();
          },
          error => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error)
          }
        )
      }

      // }
    }
  }

  errPresent: any = [];
  showPresentMsg(data) {
    data.stockList.forEach(s => {
      if (s.transactionOrHoldingSummaryList[0].reasonOfError) {
        this.errPresent.push(s.transactionOrHoldingSummaryList[0].reasonOfError);
      }

    });
    if (this.errPresent.length > 0) {
      this.presentDialog();
    }
  }

  presentDialog(): void {
    let dataObj;
    if (this.errPresent.length > 1) {
      dataObj = { head: 'Holdings already present', data: this.errPresent };
    }
    else {
      dataObj = { head: 'Holding already present', data: this.errPresent };
    }
    const dialogRef = this.dialog.open(MsgDailogComponent, {
      data: dataObj
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  scripData: any;
  getScript(data) {
    this.scripData = data;
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  bankDematList: any = [];
  bankList = [];
  getBank() {

  }

  checkOwner() {
    if (this.scipLevelTransactionForm.value.getCoOwnerName[0].name == '') {
      this.eventService.openSnackBar("Please select owner");
    }
    // console.log(this.scipLevelHoldingForm.value.getCoOwnerName[0].name == '', "test owner");

  }

  //link bank
  openDialog(eventData): void {
    let dailogCompo;
    let obj
    if (eventData == 'demat') {
      dailogCompo = ClientDematComponent;
      obj = {
        width: '50%',
        height: '100%',
        data: { bankList: this.bankList, userInfo: true, ownerList: this.getCoOwner }
      };
    }
    else {
      dailogCompo = LinkBankComponent;
      obj = {
        width: '50%',
        data: { bankList: this.bankList, userInfo: true, ownerList: this.getCoOwner }
      };
    }
    const dialogRef = this.dialog.open(dailogCompo, obj);

    dialogRef.afterClosed().subscribe(result => {

    });

  }

  showHide: boolean = false;
  showLess(value) {
    if (value) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }

  //link bank
}
