import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-stock-details-view',
  templateUrl: './stock-details-view.component.html',
  styleUrls: ['./stock-details-view.component.scss']
})
export class StockDetailsViewComponent implements OnInit {
  
  data;
  constructor(private subInjectService: SubscriptionInject,private enumService: EnumServiceService) { }

  clientFamilybankList:any = [];
  ngOnInit() {
    this.clientFamilybankList = this.enumService.getclientFamilybankList();
    console.log('bank', this.clientFamilybankList);
    console.log(this.data, "data 123 test");
    
  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}

