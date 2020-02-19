import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-mutual-fund',
  templateUrl: './mutual-fund.component.html',
  styleUrls: ['./mutual-fund.component.scss']
})
export class MutualFundComponent implements OnInit {
  viewMode: string;
  mfData: any;
  advisorId: any;
  clientId: any;

  constructor(public subInjectService:SubscriptionInject,public UtilService:UtilService,public eventService:EventService,private custumService:CustomerService) { }
  
  ngOnInit() {
    this.viewMode = 'Overview Report';
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getMutualFund();
  }
  getMutualFund(){
    const obj = {
      advisorId: 3967,
      clientId: 2982
    }
    this.custumService.getMutualFund(obj).subscribe(
      data => this.getMutualFundResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getMutualFundResponse(data){
    this.mfData=data
  }

}


