import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-nsc-scheme',
  templateUrl: './nsc-scheme.component.html',
  styleUrls: ['./nsc-scheme.component.scss']
})
export class NscSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;

  constructor(private cusService:CustomerService,private subInjectService:SubscriptionInject) { }
  displayedColumns17 = ['no', 'owner','cvalue','rate','mvalue','mdate','number','desc','status','icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=2978;
    this.datasource=[];
    this.getNscSchemedata();
  }
  getNscSchemedata() {
    const obj={
      advisorId:this.advisorId,
      clientId:this.clientId
    }
    this.cusService.getSmallSavingSchemeNSCData(obj).subscribe(
      data=>this.getNscSchemedataResponse(data)
    )
  }
  getNscSchemedataResponse(data)
  {
   console.log(data,"NSC")
   if(data.NationalSavingCertificate.length!=0){
    this.datasource=data.NationalSavingCertificate;
  }else{
    this.noData="No Scheme there"
  }
  }
  
  openAddNSC(value,data)
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
          this.getNscSchemedata();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}