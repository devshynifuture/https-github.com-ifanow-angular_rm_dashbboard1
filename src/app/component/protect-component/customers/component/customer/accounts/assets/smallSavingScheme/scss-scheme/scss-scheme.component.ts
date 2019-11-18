import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-scss-scheme',
  templateUrl: './scss-scheme.component.html',
  styleUrls: ['./scss-scheme.component.scss']
})
export class ScssSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;

  constructor(private cusService:CustomerService,private subInjectService:SubscriptionInject) { }
  displayedColumns19 = ['no', 'owner', 'payout', 'rate', 'tamt', 'amt', 'mdate', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=2978;
    this.getScssSchemedata()
  }
  getScssSchemedata() {
    const obj={
      advisorId:this.advisorId,
      clientId:this.clientId,
      requiredDate:''
    }
    this.cusService.getSmallSavingSchemeSCSSData(obj).subscribe(
      data=>this.getKvpSchemedataResponse(data)
    )
  }
  getKvpSchemedataResponse(data: any) {
    this.datasource=data.scssList
    console.log(data)
  }
  addOpenSCSS(value)
  {
    const fragmentData = {
      Flag:value,
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
