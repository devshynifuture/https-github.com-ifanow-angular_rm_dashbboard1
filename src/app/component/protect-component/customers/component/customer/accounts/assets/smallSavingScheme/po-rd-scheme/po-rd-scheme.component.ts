import { DetailedPoRdComponent } from './detailed-po-rd/detailed-po-rd.component';
import { AddPoRdComponent } from './../common-component/add-po-rd/add-po-rd.component';
import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatDialog, MatSort, MatTableDataSource, MatBottomSheet } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { DatePipe } from '@angular/common';
import { FileUploadServiceService } from '../../file-upload-service.service';
import { BottomSheetComponent } from '../../../../../common-component/bottom-sheet/bottom-sheet.component';
import { AssetValidationService } from '../../asset-validation.service';
import { RoleService } from 'src/app/auth-service/role.service';
import { CustomerOverviewService } from '../../../../customer-overview/customer-overview.service';

@Component({
  selector: 'app-po-rd-scheme',
  templateUrl: './po-rd-scheme.component.html',
  styleUrls: ['./po-rd-scheme.component.scss']
})
export class PoRdSchemeComponent implements OnInit {
  @Output() changeCount = new EventEmitter();
  @Output() pordDataList = new EventEmitter();
  @Input() dataList;
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading = true;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  pordData: any;
  sumOfCurrentValue: number;
  sumOfMonthlyDeposit: number;
  sumOfMaturityValue: number;
  footer = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChildren(FormatNumberDirective) formatNumber;
  @Output() loaded = new EventEmitter();//emit financial planning innerHtml reponse
  @Input() finPlanObj: any;//finacial plan pdf input
  @ViewChild('pordTemp', { static: false }) pordTemp: ElementRef;
  excelData: any[];
  fileUploadData: any;
  file: any;
  isLoadingUpload: boolean = false;
  clientData: any;
  myFiles: any;
  pordList: any;
  hideFilter: boolean;
  isFixedIncomeFiltered: boolean;
  reportDate: Date;
  userInfo: any;
  getOrgData: any;
  fragmentData = { isSpinner: false };
  returnValue: any;
  smallSavingCapability: any = {};

  constructor(private ref: ChangeDetectorRef, private excel: ExcelGenService,
    private fileUpload: FileUploadServiceService,
    private utils: UtilService,
    private _bottomSheet: MatBottomSheet,
    private assetValidation: AssetValidationService,
    private datePipe: DatePipe, private pdfGen: PdfGenService, public dialog: MatDialog, private eventService: EventService,
    private cusService: CustomerService, private subInjectService: SubscriptionInject,
    public roleService: RoleService,
    private customerOverview: CustomerOverviewService) {
    this.clientData = AuthService.getClientData()
  }

  displayedColumns21 = ['no', 'owner', 'cvalue', 'rate', 'deposit', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];


  ngOnInit() {
    this.reportDate = new Date();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.smallSavingCapability = this.roleService.portfolioPermission.subModule.assets.subModule.smallSavingSchemes.capabilityList;

    if (!this.dataList && !this.assetValidation.pordlist) {
      this.getPoRdSchemedata();
    } else {
      this.getPoRdSchemedataResponse(this.dataList ? this.dataList : this.assetValidation.pordlist);
    }
  }

