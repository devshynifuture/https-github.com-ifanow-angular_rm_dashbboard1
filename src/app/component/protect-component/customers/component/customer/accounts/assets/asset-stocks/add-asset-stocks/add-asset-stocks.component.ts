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
      ownerName: [data, [Validators.required]],
      currentMarketValue: [data, [Validators.required]],
      valueAsOn: [data, [Validators.required]],
      amtInvested: [data, [Validators.required]],
      portfolioName: [data, [Validators.required]]
    })
    this.ownerData = this.assetForm.controls;
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  submitStockData()
  {
    
  }
}
