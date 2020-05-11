import { AddPoTdComponent } from './../common-component/add-po-td/add-po-td.component';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { DetailedPoTdComponent } from './detailed-po-td/detailed-po-td.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { FileUploadServiceService } from '../../file-upload-service.service';

@Component({
  selector: 'app-po-td-scheme',
  templateUrl: './po-td-scheme.component.html',
  styleUrls: ['./po-td-scheme.component.scss'],

})
export class PoTdSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;
  footer = [];
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  excelData: any[];
  sumOfCurrentValue: any;
  sumOfAmountInvested: any;
  sumOfMaturityValue: any;
  fileUploadData: any;
  file: any;
  clientData: any;
  isLoadingUpload:any;
  myFiles: any;
  constructor(private excel: ExcelGenService,
    private pdfGen: PdfGenService, public dialog: MatDialog,
    private fileUpload : FileUploadServiceService,
    private eventService: EventService,
    private cusService: CustomerService,
    private subInjectService: SubscriptionInject) {
      this.clientData = AuthService.getClientData()
    }

  displayedColumns22 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'tenure', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];


  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getPoTdSchemedata();
  }
  fetchData(value, fileName) {
    this.isLoadingUpload = true
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      familyMemberId: this.clientData.familyMemberId,
      asset: value
    }
    this.myFiles = fileName.target.files[0]
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
    { width: 20, key: 'Amount Invested' },
    { width: 20, key: 'Tenure' },
    { width: 20, key: 'Maturity Value' },
    { width: 20, key: 'Maturity Date' },
    { width: 25, key: 'TD Number' },
    { width: 15, key: 'Description' },
    { width: 15, key: 'Status' },];
    const header = ['Owner', 'Current Value', 'Rate', 'Amount Invested',
      'Tenure', 'Maturity Value', 'Maturity Date', 'TD Number', 'Description', 'Status'];
    this.dataSource.filteredData.forEach(element => {
      data = [element.ownerName, (element.currentValue), (element.rate), (element.balance),
      new Date(element.balanceAsOn), element.description, element.status];
      this.excelData.push(Object.assign(data));
    });
    const footerData = ['Total', this.formatNumber.first.formatAndRoundOffNumber(), '',
      this.formatNumber.first.formatAndRoundOffNumber(), '', '', '',];
    this.footer.push(Object.assign(footerData));
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  }

  getPoTdSchemedata() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.dataSource.data = [{}, {}, {}];
    this.cusService.getSmallSavingSchemePOTDData(obj).subscribe(
      data => this.getPoTdSchemedataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  getPoTdSchemedataResponse(data) {
    this.isLoading = false;
    if (data != undefined) {
      if (data.assetList) {
        console.log('getPoTdSchemedataResponse', data);
        this.dataSource.data = data.assetList;
        this.dataSource.sort = this.sort;
        this.sumOfCurrentValue = data.sumOfCurrentValue;
        this.sumOfAmountInvested = data.sumOfAmountInvested;
        this.sumOfMaturityValue = data.sumOfMaturityValue;
        UtilService.checkStatusId(this.dataSource.filteredData);
      }
    } else {
      this.noData = 'No scheme found';
      this.dataSource.data = [];


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
        this.cusService.deletePOTD(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            dialogRef.close();
            this.getPoTdSchemedata();
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

  openDetailPOTD(data) {

    console.log('this is detailed potd data', data);
    const fragmentData = {
      flag: 'detailPoTd',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedPoTdComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getPoTdSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  openAddPOTD(data) {
    let popupHeaderText = !!data ? 'Edit Post office time deposit (PO TD)' : 'Add Post office time deposit (PO TD)';
    const fragmentData = {
      flag: 'addPoTd',
      data,
      id: 1,
      state: 'open',
      componentName: AddPoTdComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getPoTdSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
