import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {SubscriptionInject} from '../../subscription-inject.service';
import {SubscriptionService} from '../../subscription.service';
import {EventService} from 'src/app/Data-service/event.service';
import {AuthService} from "../../../../../../auth-service/authService";
import {UtilService} from 'src/app/services/util.service';
import * as _ from 'lodash';
import {DatePipe} from '@angular/common';
import {MAT_DATE_FORMATS} from 'saturn-datepicker';
import {MY_FORMATS2} from 'src/app/constants/date-format.constant';
import {AddQuotationComponent} from '../common-subscription-component/add-quotation/add-quotation.component';
import {CommonFroalaComponent} from '../common-subscription-component/common-froala/common-froala.component';

export interface PeriodicElement {
  name: string;
  docname: string;
  plan: string;

  cdate: string;
  sdate: string;
  clientsign: string;
  status: string;
}

@Component({
  selector: 'app-quotations-subscription',
  templateUrl: './quotations-subscription.component.html',
  styleUrls: ['./quotations-subscription.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },
    // { provide: MAT_DATE_LOCALE, useValue: 'en' },
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class QuotationsSubscriptionComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['checkbox','name', 'docname', 'plan', 'cdate', 'sdate', 'clientsign', 'status', 'icons'];
  advisorId;
  maxDate = new Date();
  noData: string;
  isLoading = false;

  filterStatus = [];
  filterDate = [];
  statusIdList = [];
  filterDataArr = [];
  selectedStatusFilter: any = 'statusFilter';
  selectedDateFilter: any = 'dateFilter';
  lastFilterDataId;
  statusIdLength = 0;
  showFilter = false;
  selectedDateRange: { begin: Date; end: Date; };

  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  list: any[];


  getData: any = '';
  scrollCallData = true;
  scrollPosition;
  lastDataId;
  tableData = [];


  chips = [
    { name: 'LIVE', value: 1 },
    { name: 'PAID', value: 2 },
    { name: 'OVERDUE', value: 3 }
  ];
  dateChips = [
    { name: 'Created date', value: 1 },
    { name: 'Sent date', value: 2 },
    { name: 'Client consent', value: 3 }
  ];
  dataCount: number;


  constructor(public eventService: EventService, public subInjectService: SubscriptionInject,
    public dialog: MatDialog, private subService: SubscriptionService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    //this.dataSource = [{}, {}, {}];
    this.advisorId = AuthService.getAdvisorId();
    this.getQuotationsData(false);
    this.dataCount = 0;
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
  selectAll(event) {
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
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.dataSource != undefined) {
      return this.dataCount === this.dataSource.filteredData.length;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selectAll({checked: false}) : this.selectAll({checked: true});
  }
  scrollCall(scrollLoader) {
    const uisubs = document.getElementById('ui-subs');
    const wrapper = document.getElementById('wrapper');

    const contentheight = wrapper.offsetHeight;
    const yoffset = uisubs.scrollTop;
    const y = yoffset + window.innerHeight;
    // console.log(y >= contentheight && this.getData != undefined && this.scrollCallData, this.scrollCallData, "this.scrollCallData 123");
    console.log(this.getData != undefined, this.scrollCallData, '|| this.statusIdList.length > 0');

    if ((y >= contentheight && this.getData != undefined && this.scrollCallData)) {
      this.scrollCallData = false;
      if (this.scrollPosition == undefined) {
        this.scrollPosition = contentheight - yoffset;
      } else if (this.scrollPosition < contentheight) {
        this.scrollPosition = contentheight - window.innerHeight;
      }

      console.log(this.scrollPosition, 'this.scrollPosition 123');


      if (this.statusIdList.length <= 0) {

        this.getQuotationsData(scrollLoader);
      } else {
        // this.callFilter(scrollLoader);
      }

    }
  }

  orgValueChange(selectedDateRange) {

    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);

    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate)
    this.selectedDateRange = { begin: selectedDateRange.begin, end: selectedDateRange.end };
    this.getQuotationsData(false)
  }

  getQuotationsData(scrollLoader) {
    const obj = {
      // advisorId: 12345
      advisorId: this.advisorId,
      quotaionFlag: (this.filterDate.length == 0) ? 1 : 2,
      fromDate: (this.filterDate.length > 0) ? this.datePipe.transform(this.selectedDateRange.begin, 'yyyy-MM-dd') : null,
      toDate: (this.filterDate.length > 0) ? this.datePipe.transform(this.selectedDateRange.end, 'yyyy-MM-dd') : null,
      dateType: (this.filterDate.length == 0) ? 0 : this.filterDate,
    };

    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    this.subService.getSubscriptionQuotationData(obj).subscribe(
      data => this.getQuotationsDataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }


  getQuotationsDataResponse(data) {
    this.isLoading = false;
    if (data && data.length > 0) {
      this.data = data;
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      //  this.noData = "No Data Found";
    } else {

      this.data = [];
      this.dataSource.data = data;
      // console.log(data);
      this.dataSource.data = []
      this.noData = 'No Data Found';

      // console.log(data);
      // this.dataSource = data;
      // this.dataSource = new MatTableDataSource(data);
      //this.dataSource.sort = this.sort;
    }
  }

  deleteModal(data) {
    let list = [];
    if(data == null){
      this.dataSource.filteredData.forEach(singleElement => {
        if (singleElement.selected) {
          list.push(singleElement.documentRepositoryId);
        }
      });
    }
    else{
      [data.documentRepositoryId]
    }
    const dialogData = {
      data: 'DOCUMENT',
      header: 'DELETE',
      body: 'Are you sure you want to delete the document?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.subService.deleteSettingsDocument(list).subscribe(
          data => {
            this.eventService.openSnackBar('document is deleted', 'dismiss');
            // this.valueChange.emit('close');
            dialogRef.close();
            // this.getRealEstate();
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
      if(result!=undefined){
      this.getQuotationsData(false);
      }
    });

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
      this.getQuotationsData(false)
    } else {
      // _.remove(this.filterStatus, this.senddataTo);
    }
  }



  filterSubscriptionRes(data) {
    console.log('filterSubscriptionRes', data);
    this.dataSource = data;
    // this.getSubSummaryRes(data);
  }

  addFiltersDate(dateFilter) {
    console.log('addFilters', dateFilter);
    if (this.filterDate.length >= 1) {
      this.filterDate = []
    }
    this.filterDate.push((dateFilter == "1: Object") ? 1 : (dateFilter == "2: Object") ? 2 : 3);
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);

    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate);

    this.selectedDateRange = { begin: beginDate, end: endDate };
  }

  openPopup(data) {
    const Fragmentdata = {
      flag: data,
    };
    const dialogRef = this.dialog.open(AddQuotationComponent, {
      width: '50%',
      data: Fragmentdata,
      autoFocus: false,

    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  removeDate(item) {
    this.filterDate.splice(item, 1);
    this.getQuotationsData(false)

  }

  remove(item) {
    this.filterStatus.splice(item, 1);
  }

  Open(value, data) {
    if (this.isLoading) {
      return;
    }
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: CommonFroalaComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isRefreshRequired(sideBarData)) {
          this.getQuotationsData(false);
          console.log('this is sidebardata in subs subs 2: ');
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  // Open(value)
  // {
  //   this.subInjectService.rightSideData(value);
  // }
}
