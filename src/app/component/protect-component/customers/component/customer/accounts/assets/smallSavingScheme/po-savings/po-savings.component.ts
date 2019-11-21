import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-po-savings',
  templateUrl: './po-savings.component.html',
  styleUrls: ['./po-savings.component.scss']
})
export class PoSavingsComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;

  constructor(private cusService:CustomerService,private subInjectService:SubscriptionInject) { }
  displayedColumns20 = ['no', 'owner', 'cvalue', 'rate', 'balanceM', 'balAs', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=2978;
    this.getPoSavingSchemedata()
  }
  getPoSavingSchemedata() {
    const obj={
      advisorId:this.advisorId,
      clientId:this.clientId
    }
    this.cusService.getSmallSavingSchemePOSAVINGData(obj).subscribe(
      data=>this.getPoSavingSchemedataResponse(data)
    )
  }
  getPoSavingSchemedataResponse(data)
  {
    console.log(data)
    if(data.postOfficeSavingList.length!=0){
      this.datasource=data.postOfficeSavingList
    }else{
      this.noData="No Scheme Found";
    }
  }
  addPOSAVING(value,data)
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
          this.getPoSavingSchemedata()
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
