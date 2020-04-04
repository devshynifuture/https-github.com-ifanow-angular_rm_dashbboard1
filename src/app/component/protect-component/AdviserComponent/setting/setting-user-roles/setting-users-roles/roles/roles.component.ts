import {Component, OnInit} from '@angular/core';
import {AddNewRoleComponent} from '../../../setting-entry/add-new-role/add-new-role.component';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {EventService} from 'src/app/Data-service/event.service';
import {SettingsService} from '../../../settings.service';
import {AuthService} from 'src/app/auth-service/authService';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'del'];
  dataSource: any;
  advisorId: any;
  isLoading: boolean;
  globalData:any[] = [];
  counter = 0;

  constructor(
    private eventService: EventService,
    private settingsService: SettingsService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.getAllRoles();
  }

  getAllRoles() {
    this.loader(1);
    const obj = {
      advisorId: this.advisorId
    }

    this.settingsService.getAllRoles(obj).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.loader(-1);
    })
  }

  addEditNewRoles(roleType, is_add_flag, data) {
    const dataObj = {
      mainData: data || {},
      roleType: roleType,
      is_add_flag: is_add_flag,
    }
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
          if(UtilService.isRefreshRequired(sideBarData)) {
            this.getAllRoles();
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  // This api is commented as we need to show popup on clone
  // cloneRole(data) {
  //   this.loader(1);
  //   this.settingsService.cloneRole({id: data.id}).subscribe((res) => {
  //     this.getAllRoles();
  //     this.loader(-1);
  //   });
  // }

  deleteRole(data) {
    this.loader(1);
    this.settingsService.deleteRole({id: data.id}).subscribe((res) => {
      this.getAllRoles();
      this.loader(-1);
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