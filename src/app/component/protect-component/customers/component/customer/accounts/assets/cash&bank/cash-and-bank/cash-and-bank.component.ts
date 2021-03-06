import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource, MatBottomSheet } from '@angular/material';
import { BankAccountsComponent } from '../bank-accounts/bank-accounts.component';
import { CashInHandComponent } from '../cash-in-hand/cash-in-hand.component';
import { DetailedViewCashInHandComponent } from '../cash-in-hand/detailed-view-cash-in-hand/detailed-view-cash-in-hand.component';
import { DetailedViewBankAccountComponent } from '../bank-accounts/detailed-view-bank-account/detailed-view-bank-account.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { FileUploadServiceService } from '../../file-upload-service.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { AssetValidationService } from '../../asset-validation.service';
import { BottomSheetComponent } from '../../../../../common-component/bottom-sheet/bottom-sheet.component';
import { Subscription } from 'rxjs';
import { RoleService } from 'src/app/auth-service/role.service';
import { CustomerOverviewService } from '../../../../customer-overview/customer-overview.service';
@Component({
  selector: 'app-cash-and-bank',
  templateUrl: './cash-and-bank.component.html',
  styleUrls: ['./cash-and-bank.component.scss']
})
export class CashAndBankComponent implements OnInit {
  @Output() changeCount = new EventEmitter();
  bankDataList: any;
  cashDataList: any;
  showRequring: string;
  advisorId: any;
  clientId: any;
  totalAccountBalance: any;
  sumOfCashValue: any;
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  bankAccountList = new MatTableDataSource(this.data);
  cashInHandList = new MatTableDataSource(this.data);
  noData: string;
  excelData: any[];
  footer = [];
  private unSubcrip: Subscription;
  private unSubcrip2: Subscription;
  @ViewChild('bankAccountListTable', { static: false }) bankAccountListTableSort: MatSort;
  @ViewChild('tableEl', { static: false }) tableEl;

  displayedColumns7 = ['no', 'owner', 'type', 'amt', 'rate', 'bal', 'account', 'bank', 'desc', 'status', 'icons'];
  datasource7 = ELEMENT_DATA7;
  displayedColumns8 = ['no', 'owner', 'cash', 'bal', 'desc', 'status', 'icons'];
  datasource8 = ELEMENT_DATA8;
  @ViewChild('cashInHandListTable', { static: false }) cashInHandListTableSort: MatSort;
  fileUploadData: any;
  file: any;
  isLoadingUpload: boolean = false;
  clientData: any;
  myFiles: any;
  userInfo: any;
  getOrgData: any;
  reportDate: Date;
  fragmentData = { isSpinner: false };
  returnValue: Subscription;
  cashAndBankCapability: any;

  constructor(private ref: ChangeDetectorRef, private excel: ExcelGenService, private pdfGen: PdfGenService, private subInjectService: SubscriptionInject,
    private fileUpload: FileUploadServiceService, private enumService: EnumServiceService,
    private custumService: CustomerService, private eventService: EventService, private enumDataService: EnumDataService,
    public utils: UtilService, public dialog: MatDialog, private assetValidation: AssetValidationService,
    private _bottomSheet: MatBottomSheet,
    public roleService: RoleService,
    private customerOverview: CustomerOverviewService) {
    this.clientData = AuthService.getClientData()
  }

