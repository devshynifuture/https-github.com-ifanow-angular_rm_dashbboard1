import { AddScssComponent } from './../common-component/add-scss/add-scss.component';
import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MAT_DATE_FORMATS, MatDialog, MatSort, MatTableDataSource, MatBottomSheet } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { EventService } from 'src/app/Data-service/event.service';
import { DetailedScssComponent } from './detailed-scss/detailed-scss.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { FileUploadServiceService } from '../../file-upload-service.service';
import { BottomSheetComponent } from '../../../../../common-component/bottom-sheet/bottom-sheet.component';
import { AssetValidationService } from '../../asset-validation.service';

@Component({
  selector: 'app-scss-scheme',
  templateUrl: './scss-scheme.component.html',
  styleUrls: ['./scss-scheme.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class ScssSchemeComponent implements OnInit {
  @Output() changeCount = new EventEmitter();
  @Output() scssDataList = new EventEmitter();
  @Input() dataList;
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  datasource = new MatTableDataSource(this.data);
  scssData: any;
  sumOfQuarterlyPayout: number;
  sumOfTotalAmountReceived: number;
  sumOfAmountInvested: number;
  @ViewChild('tableEl', { static: false }) tableEl;
  footer = [];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  @Output() loaded = new EventEmitter();//emit financial planning innerHtml reponse
  @Input() finPlanObj: any;//finacial plan pdf input
  @ViewChild('scssTemp', { static: false }) scssTemp: ElementRef;
  excelData: any[];
  fileUploadData: any;
  file: any;
  isLoadingUpload: boolean = false;
  clientData: any;
  myFiles: any;
  scssList: any[];
  isFixedIncomeFiltered: boolean;
  hideFilter: boolean;
  reportDate: Date;
  userInfo: any;
  getOrgData: any;
  fragmentData = { isSpinner: false };
  returnValue: any;


  constructor(private ref: ChangeDetectorRef, private excel: ExcelGenService,
    private fileUpload: FileUploadServiceService,
    private _bottomSheet: MatBottomSheet,
    private utils: UtilService,
    private pdfGen: PdfGenService, public dialog: MatDialog,
    private assetValidation: AssetValidationService,
    private eventService: EventService, private cusService: CustomerService,
    private subInjectService: SubscriptionInject) {
    this.clientData = AuthService.getClientData()
  }

  displayedColumns19 = ['no', 'owner', 'cValue', 'payout', 'rate', 'tamt', 'amt', 'mdate', 'mValue', 'desc', 'status', 'icons'];


  ngOnInit() {
    this.reportDate = new Date();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    if (!this.dataList) {
      this.getScssSchemedata();
    } else {
      this.getKvpSchemedataResponse(this.dataList);
    }
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
    this.returnValue = this.utils.htmlToPdf(header, para.innerHTML, tableTitle, false, this.fragmentData, '', '', true);
    console.log('return value ====', this.returnValue);
    return obj;
    //this.pdfGen.generatePdf(rows, tableTitle);
  }

  // async ExportTOExcel(value) {
  //   this.excelData = [];
  //   let data = [];
  //   const headerData = [{ width: 20, key: 'Owner' },
  //   { width: 20, key: 'Quarterly Payout' },
  //   { width: 10, key: 'Rate' },
  //   { width: 20, key: 'Total Amount Recieved' },
  //   { width: 25, key: 'Amount Invested' },
  //   { width: 15, key: 'Maturity Date' },
  //   { width: 15, key: 'Description' },
  //   { width: 10, key: 'Status' },];
  //   const header = ['Owner', 'Quarterly Payout', 'Rate', 'Total Amount Recieved', 'Amount Invested',
  //     'Maturity Date', 'Description', 'Status'];
  //   this.datasource.filteredData.forEach(element => {
  //     data = [element.ownerName, (element.quarterlyPayout), (element.rate),
  //     this.formatNumber.first.formatAndRoundOffNumber(element.totalAmountReceived),
  //     this.formatNumber.first.formatAndRoundOffNumber(element.amountInvested),
  //     (element.maturityValue), new Date(element.maturityDate), element.description, element.status];
  //     this.excelData.push(Object.assign(data));
  //   });
  //   const footerData = ['Total', '', this.formatNumber.first.formatAndRoundOffNumber(this.sumOfQuarterlyPayout),
  //     this.formatNumber.first.formatAndRoundOffNumber(this.sumOfTotalAmountReceived),
  //     this.formatNumber.first.formatAndRoundOffNumber(this.sumOfAmountInvested), '', '', ''];
  //   this.footer.push(Object.assign(footerData));
  //   ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  // }

  getScssSchemedata() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      requiredDate: ''
    };
    this.datasource.data = [{}, {}, {}];
    this.cusService.getSmallSavingSchemeSCSSData(obj).subscribe(
      data => this.getKvpSchemedataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.datasource.data = [];
        this.isLoading = false;
      }
    );
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
        this.cusService.deleteSCSS(element.id).subscribe(
          data => {
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            dialogRef.close();
            this.assetValidation.addAssetCount({ type: 'Delete', value: 'smallSavingSchemes' })
            this.dataList.assetList = this.dataList.assetList.filter(x => x.id != element.id);
            this.dataList.sumOfAmountReceived -= element.totalAmountReceived;
            this.dataList.sumOfAmountInvested -= element.amountInvested;
            this.dataList.sumOfMaturityValue -= element.maturityValue;
            this.dataList.sumOfQuarterlyPayout -= element.quarterlyPayout;

            this.getKvpSchemedataResponse(this.dataList);
          },
          error => this.eventService.showErrorMessage(error)
        );
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
  sumOfMaturityValue: any;
  getKvpSchemedataResponse(data: any) {
    this.isLoading = false;
    if (data != undefined) {
      if (data.assetList) {
        // this.assetValidation.getAssetCountGLobalData();
        console.log('getKvpSchemedataResponse', data);
        if (!this.dataList) {
          this.scssDataList.emit(data);
          this.dataList = data;
        }
        this.scssList = data.assetList;
        this.datasource.data = data.assetList;
        this.datasource.sort = this.sort;
        UtilService.checkStatusId(this.datasource.filteredData);
        this.sumOfAmountInvested = data.sumOfAmountInvested;
        this.sumOfTotalAmountReceived = data.sumOfAmountReceived;
        this.sumOfQuarterlyPayout = data.sumOfQuarterlyPayout;
        this.sumOfMaturityValue = data.sumOfMaturityValue;
        this.scssData = data;
      }
    } else {
      this.noData = 'No scheme found';
      this.datasource.data = []
    }
    if (this.finPlanObj) {
      this.ref.detectChanges();//to refresh the dom when response come
      this.loaded.emit(this.scssTemp.nativeElement);
    }
    console.log('datasource', this.datasource)
  }

  openAddSCSS(data, flag) {
    let popupHeaderText = !!data ? 'Edit Senior citizen savings scheme (SCSS)' : 'Add Senior citizen savings scheme (SCSS)';
    const fragmentData = {
      flag: 'addSCSS',
      data,
      id: 1,
      state: (flag == 'detailedScss') ? 'open35' : 'open',
      componentName: (flag == 'detailedScss') ? DetailedScssComponent : AddScssComponent
    };
    if (flag != 'detailedScss') {
      fragmentData['popupHeaderText'] = popupHeaderText;
    }
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

            if (!this.dataList) {
              this.dataList = { assetList: [sideBarData.data] };
              this.dataList['sumOfAmountReceived'] = sideBarData.data.totalAmountReceived;
              this.dataList['sumOfAmountInvested'] = sideBarData.data.amountInvested;
              this.dataList['sumOfMaturityValue'] = sideBarData.data.maturityValue;
              this.dataList['sumOfQuarterlyPayout'] = sideBarData.data.quarterlyPayout;
            }
            else {
              this.dataList.assetList.push(sideBarData.data);
              this.dataList.sumOfAmountReceived += sideBarData.data.totalAmountReceived;
              this.dataList.sumOfAmountInvested += sideBarData.data.amountInvested;
              this.dataList.sumOfMaturityValue += sideBarData.data.maturityValue;
              this.dataList.sumOfQuarterlyPayout += sideBarData.data.quarterlyPayout;
            }
            this.getKvpSchemedataResponse(this.dataList);
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  activeFilter: any = 'All';


  filterScss(key: string, value: any) {

    let dataFiltered = [];
    this.activeFilter = value;
    if (value == "All") {
      dataFiltered = this.scssList;
    }
    else {
      dataFiltered = this.scssList.filter(function (item) {
        return item[key] === value;
      });
      if (dataFiltered.length <= 0) {
        this.hideFilter = false;
      }
    }
    this.sumOfAmountInvested = 0;
    this.sumOfQuarterlyPayout = 0;
    this.sumOfTotalAmountReceived = 0;
    this.sumOfMaturityValue = 0
    if (dataFiltered.length > 0) {
      dataFiltered.forEach(element => {
        this.sumOfAmountInvested += element.amountInvested;
        this.sumOfQuarterlyPayout += element.quarterlyPayout;
        this.sumOfTotalAmountReceived += element.totalAmountReceived;
        this.sumOfMaturityValue += element.maturityValue;
      })
    }
    this.isFixedIncomeFiltered = true;
    this.datasource.data = dataFiltered;
    // this.dataSource = new MatTableDataSource(data);
    // this.datasource.sort = this.tableEl;
  }
}
