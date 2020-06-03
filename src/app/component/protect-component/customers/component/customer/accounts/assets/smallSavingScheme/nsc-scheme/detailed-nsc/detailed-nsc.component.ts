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
  ngOnInit() {
    this.nominee = this.data.nominees;
    this.bankList = this.enumService.getBank();
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
