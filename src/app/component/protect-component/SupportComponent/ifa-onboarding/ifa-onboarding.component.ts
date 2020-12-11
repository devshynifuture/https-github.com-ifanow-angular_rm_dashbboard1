import { Component, OnInit, ViewChild } from "@angular/core";
import { OrderHistoricalFileComponent } from "./../order-historical-file/order-historical-file.component";
import { UtilService } from "src/app/services/util.service";
import { SubscriptionInject } from "../../AdviserComponent/Subscriptions/subscription-inject.service";
import { AdminDetailsComponent } from "./admin-details/admin-details.component";
import { MatSort, MatTableDataSource } from "@angular/material";
import { SupportService } from "../support.service";
import { EventService } from "../../../../Data-service/event.service";
import { AuthService } from "src/app/auth-service/authService";

@Component({
  selector: "app-ifa-onboarding",
  templateUrl: "./ifa-onboarding.component.html",
  styleUrls: ["./ifa-onboarding.component.scss"],
})
export class IfaOnboardingComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = false;
  stagesArray: any;
  getOverview: any;
  tableData = [];
  advisorId: any;
  isMainLoading: boolean;
  constructor(
    private subInjectService: SubscriptionInject,
    private supportService: SupportService,
    private eventService: EventService
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  displayedColumns = [
    "adminName",
    "email",
    "mobile",
    "rmName",
    "stage",
    "usingSince",
    "plan",
    "team",
    "arn",
    "menu",
  ];

  ngOnInit() {
    this.getStagesFromBackend();
  }

  getStagesFromBackend() {
    this.isLoading = true;
    this.supportService.getOnboardingTaskGlobal({}).subscribe(
      (data) => {
        if (data) {
          this.stagesArray = data;
          console.log("stages array::", data);
          this.getMyIfaDetail();
        }
      },
      (err) => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getOverviewIFAOnbording() {
    let obj = {
      adminAdvisorId: this.advisorId,
    };
    this.supportService.getOverviewIFAOnboarding(obj).subscribe(
      (data) => {
        console.log(data);
        if (data) {
          this.getOverview = data;
        }
      },
      (err) => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getMyIfaDetail() {
    let obj = {};
    this.supportService.getMyIFAValues(obj).subscribe(
      (data) => {
        console.log(data);
        if (data && data.length !== 0) {
          this.isLoading = false;
          let tableArray = [];
          data.forEach((element, index) => {
            tableArray.push({
              adminName: element.name,
              email: element.emailId,
              mobile: element.mobileNo,
              rmName: element.rmName ? element.rmName : " - ",
              stage: element.taskMasterId ? this.getStageName(element.taskMasterId) : "-",
              usingSince:
                element.usingSinceYear +
                "Y " +
                element.usingSinceMonth +
                "M",
              plan: element.plan ? element.plan : " - ",
              team: element.teamMemberCount,
              arn: element.arnRiaDetailCount,
              adminAdvisorId: element.adminAdvisorId,
              menu: "",
              advisorId: element.adminAdvisorId,
            });
          });
          this.dataSource.data = tableArray;

          this.tableData = tableArray;
          this.isLoading = false;
        }
      },
      (err) => this.eventService.openSnackBar(err, "Dismiss")
    );
  }

  getStageName(id) {
    for (let index = 0; index < this.stagesArray.length; index++) {
      const element = this.stagesArray[index];
      if (id === element.id) {
        return element.name;
      }
    }
  }

  someFunction() {
    console.log("this is some function");
  }

  openIfaHistory(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: "open50",
      componentName: OrderHistoricalFileComponent,
    };
    const rightSideDataSub = this.subInjectService
      .changeNewRightSliderState(fragmentData)
      .subscribe((sideBarData) => {
        console.log("this is sidebardata in subs subs : ", sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log(
              "this is sidebardata in subs subs 3 ani: ",
              sideBarData
            );
          }
          rightSideDataSub.unsubscribe();
        }
      });
  }

  mergeSchemeCode(data) {
    this.isMainLoading = true;
    this.supportService.putMergeSchemeCode({ parentId: data.advisorId })
      .subscribe(res => {
        this.isMainLoading = false;
        if (res) {
          console.log("merge query response::", res);
          this.eventService.openSnackBarNoDuration("Merge scheme code done Successfully", "DISMISS");
        } else {
          this.eventService.openSnackBarNoDuration("Merge scheme code successful", "DISMISS");
        }
      }, err => {
        this.isMainLoading = false;
        console.error(err);
        this.eventService.openSnackBar("Something went wrong", 'DISMISS');
      })
  }

  filterTableByName(event) {
    let value = event.target.value;
    console.log(value);
    if (value !== "") {
      this.dataSource.data = this.tableData.filter((item) => {
        console.log(
          item.adminName.toLowerCase().includes(value.toLowerCase())
            ? item
            : null
        );
        return item.adminName.toLowerCase().includes(value.toLowerCase())
          ? item
          : null;
      });
    } else {
      this.dataSource.data = this.tableData;
    }
  }

  openAdminDetails(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: "open",
      componentName: AdminDetailsComponent,
    };
    const rightSideDataSub = this.subInjectService
      .changeNewRightSliderState(fragmentData)
      .subscribe((sideBarData) => {
        console.log("this is sidebardata in subs subs : ", sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log(
              "this is sidebardata in subs subs 3 ani: ",
              sideBarData
            );
            this.dataSource.data = ELEMENT_DATA;
            this.getStagesFromBackend();
          }
          rightSideDataSub.unsubscribe();
        }
      });
  }
}

const ELEMENT_DATA = [
  {
    adminName: "",
    email: "",
    mobile: "",
    rmName: "",
    stage: "",
    usingSince: "",
    plan: "",
    team: "",
    arn: "",
    menu: "",
  },
  {
    adminName: "",
    email: "",
    mobile: "",
    rmName: "",
    stage: "",
    usingSince: "",
    plan: "",
    team: "",
    arn: "",
    menu: "",
  },
  {
    adminName: "",
    email: "",
    mobile: "",
    rmName: "",
    stage: "",
    usingSince: "",
    plan: "",
    team: "",
    arn: "",
    menu: "",
  },
];
