import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { AddNewAllKycComponent } from './add-new-all-kyc/add-new-all-kyc.component';

@Component({
  selector: 'app-kyc-transactions',
  templateUrl: './kyc-transactions.component.html',
  styleUrls: ['./kyc-transactions.component.scss']
})
export class KycTransactionsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'email', 'status', 'actions'];
  dataSource = ELEMENT_DATA;
  constructor(private eventService: EventService,
    private utilService: UtilService, private subInjectService: SubscriptionInject
    , public dialog: MatDialog) { }

  ngOnInit() {
  }
  openAddAllkyc(data, flag) {
    const fragmentData = {
      flag,
      data,
      id: 1,
      state: 'open50',
      componentName: AddNewAllKycComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getBSECredentials();

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
  status: string;
  email: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Sagar Shroff PMS', name: 'Sagar Shroff', weight: 'ALWPG5809L', symbol: '+91 9887458745',
    email: 'sagar@futurewise.co.in', status: 'Verified '
  },

];