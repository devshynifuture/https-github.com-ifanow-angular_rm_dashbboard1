import { Component, OnInit, ViewChild } from '@angular/core';
import { ReconciliationService } from '../../backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { BackofficeFileUploadService } from '../backoffice-file-upload.service';

export interface PeriodicElement {
  name: string;
  rt: string;
  uploadDate: Date;
  status: string;
  download: string;
  uploadedBy: string;
}


@Component({
  selector: 'app-backoffice-file-upload-sip-stp',
  templateUrl: './backoffice-file-upload-sip-stp.component.html',
  styleUrls: ['./backoffice-file-upload-sip-stp.component.scss']
})
export class BackofficeFileUploadSipStpComponent implements OnInit {
  displayedColumns: string[] = ['name', 'rt', 'uploadDate', 'uploadedBy', 'status', 'download'];
  advisorId: any;
  isLoading = false;
  listData: any = [];
  dataSource = new MatTableDataSource([{}, {}, {}]);
  @ViewChild(MatSort, { static: true }) sortList: MatSort;
  rtList: any = [];
  constructor(private reconService: ReconciliationService, private BackOffice: BackofficeFileUploadService) { }
  filter: any = {
    rt: 0,
    status: 0
  };
  private unSubcrip: Subscription;
  ngOnInit() {
    this.isLoading = true;
    this.advisorId = AuthService.getAdvisorId();
    this.getRtList();
  }

  getRtList() {
    this.reconService.getRTListValues({})
      .subscribe(data => {
        if (data) {
          this.rtList = data;
          this.unSubcrip = this.BackOffice.getFilterData().subscribe((data) => {
            this.filter = data;
            this.getBackOfficeSipStp();
          })
          this.getBackOfficeSipStp();
        }
      })
  }

  getBackOfficeSipStp() {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    this.reconService.getBackOfficeSipStp({ advisorId: this.advisorId }).subscribe((data) => {
      if (data) {
        this.listData = data;
        this.dataSource.data = this.listData;
        if (this.sortList) {
          this.dataSource.sort = this.sortList;
        }
        this.isLoading = false;
      } else {
        this.dataSource.data = [];
        this.isLoading = false;
      }
    })
  }

  ngOnDestroy() {
    if (this.unSubcrip) {
      this.unSubcrip.unsubscribe();
    }
  }
}
