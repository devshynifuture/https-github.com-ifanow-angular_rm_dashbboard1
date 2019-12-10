import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-asset-stocks',
  templateUrl: './add-asset-stocks.component.html',
  styleUrls: ['./add-asset-stocks.component.scss']
})
export class AddAssetStocksComponent implements OnInit {
  assetForm: any;
  ownerData: any;

  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder) { }

  ngOnInit() {
  }
  @Input() set data(data) {
    if (data == null) {
      data = {}
    }
    this.assetForm = this.fb.group({
      ownerName: [, [Validators.required]],
      currentMarketValue: [, [Validators.required]],
      valueAsOn: [, [Validators.required]],
      amtInvested: [, [Validators.required]],
      portfolioName: [, [Validators.required]]
    })
    this.ownerData = this.assetForm.controls;
    console.log(this.assetForm)
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
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
        console.log("call api")
        break;
    }
  }
}
