import { RecuringDepositComponent } from './../recuring-deposit/recuring-deposit.component';
import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource, MatBottomSheet } from '@angular/material';
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
import { FileUploadServiceService } from '../../file-upload-service.service';
import { AssetValidationService } from '../../asset-validation.service';
import { BottomSheetComponent } from '../../../../../common-component/bottom-sheet/bottom-sheet.component';
import { RoleService } from 'src/app/auth-service/role.service';
import { CustomerOverviewService } from '../../../../customer-overview/customer-overview.service';


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
  totalCurrentValue: any;
  totalMarketValue = 0;
  sumAmountInvestedB: any;
  sumCouponAmount: any;
  sumCurrentValueB: any;
  hideFilter: boolean = false;
  @ViewChild('fixedIncomeTableSort', { static: false }) fixedIncomeTableSort: MatSort;
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('recurringDepositTable', { static: false }) recurringDepositTableSort: MatSort;
  @ViewChild('bondListTable', { static: false }) bondListTableSort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  @Output() loaded = new EventEmitter();
  @Input() finPlanObj: any;//finacial plan pdf input
  @ViewChild('fixedDepositeTemp', { static: false }) fixedDepositeTemp: ElementRef;
  @ViewChild('recurringDepositeTemp', { static: false }) recurringDepositeTemp: ElementRef;
  @ViewChild('bondsTemp', { static: false }) bondsTemp: ElementRef;

  excelData: any[];
  footer = [];
  data: Array<any> = [{}, {}, {}];
  hidePdf: boolean;
  noData: string;
  fixDataList: any;
  recDataList: any;
  bondDataList: any;
  fileUploadData: any;
  file: any;
  isLoadingUpload: boolean = false;
  responseData: any;
  clientData: any;
  myFiles: any;
  userInfo: any;
  getOrgData: any;
  reportDate: Date;
  fragmentData = { isSpinner: false };
  returnValue: any;
  fixedIncomeCapability: any = {};

  constructor(private ref: ChangeDetectorRef, private excelSer: ExcelService, private subInjectService: SubscriptionInject,
    private customerService: CustomerService, private eventService: EventService,
    private excel: ExcelGenService, private pdfGen: PdfGenService,
    private utilService: UtilService,
    private fileUpload: FileUploadServiceService,
    private custumService: CustomerService,
    public util: UtilService, public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet, private assetValidation: AssetValidationService,
    public roleService: RoleService,
    private customerOverview: CustomerOverviewService) {
  }

  viewMode;
  displayedColumns4 = ['no', 'owner', 'type', 'cvalue', 'rate', 'amt', 'mdate', 'mvalue', 'number', 'desc', 'status', 'icons'];
  displayedColumns5 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];
  displayedColumns6 = ['no', 'owner', 'cvalue', 'camt', 'amt', 'cdate', 'rate', 'mvalue', 'tenure', 'type', 'desc', 'status', 'icons'];
  filterMode;
  dataSourceFixedFiltered;
  isFixedIncomeFiltered = false;

  ngOnInit() {
    this.reportDate = new Date();
    this.fixedIncomeCapability = this.roleService.portfolioPermission.subModule.assets.subModule.fixedIncome.capabilityList
    this.showRequring = '1';
    this.hidePdf = true;
    this.fragmentData.isSpinner = false
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.clientData = AuthService.getClientData()
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    if (this.finPlanObj) {
      if (this.finPlanObj.sectionName == 'Fixed deposit') {
        this.showRequring = '1'
        this.getfixedIncomeData(1);

      } else if (this.finPlanObj.sectionName == 'Recurring deposits') {
        this.showRequring = '2'
        this.getfixedIncomeData(2);
      } else {
        this.showRequring = '3'
        this.getfixedIncomeData(3);
      }
    } else {
      this.getfixedIncomeData(1);
    }
    // this.dataSource = new MatTableDataSource(this.data);
  }

  Close() {

  }
  fetchData(value, fileName, element, type) {
    element['subCatTypeId'] = type;
    this.isLoadingUpload = true
    let obj = {
      advisorId: this.advisorId,
      clientId: element.clientId,
      familyMemberId: (element.ownerList[0].isClient == 1) ? 0 : element.ownerList[0].familyMemberId,
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
    // this.myFiles = fileName.target.files[0]
    this.fileUploadData = this.fileUpload.fetchFileUploadData(obj, this.myFiles);
    // if (this.fileUploadData) {
    //   this.file = fileName
    //   this.fileUpload.uploadFile(fileName)
    // }
    setTimeout(() => {
      this.isLoadingUpload = false
    }, 7000);
  }
  Excel(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows, tableTitle)
  }

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
    this.returnValue = this.utilService.htmlToPdf(header, para.innerHTML, tableTitle, false, this.fragmentData, '', '', true);
    console.log('return value ====', this.returnValue);
    return obj;
    //this.pdfGen.generatePdf(rows, tableTitle);
  }



  changeRecurringFilterMode(value) {
    console.log('this is filter data', value);
    this.dataSource.filter = value.trim().toLowerCase();
  }

  changeFixedIncomeFilterMode(value) {
    console.log('this is filter data', value);
    this.dataSource.filter = value.trim().toLowerCase();
  }
  @Output() changeCount = new EventEmitter();

  getfixedIncomeData(value) {
    console.log('value++++++', value);
    this.showRequring = value;

    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    if (value == '2') {
      if (this.recDataList || this.assetValidation.recDataList) {
        this.isLoading = false;
        this.getRecurringDepositRes(this.recDataList ? this.recDataList : this.assetValidation.recDataList);
      }
      else {
        this.getRecurringDepositList();
      }
    } else if (value == '3') {
      if (this.bondDataList || this.assetValidation.bondDataList) {
        this.isLoading = false;
        this.getBondsRes(this.bondDataList ? this.bondDataList : this.assetValidation.bondDataList);
      }
      else {
        this.getBondsList();
      }
    } else {
      if (this.fixDataList || this.assetValidation.fixDataList) {
        this.isLoading = false;
        this.getFixedDepositRes(this.fixDataList ? this.fixDataList : this.assetValidation.fixDataList);
      }
      else {
        this.getFixedDepositList();
      }
    }

  }

  getFixedDepositList() {
    this.showRequring = '1';
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
  totalSum: any
  getFixedDepositRes(data) {
    this.isLoading = false;
    this.totalSum = data;
    if (data == undefined) {
      this.noData = "No scheme found";
      this.dataSource.data = [];
      this.hideFilter = false;
    } else if (data.assetList) {
      // this.assetValidation.getAssetCountGLobalData()

      this.fixDataList = data;
      this.dataSource.data = this.fixDataList.assetList;
      console.log('fixed deposite', this.dataSource.data)
      this.dataSource.sort = this.fixedIncomeTableSort;
      UtilService.checkStatusId(this.dataSource.filteredData);
      this.sumCurrentValue = 0;
      this.dataSource.filteredData.forEach((o) => {
        if (o.nomineePercentageShare) {
          this.sumCurrentValue += o.nomineePercentageShare;
        }

      });
      this.sumAmountInvested = this.fixDataList.sumOfAmountInvested;
      this.sumCurrentValue = this.fixDataList.sumOfCurrentValue;
      this.sumMaturityValue = this.fixDataList.sumOfMaturityValue;
      console.log('sumCurrentValue', this.sumCurrentValue);
    } else {
      this.noData = 'No scheme found';
      this.dataSource.data = [];
    }
    if (this.finPlanObj) {
      this.ref.detectChanges();
      this.loaded.emit(this.fixedDepositeTemp.nativeElement);
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

  reTotalSum: any
  sumOfMonthlyContribution: any;
  sumOfMaturityValue: any;
  getRecurringDepositRes(data) {
    this.reTotalSum = data;
    this.isLoading = false;
    if (data != undefined) {
      if (data.assetList) {
        // this.assetValidation.getAssetCountGLobalData()

        console.log('FixedIncomeComponent getRecuringDepositRes data *** ', data);
        this.recDataList = data;
        this.hideFilter = false;
        this.dataSource.data = this.recDataList.assetList;
        this.dataSource.sort = this.recurringDepositTableSort;
        UtilService.checkStatusId(this.dataSource.filteredData);
        this.totalCurrentValue = this.recDataList.totalCurrentValue;
        this.sumOfMonthlyContribution = this.recDataList.sumOfMonthlyContribution;
        this.sumOfMaturityValue = this.recDataList.sumOfMaturityValue;
      }
    }
    else {
      this.noData = 'No scheme found';
      this.dataSource.data = [];
      this.hideFilter = true;
    }
    if (this.finPlanObj) {
      this.ref.detectChanges();
      this.loaded.emit(this.recurringDepositeTemp.nativeElement);
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

  bondTotalSum: any;
  getBondsRes(data) {
    this.bondTotalSum = data;
    this.isLoading = false;
    if (data != undefined) {
      if (data.assetList) {
        // this.assetValidation.getAssetCountGLobalData();

        console.log('getBondsRes ******** ', data);
        this.bondDataList = data;
        this.hideFilter = false;
        this.dataSource.data = this.bondDataList.assetList;
        this.dataSource.sort = this.bondListTableSort;
        UtilService.checkStatusId(this.dataSource.filteredData);
        this.sumAmountInvestedB = this.bondDataList.sumOfAmountInvested;
        this.sumCouponAmount = this.bondDataList.sumOfCouponAmount;
        this.sumCurrentValueB = this.bondDataList.sumOfCurrentValue;
        this.sumMaturityValue = this.bondDataList.sumOfMaturityValue;
      }
    } else {
      this.noData = 'No scheme found';
      this.dataSource.data = [];
      this.hideFilter = true;
    }
    if (this.finPlanObj) {
      this.ref.detectChanges();
      this.loaded.emit(this.bondsTemp.nativeElement);
    }
  }

  activeFilter: any = 'All';
  filterFixedIncome(key: string, value: any, data: any, type: string) {
    this.sumAmountInvested = 0;
    this.sumCurrentValue = 0;
    this.sumMaturityValue = 0;

    this.totalCurrentValue = 0;
    this.sumOfMonthlyContribution = 0;
    this.sumOfMaturityValue = 0;

    this.sumAmountInvestedB = 0;
    this.sumCouponAmount = 0;
    this.sumCurrentValueB = 0;
    // this.sumMaturityValue = 0;

    let dataFiltered = [];
    this.activeFilter = value;
    if (value == "All") {
      if (type == 'fix') {
        this.getFixedDepositRes(data)
      }
      else if (type == 'bond') {
        this.getBondsRes(data)
      }
      else {
        this.getRecurringDepositRes(data)
      }
    }
    else {
      data.assetList.forEach(item => {
        if (item[key] === value) {
          if (item.currentValue) {
            this.sumCurrentValue += item.currentValue;
            this.totalCurrentValue += item.currentValue;
            this.sumCurrentValueB += item.currentValue;
          }
          if (item.amountInvested) {
            this.sumAmountInvested += item.amountInvested;
            this.sumAmountInvestedB += item.amountInvested;
          }
          if (item.monthlyContribution) {
            this.sumOfMonthlyContribution += item.monthlyContribution;
          }
          if (item.maturityValue) {
            this.sumMaturityValue += item.maturityValue;
            this.sumOfMaturityValue += item.maturityValue;
          }
          if (item.couponAmount) {
            this.sumCouponAmount += item.couponAmount
          }
        }
      });
      dataFiltered = data.assetList.filter(function (item) {
        return item[key] === value;
      });
      if (dataFiltered.length <= 0) {
        this.hideFilter = false;
      }
      this.dataSource.data = dataFiltered;
    }

    this.isFixedIncomeFiltered = true;

    // this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.fixedIncomeTableSort;
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
        if (value == 'FIXED DEPOSIT') {
          this.customerService.deleteFixedDeposite(element.id).subscribe(
            data => {
              dialogRef.close();
              this.customerOverview.portFolioData = null;
              this.customerOverview.assetAllocationChart = null;
              this.customerOverview.summaryLeftsidebarData = null;
              this.customerOverview.aumGraphdata = null;
              this.customerOverview.assetAllocationChart = null;
              this.customerOverview.summaryCashFlowData = null;
              // this.getFixedDepositList();
              this.fixDataList.assetList = this.fixDataList.assetList.filter(x => x.id != element.id);
              // this.dataSource.data = this.fixDataList.assetList;

              // this.fixDataList.assetList.push(sideBarData.data);
              this.fixDataList.sumOfAmountInvested -= element.amountInvested;
              this.fixDataList.sumOfCurrentValue -= element.currentValue;
              this.fixDataList.sumOfMaturityValue -= element.maturityValue;
              this.assetValidation.addAssetCount({ type: 'Delete', value: 'fixedIncome' })
              this.getFixedDepositRes(this.fixDataList);
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else if (value == 'RECURRING DEPOSIT') {
          this.customerService.deleteRecurringDeposite(element.id).subscribe(
            data => {
              dialogRef.close();
              this.customerOverview.portFolioData = null;
              this.customerOverview.assetAllocationChart = null;
              this.customerOverview.summaryLeftsidebarData = null;
              this.customerOverview.aumGraphdata = null;
              this.customerOverview.assetAllocationChart = null;
              this.customerOverview.summaryCashFlowData = null;
              // this.getRecurringDepositList();
              this.assetValidation.addAssetCount({ type: 'Delete', value: 'fixedIncome' })
              this.recDataList.assetList = this.recDataList.assetList.filter(x => x.id != element.id);

              this.recDataList.totalCurrentValue -= element.currentValue;
              this.recDataList.sumOfMonthlyContribution -= element.monthlyContribution;
              this.recDataList.sumOfMaturityValue -= element.maturityValue;
              this.getRecurringDepositRes(this.recDataList);

            },
            error => this.eventService.showErrorMessage(error)
          );
        } else {
          this.customerService.deleteBond(element.id).subscribe(
            data => {
              dialogRef.close();
              this.customerOverview.portFolioData = null;
              this.customerOverview.assetAllocationChart = null;
              this.customerOverview.summaryLeftsidebarData = null;
              this.customerOverview.aumGraphdata = null;
              this.customerOverview.assetAllocationChart = null;
              this.customerOverview.summaryCashFlowData = null;
              // this.getBondsList();
              this.assetValidation.addAssetCount({ type: 'Delete', value: 'fixedIncome' })
              this.bondDataList.assetList = this.bondDataList.assetList.filter(x => x.id != element.id);
              this.bondDataList.sumOfAmountInvested -= element.amountInvested;
              this.bondDataList.sumOfCouponAmount -= element.couponAmount;
              this.bondDataList.sumOfCurrentValue -= element.currentValue;
              this.bondDataList.sumOfMaturityValue -= element.maturityValue;
              this.getBondsRes(this.bondDataList);
            },
            error => this.eventService.showErrorMessage(error)
          );
        }
        this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
      },
      negativeMethod: () => {
      }
    };

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
            if (!data) {
              if (!this.fixDataList) {
                this.fixDataList = { assetList: [sideBarData.data] };
                this.fixDataList['sumOfAmountInvested'] = sideBarData.data.amountInvested;
                this.fixDataList['sumOfCurrentValue'] = sideBarData.data.currentValue;
                this.fixDataList['sumOfMaturityValue'] = sideBarData.data.maturityValue;
              }
              else {
                this.fixDataList.assetList.push(sideBarData.data);
                this.fixDataList.sumOfAmountInvested += sideBarData.data.amountInvested;
                this.fixDataList.sumOfCurrentValue += sideBarData.data.currentValue;
                this.fixDataList.sumOfMaturityValue += sideBarData.data.maturityValue;
              }
              this.getFixedDepositRes(this.fixDataList);
            }
            else {
              this.getFixedDepositList();
            }
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
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getFixedDepositList();
          }
          rightSideDataSub.unsubscribe();
        }
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
            if (data) {
              this.getRecurringDepositList();
            }
            else {
              if (!this.recDataList) {
                this.recDataList = { assetList: [sideBarData.data] };
                this.recDataList['totalCurrentValue'] = sideBarData.data.currentValue;
                this.recDataList['sumOfMonthlyContribution'] = sideBarData.data.monthlyContribution;
                this.recDataList['sumOfMaturityValue'] = sideBarData.data.maturityValue;
              }
              else {
                this.recDataList.assetList.push(sideBarData.data);
                this.recDataList.totalCurrentValue += sideBarData.data.currentValue;
                this.recDataList.sumOfMonthlyContribution += sideBarData.data.monthlyContribution;
                this.recDataList.sumOfMaturityValue += sideBarData.data.maturityValue;
              }
              this.getRecurringDepositRes(this.recDataList);
            }
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
            if (data) {
              this.getBondsList();
            }
            else {
              if (!this.bondDataList) {
                this.bondDataList = { assetList: [sideBarData.data] };
                this.bondDataList['sumOfAmountInvested'] = sideBarData.data.amountInvested;
                this.bondDataList['sumOfCouponAmount'] = sideBarData.data.couponAmount;
                this.bondDataList['sumOfCurrentValue'] = sideBarData.data.currentValue;
                this.bondDataList['sumOfMaturityValue'] = sideBarData.data.maturityValue;
              }
              else {
                this.bondDataList.assetList.push(sideBarData.data);
                this.bondDataList.sumOfAmountInvested += sideBarData.data.amountInvested;
                this.bondDataList.sumOfCouponAmount += sideBarData.data.couponAmount;
                this.bondDataList.sumOfCurrentValue += sideBarData.data.currentValue;
                this.bondDataList.sumOfMaturityValue += sideBarData.data.maturityValue;
              }
              this.getBondsRes(this.bondDataList);
            }
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

        }
        rightSideDataSub.unsubscribe();
      }
    );
  }
  // ============== upload =======

  ngOnDestroy() {
    this.assetValidation.fixDataList = this.fixDataList ? this.fixDataList : null;
    this.assetValidation.recDataList = this.recDataList ? this.recDataList : null;
    this.assetValidation.bondDataList = this.bondDataList ? this.bondDataList : null;
  }

}





