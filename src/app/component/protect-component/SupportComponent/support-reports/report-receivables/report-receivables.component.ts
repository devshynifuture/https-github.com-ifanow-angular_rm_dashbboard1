import { IfasDetailsComponent } from './../../my-ifas/ifas-details/ifas-details.component';
import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatTableDataSource } from '@angular/material';
import { OrderHistoricalFileComponent } from '../../order-historical-file/order-historical-file.component';
import { UtilService } from 'src/app/services/util.service';
import { SupportService } from '../../support.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-report-receivables',
  templateUrl: './report-receivables.component.html',
  styleUrls: ['./report-receivables.component.scss']
})
export class ReportReceivablesComponent implements OnInit {
  isLoading: boolean;

  sort: any;
  eventService: any;
  filterDate: string;

  constructor(
    private subInjectService: SubscriptionInject,
    private supportService: SupportService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.getMyIfasList();
  }

  dataSource = new MatTableDataSource<ReportReceivableI>(ELEMENT_DATA);

  displayedColumns: string[] = ['adminName', 'email', 'mobile', 'invoice', 'sentDate', 'dueDate', 'dueSince', 'amount', 'balance'];

  filterBy = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    this.isLoading = true;
    // if (value == '30') {
    //   var date = moment().subtract(30, 'days');
    //   this.filterDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    // } else if (value == '60') {
    //   var date = moment().subtract(60, 'days');
    //   this.filterDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    // } else if (value == '90') {
    //   var date = moment().subtract(90, 'days');
    //   this.filterDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    // }
    // var currentDate = new Date()
    // let obj = {
    //   advisorId: 0,
    //   dateFrom: this.filterDate,
    //   dateTill: this.datePipe.transform(currentDate, 'yyyy-MM-dd'),
    //   ascOrDescByBalance: 0
    // }

    let obj = {
      advisorName: value
    }
    // console.log(obj);
    this.supportService.getReportFilterData(obj)
      .subscribe(res => {
        if (res) {
          let tableArray = [];
          if (res) {
            this.isLoading = false;
            res.forEach(element => {
              tableArray.push({
                adminName: element.name,
                email: element.email_id,
                mobile: element.mobile_number,
                invoice: ELEMENT_DATA[1].invoice,
                sentDate: ELEMENT_DATA[1].sentDate,
                dueDate: ELEMENT_DATA[1].dueDate,
                dueSince: ELEMENT_DATA[1].dueSince,
                amount: ELEMENT_DATA[1].amount,
                balance: ELEMENT_DATA[1].balance,
                adminAdvisorId: element.admin_advisor_id
              })
            });
            this.dataSource.data = tableArray;
            this.dataSource.sort = this.sort;
          }
        }
      });
    console.log("this some event:::::::", event.value);

    // Add our filterBy
    if ((value || '').trim()) {
      this.filterBy.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(filterBy): void {
    const index = this.filterBy.indexOf(filterBy);

    if (index >= 0) {
      this.filterBy.splice(index, 1);
      this.getMyIfasList();
    }
  }

  getMyIfasList() {
    let obj = {};
    this.isLoading = true;
    this.supportService.getMyIFAValues(obj).subscribe(
      data => {
        console.log(data);
        if (data && data.length !== 0) {
          this.isLoading = false;
          let tableArray = [];
          data.forEach(element => {
            tableArray.push({
              adminName: element.name,
              email: element.email_id,
              mobile: element.mobile_number,
              invoice: ELEMENT_DATA[1].invoice,
              sentDate: ELEMENT_DATA[1].sentDate,
              dueDate: ELEMENT_DATA[1].dueDate,
              dueSince: ELEMENT_DATA[1].dueSince,
              amount: ELEMENT_DATA[1].amount,
              balance: ELEMENT_DATA[1].balance,
              adminAdvisorId: element.admin_advisor_id
            })
          });
          this.dataSource.data = tableArray;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource.data = null;
        }
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }

  openAdminDetails(data) {
    const fragmentData = {
      flag: 'ifaDetails',
      data,
      id: 1,
      state: 'open70',
      componentName: IfasDetailsComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
    // event.stopPropagation();
  }
}

export interface ReportReceivableI {
  adminName: string;
  email: string;
  mobile: string;
  invoice: string;
  sentDate: string;
  dueDate: string;
  dueSince: string;
  amount: string;
  balance: string;
}

const ELEMENT_DATA: ReportReceivableI[] = [
  { adminName: '', email: '', mobile: '', invoice: 'INV-00006989424', sentDate: '01/01/2020', dueDate: '02/01/2020', dueSince: 'last 10 days', amount: '2834', balance: '324' },
  { adminName: '', email: '', mobile: '', invoice: 'INV-00006989424', sentDate: '01/01/2020', dueDate: '02/01/2020', dueSince: 'last 10 days', amount: '2834', balance: '324' }
]