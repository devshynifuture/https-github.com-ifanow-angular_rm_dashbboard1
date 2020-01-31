import { Component, OnInit } from '@angular/core';
import { SelectAdviceComponent } from '../select-advice/select-advice.component';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddRealEstateComponent } from '../../../accounts/assets/realEstate/add-real-estate/add-real-estate.component';

@Component({
  selector: 'app-advice-real-asset',
  templateUrl: './advice-real-asset.component.html',
  styleUrls: ['./advice-real-asset.component.scss']
})
export class AdviceRealAssetComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'status', 'icons'];
  dataSource = ELEMENT_DATA;
  constructor(private eventService: EventService, public dialog: MatDialog, private subInjectService: SubscriptionInject,
    private cusService: CustomerService) { }

  ngOnInit() {
  }
  openRealEstate(value, data) {
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
            // this.getFixedDepositList();
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
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  status: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: '1', name: 'Rahul Jain', weight: 'This is', symbol: '54000', status: 'LIVE' },
  { position: '2', name: 'Rahul Jain', weight: 'This is', symbol: '54000', status: 'LIVE' },

];
