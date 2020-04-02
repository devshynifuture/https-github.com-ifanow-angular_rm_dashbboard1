import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { AddTeamMemberComponent } from './add-team-member/add-team-member.component';
import { EventService } from 'src/app/Data-service/event.service';
import { SettingsService } from '../../../settings.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-hierachy',
  templateUrl: './hierachy.component.html',
  styleUrls: ['./hierachy.component.scss']
})
export class HierachyComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'role', 'report', 'icons'];
  dataSource:MatTableDataSource<any>;
  advisorId:any;
  counter: any;
  isLoading: boolean;

  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private settingsService: SettingsService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.getAccessRightsList();
  }

  getAccessRightsList() {
    this.loader(1);
    const dataObj = {
      advisorId: this.advisorId
    }
    this.settingsService.getAccessRightsList(dataObj).subscribe((res) => {
      this.loader(-1);
      console.log(res);
      this.dataSource = new MatTableDataSource(res);
    }, err => {
      console.error(err);
      this.loader(-1);
      this.eventService.openSnackBar("Error occured");
    })
  }

  openTask(value, data) {
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open45',
      componentName: AddTeamMemberComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAccessRightsList();
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  loader(countAdder) {
    this.counter += countAdder;
    if (this.counter == 0) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }

}

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  report: string;
  role: string;

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
