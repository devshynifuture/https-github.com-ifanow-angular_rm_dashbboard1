import { RecuringDepositComponent } from './../recuring-deposit/recuring-deposit.component';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { DetailedViewFixedDepositComponent } from '../fixed-deposit/detailed-view-fixed-deposit/detailed-view-fixed-deposit.component';
import { FixedDepositComponent } from '../fixed-deposit/fixed-deposit.component';
import { DetailedViewRecuringDepositComponent } from '../recuring-deposit/detailed-view-recuring-deposit/detailed-view-recuring-deposit.component';
import { DetailedViewBondsComponent } from '../bonds/detailed-view-bonds/detailed-view-bonds.component';
import { BondsComponent } from '../bonds/bonds.component';
import { UtilService } from 'src/app/services/util.service';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';
import { MathUtilService } from "../../../../../../../../../services/math-util.service";
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';


@Component({
  selector: 'app-fixed-income',
  templateUrl: './fixed-income.component.html',
  styleUrls: ['./fixed-income.component.scss']
})
export class FixedIncomeComponent implements OnInit {
  isLoading = false;
  showRequring: any;
  advisorId: any;
  dataSource: any = new MatTableDataSource();
  clientId: any;
  sumAmountInvested: any;
  sumCurrentValue: any;
  sumMaturityValue: any;
  totalCurrentValue = 0;
  totalMarketValue = 0;
  sumAmountInvestedB: any;
  sumCouponAmount: any;
  sumCurrentValueB: any;
  hideFilter:boolean = false;
  @ViewChild('fixedIncomeTableSort', { static: false }) fixedIncomeTableSort: MatSort;
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('recurringDepositTable', { static: false }) recurringDepositTableSort: MatSort;
  @ViewChild('bondListTable', { static: false }) bondListTableSort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  excelData: any[];
  footer = [];
  data: Array<any> = [{}, {}, {}];
  hidePdf: boolean;
  noData: string;
  dataList: any;


  constructor(private excelSer: ExcelService, private subInjectService: SubscriptionInject,
    private customerService: CustomerService, private eventService: EventService, private excel:ExcelGenService,  private pdfGen:PdfGenService,
    public util: UtilService, public dialog: MatDialog) {
  }

