import { AddPoMisComponent } from './../common-component/add-po-mis/add-po-mis.component';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { DetailedPoMisComponent } from './detailed-po-mis/detailed-po-mis.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';

@Component({
  selector: 'app-po-mis-scheme',
  templateUrl: './po-mis-scheme.component.html',
  styleUrls: ['./po-mis-scheme.component.scss']
})
export class PoMisSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  datasource = new MatTableDataSource(this.data);
  noData: string;
  pomisData: any;
  sumOfCurrentValue: number;
  sumOfMonthlyPayout: number;
  sumOfAmountInvested: number;
  sumOfMaturityValue: number;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  excelData: any[];
  footer = [];

  constructor(private excel: ExcelService, public dialog: MatDialog, private eventService: EventService,
    private cusService: CustomerService, private subInjectService: SubscriptionInject,
    public util: UtilService) {
  }

  displayedColumns = ['no', 'owner', 'cvalue', 'mpayout', 'rate', 'amt', 'mvalue', 'mdate', 'desc', 'status', 'icons'];


  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getPoMisSchemedata();
  }

  async ExportTOExcel(value) {
    this.excelData = [];
    let data = [];
    const headerData = [{ width: 20, key: 'Owner' },
    { width: 20, key: 'Current Value' },
    { width: 10, key: 'Monthly Payout' },
    { width: 10, key: 'Rate' },
    { width: 20, key: 'Amount Invested' },
    { width: 20, key: 'Maturity Value' },
    { width: 20, key: 'Maturity Date' },
    { width: 15, key: 'Description' },
    { width: 15, key: 'Status' },];
    const header = ['Owner', 'Current Value', 'Monthly Payout', 'Rate',
      'Amount Invested', 'Maturity Value', 'Maturity Date', 'Description', 'Status'];
    this.datasource.filteredData.forEach(element => {
      data = [element.ownerName, (element.currentValue),
      this.formatNumber.first.formatAndRoundOffNumber(element.monthlyPayout),
      (element.rate), this.formatNumber.first.formatAndRoundOffNumber(element.maturityValue),
      this.formatNumber.first.formatAndRoundOffNumber(element.amountInvested),
      new Date(element.maturityDate), element.description, element.status];
      this.excelData.push(Object.assign(data));
    });
    const footerData = ['Total', this.formatNumber.first.formatAndRoundOffNumber(this.sumOfCurrentValue),
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMonthlyPayout),
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfAmountInvested), '',
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMaturityValue), '', '', '',];
    this.footer.push(Object.assign(footerData));
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  }

  getPoMisSchemedata() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.datasource.data = [{}, {}, {}];
    this.cusService.getSmallSavingSchemePOMISData(obj).subscribe(
      data => this.getPoMisSchemedataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.datasource.data = [];
        this.isLoading = false;
      }
    );
  }

  getPoMisSchemedataResponse(data:any) {
    console.log(data);
    this.isLoading = false;
    if (data && data.poMisList && data.poMisList.length != 0) {
      this.datasource.data = data.poMisList;
      this.datasource.sort = this.sort;
      UtilService.checkStatusId(this.datasource.filteredData);
      this.sumOfMaturityValue = data.sumOfMaturityValue;
      this.sumOfCurrentValue = data.sumOfCurrentValue;
      this.sumOfMonthlyPayout = data.sumOfMonthlyPayout;
      this.sumOfAmountInvested = data.sumOfAmountInvested;
      this.pomisData = data;
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
        this.cusService.deletePOMIS(data.id).subscribe(
          data => {
            this.eventService.openSnackBar('POMIS is deleted', 'dismiss');
            dialogRef.close();
            this.getPoMisSchemedata();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openDetailPOMIS(data) {
    const fragmentData = {
      flag: 'detailedPOMIS',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedPoMisComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isRefreshRequired(sideBarData)) {
          this.getPoMisSchemedata();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

  openAddPOMIS(data) {
    const fragmentData = {
      flag: 'addPOMIS',
      data,
      id: 1,
      state: 'open',
      componentName: AddPoMisComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isRefreshRequired(sideBarData)) {
          this.getPoMisSchemedata();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
