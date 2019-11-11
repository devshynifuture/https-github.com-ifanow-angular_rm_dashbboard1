import { Component, OnInit } from '@angular/core';
// import {UtilService} from '../../../../../../../services/util.service';
import { EventService } from '../../../../../../../Data-service/event.service';
import { SubscriptionInject } from '../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-liabilities',
  templateUrl: './liabilities.component.html',
  styleUrls: ['./liabilities.component.scss']
})

export class LiabilitiesComponent implements OnInit {
  displayedColumns = ['no', 'name', 'type', 'loan', 'ldate', 'today', 'ten', 'rate', 'emi', 'fin', 'status', 'icons'];
  dataSource = ELEMENT_DATA;

  constructor(private eventService: EventService, private subInjectService: SubscriptionInject) {
  }


  viewMode;

  ngOnInit() {
    this.viewMode = 'tab1';
  }
  open(flagValue, data) {
    const fragmentData = {
      Flag: flagValue,
      data,
      id: 1,
      state: 'open'
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

  openThirtyPercent(flagValue, data) {
    const fragmentData = {
      Flag: flagValue,
      data,
      id: 1,
      state: 'openHelp'
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
  clickHandling() {
    console.log('something was clicked');
    // this.openFragment('', 'plan');
    this.open('openHelp', 'liabilityright');
  }

}

export interface PeriodicElement {
  no: string;
  name: string;
  type: string;
  loan: string;
  ldate: string;
  today: string;
  ten: string;
  rate: string;
  emi: string;
  fin: string;
  status: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    no: '1',
    name: 'Rahul Jain',
    type: 'Home loan',
    loan: '60,000',
    ldate: '18/09/2021',
    today: '1,00,000',
    ten: '5y 9m',
    rate: '8.40%',
    emi: '60,000',
    fin: 'ICICI FD',
    status: 'MATURED'
  },
  {
    no: '2',
    name: 'Shilpa Jain',
    type: 'Home loan',
    loan: '60,000',
    ldate: '18/09/2021',
    today: '1,00,000',
    ten: '5y 9m',
    rate: '8.40%',
    emi: '60,000',
    fin: 'ICICI FD',
    status: 'MATURED'
  },
  {
    no: '',
    name: 'Total',
    type: '',
    loan: '1,20,000',
    ldate: '',
    today: '1,50,000',
    ten: '',
    rate: '',
    emi: '',
    fin: '',
    status: ''
  },
];
