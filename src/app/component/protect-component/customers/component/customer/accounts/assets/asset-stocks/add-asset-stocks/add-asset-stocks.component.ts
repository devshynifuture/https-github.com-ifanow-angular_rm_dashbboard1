import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-asset-stocks',
  templateUrl: './add-asset-stocks.component.html',
  styleUrls: ['./add-asset-stocks.component.scss']
})
export class AddAssetStocksComponent implements OnInit {
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

  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder, private cusService: CustomerService, private eventService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
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

    }
    this.assetForm = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: ['', [Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      currentMarketValue: [!data.stocks ? '' : data.stocks[0].currentMarketValue, [Validators.required]],
      valueAsOn: [!data.stocks ? '' : new Date(data.stocks[0].valueAsOn), [Validators.required]],
      amtInvested: [!data.stocks ? '' : data.stocks[0].amountInvested, [Validators.required]],
      portfolioName: [data.portfolioName, [Validators.required]],
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
      if (this.editApiData) {
        let obj =
        {
          "familyMemberId": this.familyMemberId,
          "ownerName": this.ownerName,
          "portfolioName": this.assetForm.get('portfolioName').value,
          "id": this.editApiData.id,
          "ownerList": this.assetForm.value.getCoOwnerName,
          "stocks": [
            {
              "valueAsOn": this.assetForm.get("valueAsOn").value,
              "currentMarketValue": this.assetForm.get("currentMarketValue").value,
              "amountInvested": this.assetForm.get("amtInvested").value,
              "id": this.editApiData.stocks[0].id
            }
          ]
        }
        this.cusService.editStockData(obj).subscribe(
          data => this.submitStockDataRes(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
      else {
        let obj = {
          "clientId": this.clientId,
          "advisorId": this.advisorId,
          "familyMemberId": this.familyMemberId,
          "ownerList": this.assetForm.value.getCoOwnerName,
          "portfolioName": this.assetForm.get("portfolioName").value,
          "stocks": [
            {
              "valueAsOn": this.assetForm.get("valueAsOn").value,
              "currentMarketValue": this.assetForm.get("currentMarketValue").value,
              "amountInvested": this.assetForm.get("amtInvested").value,
              "stockType": 1
            }
          ]
        }
        this.cusService.addAssetStocks(obj).subscribe(
          data => this.submitStockDataRes(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
      // stock type portfolio summary
    }
  }
  submitStockDataRes(data) {
    console.log(data)
    // this.eventService.openSnackBar()
    this.close();
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
