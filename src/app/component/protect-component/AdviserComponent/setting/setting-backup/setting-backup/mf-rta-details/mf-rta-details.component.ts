import { Component, OnInit } from '@angular/core';
import { AddCamsDetailsComponent } from '../../../setting-entry/add-cams-details/add-cams-details.component';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { AddKarvyDetailsComponent } from '../../../setting-entry/add-karvy-details/add-karvy-details.component';
import { AddFranklinTempletionDetailsComponent } from '../../../setting-entry/add-franklin-templetion-details/add-franklin-templetion-details.component';
import { AddCamsFundsnetComponent } from '../../../setting-entry/add-cams-fundsnet/add-cams-fundsnet.component';

@Component({
  selector: 'app-mf-rta-details',
  templateUrl: './mf-rta-details.component.html',
  styleUrls: ['./mf-rta-details.component.scss']
})
export class MfRtaDetailsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'email', 'mail', 'use', 'icons'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2: string[] = ['position', 'name', 'weight', 'email', 'mail', 'icons'];
  dataSource2 = ELEMENT_DATA2;
  constructor(private eventService: EventService,
    private utilService: UtilService, private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  openAddcamsDetails(data, flag) {
    const fragmentData = {
      flag: flag,
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open50' : 'open50',
      componentName: AddCamsDetailsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openAddKarvyDetails(data, flag) {
    const fragmentData = {
      flag: flag,
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open50' : 'open50',
      componentName: AddKarvyDetailsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openAddFranklintempletionDetails(data, flag) {
    const fragmentData = {
      flag: flag,
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open50' : 'open50',
      componentName: AddFranklinTempletionDetailsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openAddCamsfundsent(data, flag) {
    const fragmentData = {
      flag: flag,
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open50' : 'open50',
      componentName: AddCamsFundsnetComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'ARN-83866', name: 'firstname.lastname@abcconsultants.com', weight: '* * * * * *' },

];

export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  email: string;
  mail: string;
  use: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    position: 'ARN-83866', name: 'abcconsult', weight: '* * * * * *', email: 'firstname.lastname@abcconsultants.com',
    mail: '* * * * * *', use: 'Yes'
  },
  {
    position: 'INA000004409', name: 'abcconsult', weight: '* * * * * *', email: 'firstname.lastname@abcconsultants.com',
    mail: '* * * * * *', use: 'Yes'
  },
];
export interface PeriodicElement2 {
  name: string;
  position: string;
  weight: string;
  email: string;
  mail: string;


}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    position: 'ARN-83866', name: 'abcconsult', weight: '* * * * * *', email: 'firstname.lastname@abcconsultants.com',
    mail: '* * * * * *'
  },
  {
    position: 'INA000004409', name: 'abcconsult', weight: '* * * * * *', email: 'firstname.lastname@abcconsultants.com',
    mail: '* * * * * *'
  },
];