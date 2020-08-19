import { Component, OnInit, ViewChild } from '@angular/core';
import { ReconciliationService } from '../../backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BackofficeFileUploadService } from '../backoffice-file-upload.service';
import { Subscription } from 'rxjs';
import { EventService } from '../../../../../../Data-service/event.service';

export interface PeriodicElement {
  name: string;
  rt: string;
  uploadDate: Date;
  range: string;
  status: string;
  download: string;
  added: Date;
  txnFile: string;
  uploadedBy: string;
}

@Component({
  selector: 'app-backoffice-file-upload-transactions',
  templateUrl: './backoffice-file-upload-transactions.component.html',
  styleUrls: ['./backoffice-file-upload-transactions.component.scss']
})

export class BackofficeFileUploadTransactionsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'rt', 'uploadDate', 'range', 'added', 'txnFile', 'uploadedBy', 'status', 'download'];
  advisorId: any;
  isLoading = false;
  listData: any = [];
  dataSource = new MatTableDataSource([{}, {}, {}]);
  filterObj: any;
  @ViewChild(MatSort, { static: true }) sortList: MatSort;
  constructor(
    private reconService: ReconciliationService,
    public router: ActivatedRoute,
    private BackOffice: BackofficeFileUploadService,
    private eventService: EventService) { }

  filter: any = {
    rt: 0,
    status: 2
  };
  private unSubcrip: Subscription;
  rtList = [];

  ngOnInit() {
    this.isLoading = true;
    this.advisorId = AuthService.getAdvisorId();
    this.getRtNamesAndType();
  }

  getRtNamesAndType() {
    this.reconService.getRTListValues({})
      .subscribe(res => {
        if (res) {
          console.log("this is rtlist", res);
          this.rtList = res;
          this.rtList.map(item=> {
            if(item.name==="FRANKLIN_TEMPLETON"){
              item.name="FRANKLIN";
            }
          })
        }
        this.unSubcrip = this.BackOffice.getFilterData().subscribe((data) => {
          this.filter = data;
          this.getBackOfficeTransactions(this.filter);
        })
        this.getBackOfficeTransactions(this.filter);
      })
  }

  getRtNameFromRtId(id) {
    
    return this.rtList.find(c => c.id === id).name;
  }

  getBackOfficeTransactions(filter) {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    let obj = {
      advisorId: this.advisorId,
      rt: filter.rt,
      status: filter.status
    }

    this.reconService.getBackOfficeTransactions(obj)
      .subscribe((data) => {
        this.isLoading = false;
        if (data) {
          console.log(data);
          data.map(element => {
            if(!isNaN(Number(element.rt))){
              element.rt = this.getRtNameFromRtId(parseInt(element.rt)) + " - " + element.arnRiaNumber ? element.arnRiaNumber : '-';
            } else {
              element.rt = element.rt + "-" + element.arnRiaNumber ? element.arnRiaNumber : '-';
            }
            if (element.processStatus === 0) {
              element.status = "Pending";
            } else if (element.processStatus === 1) {
              element.status = "Success";
            } else if (element.processStatus === -1) {
              element.status = "Duplicate";
            } else if(element.processStatus === 3){
              element.status = "Failed";
            } else if(element.processStatus === 4){
              element.status = "Empty File";
            } else if(element.processStatus === 5){
              element.status = "Wrong ARN Number";
            }
          });
          this.listData = data;

          this.dataSource.data = this.listData;
          if (this.sortList) {
            this.dataSource.sort = this.sortList;
          }
        } else {
          this.dataSource.data = [];
        }
      }, err => {
        this.eventService.openSnackBar(err, "DISMISS")
        this.dataSource.data = [];
      });
  }

  getProcessStatus(statusNumber) {
    if (statusNumber === 0) {
      return 'Pending';
    } else if (statusNumber === 1) {
      return 'Success';
    } else if (statusNumber === 2) {
      return 'Duplicate';
    } else if (statusNumber === 3) {
      return 'Failed';
    } else if (statusNumber === -1) {
      return 'Duplicate';
    }
  }

  ngOnDestroy() {
    if (this.unSubcrip) {
      this.unSubcrip.unsubscribe();
    }
  }
}
