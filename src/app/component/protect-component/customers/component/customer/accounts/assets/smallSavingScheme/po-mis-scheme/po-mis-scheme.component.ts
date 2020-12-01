import { AddPoMisComponent } from './../common-component/add-po-mis/add-po-mis.component';
import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatDialog, MatSort, MatTableDataSource, MatButtonToggle, MatBottomSheet } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { DetailedPoMisComponent } from './detailed-po-mis/detailed-po-mis.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { FileUploadServiceService } from '../../file-upload-service.service';
import { BottomSheetComponent } from '../../../../../common-component/bottom-sheet/bottom-sheet.component';
import { AssetValidationService } from '../../asset-validation.service';

@Component({
  selector: 'app-po-mis-scheme',
  templateUrl: './po-mis-scheme.component.html',
  styleUrls: ['./po-mis-scheme.component.scss']
})
export class PoMisSchemeComponent implements OnInit {
  @Output() changeCount = new EventEmitter();
  @Output() pomisDataList = new EventEmitter();
  @Input() dataList;
  advisorId: any;
  clientId: number;
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  datasource = new MatTableDataSource(this.data);
  noData: string;
  pomisData: any;
  sumOfCurrentValue: number;
  sumOfMonthlyPayout: number;
  sumOfAmountInvested: number;
  sumOfMaturityValue: number;
  sumOfPayoutTillToday: number;
  @ViewChild('tableEl', { static: false }) tableEl;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  @Output() loaded = new EventEmitter();//emit financial planning innerHtml reponse
  @Input() finPlanObj: any;//finacial plan pdf input
  @ViewChild('pomisTemp', { static: false }) pomisTemp: ElementRef;
  excelData: any[];
  footer = [];
  fileUploadData: any;
  file: any;
  isLoadingUpload: boolean = false;
  clientData: any;
  myFiles: any;
  pomisList: any[];
  hideFilter: boolean;
  isFixedIncomeFiltered: boolean;
  reportDate: Date;
  userInfo: any;
  getOrgData: any;

  constructor(private ref: ChangeDetectorRef, private excel: ExcelGenService,
    private fileUpload: FileUploadServiceService,
    private assetValidation: AssetValidationService,
    private pdfGen: PdfGenService, public dialog: MatDialog, private eventService: EventService,
    private cusService: CustomerService, private subInjectService: SubscriptionInject,
    public util: UtilService,
    private _bottomSheet: MatBottomSheet) {
    this.clientData = AuthService.getClientData()
  }

  displayedColumns = ['no', 'owner', 'cvalue', 'payoutTill', 'mpayout', 'rate', 'amt', 'mvalue', 'mdate', 'poMisNo', 'desc', 'status', 'icons'];


  ngOnInit() {
    this.reportDate = new Date();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getPoMisSchemedata();
    if (!this.dataList) {
      this.getPoMisSchemedata();
    } else {
      this.getPoMisSchemedataResponse(this.dataList);
    }
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
    this.fileUploadData = this.fileUpload.fetchFileUploadData(obj, this.myFiles);
    if (this.fileUploadData) {
      this.file = fileName
      this.fileUpload.uploadFile(fileName)
    }
    setTimeout(() => {
      this.isLoadingUpload = false
    }, 7000);
  }
  pdf(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.pdfGen.generatePdf(rows, tableTitle);
  }
  // async ExportTOExcel(value) {
  //   this.excelData = [];
  //   let data = [];
  //   const headerData = [{ width: 20, key: 'Owner' },
  //   { width: 20, key: 'Current Value' },
  //   { width: 10, key: 'Monthly Payout' },
  //   { width: 10, key: 'Rate' },
  //   { width: 20, key: 'Amount Invested' },
  //   { width: 20, key: 'Maturity Value' },
  //   { width: 20, key: 'Maturity Date' },
  //   { width: 15, key: 'Description' },
  //   { width: 15, key: 'Status' },];
  //   const header = ['Owner', 'Current Value', 'Monthly Payout', 'Rate',
  //     'Amount Invested', 'Maturity Value', 'Maturity Date', 'Description', 'Status'];
  //   this.datasource.filteredData.forEach(element => {
  //     data = [element.ownerName, (element.currentValue),
  //     this.formatNumber.first.formatAndRoundOffNumber(element.monthlyPayout),
  //     (element.rate), this.formatNumber.first.formatAndRoundOffNumber(element.maturityValue),
  //     this.formatNumber.first.formatAndRoundOffNumber(element.amountInvested),
  //     new Date(element.maturityDate), element.description, element.status];
  //     this.excelData.push(Object.assign(data));
  //   });
  //   const footerData = ['Total', this.formatNumber.first.formatAndRoundOffNumber(this.sumOfCurrentValue),
  //     this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMonthlyPayout),
  //     this.formatNumber.first.formatAndRoundOffNumber(this.sumOfAmountInvested), '',
  //     this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMaturityValue), '', '', '',];
  //   this.footer.push(Object.assign(footerData));
  //   ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  // }

