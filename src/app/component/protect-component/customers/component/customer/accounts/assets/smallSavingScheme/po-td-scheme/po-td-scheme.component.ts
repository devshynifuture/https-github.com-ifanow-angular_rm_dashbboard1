import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-po-td-scheme',
  templateUrl: './po-td-scheme.component.html',
  styleUrls: ['./po-td-scheme.component.scss']
})
export class PoTdSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;

  constructor(private cusService: CustomerService, private subInjectService: SubscriptionInject) { }
  displayedColumns22 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'tenure', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = 2978;
    this.getPoTdSchemedata();
  }
  getPoTdSchemedata() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.cusService.getSmallSavingSchemePOTDData(obj).subscribe(
      data => this.getPoTdSchemedataResponse(data)
    )
  }
  getPoTdSchemedataResponse(data) {
    this.datasource = data.PostOfficeTdList
    console.log(data)
  }
  addPOTD(value,data) {
    const fragmentData = {
      Flag: value,
      data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
