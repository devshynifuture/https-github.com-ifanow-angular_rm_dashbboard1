import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {NewTeamMemberComponent} from './new-team-member/new-team-member.component';
import {SettingsService} from '../../../settings.service';
import {AuthService} from 'src/app/auth-service/authService';
import {EventService} from 'src/app/Data-service/event.service';
import {MatDialog} from '@angular/material';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  advisorId: any;
  userList: any[];
  roles: any[];
  isLoading: boolean;
  counter = 0;

  constructor(
    private subInjectService: SubscriptionInject,
    private settingsService: SettingsService,
    private eventService: EventService,
    private dialog:MatDialog,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.loadRoles();
    this.loadUsers();
  }

  loadUsers() {
    this.loader(1);
    const dataObj = {
      advisorId: this.advisorId
    }
    this.settingsService.getTeamMembers(dataObj).subscribe((res) => {
      this.loader(-1);
      console.log('team member details',res)
      this.userList = res;
    });
  }

  loadRoles() {
    this.loader(1);
    const obj = {
      advisorId: this.advisorId
    }

    this.settingsService.getAllRoles(obj).subscribe((res) => {
      this.loader(-1);
      this.roles = res;
    })
  }

  addEditTeamMember(data, add_flag) {
    if (this.roles && this.roles.length > 0) {
      let dataObj = {
        mainData: data || {},
        is_add_call: add_flag,
        roles: this.roles
      }
      const fragmentData = {
        flag: 'add-ARI-RIA-details',
        data: dataObj,
        id: 1,
        state: 'open35',
        componentName: NewTeamMemberComponent
      };
      this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
        sideBarData => {
          if (UtilService.isDialogClose(sideBarData) && UtilService.isRefreshRequired(sideBarData)) {
            this.loadUsers();
          }
        }
      );
    } else {
      this.eventService.openSnackBar("You need to define roles before you could add members");
    }
  }

  deleteUser(user) {
    const dialogData = {
      header: 'DELETE',
      body: 'Are you sure you want to delete this user?',
      body2: 'This cannot be undone.',
      btnNo: 'DELETE',
      btnYes: 'CANCEL',
      negativeMethod: () => {
        console.log('aborted');
      },
      positiveMethod: () => {
        const deleteFromTrashSubscription = this.settingsService.deleteTeamMember(user.id)
          .subscribe(response => {
            console.log(response);
            deleteFromTrashSubscription.unsubscribe();
            this.loadUsers();
          }, error => {
            console.error(error)
            this.eventService.openSnackBar("Error occured");
          });
      }
    }
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
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
            deleteFromTrashSubscription.unsubscribe();
            this.loadUsers();
          }, error => {
            console.error(error)
            this.eventService.openSnackBar("Error occured");
          });
      }
    }
    this.dialog.open(ConfirmDialogComponent, {
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