  ngOnDestroy() {
    this.assetValidation.pordlist = this.dataList ? this.dataList : null;
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
    this.returnValue = this.utils.htmlToPdf(header, para.innerHTML, tableTitle, false, this.fragmentData, '', '', true, null);
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
    { width: 20, key: 'Monthly Deposit' },
    { width: 20, key: 'Maturity Value' },
    { width: 20, key: 'Maturity Date' },
    { width: 20, key: 'RD Number' },
    { width: 15, key: 'Description' },
    { width: 10, key: 'Status' },];
    const header = ['Owner', 'Current Value', 'Rate', 'Monthly Deposit',
      'Maturity Value', 'Maturity Date', 'RD Number', 'Description', 'Status'];
    this.dataSource.filteredData.forEach(element => {
      data = [element.ownerName, this.formatNumber.first.formatAndRoundOffNumber(element.currentValue),
      (element.rate), (element.deposit), this.formatNumber.first.formatAndRoundOffNumber(element.maturityValue),
      new Date(element.maturityDate), (element.rdNuumber), element.description, element.status];
      this.excelData.push(Object.assign(data));
    });
    const footerData = ['Total', this.formatNumber.first.formatAndRoundOffNumber(this.sumOfCurrentValue), '',
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMonthlyDeposit),
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMaturityValue), '', '', ''];
    this.footer.push(Object.assign(footerData));
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  }

  getPoRdSchemedata() {
    // console.log(this.dataSource.data);



    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      requiredDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    };
    this.cusService.getSmallSavingSchemePORDData(obj).subscribe(
      data => this.getPoRdSchemedataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  getPoRdSchemedataResponse(data) {
    this.isLoading = false;
    if (data != undefined) {
      if (data.assetList) {
        // this.assetValidation.getAssetCountGLobalData();
        console.log('getPoRdSchemedataResponse :::::::::::::::', data);
        if (!this.dataList) {
          this.pordDataList.emit(data);
          this.dataList = data;
        }
        this.pordList = data;
        this.dataSource.data = this.pordList.assetList;
        this.dataSource.sort = this.sort;
        UtilService.checkStatusId(this.dataSource.filteredData);
        this.sumOfCurrentValue = this.pordList.sumOfCurrentValue;
        this.sumOfMonthlyDeposit = this.pordList.sumOfMonthlyDeposit;
        this.sumOfMaturityValue = this.pordList.sumOfMaturityValue;
        this.pordData = data;
      }
    } else {
      this.dataSource.data = [];
      this.noData = 'No scheme found';
    }
    if (this.finPlanObj) {
      this.ref.detectChanges();//to refresh the dom when response come
      this.loaded.emit(this.pordTemp.nativeElement);
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
        this.cusService.deletePORD(element.id).subscribe(
          data => {
            this.customerOverview.portFolioData = null;
            this.customerOverview.assetAllocationChart = null;
            this.customerOverview.summaryLeftsidebarData = null;
            this.customerOverview.aumGraphdata = null;
            this.customerOverview.assetAllocationChart = null;
            this.customerOverview.summaryCashFlowData = null;
            this.assetValidation.addAssetCount({ type: 'Delete', value: 'smallSavingSchemes' })
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            this.dataList.assetList = this.dataList.assetList.filter(x => x.id != element.id);
            this.dataList.sumOfCurrentValue -= element.currentValue;
            this.dataList.sumOfMonthlyDeposit -= element.monthlyContribution;
            this.dataList.sumOfMaturityValue -= element.maturityValue;
            this.getPoRdSchemedataResponse(this.dataList)
            dialogRef.close();
            this.getPoRdSchemedata();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
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

  openDetailedPoRd(data) {
    const fragmentData = {
      flag: 'detailPORD',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedPoRdComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.isLoading = true;
            // this.getPoRdSchemedata();
            this.pordList.assetList.push(sideBarData.data);
            this.pordList.sumOfCurrentValue += sideBarData.data.currentValue;
            this.pordList.sumOfMonthlyDeposit += sideBarData.data.monthlyContribution;
            this.pordList.sumOfMaturityValue += sideBarData.data.maturityValue;
            this.getPoRdSchemedataResponse(this.pordList)
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openAddPORD(data) {
    let popupHeaderText = !!data ? 'Edit Post office recurring deposit (PO RD)' : 'Add Post office recurring deposit (PO RD)';
    const fragmentData = {
      flag: 'addPORD',
      data,
      id: 1,
      state: 'open',
      componentName: AddPoRdComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.dataSource.data = [{}, {}, {}]
            this.isLoading = true;

            if (!this.dataList) {
              if (sideBarData.data) {
                this.dataList = { assetList: [sideBarData.data] };
                this.dataList['sumOfCurrentValue'] = sideBarData.data.currentValue;
                this.dataList['sumOfMonthlyDeposit'] = sideBarData.data.monthlyContribution;
                this.dataList['sumOfMaturityValue'] = sideBarData.data.maturityValue;
              }
            }
            else {

              this.dataList.assetList.push(sideBarData.data);
              this.dataList.sumOfCurrentValue += sideBarData.data.currentValue;
              this.dataList.sumOfMonthlyDeposit += sideBarData.data.monthlyContribution;
              this.dataList.sumOfMaturityValue += sideBarData.data.maturityValue;

            }
            this.getPoRdSchemedataResponse(this.dataList);
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  activeFilter: any = 'All';

  filterPord(key: string, value: any) {

    let dataFiltered = [];
    this.activeFilter = value;
    if (value == "All") {
      dataFiltered = this.pordList.assetList;
    }
    else {
      dataFiltered = this.pordList.assetList.filter(function (item) {
        return item[key] === value;
      });
      if (dataFiltered.length <= 0) {
        this.hideFilter = false;
      }
    }
    this.sumOfCurrentValue = 0;
    this.sumOfMonthlyDeposit = 0;
    this.sumOfMaturityValue = 0;
    if (dataFiltered.length > 0) {
      dataFiltered.forEach(element => {
        this.sumOfCurrentValue += element.currentValue;
        this.sumOfMonthlyDeposit += element.monthlyContribution;
        this.sumOfMaturityValue += element.maturityValue;
      })
    }
    this.isFixedIncomeFiltered = true;
    this.dataSource.data = dataFiltered;
    // this.dataSource = new MatTableDataSource(data);
    // this.dataSource.sort = this.tableEl;
  }
}
