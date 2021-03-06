import { AddPpfComponent } from './../common-component/add-ppf/add-ppf.component';
import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatTableDataSource, MatSort, MatBottomSheet } from '@angular/material';
import { ExcelService } from '../../../../excel.service';
import { DetailedPpfComponent } from './detailed-ppf/detailed-ppf.component';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { FileUploadServiceService } from '../../file-upload-service.service';
import { BottomSheetComponent } from '../../../../../common-component/bottom-sheet/bottom-sheet.component';
import { AssetValidationService } from '../../asset-validation.service';
import { element } from 'protractor';
import { RoleService } from 'src/app/auth-service/role.service';
import { CustomerOverviewService } from '../../../../customer-overview/customer-overview.service';

@Component({
  selector: 'app-ppf-scheme',
  templateUrl: './ppf-scheme.component.html',
  styleUrls: ['./ppf-scheme.component.scss']
})

export class PPFSchemeComponent implements OnInit {
  @Output() changeCount = new EventEmitter();
  @Output() ppfDataList = new EventEmitter();
  @Input() dataList;
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Output() loaded = new EventEmitter();//emit financial planning innerHtml reponse
  @Input() finPlanObj: any;//finacial plan pdf input
  @ViewChild('ppfTemp', { static: false }) ppfTemp: ElementRef;
  SumOfAmountInvested: any;
  SumOfCurrentValue: any;
  fileUploadData: any;
  file: any;
  isLoadingUpload: boolean = false;
  clientData: any;
  myFiles: any;
  ppfList: any;
  isFixedIncomeFiltered: boolean;
  hideFilter: boolean;
  userInfo: any;
  getOrgData: any;
  reportDate: Date;
  fragmentData = { isSpinner: false };
  returnValue: any;
  smallSavingCapability: any = {};

  constructor(private ref: ChangeDetectorRef, private excel: ExcelGenService, private pdfGen: PdfGenService,
    private fileUpload: FileUploadServiceService,
    private _bottomSheet: MatBottomSheet,
    private utils: UtilService,
    public dialog: MatDialog, private cusService: CustomerService,
    private assetValidation: AssetValidationService,
    private eventService: EventService, private subInjectService: SubscriptionInject,
    public roleService: RoleService,
    private customerOverview: CustomerOverviewService) {

    this.clientData = AuthService.getClientData()
  }
  displayedColumns = ['no', 'owner', 'cvalue', 'rate', 'amt', 'number', 'mdate', 'desc', 'status', 'icons'];

  ngOnInit() {
    this.smallSavingCapability = this.roleService.portfolioPermission.subModule.assets.subModule.smallSavingSchemes.capabilityList;
    this.reportDate = new Date();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    if (!this.dataList && !this.assetValidation.ppflist) {
      this.getPpfSchemeData();
    } else {
      this.getPpfSchemeDataResponse(this.dataList ? this.dataList : this.assetValidation.ppflist);
    }
  }

  ngOnDestroy() {
    this.assetValidation.ppflist = this.dataList ? this.dataList : null;
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

  getPpfSchemeData() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.dataSource.data = [{}, {}, {}];
    this.cusService.getSmallSavingSchemePPFData(obj).subscribe(
      data => this.getPpfSchemeDataResponse(data),
      (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      });
  }
  sumOfAmountInvested: any;
  sumOfAccountBalance: any;

