import { AddPoTdComponent } from './../common-component/add-po-td/add-po-td.component';
import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatDialog, MatSort, MatTableDataSource, MatBottomSheet } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { DetailedPoTdComponent } from './detailed-po-td/detailed-po-td.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { FileUploadServiceService } from '../../file-upload-service.service';
import { BottomSheetComponent } from '../../../../../common-component/bottom-sheet/bottom-sheet.component';
import { AssetValidationService } from '../../asset-validation.service';
import { RoleService } from 'src/app/auth-service/role.service';
import { CustomerOverviewService } from '../../../../customer-overview/customer-overview.service';

@Component({
  selector: 'app-po-td-scheme',
  templateUrl: './po-td-scheme.component.html',
  styleUrls: ['./po-td-scheme.component.scss'],

})
export class PoTdSchemeComponent implements OnInit {
  @Output() changeCount = new EventEmitter();
  @Output() potdDataList = new EventEmitter();
  @Input() dataList;
  advisorId: any;
  clientId: number;
  noData: string;
  footer = [];
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  @Output() loaded = new EventEmitter();//emit financial planning innerHtml reponse
  @Input() finPlanObj: any;//finacial plan pdf input
  @ViewChild('potdTemp', { static: false }) potdTemp: ElementRef;
  excelData: any[];
  sumOfCurrentValue: any;
  sumOfAmountInvested: any;
  sumOfMaturityValue: any;
  fileUploadData: any;
  file: any;
  clientData: any;
  isLoadingUpload: any;
  myFiles: any;
  potdList: any;
  hideFilter: boolean;
  isFixedIncomeFiltered: boolean;
  reportDate: Date;
  userInfo: any;
  getOrgData: any;
  returnValue: any;
  fragmentData = { isSpinner: false };
  smallSavingCapability: any = {};

  constructor(private ref: ChangeDetectorRef, private excel: ExcelGenService,
    private pdfGen: PdfGenService, public dialog: MatDialog,
    private fileUpload: FileUploadServiceService,
    private eventService: EventService,
    private utils: UtilService,
    private cusService: CustomerService,
    private assetValidation: AssetValidationService,
    private _bottomSheet: MatBottomSheet,
    private subInjectService: SubscriptionInject,
    public roleService: RoleService,
    private customerOverview: CustomerOverviewService) {
    this.clientData = AuthService.getClientData()
  }

