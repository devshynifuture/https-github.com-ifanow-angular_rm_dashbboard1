import {Component, OnInit} from '@angular/core';
import {AddNewRoleComponent} from '../../../setting-entry/add-new-role/add-new-role.component';
import {UtilService} from 'src/app/services/util.service';
import {EventService} from 'src/app/Data-service/event.service';
import {SettingsService} from '../../../settings.service';
import {AuthService} from 'src/app/auth-service/authService';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'del'];
  dataSource: any = new MatTableDataSource([{}, {}, {}]);
  advisorId: any;
  isLoading: boolean;
  globalData: any[] = [];
  counter = 0;
  hasError = false;

  constructor(
    private eventService: EventService,
    private settingsService: SettingsService,
    public utilService: UtilService,
    private dialog: MatDialog,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.utilService.loader(0);
    this.getAllRoles();
  }

  getAllRoles() {
    this.utilService.loader(1);
    const obj = {
      advisorId: this.advisorId
    };

    this.settingsService.getAllRoles(obj).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.utilService.loader(-1);
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
      this.utilService.loader(-1);
      this.hasError = true;
    });
  }

  addEditNewRoles(roleType, is_add_flag, data) {
    let roleTypeText = '';
    switch (roleType) {
      case 1:
        roleTypeText = 'Admin';
        break;
      case 2:
        roleTypeText = 'Back office';
        break;
      case 3:
        roleTypeText = 'Planner';
        break;
      case 4:
        roleTypeText = 'Mutual fund only';
        break;
      case 5:
        roleTypeText = 'MF + Multi asset';
        break;
      case 6:
        roleTypeText = 'MF + Multi asset + Basic Plan';
        break;
      case 7:
        roleTypeText = 'MF + Multi asset + Advanced Plan';
        break;
    }
    const dataObj = {
      mainData: data || {},
      roleType,
      roleTypeText,
      is_add_flag,
    };
    const fragmentData = {
      flag: 'app-upper-setting',
      id: 1,
      data: dataObj,
      direction: 'top',
      componentName: AddNewRoleComponent,
      state: 'open'
    };
    const rightSideDataSub = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAllRoles();
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  deleteRole( data) {
    const dialogData = {
      data: 'role',
      header: 'Delete',
      body: 'Are you sure you want to delete this role?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.utilService.loader(1);
        dialogRef.close();
        this.settingsService.deleteRole(data.id).subscribe((res) => {
          this.getAllRoles();
          this.utilService.loader(-1);
        },
        error => {
          this.eventService.showErrorMessage(error);
          this.utilService.loader(-1);
        });
      },
      negativeMethod: () => {
        dialogRef.close();
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
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
