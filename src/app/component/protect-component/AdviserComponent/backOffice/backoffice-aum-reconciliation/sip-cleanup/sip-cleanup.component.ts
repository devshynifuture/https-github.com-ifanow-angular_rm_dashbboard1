import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { RecordDetailsComponent } from './record-details/record-details.component';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-sip-cleanup',
  templateUrl: './sip-cleanup.component.html',
  styleUrls: ['./sip-cleanup.component.scss']
})
export class SipCleanupComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'tra', 'action', 'menu'];
  dataSource = ELEMENT_DATA;
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  openrecordDeatils() {

    const fragmentData = {
      flag: 'investorDetail',

      id: 1,
      state: 'open35',
      componentName: RecordDetailsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
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
  tra: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'HDFC Prudence Fund - Growth	 / 9878787/90', name: 'Rahul Jain',
    weight: 'SIP / ₹12,000', symbol: '23-04-20 / 15-06-20 / 15-06-99', tra: '5437372732'
  },

];
