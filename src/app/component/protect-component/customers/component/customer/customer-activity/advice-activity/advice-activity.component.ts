import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from '../../customer.service';
import { MatDialog } from '@angular/material';
import { SelectAdviceComponent } from './select-advice/select-advice.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-advice-activity',
  templateUrl: './advice-activity.component.html',
  styleUrls: ['./advice-activity.component.scss']
})
export class AdviceActivityComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'status', 'date', 'icons'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'status', 'date', 'adate', 'icons'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'status', 'date', 'adate', 'icons'];
  dataSource2 = ELEMENT_DATA2;
  displayedColumns3: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = ELEMENT_DATA3;
  displayedColumns4: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'mdate', 'advice', 'astatus', 'adate', 'icon'];
  dataSource4 = ELEMENT_DATA4;
  displayedColumns5: string[] = ['checkbox', 'position', 'name', 'cvalue', 'symbol', 'advice', 'astatus', 'icon'];
  dataSource5 = ELEMENT_DATA5;
  displayedColumns6: string[] = ['checkbox', 'position', 'name', 'cvalue', 'symbol', 'advice', 'astatus', 'icon'];
  dataSource6 = ELEMENT_DATA6;
  viewMode: string;

  constructor(private eventService: EventService, public dialog: MatDialog, private subInjectService: SubscriptionInject,
    private cusService: CustomerService) { }
  selected;
  ngOnInit() {

    this.viewMode = 'tab6';
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
  date: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)', weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal', status: 'Given', date: '23/12/2019' },
  { position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)', weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal', status: 'Given', date: '23/12/2019' },

];
export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  status: string;
  date: string;
  adate: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)', weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal', status: 'Given',
    date: '23/12/2019', adate: '23/12/2019'
  },
  {
    position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)',
    weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal',
    status: 'Given', date: '23/12/2019', adate: '23/12/2019'
  },

]
export interface PeriodicElement2 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  status: string;
  date: string;
  adate: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)', weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal', status: 'Given',
    date: '23/12/2019', adate: '23/12/2019'
  },
  {
    position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)',
    weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal',
    status: 'Given', date: '23/12/2019', adate: '23/12/2019'
  },

]


export interface PeriodicElement3 {
  name: string;
  position: string;
  weight: number;
  symbol: string;
  advice: string;
  astatus: string;
  adate: string;
}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { position: 'Rahul Jain', name: '35,000', weight: 23 / 12 / 2019, symbol: 'ICICI FD', advice: 'Continue holding till maturity', astatus: 'Given', adate: '23/12/2019' },
  { position: 'Rahul Jain', name: '35,000', weight: 23 / 12 / 2019, symbol: 'ICICI FD', advice: 'Continue holding till maturity', astatus: 'Given', adate: '23/12/2019' },
  { position: 'Rahul Jain', name: '35,000', weight: 23 / 12 / 2019, symbol: 'ICICI FD', advice: 'Continue holding till maturity', astatus: 'Given', adate: '23/12/2019' },
];
export interface PeriodicElement4 {
  name: string;
  position: string;
  weight: number;
  symbol: string;
  mdate: string;
  advice: string;
  astatus: string;
  adate: string;
}

const ELEMENT_DATA4: PeriodicElement4[] = [
  {
    position: 'Rahul Jain', name: '35,000', weight: 23 / 12 / 2019, symbol: 'ICICI FD',
    mdate: '12/08/2019', advice: 'Continue holding till maturity', astatus: 'Given', adate: '23/12/2019'
  },

];
export interface PeriodicElement5 {
  name: string;
  position: string;
  cvalue: string;
  symbol: string;
  advice: string;
  astatus: string;

}

const ELEMENT_DATA5: PeriodicElement5[] = [
  {
    position: 'Rahul Jain', name: 'Bond', cvalue: '35, 000', symbol: '23/12/2019',
    advice: 'Continue holding till maturity', astatus: 'Given'
  },

];

export interface PeriodicElement6 {
  name: string;
  position: string;
  cvalue: string;
  symbol: string;
  advice: string;
  astatus: string;
}

const ELEMENT_DATA6: PeriodicElement6[] = [
  {
    position: 'Rahul Jain', name: 'Bond', cvalue: '35, 000', symbol: '23/12/2019',
    advice: 'Continue holding till maturity', astatus: 'Given'
  },
];
