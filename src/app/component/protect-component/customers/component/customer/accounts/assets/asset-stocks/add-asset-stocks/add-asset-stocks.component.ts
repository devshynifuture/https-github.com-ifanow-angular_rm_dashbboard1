import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { DatePipe } from '@angular/common';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-add-asset-stocks',
  templateUrl: './add-asset-stocks.component.html',
  styleUrls: ['./add-asset-stocks.component.scss']
})
export class AddAssetStocksComponent implements OnInit {
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
  assetForm: any;
  ownerData: any;
  advisorId: any;
  clientId: any;
  ownerName: any;
  familyMemberId: any;
  editApiData: any;
  nomineesListFM: any = [];
  nomineesList: any[] = [];
  maxDate = new Date();
  checkValid: boolean = false;
  adviceShowHeaderFooter: boolean = true;
  callMethod: { methodName: string; ParamValue: any; };

  constructor(private subInjectService: SubscriptionInject,private enumService: EnumServiceService, public dialog: MatDialog, private datePipe: DatePipe, private fb: FormBuilder, private cusService: CustomerService, private eventService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this. getPortfolioList();
  }

  getPortfolioList() {
    const obj =
    {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.cusService.getPortfolioDataList(obj).subscribe(
      data => this.getPortfolioListRes(data),
      error => this.eventService.showErrorMessage(error)
    )
  }

  portfolioList:any=[];
  familyMemberPortfolio:any = [];
  getPortfolioListRes(data) {
    console.log(data, "porfolio list")
    // let checkOwnerId = true;
    this.portfolioList = data;
    // this.portfolioForm.get('portfolioName').setValue(this.portfolioName.value);
    
    // (checkOwnerId) ? this.familyMemberPortfolio : this.familyMemberPortfolio = [];
    console.log(this.familyMemberPortfolio)
  }

  selectedOwner(femilyId){
    this.familyMemberPortfolio = [];
    this.portfolioList.forEach(element => {
      if (element.ownerList[0].familyMemberId == femilyId) {
        // checkOwnerId = true;
        this.familyMemberPortfolio.push(element)
      }
    });
    
  }
 editMood:boolean = false;
  // setForm(formData){
  //   this.editApiData = formData;
  //   this.editApiData['portfolioId'] = formData.id;
  //   if(formData.stockList.length > 0){
  //     this.editMood = true;
  //     this.assetForm.get('valueAsOn').setValue(new Date(formData.stockList[0].valueAsOn));
  //     this.assetForm.get('currentMarketValue').setValue(formData.stockList[0].currentMarketValue);
  //     this.assetForm.get('amtInvested').setValue(formData.stockList[0].amountInvested);
  //     this.editApiData.id = formData.stockList[0].id;
  //   }
  //   else{
  //     this.editMood = false;
  //     this.editApiData.id = 0;
  //   }
  //   // this.assetForm.get('valueAsOn').setValue(formData);
  //   this.editApiData['portfolioOwner'] = formData.ownerList;
  // }
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
    methodName : "disabledMember",
    ParamValue : value,
  //  disControl : type
  }
}