  getPpfSchemeDataResponse(data) {
    this.isLoading = false;
    if (data != undefined) {
      if (data.assetList) {
        // this.assetValidation.getAssetCountGLobalData();
        console.log('getPpfSchemeDataResponse', data);
        if (!this.dataList) {
          this.ppfDataList.emit(data);
          this.dataList = data;
        }

        this.ppfList = data.assetList;
        this.dataSource.data = data.assetList;
        this.dataSource.sort = this.sort;
        UtilService.checkStatusId(this.dataSource.filteredData);
        this.SumOfCurrentValue = data.sumOfCurrentValue;
        this.sumOfAmountInvested = data.sumOfAmountInvested;
        this.sumOfAccountBalance = data.sumOfAccountBalance;
      }
    } else {
      this.noData = 'No scheme found';
      this.dataSource.data = []
    }
    if (this.finPlanObj) {
      this.ref.detectChanges();//to refresh the dom when response come
      this.loaded.emit(this.ppfTemp.nativeElement);
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
        this.cusService.deletePPF(element.id).subscribe(
          data => {
            this.customerOverview.portFolioData = null;
            this.customerOverview.assetAllocationChart = null;
            this.customerOverview.summaryLeftsidebarData = null;
            this.customerOverview.aumGraphdata = null;
            this.customerOverview.assetAllocationChart = null;
            this.customerOverview.summaryCashFlowData = null;
            this.assetValidation.addAssetCount({ type: 'Delete', value: 'smallSavingSchemes' })
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            // this.getPpfSchemeData();
            this.dataList.assetList = this.dataList.assetList.filter(x => x.id != element.id);
            this.dataList.sumOfCurrentValue -= element.currentValue;
            // this.ppfList['sumOfAmountInvested'] = sideBarData.data.currentValuation;
            this.dataList.sumOfAccountBalance -= element.accountBalance;
            this.getPpfSchemeDataResponse(this.dataList);
            dialogRef.close();

          },
          error => this.eventService.showErrorMessage(error)
        )
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
  openDetailPPF(data) {

    console.log('this is detailed potd data', data);
    const fragmentData = {
      flag: 'detailPoTd',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedPpfComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getPpfSchemeData();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openAddPPF(data) {
    let popupHeaderText = !!data ? 'Edit Public provident fund (PPF)' : 'Add Public provident fund (PPF)';
    const fragmentData = {
      flag: 'addPpf',
      data,
      id: 1,
      state: 'open',
      componentName: AddPpfComponent,
      popupHeaderText: popupHeaderText
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            if (!data || sideBarData.data) {
              if (!this.dataList) {

                this.dataList = { assetList: [sideBarData.data] };
                this.dataList['sumOfCurrentValue'] = sideBarData.data.currentValue;
                // this.ppfList['sumOfAmountInvested'] = sideBarData.data.currentValuation;
                this.dataList['sumOfAccountBalance'] = sideBarData.data.accountBalance;
              }
              else {
                if (sideBarData.data) {

                  if (fragmentData.popupHeaderText == 'Edit Public provident fund (PPF)') {
                    this.dataList.assetList = this.dataList.assetList.filter(x => x.id != sideBarData.data.id)
                  }
                  this.dataList.assetList.push(sideBarData.data);
                  this.dataList.sumOfCurrentValue += sideBarData.data.currentValue;
                  // this.ppfList['sumOfAmountInvested'] = sideBarData.data.currentValuation;
                  this.dataList.sumOfAccountBalance += sideBarData.data.accountBalance;
                }
              }
              this.getPpfSchemeDataResponse(this.dataList);
              console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
            } else {
              this.getPpfSchemeData();
            }
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  activeFilter: any = 'All';


  filterPPF(key: string, value: any) {

    let dataFiltered = [];
    this.activeFilter = value;
    if (value == "All") {
      dataFiltered = this.ppfList;
    }
    else {
      dataFiltered = this.ppfList.filter(function (item) {
        return item[key] === value;
      });
      if (dataFiltered.length <= 0) {
        this.hideFilter = false;
      }
    }
    this.SumOfCurrentValue = 0;
    this.sumOfAccountBalance = 0;
    if (dataFiltered.length > 0) {
      dataFiltered.forEach(element => {
        this.SumOfCurrentValue += element.currentValue;
        this.sumOfAccountBalance += element.accountBalance;
      })
    }
    this.isFixedIncomeFiltered = true;
    this.dataSource.data = dataFiltered;
    // this.dataSource = new MatTableDataSource(data);
    // this.dataSource.sort = this.tableEl;
  }


}
export interface PeriodicElement16 {
  no: string;
  owner: string;
  cvalue: string;
  rate: string;
  amt: string;
  number: string;
  mdate: string;
  desc: string;
  status: string;
}
