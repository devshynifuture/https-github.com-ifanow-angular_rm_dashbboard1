import { Component, OnInit } from '@angular/core';
import { AddNewRoleComponent } from '../../../setting-entry/add-new-role/add-new-role.component';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'del'];
  dataSource = ELEMENT_DATA;
  constructor(private subInjectService: SubscriptionInject, public eventService: EventService) { }
  addNewRoles(data) {
    const fragmentData = {
      flag: 'app-upper-setting',
      id: 1,
      data,
      direction: 'top',
      componentName: AddNewRoleComponent,
      state: 'open'
    };
    const rightSideDataSub = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  ngOnInit() {
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