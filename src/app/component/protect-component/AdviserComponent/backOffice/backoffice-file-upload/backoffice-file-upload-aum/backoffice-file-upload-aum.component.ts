import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort, MatTableDataSource } from "@angular/material";
import { ReconciliationService } from "../../backoffice-aum-reconciliation/reconciliation/reconciliation.service";
import { BackofficeFileUploadService } from "../backoffice-file-upload.service";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth-service/authService";

@Component({
  selector: "app-backoffice-file-upload-aum",
  templateUrl: "./backoffice-file-upload-aum.component.html",
  styleUrls: ["./backoffice-file-upload-aum.component.scss"],
})
export class BackofficeFileUploadAumComponent implements OnInit {
  displayedColumns: string[] = [
    "name",
    "rt",
    "uploadDate",
    "uploadedBy",
    "status",
    "download",
  ];
  advisorId: any;
  isLoading = false;
  listData: any = [];
  dataSource = new MatTableDataSource([{}, {}, {}]);
  rtList = [];
  filter: any = {
    rt: 0,
    status: 2,
  };
  private unSubcrip: Subscription;
  @ViewChild(MatSort, { static: true }) sortList: MatSort;

  constructor(
    private reconService: ReconciliationService,
    private BackOffice: BackofficeFileUploadService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.advisorId = AuthService.getAdvisorId();
    this.getRtNamesAndType();
  }

  getRtNamesAndType() {
    this.reconService.getRTListValues({}).subscribe((res) => {
      if (res) {
        this.rtList = res;
        this.unSubcrip = this.BackOffice.getFilterData().subscribe((data) => {
          this.filter = data;
          this.getBackOfficeFolio(this.filter);
        });
        this.getBackOfficeFolio(this.filter);
      }
    });
  }

  getRtNameFromRtId(id) {
    return this.rtList.find((c) => c.id === id).name;
  }

  getBackOfficeFolio(filter) {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    let obj = {
      advisorId: this.advisorId,
      rt: filter.rt,
      status: filter.status,
    };
    this.reconService.getBackofficeFolioAumList(obj).subscribe((data) => {
      if (data) {
        console.log("this is aum file uploaded",data);
        data.map((element) => {
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

  ngOnDestroy(): void {
    this.unSubcrip.unsubscribe();
  }
}
