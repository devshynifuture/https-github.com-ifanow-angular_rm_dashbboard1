import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource, MatBottomSheet } from '@angular/material';
import { GoldComponent } from '../gold/gold.component';
import { OthersComponent } from '../others/others.component';
import { DetailedViewGoldComponent } from '../gold/detailed-view-gold/detailed-view-gold.component';
import { DetailedViewOthersComponent } from '../others/detailed-view-others/detailed-view-others.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { FileUploadServiceService } from '../../file-upload-service.service';
import { AssetValidationService } from '../../asset-validation.service';
import { BottomSheetComponent } from '../../../../../common-component/bottom-sheet/bottom-sheet.component';
import { RoleService } from 'src/app/auth-service/role.service';
import { CustomerOverviewService } from '../../../../customer-overview/customer-overview.service';
import { EnumDataService } from 'src/app/services/enum-data.service';

@Component({
  selector: 'app-commodities',
  templateUrl: './commodities.component.html',
  styleUrls: ['./commodities.component.scss']
})
export class CommoditiesComponent implements OnInit {
  showRequring: string;
  @ViewChild('tableEl', { static: false }) tableEl;
  dummyOtherDataList = [];
  displayedColumns9 = ['no', 'owner', 'grams', 'car', 'price', 'mvalue', 'pvalue', 'desc', 'status', 'icons'];
  datasource9 = ELEMENT_DATA9;

  displayedColumns10 = ['no', 'owner', 'type', 'mvalue', 'mvalueDate', 'pvalue', 'pur', 'rate', 'desc', 'status', 'icons'];
  datasource10 = ELEMENT_DATA10;
  advisorId: any;
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  goldList = new MatTableDataSource(this.data);

  otherCommodityList = new MatTableDataSource(this.data);
  clientId: any;
  sumOfMarketValue: any;
  sumOfPurchaseValue: any;
  sumOfMarketValueOther: any;
  sumOfPurchaseValueOther: any;
  currentDate = new Date();
  footer = [];
  show = false;
  @ViewChild('goldListTable', { static: false }) goldListTableSort: MatSort;
  @ViewChild('otherListTable', { static: false }) otherListTableSort: MatSort;
  @ViewChild('goldTemp', { static: false }) goldTemp: ElementRef;
  @ViewChild('othersTemp', { static: false }) othersTemp: ElementRef;
  @ViewChildren(FormatNumberDirective) formatNumber;
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

  @Output() loaded = new EventEmitter();
  @Input() finPlanObj: any;//finacial plan pdf input
  returnValue: any;
  commoditiesCapability: any;
  constructor(private excel: ExcelGenService,
    private fileUpload: FileUploadServiceService,
    private pdfGen: PdfGenService, private subInjectService: SubscriptionInject,
    private custumService: CustomerService, private eventService: EventService,
    public utils: UtilService, public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet, private assetValidation: AssetValidationService, private ref: ChangeDetectorRef,
    public roleService: RoleService, private customerOverview: CustomerOverviewService, public enumDataService: EnumDataService) { }

