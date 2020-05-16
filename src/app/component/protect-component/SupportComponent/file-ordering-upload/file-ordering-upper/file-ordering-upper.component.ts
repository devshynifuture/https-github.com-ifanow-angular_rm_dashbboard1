import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { EventService } from './../../../../../Data-service/event.service';
import { FileOrderingDetailComponent } from '../file-ordering-detail/file-ordering-detail.component';
import { UtilService } from 'src/app/services/util.service';
import { FileOrderingUploadService } from '../file-ordering-upload.service';
import { SupportService } from '../../support.service';
import { SelectionModel } from '@angular/cdk/collections';
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
  displayedColumns: string[] = ['checkbox', 'advisorName', 'arnRia', 'fileType', 'fileOrderTime', 'status', 'referenceId', 'inFileOrAdded', 'fileName', 'fileUrl', 'errorMsg', 'action'];

  dataSource = new MatTableDataSource<fileOrderingUpperI>(ELEMENT_DATA);
  data;
  isLoading: boolean = false;
  fileTypeList = [];
  arrayOfIdsForRetry: any[] = [];

  selection = new SelectionModel<fileOrderingUpperI>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    let numRows;
    if (this.dataSource.data) {
      numRows = this.dataSource.data.length;
    } else {
      numRows = 0;
    }
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.arrayOfIdsForRetry = [];
    } else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row)
        if (!this.arrayOfIdsForRetry.includes(row['id'])) {
          this.arrayOfIdsForRetry.push(row['id']);
        }
      });
    }

    console.log(this.arrayOfIdsForRetry);
  }

  checkboxLabel(row?: fileOrderingUpperI): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  ngOnInit() {
    this.fileTypeName();
  }

  fileTypeName() {
    this.isLoading = true;
    this.supportService.getFileTypeOrder({})
      .subscribe(res => {
        if (res && res.length !== 0) {
          this.fileTypeList = res;
          if (this.data.flag === 'historical') {
            this.fileOrderingListData();
          } else if (this.data.flag === 'bulk') {
            this.fileOrderBulkListData();
          }
        }
        console.log(res);
      })
  }

  fileOrderBulkListData() {
    this.isLoading = true;
    let tableData = [];
    let reqObj;
    if (this.data.status !== 'total') {
      let status = this.data.status === 'inqueue' ? 1 : (this.data.status === 'ordered' ? 2 : (this.data.status === 'uploaded' ? 3 : (this.data.status === 'skipped' ? 4 : null)))
      reqObj = {
        bulkFileOrderId: this.data.id,
        status
      }
    } else {
      reqObj = {
        bulkFileOrderId: this.data.id,
      }
    }

    this.fileOrderingService.getFileOrderBulkUpperListData(reqObj)
      .subscribe(res => {
        this.isLoading = false;
        if (res && res.length !== 0) {
          console.log(res);
          res.forEach((element, index) => {

            this.fileTypeList.forEach(item => {
              if (item.id === element.fileTypeId) {
                this.fileName = item.type;
              }
            });

            tableData.push({
              id: element.id,
              position: index + 1,
              advisorName: element.advisorName,
              arnRia: element.arnOrRia === 1 ? 'ARN' + element.arnRiaNumber : 'RIA' + element.arnRiaNumber,
              fileType: this.fileName,
              fileOrderTime: element.fileOrderDateTime,
              status: element.status,
              referenceId: element.referenceId ? element.referenceId : '-',
              inFileOrAdded: element.totalTransactions + "/" + element.transactionAdded,
              fileName: element.fileName ? element.fileName : '-',
              errorMsg: element.errorMsg ? element.errorMsg : '-',
              action: '',
              fromDate: element.fromDate,
              toDate: element.toDate,
              fileUrl: element.fileUrl ? element.fileUrl : null
            })
          });
          this.dataSource.data = tableData;
        } else {
          this.dataSource.data = null;
          this.eventService.openSnackBar("No Data Found", "DISMISS");
        }
      }, err => {
        this.eventService.openSnackBar("Something went wrong", "DISMISS");
      })
  }

  consoleData(element) {
    console.log("this is element:::", element);
  }

  fileOrderRetry(value) {
    if (this.arrayOfIdsForRetry.length !== 0) {

      let data;
      if (value === null) {
        data = {
          ids: [...this.arrayOfIdsForRetry],
          isHistorical: this.data.flag == 'historical' ? true : false
        }
      } else if (value !== null) {
        data = {
          ids: value,
          isHistorical: this.data.flag == 'historical' ? true : false
        }
      }
      console.log(this.arrayOfIdsForRetry);
      this.fileOrderingService.putFileOrderRetry(data)
        .subscribe(res => {
          if (res) {
            console.log("this is retry files res:::", res);
            this.dataSource.data = ELEMENT_DATA;
            this.selection.clear();
            this.data.flag == 'historical' ? this.fileOrderingListData() : this.fileOrderBulkListData()

          }
        }, err => {
          this.eventService.openSnackBar(err, "DISMISS");
        })

    } else {
      this.eventService.openSnackBar("No Files Selected to Retry", "DISMISS");
    }
  }

  fileOrderingListData() {
    this.isLoading = true;
    let tableData = [];
    let reqObj;
    if (this.data.status !== 'total') {
      let status = this.data.status === 'inqueue' ? 1 : (this.data.status === 'ordered' ? 2 : (this.data.status === 'uploaded' ? 3 : (this.data.status === 'skipped' ? 4 : null)))
      reqObj = {
        arnRiaDetailId: this.data.arnRiaDetailId,
        days: this.data.days,
        rmId: this.data.rmId,
        rtId: this.data.rtId,
        startedOn: this.data.startedOn,
        status
      }
    } else {
      reqObj = {
        arnRiaDetailId: this.data.arnRiaDetailId,
        days: this.data.days,
        rmId: this.data.rmId,
        rtId: this.data.rtId,
        startedOn: this.data.startedOn
      }
    }

    this.fileOrderingService.getFileOrderHistoricalUpperListData(reqObj)
      .subscribe(res => {
        this.isLoading = false;
        if (res && res.length !== 0) {
          console.log(res);
          res.forEach((element, index) => {

            this.fileTypeList.forEach(item => {
              if (item.id === element.fileTypeId) {
                this.fileName = item.type;
              }
            });

            tableData.push({
              id: element.id,
              position: index + 1,
              advisorName: this.data.advisorName,
              arnRia: element.arnOrRia === 1 ? 'ARN' + element.arnRiaNumber : 'RIA' + element.arnRiaNumber,
              fileType: this.fileName,
              fileOrderTime: element.fileOrderDateTime,
              status: element.status,
              referenceId: element.referenceId ? element.referenceId : '-',
              inFileOrAdded: element.totalTransactions + "/" + element.transactionAdded,
              fileName: element.fileName ? element.fileName : '-',
              errorMsg: element.errorMsg ? element.errorMsg : '-',
              action: '',
              fromDate: element.fromDate,
              toDate: element.toDate,
              fileUrl: element.fileUrl ? element.fileUrl : null
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

  creatingArrayIdValue(event, row) {
    if (event.checked === true) {
      this.selection.toggle(row);
      if (!this.arrayOfIdsForRetry.includes(row.id)) {
        this.arrayOfIdsForRetry.push(row.id);
      }
    }
    else if (event.checked === false) {
      this.selection.toggle(row);
      this.arrayOfIdsForRetry = this.arrayOfIdsForRetry.filter(item => {
        return item !== row.id;
      });
    }
  }

  dialogClose(flag) {
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: flag });
  }

  refreshList() {
    this.dataSource.data = ELEMENT_DATA;
    if (this.data.flag == 'historical') {
      this.fileOrderingListData();
    } else {
      this.fileOrderBulkListData();
    }
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
  { checkbox: '', position: '', advisorName: '', arnRia: '', fileType: '', fileOrderTime: '', status: '', referenceId: '', inFileOrAdded: '', fileName: '', fileUrl: '', failedReason: '', action: '' },
  { checkbox: '', position: '', advisorName: '', arnRia: '', fileType: '', fileOrderTime: '', status: '', referenceId: '', inFileOrAdded: '', fileName: '', fileUrl: '', failedReason: '', action: '' },
  { checkbox: '', position: '', advisorName: '', arnRia: '', fileType: '', fileOrderTime: '', status: '', referenceId: '', inFileOrAdded: '', fileName: '', fileUrl: '', failedReason: '', action: '' }
]

export interface fileOrderingUpperI {
  position: string;
  checkbox: string;
  advisorName: string;
  arnRia: string;
  fileType: string;
  fileOrderTime: string;
  status: string;
  referenceId: string;
  inFileOrAdded: string;
  fileName: string;
  fileUrl: string,
  failedReason: string;
  action: string;
}