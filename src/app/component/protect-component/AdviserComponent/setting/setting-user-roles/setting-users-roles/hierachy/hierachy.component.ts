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
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'role', 'report'];
  dataSource = new MatTableDataSource([{}, {}, {}]);
  advisorId: any;
  isLoading: boolean = false;
  hasError: boolean = false;

  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private settingsService: SettingsService,
    public utilService: UtilService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.getAccessRightsList();
  }

  getAccessRightsList() {
    this.utilService.loader(1);
    const dataObj = {
      advisorId: this.advisorId
    }
    this.settingsService.getAccessRightsList(dataObj).subscribe((res) => {
      this.utilService.loader(-1);
      this.dataSource = new MatTableDataSource(res || []);
    }, err => {
      this.utilService.loader(-1);
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss");
    })
  }

  assignTeamMember(value, data) {
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open45',
      componentName: AddTeamMemberComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAccessRightsList();
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}