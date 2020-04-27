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
    private fb: FormBuilder
  ) {}
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

  rtaList = [
    {
      name: "ALL RTA",
      value: 0,
      type: "rta",
    },
    {
      name: "CAMS",
      value: 1,
      type: "rta",
    },
    {
      name: "KARVY",
      value: 2,
      type: "rta",
    },
    {
      name: "FRANKLIN",
      value: 3,
      type: "rta",
    },
  ];

  days = 2;
  rtId = 0;

  ngOnInit() {
    this.getRmMasterDetails();
  }

  defaultSelectionInFilter() {
    const defaultRmName = this.rmList.find((c) => c.id === this.rmId);
    this.filterForm.get("filterByRmName").setValue(defaultRmName);
    const defaultPeriod = this.periodList.find((c) => c.value === 30);
    this.filterForm.get("filterByPeriod").setValue(defaultPeriod);
    const defaultRta = this.rtaList.find((c) => c.value === 0);
    this.filterForm.get("filterByRta").setValue(defaultRta);

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
              rta:
                element.rtId === 0
                  ? "ALL-RTA"
                  : element.rtId === 1
                  ? "CAMS"
                  : element.rtId === 2
                  ? "KARVY"
                  : element.rtId === 3
                  ? "FRANKLIN"
                  : null,
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
    this.add(event);
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
            this.fileOrderBulkHistoryListGet({
              days: this.days,
              rtId: this.rtId,
            });
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
            this.fileOrderBulkHistoryListGet({
              days: this.days,
              rtId: this.rtId,
            });
            console.log(
              "this is sidebardata in subs subs 3 ani: ",
              sideBarData
            );
          }
          rightSideDataSub.unsubscribe();
        }
      });
  }

  add(event): void {
    const input = event.input;
    let value;
    if (event.value !== "") {
      value = event.value["name"];
    }
    console.log("add event", event);

    if (event.value["type"] == "rm") {
      // console.log("yo");
      this.dataSource.data = ELEMENT_DATA;
      this.fileOrderBulkHistoryListGet({
        days: this.days,
        rtId: this.rtId,
        rmId: event.value["id"],
      });
    } else if (event.value["type"] == "rta") {
      // console.log("yo");
      this.dataSource.data = ELEMENT_DATA;
      this.rtId = event.value["value"];
      this.fileOrderBulkHistoryListGet({
        days: this.days,
        rtId: event.value["value"],
      });
    } else if (event.value["type"] === "period") {
      // console.log("yo");
      this.dataSource.data = ELEMENT_DATA;
      this.days = event.value["value"];
      this.fileOrderBulkHistoryListGet({
        days: this.days,
        rtId: this.rtId,
      });
    } else if (event.value["type"] === "name") {
      this.dataSource.data = ELEMENT_DATA;
      this.fileOrderBulkHistoryListGet({
        days: this.days ? this.days : 2,
        rtId: this.rtId,
        advisorName: event.value["name"],
      });

      console.log(event.value);
    }
    // filter get api usng

    // Add our filterBy
    if ((value || "").trim()) {
      this.filterBy = [];
      this.filterBy.push({ name: value.trim() });
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

    if (index >= 0) {
      this.filterBy.splice(index, 1);
      this.dataSource.data = ELEMENT_DATA;
      this.fileOrderBulkHistoryListGet({
        days: this.days,
        rtId: this.rtId,
      });
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
