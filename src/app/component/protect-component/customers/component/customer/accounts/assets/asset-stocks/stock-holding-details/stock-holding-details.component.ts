import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-stock-holding-details',
  templateUrl: './stock-holding-details.component.html',
  styleUrls: ['./stock-holding-details.component.scss']
})
export class StockHoldingDetailsComponent implements OnInit {

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
