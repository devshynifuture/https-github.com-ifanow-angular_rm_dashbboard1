import { Component, OnInit, EventEmitter, Output, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { FormatNumberDirective } from 'src/app/format-number.directive';

@Component({
  selector: 'app-fixed-income-mob',
  templateUrl: './fixed-income-mob.component.html',
  styleUrls: ['./fixed-income-mob.component.scss']
})
export class FixedIncomeMobComponent implements OnInit {
  backToMf;
  showBank;
  assetSubType;
  advisorId: any;
  clientId: any;
  dataSource: any = new MatTableDataSource();
  noData: string;
  hideFilter: boolean;
  dataList: any;
  sumAmountInvested: any;
  sumCurrentValue: any;
  sumMaturityValue: any;
  reTotalSum: any;
  data: Array<any> = [{}, {}, {}];
  totalCurrentValue: any;
  sumOfMaturityValue: any;
  sumOfMonthlyContribution: any;
  sumAmountInvestedB: any;
  sumCurrentValueB: any;
  sumCouponAmount: any;
  @ViewChild('fixedIncomeTableSort', { static: false }) fixedIncomeTableSort: MatSort;
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('recurringDepositTable', { static: false }) recurringDepositTableSort: MatSort;
  @ViewChild('bondListTable', { static: false }) bondListTableSort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;

  constructor(
    private customerService: CustomerService,
    public eventService: EventService,
  ) {
    this.clientId = AuthService.getClientId()
    this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
    this.assetSubType = {}
    this.getRecurringDepositList();
    this.getBondsList();
    this.getFixedDepositList();
  }
  @Output() changeCount = new EventEmitter();

  openSubAsset(subAsset) {
    this.assetSubType = Object.assign(this.assetSubType, { assetType: subAsset });
    this.assetSubType = Object.assign(this.assetSubType, { asset: this.dataSource.data });
    this.showBank = true;
  }
  getFixedDepositList() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.dataSource.data = [{}, {}, {}];
    this.customerService.getFixedDeposit(obj).subscribe(
      data => this.getFixedDepositRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
      }
    );
  }
  totalSum: any
  getFixedDepositRes(data) {
    this.totalSum = data;
    if (data == undefined) {
      this.noData = "No scheme found";
      this.dataSource.data = [];
      this.hideFilter = false;
    } else if (data.assetList) {
      this.changeCount.emit("call");
      this.dataList = data.assetList;
      this.dataSource.data = data.assetList;
      this.dataSource.sort = this.fixedIncomeTableSort;
      UtilService.checkStatusId(this.dataSource.filteredData);
      this.sumCurrentValue = 0;
      this.dataSource.filteredData.forEach((o) => {
        if (o.nomineePercentageShare) {
          this.sumCurrentValue += o.nomineePercentageShare;
        }

      });
      this.sumAmountInvested = data.sumOfAmountInvested;
      this.sumCurrentValue = data.sumOfCurrentValue;
      this.sumCurrentValue = Math.round(this.sumCurrentValue)
      this.sumMaturityValue = data.sumOfMaturityValue;
      console.log('sumCurrentValue', this.sumCurrentValue);
    } else {
      this.noData = 'No scheme found';
      this.dataSource.data = [];
    }

  }
  getRecurringDepositList() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.dataSource.data = [{}, {}, {}];
    this.customerService.getRecurringDeposit(obj).subscribe(
      data => this.getRecurringDepositRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
      }
    );
  }
  getRecurringDepositRes(data) {
    this.reTotalSum = data;
    if (data != undefined) {
      if (data.assetList) {
        this.changeCount.emit("call");

        console.log('FixedIncomeComponent getRecuringDepositRes data *** ', data);
        this.dataList = data.assetList;
        this.hideFilter = false;
        this.dataSource.data = data.assetList;
        this.dataSource.sort = this.recurringDepositTableSort;
        UtilService.checkStatusId(this.dataSource.filteredData);
        this.totalCurrentValue = data.totalCurrentValue;
        this.totalCurrentValue = Math.round(this.totalCurrentValue)
        this.sumOfMonthlyContribution = data.sumOfMonthlyContribution;
        this.sumOfMaturityValue = data.sumOfMaturityValue;
      }
    }
    else {
      this.noData = 'No scheme found';
      this.dataSource.data = [];
      this.hideFilter = true;
    }
  }
  getBondsList() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.dataSource.data = [{}, {}, {}];
    this.customerService.getBonds(obj).subscribe(
      data => this.getBondsRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
      }
    );
  }

  bondTotalSum: any;
  getBondsRes(data) {
    this.bondTotalSum = data;
    if (data != undefined) {
      if (data.assetList) {
        this.changeCount.emit("call");

        console.log('getBondsRes ******** ', data);
        this.dataList = data.assetList;
        this.hideFilter = false;
        this.dataSource.data = data.assetList;
        this.dataSource.sort = this.bondListTableSort;
        UtilService.checkStatusId(this.dataSource.filteredData);
        this.sumAmountInvestedB = data.sumOfAmountInvested;
        this.sumCouponAmount = data.sumOfCouponAmount;
        this.sumCurrentValueB = data.sumOfCurrentValue;
        this.sumCurrentValueB = Math.round(this.sumCurrentValueB)
        this.sumMaturityValue = data.sumOfMaturityValue;
      }
    } else {
      this.noData = 'No scheme found';
      this.dataSource.data = [];
      this.hideFilter = true;
    }
  }
}
