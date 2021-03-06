import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, Input, ChangeDetectorRef, ElementRef } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource, MatBottomSheet } from '@angular/material';
import { AddRealEstateComponent } from '../add-real-estate/add-real-estate.component';
import { DetailedViewRealEstateComponent } from '../detailed-view-real-estate/detailed-view-real-estate.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { FileUploadServiceService } from '../../file-upload-service.service';
import { EnumServiceService } from '../../../../../../../../../services/enum-service.service';
import { AssetValidationService } from '../../asset-validation.service';
import { BottomSheetComponent } from '../../../../../common-component/bottom-sheet/bottom-sheet.component';
import { RoleService } from 'src/app/auth-service/role.service';
import { CustomerOverviewService } from '../../../../customer-overview/customer-overview.service';

@Component({
  selector: 'app-real-estate',
  templateUrl: './real-estate.component.html',
  styleUrls: ['./real-estate.component.scss']
})
export class RealEstateComponent implements OnInit {

  isLoading = false;
  advisorId: any;
  data: Array<any> = [{}, {}, {}];
  datasource3 = new MatTableDataSource(this.data);
  clientId: any;
  ownerName: any;
  sumOfMarketValue: any;
  sumOfpurchasedValue: any;
  footer = [];
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  @Output() loaded = new EventEmitter();//emit financial planning innerHtml reponse
  @Input() finPlanObj: any;//finacial plan pdf input
  @ViewChild('realEstateTemp', { static: false }) realEstateTemp: ElementRef;
  displayedColumns3 = ['no', 'owner', 'type', 'value', 'pvalue', 'desc', 'status', 'icons'];
  excelData: any[];
  noData: string;
  fileUploadData: any;
  file: any;
  isLoadingUpload: boolean = false;
  clientData: any;
  myFiles: any;
  userInfo: any;
  getOrgData: any;
  reportDate: Date;
  fragmentData = { isSpinner: false };
  returnValue: any;
  realEstateCapability: any;

  constructor(public subInjectService: SubscriptionInject,
    public custmService: CustomerService, public cusService: CustomerService,
    private excel: ExcelGenService, private pdfGen: PdfGenService,
    private utilService: UtilService,
    private fileUpload: FileUploadServiceService,
    public enumService: EnumServiceService, private assetValidation: AssetValidationService,
    public eventService: EventService, public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet, private ref: ChangeDetectorRef,
    public roleService: RoleService,
    private customerOverview: CustomerOverviewService) {
  }

  ngOnInit() {
    this.realEstateCapability = this.roleService.portfolioPermission.subModule.assets.subModule.realEstate.capabilityList
    this.reportDate = new Date();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.clientData = AuthService.getClientData();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    if (this.assetValidation.realEstateList) {
      this.getRealEstateRes(this.assetValidation.realEstateList)
    }
    else {
      this.getRealEstate();
    }

  }

