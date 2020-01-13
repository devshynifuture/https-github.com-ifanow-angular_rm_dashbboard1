import {AddPoTdComponent} from './../common-component/add-po-td/add-po-td.component';
import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {AuthService} from 'src/app/auth-service/authService';
import {CustomerService} from '../../../../customer.service';
import {UtilService} from 'src/app/services/util.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {EventService} from 'src/app/Data-service/event.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {DetailedPoTdComponent} from './detailed-po-td/detailed-po-td.component';
import {FormatNumberDirective} from 'src/app/format-number.directive';
import {ExcelService} from '../../../../excel.service';

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

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  excelData: any[];

  constructor(private excel: ExcelService, public dialog: MatDialog, private eventService: EventService, private cusService: CustomerService, private subInjectService: SubscriptionInject) {
  }

  displayedColumns22 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'tenure', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];


  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getPoTdSchemedata();
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
    console.log(data);
    this.isLoading = false;
    if (data.postOfficeTdList.length != 0) {
      this.dataSource.data = data.postOfficeTdList;
      this.dataSource.sort = this.sort;
      UtilService.checkStatusId(this.dataSource.filteredData);
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
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deletePOTD(data.id).subscribe(
          data => {
            this.eventService.openSnackBar('POSAVING is deleted', 'dismiss');
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
        if (UtilService.isRefreshRequired(sideBarData)) {
          this.getPoTdSchemedata();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

  openAddPOTD(data) {
    const fragmentData = {
      flag: 'addPoTd',
      data,
      id: 1,
      state: 'open',
      componentName: AddPoTdComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isRefreshRequired(sideBarData)) {
          this.getPoTdSchemedata();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
