import { AddKvpComponent } from './../common-component/add-kvp/add-kvp.component';
import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog, MatSort, MatTableDataSource, MatBottomSheet } from '@angular/material';
import { DetailedKvpComponent } from './detailed-kvp/detailed-kvp.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { FileUploadServiceService } from '../../file-upload-service.service';
import { BottomSheetComponent } from '../../../../../common-component/bottom-sheet/bottom-sheet.component';
import { AssetValidationService } from '../../asset-validation.service';

@Component({
  selector: 'app-kvp-scheme',
  templateUrl: './kvp-scheme.component.html',
  styleUrls: ['./kvp-scheme.component.scss']
})
export class KvpSchemeComponent implements OnInit {
  @Output() changeCount = new EventEmitter();
  @Output() kvpDataList = new EventEmitter();
  @Input() dataList;
  clientId: number;
  advisorId: any;
  noData: string;
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  datasource = new MatTableDataSource(this.data);
  kvpData: any;
  sumOfCurrentValue: number;
  sumOfAmountInvested: number;
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  @Output() loaded = new EventEmitter();//emit financial planning innerHtml reponse
  @Input() finPlanObj: any;//finacial plan pdf input
  @ViewChild('kvpTemp', { static: false }) kvpTemp: ElementRef;
  excelData: any[];
  footer = [];
  fileUploadData: any;
  file: any;
  isLoadingUpload: boolean;
  clientData: any;
  myFiles;
  hideFilter: boolean;
  isFixedIncomeFiltered: boolean;
  kvpList: any[];
  getOrgData: any;
  reportDate: Date;
  userInfo: any;

  constructor(private ref: ChangeDetectorRef, private excel: ExcelGenService,
    private fileUpload: FileUploadServiceService,
    private assetValidation: AssetValidationService,
    private pdfGen: PdfGenService, public dialog: MatDialog, private eventService: EventService,
    private cusService: CustomerService, private subInjectService: SubscriptionInject,
    private _bottomSheet: MatBottomSheet) {
    this.clientData = AuthService.getClientData()
  }

  displayedColumns18 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'mvalue', 'mdate', 'certificateNo', 'desc', 'status', 'icons'];

  ngOnInit() {
    this.reportDate = new Date();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    if (!this.dataList) {
      this.getKvpSchemedata();
    } else {
      this.getKvpSchemedataResponse(this.dataList);
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
  //   let headerData = [{ width: 20, key: 'Owner' },
  //   { width: 20, key: 'Current Value' },
  //   { width: 10, key: 'Rate' },
  //   { width: 25, key: 'Amount Invested' },
  //   { width: 20, key: 'Maturity Value' },
  //   { width: 15, key: 'Maturity Date' },
  //   { width: 15, key: 'Description' },
  //   { width: 10, key: 'Status' },];
  //   let header = ['Owner', 'Current Value', 'Rate', 'Amount Invested',
  //     'Maturity Value', 'Maturity Date', 'Description', 'Status'];
  //   this.datasource.filteredData.forEach(element => {
  //     data = [element.ownerName, this.formatNumber.first.formatAndRoundOffNumber(element.currentValue), (element.rate),
  //     this.formatNumber.first.formatAndRoundOffNumber(element.amountInvested), (element.maturityValue), new Date(element.maturityDate), element.description, element.status];
  //     this.excelData.push(Object.assign(data));
  //   });
  //   let footerData = ['Total',
  //     this.formatNumber.first.formatAndRoundOffNumber(this.sumOfCurrentValue), '',
  //     this.formatNumber.first.formatAndRoundOffNumber(this.sumOfAmountInvested), '', '', '', ''];
  //   this.footer.push(Object.assign(footerData));
  //   ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  // }

  getKvpSchemedata() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.datasource.data = [{}, {}, {}];
    this.cusService.getSmallSavingSchemeKVPData(obj).subscribe(
      data => this.getKvpSchemedataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.datasource.data = [];
        this.isLoading = false;
      }
    );
  }
  sumOfmaturityValue: any;
  getKvpSchemedataResponse(data) {
    this.isLoading = false;
    if (data != undefined) {
      if (data.assetList) {
        this.assetValidation.getAssetCountGLobalData();
        console.log('getKvpSchemedataResponse', data);
        if (!this.dataList) {
          this.kvpDataList.emit(data);
          this.dataList = data;
        }
        this.kvpList = data.assetList;
        this.datasource.data = data.assetList;
        this.datasource.sort = this.sort;
        UtilService.checkStatusId(this.datasource.filteredData);
        this.sumOfCurrentValue = data.sumOfCurrentValue;
        this.sumOfAmountInvested = data.sumOfAmountInvested;
        this.sumOfmaturityValue = data.sumOfMaturityValue;
        this.kvpData = data;
      }
    } else {
      this.noData = 'No scheme found';
      this.datasource.data = []
    }
    if (this.finPlanObj) {
      this.ref.detectChanges();//to refresh the dom when response come
      this.loaded.emit(this.kvpTemp.nativeElement);
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
        this.cusService.deleteKVP(element.id).subscribe(
          data => {
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            dialogRef.close();
            this.dataList.assetList = this.dataList.assetList.filter(x => x.id != element.id);
            this.dataList.sumOfCurrentValue -= element.currentValue;
            this.dataList.sumOfAmountInvested -= element.accountBalance;
            this.dataList.sumOfMaturityValue -= element.maturityValue;

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

  openAddKVP(data, flag) {
    let popupHeaderText = !!data ? 'Edit Kisan vikas patra (KVP)' : 'Add Kisan vikas patra (KVP)';
    const fragmentData = {
      flag: 'addKVP',
      data,
      id: 1,
      state: (flag == 'detailedKvp') ? 'open35' : 'open',
      componentName: (flag == 'detailedKvp') ? DetailedKvpComponent : AddKvpComponent
    };
    if (flag != 'detailedKvp') {
      fragmentData['popupHeaderText'] = popupHeaderText;
    }
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

            if (!this.dataList) {
              this.dataList = { assetList: [sideBarData.data] };
              this.dataList['sumOfCurrentValue'] = sideBarData.data.currentValue;
              this.dataList['sumOfAmountInvested'] = sideBarData.data.accountBalance;
              this.dataList['sumOfMaturityValue'] = sideBarData.data.maturityValue;
            }
            else {
              this.dataList.assetList.push(sideBarData.data);
              this.dataList.sumOfCurrentValue += sideBarData.data.currentValue;
              this.dataList.sumOfAmountInvested += sideBarData.data.accountBalance;
              this.dataList.sumOfMaturityValue += sideBarData.data.maturityValue;
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

  filterKvp(key: string, value: any) {

    let dataFiltered = [];
    this.activeFilter = value;
    if (value == "All") {
      dataFiltered = this.kvpList;
    }
    else {
      dataFiltered = this.kvpList.filter(function (item) {
        return item[key] === value;
      });
      if (dataFiltered.length <= 0) {
        this.hideFilter = false;
      }
    }
    this.sumOfCurrentValue = 0;
    this.sumOfAmountInvested = 0;
    this.sumOfmaturityValue = 0;
    if (dataFiltered.length > 0) {
      dataFiltered.forEach(element => {
        this.sumOfCurrentValue += element.currentValue;
        this.sumOfAmountInvested += element.amountInvested;
        this.sumOfmaturityValue += element.maturityValue;
      })
    }
    this.isFixedIncomeFiltered = true;
    this.datasource.data = dataFiltered;
    // this.dataSource = new MatTableDataSource(data);
    // this.datasource.sort = this.tableEl;
  }
}
