import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from 'src/app/auth-service/authService';
import {CustomerService} from '../../../../customer.service';
import {EventService} from 'src/app/Data-service/event.service';

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
  nomineesListFM: any;

  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder, private cusService: CustomerService, private eventService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  @Input() set data(data) {
    if (data == null) {
      data = {}
    }
    else {
      this.editApiData = data
    }
    this.assetForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      currentMarketValue: [!data.stocks?'':data.stocks[0].currentMarketValue, [Validators.required]],
      valueAsOn: [!data.stocks?'':new Date(data.stocks[0].valueAsOn), [Validators.required]],
      amtInvested: [!data.stocks?'':data.stocks[0].amountInvested, [Validators.required]],
      portfolioName: [data.portfolioName, [Validators.required]]
    })
    this.familyMemberId = data.familyMemberId;
    this.ownerData = this.assetForm.controls;
    console.log(this.assetForm)
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  preventDefault(e){
    e.preventDefault();
  }
  submitStockData() {
    
      // case (this.assetForm.get('ownerName').invalid):
      //   this.assetForm.get('ownerName').markAsTouched();
      //   break;
      if(this.assetForm.invalid){
        this.assetForm.get('ownerName').markAsTouched();
        this.assetForm.get('currentMarketValue').markAsTouched();
        this.assetForm.get('valueAsOn').markAsTouched();
        this.assetForm.get('amtInvested').markAsTouched();
        this.assetForm.get('portfolioName').markAsTouched();
      }
      else{
        if (this.editApiData) {
          let obj =
          {
            "familyMemberId": this.familyMemberId,
            "ownerName": this.ownerName,
            "portfolioName": this.assetForm.get('portfolioName').value,
            "id": this.editApiData.id,
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
            "ownerName": this.ownerName,
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
    this.close();
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
