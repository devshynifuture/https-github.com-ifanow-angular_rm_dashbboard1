import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {NewTeamMemberComponent} from './new-team-member/new-team-member.component';
import {SettingsService} from '../../../settings.service';
import {AuthService} from 'src/app/auth-service/authService';
import {EventService} from 'src/app/Data-service/event.service';
import {MatDialog} from '@angular/material';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {ReplaceUserComponent} from 'src/app/component/protect-component/common-component/replace-user/replace-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  advisorId: any;
  userList: any[];
  roles: any[];
  isLoading: boolean = true;
  counter = 0;

  constructor(
    private subInjectService: SubscriptionInject,
    private settingsService: SettingsService,
    private eventService: EventService,
    private dialog: MatDialog,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loader(1);
    const dataObj = {
      advisorId: this.advisorId
    };
    this.settingsService.getTeamMembers(dataObj).subscribe((res) => {
      this.loader(-1);
      console.log('team member details', res);
      this.userList = res;
    });
  }

  addEditTeamMember(data, add_flag) {
    const dataObj = {
      mainData: data || {},
      is_add_call: add_flag,
    };
    const fragmentData = {
      flag: 'add-ARI-RIA-details',
      data: dataObj,
      id: 1,
      state: 'open35',
      componentName: NewTeamMemberComponent
    };
    const sidebar = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData) && UtilService.isRefreshRequired(sideBarData)) {
          this.loadUsers();
        }
        if (UtilService.isDialogClose(sideBarData)) {
          sidebar.unsubscribe();
        }
      }
    );
  }

  deleteUser(user) {
    const newUserList = this.userList.filter(nUser => nUser.id != user.id);
    const dialogData = {
      header: 'DELETE',
      body: 'Are you sure you want to delete this user?',
      body2: 'This cannot be undone.',
      userList: newUserList,
      btnNo: 'CANCEL',
      btnYes: 'DELETE',
    };
    const dialog = this.dialog.open(ReplaceUserComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.loader(1);
        const replaceUser = {
          deleteUserId: user.adminAdvisorId,
          replaceUserId: result,
        };
        this.settingsService.deleteTeamMember(replaceUser).subscribe(res => {
          this.eventService.openSnackBar('User deleted successfully');
          this.loadUsers();
          this.loader(-1);
        }, err => {
          this.eventService.openSnackBar('Error occured');
        });
      }
    });
  }

  suspendUser(user) {
    const dialogData = {
      header: 'SUSPEND',
      body: 'Are you sure you want to suspend this user?',
      body2: 'This cannot be undone.',
      btnNo: 'SUSPEND',
      btnYes: 'CANCEL',
      negativeMethod: () => {
        console.log('aborted');
      },
      positiveMethod: () => {
        const deleteFromTrashSubscription = this.settingsService.suspendMember(user.id)
          .subscribe(response => {
            console.log(response);
            this.eventService.openSnackBar('User Suspended');
            deleteFromTrashSubscription.unsubscribe();
            this.loadUsers();
            dialog.close();
          }, error => {
            dialog.close();
            console.error(error);
            this.eventService.openSnackBar('Error occured');
          });
      }
    };
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
    });
  }

  reactivateUser(user) {
    const dialogData = {
      header: 'REACTIVATE',
      body: 'Are you sure you want to reactivate this user?',
      body2: 'This cannot be undone.',
      btnNo: 'REACTIVATE',
      btnYes: 'CANCEL',
      negativeMethod: () => {
        console.log('aborted');
      },
      positiveMethod: () => {
        const deleteFromTrashSubscription = this.settingsService.reactivateMember(user.id)
          .subscribe(response => {
            this.eventService.openSnackBar('User reactivated');
            deleteFromTrashSubscription.unsubscribe();
            this.loadUsers();
            dialog.close();
          }, error => {
            dialog.close();
            console.error(error);
            this.eventService.openSnackBar('Error occured');
          });
      }
    };
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
    });
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
