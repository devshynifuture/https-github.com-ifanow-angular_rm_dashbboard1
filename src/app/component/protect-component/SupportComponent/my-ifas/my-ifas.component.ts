import { AuthService } from './../../../../auth-service/authService';
import { SubscriptionInject } from "./../../AdviserComponent/Subscriptions/subscription-inject.service";
import { UtilService } from "./../../../../services/util.service";
import { Component, OnInit, ViewChild } from "@angular/core";
// import { IfaDetailsComponent } from './ifa-details/ifa-details.component';

import { IfasDetailsComponent } from "./ifas-details/ifas-details.component";
import { MatSort, MatTableDataSource, MatDialog } from "@angular/material";
import { OrderHistoricalFileComponent } from "./../order-historical-file/order-historical-file.component";
import { SupportService } from "../support.service";
import { EventService } from "src/app/Data-service/event.service";

@Component({
  selector: "app-my-ifas",
  templateUrl: "./my-ifas.component.html",
  styleUrls: ["./my-ifas.component.scss"],
})
export class MyIfasComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = false;
  tableData = [];
  constructor(
    private subInjectService: SubscriptionInject,
    private supportService: SupportService,
    private eventService: EventService
  ) { }

  filterName;
  parentId = AuthService.getParentId();

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns = [
    "adminName",
    "email",
    "mobile",
    "usingSince",
    "lastLogin",
    "accStatus",
    "team",
    "arn",
    "logout",
    "menu",
  ];

  ngOnInit() {
    this.getMyIfasList();
  }

  getMyIfasList() {
    let obj = {};
    this.isLoading = true;
    this.supportService.getMyIFAValues(obj).subscribe(
      (data) => {
        console.log(data);
        if (data && data.length !== 0) {
          this.isLoading = false;
          let tableArray = [];
          data.forEach((element) => {
            tableArray.push({
              adminName: element.name,
              email: element.emailId,
              mobile: element.mobileNo,
              usingSince:
                element.usingSinceYear +
                "Y " +
                element.usingSinceMonth +
                "M",
              lastLogin: element.last_login ? element.last_login : " - ",
              accStatus: element.account_status
                ? element.account_status
                : " - ",
              // plan: element.plan ? element.plan : ' - ',
              //nextBilling: element.next_billing ? element.next_billing : ' - ',
              team: element.teamMemberCount,
              arn: element.arnRiaDetailCount,
              logout: element.logout ? element.logout : " - ",
              adminAdvisorId: element.adminAdvisorId,
              menu: "",
              advisorId: element.advisorId
            });
          });
          this.tableData = tableArray;
          this.dataSource.data = tableArray;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource.data = null;
        }
      },
      (err) => this.eventService.openSnackBar(err, "Dismiss")
    );
  }

  mergeSchemeCode(data) {
    this.supportService.putMergeSchemeCode({ parentId: data.advisorId })
      .subscribe(res => {
        if (res) {
          console.log("merge query response::", res);
          this.eventService.openSnackBar("Merge scheme code done Successfully", "DISMISS");
        } else {
          this.eventService.openSnackBar("Merge Scheme Code", "DISMISS")
        }
      })
  }

  recalculateBalanceUnit(data) {
    this.supportService.recalculateBalanceUnitData({ parentId: data.advisorId })
      .subscribe(res => {
        if (res) {
          console.log("recalculate balance unit response::", res);
          this.eventService.openSnackBar("Recalculation of Balance Units is Done", "DISMISS");
        } else {
          this.eventService.openSnackBar("Recalculation of Balance Units Failed", "DISMISS");
        }
      })
  }


  openOrderHistoricalFile(data) {
    const fragmentData = {
      flag: "ifaDetails",
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
          console.log("this is sidebardata in subs subs 2: ", sideBarData);
          rightSideDataSub.unsubscribe();
        }
      });
  }

  filterTableByName(event) {
    let value = event.target.value;
    console.log(value);
    if (value !== "") {
      this.dataSource.data = this.tableData.filter((item) => {
        if (item.hasOwnProperty('adminName')) {
          return item.adminName.toLowerCase().includes(value.toLowerCase())
            ? item
            : null;
        }
      });
    } else {
      this.dataSource.data = this.tableData;
    }
  }

  openIfaRightSilder(data) {
    const fragmentData = {
      flag: "ifaDetails",
      data,
      id: 1,
      state: "open70",
      componentName: IfasDetailsComponent,
    };
    const rightSideDataSub = this.subInjectService
      .changeNewRightSliderState(fragmentData)
      .subscribe((sideBarData) => {
        console.log("this is sidebardata in subs subs : ", sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.dataSource.data = ELEMENT_DATA;
            this.getMyIfasList();
            this.filterName = '';
          }
          console.log("this is sidebardata in subs subs 2: ", sideBarData);
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
    usingSince: "",
    lastLogin: "",
    accStatus: "",
    team: "",
    arn: "",
    logout: "",
    menu: "",
  },
  {
    adminName: "",
    email: "",
    mobile: "",
    usingSince: "",
    lastLogin: "",
    accStatus: "",
    team: "",
    arn: "",
    logout: "",
    menu: "",
  },
  {
    adminName: "",
    email: "",
    mobile: "",
    usingSince: "",
    lastLogin: "",
    accStatus: "",
    team: "",
    arn: "",
    logout: "",
    menu: "",
  },
];
