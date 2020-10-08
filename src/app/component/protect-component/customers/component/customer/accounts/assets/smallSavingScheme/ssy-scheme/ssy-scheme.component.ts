import { AddSsyComponent } from './../common-component/add-ssy/add-ssy.component';
import { Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource, MatBottomSheet } from '@angular/material';
import { DetailedSsyComponent } from './detailed-ssy/detailed-ssy.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { FileUploadServiceService } from '../../file-upload-service.service';
import { BottomSheetComponent } from '../../../../../common-component/bottom-sheet/bottom-sheet.component';
import { AssetValidationService } from '../../asset-validation.service';

@Component({
  selector: 'app-ssy-scheme',
  templateUrl: './ssy-scheme.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SsySchemeComponent implements OnInit {
  @Output() changeCount = new EventEmitter();
  @Output() ssyDataList = new EventEmitter();
  @Input() dataList;
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  datasource = new MatTableDataSource(this.data);
  ssyData: any;
  sumOfCurrentValue: number;
  sumOfAmountInvested: number;

  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  excelData: any[];
  footer = [];
  fileUploadData: any;
  file: any;
  isLoadingUpload: boolean = false;
  clientData: any;
  myFiles: any;
  isFixedIncomeFiltered: boolean;
  hideFilter: boolean;
  ssyList: any[];

  constructor(private excel: ExcelGenService,
    private pdfGen: PdfGenService, public dialog: MatDialog,
    private fileUpload: FileUploadServiceService,
    private cusService: CustomerService,
    private _bottomSheet: MatBottomSheet,
    private assetValidation: AssetValidationService,
    private subInjectService: SubscriptionInject,
    private eventService: EventService) {
    this.clientData = AuthService.getClientData()
  }

  displayedColumns16 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'number', 'mdate', 'desc', 'status', 'icons'];

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    if (!this.dataList) {
      this.getSsySchemedata();
    } else {
      this.getSsySchemedataResponse(this.dataList);
    }

  }

  Excel(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows, tableTitle)
  }
  fetchData(value, fileName, element) {
    this.isLoadingUpload = true
    let obj = {
      advisorId: this.advisorId,
      clientId: element.clientId,
      familyMemberId: element.familyMemberId,
      asset: value
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

  async ExportTOExcel(value) {
    this.excelData = [];
    let data = [];
    const headerData = [{ width: 20, key: 'Owner' },
    { width: 20, key: 'Current Value' },
    { width: 10, key: 'Rate' },
    { width: 25, key: 'Total Amount Invested' },
    { width: 20, key: 'Account Number' },
    { width: 15, key: 'Maturity Date' },
    { width: 15, key: 'Description' },
    { width: 10, key: 'Status' },];
    const header = ['Owner', 'Current Value', 'Rate', 'Total Amount Invested',
      'Account Number', 'Maturity Date', 'Description', 'Status'];
    this.datasource.filteredData.forEach(element => {
      data = [element.ownerName, this.formatNumber.first.formatAndRoundOffNumber(element.currentValue), (element.rate),
      this.formatNumber.first.formatAndRoundOffNumber(element.amountInvested), (element.number), new Date(element.maturityDate), element.description, element.status];
      this.excelData.push(Object.assign(data));
    });
    const footerData = ['Total',
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfCurrentValue), '',
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfAmountInvested), '', '', '', ''];
    this.footer.push(Object.assign(footerData));
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  }

  getSsySchemedata() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.datasource.data = [{}, {}, {}];
    this.cusService.getSmallSavingSchemeSSYData(obj).subscribe(
      data => this.getSsySchemedataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.datasource.data = [];
        this.isLoading = false;
      }
    );
  }

  sumOfAccountBalance: any;
  getSsySchemedataResponse(data) {
    this.isLoading = false;
    if (data != undefined) {
      if (data.assetList) {
        this.assetValidation.getAssetCountGLobalData();
        console.log('getSsySchemedataResponse', data);
        if (!this.dataList) {
          this.ssyDataList.emit(data);
        }
        this.ssyList = data.assetList;
        this.datasource.data = data.assetList;
        this.datasource.sort = this.sort;
        UtilService.checkStatusId(this.datasource.filteredData);
        this.sumOfCurrentValue = data.sumOfCurrentValue;
        this.sumOfAmountInvested = data.sumOfAmountInvested;
        this.sumOfAccountBalance = data.sumOfAccountBalance;
        this.ssyData = data;
      }
    } else {
      this.noData = 'No scheme found';
      this.datasource.data = []
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
        this.cusService.deleteSSY(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            dialogRef.close();
            this.getSsySchemedata();
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

  addOpenSSY(data, flag) {
    let popupHeaderText = !!data ? 'Edit Sukanya samriddhi yojana (SSY)' : 'Add Sukanya samriddhi yojana (SSY)';
    const fragmentData = {
      flag: 'addSyss',
      data,
      id: 1,
      state: (flag == 'detailedSsy') ? 'open35' : 'open',
      componentName: (flag == 'detailedSsy') ? DetailedSsyComponent : AddSsyComponent
    };
    if (flag != 'detailedSsy') {
      fragmentData['popupHeaderText'] = popupHeaderText;
    }
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getSsySchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  activeFilter: any = 'All';

  filterSsy(key: string, value: any) {

    let dataFiltered = [];
    this.activeFilter = value;
    if (value == "All") {
      dataFiltered = this.ssyList;
    }
    else {
      dataFiltered = this.ssyList.filter(function (item) {
        return item[key] === value;
      });
      if (dataFiltered.length <= 0) {
        this.hideFilter = false;
      }
    }
    this.sumOfCurrentValue = 0;
    this.sumOfAccountBalance = 0;
    if (dataFiltered.length > 0) {
      dataFiltered.forEach(element => {
        this.sumOfCurrentValue += element.currentValue;
        this.sumOfAccountBalance += element.accountBalance;
      })
    }
    this.isFixedIncomeFiltered = true;
    this.datasource.data = dataFiltered;
    // this.dataSource = new MatTableDataSource(data);
    // this.datasource.sort = this.tableEl;
  }
}
