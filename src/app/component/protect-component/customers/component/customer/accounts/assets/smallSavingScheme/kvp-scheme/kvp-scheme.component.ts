import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-kvp-scheme',
  templateUrl: './kvp-scheme.component.html',
  styleUrls: ['./kvp-scheme.component.scss']
})
export class KvpSchemeComponent implements OnInit {
  clientId: number;
  advisorId: any;
  noData: string;

  constructor(private cusService:CustomerService,private subInjectService:SubscriptionInject) { }
  displayedColumns18 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'mvalue', 'mdate', 'desc', 'status', 'icons'];
  datasource;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=AuthService.getClientId();
    this.getKvpSchemedata()
  }
  getKvpSchemedata()
  {
    const obj={
      advisorId:this.advisorId,
      clientId:this.clientId
    }
    this.cusService.getSmallSavingSchemeKVPData(obj).subscribe(
      data=>this.getKvpSchemedataResponse(data)
    )
  }
  getKvpSchemedataResponse(data)
  {
    console.log(data)
    if(data.kvpList.length!=0){
      this.datasource=data.kvpList
    }else{
      this.noData="No Scheme Found";
    }
  }
  addKVP(value,data) {
    const fragmentData = {
      Flag:value,
      data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getKvpSchemedata()
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
