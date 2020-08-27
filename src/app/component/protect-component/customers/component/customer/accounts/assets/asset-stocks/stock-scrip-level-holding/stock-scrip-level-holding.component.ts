import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {CustomerService} from '../../../../customer.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatDialog} from '@angular/material';
import {AuthService} from 'src/app/auth-service/authService';
import { objectEach } from 'highcharts';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { DatePipe } from '@angular/common';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-stock-scrip-level-holding',
  templateUrl: './stock-scrip-level-holding.component.html',
  styleUrls: ['./stock-scrip-level-holding.component.scss']
})
export class StockScripLevelHoldingComponent implements OnInit {
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
  maxDate= new Date();
  portfolioFieldData: { familyMemberId: any; };
    nomineesListFM: any = [];
  nomineesList: any[] = [];
  optionForm;
  checkValid:boolean= false;
  callMethod: { methodName: string; ParamValue: any; };

  constructor(public dialog: MatDialog, private enumService: EnumServiceService,  private datePipe: DatePipe, private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  set data(data) {
    this.getFormData(data);
  }

 
  getPortfolioData(data) {
    console.log("", data)
    this.portfolioData = data;
    this.scipLevelHoldingForm.get('portfolioName').setValue(data.portfolioName)
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
holdingData:any;
disabledMember(value, type) {
  this.callMethod = {
    methodName : "disabledMember",
    ParamValue : value,
  //  disControl : type
  }

  
  this.holdingData=this.scipLevelHoldingForm.controls;
setTimeout(() => {
  this.portfolioFieldData= {
    familyMemberId: this.scipLevelHoldingForm.value.getCoOwnerName[0].familyMemberId
  }
}, 500);
}

displayControler(con) {
  console.log('value selected', con);
  if(con.owner != null && con.owner){
    this.scipLevelHoldingForm.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.optionForm.controls.getNomineeName = con.nominee;
  }
}

onChangeJointOwnership(data) {
  this.callMethod = {
    methodName : "onChangeJointOwnership",
    ParamValue : data
  }
}

/***owner***/ 

get getCoOwner() {
  return this.scipLevelHoldingForm.get('getCoOwnerName') as FormArray;
}

addNewCoOwner(data) {
  this.getCoOwner.push(this.fb.group({
    name: [data ? data.name : '', [Validators.required]], share: [data ? String(data.share) : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0],isClient: [data ? data.isClient : 0]
  }));
  if (data) {
    setTimeout(() => {
     this.disabledMember(null,null);
    }, 1300);
  }

  if(this.getCoOwner.value.length > 1 && !data){
   let share = 100/this.getCoOwner.value.length;
   for (let e in this.getCoOwner.controls) {
    if(!Number.isInteger(share) && e == "0"){
      this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
    }
    else{
      this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
    }
   }
  }
 
}

removeCoOwner(item) {
  this.getCoOwner.removeAt(item);
  if (this.scipLevelHoldingForm.value.getCoOwnerName.length == 1) {
    this.getCoOwner.controls['0'].get('share').setValue('100');
  } else {
    let share = 100/this.getCoOwner.value.length;
    for (let e in this.getCoOwner.controls) {
      if(!Number.isInteger(share) && e == "0"){
        this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
      }
      else{
        this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
      }
    }
  }
  this.disabledMember(null, null);
}
/***owner***/ 

/***nominee***/ 

get getNominee() {
  return this.optionForm.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
this.disabledMember(null, null);
  this.getNominee.removeAt(item);
  if (this.optionForm.value.getNomineeName.length == 1) {
    this.getNominee.controls['0'].get('sharePercentage').setValue('100');
  } else {
    let share = 100/this.getNominee.value.length;
    for (let e in this.getNominee.controls) {
      if(!Number.isInteger(share) && e == "0"){
        this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
      }
      else{
        this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
      }
    }
  }
}



addNewNominee(data) {
  this.getNominee.push(this.fb.group({
    name: [data ? data.name : ''], sharePercentage: [data ? String(data.sharePercentage) : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0],isClient: [data ? data.isClient : 0]
  }));
  if (!data || this.getNominee.value.length < 1) {
    for (let e in this.getNominee.controls) {
      this.getNominee.controls[e].get('sharePercentage').setValue(0);
    }
  }

  if(this.getNominee.value.length > 1 && !data){
    let share = 100/this.getNominee.value.length;
    for (let e in this.getNominee.controls) {
      if(!Number.isInteger(share) && e == "0"){
        this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
      }
      else{
        this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
      }
    }
   }
   
  
}
/***nominee***/ 
// ===================owner-nominee directive=====================//
  selectedScript:any=[];
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
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: ['', [Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      portfolioName: ['', [Validators.required]]
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

  this.holdingData=this.scipLevelHoldingForm.value

    if (data.transactionOrHoldingSummaryList) {
      data.stockListForEditView.forEach(s => {
        s.transactionOrHoldingSummaryList.forEach(element => {
          let singleScripData = this.fb.group({
            scripName: [element.scripName, [Validators.required]],
            holdings: [element.quantity, [Validators.required]],
            holdingAsOn: [new Date(element.holdingOrTransactionDate), [Validators.required]],
            investedAmt: [element.investedOrTransactionAmount, [Validators.required]],
            scripNameId: [element.transactionTypeOrScripNameId, [Validators.required]],
            // isDeleted:[element.isDeleted],
            id: [s.id]
          })
          this.HoldingArray.push(singleScripData);
        });
      });
    }
    this.familyMemberId = data.familyMemberId;
    

    // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.scipLevelHoldingForm.value.getCoOwnerName.length == 1) {
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
    this.optionForm.get('linkedBankAccount').setValue(data.linkedBankAccount);
    this.optionForm.get('linkedDematAccount').setValue(data.linkedDematAccount);
    this.optionForm.get('description').setValue(data.description);
    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.scipLevelHoldingForm }
    // ==============owner-nominee Data ========================\\
    // this.ownerData = this.scipLevelHoldingForm.controls;
  }
  holdingListForm = this.fb.group({
    holdingListArray: new FormArray([]),
  })
  get HoldingList() { return this.holdingListForm.controls };
  get HoldingArray() { return this.HoldingList.holdingListArray as FormArray };

    addHoldings() {
    let singleForm = this.fb.group({
      scripName: [, [Validators.required]],
      holdings: [, [Validators.required]],
      holdingAsOn: [, [Validators.required]],
      investedAmt: [, [Validators.required]],
      scripNameId: [],

      // isDeleted: [false],
      id: []
    });
    this.HoldingArray.push(singleForm);
  }

  removed:any=[];
  removeHoldings(index) {
    // this.HoldingArray.controls[index].get('isDeleted').setValue(true);
    const reControls = this.HoldingArray.controls[index];
    if(reControls.value.id != null){
      this.removed.push(reControls.value);
    }
    (this.HoldingArray.length == 1) ? console.log("cannot remove") : this.HoldingArray.removeAt(index)
  }

  saveSchemeHolding() {
    // if (this.ownerData == undefined) {
    //   return;
    // }
    if (this.scipLevelHoldingForm.invalid || this.holdingListForm.invalid) {
      this.checkValid = true;
      this.scipLevelHoldingForm.markAllAsTouched();
      // this.scipLevelHoldingForm.get('ownerName').markAsTouched();
      this.HoldingArray.controls.forEach(element => {
        element.get('holdingAsOn').markAsTouched();
        element.get('holdings').markAsTouched();
        element.get('investedAmt').markAsTouched();
        element.get('scripName').markAsTouched();
      })
    }
    else{
      this.barButtonOptions.active = true;

      // if (this.editApiData) {
      //   let finalStocks = []
      //   this.HoldingArray.controls.forEach(element => {
      //     let singleList = {
  
      //       "id": element.get('id').value,
      //       "stockId": this.editApiData.id,
      //       "holdingOrTransaction": 1,
      //       "transactionTypeOrScripNameId": element.get('scripName').value.id,
      //       "quantity": element.get('holdings').value,
      //       "holdingOrTransactionDate": element.get('holdingAsOn').value,
      //       "investedOrTransactionAmount": element.get('investedAmt').value
      //     }
      //     finalStocks.push(singleList);
      //   });
      //   let obj = {
      //     "stockList": [
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
        const finalStocks:any = [];
        this.HoldingArray.controls.forEach((element, i) => {
            let objStock = {
              'id':null,
              "scripNameId": element.value.scripNameId,
              "currentMarketValue": 0,
              "stockType": 2,
              "amountInvested": 0,
              "valueAsOn": null,
              "isDeleted":false,
               "ownerList": this.scipLevelHoldingForm.value.getCoOwnerName,
              "transactionOrHoldingSummaryList": [
                  {
                    "holdingOrTransaction": 1,
                    "quantity": element.get('holdings').value,
                    "transactionTypeOrScripNameId":element.value.scripNameId?element.value.scripNameId:this.scripData.id,
                    "holdingOrTransactionDate": this.datePipe.transform(element.get('holdingAsOn').value, 'yyyy-MM-dd'),
                    "investedOrTransactionAmount": element.get('investedAmt').value,
                    // "isDeleted": element.get('isDeleted').value,
                    'id':element.get('id').value
                  }
              ]

            }
                if(element.get('id').value != null){
                  objStock.id = this.editApiData.stockListForEditView[i].id;
                  objStock.ownerList = this.editApiData.stockListForEditView[i].ownerList;
                }
                if(objStock.id == null){
                  objStock.ownerList[0].id = null;
                }
          
          finalStocks.push(objStock);
        })

        if(this.removed.length > 0){
          this.removed.forEach(d => {
            // for(let element in d.controls){
              let objStock = {
                'id':null,
                "scripNameId": d.scripNameId,
                "currentMarketValue": 0,
                "stockType": 2,
                "amountInvested": 0,
                "valueAsOn": null,
                "isDeleted":true,
                 "ownerList": this.scipLevelHoldingForm.value.getCoOwnerName,
                "transactionOrHoldingSummaryList": [
                  {
                    "id": d.id,
                      "holdingOrTransaction": 2,
                      "quantity": d.holdings,
                      "holdingOrTransactionDate": this.datePipe.transform(d.holdingAsOn, 'yyyy-MM-dd'),
                      "transactionTypeOrScripNameId": d.scripNameId,
                      "investedOrTransactionAmount": d.investedAmt,
                      // 'isDeleted':  d.isDeleted, 
                  }
                ]
  
              }
              if(d.id != null){
                objStock.id = this.editApiData.id;
              }
              finalStocks.push(objStock);
            // }
            // let deleted ={ transactionOrHoldingSummaryList:}
          //   objStock.isDeleted = true;
          //   objStock.transactionOrHoldingSummaryList[0]=Object.assign(objStock.transactionOrHoldingSummaryList[0],deleted.transactionOrHoldingSummaryList)
          //   // objStock.transactionOrHoldingSummaryList[0]= deleted.transactionOrHoldingSummaryList;
          // finalStocks.push(objStock);
            
      });
    }
        const obj =
        {
          "id": this.editApiData?this.editApiData.portfolioId : this.portfolioData.id,
          "clientId": this.clientId,
          "advisorId": this.advisorId,
          "familyMemberId": this.scipLevelHoldingForm.value.getCoOwnerName[0].familyMemberId,
          "ownerList": this.editApiData?this.editApiData.portfolioOwner:this.scipLevelHoldingForm.value.getCoOwnerName,
          "portfolioName": this.scipLevelHoldingForm.value.portfolioName,
          "stockList": finalStocks,
          "nomineeList": this.optionForm.value.getNomineeName,
          "linkedBankAccount": this.optionForm.value.linkedBankAccount,
          "linkedDematAccount": this.optionForm.value.linkedDematAccount,
          "description": this.optionForm.value.description,
        }

        if (this.editApiData) {
          this.cusService.editStockData(obj).subscribe(
            data => {
              console.log(data);
              this.barButtonOptions.active = false;
              this.Close();
            },
            error => {
              this.barButtonOptions.active = false;
              this.eventService.showErrorMessage(error)
            }
          )
        }
        else{
          console.log(obj)
          this.cusService.addAssetStocks(obj).subscribe(
            data => {
              console.log(data);
              this.Close();
              this.barButtonOptions.active = false;
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

  scripDataList:any=[];
  getScriptList(data){
    this.scripDataList = data;
  }

  scripData:any;
  getScript(data, i){
    this.scripData = data;
    this.HoldingArray.controls[i].get('scripNameId').setValue(this.scripData.id);
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }


  bankList = [];
  getBank(){
    if(this.enumService.getBank().length > 0){
      this.bankList = this.enumService.getBank();
    }
    else{
      this.bankList = [];
    }
    console.log(this.bankList,"this.bankList2");
  }

  //link bank
  openDialog(eventData): void {
    const dialogRef = this.dialog.open(LinkBankComponent, {
      width: '50%',
      data:{bankList: this.bankList, userInfo: true} 
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.bankList = this.enumService.getBank();
      }, 5000);
    });

  }

//link bank
}
