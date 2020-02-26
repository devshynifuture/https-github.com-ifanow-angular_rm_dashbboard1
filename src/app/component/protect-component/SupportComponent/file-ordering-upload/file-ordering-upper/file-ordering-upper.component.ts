import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { EventService } from './../../../../../Data-service/event.service';
import { FileOrderingDetailComponent } from '../file-ordering-detail/file-ordering-detail.component';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-file-ordering-upper',
  templateUrl: './file-ordering-upper.component.html',
  styleUrls: ['./file-ordering-upper.component.scss']
})
export class FileOrderingUpperComponent implements OnInit {

  constructor(
    private eventService: EventService,
    private subInjectService: SubscriptionInject
  ) { }
  displayedColumns: string[] = ['checkbox', 'advisorName', 'arnRia', 'fileType', 'fileOrderTime', 'status', 'referenceId', 'inFileOrAdded', 'fileName', 'failedReason', 'action'];

  dataSource = new MatTableDataSource<fileOrderingUpperI>(ELEMENT_DATA);

  ngOnInit() {
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({ state: 'close' });
  }

  openDetailedView(data) {
    const fragmentData = {
      flag: 'openFileOrderingDetail',
      data,
      id: 1,
      state: 'open35',
      componentName: FileOrderingDetailComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
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

}
const ELEMENT_DATA: fileOrderingUpperI[] = [
  { checkbox: '', advisorName: 'Rahul Jain', arnRia: 'INA000004409', fileType: 'SIP - Ceased', fileOrderTime: '08/01/2020 11:12', status: 'In Queue', referenceId: 'WSREG1103206', inFileOrAdded: '-', fileName: '2344985R2.pdf', failedReason: 'Wrong Password', action: '' },
  { checkbox: '', advisorName: 'Rahul Jain', arnRia: 'INA000004409', fileType: 'SIP - Ceased', fileOrderTime: '08/01/2020 11:12', status: 'In Queue', referenceId: 'WSREG1103206', inFileOrAdded: '-', fileName: '2344985R2.pdf', failedReason: 'Wrong Password', action: '' },
  { checkbox: '', advisorName: 'Rahul Jain', arnRia: 'INA000004409', fileType: 'SIP - Ceased', fileOrderTime: '08/01/2020 11:12', status: 'In Queue', referenceId: 'WSREG1103206', inFileOrAdded: '-', fileName: '2344985R2.pdf', failedReason: 'Wrong Password', action: '' }

]

export interface fileOrderingUpperI {
  checkbox: string;
  advisorName: string;
  arnRia: string;
  fileType: string;
  fileOrderTime: string;
  status: string;
  referenceId: string;
  inFileOrAdded: string;
  fileName: string;
  failedReason: string;
  action: string;
}