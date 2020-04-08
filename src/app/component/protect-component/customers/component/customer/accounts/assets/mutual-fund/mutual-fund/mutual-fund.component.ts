import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {UtilService} from 'src/app/services/util.service';
import {CustomerService} from '../../../../customer.service';
import {AuthService} from 'src/app/auth-service/authService';
import {MfServiceService} from '../mf-service.service';

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
  subCategoryData: any[];
  schemeWise: any[];
  mutualFundList: any[];
  totalObj: any;
  customDataSource: any;
  catObj: {};
  mfDataUnrealised: any;

  constructor(public subInjectService: SubscriptionInject, public utilService: UtilService,
              public eventService: EventService, private custumService: CustomerService,
              private mfService: MfServiceService) {
  }

  ngOnInit() {
    this.viewMode = 'All Transactions';
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getMutualFund();
  }

  getMutualFund() {
    const obj = {
      advisorId: 2753,
      clientId: 15545
    };
    this.custumService.getMutualFund(obj).subscribe(
      data => this.getMutualFundResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }

  getMutualFundResponse(data) {
    this.mfData = data;
  }
  unrealiseTransaction(){
    this.mfDataUnrealised = this.mfData;
  }


}


