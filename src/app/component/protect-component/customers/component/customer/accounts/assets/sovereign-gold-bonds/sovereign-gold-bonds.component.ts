
import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, Input, ChangeDetectorRef, ElementRef } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource, MatBottomSheet } from '@angular/material';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../excel.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { FileUploadServiceService } from '../file-upload-service.service';
import { EnumServiceService } from '../../../../../../../../services/enum-service.service';
import { AssetValidationService } from '../asset-validation.service';
import { BottomSheetComponent } from '../../../../common-component/bottom-sheet/bottom-sheet.component';
import { AddSovereignGoldBondsComponent } from './add-sovereign-gold-bonds/add-sovereign-gold-bonds.component';
import { DetailedViewSovereignGoldBondsComponent } from './detailed-view-sovereign-gold-bonds/detailed-view-sovereign-gold-bonds.component';
import { CustomerOverviewService } from '../../../customer-overview/customer-overview.service';
@Component({
  selector: 'app-sovereign-gold-bonds',
  templateUrl: './sovereign-gold-bonds.component.html',
  styleUrls: ['./sovereign-gold-bonds.component.scss']
})
export class SovereignGoldBondsComponent implements OnInit {
  isLoading = false;
  advisorId: any;
  data: Array<any> = [{}, {}, {}];
  datasource3 = new MatTableDataSource(this.data);
  clientId: any;
  ownerName: any;
  totalCurrentValue: any = 0;
  sumOfpurchasedValue: any = 0;
  footer = [];
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  @Output() loaded = new EventEmitter();//emit financial planning innerHtml reponse
  @Input() finPlanObj: any;//finacial plan pdf input
  @ViewChild('realEstateTemp', { static: false }) realEstateTemp: ElementRef;
  // displayedColumns3 = ['no', 'owner', 'value', 'interest', 'amountInvested', 'issueDate', 'mDate', 'bond', 'status', 'icons'];
  excelData: any[];
  noData: string;
  fileUploadData: any;
  file: any;
  fragmentData = { isSpinner: false };
  isLoadingUpload: boolean = false;
  clientData: any;
  myFiles: any;
  userInfo: any;
  getOrgData: any;
  reportDate: Date;
  activeFilter: any = 'All';
  dataList = { assetList: null, totalCurrentValue: 0 };
  hideFilter: boolean = false;
  constructor(public subInjectService: SubscriptionInject,
    public custmService: CustomerService, public cusService: CustomerService,
    private excel: ExcelGenService, private pdfGen: PdfGenService,
    private fileUpload: FileUploadServiceService,

    public enumService: EnumServiceService, private assetValidation: AssetValidationService,
    public eventService: EventService, public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet, private ref: ChangeDetectorRef,
    private utils: UtilService, private customerOverview: CustomerOverviewService) {


  }
  displayedColumns3 = ['no', 'owner', 'units', 'cvalue', 'interest', 'amountInvested', 'issueDate', 'mvalue', 'mdate', 'bondseries', 'status', 'icons'];

  ngOnInit() {
    this.reportDate = new Date();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.clientData = AuthService.getClientData();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    if (!this.enumService.bondSeriesList) {
      this.getIssuePrice();
    }
    if (this.assetValidation.goldBondList) {
      this.getGoldBondsDataResponse(this.assetValidation.goldBondList)
    }
    else {
      this.getGoldBondsData();
    }
  }

