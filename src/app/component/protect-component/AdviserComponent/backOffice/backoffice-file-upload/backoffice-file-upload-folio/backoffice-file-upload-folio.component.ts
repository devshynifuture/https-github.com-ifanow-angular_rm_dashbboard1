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
    this.unSubcrip = this.BackOffice.getFilterData().subscribe((data) => {
      this.filter = data;
      this.getBackOfficeFolio(this.filter);
    });
    this.getBackOfficeFolio(this.filter);
  }

  getBackOfficeFolio(filter) {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    this.reconService.getBackOfficeFolio({ advisorId: this.advisorId }).subscribe((data) => {
      if (data) {
        this.listData = data;
        this.dataSource.data = this.listData;
        this.dataSource.sort = this.sortList;
        this.isLoading = false;
      } else {
        this.dataSource.data = null;
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.unSubcrip.unsubscribe();
  }

}
