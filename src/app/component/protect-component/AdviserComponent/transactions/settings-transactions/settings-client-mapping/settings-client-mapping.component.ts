import { Component, OnInit } from '@angular/core';
import { AddClientMappingComponent } from './add-client-mapping/add-client-mapping.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-settings-client-mapping',
  templateUrl: './settings-client-mapping.component.html',
  styleUrls: ['./settings-client-mapping.component.scss']
})
export class SettingsClientMappingComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'pan', 'hold', 'tstatus', 'status', 'map'];
  dataSource = ELEMENT_DATA;
  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  openAddMappiing(data, flag) {
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open50' : 'open50',
      componentName: AddClientMappingComponent
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
  symbol: string;
  pan: string;
  hold: string;
  tstatus: string;
  status: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: "NSE", name: 'ARN-83865', weight: "5011012025", symbol: 'Sneha Vishal Shah	', pan: 'AAFHF8989J',
    hold: 'Anyone or survivor', tstatus: 'NRI - Repatriable (NRE)', status: 'Active'
  },

];
