import { Component, OnInit } from '@angular/core';
import { SelectAdviceComponent } from '../select-advice/select-advice.component';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddRealEstateComponent } from '../../../accounts/assets/realEstate/add-real-estate/add-real-estate.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../actiity.service';

@Component({
  selector: 'app-advice-real-asset',
  templateUrl: './advice-real-asset.component.html',
  styleUrls: ['./advice-real-asset.component.scss']
})
export class AdviceRealAssetComponent implements OnInit {
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'mvalue', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = ELEMENT_DATA1;
  advisorId: any;
  clientId: any;
  constructor(private eventService: EventService, public dialog: MatDialog, private subInjectService: SubscriptionInject,
    private cusService: CustomerService, private activityService: ActiityService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAssetAll();
  }


  allAdvice = false;
  getAssetAll() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 8
    }
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllAssetResponse(data), (error) => {
      }
    );
  }
  getAllAssetResponse(data){
    console.log(data);
  }
  openRealEstate(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddRealEstateComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAssetAll();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openselectAdvice(data) {
    const fragmentData = {
      flag: 'openselectAdvice',
      data,
      componentName: SelectAdviceComponent,

      state: 'open65'
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
export interface PeriodicElement1 {
  name: string;
  desc: string;
  mvalue: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'Rahul Jain', desc: '1', mvalue: '20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', mvalue: '20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];