  @ViewChildren(FormatNumberDirective) formatNumber;
  @ViewChild('bankAccTemp', { static: false }) bankAccTemp: ElementRef;
  @ViewChild('cashInHandTemp', { static: false }) cashInHandTemp: ElementRef;
  @Output() loaded = new EventEmitter();
  @Input() finPlanObj: any;//finacial plan pdf input
  bankList: any = [];
  clientFamilybankList: any = [];
  accountTypes: any = [];
  ngOnInit() {
    this.cashAndBankCapability = this.roleService.portfolioPermission.subModule.assets.subModule.cashAndBanks.capabilityList
    this.reportDate = new Date();
    this.showRequring = '1';
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    if (this.finPlanObj) {
      if (this.finPlanObj.sectionName == 'Bank accounts') {
        this.showRequring = '1'
        this.getfixedIncomeData('1');
      } else {
        this.showRequring = '2'
        this.getfixedIncomeData('2');
      }
    } else {
      this.getfixedIncomeData('1');
    }
    // this.bankAccountList = new MatTableDataSource(this.data);
    this.accountTypes = this.enumDataService.accountTypes;
    this.clientFamilybankList = this.enumService.clientFamilybankList;
    this.bankList = this.enumService.getBank();
    this.unSubcrip = this.enumDataService.getBankAccountViewTypes().subscribe(data => {
      this.accountTypes = data;
    });
    this.unSubcrip2 = this.enumService.getclientViewbankList().subscribe(data => {
      this.clientFamilybankList = data;
    });
    console.log(this.bankList, "this.bankList", this.clientFamilybankList);

  }