  ngOnInit() {
    this.commoditiesCapability = this.roleService.portfolioPermission.subModule.assets.subModule.commodities.capabilityList
    this.reportDate = new Date();
    this.showRequring = '1'
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.clientData = AuthService.getClientData();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    if (this.finPlanObj) {
      if (this.finPlanObj.sectionName == 'Gold') {
        this.showRequring = '1'
        this.getfixedIncomeData('1');
      } else {
        this.showRequring = '3'
        this.getfixedIncomeData('3');
      }
    } else {
      this.getfixedIncomeData('1');
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
      clientId: AuthService.getClientId(),
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
    this.returnValue = this.utils.htmlToPdf(header, para.innerHTML, tableTitle, false, this.fragmentData, '', '', true, null);
    console.log('return value ====', this.returnValue);
    return obj;
    //this.pdfGen.generatePdf(rows, tableTitle);
  }
  // async ExportTOExcel(value) {
  //   this.excelData = []
  //   var data = []
  //   if (value == 'Gold') {
  //     var headerData = [{ width: 20, key: 'Owner' },
  //     { width: 20, key: 'Tolas/grams' },
  //     { width: 25, key: 'Carats' },
  //     { width: 25, key: 'Carat gold price' },
  //     { width: 18, key: ' Market value' },
  //     { width: 18, key: 'Purchase value' },
  //     { width: 15, key: 'Description' },
  //     { width: 10, key: 'Status' },]
  //     var header = ['Owner', 'Tolas/grams', 'Carats', 'Carat gold price', 'Market value',
  //       'Purchase value', 'Description', 'Status'];
  //     this.goldList.filteredData.forEach(element => {
  //       data = [element.ownerName, (element.gramsOrTola), (element.carat), (element.caratGoldPrice),
  //       this.formatNumber.first.formatAndRoundOffNumber(element.marketValue),
  //       this.formatNumber.first.formatAndRoundOffNumber(element.approximatePurchaseValue),
  //       element.description, element.status]
  //       this.excelData.push(Object.assign(data))
  //     });
  //     var footerData = ['Total',
  //       this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMarketValueOther), '',
  //       this.formatNumber.first.formatAndRoundOffNumber(this.sumOfPurchaseValueOther), '', , '', '',]
  //     this.footer.push(Object.assign(footerData))
  //   } else {
  //     var headerData = [{ width: 20, key: 'Owner' },
  //     { width: 20, key: 'Type of commodity' },
  //     { width: 25, key: 'Coupon amount' },
  //     { width: 18, key: 'Market value' },
  //     { width: 18, key: 'Purchase value' },
  //     { width: 18, key: 'Date of purchase' },
  //     { width: 18, key: 'Growth rate' },
  //     { width: 15, key: 'Description' },
  //     { width: 10, key: 'Status' },]
  //     var header = ['Owner', 'Type of commodity', 'Coupon amount', 'Market value', 'Purchase value',
  //       'Date of purchase', 'Growth rate', 'Description', 'Status'];
  //     this.otherCommodityList.filteredData.forEach(element => {
  //       data = [element.ownerName, (element.commodityTypeId),
  //       this.formatNumber.first.formatAndRoundOffNumber(element.marketValue),
  //       (element.purchaseValue), new Date(element.dateOfPurchase),
  //       (element.growthRate), element.description, element.status]
  //       this.excelData.push(Object.assign(data))
  //     });
  //     var footerData = ['Total', '', '', this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMarketValue),
  //       this.formatNumber.first.formatAndRoundOffNumber(this.sumOfPurchaseValue), '', '', '', '']
  //     this.footer.push(Object.assign(footerData))

  //   }
  //   ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value)
  // }
  goldDataList: any;
  otherDataList: any;
  getfixedIncomeData(value) {
    console.log('value++++++', value)
    this.showRequring = value
    if (value == '1') {
      if (this.goldDataList || this.assetValidation.goldDataList) {
        this.isLoading = false;
        this.getGoldRes(this.goldDataList ? this.goldDataList : this.assetValidation.goldDataList);
      }
      else {
        this.goldList = new MatTableDataSource(this.data);
        this.getGoldList();
      }
    } else if (value == '3') {
      if (this.otherDataList || this.assetValidation.otherDataList) {
        this.isLoading = false;
        this.getOthersRes(this.otherDataList ? this.otherDataList : this.assetValidation.otherDataList);
      }
      else {
        this.otherCommodityList = new MatTableDataSource(this.data);
        this.getOtherList();
      }
    }
  }

  ngOnDestroy() {
    this.assetValidation.goldDataList = this.goldDataList ? this.goldDataList : null;
    this.assetValidation.otherDataList = this.otherDataList ? this.otherDataList : null;
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
        if (value == 'GOLD') {
          this.custumService.deleteGold(element.id).subscribe(
            data => {
              dialogRef.close();
              this.customerOverview.portFolioData = null;
              this.customerOverview.assetAllocationChart = null;
              this.customerOverview.summaryLeftsidebarData = null;
              this.customerOverview.aumGraphdata = null;
              this.customerOverview.assetAllocationChart = null;
              this.customerOverview.summaryCashFlowData = null;
              this.assetValidation.addAssetCount({ type: 'Delete', value: 'commodities' })
              this.goldDataList.assetList = this.goldDataList.assetList.filter(x => x.id != element.id);
              this.goldList.data = this.goldDataList.assetList;
              // this.getGoldList()
            },
            error => this.eventService.showErrorMessage(error)
          )
        } else {
          this.custumService.deleteOther(element.id).subscribe(
            data => {
              dialogRef.close();
              this.customerOverview.portFolioData = null;
              this.customerOverview.assetAllocationChart = null;
              this.customerOverview.summaryLeftsidebarData = null;
              this.customerOverview.aumGraphdata = null;
              this.customerOverview.assetAllocationChart = null;
              this.customerOverview.summaryCashFlowData = null;
              this.assetValidation.addAssetCount({ type: 'Delete', value: 'commodities' })
              this.otherDataList.assetList = this.otherDataList.assetList.filter(x => x.id != element.id);
              this.otherCommodityList.data = this.otherDataList.assetList;
              // this.getOtherList()
            },
            error => this.eventService.showErrorMessage(error)
          )
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
  getGoldList() {
    this.isLoading = true;
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.goldList.data = [{}, {}, {}];
    this.custumService.getGold(obj).subscribe(
      data => this.getGoldRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.goldList.data = [];
        this.isLoading = false;
      }
    );
  }
  @Output() changeCount = new EventEmitter();
  getGoldRes(data) {
    // this.assetValidation.getAssetCountGLobalData()
    console.log('getGoldList @@@@', data);
    this.isLoading = false;
    if (data == undefined) {
      this.noData = 'No Gold found';
      this.goldList.data = []
    }
    else if (data.assetList.length != 0) {
      this.goldDataList = data;
      this.goldList.data = this.goldDataList.assetList;
      this.goldList.sort = this.goldListTableSort;
      this.sumOfMarketValue = data.sumOfMarketValue;
      this.sumOfPurchaseValue = data.sumOfPurchaseValue;
    } else {
      this.noData = 'No Gold found';
      this.goldList.data = []
    }
    this.ref.detectChanges();
    this.loaded.emit(this.goldTemp.nativeElement);
  }
  getOtherList() {
    this.isLoading = true;
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    // this.assetValidation.getAssetCountGLobalData()
    this.otherCommodityList.data = [{}, {}, {}];
    this.custumService.getOthers(obj).subscribe(
      data => this.getOthersRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.otherCommodityList.data = [];
        this.isLoading = false;
      }
    );
  }
  getOthersRes(data) {
    this.isLoading = false;
    if (data != undefined) {
      console.log('getOthersRes @@@@', data);
      this.otherDataList = data;
      this.otherCommodityList.data = this.otherDataList.assetList;
      this.otherCommodityList.sort = this.otherListTableSort;
      this.sumOfMarketValueOther = data.sumOfMarketValue;
      this.sumOfPurchaseValueOther = data.sumOfPurchaseValue;

    }
    else {
      this.noData = 'No Others found';
      this.otherCommodityList.data = []
    }
    this.ref.detectChanges();
    this.loaded.emit(this.othersTemp.nativeElement);
  }
  openCommodities(value, state, data) {
    let popupHeaderText = !!data ? 'Edit Gold' : 'Add Gold';
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: GoldComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
            if (value == 'addGold') {
              this.getGoldList()
            } else {
              this.getOtherList()
            }

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openOthers(value, state, data) {
    let popupHeaderText = !!data ? 'Edit Others' : 'Add Other'
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: OthersComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            if (value == 'addGold') {
              this.getGoldList()
            } else {
              this.getOtherList()
            }
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  detailedViewGold(flagValue, data) {
    const fragmentData = {
      flag: flagValue,
      id: 1,
      data: data,
      state: 'open35',
      componentName: DetailedViewGoldComponent,
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
  detailedViewOthers(flagValue, data) {
    const fragmentData = {
      flag: flagValue,
      id: 1,
      data: data,
      state: 'open35',
      componentName: DetailedViewOthersComponent,
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
}
export interface PeriodicElement9 {
  no: string;
  owner: string;
  grams: string;
  car: string;
  price: string;
  mvalue: string;
  pvalue: string;
  desc: string;
  status: String
}

const ELEMENT_DATA9: PeriodicElement9[] = [
  {
    no: '1.', owner: 'Rahul Jain'
    , grams: "50 tolas", car: "24", price: "32,000(as on 20/08/2019)",
    mvalue: "60,000", pvalue: "60,000", desc: "ICICI FD", status: ''
  },
  {
    no: '2.', owner: 'Rahul Jain'
    , grams: "25 tolas", car: "24", price: "32,000(as on 20/08/2019)",
    mvalue: "60,000", pvalue: "60,000", desc: "ICICI FD", status: ''
  },
  {
    no: '', owner: 'Total'
    , grams: "", car: "", price: "",
    mvalue: "1,28,925", pvalue: "1,20,000", desc: "", status: ''
  },

];
export interface PeriodicElement10 {
  no: string;
  owner: string;
  type: string;
  mvalue: string;
  pvalue: string;
  pur: string;
  rate: string;
  desc: string;
}

const ELEMENT_DATA10: PeriodicElement10[] = [

  {
    no: '1.', owner: 'Rahul Jain'
    , type: "Cumulative", mvalue: "60,000", pvalue: "1,00,000", pur: "18/09/2021", rate: "8.40%", desc: "ICICI FD",
  },

  {
    no: '2.', owner: 'Shilpa Jain'
    , type: "Cumulative", mvalue: "60,000", pvalue: "1,00,000", pur: "18/09/2021", rate: "8.40%", desc: "ICICI FD",
  },
  {
    no: '', owner: 'Total'
    , type: "", mvalue: "1,20,000", pvalue: "1,50,000", pur: "", rate: "", desc: "",
  },

];