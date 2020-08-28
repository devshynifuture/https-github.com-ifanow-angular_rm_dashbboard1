import { SubscriptionInject } from "./../../../AdviserComponent/Subscriptions/subscription-inject.service";
import { Component, OnInit } from "@angular/core";
import { EventService } from "src/app/Data-service/event.service";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { MatChipInputEvent, MatTableDataSource, MatDialog } from '@angular/material';
import { UpperSliderBackofficeComponent } from "../../common-component/upper-slider-backoffice/upper-slider-backoffice.component";
import { AuthService } from "src/app/auth-service/authService";
import { UtilService } from "src/app/services/util.service";
import { FileOrderingUpperComponent } from "../file-ordering-upper/file-ordering-upper.component";
import { FileOrderingSetupComponent } from "./file-ordering-setup/file-ordering-setup.component";
import { FileOrderingUploadService } from "../file-ordering-upload.service";
import { FormBuilder } from "@angular/forms";
import { ReconciliationService } from '../../../AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { CustomFilterDatepickerDialogComponent } from '../custom-filter-datepicker-dialog.component';

@Component({
  selector: "app-file-ordering-bulk",
  templateUrl: "./file-ordering-bulk.component.html",
  styleUrls: ["./file-ordering-bulk.component.scss"],
})
export class FileOrderingBulkComponent implements OnInit {
  rmList: any[] = [];
  isLoading: boolean = false;
  customDateFilterValue: any;