  Excel(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows, tableTitle);
  }

  fetchData(value, fileName, element, type) {
    element['subCatTypeId'] = type;
    this.isLoadingUpload = true;
    let obj = {
      advisorId: this.advisorId,
      clientId: element.clientId,
      familyMemberId: (element.ownerList[0].isClient == 1) ? 0 : element.ownerList[0].familyMemberId,
      asset: value,
      element: element
    };
    this.myFiles = [];
    for (let i = 0; i < fileName.target.files.length; i++) {
      this.myFiles.push(fileName.target.files[i]);
    }
    const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent, {
      data: this.myFiles,
    });
    this.fileUploadData = this.fileUpload.fetchFileUploadData(obj, this.myFiles);
    if (this.fileUploadData) {
      this.file = fileName;
      this.fileUpload.uploadFile(fileName);
    }
    setTimeout(() => {
      this.isLoadingUpload = false;
    }, 7000);
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
  // async ExportTOExcel(value) {

  //   this.excelData = [];
  //   let data = [];
  //   let headerData = [{ width: 20, key: 'Owner' },
  //   { width: 20, key: 'Type' },
  //   { width: 10, key: 'Rate' },
  //   { width: 20, key: 'Market Value' },
  //   { width: 15, key: 'Purchase Value' },
  //   { width: 15, key: 'Description' },
  //   { width: 10, key: 'Status' },];
  //   let header = ['Owner', 'Type', 'Rate', 'Market Value',
  //     'Purchase Value', 'Description', 'Status'];
  //   this.datasource3.filteredData.forEach(element => {
  //     data = [element.ownerName, ((element.typeId == 1) ? 'Residential' : (element.typeId == 2) ? 'Secondary' : (element.typeId == 3) ? 'Commercial' : 'Land'), (element.rate),
  //     this.formatNumber.first.formatAndRoundOffNumber(element.marketValue), (element.purchaseValue), element.description, element.status];
  //     this.excelData.push(Object.assign(data));
  //   });
  //   let footerData = ['Total', '',
  //     this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMarketValue), '',
  //     this.formatNumber.first.formatAndRoundOffNumber(this.sumOfpurchasedValue), '', ''];
  //   this.footer.push(Object.assign(footerData));
  //   ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  // }
  // // datasource3 = ELEMENT_DATA3;

  getRealEstate() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.datasource3.data = [{}, {}, {}];
    this.custmService.getRealEstate(obj).subscribe(
      data => this.getRealEstateRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.datasource3.data = [];
        this.isLoading = false;
      });
  }

  @Output() changeCount = new EventEmitter();

  getRealEstateRes(data) {
    this.isLoading = false;
    if (data == undefined || data.assetList.length <= 0) {
      this.noData = 'No Real estate found';
      this.datasource3.data = [];
      this.hideFilter = true;
      this.sumOfMarketValue = 0;
      this.sumOfpurchasedValue = 0;
    } else if (data.assetList.length > 0) {

      console.log('getRealEstateRes', data);
      this.dataList = data;
      this.datasource3.data = this.dataList.assetList;
      data.assetList.forEach(singleAsset => {
        singleAsset.typeString = this.enumService.getRealEstateTypeStringFromValue(singleAsset.typeId);
      });
      this.datasource3.sort = this.sort;
      this.sumOfMarketValue = this.dataList.sumOfMarketValue;
      this.sumOfpurchasedValue = this.dataList.sumOfPurchaseValue;
    } else {
      this.noData = 'No schemes found';
      this.datasource3.data = [];
    }
    // this.assetValidation.getAssetCountGLobalData()
    this.ref.detectChanges();//to refresh the dom when response come
    this.loaded.emit(this.realEstateTemp.nativeElement);
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
        this.cusService.deleteRealEstate(element.id).subscribe(
          data => {
            this.eventService.openSnackBar('Deleted successfully!', 'Dismiss');
            dialogRef.close();
            this.assetValidation.addAssetCount({ type: 'Delete', value: 'real_estate' })
            this.customerOverview.portFolioData = null;
            this.customerOverview.assetAllocationChart = null;
            this.customerOverview.summaryLeftsidebarData = null;
            this.customerOverview.aumGraphdata = null;
            this.customerOverview.assetAllocationChart = null;
            this.customerOverview.summaryCashFlowData = null;
            this.dataList.assetList = this.dataList.assetList.filter(x => x.id != element.id);
            this.dataList.sumOfMarketValue -= element.marketValue;
            // this.dataList.sumOfPurchaseValue += element.amountInvested;
            this.getRealEstateRes(this.dataList);
            // this.datasource3.data = this.dataList;
            // this.getRealEstate();
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

  open(value, data) {
    let popupHeaderText = !!data ? 'Edit Real estate' : 'Add Real estate';
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddRealEstateComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            if (data) {
              this.getRealEstate();
            }
            else {
              if (!this.dataList) {
                this.dataList = { assetList: [sideBarData.data] };
                this.dataList['sumOfMarketValue'] = sideBarData.data.marketValue;
                this.dataList['sumOfPurchaseValue'] = sideBarData.data.purchaseValue;
              }
              else {
                this.dataList.assetList.push(sideBarData.data)
                this.dataList.sumOfMarketValue += sideBarData.data.marketValue;
                this.dataList.sumOfPurchaseValue += sideBarData.data.purchaseValue;
              }
              this.getRealEstateRes(this.dataList);
            }
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  activeFilter: any = 'All';
  dataList: any;
  hideFilter: boolean = false;

  filterData(key: string, value: any) {

    let dataFiltered = [];
    this.activeFilter = value;
    if (value == 'All' || value == 'LIVE') { //status is hardcoded not coming from backend
      dataFiltered = this.dataList;
    } else {
      dataFiltered = this.dataList.filter(function (item) {
        return item[key] === value;
      });
      if (dataFiltered.length <= 0) {
        this.hideFilter = false;
      }
    }

    this.datasource3.data = dataFiltered;
    // this.dataSource = new MatTableDataSource(data);
    this.datasource3.sort = this.sort;
  }

  detailedViewRealEstate(data) {
    const fragmentData = {
      flag: 'DetailedViewRealEstateComponent',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedViewRealEstateComponent
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
  ngOnDestroy() {
    this.assetValidation.realEstateList = this.dataList ? this.dataList : null;
  }
}

export interface PeriodicElement3 {
  no: string;
  owner: string;
  type: string;
  value: string;
  pvalue: string;
  desc: string;
  status: string;
}

const ELEMENT_DATA3: PeriodicElement3[] = [
  {
    no: '1.',
    owner: 'Rahul Jain',
    type: 'Type',
    value: '60,000',
    pvalue: '60,000',
    desc: 'ICICI FD',
    status: ''
  },
  {
    no: '1.',
    owner: 'Rahul Jain',
    type: 'Type',
    value: '60,000',
    pvalue: '60,000',
    desc: 'ICICI FD',
    status: ''
  },
  { no: ' ', owner: 'Total', type: '', value: '1,28,925', pvalue: '1,28,925', desc: '', status: '' },
];
