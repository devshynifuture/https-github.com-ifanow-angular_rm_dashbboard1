import { AddPoSavingComponent } from './../common-component/add-po-saving/add-po-saving.component';
import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MatDialog, MatSort, MatTableDataSource, MatBottomSheet } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { DetailedPoSavingsComponent } from './detailed-po-savings/detailed-po-savings.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { FileUploadServiceService } from '../../file-upload-service.service';
import { BottomSheetComponent } from '../../../../../common-component/bottom-sheet/bottom-sheet.component';
import { AssetValidationService } from '../../asset-validation.service';
import { RoleService } from 'src/app/auth-service/role.service';

@Component({
  selector: 'app-po-savings',
  templateUrl: './po-savings.component.html',
  styleUrls: ['./po-savings.component.scss']
})
export class PoSavingsComponent implements OnInit {
  @Output() changeCount = new EventEmitter();
  @Output() poDataList = new EventEmitter();
  @Input() dataList;
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading = false;
  posavingdata: any;
  currentValueSum: number;
  balanceMentionedSum: number;
  data: Array<any> = [{}, {}, {}];
  datasource = new MatTableDataSource(this.data);
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  @Output() loaded = new EventEmitter();//emit financial planning innerHtml reponse
  @Input() finPlanObj: any;//finacial plan pdf input
  @ViewChild('poSavingTemp', { static: false }) poSavingTemp: ElementRef;
  excelData: any[];
  footer = [];
  footerRowColumn = ['no', 'owner', 'cvalue', 'rate', 'balanceM', 'balAs', 'desc', 'status', 'icons'];

  displayedColumns20 = ['no', 'owner', 'cvalue', 'rate', 'balanceM', 'balAs', 'desc', 'status', 'icons'];
  SumOfCurrentValue: any;
  SumOfBalancementioned: any;
  fileUploadData: any;
  file: any;
  isLoadingUpload: boolean = false;
  clientData: any;
  myFiles: any;
  reportDate: Date;
  userInfo: any;
  getOrgData: any;
  fragmentData = { isSpinner: false };
  returnValue: any;
  smallSavingCapability: any = {};


  constructor(private excel: ExcelGenService,
    private fileUpload: FileUploadServiceService,
    private utils: UtilService,
    private pdfGen: PdfGenService, public dialog: MatDialog, private eventService: EventService,
    private cusService: CustomerService, private subInjectService: SubscriptionInject,
    private assetValidation: AssetValidationService,
    private _bottomSheet: MatBottomSheet, private ref: ChangeDetectorRef,
    public roleService: RoleService) {
    this.clientData = AuthService.getClientData()
  }

  ngOnInit() {
    this.reportDate = new Date();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.smallSavingCapability = this.roleService.portfolioPermission.subModule.assets.subModule.smallSavingSchemes.capabilityList;

    if (!this.dataList && !this.assetValidation.poSavingslist) {
      this.getPoSavingSchemedata();
    } else {
      this.getPoSavingSchemedataResponse(this.dataList ? this.dataList : this.assetValidation.poSavingslist);
    }
  }

  ngOnDestroy() {
    this.assetValidation.poSavingslist = this.dataList ? this.dataList : null;
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
    { width: 20, key: 'Balance Mentioned' },
    { width: 25, key: 'Balance As On' },
    { width: 15, key: 'Description' },
    { width: 15, key: 'Status' }];
    const header = ['Owner', 'Current Value', 'Rate', 'Balance Mentioned',
      'Balance As On', 'Description', 'Status'];
    this.datasource.filteredData.forEach(element => {
      data = [element.ownerName, (element.currentValue), (element.rate), (element.balance),
      new Date(element.balanceAsOn), element.description, element.status];
      this.excelData.push(Object.assign(data));
    });
    const footerData = ['Total', this.formatNumber.first.formatAndRoundOffNumber(this.currentValueSum), '',
      this.formatNumber.first.formatAndRoundOffNumber(this.balanceMentionedSum), '', '', ''];
    this.footer.push(Object.assign(footerData));
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  }

  getPoSavingSchemedata() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.datasource.data = [{}, {}, {}];
    this.cusService.getSmallSavingSchemePOSAVINGData(obj).subscribe(
      data => this.getPoSavingSchemedataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.datasource.data = [];
        this.isLoading = false;
      }
    );
  }

  getPoSavingSchemedataResponse(data) {
    this.isLoading = false;
    if (data != undefined) {
      if (data.assetList) {
        // this.assetValidation.getAssetCountGLobalData();
        console.log('getPoSavingSchemedataResponse', data);
        if (!this.dataList) {
          this.poDataList.emit(data);
        }
        this.datasource.data = data.assetList;
        this.datasource.sort = this.sort;
        UtilService.checkStatusId(this.datasource.filteredData);
        this.SumOfCurrentValue = data.sumOfCurrentValue;
        this.SumOfBalancementioned = data.SumOfBalancementioned;
        this.posavingdata = data;
      }
    } else {
      this.noData = 'No scheme found';
      this.datasource.data = [];

    }
    if (this.finPlanObj) {
      this.ref.detectChanges();//to refresh the dom when response come
      this.loaded.emit(this.poSavingTemp.nativeElement);
    }
  }

  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deletePOSAVING(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            dialogRef.close();
            this.assetValidation.addAssetCount({ type: 'Delete', value: 'smallSavingSchemes' })
            this.getPoSavingSchemedata();
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

  openDetailPoSaving(data) {
    const fragmentData = {
      flag: 'detailPoSaving',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedPoSavingsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getPoSavingSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  openAddPOSAVING(data) {
    let popupHeaderText = !!data ? 'Edit Post office savings a/c' : 'Add Post office savings a/c';
    const fragmentData = {
      flag: 'addPOSAVING',
      data,
      id: 1,
      state: 'open',
      componentName: AddPoSavingComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getPoSavingSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