  constructor(
    private eventService: EventService,
    private subInjectService: SubscriptionInject,
    private fileOrderingUploadService: FileOrderingUploadService,
    private fb: FormBuilder,
    private utilService: UtilService,
    private reconService: ReconciliationService,
    public dialog: MatDialog
  ) { }
  displayedColumns: string[] = [
    "rta",
    "description",
    "orderedBy",
    "startedOn",
    "totalFiles",
    "queue",
    "ordering",
    "ordered",
    "failed",
    "uploaded",
    "refresh"
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  filterForm = this.fb.group({
    filterByName: [,],
    filterByRmName: [,],
    filterByPeriod: [,],
    filterByRta: [,],
  });
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  filterBy = [];
  rmId = AuthService.getRmId() ? AuthService.getRmId() : 2;

  periodList = [
    {
      name: "Today",
      value: 0,
      type: "period",
    },
    {
      name: "Yesterday",
      value: 1,
      type: "period",
    },
    {
      name: "Yesterday + Today",
      value: 2,
      type: "period",
    },
    {
      name: "Last 7 Days",
      value: 7,
      type: "period",
    },
    {
      name: "Custom Date",
      value: 3,
      type: "period",
    },
  ];

  rtaList = [];

  days = 2;
  rtId;

  getRtaList() {
    this.isLoading = true;
    this.reconService.getRTListValues({})
      .subscribe(res => {
        if (res && res.length !== 0) {
          res.forEach(element => {
            if (element.name !== 'MANUAL') {
              if (element.name === 'All') {
                this.rtId = element.id;
              }
              if (element.name !== 'SUNDARAM' && element.name !== 'PRUDENT' && element.name !== 'NJ_NEW' && element.name !== 'NJ') {
                this.rtaList.push({
                  name: element.name == 'FRANKLIN_TEMPLETON' ? 'FRANKLIN' : element.name,
                  value: element.id,
                  type: 'rta'
                });
              }
            }
          });
          this.getRmMasterDetails();
        } else {
          this.eventService.openSnackBar("Error In Fetching RTA List", "DISMISS");
        }
      });
  }

  openDialogCustomDateForFilter() {
    const dialogRef = this.dialog.open(CustomFilterDatepickerDialogComponent, {
      width: '700px',
      data: ''
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log('The dialog was closed', res);
      this.customDateFilterValue = res;

      if (res) {
        this.filterBy = [];
        const defaultRmName = this.rmList.find((c) => c.id === this.rmId);
        this.filterBy.push({ name: defaultRmName.name, type: 'rm' });
        this.filterForm.get("filterByRmName").setValue(defaultRmName);

        const defaultPeriod = this.periodList.find((c) => c.value === 0);
        this.filterBy.push({ name: defaultPeriod.name, type: 'period' });
        this.filterForm.get("filterByPeriod").setValue(defaultPeriod);

        const defaultRta = this.rtaList.find((c) => c.value === 0);
        this.filterForm.get("filterByRta").setValue(defaultRta);
        this.filterBy.push({ name: defaultRta.name, type: 'rta' });
        this.dataSource.data = ELEMENT_DATA;
        this.fileOrderBulkHistoryListGet({
          fromDate: res.fromDate,
          toDate: res.toDate
        });
      } else {
        this.eventService.openSnackBar("ABORTED!!", "DISMISS");
      }

    });
  }

  setFilterFormValueChanges() {
    this.filterForm.valueChanges
      .subscribe(res => {
        if (res) {
          let obj = {};
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              const element = res[key];
              if (element) {
                if (typeof (element) === 'string') {
                  obj['advisorName'] = element;
                }
                if (typeof (element) === 'object' && element.type == 'rm') {
                  obj['rmId'] = element.id;
                }
                if (typeof (element) === 'object' && element.type == 'period') {
                  obj['days'] = element.value;
                }
                if (typeof (element) === 'object' && element.type == 'rta') {
                  obj['rtId'] = element.value;
                }
              }
            }
          }

          if (!this.utilService.isEmptyObj(obj)) {
            if (obj['days'] !== 3) {
              this.dataSource.data = ELEMENT_DATA;
              this.fileOrderBulkHistoryListGet(obj);
            }
          }
        }
      });
  }

  ngOnInit() {
    this.getRtaList();
  }

  defaultSelectionInFilter() {
    const defaultRmName = this.rmList.find((c) => c.id === this.rmId);
    this.filterForm.get("filterByRmName").setValue(defaultRmName);
    this.filterBy.push({ name: defaultRmName.name, type: 'rm' });

    const defaultPeriod = this.periodList.find((c) => c.value === 2);
    this.filterForm.get("filterByPeriod").setValue(defaultPeriod);
    this.filterBy.push({ name: defaultPeriod.name, type: 'period' });

    const defaultRta = this.rtaList.find((c) => c.value === 0);
    this.filterForm.get("filterByRta").setValue(defaultRta);
    this.filterBy.push({ name: defaultRta.name, type: 'rta' });
    this.setFilterFormValueChanges();

    this.fileOrderBulkHistoryListGet({
      days: this.filterForm.get("filterByPeriod").value.value,
      rtId: this.filterForm.get("filterByRta").value.value,
      rmId: this.filterForm.get("filterByRmName").value.id,
    });
  }
  getRmMasterDetails() {
    this.fileOrderingUploadService.getRmMasterUserData({}).subscribe((data) => {
      if (data && data.length !== 0) {
        data.forEach((element) => {
          element.type = "rm";
        });
        this.rmList = data;
        this.defaultSelectionInFilter();
      } else {
        this.eventService.openSnackBar("No Rm Data Found!", "Dismiss");
      }
    });
  }

  getRtName(id) {
    let obj = this.rtaList.find(c => c.value === id);
    return obj.name;
  }

  refreshRowList(element, index) {
    element.isLoading = true;
    let data = {
      bulkOrderId: element.id
    }
    this.fileOrderingUploadService.getFileOrderRefreshBulkPerRowData(data)
      .subscribe(res => {
        if (res) {
          element.advisorName = res.advisorName ? res.advisorName : "-";
          element.rta = this.getRtName(res.rtId);
          element.orderedBy = res.rmName ? res.rmName : "-";
          element.startedOn = res.startedOn ? res.startedOn : "-";
          element.totalFiles = res.totalFiles ? res.totalFiles : "-";
          element.queue = res.inqueue;
          element.ordering = res.orderingFrequency
            ? res.orderingFrequency
            : "-",
            element.ordered = res.ordered;
          element.failed = res.skipped;
          element.uploaded = res.uploaded;
          element.refresh = "";
          element.rtId = res.rtId;
          element.rmId = res.rmId;
          element.arnRiaDetailId = res.arnRiaDetailId;
          element.description = res.description;
          element.fromDate = res.fromDate;
          element.toDate = res.toDate;
          element.id = res.id;
          element.isLoading = false;
        }
      })
  }

  fileOrderBulkHistoryListGet(data) {
    this.fileOrderingUploadService
      .getBulkFileOrderListData(data)
      .subscribe((data) => {
        if (data) {
          this.isLoading = false;
          let tableData = [];
          console.log("this is what i got:", data);
          data.forEach((element) => {
            tableData.push({
              advisorName: element.advisorName ? element.advisorName : "-",
              rta: this.getRtName(element.rtId),
              orderedBy: element.rmName ? element.rmName : "-",
              startedOn: element.startedOn ? element.startedOn : "-",
              totalFiles: element.totalFiles || element.totalFiles ? element.totalFiles : "-",
              queue: element.inqueue || element.inqueue == 0 ? element.inqueue: '-',
              ordering: element.orderingFrequency || element.orderingFrequency == 0
                ? element.orderingFrequency
                : "-",
              ordered: element.ordered || element.ordered == 0 ? element.ordered:'-',
              failed: element.skipped || element.skipped == 0 ? element.skipped : '-',
              uploaded: element.uploaded || element.uploaded == 0? element.uploaded : '-',
              refresh: "",
              rtId: element.rtId,
              rmId: element.rmId,
              days: this.days,
              arnRiaDetailId: element.arnRiaDetailId,
              description: element.description,
              fromDate: element.fromDate,
              toDate: element.toDate,
              id: element.id,
              isLoading: false
            });
          });

          console.log("this is table Data", tableData);

          this.dataSource.data = tableData;
        } else {
          this.eventService.openSnackBar("No Data Found", "Dismiss");
          this.dataSource.data = null;
        }
      });
  }

  maniputateEventObjForName(event) {
    let name = event.value;
    event.value = {
      type: "name",
      name,
    };
    this.add(event, 'name');
  }

  openUpperFileOrdering(flag, status, data) {
    data.flag = flag;
    data.status = status;
    const fragmentData = {
      flag,
      id: 1,
      data,
      direction: "top",
      componentName: FileOrderingUpperComponent,
      state: "open",
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService
      .changeUpperSliderState(fragmentData)
      .subscribe((upperSliderData) => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          if (UtilService.isRefreshRequired(upperSliderData)) {
            let days = this.filterForm.get("filterByPeriod").value ? this.filterForm.get("filterByPeriod").value.value : null;
            let rtId = this.filterForm.get("filterByRta").value ? this.filterForm.get("filterByRta").value.value : null;
            let rmId = this.filterForm.get("filterByRmName").value ? this.filterForm.get("filterByRmName").value.value : null;

            if (days && rtId && rmId) {
              this.filterBy = [];
              this.filterForm.patchValue({ filterByName: undefined, filterByRmName: undefined, filterByPeriod: undefined, filterByRta: undefined });
              this.fileOrderBulkHistoryListGet({
                days,
                rtId,
                rmId,
              });
            } else {
              this.filterBy = [];
              this.filterForm.patchValue({ filterByName: undefined, filterByRmName: undefined, filterByPeriod: undefined, filterByRta: undefined });
              this.fileOrderBulkHistoryListGet({
                days: 2,
                rmId: this.rmId
              })
            }
          }
          subscription.unsubscribe();
        }
      });
  }

  openUpperBulkFileOrdering(data) {
    const fragmentData = {
      flag: "openFileOrderingSetup",
      data,
      id: 1,
      state: "open45",
      componentName: FileOrderingSetupComponent,
    };

    const rightSideDataSub = this.subInjectService
      .changeNewRightSliderState(fragmentData)
      .subscribe((sideBarData) => {
        console.log("this is sidebardata in subs subs : ", sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            let days = this.filterForm.get("filterByPeriod").value ? this.filterForm.get("filterByPeriod").value.value : null;
            let rtId = this.filterForm.get("filterByRta").value ? this.filterForm.get("filterByRta").value.value : null;
            let rmId = this.filterForm.get("filterByRmName").value ? this.filterForm.get("filterByRmName").value.value : null;
            if (days && rtId && rmId) {
              this.filterBy = [];
              this.filterForm.patchValue({ filterByName: undefined, filterByRmName: undefined, filterByPeriod: undefined, filterByRta: undefined });
              this.fileOrderBulkHistoryListGet({
                days: this.filterForm.get("filterByPeriod").value.value,
                rtId: this.filterForm.get("filterByRta").value.value,
                rmId: this.filterForm.get("filterByRmName").value.id,
              });
            } else {
              this.filterBy = [];
              this.filterForm.patchValue({ filterByName: undefined, filterByRmName: undefined, filterByPeriod: undefined, filterByRta: undefined });
              this.fileOrderBulkHistoryListGet({
                days: 2,
                rmId: this.rmId,
              });
            }
            console.log(
              "this is sidebardata in subs subs 3 ani: ",
              sideBarData
            );
          }
          rightSideDataSub.unsubscribe();
        }
      });
  }

  add(event, type): void {
    let input;
    let value;
    if (event.hasOwnProperty('input')) {
      input = event.input;
    }
    if (event.value !== "") {
      value = event.value["name"];
    }
    // removing item pf same filter type
    this.filterBy = this.filterBy.filter(item => {
      return item.type !== type;
    })

    // Add our filterBy
    if ((value || "").trim()) {
      this.filterBy.push({ name: value.trim(), type });
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }
  openUpperModule(flag, data) {
    const fragmentData = {
      flag: "clients",
      id: 1,
      data,
      direction: "top",
      componentName: UpperSliderBackofficeComponent,
      state: "open",
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService
      .changeUpperSliderState(fragmentData)
      .subscribe((upperSliderData) => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      });
  }

  remove(filterBy): void {
    const index = this.filterBy.indexOf(filterBy);

    if (filterBy.type === 'name') {
      this.filterForm.patchValue({ filterByName: undefined });
    }
    if (filterBy.type === 'rm') {
      this.filterForm.patchValue({ filterByRmName: undefined });
    }
    if (filterBy.type === 'period') {
      this.filterForm.patchValue({ filterByPeriod: undefined });
    }
    if (filterBy.type === 'rta') {
      this.filterForm.patchValue({ filterByRta: undefined });
    }
    if (index >= 0) {
      this.filterBy.splice(index, 1);
      this.fileOrderBulkHistoryListGet({
        days: 0,
        rmId: this.rmId
      })
    }
  }
}

export interface PeriodicElement {
  rta: string;
  description: string;
  orderedby: string;
  startedOn: string;
  totalfiles: string;
  queue: string;
  ordering: string;
  ordered: string;
  failed: string;
  uploaded: string;
  refresh: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    rta: "",
    description: "",
    orderedby: "",
    startedOn: "",
    totalfiles: "",
    queue: "",
    ordering: "",
    ordered: "",
    failed: "",
    uploaded: "",
    refresh: "",
  },
  {
    rta: "",
    description: "",
    orderedby: "",
    startedOn: "",
    totalfiles: "",
    queue: "",
    ordering: "",
    ordered: "",
    failed: "",
    uploaded: "",
    refresh: "",
  },
  {
    rta: "",
    description: "",
    orderedby: "",
    startedOn: "",
    totalfiles: "",
    queue: "",
    ordering: "",
    ordered: "",
    failed: "",
    uploaded: "",
    refresh: ""
  },
];
