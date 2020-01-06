import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SubscriptionService } from '../../subscription.service';
import { SubscriptionInject } from '../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { AuthService } from '../../../../../../auth-service/authService';
import { UtilService, ValidatorType } from '../../../../../../services/util.service';
import * as _ from 'lodash';

export interface PeriodicElement {
  date: string;
  invoicenum: string;
  name: string;
  email: string;
  status: string;
  duedate: string;
  amt: string;
  balance: string;

}

@Component({
  selector: 'app-invoices-subscription',
  templateUrl: './invoices-subscription.component.html',
  styleUrls: ['./invoices-subscription.component.scss']
})
export class InvoicesSubscriptionComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  selectedStatusFilter: any;
  selectedDateFilter: any;
  chips = [
    { name: 'LIVE', value: 1 },
    { name: 'PAID', value: 2 },
    { name: 'OVERDUE', value: 3 }
  ];
  dateChips = [
    { name: 'Date', value: 1 },
    { name: 'Due date', value: 2 },
  ];
  invoiceDesign: string;
  noData: string;
  filterStatus = [];
  filterDate = [];
  statusIdList = [];
  showFilter = false;
  selectedDateRange: { begin: Date; end: Date; };
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  list: any[];
  maxDate = new Date();

  numValidator = ValidatorType.NUMBER_ONLY;

  constructor(public dialog: MatDialog, public subInjectService: SubscriptionInject,
    private eventService: EventService, public subscription: SubscriptionService) {
    this.ngOnInit();
  }

  isLoading = false;
  subscriptionValue: any;
  invoiceSub: any;
  invoiceSubscription: string;
  invoiceClientData: any;
  dataCount: any;
  showEdit: boolean;
  showPdfInvoice;
  singleInvoiceData;
  // showLoader = true;
  advisorId;
  displayedColumns: string[] = ['checkbox', 'date', 'invoicenum', 'name', 'status', 'email', 'duedate', 'amt', 'balance'];
  @Input() invoiceValue;

  ngOnInit() {
    // this.dataSource = [{}, {}, {}];
    this.advisorId = AuthService.getAdvisorId();
    this.getInvoiceSubData();
    this.showEdit = false;
    this.invoiceSubscription = 'false';
    this.invoiceDesign = 'true';
    this.dataCount = 0;

  }

  getInvoiceSubData() {
    this.isLoading = true;
    const obj = {
      id: this.advisorId,
      // id: 2735, // pass here advisor id for Invoice advisor
      module: 1
    };
    this.dataSource.data = [{}, {}, {}];
    this.subscription.getInvoices(obj).subscribe(
      data => this.getInvoiceResponseData(data)
    );
  }

  addInvoice(edit) {

    this.invoiceSubscription = edit;
    // this.invoiceDesign = edit;
    console.log('edit', edit);
  }

  getInvoiceResponseData(data) {
    this.isLoading = false;
    if (data == undefined) {
      this.dataSource.data = [];
      this.noData = 'No Data Found';
    } else {
      console.log(data);
      const ELEMENT_DATA = data;
      this.invoiceClientData = data;
      ELEMENT_DATA.forEach(item => item.selected = false);
      // this.dataSource = ELEMENT_DATA;
      this.dataSource.data = ELEMENT_DATA;
      this.dataSource.sort = this.sort;
      // this.showLoader = false;
    }
  }

  // showInvoicePdf(value)
  // {
  //  this.subscription.getSingleInvoiceData(value.id).subscribe(
  //    data=>this.getSingleResponseInvoicePdf(data)
  //  )
  // this.showPdfInvoice=true;
  // }
  openInvoice(data, value, state) {
    if (this.isLoading) {
      return
    }
    this.invoiceSub = value;
    this.invoiceSubscription = 'true';
    this.eventService.sidebarData(value);
    // this.subscriptionValue = value
    // this.subInjectService.rightSideData(state);
    this.subInjectService.addSingleProfile(data);
    // const fragmentData = {
    //   flag: value,
    //   data:data,
    //   id: 1,
    //   state: 'open'
    // };
    // const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
    //   sideBarData => {
    //     console.log('this is sidebardata in subs subs : ', sideBarData);
    //     this.dataTOget = sideBarData;

    //     if (UtilService.isDialogClose(sideBarData)) {
    //       console.log('this is sidebardata in subs subs 2: ', sideBarData);
    //       rightSideDataSub.unsubscribe();
    //       this.getSummaryDataAdvisor();
    //     }
    //   }
    // );
  }

  getSingleResponseInvoicePdf(data) {
    this.singleInvoiceData = data;
  }

  selectAll(event) {
    // const checked = event.target.checked;
    // this.dataSource.forEach(item => item.selected = 'checked');
    this.dataCount = 0;
    if (this.dataSource != undefined) {
      this.dataSource.filteredData.forEach(item => {
        item.selected = event.checked;
        if (item.selected) {
          this.dataCount++;
        }
      });
    }
  }

  changeSelect() {
    this.dataCount = 0;
    this.dataSource.filteredData.forEach(item => {
      console.log('item item ', item);
      if (item.selected) {
        this.dataCount++;
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.dataSource != undefined) {
      return this.dataCount === this.dataSource.filteredData.length;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selectAll({ checked: false }) : this.selectAll({ checked: true });
  }

  display(data) {
    console.log(data);
    this.ngOnInit();
  }

  showFilters(showFilter) {
    if (showFilter == true) {
      this.showFilter = false;
    } else {
      this.showFilter = true;
    }
    console.log('this.filterStatus: ', this.filterStatus);
    console.log('this.filterDate: ', this.filterDate);

  }

  addFilters(addFilters) {
    console.log('addFilters', addFilters);
    if (!_.includes(this.filterStatus, addFilters)) {
      this.filterStatus.push(addFilters);
    } else {
      // _.remove(this.filterStatus, this.senddataTo);
    }
  }

  filterSubscriptionRes(data) {
    console.log('filterSubscriptionRes', data);
    this.dataSource.data = data;
    // this.getSubSummaryRes(data);
  }

  addFiltersDate(dateFilter) {
    console.log('addFilters', dateFilter);
    // this.filterDate = [dateFilter];
    this.filterDate.push(dateFilter);
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);

    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate);

    this.selectedDateRange = { begin: beginDate, end: endDate };
  }

  removeDate(item) {
    this.filterDate.splice(item, 1);

  }

  remove(item) {
    this.filterStatus.splice(item, 1);
  }

  formatter(data) {
    data = Math.round(data);
    return data;
  }

  deleteModal(value) {
    this.list = [];
    this.dataSource.filteredData.forEach(singleElement => {
      if (singleElement.selected) {
        this.list.push(singleElement.id);
      }
    });
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.subscription.deleteInvoices(this.list).subscribe(
          data => {
            this.dataCount = 0;
            this.eventService.openSnackBar('invoice deleted successfully.', 'dismiss');
            dialogRef.close();
            this.getInvoiceSubData();
          },
          err => this.eventService.openSnackBar(err)
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
}
