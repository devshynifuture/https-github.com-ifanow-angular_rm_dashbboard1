import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
// import {UtilService} from '../../../../../../../services/util.service';
import { EventService } from '../../../../../../../Data-service/event.service';
import { SubscriptionInject } from '../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { AddLiabilitiesComponent } from "../../../common-component/add-liabilities/add-liabilities.component";
import { LiabilitiesDetailComponent } from '../../../common-component/liabilities-detail/liabilities-detail.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../excel.service';


@Component({
  selector: 'app-liabilities',
  templateUrl: './liabilities.component.html',
  styleUrls: ['./liabilities.component.scss']
})

export class LiabilitiesComponent implements OnInit {

  displayedColumns: string[] = ['no', 'name', 'type', 'loan', 'ldate', 'today', 'ten', 'rate', 'emi', 'fin', 'status', 'icons'];
  // dataSource = ELEMENT_DATA;
  advisorId: any;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  storeData: any;
  dataStore: any;
  showFilter: any;
  home: Object[] = [];
  vehicle: Object[] = [];
  education: Object[] = [];
  creditCard: Object[] = [];
  personal: Object[] = [];
  mortgage: Object[] = [];
  dataToShow: any;
  OtherData: any;
  OtherPayableData: any;
  clientId: any;
  // showLoader: boolean;
  isLoading = false;
  noData: string;
  totalLoanAmt: any;
  outStandingAmt = 0;
  filterData: any;
  excelData: any[];
  footer = [];


  constructor(private excel: ExcelService, private eventService: EventService, private subInjectService: SubscriptionInject,
    public customerService: CustomerService, public util: UtilService, public dialog: MatDialog) {
  }
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;

  viewMode: string;