  // Excel(tableTitle) {
  //   let rows = this.tableEl._elementRef.nativeElement.rows;
  //   this.excel.generateExcel(rows, tableTitle);
  // }

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
    this.utils.htmlToPdf(header, para.innerHTML, tableTitle, false, this.fragmentData, '', '', true);
    return obj;
    //this.pdfGen.generatePdf(rows, tableTitle);
  }
  Excel(tableTitle) {
    this.fragmentData.isSpinner = true;
    const rows = this.tableEl._elementRef.nativeElement.rows;
    const data = this.excel.generateExcel(rows, tableTitle);
    if (data) {
      this.fragmentData.isSpinner = false;
    }
  }
  getGoldBondsData() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.datasource3.data = [{}, {}, {}];
    this.custmService.getGoldBondsData(obj).subscribe(
      data => {
        console.log(data, "others");

        this.getGoldBondsDataResponse(data)
      }, (error) => {
        this.eventService.showErrorMessage(error);
        this.datasource3.data = [];
        this.isLoading = false;
      });
    // this.getGoldBondsDataResponse(ELEMENT_DATA3)
  }


  getGoldBondsDataResponse(data) {
    console.log(data, "gold bond");
    this.totalCurrentValue = 0;
    this.isLoading = false;
    if (data == undefined) {
      this.noData = 'No Real estate found';
      this.datasource3.data = [];
      this.hideFilter = true;
      this.totalCurrentValue = 0;
      this.sumOfpurchasedValue = 0;
    } else if (data) {

      console.log('getRealEstateRes', data);
      this.dataList.assetList = data.assetList ? data.assetList : data;
      this.datasource3.data = this.dataList.assetList;
      // data.assetList.forEach(singleAsset => {
      //   singleAsset.typeString = this.enumService.getRealEstateTypeStringFromValue(singleAsset.typeId);
      // });
      // this.totalCurrentValue = 0;
      // this.sumOfpurchasedValue = 0;
      this.dataList.assetList.forEach(o => {
        if (o.ownerList && o.ownerList.length > 0) {
          o.ownerName = o.ownerList[0].name
        }
        o.xirr = o.xirr.toString();
        var res = o.xirr.replace("e+", "");
        res = Number(res).toFixed(2);
        console.log(res);
        o.xirr = res;
        o.currentValue = (o.currentValue) ? o.currentValue : 0
        this.totalCurrentValue += o.currentValue;
        this.sumOfpurchasedValue += o.purchaseAmt ? o.purchaseAmt : 0;
      });
      this.dataList.totalCurrentValue = this.totalCurrentValue;
      this.datasource3.sort = this.sort;
      // this.totalCurrentValue = this.dataList.totalCurrentValue;
      // this.sumOfpurchasedValue = this.dataList.sumOfPurchaseValue;
    } else {
      this.noData = 'No schemes found';
      this.datasource3.data = [];
    }
    // this.assetValidation.getAssetCountGLobalData()
    this.ref.detectChanges();//to refresh the dom when response come
    // this.loaded.emit(this.realEstateTemp.nativeElement);
  }
  formatNumberFun(data, noOfPlaces: number = 0) {
    if (data) {
      data = parseFloat(data)
      if (isNaN(data)) {
        return data;
      } else {
        // console.log(' original ', data);
        const formattedValue = parseFloat((data).toFixed(noOfPlaces)).toLocaleString('en-IN', { 'minimumFractionDigits': noOfPlaces, 'maximumFractionDigits': noOfPlaces });
        // console.log(' original / roundedValue ', data, ' / ', formattedValue);
        return formattedValue;
      }
    } else {
      return '0';
    }
    return data;
  }
  open(value, data) {
    let popupHeaderText = !!data ? 'Edit sovereign gold bonds' : 'Add sovereign gold bonds';
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddSovereignGoldBondsComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            if (data) {
              this.getGoldBondsData();
            }
            else {
              if (!this.dataList) {
                this.dataList = { assetList: [sideBarData.data], totalCurrentValue: 0 };
                this.dataList['totalCurrentValue'] = sideBarData.data.marketValue;
                this.dataList['sumOfPurchaseValue'] = sideBarData.data.purchaseValue;
              }
              else {
                this.dataList.assetList.push(sideBarData.data)
              }
              this.getGoldBondsDataResponse(this.dataList);
            }
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  detailedView(data) {
    const fragmentData = {
      flag: 'DetailedViewRealEstateComponent',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedViewSovereignGoldBondsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {

          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 2: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
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

  ngOnDestroy() {
    this.assetValidation.goldBondList = this.dataList ? this.dataList : null;
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
        let obj = {
          "sovereignGoldId": element.id
        }
        this.cusService.deleteSovereignGoldBond(obj).subscribe(
          data => {
            this.eventService.openSnackBar('Deleted successfully!', 'Dismiss');
            dialogRef.close();
            this.assetValidation.addAssetCount({ type: 'Delete', value: 'sovereignGoldBond' })
            this.customerOverview.portFolioData = null;
            this.customerOverview.assetAllocationChart = null;
            this.customerOverview.summaryLeftsidebarData = null;
            this.customerOverview.aumGraphdata = null;
            this.customerOverview.assetAllocationChart = null;
            this.customerOverview.summaryCashFlowData = null;
            this.dataList.assetList = this.dataList.assetList.filter(x => x.id != element.id);
            // this.dataList.totalCurrentValue -= element.currentValue;
            this.getGoldBondsDataResponse(this.dataList);
            // this.dataList.sumOfPurchaseValue += element.amountInvested;
            // this.datasource3.data = this.dataList;
            // this.getRealEstate();


            // this.dataList.assetList = this.dataList.assetList.filter(x => x.id != element.id);
            // this.dataList.totalCurrentValue -= element.marketValue;
            // // this.dataList.sumOfPurchaseValue += element.amountInvested;
            // this.getOthersAssetsRes(this.dataList);
            // this.datasource3.data = this.dataList;
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

  bondSeriesList: any;
  getIssuePrice() {
    this.cusService.getSovereignGoldBondIssuePrice().subscribe(
      data => {
        this.enumService.bondSeriesList = data;
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
}

const ELEMENT_DATA3 = {
  assetList: [
    {
      "advisorId": 6561,
      "clientId": 223102,
      "ownerList": [
        {
          "name": "Aniket Bhatiya",
          "share": "100",
          "familyMemberId": 223102,
          "id": 0,
          "isClient": 1
        }
      ],
      "bond": "Sovereign Gold Bonds 2020-21-Series V",
      "issueDate": "2020-01-11",
      "amountInterest": 10000,
      "amountInvested": 10000,
      "currentValue": 11000,
      "units": 21,
      "rates": 7,
      "tenure": 9,
      "bondNumber": 9,
      "linkedDematAccount": 185505,
      "linkedBankAccount": 185505,
      "maturityValue": 1000,
      "maturityDate": "2020-12-01",
      "description": "abc",
      "status": 1,
      "nomineeList": [
        {
          "name": "Ankita",
          "sharePercentage": "100",
          "familyMemberId": 380082,
          "id": 0
        }
      ]
    }
  ],
  sumOfPurchaseValue: 120000,
  totalCurrentValue: 120000

};