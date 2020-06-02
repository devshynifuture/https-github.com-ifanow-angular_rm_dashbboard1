import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ReconciliationService } from '../../backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { BackofficeFileUploadService } from '../backoffice-file-upload.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-backoffice-file-upload-aum',
  templateUrl: './backoffice-file-upload-aum.component.html',
  styleUrls: ['./backoffice-file-upload-aum.component.scss']
})
export class BackofficeFileUploadAumComponent implements OnInit {

  displayedColumns: string[] = ['name', 'rt', 'uploadDate', 'uploadedBy', 'status', 'download'];
  advisorId: any;
  isLoading = false;
  listData: any = [];
  dataSource = new MatTableDataSource([{}, {}, {}]);
  rtList = [];
  @ViewChild(MatSort, { static: true }) sortList: MatSort;

  constructor(
    private reconService: ReconciliationService,
    private BackOffice: BackofficeFileUploadService
  ) { }


  ngOnInit() {
    this.isLoading = true;
    this.advisorId = AuthService.getAdvisorId();
    this.getBackOfficeFolio();
    this.getRtNamesAndType();
  }

  getRtNamesAndType() {
    this.reconService.getRTListValues({})
      .subscribe(res => {
        if (res) {
          console.log("this is rtlist", res);
          this.rtList = res;
        }
      })
  }

  // getRtName(value) {
  //   return this.rtList.find(c => { c.id === value }).name;
  // }

  getBackOfficeFolio() {
    this.reconService.getBackofficeFolioAumList({ advisorId: this.advisorId })
      .subscribe((data) => {
        if (data) {
          this.listData = data;
          this.dataSource.data = this.listData;
          this.dataSource.sort = this.sortList;
          this.isLoading = false;
        } else {
          this.dataSource.data = null
          this.isLoading = false;
        }
      });
  }


}
