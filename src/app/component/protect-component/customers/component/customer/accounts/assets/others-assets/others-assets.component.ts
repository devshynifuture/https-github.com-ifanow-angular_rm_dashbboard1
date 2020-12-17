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
import { AddOthersAssetComponent } from './add-others-asset/add-others-asset.component';
import { DetailedViewOthersAssetComponent } from './detailed-view-others-asset/detailed-view-others-asset.component';

@Component({
  selector: 'app-others-assets',
  templateUrl: './others-assets.component.html',
  styleUrls: ['./others-assets.component.scss']
})
export class OthersAssetsComponent implements OnInit {
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

  constructor(public subInjectService: SubscriptionInject,
    public custmService: CustomerService, public cusService: CustomerService,
    private excel: ExcelGenService, private pdfGen: PdfGenService,
    private fileUpload: FileUploadServiceService,
    public enumService: EnumServiceService, private assetValidation: AssetValidationService,
    public eventService: EventService, public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.reportDate = new Date();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.clientData = AuthService.getClientData();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    this.getOthersAssets();

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

  pdf(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.pdfGen.generatePdf(rows, tableTitle);
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

  getOthersAssets() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.datasource3.data = [{}, {}, {}];
    this.custmService.getOthersAssets(obj).subscribe(
      data => {
        console.log(data, "others");

        this.getOthersAssetsRes(data)
      }, (error) => {
        this.eventService.showErrorMessage(error);
        this.datasource3.data = [];
        this.isLoading = false;
      });
    // this.getOthersAssetsRes(ELEMENT_DATA3);
  }

  @Output() changeCount = new EventEmitter();

  getOthersAssetsRes(data) {
    this.isLoading = false;
    if (data == undefined) {
      this.noData = 'No Real estate found';
      this.datasource3.data = [];
      this.hideFilter = true;
      this.totalCurrentValue = 0;
      this.sumOfpurchasedValue = 0;
    } else if (data) {

      console.log('getRealEstateRes', data);
      this.dataList = data;
      this.datasource3.data = this.dataList;
      // data.assetList.forEach(singleAsset => {
      //   singleAsset.typeString = this.enumService.getRealEstateTypeStringFromValue(singleAsset.typeId);
      // });
      this.totalCurrentValue = 0;
      this.sumOfpurchasedValue = 0;
      data.forEach(o => {
        this.totalCurrentValue += o.currentValue;
        this.sumOfpurchasedValue += o.purchaseAmt;
      });
      this.datasource3.sort = this.sort;
      // this.totalCurrentValue = this.dataList.totalCurrentValue;
      // this.sumOfpurchasedValue = this.dataList.sumOfPurchaseValue;
    } else {
      this.noData = 'No schemes found';
      this.datasource3.data = [];
    }
    this.assetValidation.getAssetCountGLobalData()
    this.ref.detectChanges();//to refresh the dom when response come
    // this.loaded.emit(this.realEstateTemp.nativeElement);
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
          "otherAssetId": element.id
        }
        this.cusService.deleteOtherAssets(element.id).subscribe(
          data => {
            this.eventService.openSnackBar('Deleted successfully!', 'Dismiss');
            dialogRef.close();
            // this.dataList.assetList = this.dataList.assetList.filter(x => x.id != element.id);
            // this.dataList.totalCurrentValue -= element.marketValue;
            // // this.dataList.sumOfPurchaseValue += element.amountInvested;
            // this.getOthersAssetsRes(this.dataList);
            // this.datasource3.data = this.dataList;
            this.getOthersAssets();
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
    let popupHeaderText = !!data ? 'Edit Others' : 'Add Others';
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddOthersAssetComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // if (data) {
            this.getOthersAssets();
            // }
            // else {
            //   if (!this.dataList) {
            //     this.dataList = { assetList: [sideBarData.data] };
            //     this.dataList['totalCurrentValue'] = sideBarData.data.marketValue;
            //     this.dataList['sumOfPurchaseValue'] = sideBarData.data.purchaseValue;
            //   }
            //   else {
            //     this.dataList.assetList.push(sideBarData.data)
            //     this.dataList.totalCurrentValue += sideBarData.data.marketValue;
            //     this.dataList.sumOfPurchaseValue += sideBarData.data.purchaseValue;
            //   }
            //   this.getOthersAssetsRes(this.dataList);
            // }
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
      componentName: DetailedViewOthersAssetComponent
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
}

export interface PeriodicElement3 {
  owner: string;
  assets: string;
  value: string;
  pvalue: string;
  date: string;
  rate: number;
  desc: string;
  status: string;
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
      "assetName": "test asset",
      "currentValueAsonDate": "2020-12-01",
      "currentValue": 1000,
      "debtAssetAllocPerc": 9,
      "equityAssetAllocPerc": 9,
      "hasMaturity": 1,
      "maturityValue": 1000,
      "maturityDate": "2020-12-01",
      "hasRecurringContribution": 0,
      "recurringContributionFrequency": 2,
      "approxAmount": 1000,
      "endDate": "2020-12-01",
      "growthRate": 9,
      "userBankMappingId": 185505,
      "purchaseDate": "2020-12-01",
      "purchaseAmt": 1000,
      "description": "abc",
      "nomineeList": [
        {
          "name": "Ankita",
          "sharePercentage": "100",
          "familyMemberId": 380082,
          "id": 0
        }
      ]
    },
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
      "assetName": "test asset",
      "currentValueAsonDate": "2020-12-01",
      "currentValue": 1000,
      "debtAssetAllocPerc": 9,
      "equityAssetAllocPerc": 9,
      "hasMaturity": 1,
      "maturityValue": 1000,
      "maturityDate": "2020-12-01",
      "hasRecurringContribution": 0,
      "recurringContributionFrequency": 2,
      "approxAmount": 1000,
      "endDate": "2020-12-01",
      "growthRate": 9,
      "userBankMappingId": 185505,
      "purchaseDate": "2020-12-01",
      "purchaseAmt": 1000,
      "description": "abc",
      "nomineeList": [
        {
          "name": "Ankita",
          "sharePercentage": "100",
          "familyMemberId": 380082,
          "id": 0
        }
      ]
    },
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
      "assetName": "test asset",
      "currentValueAsonDate": "2020-12-01",
      "currentValue": 1000,
      "debtAssetAllocPerc": 9,
      "equityAssetAllocPerc": 9,
      "hasMaturity": 1,
      "maturityValue": 1000,
      "maturityDate": "2020-12-01",
      "hasRecurringContribution": 0,
      "recurringContributionFrequency": 2,
      "approxAmount": 1000,
      "endDate": "2020-12-01",
      "growthRate": 9,
      "userBankMappingId": 185505,
      "purchaseDate": "2020-12-01",
      "purchaseAmt": 1000,
      "description": "abc",
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