  Excel(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows, tableTitle)
  }

  fetchData(value, fileName, element, type) {
    element['subCatTypeId'] = type;
    this.isLoadingUpload = true
    let obj = {
      advisorId: this.advisorId,
      clientId: element.clientId,
      familyMemberId: element.familyMemberId,
      asset: value,
      element: element
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
  // pdf(tableTitle) {
  //   let rows = this.tableEl._elementRef.nativeElement.rows;
  //   this.pdfGen.generatePdf(rows, tableTitle);
  // }
  pdf(template, tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.fragmentData.isSpinner = true;
    const para = document.getElementById(template);
    const obj = {
      htmlInput: para.innerHTML,
      name: tableTitle,
      landscape: true,
      key: '',
      svg: ''
    };
    let header = null
    this.returnValue = this.utils.htmlToPdf(header, para.innerHTML, tableTitle, false, this.fragmentData, '', '', true);
    console.log('return value ====', this.returnValue);
    return obj;
    //this.pdfGen.generatePdf(rows, tableTitle);
  }
  // async ExportTOExcel(value) {
  //   this.excelData = [];
  //   let data = [];
  //   var headerData = [{ width: 20, key: 'Owner' },
  //   { width: 20, key: 'Account type' },
  //   { width: 25, key: 'Balance as on' },
  //   { width: 18, key: 'Rate' },
  //   { width: 18, key: 'Balance mentioned' },
  //   { width: 18, key: 'Account number' },
  //   { width: 18, key: 'Bank name' },
  //   { width: 15, key: 'Description' },
  //   { width: 10, key: 'Status' }];
  //   var header = ['Owner', 'Account type', ' Balance as on', 'Description', 'Status'];

  //   if (value == 'Cash in hand') {
  //     headerData = [
  //       { width: 20, key: 'Owner' },
  //       { width: 20, key: 'Account type' },
  //       { width: 25, key: 'Balance as on' },
  //       { width: 15, key: 'Description' },
  //       { width: 10, key: 'Status' },
  //     ];
  //     this.cashInHandList.filteredData.forEach(element => {
  //       data = [element.ownerName, (element.accountType), (element.balanceAsOn),
  //       element.description, element.status];
  //       this.excelData.push(Object.assign(data));
  //     });
  //     const footerData = [
  //       'Total',
  //       this.formatNumber.first.formatAndRoundOffNumber(this.sumOfCashValue),
  //       '',
  //       '', ,
  //       ''
  //     ];
  //     this.footer.push(Object.assign(footerData));
  //   } else {

  //     header = [
  //       'Owner',
  //       'Account type',
  //       'Balance as on',
  //       'Rate',
  //       'Balance mentioned',
  //       'Account number',
  //       'Bank name',
  //       'Description',
  //       'Status'
  //     ];
  //     this.bankAccountList.filteredData.forEach(element => {
  //       data = [
  //         element.ownerName,
  //         (element.accountType == 1) ? 'Current' : 'Savings',
  //         new Date(element.balanceAsOn),
  //         (element.interestRate),
  //         this.formatNumber.first.formatAndRoundOffNumber(element.accountBalance),
  //         (element.account),
  //         element.bankName,
  //         element.description,
  //         element.status
  //       ];
  //       this.excelData.push(Object.assign(data));
  //     });
  //     const footerData = ['Total', '', '', '', this.formatNumber.first.formatAndRoundOffNumber(this.totalAccountBalance), '', '', '', ''];
  //     this.footer.push(Object.assign(footerData));
  //   }
  //   ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  // }
  recDataList
  getfixedIncomeData(value) {
    console.log('value++++++', value);
    this.isLoading = true;
    this.showRequring = value;
    if (value == '2') {
      if (this.cashDataList || this.assetValidation.cashDataList) {
        this.getCashInHandRes(this.cashDataList ? this.cashDataList : this.assetValidation.cashDataList)
        // this.cashInHandList.data = this.cashDataList ? this.cashDataList : this.assetValidation.cashDataList;
      }
      else {
        this.getCashInHandList();
        this.cashInHandList = new MatTableDataSource(this.data);
      }
    } else {
      if (this.bankDataList || this.assetValidation.bankDataList) {
        this.getBankAccountsRes(this.bankDataList ? this.bankDataList : this.assetValidation.bankDataList)
        // this.isLoading = false;
        // this.bankAccountList.data = this.bankDataList ? this.cashDataList : this.assetValidation.bankDataList;
      }
      else {
        this.getBankAccountList();
        this.bankAccountList = new MatTableDataSource(this.data);
      }
    }
  }



  deleteModal(value, element) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        if (value == 'BANK') {
          this.custumService.deleteBankAccount(element.id).subscribe(
            data => {
              dialogRef.close();
              this.customerOverview.portFolioData = null;
              this.customerOverview.assetAllocationChart = null;
              this.customerOverview.summaryLeftsidebarData = null;
              this.customerOverview.aumGraphdata = null;
              this.customerOverview.assetAllocationChart = null;
              this.customerOverview.summaryCashFlowData = null;
              this.assetValidation.addAssetCount({ type: 'Delete', value: 'cashAndBank' })
              this.bankDataList = this.bankDataList.filter(x => x.id != element.id);
              this.bankAccountList.data = this.bankDataList;
              // this.getBankAccountList();
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else {
          this.custumService.deleteCashInHand(element.id).subscribe(
            data => {
              dialogRef.close();
              this.customerOverview.portFolioData = null;
              this.customerOverview.assetAllocationChart = null;
              this.customerOverview.summaryLeftsidebarData = null;
              this.customerOverview.aumGraphdata = null;
              this.customerOverview.assetAllocationChart = null;
              this.customerOverview.summaryCashFlowData = null;
              this.assetValidation.addAssetCount({ type: 'Delete', value: 'cashAndBank' })
              this.cashDataList = this.cashDataList.filter(x => x.id != element.id);
              this.cashInHandList.data = this.cashDataList;
              // this.getCashInHandList();
            },
            error => this.eventService.showErrorMessage(error)
          );
        }
        // (value == "BANK ACCOUNT") ? this.getBankAccountList() : this.getCashInHandList();
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

  getBankAccountList() {
    this.isLoading = true;
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.bankAccountList.data = [{}, {}, {}];
    this.custumService.getBankAccounts(obj).subscribe(
      data => this.getBankAccountsRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.bankAccountList.data = [];
        this.isLoading = false;
      });
  }

  getBankAccountsRes(data) {
    this.isLoading = false;
    console.log('getBankAccountsRes ####', data);
    this.isLoading = false;
    if (data != undefined) {
      // this.assetValidation.getAssetCountGLobalData()
      this.bankDataList = data
      this.bankAccountList.data = this.bankDataList.assetList;
      this.bankAccountList.sort = this.bankAccountListTableSort;
      this.totalAccountBalance = data.sumOfAccountBalance;
    } else {
      this.noData = 'No Bank accounts found';
      this.bankAccountList.data = [];
    }
    this.ref.detectChanges();
    this.loaded.emit(this.bankAccTemp.nativeElement);
  }

  getCashInHandList() {
    this.isLoading = true;
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.cashInHandList.data = [{}, {}, {}];
    this.custumService.getCashInHand(obj).subscribe(
      data => this.getCashInHandRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.cashInHandList.data = [];
        this.isLoading = false;
      }
    );
  }

  getCashInHandRes(data) {
    console.log('getCashInHandRes ###', data);
    this.isLoading = false;
    if (data == undefined) {
      this.noData = 'No Cash in hand found';
      this.cashInHandList.data = [];
    }
    else if (data.assetList.length != 0) {
      // this.assetValidation.getAssetCountGLobalData()
      this.cashDataList = data;
      this.cashInHandList.data = this.cashDataList.assetList;
      this.cashInHandList.sort = this.cashInHandListTableSort;
      this.sumOfCashValue = data.sumOfCashValue;
    } else {
      this.noData = 'No Cash in hand found';
      this.cashInHandList.data = [];
    }
    this.ref.detectChanges();
    this.loaded.emit(this.cashInHandTemp.nativeElement);
  }

  openAddEdit(data, value) {
    let popupHeaderText = (value == 'bankAccount') ? (!!data ? 'Edit Bank account' : 'Add Bank account') : (!!data ? 'Edit Cash in hand' : 'Add Cash in hand');
    let componentName = (value == 'bankAccount') ? BankAccountsComponent : CashInHandComponent;
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: componentName,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            (sideBarData.data == 1) ? this.getBankAccountList() : this.getCashInHandList();

            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  detailedViewbankAccount(data) {
    const fragmentData = {
      flag: 'detailedViewbankAccount',
      id: 1,
      data,
      state: 'open35',
      componentName: DetailedViewBankAccountComponent,
    };
    this.subInjectService.changeNewRightSliderState(fragmentData);
  }

  detailedViewCashInHand(data) {
    const fragmentData = {
      flag: 'detailedViewCashInHand',
      id: 1,
      data,
      state: 'open35',
      componentName: DetailedViewCashInHandComponent,
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

  ngOnDestroy() {
    this.assetValidation.cashDataList = this.cashDataList ? this.cashDataList : null;
    this.assetValidation.bankDataList = this.bankDataList ? this.bankDataList : null;
    this.unSubcrip.unsubscribe();
    this.unSubcrip2.unsubscribe();
    console.log("unsubscribe");
  }
}

export interface PeriodicElement7 {
  no: string;
  owner: string;
  type: string;
  amt: string;
  rate: string;
  bal: string;
  account: string;
  bank: string;
  desc: string;
  status: string;
}

const ELEMENT_DATA7: PeriodicElement7[] = [
  {
    no: '1.', owner: 'Rahul Jain',
    type: 'Savings', amt: '08/02/2019', rate: '8.40%', bal: '1,00,000', account: '980787870909', bank: 'ICICI',
    desc: 'ICICI FD', status: ''
  },
  {
    no: '2.', owner: 'Shilpa Jain',
    type: 'Current', amt: '08/02/2019', rate: '8.60%', bal: '50,000', account: '77676767622', bank: 'Axis',
    desc: 'Axis bank FD', status: ''
  },
  {
    no: '', owner: 'Total',
    type: '', amt: '', rate: '', bal: '1,50,000', account: '', bank: '',
    desc: '', status: ''
  },


];

export interface PeriodicElement8 {
  no: string;
  owner: string;
  cash: string;
  bal: string;
  desc: string;
}

const ELEMENT_DATA8: PeriodicElement8[] = [
  {
    no: '1.', owner: 'Rahul Jain'
    , cash: '94,925', bal: '09/02/2019',
    desc: 'ICICI FD',
  },
  {
    no: '2.', owner: 'Shilpa Jain'
    , cash: '94,925', bal: '09/02/2019',
    desc: 'Axis bank FD',
  },
  {
    no: '', owner: 'Total'
    , cash: '1,28,925', bal: '',
    desc: '',
  },


];
