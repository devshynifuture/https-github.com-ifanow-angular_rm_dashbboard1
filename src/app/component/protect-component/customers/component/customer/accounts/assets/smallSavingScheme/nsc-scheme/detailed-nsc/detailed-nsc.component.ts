import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-nsc',
  templateUrl: './detailed-nsc.component.html',
  styleUrls: ['./detailed-nsc.component.scss']
})
export class DetailedNscComponent implements OnInit {
  nominee: any;
  isLoading = false;
  bankList:any = [];

  constructor(private subInjectService: SubscriptionInject,  private enumService: EnumServiceService) {
  }

  data;
  matured:boolean=false;
  clientFamilybankList:any = [];
  ngOnInit() {
    this.bankList = this.enumService.getBank();
    this.clientFamilybankList = this.enumService.getclientFamilybankList();
    console.log('bank', this.clientFamilybankList);
    this.nominee = this.data.nominees;
    console.log(this.bankList,"this.bankList");
    if(new Date(this.data.maturityDate).getTime() < new Date().getTime()){
      this.matured = true;
    }
    else{
      this.matured = false;
    }
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
