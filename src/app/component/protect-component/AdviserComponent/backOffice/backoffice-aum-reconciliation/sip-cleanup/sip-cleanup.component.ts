import { ReconciliationService } from "./../reconciliation/reconciliation.service";
import { SelectionModel } from "@angular/cdk/collections";
import { EventService } from "./../../../../../../Data-service/event.service";
import { BackOfficeService } from "src/app/component/protect-component/AdviserComponent/backOffice/back-office.service";
import { AuthService } from "./../../../../../../auth-service/authService";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { UtilService } from "src/app/services/util.service";
import { RecordDetailsComponent } from "./record-details/record-details.component";
import { SubscriptionInject } from "../../../Subscriptions/subscription-inject.service";
import { MatTableDataSource, MatSort } from "@angular/material";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { element } from 'protractor';
import { DatePipe } from '@angular/common';

@Component({
  selector: "app-sip-cleanup",
  templateUrl: "./sip-cleanup.component.html",
  styleUrls: ["./sip-cleanup.component.scss"],
})
export class SipCleanupComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    "checkbox",
    "position",
    "name",
    "weight",
    "rdate",
    "fdate",
    "tdate",
    // "symbol",
    "tra",
    "action",

    // "menu",
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableData: any;
  showMultipleKeepBtn: boolean;
  selectedData: any;
  selectedRow: any = [];

  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private backOfficeService: BackOfficeService,
    private fb: FormBuilder,
    private reconService: ReconciliationService,
    private datePipe: DatePipe
  ) { }

  advisorId = AuthService.getAdvisorId();

  isLoading = false;

  selection = new SelectionModel<any>(true, []);

  filterForm: FormGroup;

  filterSub: Subscription = null;
  filterSub2: Subscription = null;
  brokerList = [];
  filterSearchForm: FormControl;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    let numRows;
    if (this.dataSource.filteredData !== null) {
      numRows = this.dataSource.filteredData.length;
    } else {
      numRows = 0;
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.showMultipleKeepBtn = false;
    } else {
      this.dataSource.filteredData.forEach((row) => this.selection.select(row));
      this.showMultipleKeepBtn = true;
    }
  }

  ngOnDestroy() {
    if (this.filterSub) {
      this.filterSub.unsubscribe();
    }
    if (this.filterSub2) {
      this.filterSub2.unsubscribe();
    }
  }

  setMultipleKeepOrRemove(keepOrRemove) {
    let dataArrayValue = [];
    if (this.selection.hasValue) {
      this.selection.selected.forEach(element => {
        dataArrayValue.push({
          id: element.id,
          removeStatus: keepOrRemove
        })
      });
    }
    this.putSipCleanUpFolioKeepOrRemove(dataArrayValue, 'multiple');
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.position + 1
      }`;
  }

  ngOnInit() {
    this.initPoint();
  }

  initPoint() {
    this.filterForm = this.fb.group({
      activeCeased: [-1],
      markUnmark: [0],
      brokerCode: [-1],
    });

    this.filterSearchForm = new FormControl();

    // this.filterSub2 = this.filterSearchForm.valueChanges.subscribe((res) => {
    //   this.filterTableValues(res);
    // });

    this.reconService
      .getBrokerListValues({ advisorId: this.advisorId })
      .subscribe((res) => {
        if (res) {
          this.brokerList = res;
          if (this.brokerList.length == 1) {
            this.filterForm.get("brokerCode").setValue(this.brokerList[0].id);
            this.filterForm.get("brokerCode").disable()
          } else {
            this.filterForm.get("brokerCode").enable();
            this.filterForm.get("brokerCode").setValue(-1);
          }
        }
        this.getSipCleanUpList(true);
      });

    this.filterSub = this.filterForm.valueChanges.subscribe((res) => {
      this.getSipCleanUpList(true);
    });
    // this.getSipCleanUpList(false);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
    // if (this.dataSource.filteredData.length == 0) {
    //   this.noData = 'No mandates found';
    // }
  }

  getSipCleanUpList(byFilter) {
    let data;
    if (byFilter) {
      data = {
        advisorId: this.advisorId,
        arnRiaDetailsId: this.filterForm.get("brokerCode").value,
        markedStatus: this.filterForm.get("markUnmark").value,
        activeStatus: this.filterForm.get("activeCeased").value,
      };
      this.dataSource.data = ELEMENT_DATA;
    } else {
      data = {
        advisorId: this.advisorId,
        arnRiaDetailsId: -1,
        markedStatus: 0,
        activeStatus: -1,
      };
    }

    this.isLoading = true;
    this.backOfficeService.getSipCleanUpListData(data).subscribe(
      (res) => {
        this.isLoading = false;
        if (res) {
          console.log("this is backoffice sip cleanup data", res);
          res.map(element => {
            element.registeredDate = this.datePipe.transform(element.registeredDate, 'dd/MM/yy');
            element.from_date = this.datePipe.transform(element.from_date, 'dd/MM/yy')
            element.to_date = this.datePipe.transform(element.to_date, 'dd/MM/yy')
          })
          this.dataSource.data = res;
          this.tableData = res;
        } else {
          // this.eventService.openSnackBar("No Data Found!", "DISMISS");
          this.dataSource.data = null;
          this.dataSource.filteredData = []
          this.tableData = null;
        }
      },
      (err) => {
        this.dataSource.data = null;
        this.dataSource.filteredData = []
        this.tableData = null;
        console.error(err)
      }
    );
  }

  putSipCleanUpFolioKeepOrRemove(value, singleOrMultiple) {
    this.backOfficeService.putSipCleanUpUpdateStatus(value).subscribe((res) => {
      if (res) {
        console.log(res);
        this.eventService.openSnackBar('Successfully Changed Status.', "DISMISS");
        if (singleOrMultiple === 'single') {
          let index = this.dataSource.data.indexOf(this.selectedData);
          this.dataSource.data[index]['removeStatus'] = value[0].removeStatus;

          let index1 = this.tableData.indexOf(this.selectedData);
          this.tableData[index1].removeStatus = value[0].removeStatus;

        } else if (singleOrMultiple == 'multiple') {
          this.selection.selected.map(item => {
            item.removeStatus = value[0].removeStatus;
            let objIndex = this.tableData.indexOf(item);

            this.tableData[objIndex].removeStatus = value[0].removeStatus;
          });
        }
        this.getSipCleanUpList(true);
      } else {
        this.eventService.openSnackBar('Failed to change Status!', "DISMISS");
      }
    }, err => console.error(err));
  }

  filterTableValues(value) {
    if (value !== "") {
      if (this.tableData && this.tableData.length !== 0) {
        let filteredTable = [];
        filteredTable = this.tableData.filter((item) => {
          return (
            item.investorName.toLowerCase().includes(value.toLowerCase()) ||
            item.schemeName.toLowerCase().includes(value.toLowerCase()) ||
            item.transactionNumber.toLowerCase().includes(value)
          );
        });

        this.dataSource.data = filteredTable;
      }
    } else {
      this.dataSource.data = this.tableData;
    }
  }

  selectMultipleData(flag, value, index) {
    (flag == true) ? this.selectedRow.push(value) : this.selectedRow.splice(index, 1)
  }

  selectAllData(flag) {
    if (flag == true) {
      this.selectedRow = []
      this.dataSource.data.forEach(element => {
        this, this.selectedRow.push(element)
      })
    }
    else {
      this.selectedRow = []
    }
  }

  setKeepOrRemove(data, choice) {
    let index = this.tableData.indexOf(data);
    this.selectedData = data;
    let dataObjArr = [];

    if (choice === "keep") {
      // data.removeStatus = 0;
      // this.tableData[index].removeStatus = 0;
      if (this.selectedRow.length > 0) {
        this.selectedRow.forEach(element => {
          dataObjArr.push({
            id: element.id,
            removeStatus: 0
          });
        });
      }
      else {
        dataObjArr.push({
          id: data.id,
          removeStatus: 0
        });
      }

    } else if (choice === "remove") {
      // data.removeStatus = 1;
      // this.tableData[index].removeStatus = 1;
      if (this.selectedRow.length > 0) {
        this.selectedRow.forEach(element => {
          dataObjArr.push({
            id: element.id,
            removeStatus: 1
          })
        })
      }
      else {
        dataObjArr.push({
          id: data.id,
          removeStatus: 1
        })
      }
    }

    this.putSipCleanUpFolioKeepOrRemove(dataObjArr, 'single');
  }

  openRecordDeatils(data) {
    const fragmentData = {
      id: 1,
      state: "open35",
      data,
      componentName: RecordDetailsComponent,
    };
    const rightSideDataSub = this.subInjectService
      .changeNewRightSliderState(fragmentData)
      .subscribe((sideBarData) => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();
        }
      });
  }
}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  tra: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: "",
    name: "",
    weight: "",
    symbol: "",
    tra: "",
  },
  {
    position: "",
    name: "",
    weight: "",
    symbol: "",
    tra: "",
  },
  {
    position: "",
    name: "",
    weight: "",
    symbol: "",
    tra: "",
  },
];
