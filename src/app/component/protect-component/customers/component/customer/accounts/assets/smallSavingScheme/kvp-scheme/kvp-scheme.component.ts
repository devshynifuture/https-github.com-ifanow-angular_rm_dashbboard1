import {AddKvpComponent} from './../common-component/add-kvp/add-kvp.component';
import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {AuthService} from 'src/app/auth-service/authService';
import {CustomerService} from '../../../../customer.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {EventService} from 'src/app/Data-service/event.service';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {DetailedKvpComponent} from './detailed-kvp/detailed-kvp.component';
import {FormatNumberDirective} from 'src/app/format-number.directive';
import {ExcelService} from '../../../../excel.service';

@Component({
  selector: 'app-kvp-scheme',
  templateUrl: './kvp-scheme.component.html',
  styleUrls: ['./kvp-scheme.component.scss']
})
export class KvpSchemeComponent implements OnInit {
  clientId: number;
  advisorId: any;
  noData: string;
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  datasource = new MatTableDataSource(this.data);
  kvpData: any;
  sumOfCurrentValue: number;
  sumOfAmountInvested: number;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  excelData: any[];
  footer = [];

  constructor(private excel: ExcelService, public dialog: MatDialog, private eventService: EventService, private cusService: CustomerService, private subInjectService: SubscriptionInject) {
  }

  displayedColumns18 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'mvalue', 'mdate', 'desc', 'status', 'icons'];

  ngOnInit() {

    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getKvpSchemedata();
  }

  async ExportTOExcel(value) {
    this.excelData = [];
    let data = [];
    let headerData = [{ width: 20, key: 'Owner' },
    { width: 20, key: 'Current Value' },
    { width: 10, key: 'Rate' },
    { width: 25, key: 'Amount Invested' },
    { width: 20, key: 'Maturity Value' },
    { width: 15, key: 'Maturity Date' },
    { width: 15, key: 'Description' },
    { width: 10, key: 'Status' },];
    let header = ['Owner', 'Current Value', 'Rate', 'Amount Invested',
      'Maturity Value', 'Maturity Date', 'Description', 'Status'];
    this.datasource.filteredData.forEach(element => {
      data = [element.ownerName, this.formatNumber.first.formatAndRoundOffNumber(element.currentValue), (element.rate),
      this.formatNumber.first.formatAndRoundOffNumber(element.amountInvested), (element.maturityValue), new Date(element.maturityDate), element.description, element.status];
      this.excelData.push(Object.assign(data));
    });
    let footerData = ['Total',
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfCurrentValue), '',
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfAmountInvested), '', '', '', ''];
    this.footer.push(Object.assign(footerData));
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  }

  getKvpSchemedata() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.datasource.data = [{}, {}, {}];
    this.cusService.getSmallSavingSchemeKVPData(obj).subscribe(
      data => this.getKvpSchemedataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.datasource.data = [];
        this.isLoading = false;
      }
    );
  }

  getKvpSchemedataResponse(data) {
    console.log(data);
    this.isLoading = false;
    if (data && data.KVPList && data.KVPList.length != 0) {
      this.datasource.data = data.KVPList;
      this.datasource.sort = this.sort;
      UtilService.checkStatusId(this.datasource.filteredData);
      this.sumOfCurrentValue = data.SumOfCurrentValue;
      this.sumOfAmountInvested = data.SumOfAmountInvested;
      this.kvpData = data;
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
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deleteKVP(data.id).subscribe(
          data => {
            this.eventService.openSnackBar('KVP is deleted', 'dismiss');
            dialogRef.close();
            this.getKvpSchemedata();
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

  openAddKVP(data, flag) {
    const fragmentData = {
      flag: 'addKVP',
      data,
      id: 1,
      state: (flag == 'detailedKvp') ? 'open35' : 'open',
      componentName: (flag == 'detailedKvp') ? DetailedKvpComponent : AddKvpComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isRefreshRequired(sideBarData)) {
          this.getKvpSchemedata();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