  ngOnInit() {
    this.viewMode = 'tab1';
    this.showFilter = 'tab1';
    //this.showLoader = true;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getLiability('');
    this.getPayables();
    this.getGlobalLiabilities();
  }
  /**used for excel  */
  async ExportTOExcel(value) {

    this.excelData = []
    var data = []
    var headerData = [{ width: 20, key: 'Owner' },
    { width: 20, key: 'Type' },
    { width: 20, key: 'Loan amount' },
    { width: 18, key: 'Loan as on' },
    { width: 25, key: 'Outstanding as on today' },
    { width: 18, key: 'Tenure remaining' },
    { width: 25, key: 'Annual interest rate' },
    { width: 18, key: 'EMI' },
    { width: 25, key: 'Financial institution' },
    { width: 18, key: 'Status' },]
    var header = ['Owner', 'Type', 'Loan amount', 'Loan as on',
      'Outstanding as on today', 'Tenure remaining', 'Annual interest rate', 'EMI', 'Financial institution', 'Status'];
    this.dataSource.filteredData.forEach(element => {
      data = [element.ownerName, (element.loanTypeId == 1) ? 'Home Loan' : (element.loanTypeId == 2) ? 'Vehicle' : (element.loanTypeId == 3) ? 'Education' : (element.loanTypeId == 4) ? 'Credit Card' : (element.loanTypeId == 5) ? 'Personal' : 'Mortgage', this.formatNumber.first.formatAndRoundOffNumber(element.loanAmount)
        , new Date(element.commencementDate), this.formatNumber.first.formatAndRoundOffNumber(element.outstandingAmount),
      element.loanTenure, element.annualInterestRate, this.formatNumber.first.formatAndRoundOffNumber(element.emi), element.financialInstitution, element.status]
      this.excelData.push(Object.assign(data))
    });
    var footerData = ['Total', '', this.formatNumber.first.formatAndRoundOffNumber(this.totalLoanAmt), '', this.formatNumber.first.formatAndRoundOffNumber(this.outStandingAmt), '', '', '', '', '']
    this.footer.push(Object.assign(footerData))
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value)
  }
  getGlobalLiabilities() {
    const obj = {};
    this.customerService.getGlobalLiabilities(obj).subscribe(
      data => this.getGlobalLiabilitiesRes(data)
    );
  }
  getGlobalLiabilitiesRes(data) {
    console.log(data);
  }
  getPayables() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.customerService.getOtherPayables(obj).subscribe(
      data => this.getOtherPayablesRes(data)
    );
  }
  getOtherPayablesRes(data) {

    console.log(data);
    if (data != undefined) {
      this.OtherPayableData = data;
      this.OtherData = data.length;
    }
  }
  sortTable(data) {
    if (data == '' || data == undefined) {
      this.showFilter = 'tab1';
      data = 'tab1';
    }
    this.showFilter = data;
    const filterData = [];
    if (data == 'tab1') {
      // this.dataSource = this.dataStore;
      this.dataSource = new MatTableDataSource(this.dataStore);
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource(this.dataStore);
      this.dataSource.sort = this.sort;
      if (this.dataStore) {
        this.dataStore.forEach(element => {
          if (element.loanTypeId == data) {
            filterData.push(element);
          }
        });
        this.dataSource = new MatTableDataSource(filterData);
        this.dataSource.sort = this.sort;

      }
      if (filterData.length == 0) {
        this.noData = "No Data Found";
      } else {
        this.totalLoanAmt = filterData.reduce((accumulator, currentElement) =>
          accumulator + currentElement.loanAmount
          , 0)
        this.outStandingAmt = filterData.reduce((accumulator, currentElement) =>
          accumulator + currentElement.outstandingAmount
          , 0)
        // this.dataSource = filterData;
        this.dataSource = new MatTableDataSource(filterData);
        this.dataSource.sort = this.sort;

      }
    }
  }

  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.customerService.deleteLiabilities(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("Liabilities is deleted", "dismiss")
            dialogRef.close();
            this.getLiability('');
          },
          error => this.eventService.showErrorMessage(error)
        )
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

  open(flagValue, data) {
    if (data != this.showFilter) {
      data.showFilter = this.showFilter;

    }
    const fragmentData = {
      flag: flagValue,
      componentName: AddLiabilitiesComponent,
      data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getLiability(sideBarData);
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
        
      }
    );
  }

  openThirtyPercent(flagValue, data) {
    const fragmentData = {
      flag: flagValue,
      data,
      id: 1,
      state: 'openHelp'
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
  addLiabilitiesDetail(flagValue, data) {
    const fragmentData = {
      flag: flagValue,
      id: 1,
      data: data,
      state: 'open35',
      componentName: LiabilitiesDetailComponent,
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
  getLiability(data) {
    this.isLoading = true;

    this.dataToShow = data.data;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.dataSource.data = [{}, {}, {}];
    this.customerService.getLiabilty(obj).subscribe(
      data => this.getLiabiltyRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }
  getLiabiltyRes(data) {
    this.isLoading = false;
    // this.showLoader = false;
    if (data.loans.length == 0) {
      this.noData = "No Data Found";
      this.dataSource.data = []

    } else {
      this.totalLoanAmt = data.totalLoanAmount;
      // this.outStandingAmt = data.outstandingAmount;
      data.loans.forEach(element => {
        this.totalLoanAmt += element.loanAmount
      });
      data.loans.forEach(element => {
        if (element.outstandingAmount == "NaN") {
          element.outstandingAmount = 0
        }
        this.outStandingAmt += element.outstandingAmount
      });
      this.dataStore = [];
      this.dataSource.filteredData = [];
      this.home = [];
      this.vehicle = [];
      this.education = [];
      this.creditCard = [];
      this.personal = [];
      this.mortgage = [];
      this.dataStore = data.loans;
      this.dataSource = data.loans;
      this.storeData = data.loans.length;
      this.dataStore.forEach(element => {
        if (element.loanTypeId == 1) {
          this.home.push(element);
        } else if (element.loanTypeId == 2) {
          this.vehicle.push(element);
        } else if (element.loanTypeId == 3) {
          this.education.push(element);
        } else if (element.loanTypeId == 4) {
          this.creditCard.push(element);
        } else if (element.loanTypeId == 5) {
          this.personal.push(element);
        } else if (element.loanTypeId == 6) {
          this.mortgage.push(element);
        }
      });
      this.sortTable(this.dataToShow);
    }
  }
  clickHandling() {
    console.log('something was clicked');
    this.open('openHelp', 'liabilityright');
  }
  display(data) {
    this.getPayables();
  }
}
export interface PeriodicElement {
  no: string;
  name: string;
  type: string;
  loan: string;
  ldate: string;
  today: string;
  ten: string;
  rate: string;
  emi: string;
  fin: string;
  status: string;
}
