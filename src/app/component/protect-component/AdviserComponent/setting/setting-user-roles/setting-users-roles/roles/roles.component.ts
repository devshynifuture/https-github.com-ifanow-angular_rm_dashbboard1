import { Component, OnInit } from '@angular/core';
import { AddNewRoleComponent } from '../../../setting-entry/add-new-role/add-new-role.component';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SettingsService } from '../../../settings.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'del'];
  dataSource: any = ELEMENT_DATA;
  advisorId: any;
  // isLoading: true;

  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private settingsService: SettingsService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.loadGlobalData();
    this.getAllRoles();
  }

  loadGlobalData() {
    // this.isLoading = true;
    // this.dataSource.data = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId
    }


    this.settingsService.getUserRolesGlobalData(obj).subscribe((res) => {
      console.log(res)
      this.dataSource = new MatTableDataSource(res);
    })
  }

  getAllRoles() {

    const obj = {
      advisorId: this.advisorId
    }

    this.settingsService.getAllRoles(obj).subscribe((res) => {
      console.log(res)
      this.dataSource = new MatTableDataSource(res);
    })
  }

  addEditNewRoles(data) {
    const fragmentData = {
      flag: 'app-upper-setting',
      id: 1,
      data: data || {},
      direction: 'top',
      componentName: AddNewRoleComponent,
      state: 'open'
    };
    const rightSideDataSub = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  cloneRole(data) {
    let jsonObj = {
      ...data
    }

    delete jsonObj.id;

    this.settingsService.addRole(jsonObj).subscribe((res) => {
      this.getAllRoles();
    });
  }
}








export interface PeriodicElement {
  name: string;
  position: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Admin', name: 'The admin role has unrestricted access to all modules. This role cannot be edited or deleted.' },
  { position: 'Admin', name: 'The admin role has unrestricted access to all modules. This role cannot be edited or deleted.' },
  { position: 'Admin', name: 'The admin role has unrestricted access to all modules. This role cannot be edited or deleted.' },
  { position: 'Admin', name: 'The admin role has unrestricted access to all modules. This role cannot be edited or deleted.' },

];