  viewMode;
  displayedColumns4 = ['no', 'owner', 'type', 'cvalue', 'rate', 'amt', 'mdate', 'mvalue', 'number', 'desc', 'status', 'icons'];
  displayedColumns5 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];
  displayedColumns6 = ['no', 'owner', 'cvalue', 'camt', 'amt', 'cdate', 'rate', 'mvalue', 'tenure', 'type', 'desc', 'status', 'icons'];
  filterMode;
  dataSourceFixedFiltered;
  isFixedIncomeFiltered = false;

  ngOnInit() {
    this.showRequring = '1';
    this.hidePdf = true;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();

    this.getFixedDepositList();
    // this.dataSource = new MatTableDataSource(this.data);
  }

  Close() {

  }

  Excel(tableTitle){
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows,tableTitle)
  }

  pdf(tableTitle){
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.pdfGen.generatePdf(rows, tableTitle);
  }

  

  changeRecurringFilterMode(value) {
    console.log('this is filter data', value);
    this.dataSource.filter = value.trim().toLowerCase();
  }

  changeFixedIncomeFilterMode(value) {
    console.log('this is filter data', value);
    this.dataSource.filter = value.trim().toLowerCase();
  }

  getfixedIncomeData(value) {
    console.log('value++++++', value);
    this.showRequring = value;

    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    if (value == '2') {
      this.getRecurringDepositList();
    } else if (value == '3') {
      this.getBondsList();
    } else {
      this.getFixedDepositList();
    }

  }

  getFixedDepositList() {
    this.isLoading = true;
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.dataSource.data = [{}, {}, {}];
    this.customerService.getFixedDeposit(obj).subscribe(
      data => this.getFixedDepositRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }
totalSum:any
  getFixedDepositRes(data) {
    this.isLoading = false;
    this.totalSum = data;
    console.log('getFixedDepositRes ********** ', data);
    if (data == undefined) {
      this.noData = "No scheme found";
      this.dataSource.data = [];
      this.hideFilter = true;
    } else if (data.assetList) {
      this.dataList = data.assetList;
      this.dataSource.data = data.assetList;
      this.dataSource.sort = this.fixedIncomeTableSort;
      console.log('soted &&&&&&&&&', this.dataSource);
      UtilService.checkStatusId(this.dataSource.filteredData);
      this.sumCurrentValue = 0;
      this.dataSource.filteredData.forEach((o) => {
        if (o.nomineePercentageShare) {
          this.sumCurrentValue += o.nomineePercentageShare;
        }

      });
      this.sumAmountInvested = data.sumOfAmountInvested;
      this.sumCurrentValue = data.sumOfCurrentValue;
      this.sumMaturityValue = data.sumOfMaturityValue;
      console.log('sumCurrentValue', this.sumCurrentValue);
    } else {
      this.noData = 'No scheme found';
      this.dataSource.data = [];
    }

  }

  getRecurringDepositList() {
    this.isLoading = true;
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.dataSource.data = [{}, {}, {}];
    this.customerService.getRecurringDeposit(obj).subscribe(
      data => this.getRecurringDepositRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  reTotalSum:any
  sumOfMonthlyContribution:any;
  sumOfMaturityValue:any;
  getRecurringDepositRes(data) {
    this.reTotalSum = data;
    this.isLoading = false;
    if (data != undefined) {
      if (data.assetList) {
        console.log('FixedIncomeComponent getRecuringDepositRes data *** ', data);
        this.dataList = data.assetList;
  
        this.dataSource.data = data.assetList;
        this.dataSource.sort = this.recurringDepositTableSort;
        UtilService.checkStatusId(this.dataSource.filteredData);
        this.totalCurrentValue = data.totalCurrentValue;
        this.sumOfMonthlyContribution = data.sumOfMonthlyContribution;
        this.sumOfMaturityValue = data.sumOfMaturityValue;
      }
    }
     else {
      this.noData = 'No scheme found';
      this.dataSource.data = [];
    }
  }

  getBondsList() {
    this.isLoading = true;
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.dataSource.data = [{}, {}, {}];
    this.customerService.getBonds(obj).subscribe(
      data => this.getBondsRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  bondTotalSum:any;
  getBondsRes(data) {
    this.bondTotalSum = data;
    this.isLoading = false;
    if (data != undefined) {
      if (data.assetList) {
        console.log('getBondsRes ******** ', data);
      this.dataList = data.assetList;

        this.dataSource.data = data.assetList;
        this.dataSource.sort = this.bondListTableSort;
        UtilService.checkStatusId(this.dataSource.filteredData);
        this.sumAmountInvestedB = data.sumOfAmountInvested;
        this.sumCouponAmount = data.sumOfCouponAmount;
        this.sumCurrentValueB = data.sumOfCurrentValue;
        this.sumMaturityValue = data.sumOfMaturityValue;
      }
    } else {
      this.noData = 'No scheme found';
      this.dataSource.data = [];
    }
  }

  activeFilter:any = 'All';
  filterFixedIncome(key: string, value: any) {
    
    let dataFiltered = [];
    this.activeFilter = value;
    if(value == "All"){
      dataFiltered = this.dataList;
    }
    else{
      dataFiltered = this.dataList.filter(function (item) {
        return item[key] === value;
      });
      if(dataFiltered.length <= 0){
        this.hideFilter = false;
      }
    }
    
    this.isFixedIncomeFiltered = true;
    this.dataSource.data = dataFiltered;
    // this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.fixedIncomeTableSort;
  }

  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        if (value == 'FIXED DEPOSIT') {
          this.customerService.deleteFixedDeposite(data.id).subscribe(
            data => {
              dialogRef.close();
              this.getFixedDepositList();
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else if (value == 'RECURRING DEPOSIT') {
          this.customerService.deleteRecurringDeposite(data.id).subscribe(
            data => {
              dialogRef.close();
              this.getRecurringDepositList();
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else {
          this.customerService.deleteBond(data.id).subscribe(
            data => {
              dialogRef.close();
              this.getBondsList();
            },
            error => this.eventService.showErrorMessage(error)
          );
        }
        this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
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

  openPortfolioSummary(value, data) {
    let popupHeaderText = !!data ? 'Edit Fixed deposit' : 'Add Fixed deposit';
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: FixedDepositComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getFixedDepositList();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  openDetailedFixedDeposit(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedViewFixedDepositComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);

        if (UtilService.isRefreshRequired(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);

        }
        rightSideDataSub.unsubscribe();
      }
    );
  }

  detailedViewRecurringDeposit(data) {
    const fragmentData = {
      flag: 'RECURRING_DEPOSITE',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedViewRecuringDepositComponent
    };
    this.subInjectService.changeNewRightSliderState(fragmentData);
  }

  openAddRecurringDeposit(data) {
    let popupHeaderText = !!data ? 'Edit Recurring deposit' : 'Add Recurring deposit';
    const fragmentData = {
      flag: 'addRecuringDeposit',
      data,
      id: 1,
      state: 'open',
      componentName: RecuringDepositComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getRecurringDepositList();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openBonds(data) {
    let popupHeaderText = !!data ? 'Edit Bond' : 'Add Bonds';
    const fragmentData = {
      flag: 'BondsComponent',
      data,
      id: 1,
      state: 'open',
      componentName: BondsComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getBondsList();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  detailedViewBonds(data) {
    const fragmentData = {
      flag: 'DetailedViewBondsComponent',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedViewBondsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isRefreshRequired(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);

        }
        rightSideDataSub.unsubscribe();
      }
    );
  }
}


