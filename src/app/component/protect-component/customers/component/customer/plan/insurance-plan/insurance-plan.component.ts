import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-insurance-plan',
  templateUrl: './insurance-plan.component.html',
  styleUrls: ['./insurance-plan.component.scss']
})
export class InsurancePlanComponent implements OnInit {
   displayedColumns = ['position', 'name', 'weight', 'symbol','icons'];
  dataSource = ELEMENT_DATA;
  displayedColumns1 = ['name', 'sum', 'annual', 'ret','advice'];
  dataSource1 = ELEMENT_DATA1;
  constructor(private subInjectService: SubscriptionInject,) { }

  ngOnInit() {
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

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: "HDFC Ergo My Health Suraksha", name: '7,00,000', weight: "19,201", symbol: 'Waiting for approval'},
];
export interface PeriodicElement1 {
  name: string;
  sum: string;
  annual: string;
  ret: string;
  advice:string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {name: "LIC Jeevan Saral", sum: '20,00,000', annual: "27,000", ret: '4.78%',advice:'Stop paying premiums'},
];