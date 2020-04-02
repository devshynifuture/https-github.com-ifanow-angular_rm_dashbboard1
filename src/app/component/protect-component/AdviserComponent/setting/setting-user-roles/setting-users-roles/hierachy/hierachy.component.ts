import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { AddTeamMemberComponent } from './add-team-member/add-team-member.component';

@Component({
  selector: 'app-hierachy',
  templateUrl: './hierachy.component.html',
  styleUrls: ['./hierachy.component.scss']
})
export class HierachyComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'role', 'report', 'icons'];
  dataSource = ELEMENT_DATA;

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }

  openTask(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open45',
      componentName: AddTeamMemberComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
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
  report: string;
  role: string

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Ronak Hindocha', name: 'Active', weight: '+91 9987412342',
    symbol: 'ronak.hindocha@futurewise.co.in', role: 'Admin', report: '-'
  },

  {
    position: 'Ronak Hindocha', name: 'Active', weight: '+91 9987412342',
    symbol: 'ronak.hindocha@futurewise.co.in', role: 'Admin', report: 'Ronak Hindocha'
  },
  {
    position: 'Ronak Hindocha', name: 'Active', weight: '+91 9987412342',
    symbol: 'ronak.hindocha@futurewise.co.in', role: 'Admin', report: 'ADD REPORTING MANAGER'
  },
];