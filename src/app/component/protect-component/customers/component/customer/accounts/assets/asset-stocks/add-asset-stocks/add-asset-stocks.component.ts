import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
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

  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder, private cusService: CustomerService, private eventService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  @Input() set data(data) {
    if (data == null) {
      data = {}
    }
    this.assetForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      currentMarketValue: [data.currentMarketValue, [Validators.required]],
      valueAsOn: [new Date(data.valueAsOn), [Validators.required]],
      amtInvested: [data.amountInvested, [Validators.required]],
      portfolioName: [data.portfolioName, [Validators.required]]
    })
    this.ownerData = this.assetForm.controls;
    console.log(this.assetForm)
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  submitStockData() {
    switch (true) {
      // case (this.assetForm.get('ownerName').invalid):
      //   this.assetForm.get('ownerName').markAsTouched();
      //   break;
      case (this.assetForm.get('currentMarketValue').invalid):
        this.assetForm.get('currentMarketValue').markAsTouched();
        break;
      case (this.assetForm.get('valueAsOn').invalid):
        this.assetForm.get('valueAsOn').markAsTouched();
        break;
      case (this.assetForm.get('amtInvested').invalid):
        this.assetForm.get('amtInvested').markAsTouched();
        break;
      case (this.assetForm.get('portfolioName').invalid):
        this.assetForm.get('portfolioName').markAsTouched();
        break;
      default:
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
          err => this.eventService.openSnackBar(err)
        )
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
