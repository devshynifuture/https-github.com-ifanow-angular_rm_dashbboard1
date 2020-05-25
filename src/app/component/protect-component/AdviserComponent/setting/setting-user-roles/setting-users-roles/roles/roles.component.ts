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
  displayedColumns: string[] = ['position', 'type', 'name', 'weight', 'symbol', 'del'];
  advisorRoles: any = new MatTableDataSource([{}, {}, {}]);
  clientRoles: any = new MatTableDataSource([{}, {}, {}]);
  advisorId: any;
  isLoading: boolean;
  globalData: any[] = [];
  counter = 0;
  hasError = false;
  hasData = false;
  roleTypes = [
    {id: 1, type: 'Admin'},
    {id: 2, type: 'Back office'},
    {id: 3, type: 'Planner'},
    {id: 4, type: 'Mutual fund only'},
    {id: 5, type: 'MF + Multi asset'},
    {id: 6, type: 'MF + Multi asset + Basic Plan'},
    {id: 7, type: 'MF + Multi asset + Advanced Plan'},
  ]

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
      if(res && res.length > 0) {
        this.hasData = true
        this.advisorRoles = new MatTableDataSource(res.filter(role => [1,2,3].includes(role.advisorOrClientRole)));
        this.clientRoles = new MatTableDataSource(res.filter(role => ![1,2,3].includes(role.advisorOrClientRole)));
      }
      this.utilService.loader(-1);
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
      this.utilService.loader(-1);
      this.hasError = true;
    });
  }

  addEditNewRoles(roleType, is_add_flag, data) {
    let roleTypeText = '';
    const role = this.roleTypes.find(role => role.id == roleType);
    roleTypeText = role.type;
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

  getRoleType(roleType) {
    const role = this.roleTypes.find(role => role.id == roleType);
    if(role) {
      return role.type;
    } else {
      return '';
    }
  }
}