  displayedColumns22 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'tenure', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];


  ngOnInit() {
    this.reportDate = new Date();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    this.smallSavingCapability = this.roleService.portfolioPermission.subModule.assets.subModule.smallSavingSchemes.capabilityList;

    if (!this.dataList && !this.assetValidation.potdlist) {
      this.getPoTdSchemedata();
    } else {
      this.getPoTdSchemedataResponse(this.dataList ? this.dataList : this.assetValidation.potdlist);
    }
  }

  ngOnDestroy() {
    this.assetValidation.potdlist = this.dataList ? this.dataList : null;
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

  async ExportTOExcel(value) {
    this.excelData = [];
    let data = [];
    const headerData = [{ width: 20, key: 'Owner' },
    { width: 20, key: 'Current Value' },
    { width: 10, key: 'Rate' },
    { width: 20, key: 'Amount Invested' },
    { width: 20, key: 'Tenure' },
    { width: 20, key: 'Maturity Value' },
    { width: 20, key: 'Maturity Date' },
    { width: 25, key: 'TD Number' },
    { width: 15, key: 'Description' },
    { width: 15, key: 'Status' },];
    const header = ['Owner', 'Current Value', 'Rate', 'Amount Invested',
      'Tenure', 'Maturity Value', 'Maturity Date', 'TD Number', 'Description', 'Status'];
    this.dataSource.filteredData.forEach(element => {
      data = [element.ownerName, (element.currentValue), (element.rate), (element.balance),
      new Date(element.balanceAsOn), element.description, element.status];
      this.excelData.push(Object.assign(data));
    });
    const footerData = ['Total', this.formatNumber.first.formatAndRoundOffNumber(), '',
      this.formatNumber.first.formatAndRoundOffNumber(), '', '', '',];
    this.footer.push(Object.assign(footerData));
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  }

  getPoTdSchemedata() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.dataSource.data = [{}, {}, {}];
    this.cusService.getSmallSavingSchemePOTDData(obj).subscribe(
      data => this.getPoTdSchemedataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  getPoTdSchemedataResponse(data) {
    this.isLoading = false;
    if (data != undefined) {
      if (data.assetList) {
        // this.assetValidation.getAssetCountGLobalData();
        console.log('getPoTdSchemedataResponse', data);
        if (!this.dataList) {
          this.potdDataList.emit(data);
          this.dataList = data;
        }
        this.potdList = data.assetList;
        this.dataSource.data = data.assetList;
        this.dataSource.sort = this.sort;
        this.sumOfCurrentValue = data.sumOfCurrentValue;
        this.sumOfAmountInvested = data.sumOfAmountInvested;
        this.sumOfMaturityValue = data.sumOfMaturityValue;
        UtilService.checkStatusId(this.dataSource.filteredData);
      }
    } else {
      this.noData = 'No scheme found';
      this.dataSource.data = [];


    }
    if (this.finPlanObj) {
      this.ref.detectChanges();//to refresh the dom when response come
      this.loaded.emit(this.potdTemp.nativeElement);
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
        this.cusService.deletePOTD(element.id).subscribe(
          data => {
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            dialogRef.close();
            this.assetValidation.addAssetCount({ type: 'Delete', value: 'smallSavingSchemes' })
            this.dataList.assetList = this.dataList.assetList.filter(x => x.id != element.id);
            this.dataList.sumOfCurrentValue += element.currentValue;
            this.dataList.sumOfAmountInvested += element.amountInvested;
            this.dataList.sumOfMaturityValue += element.maturityValue;
            this.customerOverview.portFolioData = null;
            this.customerOverview.summaryLeftsidebarData=null;
            this.customerOverview.aumGraphdata=null;
            this.customerOverview.assetAllocationChart=null;
            this.customerOverview.summaryCashFlowData=null;
            this.customerOverview.assetAllocationChart = null;
            this.getPoTdSchemedataResponse(this.dataList);
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

  openDetailPOTD(data) {

    console.log('this is detailed potd data', data);
    const fragmentData = {
      flag: 'detailPoTd',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedPoTdComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getPoTdSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  openAddPOTD(data) {
    let popupHeaderText = !!data ? 'Edit Post office time deposit (PO TD)' : 'Add Post office time deposit (PO TD)';
    const fragmentData = {
      flag: 'addPoTd',
      data,
      id: 1,
      state: 'open',
      componentName: AddPoTdComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

            if (!this.dataList) {
              if (sideBarData.data) {
                this.dataList = { assetList: [sideBarData.data] };
                this.dataList['sumOfCurrentValue'] = sideBarData.data.currentValue;
                this.dataList['sumOfAmountInvested'] = sideBarData.data.amountInvested;
                this.dataList['sumOfMaturityValue'] = sideBarData.data.maturityValue;
              }
            }
            else {

              this.dataList.assetList.push(sideBarData.data);
              this.dataList.sumOfCurrentValue += sideBarData.data.currentValue;
              this.dataList.sumOfAmountInvested += sideBarData.data.amountInvested;
              this.dataList.sumOfMaturityValue += sideBarData.data.maturityValue;

            }
            this.getPoTdSchemedataResponse(this.dataList);
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  activeFilter: any = 'All';

  filterPotd(key: string, value: any) {

    let dataFiltered = [];
    this.activeFilter = value;
    if (value == "All") {
      dataFiltered = this.potdList;
    }
    else {
      dataFiltered = this.potdList.filter(function (item) {
        return item[key] === value;
      });
      if (dataFiltered.length <= 0) {
        this.hideFilter = false;
      }
    }
    this.sumOfCurrentValue = 0;
    this.sumOfMaturityValue = 0;
    this.sumOfAmountInvested = 0;
    if (dataFiltered.length > 0) {
      dataFiltered.forEach(element => {
        this.sumOfCurrentValue += element.currentValue;
        this.sumOfMaturityValue += element.maturityValue;
        this.sumOfAmountInvested += element.amountInvested;
      })
    }
    this.isFixedIncomeFiltered = true;
    this.dataSource.data = dataFiltered;
    // this.dataSource = new MatTableDataSource(data);
  }
}
