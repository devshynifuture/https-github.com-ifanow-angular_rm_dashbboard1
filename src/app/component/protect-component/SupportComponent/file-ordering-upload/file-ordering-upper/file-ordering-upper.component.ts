import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { EventService } from './../../../../../Data-service/event.service';
import { FileOrderingDetailComponent } from '../file-ordering-detail/file-ordering-detail.component';
import { UtilService } from 'src/app/services/util.service';
import { FileOrderingUploadService } from '../file-ordering-upload.service';
import { SupportService } from '../../support.service';
@Component({
  selector: 'app-file-ordering-upper',
  templateUrl: './file-ordering-upper.component.html',
  styleUrls: ['./file-ordering-upper.component.scss']
})
export class FileOrderingUpperComponent implements OnInit {
  fileName: any;

  constructor(
    private eventService: EventService,
    private subInjectService: SubscriptionInject,
    private fileOrderingService: FileOrderingUploadService,
    private supportService: SupportService
  ) { }
  displayedColumns: string[] = ['checkbox', 'advisorName', 'arnRia', 'fileType', 'fileOrderTime', 'status', 'referenceId', 'inFileOrAdded', 'fileName', 'failedReason', 'action'];

  dataSource = new MatTableDataSource<fileOrderingUpperI>(ELEMENT_DATA);
  data;
  isLoading: boolean = false;
  fileTypeList = [];

  ngOnInit() {
    this.fileTypeName();
    this.fileOrderingListData();
  }

  fileTypeName() {
    this.supportService.getFileTypeOrder({})
      .subscribe(res => {
        if (res && res.length !== 0) {
          this.fileTypeList = res;
        }
        console.log(res);
      })
  }

  fileOrderingListData() {
    this.isLoading = true;
    let tableData = [];
    const reqObj = {
      arnRiaDetailId: this.data.arnRiaDetailId,
      days: this.data.days,
      rmId: this.data.rmId,
      rtId: this.data.rtId
    }
    this.fileOrderingService.getFileOrderHistoricalUpperListData(reqObj)
      .subscribe(res => {
        this.isLoading = false;
        if (res && res.length !== 0) {
          console.log(res);
          res.forEach(element => {

            this.fileTypeList.forEach(item => {
              if (item.id === element.fileTypeId) {
                this.fileName = item.type;
                console.log(this.fileName);
              }
            });

            tableData.push({
              advisorName: this.data.advisorName,
              arnRia: element.arnOrRia === 1 ? 'ARN' + element.arnRiaNumber : 'RIA' + element.arnRiaNumber,
              fileType: this.fileName,
              fileOrderTime: element.fileOrderDateTime,
              status: element.status,
              referenceId: element.referenceId ? element.referenceId : '-',
              inFileOrAdded: element.totalFiles + "/" + element.transactionAdded,
              fileName: element.fileName ? element.fileName : '-',
              failedReason: element.failedReason ? element.failedReason : '-',
              action: '',
              fromDate: element.fromDate,
              toDate: element.toDate
            })
          });
          this.dataSource.data = tableData;
        } else {
          this.dataSource.data = null;
          this.eventService.openSnackBar("No Data Found", "DISMISS");
        }
      }, err => {
        this.eventService.openSnackBar(err, "DISMISS");
      })
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({ state: 'close' });
  }

  refreshList() {
    this.fileOrderingListData();
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
  { checkbox: '', advisorName: '', arnRia: '', fileType: '', fileOrderTime: '', status: '', referenceId: '', inFileOrAdded: '', fileName: '', failedReason: '', action: '' },
  { checkbox: '', advisorName: '', arnRia: '', fileType: '', fileOrderTime: '', status: '', referenceId: '', inFileOrAdded: '', fileName: '', failedReason: '', action: '' },
  { checkbox: '', advisorName: '', arnRia: '', fileType: '', fileOrderTime: '', status: '', referenceId: '', inFileOrAdded: '', fileName: '', failedReason: '', action: '' }
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