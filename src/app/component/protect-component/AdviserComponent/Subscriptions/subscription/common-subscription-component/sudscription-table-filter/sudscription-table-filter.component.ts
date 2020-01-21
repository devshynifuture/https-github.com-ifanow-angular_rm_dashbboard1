import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UtilService} from '../../../../../../../services/util.service';

@Component({
  selector: 'app-sudscription-table-filter',
  templateUrl: './sudscription-table-filter.component.html',
  styleUrls: ['./sudscription-table-filter.component.scss']
})
export class SudscriptionTableFilterComponent implements OnInit {
  dataSource = {
    data: [{}, {}, {}]
  };
  @Input() dataToFilter: any
  @Output() filterRes = new EventEmitter();
  showFilter: boolean = false;
  selectedStatusFilter: any = 'statusFilter';
  selectedDateFilter: any = 'dateFilter';
  chipStatus: any;
  chipDate: any;
  filterDataArr = [];
  filterStatus = [];
  filterJson = {
    dateFilterJson: {},
    dateFilterArr: [],
    statusFilterJson: []
  }
  filterDate: any = []
  onlyDateFilter:boolean = false;
  ngOnInit() {
    this.chipStatus = this.dataToFilter.statusFilter;
    this.chipDate = this.dataToFilter.dateFilter;
    if(this.dataToFilter.filterQuotation != undefined){
      this.onlyDateFilter = this.dataToFilter.filterQuotation
    }
    console.log(this.dataToFilter, this.chipStatus, this.chipDate, " dataToFilter 123 ");
  }
  

  showFilters(showFilter) {
    if (showFilter == true) {
      this.showFilter = false;
    } else {
      this.showFilter = true;
    }
    // console.log('this.filterStatus: ', this.filterStatus);
    // console.log('this.filterDate: ', this.filterDate);

  }

  addFilters(addFilters) {

    console.log('addFilters', addFilters);
    // !_.includes(this.filterStatus, addFilters)
    if (this.filterStatus.find(element => element.name == addFilters.name) == undefined) {
      // this.lastFilterDataId = 0;
      this.filterStatus.push(addFilters);
      this.filterDataArr = [];
      console.log(this.filterStatus);
    } else {
      // this.lastFilterDataId = 0;
      // _.remove(this.filterStatus, this.senddataTo);
    }
    this.filterJson.statusFilterJson = this.filterStatus;
    console.log(this.filterStatus, 'this.filterStatus 123');
    this.filterRes.emit(this.filterJson);
    // this.callFilter(false);
  }

  selectedDateRange= {};

  orgValueChange(selectedDateRange) {
    // const beginDate = new Date();
    // beginDate.setMonth(beginDate.getMonth() - 1);
    // UtilService.getStartOfTheDay(beginDate);

    // const endDate = new Date();
    // UtilService.getStartOfTheDay(endDate);
     
    this.filterJson.dateFilterJson = {begin: selectedDateRange.begin, end: selectedDateRange.end};
    this.filterRes.emit(this.filterJson);
  selectedDateRange = {};

  
  }

  addFiltersDate(dateFilter) {
    this.filterDate = [];

    if (this.filterDate.length >= 1) {
      this.filterDate = [];
    }
    this.filterDataArr = [];
    // this.lastFilterDataId = 0;
    this.filterDate.push((dateFilter == '1: Object') ? 1 : (dateFilter == '2: Object') ? 2 : 3);
    console.log(this.selectedDateFilter, 'addFilters', dateFilter);
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);

    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate);

    this.selectedDateRange = {begin: beginDate, end: endDate};
    console.log(this.filterDate, 'this.filterDate 123');
    // this.callFilter(false);
    this.filterJson.dateFilterJson = this.selectedDateRange;
    this.filterJson.dateFilterArr = this.filterDate;
    this.filterRes.emit(this.filterJson);
  }

  removeDate(item) {
    console.log(this.filterDate, 'this.filterDate 123 r');
    // this.dataSource.data = [{}, {}, {}];
    this.selectedDateFilter = 'dateFilter';
    this.filterDate.splice(item, 1);
    // this.lastFilterDataId = 0;
    // this.callFilter(false);
    this.filterRes.emit(this.filterJson);

  }

  remove(item) {
    console.log(item, 'item123');
    // this.dataSource.data = [{}, {}, {}];
    if (this.filterStatus[item].name == this.selectedStatusFilter.name) {
      this.selectedStatusFilter = 'statusFilter';
    }

    this.filterStatus.splice(item, 1);
    this.filterDataArr = this.filterDataArr.filter((x) => {
      x.status != item.value;
    });
    // this.lastFilterDataId = 0;
    // this.callFilter(false);
    this.filterRes.emit(this.filterJson);

  }

  onClose(event) {
    console.log('SudscriptionTableFilterComponent onClose event : ', event);
  }


}

// @Component({
//   selector: 'app-sudscription-table-filter',
//   templateUrl: './set-date-footer.html',
//   styleUrls: ['./sudscription-table-filter.component.scss']
// })
// export class SetDateFooter {
//   private destroyed = new Subject<void>();
//   constructor(
//     private calendar: SatCalendar<Date>,
//     cdr: ChangeDetectorRef
// ) {
//     calendar.stateChanges
//         .pipe(takeUntil(this.destroyed))
//         .subscribe(() => cdr.markForCheck())

//         console.log(this.calendar.beginDate, this.calendar.endDate, "footer date data");
        
// }

// }
