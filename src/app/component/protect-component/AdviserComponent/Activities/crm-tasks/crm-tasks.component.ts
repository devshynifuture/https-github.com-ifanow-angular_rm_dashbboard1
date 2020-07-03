import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { AddTasksComponent } from './add-tasks/add-tasks.component';

@Component({
  selector: 'app-crm-tasks',
  templateUrl: './crm-tasks.component.html',
  styleUrls: ['./crm-tasks.component.scss']
})
export class CrmTasksComponent implements OnInit {
  displayedColumns: string[] = ['client', 'member', 'des', 'cat', 'assigned', 'dueDate', 'status', 'menuList'];
  dataSource = ELEMENT_DATA;

  constructor(private subInjectService: SubscriptionInject) {
  }

  ngOnInit() {
  }

  openAddTask(data) {
    // let popupHeaderText = !!data ? 'Edit Recurring deposit' : 'Add Recurring deposit';
    const fragmentData = {
      // flag: 'addRecuringDeposit',
      data,
      id: 1,
      state: 'open50',
      componentName: AddTasksComponent,
      // popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }



}
export interface PeriodicElement {
  client: string;
  member: string;
  des: string;
  cat: string;
  assigned: string;
  dueDate: string;
  status: string;
  menuList: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    client: 'Rahul Jain',
    member: 'Shreya Jain',
    des: 'Extend the account for another 5 year',
    cat: 'PPF',
    assigned: 'Rahul Jain',
    dueDate: '05/09/2019',
    status: 'Doing',
    menuList: ''
  },
];

