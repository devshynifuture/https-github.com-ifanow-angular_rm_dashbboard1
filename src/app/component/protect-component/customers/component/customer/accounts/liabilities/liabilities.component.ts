import { Component, OnInit, ViewChild, ViewChildren, ElementRef } from '@angular/core';
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
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { FileUploadServiceService } from '../assets/file-upload-service.service';
import { LoanAmortsComponent } from './loan-amorts/loan-amorts.component';


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
  totalLoanAmt = 0;
  outStandingAmt = 0;
  totalEmi = 0;
  filterData: any;
  excelData: any[];
  footer = [];
  fragmentData = { isSpinner: false };
  deletedDataId: any;
  isLiabilitiFilter = false;
  filteredData: any[];
  filterForliabilities: any;
  advisorData: any;
  personalProfileData: any;
  fileUploadData: any;
  file: any;
  clientData: any;
  isLoadingUpload: boolean = false;
  myFiles: any;


  constructor(private excel: ExcelService, private eventService: EventService, private subInjectService: SubscriptionInject,
    public customerService: CustomerService,
    private fileUpload : FileUploadServiceService,
    public util: UtilService, public dialog: MatDialog, private excelGen: ExcelGenService,private pdfGen :PdfGenService) {
      this.clientData = AuthService.getClientData()
    }
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChildren(FormatNumberDirective) formatNumber;
  @ViewChild('liabilitiesTemp', { static: false }) liabilitiesTemp: ElementRef;

  viewMode: string;

  ngOnInit() {
    this.viewMode = 'tab1';
    this.showFilter = 'tab1';
    //this.showLoader = true;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.personalProfileData = AuthService.getProfileDetails();
    // this.advisorData = AuthService.getProfileInfo();
    this.getLiability('');
    this.getPayables();
    this.getGlobalLiabilities();
  }
  /**used for excel  */
  // async ExportTOExcel(value) {

  //   this.excelData = []
  //   var data = []
  //   var headerData = [{ width: 20, key: 'Owner' },
  //   { width: 20, key: 'Type' },
  //   { width: 20, key: 'Loan amount' },
  //   { width: 18, key: 'Loan as on' },
  //   { width: 25, key: 'Outstanding as on today' },
  //   { width: 18, key: 'Tenure remaining' },
  //   { width: 25, key: 'Annual interest rate' },
  //   { width: 18, key: 'EMI' },
  //   { width: 25, key: 'Financial institution' },
  //   { width: 18, key: 'Status' },]
  //   var header = ['Owner', 'Type', 'Loan amount', 'Loan as on',
  //     'Outstanding as on today', 'Tenure remaining', 'Annual interest rate', 'EMI', 'Financial institution', 'Status'];
  //   this.dataSource.filteredData.forEach(element => {
  //     data = [element.ownerName, (element.loanTypeId == 1) ? 'Home Loan' : (element.loanTypeId == 2) ? 'Vehicle' : (element.loanTypeId == 3) ? 'Education' : (element.loanTypeId == 4) ? 'Credit Card' : (element.loanTypeId == 5) ? 'Personal' : 'Mortgage', this.formatNumber.first.formatAndRoundOffNumber(element.loanAmount)
  //       , new Date(element.commencementDate), this.formatNumber.first.formatAndRoundOffNumber(element.outstandingAmount),
  //     element.loanTenure, element.annualInterestRate, this.formatNumber.first.formatAndRoundOffNumber(element.emi), element.financialInstitution, element.status]
  //     this.excelData.push(Object.assign(data))
  //   });
  //   var footerData = ['Total', '', this.formatNumber.first.formatAndRoundOffNumber(this.totalLoanAmt), '', this.formatNumber.first.formatAndRoundOffNumber(this.outStandingAmt), '', '', '', '', '']
  //   this.footer.push(Object.assign(footerData))
  //   ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value)
  // }
  fetchData(value, fileName) {
    this.isLoadingUpload = true
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      familyMemberId: this.clientData.familyMemberId,
      asset: value
    }
    this.myFiles = fileName.target.files[0]
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
    const data = this.excelGen.generateExcel(rows, tableTitle);
    if (data) {
      this.fragmentData.isSpinner = false;
    }
  }
  // generatePdf() {
  //   this.fragmentData.isSpinner = true;
  
  //   let para = document.getElementById('template');
  //   this.util.htmlToPdf(para.innerHTML, 'Test', this.fragmentData);
  // }
  generatePdf(tableTitle){
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.pdfGen.generatePdf(rows, tableTitle);
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
  filterLiabilities(category, key: string, value: any, data) {
    let dataFiltered;
    if (data == 'tab1') {
      dataFiltered = this.filterForliabilities;
    } else {
      data = parseInt(data);
      dataFiltered = this.filterForliabilities.filter(function (item) {
        return item[category] === data;
      });
    }

    dataFiltered = dataFiltered.filter(function (item) {
      return item[key] === value;
    });

    this.isLiabilitiFilter = true;
    if (dataFiltered.length > 0) {
      this.dataSource.data = dataFiltered;
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.totalLoanAmt =0;
      this.outStandingAmt =0;
      this.totalEmi = 0;
     this.dataSource.data.forEach(element => {
        this.totalLoanAmt += element.loanAmount
        this.totalEmi += element.emi;
      });
      this.dataSource.data.forEach(element => {
        if (element.outstandingAmount == "NaN") {
          element.outstandingAmount = 0
        }
        this.outStandingAmt += element.outstandingAmount
      });
    } else {
      this.eventService.openSnackBar("No data found", "Dismiss")
    }


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
        this.totalLoanAmt = 0
        this.outStandingAmt = 0
        this.totalEmi = 0;
        this.totalLoanAmt = filterData.reduce((accumulator, currentElement) =>
          accumulator + currentElement.loanAmount
          , 0)
        this.outStandingAmt = filterData.reduce((accumulator, currentElement) =>
          accumulator + currentElement.outstandingAmount
          , 0)
          this.totalEmi = filterData.reduce((accumulator, currentElement) =>
          accumulator + currentElement.emi
          , 0)
        // this.dataSource = filterData;
        this.dataSource = new MatTableDataSource(filterData);
        this.dataSource.sort = this.sort;

      }
    }
  }

  deleteModal(value, data) {
    if(this.showFilter =='tab1'){
      this.deletedDataId = this.showFilter
    }else{
      this.deletedDataId =data.loanTypeId;
    }
    // this.deletedDataId = (this.showFilter ==' tab1') ? this.deletedDataId = this.showFilter: 
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.customerService.deleteLiabilities(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("Liabilitiy deleted successfully", "Dismiss")
            dialogRef.close();
            this.getLiability(this.deletedDataId);
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
    (data.id) ? data.showFilter=this.showFilter : data
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

    this.dataToShow = (data == "") ? null : (data.data) ? data.data : data
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

  checkStatusId(data) {
    data.forEach(obj => {
      if (obj.maturityDate < new Date()) {
        obj.statusId = 'CLOSED';
      } else {
        obj.statusId = 'LIVE';
      }
    });
  }
  getLiabiltyRes(data) {
    this.isLoading = false;
    // this.showLoader = false;
    if (data && data.loans.length > 0) {
      this.filterForliabilities = data.loans;
      this.checkStatusId(data.loans);
      this.totalLoanAmt = 0;
      this.totalEmi = 0;
      // this.totalLoanAmt = data.totalLoanAmount;
      // this.outStandingAmt = data.outstandingAmount;
      data.loans.forEach(element => {
        this.totalLoanAmt += element.loanAmount
        this.totalEmi += element.emi
      });
      data.loans.forEach(element => {
        if (element.outstandingAmount == "NaN") {
          element.outstandingAmount = 0
        }
        this.outStandingAmt += element.outstandingAmount
      });
      data.loans.forEach(element => {
        if(element.remainingMonths ||element.remainingMonths!=0){
          element.months=(element.remainingMonths % 12);
          element.years= ~~(element.remainingMonths / 12)
          console.log('months',element.months);
          console.log('years',element.years);
        }else{
          element.months=0;
          element.years= 0
        }
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
    } else {
      this.noData = "No Data Found";
      this.dataSource.data = []
      this.filterForliabilities =[];
      this.home =[];
   
      this.vehicle=[];

      this.education=[];
  
      this.creditCard=[];

      this.personal=[];
    
      this.mortgage=[];
      this.dataStore =[];
      this.storeData = data.loans.length;
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
