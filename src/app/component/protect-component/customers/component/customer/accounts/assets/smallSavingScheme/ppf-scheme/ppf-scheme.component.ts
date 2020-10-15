import { AddPpfComponent } from './../common-component/add-ppf/add-ppf.component';
import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
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
  constructor(private excel: ExcelGenService, private pdfGen: PdfGenService,
    private fileUpload: FileUploadServiceService,
    private _bottomSheet: MatBottomSheet,
    public dialog: MatDialog, private cusService: CustomerService,
    private assetValidation: AssetValidationService,
    private eventService: EventService, private subInjectService: SubscriptionInject) {

    this.clientData = AuthService.getClientData()
  }
  displayedColumns = ['no', 'owner', 'cvalue', 'rate', 'amt', 'number', 'mdate', 'desc', 'status', 'icons'];

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    if (!this.dataList) {
      this.getPpfSchemeData();
    } else {
      this.getPpfSchemeDataResponse(this.dataList);
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
      familyMemberId: (element.ownerList[0].isClient == 1)?0:element.ownerList[0].familyMemberId,
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
        this.assetValidation.getAssetCountGLobalData();
        console.log('getPpfSchemeDataResponse', data);
        if (!this.dataList) {
          this.ppfDataList.emit(data);
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
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            // this.getPpfSchemeData();
            this.dataList.data = this.dataList.data.filter(x => x.id != element.id);
            this.dataSource.data = this.dataList;
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
            this.getPpfSchemeData();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

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
