import { AddNscComponent } from './../common-component/add-nsc/add-nsc.component';
import { Component, OnInit, ViewChild, ViewChildren, Output, EventEmitter, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource, MatBottomSheet } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { DetailedNscComponent } from './detailed-nsc/detailed-nsc.component';
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
  selector: 'app-nsc-scheme',
  templateUrl: './nsc-scheme.component.html',
  styleUrls: ['./nsc-scheme.component.scss']
})
export class NscSchemeComponent implements OnInit {
  @Output() changeCount = new EventEmitter();
  @Output() nscDataList = new EventEmitter();
  @Input() dataList;
  advisorId: any;
  clientId: number;
  noData: string;
  // isLoading: boolean = true;
  isLoading = false;
  nscData: any;
  sortedData: any;
  sumOfCurrentValue: number;
  sumOfMaturityValue: number;
  data: Array<any> = [{}, {}, {}];
  SumOfMaturityValue;
  SumOfCurrentValue;
  datasource = new MatTableDataSource(this.data);
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  @Output() loaded = new EventEmitter();//emit financial planning innerHtml reponse
  @Input() finPlanObj: any;//finacial plan pdf input
  @ViewChild('nscTemp', { static: false }) nscTemp: ElementRef;
  excelData: any[];
  footer;
  fileUploadData: any;
  file: any;
  isLoadingUpload: boolean = false;
  clientData: any;
  myFiles: any;
  nscList: any[];
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
    private assetValidation: AssetValidationService,
    private pdfGen: PdfGenService, public dialog: MatDialog, private eventService: EventService,
    private cusService: CustomerService, private subInjectService: SubscriptionInject,
    private _bottomSheet: MatBottomSheet,
    public roleService: RoleService,
    private customerOverview: CustomerOverviewService) {
    this.clientData = AuthService.getClientData()
  }

  displayedColumns17 = ['no', 'owner', 'cvalue', 'rate', 'invested', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];


  ngOnInit() {
    this.smallSavingCapability = this.roleService.portfolioPermission.subModule.assets.subModule.smallSavingSchemes.capabilityList;
    this.reportDate = new Date();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    this.getNscSchemedata();
    // if (!this.dataList) {
    //   this.getNscSchemedata();
    // } else {
    //   this.getNscSchemedataResponse(this.dataList);
    // }
    this.footer = [];
    if (!this.dataList && !this.assetValidation.nsclist) {
      this.getNscSchemedata();
    } else {
      this.getNscSchemedataResponse(this.dataList ? this.dataList : this.assetValidation.nsclist);
    }
  }

  ngOnDestroy() {
    this.assetValidation.nsclist = this.dataList ? this.dataList : null;
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
  // async ExportTOExcel(value) {
  //   this.excelData = [];
  //   let data = [];
  //   const headerData = [{ width: 20, key: 'Owner' },
  //   { width: 20, key: 'Current Value' },
  //   { width: 10, key: 'Rate' },
  //   { width: 15, key: ' Maturity Value' },
  //   { width: 15, key: 'Maturity Date' },
  //   { width: 25, key: 'Certificate Number' },
  //   { width: 15, key: 'Description' },
  //   { width: 10, key: 'Status' },];
  //   const header = ['Owner', 'Current Value', 'Rate', ' Maturity Value',
  //     'Maturity Date', 'Certificate Number', 'Description', 'Status'];
  //   this.datasource.filteredData.forEach(element => {
  //     data = [element.ownerName, this.formatNumber.first.formatAndRoundOffNumber(element.currentValue), (element.rate),
  //     this.formatNumber.first.formatAndRoundOffNumber(element.maturityValue), new Date(element.maturityDate), element.certificateNumber, element.description, element.status];
  //     this.excelData.push(Object.assign(data));
  //   });
  //   const footerData = ['Total',
  //     this.formatNumber.first.formatAndRoundOffNumber(this.sumOfCurrentValue), '',
  //     this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMaturityValue), '', '', '', ''];
  //   this.footer.push(Object.assign(footerData));
  //   ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  // }

  getNscSchemedata() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.datasource.data = [{}, {}, {}];
    this.cusService.getSmallSavingSchemeNSCData(obj).subscribe(
      data => this.getNscSchemedataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.datasource.data = [];
        this.isLoading = false;
      }
    );
  }

  getNscSchemedataResponse(data) {
    this.isLoading = false;
    if (data != undefined) {
      if (data.assetList) {
        // this.assetValidation.getAssetCountGLobalData();
        console.log(data, 'getNscSchemedataResponse');
        if (!this.dataList) {
          this.nscDataList.emit(data);
          this.dataList = data;
        }
        this.nscList = data.assetList;
        this.datasource.data = data.assetList;
        this.datasource.sort = this.sort;
        UtilService.checkStatusId(this.datasource.filteredData);
        this.SumOfCurrentValue = data.sumOfCurrentValue;
        this.SumOfMaturityValue = data.sumOfMaturityValue;
        this.nscData = data;
      }
    } else {
      this.noData = 'No scheme found';
      this.datasource.data = []
    }
    if (this.finPlanObj) {
      this.ref.detectChanges();//to refresh the dom when response come
      this.loaded.emit(this.nscTemp.nativeElement);
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
        this.cusService.deleteNSC(element.id).subscribe(
          data => {
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            dialogRef.close();
            this.customerOverview.portFolioData = null;
            this.customerOverview.assetAllocationChart = null;
            this.customerOverview.summaryLeftsidebarData = null;
            this.customerOverview.aumGraphdata = null;
            this.customerOverview.assetAllocationChart = null;
            this.customerOverview.summaryCashFlowData = null;
            this.assetValidation.addAssetCount({ type: 'Delete', value: 'smallSavingSchemes' })
            this.dataList.assetList = this.dataList.assetList.filter(x => x.id != element.id);
            this.dataList.sumOfCurrentValue -= element.currentValue;
            this.dataList.sumOfMaturityValue -= element.maturityValue;

            this.getNscSchemedataResponse(this.dataList);
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
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openAddNSC(data, flag) {
    let popupHeaderText = !!data ? 'Edit National savings certificate (NSC)' : 'Add National savings certificate (NSC)';
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open35' : 'open',
      componentName: (flag == 'detailedNsc') ? DetailedNscComponent : AddNscComponent
    };
    if (flag != 'detailedNsc') {
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
              this.dataList['sumOfMaturityValue'] += sideBarData.data.maturityValue;
            }
            else {
              if (sideBarData.data) {
                this.dataList.assetList.push(sideBarData.data);
                this.dataList.sumOfCurrentValue += sideBarData.data.currentValue;
                this.dataList.sumOfMaturityValue += sideBarData.data.maturityValue;
              }
            }
            this.getNscSchemedataResponse(this.dataList);
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  activeFilter: any = 'All';


  filterNsc(key: string, value: any) {

    let dataFiltered = [];
    this.activeFilter = value;
    if (value == "All") {
      dataFiltered = this.nscList;
    }
    else {
      dataFiltered = this.nscList.filter(function (item) {
        return item[key] === value;
      });
      if (dataFiltered.length <= 0) {
        this.hideFilter = false;
      }
    }
    this.SumOfCurrentValue = 0;
    this.SumOfMaturityValue = 0;
    if (dataFiltered.length > 0) {
      dataFiltered.forEach(element => {
        this.SumOfCurrentValue += element.currentValue;
        this.SumOfMaturityValue += element.maturityValue;
      })
    }
    this.isFixedIncomeFiltered = true;
    this.datasource.data = dataFiltered;
    // this.dataSource = new MatTableDataSource(data);
    // this.datasource.sort = this.tableEl;
  }
}