displayControler(con) {
  console.log('value selected', con);
  if(con.owner != null && con.owner){
    this.assetForm.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.assetForm.controls.getNomineeName = con.nominee;
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
  return this.assetForm.get('getCoOwnerName') as FormArray;
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
  if (this.assetForm.value.getCoOwnerName.length == 1) {
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
  return this.assetForm.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
this.disabledMember(null, null);
  this.getNominee.removeAt(item);
  if (this.assetForm.value.getNomineeName.length == 1) {
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

  @Input() set data(data) {
    if (data == null) {
      data = {}
    }
    else {
      this.editApiData = data;
      this.ownerName = data.ownerName;
      this.editMood = true;
    }
    this.assetForm = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: ['', [Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      currentMarketValue: [!data? '' : data.currentMarketValue, [Validators.required]],
      valueAsOn: [!data ? '' : new Date(data.valueAsOn), [Validators.required]],
      amtInvested: [!data ? '' : data.amountInvested, [Validators.required]],
      portfolioName: [data.portfolioName, [Validators.required]],
      linkedBankAccount: [!data ? '' :data.linkedBankAccount],
      linkedDematAccount: [!data ? '' :data.linkedDematAccount],
      description: [!data ? '' :data.description],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })]),
    })
    this.familyMemberId = data.familyMemberId;
    // this.ownerData = this.assetForm.controls;
    console.log(this.assetForm)

     // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.assetForm.value.getCoOwnerName.length == 1) {
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
      this.getNominee.removeAt(0);
      data.nomineeList.forEach(element => {
        this.addNewNominee(element);
      });
    }
    /***nominee***/

    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.assetForm }
    // ==============owner-nominee Data ========================\\
  }
  
  preventDefault(e) {
    e.preventDefault();
  }
  submitStockData() {

    // case (this.assetForm.get('ownerName').invalid):
    //   this.assetForm.get('ownerName').markAsTouched();
    //   break;
    if (this.assetForm.invalid) {
      this.checkValid = true;
      this.assetForm.markAllAsTouched();
    }
    else {
      this.barButtonOptions.active = true;
      if (this.editApiData) {
        let obj =
        {
          "familyMemberId": this.familyMemberId,
          // "ownerName": this.editApiData.portfolioOwner,
          "portfolioName": this.assetForm.get('portfolioName').value,
          "id": this.editApiData.portfolioId,
          "ownerList": this.editApiData.portfolioOwner,
          "nomineeList": this.assetForm.value.getNomineeName,
          "linkedBankAccount": this.assetForm.value.linkedBankAccount,
          "linkedDematAccount": this.assetForm.value.linkedDematAccount,
          "description": this.assetForm.value.description,
          "stockList": [
            {
              "ownerList": this.assetForm.value.getCoOwnerName,
              "valueAsOn": this.datePipe.transform(this.assetForm.get("valueAsOn").value, 'yyyy-MM-dd'),
              "currentMarketValue": this.assetForm.get("currentMarketValue").value,
              "amountInvested": this.assetForm.get("amtInvested").value,
              "id": this.editApiData.id,
              "stockType": 1,
              "scripNameId": this.editApiData.scripNameId,
              "transactionorHoldingSummaryList": this.editApiData.transactionorHoldingSummaryList
            }
          ]
        }

        if(this.editMood){
          this.cusService.editStockData(obj).subscribe(
            data =>{
              this.barButtonOptions.active = false;
              this.submitStockDataRes(data);
            }, 
            error =>{
              this.barButtonOptions.active = false;
              this.eventService.showErrorMessage(error)
            }
          )
        }else{
          this.addCall(obj);
        }
      }
      else {
        let obj = {
          "clientId": this.clientId,
          "advisorId": this.advisorId,
          "familyMemberId": this.familyMemberId,
          "ownerList": this.assetForm.value.getCoOwnerName,
          "portfolioName": this.assetForm.get("portfolioName").value,
          "nomineeList": this.assetForm.value.getNomineeName,
          "linkedBankAccount": this.assetForm.value.linkedBankAccount,
          "linkedDematAccount": this.assetForm.value.linkedDematAccount,
          "description": this.assetForm.value.description,
          "stockList": [
            {
              "ownerList": this.assetForm.value.getCoOwnerName,
              "valueAsOn": this.datePipe.transform(this.assetForm.get("valueAsOn").value, 'yyyy-MM-dd'),
              "currentMarketValue": this.assetForm.get("currentMarketValue").value,
              "amountInvested": this.assetForm.get("amtInvested").value,
              "stockType": 1,
              "scripNameId": 0,
              "transactionorHoldingSummaryList": null
            }
          ]
        }
        this.addCall(obj);
      }
      // stock type portfolio summary
    }
  }

  addCall(obj){
    this.cusService.addAssetStocks(obj).subscribe(
      data =>{
        this.barButtonOptions.active = false;
        this.submitStockDataRes(data);
      },
      error =>{
        this.barButtonOptions.active = false;
        this.eventService.showErrorMessage(error);
      }
    )
  }
  submitStockDataRes(data) {
    console.log(data)
    // this.eventService.openSnackBar()
    this.close();
  }
  close() {
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
      data:{bankList: this.bankList, userInfo: true,  ownerList : this.getCoOwner} 
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.bankList = this.enumService.getBank();
      }, 5000);
    });

  }

//link bank
}
