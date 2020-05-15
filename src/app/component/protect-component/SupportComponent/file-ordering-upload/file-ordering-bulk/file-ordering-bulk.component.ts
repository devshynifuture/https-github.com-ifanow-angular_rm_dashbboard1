import { SubscriptionInject } from "./../../../AdviserComponent/Subscriptions/subscription-inject.service";
import { Component, OnInit } from "@angular/core";
import { EventService } from "src/app/Data-service/event.service";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { MatChipInputEvent, MatTableDataSource } from "@angular/material";
import { UpperSliderBackofficeComponent } from "../../common-component/upper-slider-backoffice/upper-slider-backoffice.component";
import { AuthService } from "src/app/auth-service/authService";
import { UtilService } from "src/app/services/util.service";
import { FileOrderingUpperComponent } from "../file-ordering-upper/file-ordering-upper.component";
import { FileOrderingSetupComponent } from "./file-ordering-setup/file-ordering-setup.component";
import { FileOrderingUploadService } from "../file-ordering-upload.service";
import { FormBuilder } from "@angular/forms";
import { ReconciliationService } from '../../../AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';

@Component({
  selector: "app-file-ordering-bulk",
  templateUrl: "./file-ordering-bulk.component.html",
  styleUrls: ["./file-ordering-bulk.component.scss"],
})
export class FileOrderingBulkComponent implements OnInit {
  rmList: any[] = [];
  isLoading: boolean;

  constructor(
    private eventService: EventService,
    private subInjectService: SubscriptionInject,
    private fileOrderingUploadService: FileOrderingUploadService,
    private fb: FormBuilder,
    private utilService: UtilService,
    private reconService: ReconciliationService
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
    "refresh",
    "empty",
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
      name: "Last 7 Days",
      value: 7,
      type: "period",
    },
    {
      name: "Last month",
      value: 30,
      type: "period",
    },
    {
      name: "Last year",
      value: 365,
      type: "period",
    },
  ];

  rtaList = [];

  days = 2;
  rtId;

  getRtaList() {
    this.reconService.getRTListValues({})
      .subscribe(res => {
        if (res && res.length !== 0) {
          res.forEach(element => {
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
          });
          this.getRmMasterDetails();
        } else {
          this.eventService.openSnackBar("Error In Fetching RTA List", "DISMISS");
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
            this.dataSource.data = ELEMENT_DATA;
            this.fileOrderBulkHistoryListGet(obj);
          }
        }
      });
  }

  ngOnInit() {
    this.isLoading = true;
    this.getRtaList();

  }

  defaultSelectionInFilter() {
    const defaultRmName = this.rmList.find((c) => c.id === this.rmId);
    this.filterForm.get("filterByRmName").setValue(defaultRmName);
    this.filterBy.push({ name: defaultRmName.name, type: 'rm' });

    const defaultPeriod = this.periodList.find((c) => c.value === 30);
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
        this.eventService.openSnackBar("No Rm Data Found!", "DISMISS");
      }
    });
  }

  getRtName(id) {
    let obj = this.rtaList.find(c => c.value === id);
    return obj.name;
  }

  fileOrderBulkHistoryListGet(data) {
    this.isLoading = true;
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
              totalFiles: element.totalFiles ? element.totalFiles : "-",
              queue: element.inqueue,
              ordering: element.orderingFrequency
                ? element.orderingFrequency
                : "-",
              ordered: element.ordered,
              failed: element.skipped,
              uploaded: element.uploaded,
              refresh: "",
              rtId: element.rtId,
              rmId: element.rmId,
              days: this.days,
              arnRiaDetailId: element.arnRiaDetailId,
              description: element.description,
              fromDate: element.fromDate,
              toDate: element.toDate,
              id: element.id,
            });
          });

          console.log("this is table Data", tableData);

          this.dataSource.data = tableData;
        } else {
          this.eventService.openSnackBar("No Data Found", "DISMISS");
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

  openUpperFileOrdering(flag, data) {
    data.flag = flag;
    console.log("hello mf button clicked");
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
                rmId: 2
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
                rmId: 2,
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
        days: 2,
        rmId: 2
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
  empty: string;
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
    empty: "",
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
    empty: "",
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
    empty: "",
  },
];
