import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-investments-plan',
  templateUrl: './investments-plan.component.html',
  styleUrls: ['./investments-plan.component.scss']
})
export class InvestmentsPlanComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'debt', 'status', 'icons'];
  dataSource = ELEMENT_DATA;
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }

  open(flagValue) {
    const fragmentData = {
      flag: flagValue,
      id: 1,
      state: 'open70'
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
  debt: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: "Fixed deposit | ICICI Bank | 098098098", name: '1,20,000', weight: "40,000", symbol: '0',
    debt: '0', status: 'Deployed'
  },
  {
    position: "LIC Jeevan Saral | 989877679", name: '1,20,000', weight: "40,000", symbol: '0',
    debt: '0', status: 'Deployed'
  },
  {
    position: "Surplus from Life cash flows (Lumpsum)", name: '1,20,000', weight: "40,000", symbol: '0',
    debt: '0', status: 'Deployed'
  },
];
