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
  selector: 'app-backoffice-file-upload-folio',
  templateUrl: './backoffice-file-upload-folio.component.html',
  styleUrls: ['./backoffice-file-upload-folio.component.scss']
})
export class BackofficeFileUploadFolioComponent implements OnInit {
  displayedColumns: string[] = ['name', 'rt', 'uploadDate', 'uploadedBy', 'status', 'download'];
  advisorId: any;
  isLoading = false;
  listData: any = [];
  dataSource = new MatTableDataSource([{}, {}, {}]);
  @ViewChild(MatSort, { static: true }) sortList: MatSort;
  rtList = [];
  filter: any = {
    rt: 0,
    status: 2
  };

  constructor(
    private reconService: ReconciliationService,
    private BackOffice: BackofficeFileUploadService
  ) { }

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
            this.getBackOfficeFolio(this.filter);
          });
          this.getBackOfficeFolio(this.filter);
        }
      })
  }

  getRtNameFromRtId(id) {
    if (typeof id === 'number') {
      return this.rtList.find(c => c.id === id).name;
    }
  }

  getBackOfficeFolio(filter) {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    let obj = {
      advisorId: this.advisorId,
      rt: filter.rt,
      status: filter.status
    }
    this.reconService.getBackOfficeFolio(obj).subscribe((data) => {
      if (data) {
        data.map(element => {
          element.rt = this.getRtNameFromRtId(parseInt(element.rt));

          if(!isNaN(Number(element.rt))){
            element.rt = this.getRtNameFromRtId(parseInt(element.rt));
          }
          if (element.processStatus === 0) {
            element.status = "Pending";
          } else if (element.processStatus === 1) {
            element.status = "Success";
          } else if (element.processStatus === -1) {
            element.status = "Duplicate";
          } else {
            element.status = "Failed";
          }
        });

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
    });
  }

  ngOnDestroy() {
    if (this.unSubcrip) {
      this.unSubcrip.unsubscribe();
    }
  }

}
