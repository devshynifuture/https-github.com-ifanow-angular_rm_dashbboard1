import { Component, OnInit } from '@angular/core';
import { SelectAdviceComponent } from '../select-advice/select-advice.component';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-advice-real-asset',
  templateUrl: './advice-real-asset.component.html',
  styleUrls: ['./advice-real-asset.component.scss']
})
export class AdviceRealAssetComponent implements OnInit {
  displayedColumns: string[] = [ 'position', 'name', 'weight', 'symbol', 'icons'];
  dataSource = ELEMENT_DATA;
  constructor(private eventService: EventService, public dialog: MatDialog, private subInjectService: SubscriptionInject,
    private cusService: CustomerService) { }

  ngOnInit() {
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

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)', weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal', },
  { position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)', weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal', },

];
