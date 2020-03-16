import { UtilService } from '../../../../../services/util.service';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { OnlineTrasactionComponent } from './doTransaction/online-trasaction/online-trasaction.component';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { KnowYourCustomerComponent } from './know-your-customer/know-your-customer.component';
import { IinUccCreationComponent } from './IIN/UCC-Creation/iin-ucc-creation/iin-ucc-creation.component';
import { VerifyMemberComponent } from './MandateCreation/verify-member/verify-member.component';

@Component({
  selector: 'app-overview-transactions',
  templateUrl: './overview-transactions.component.html',
  styleUrls: ['./overview-transactions.component.scss']
})
export class OverviewTransactionsComponent implements OnInit {


  constructor(private subInjectService: SubscriptionInject, public eventService: EventService, ) { }

  ngOnInit() {
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  openNewTransaction() {
    const fragmentData = {
      flag: 'addNewTransaction',
      data: null,
      id: 1,
      state: 'open65',
      componentName: OnlineTrasactionComponent,
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


  openNewCustomer() {
    const fragmentData = {
      flag: 'addNewCustomer',
      id: 1,
      direction: 'top',
      componentName: KnowYourCustomerComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );

  }

  openMandate(data){
    const fragmentData = {
      flag: 'mandate',
      data,
      id: 1,
      state: 'open',
      componentName: VerifyMemberComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);

        if (UtilService.isRefreshRequired(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);

        }
        rightSideDataSub.unsubscribe();
      }
    );
  }
  openNewCustomerIIN() {
    const fragmentData = {
      flag: 'addNewCustomer',
      id: 1,
      direction: 'top',
      componentName: IinUccCreationComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );

  }




}
