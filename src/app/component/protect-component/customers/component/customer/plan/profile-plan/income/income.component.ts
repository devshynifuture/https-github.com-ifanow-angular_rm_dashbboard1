import { Component, OnInit, ViewChild, EventEmitter, Output, ChangeDetectorRef, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatDialog, MatSort, MatTableDataSource, MatBottomSheet } from '@angular/material';
import { AddIncomeComponent } from './add-income/add-income.component';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from '../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { IncomeDetailedViewComponent } from './income-detailed-view/income-detailed-view.component';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { FileUploadServiceService } from '../../../accounts/assets/file-upload-service.service';
import { BottomSheetComponent } from '../../../../common-component/bottom-sheet/bottom-sheet.component';
import { SummaryPlanServiceService } from '../../summary-plan/summary-plan-service.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('tableEl', { static: false }) tableEl;
  getOrgData;
  totalAmountOutstandingBalance;
  isLoadingUpload: boolean = false;
  displayedColumns = ['no', 'owner', 'type', 'amt', 'income', 'till', 'rate', 'status', 'icons'];
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  advisorId: any;
  clientId: any;
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  noData: string;
  fragmentData = { isSpinner: false };
  totalMonthlyIncome: number;
  personalProfileData: any;
  userInfo: any;
  clientData: any;
  details: any;
  reportDate: Date;
  filterForIncome: any;
  myFiles: any;
  fileUploadData: any;
  file: any;
  globalArray = [];
  storedData: any;
  incomeId: any;
  isAdded: any;
  LoadCount: any;
  clientIdToClearStorage: string;
  constructor(private fileUpload: FileUploadServiceService,
    private util: UtilService, private excel: ExcelGenService,
    public dialog: MatDialog, private eventService: EventService,
    private subInjectService: SubscriptionInject,
    private planService: PlanService,
    private _bottomSheet: MatBottomSheet,
    private summaryPlanService: SummaryPlanServiceService, private ref: ChangeDetectorRef) {
  }

  viewMode;
  @Output() finPlan = new EventEmitter();
  @Output() loaded = new EventEmitter();
  @Input() finPlanObj: string;

  ngOnInit() {
    console.log(this.finPlanObj);
    this.LoadCount = 0;
    this.reportDate = new Date();
    this.viewMode = "tab1"
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.personalProfileData = AuthService.getProfileDetails();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    this.clientData = AuthService.getClientData();
    this.details = AuthService.getProfileDetails();
    this.summaryPlanService.getClientId().subscribe(res => {
      this.clientIdToClearStorage = res;
    });
    if (this.clientIdToClearStorage) {
      if (this.clientIdToClearStorage != this.clientId) {
        this.summaryPlanService.clearStorage();
      }
    }
    this.summaryPlanService.setClientId(this.clientId);
    this.summaryPlanService.getIncomeData()
      .subscribe(res => {
        this.storedData = '';
        this.storedData = res;
      })
    this.summaryPlanService.getIncomeCount()
      .subscribe(res => {
        this.LoadCount = res;
      })
    if (this.chekToCallApi()) {
      this.getIncomeList();
    } else {
      this.getIncomeListRes(this.storedData);
    }
  }

  getIncomeList() {
    if (!this.incomeId) {
      this.isLoading = true;
      this.dataSource.data = [{}, {}, {}];
    }
    this.LoadCount++;
    this.summaryPlanService.setIncomeCount(this.LoadCount);
    const obj =
    {
      advisorId: this.advisorId,
      clientId: this.clientId,
      addMonthlyDistribution: false,
      id: this.incomeId ? this.incomeId : 0
    }
    this.planService.getIncomeData(obj).subscribe(
      data => {
        this.pushArray(data);
        if (!this.incomeId) {
          this.getIncomeListRes(data);
        } else {
          this.getIncomeListRes(this.storedData);
        }
      },
      error => {
        this.noData = 'No income found';
        this.dataSource.data = []
        this.eventService.showErrorMessage(error)
      }
    )

  }
  chekToCallApi() {
    return this.LoadCount >= 1 ? false : this.storedData ? false : true
  }
  pushArray(data) {
    if (data && !this.incomeId) {
      data = [...new Map(data.map(item => [item.id, item])).values()];
      this.globalArray.push(data);
      this.globalArray = this.globalArray.flat();
      this.summaryPlanService.setIncomeData(this.globalArray);
      this.globalArray = [];
      this.incomeId = '';
    } else if (this.isAdded) {
      this.storedData == '' ? this.storedData = [] : ''
      this.storedData.push(data)
      this.storedData = this.storedData.flat();
      this.summaryPlanService.setIncomeData(this.storedData);
    } else if (this.isAdded == false) {
      this.storedData = this.storedData.filter(d => d.id != this.incomeId);
      this.storedData.push(data)
      this.storedData = this.storedData.flat();
      this.summaryPlanService.setIncomeData(this.storedData);
    }
  }
  fetchData(value, fileName, element) {
    this.isLoadingUpload = true
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      familyMemberId: (element.ownerList[0].isClient == 1) ? element.ownerList[0].familyMemberId : 0,
      asset: value
    }
    this.myFiles = [];
    for (let i = 0; i < fileName.target.files.length; i++) {
      this.myFiles.push(fileName.target.files[i]);
    }
    const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent, {
      data: this.myFiles,
    });
    this.fileUploadData = this.fileUpload.fetchFileUploadData(obj, this.myFiles);
    if (this.fileUploadData) {
      this.file = fileName
      this.fileUpload.uploadFile(fileName)
    }
    setTimeout(() => {
      this.isLoadingUpload = false
    }, 7000);
  }
  Excel(tableTitle) {
    this.fragmentData.isSpinner = true;
    let rows = this.tableEl._elementRef.nativeElement.rows;
    const data = this.excel.generateExcel(rows, tableTitle);
    if (data) {
      this.fragmentData.isSpinner = false;
    }
  }
  getIncomeListRes(data) {
    this.isLoading = false;
    if (data == undefined) {
      this.noData = 'No income found';
      this.dataSource.data = []
    }
    else if (data) {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.totalMonthlyIncome = 0;
      this.filterForIncome = data;
      this.dataSource.data.forEach(element => {
        this.totalMonthlyIncome += element.monthlyIncomeToShow ? element.monthlyIncomeToShow : 0;
      });
    } else {
      this.dataSource.data = [];
    }
    this.ref.detectChanges()
    this.loaded.emit(document.getElementById('template'));
  }
  filterIncome(key: string, value: any) {
    let dataFiltered;

    dataFiltered = this.filterForIncome.filter(function (item) {
      return item[key] === value;
    });
    if (dataFiltered.length > 0) {
      this.dataSource.data = dataFiltered;
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.totalMonthlyIncome = 0;
      this.dataSource.data.forEach(element => {
        this.totalMonthlyIncome += element.monthlyIncomeToShow ? element.monthlyIncomeToShow : 0;
      });
    } else {
      this.eventService.openSnackBar("No data found", "Dismiss")
    }

  }

  addIncome(flagValue, data) {
    const fragmentData = {
      flag: flagValue,
      data,
      state: 'open65',
      componentName: AddIncomeComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.incomeId = sideBarData.data.id;
            this.isAdded = sideBarData.data.isAdded;
            this.getIncomeList();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  generatePdf() {
    this.fragmentData.isSpinner = true;
    let para = document.getElementById('template');
    // this.util.htmlToPdf(para.innerHTML, 'Test',this.fragmentData);

    this.util.htmlToPdf('', para.innerHTML, 'Income', 'true', this.fragmentData, '', '', false);

  }
  deleteModal(value, incomeData) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.planService.deleteIncome(incomeData.id).subscribe(
          data => {
            this.eventService.openSnackBar("Income deleted successfully", "Dismiss")
            this.deleteId(incomeData.id);
            // this.getIncomeList();
            dialogRef.close();
          },
          error => this.eventService.showErrorMessage(error)
        )
      },
      negativeMethod: () => {
        console.log('2222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  deleteId(id) {
    this.globalArray = this.storedData.filter(d => d.id != id);
    this.globalArray = [...new Map(this.globalArray.map(item => [item.id, item])).values()];
    this.summaryPlanService.setIncomeData(this.globalArray);
    this.getIncomeListRes(this.globalArray);
  }

  addIncomeDetail(data) {
    const fragmentData = {
      flag: 'detailedView',
      data,
      id: 1,
      state: 'open35',
      componentName: IncomeDetailedViewComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }


}

export interface PeriodicElement {
  no: string;
  owner: string;
  type: string;
  amt: string;
  income: string;
  till: string;
  rate: string;
  status: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    no: "1",
    owner: 'Rahul Jain',
    type: "Salaried",
    amt: '60,000',
    income: "18/09/2021",
    till: "Retirement",
    rate: "8.40%",
    status: "MATURED"
  },
  {
    no: "2",
    owner: 'Rahul Jain',
    type: "Salaried",
    amt: '60,000',
    income: "18/09/2021",
    till: "Retirement ",
    rate: "8.40%",
    status: "LIVE"
  },
  { no: "", owner: 'Total', type: "", amt: '1,60,000', income: "", till: "", rate: "", status: "" },
];
