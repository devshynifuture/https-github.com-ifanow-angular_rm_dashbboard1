import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-po-mis-scheme',
  templateUrl: './po-mis-scheme.component.html',
  styleUrls: ['./po-mis-scheme.component.scss']
})
export class PoMisSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;

  constructor(private cusService:CustomerService,private subInjectService:SubscriptionInject,public util:UtilService) { }
  displayedColumns = ['no', 'owner','cvalue','mpayout','rate','amt','mvalue','mdate','desc','status','icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=2978;
    this.getPoMisSchemedata()
  }
  getPoMisSchemedata()
  {
    const obj={
      advisorId:this.advisorId,
      clientId:this.clientId
    }
    this.cusService.getSmallSavingSchemePOMISData(obj).subscribe(
      data=>this.getPoMisSchemedataResponse(data)
    )
  }
  getPoMisSchemedataResponse(data)
  {
    console.log(data)
    this.datasource=data.PoMisList;
  }
  addPOMIS(value,data)
  {
    const fragmentData = {
      Flag:value,
      data:data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getPoMisSchemedata();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
