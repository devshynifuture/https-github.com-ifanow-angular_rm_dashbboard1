import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { AddTeamMemberComponent } from './add-team-member/add-team-member.component';
import { EventService } from 'src/app/Data-service/event.service';
import { SettingsService } from '../../../settings.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

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
    private dialog: MatDialog
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

  removeAccess(value, data) {
    const dialogData = {
      data: value,
      header: 'REMOVE ACCESS',
      body: 'Are you sure you want to remove?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'REMOVE',
      positiveMethod: () => {
        const obj = {
          "id": data.id,
          "ChildId": data.childId,
          "emailId": data.emailId,
          "mobileNo": data.mobileNo,
          "parentName": data.parentName,
          "parentId": 0,
          "roleName": data.roleName
        }
        this.settingsService.removeAccessRight(obj).subscribe(
          res => {
            dialogRef.close();
            this.eventService.openSnackBar("Access removed successfully", "Dismiss");
            this.getAccessRightsList();
          }, err => {
            this.eventService.openSnackBar(err, "Dismiss");
          }
        )
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
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