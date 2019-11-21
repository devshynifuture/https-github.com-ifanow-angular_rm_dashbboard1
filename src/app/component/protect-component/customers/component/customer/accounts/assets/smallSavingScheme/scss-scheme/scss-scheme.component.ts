import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';

@Component({
  selector: 'app-scss-scheme',
  templateUrl: './scss-scheme.component.html',
  styleUrls: ['./scss-scheme.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class ScssSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;

  constructor(private cusService:CustomerService,private subInjectService:SubscriptionInject) { }
  displayedColumns19 = ['no', 'owner', 'payout', 'rate', 'tamt', 'amt', 'mdate', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=AuthService.getClientId();
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
    console.log(data)
    if(data.scssList.length!=0){
      this.datasource=data.scssList
    }else{
      this.noData="No Scheme Found";
    }
  }
  addOpenSCSS(value,data)
  {
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
          this.getScssSchemedata()
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