  getPoMisSchemedata() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.datasource.data = [{}, {}, {}];
    this.cusService.getSmallSavingSchemePOMISData(obj).subscribe(
      data => this.getPoMisSchemedataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.datasource.data = [];
        this.isLoading = false;
      }
    );
  }

  getPoMisSchemedataResponse(data: any) {
    this.isLoading = false;
    if (data != undefined) {
      if (data.assetList) {
        this.assetValidation.getAssetCountGLobalData();
        console.log('getPoMisSchemedataResponse', data);
        if (!this.dataList) {
          this.pomisDataList.emit(data);
          this.dataList = data;
        }
        this.pomisList = data.assetList;
        this.datasource.data = data.assetList;
        this.datasource.sort = this.sort;
        UtilService.checkStatusId(this.datasource.filteredData);
        this.sumOfMaturityValue = data.sumOfMaturityValue;
        this.sumOfCurrentValue = data.sumOfCurrentValue;
        this.sumOfMonthlyPayout = data.sumOfMonthlyPayout;
        this.sumOfAmountInvested = data.sumOfAmountInvested;
        this.sumOfPayoutTillToday = data.sumOfPayoutTillToday;
        this.pomisData = data;
      }
    } else {

      this.noData = 'No scheme found';
      this.datasource.data = []
    }
    if (this.finPlanObj) {
      this.ref.detectChanges();//to refresh the dom when response come
      this.loaded.emit(this.pomisTemp.nativeElement);
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
        this.cusService.deletePOMIS(element.id).subscribe(
          data => {
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            dialogRef.close();
            this.dataList.sumOfCurrentValue -= element.currentValue;
            this.dataList.sumOfAmountInvested -= element.amountInvested;
            this.dataList.sumOfMaturityValue -= element.maturityValue;
            this.dataList.sumOfMonthlyPayout -= element.monthlyPayout;
            this.dataList.sumOfPayoutTillToday -= element.totalPayoutTillToday;
            this.getPoMisSchemedata();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
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

  openDetailPOMIS(data) {
    const fragmentData = {
      flag: 'detailedPOMIS',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedPoMisComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getPoMisSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  openAddPOMIS(data) {
    let popupHeaderText = data ? 'Edit Post office monthly income scheme (PO MIS)' : 'Add Post office monthly income scheme (PO MIS)';
    const fragmentData = {
      flag: 'addPOMIS',
      data,
      id: 1,
      state: 'open',
      componentName: AddPoMisComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            if (!this.dataList) {
              this.dataList = { assetList: [sideBarData.data] };
              this.dataList['sumOfCurrentValue'] = sideBarData.data.currentValue;
              this.dataList['sumOfAmountInvested'] = sideBarData.data.amountInvested;
              this.dataList['sumOfMaturityValue'] = sideBarData.data.maturityValue;
              this.dataList['sumOfMonthlyPayout'] = sideBarData.data.monthlyPayout;
              this.dataList['sumOfPayoutTillToday'] = sideBarData.data.totalPayoutTillToday;
            }
            else {
              this.dataList.assetList.push(sideBarData.data);
              this.dataList.sumOfCurrentValue += sideBarData.data.currentValue;
              this.dataList.sumOfAmountInvested += sideBarData.data.amountInvested;
              this.dataList.sumOfMaturityValue += sideBarData.data.maturityValue;
              this.dataList.sumOfMonthlyPayout += sideBarData.data.monthlyPayout;
              this.dataList.sumOfPayoutTillToday += sideBarData.data.totalPayoutTillToday;
            }
            this.getPoMisSchemedataResponse(this.dataList)
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  activeFilter: any = 'All';

  filterPomis(key: string, value: any) {

    let dataFiltered = [];
    this.activeFilter = value;
    if (value == "All") {
      dataFiltered = this.pomisList;
    }
    else {
      dataFiltered = this.pomisList.filter(function (item) {
        return item[key] === value;
      });
      if (dataFiltered.length <= 0) {
        this.hideFilter = false;
      }
    }
    this.sumOfCurrentValue = 0;
    this.sumOfMonthlyPayout = 0;
    this.sumOfPayoutTillToday = 0;
    this.sumOfMaturityValue = 0;
    this.sumOfAmountInvested = 0;
    if (dataFiltered.length > 0) {
      dataFiltered.forEach(element => {
        this.sumOfCurrentValue += element.currentValue;
        this.sumOfMaturityValue += element.maturityValue;
        this.sumOfMonthlyPayout += element.monthlyPayout;
        this.sumOfPayoutTillToday += element.totalPayoutTillToday;
        this.sumOfAmountInvested += element.amountInvested;
      })
    }
    this.isFixedIncomeFiltered = true;
    this.datasource.data = dataFiltered;
    // this.dataSource = new MatTableDataSource(data);
  }
}
