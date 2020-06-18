import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilService } from '../../../../../../../services/util.service';
import { SetDateFooter } from './set-date-footer.component'
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
@Component({
  selector: 'app-sudscription-table-filter',
  templateUrl: './sudscription-table-filter.component.html',
  styleUrls: ['./sudscription-table-filter.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
],
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
  onlyDateFilter: boolean = false;
  rangesFooter = SetDateFooter;

  // needs to set value ask anuirudh;
  maxDate = new Date();
  ngOnInit() {
    this.chipStatus = this.dataToFilter.statusFilter;
    this.chipDate = this.dataToFilter.dateFilter;
    if (this.dataToFilter.filterQuotation != undefined) {
      this.onlyDateFilter = this.dataToFilter.filterQuotation
    }

  }


  showFilters(showFilter) {
    if (showFilter == true) {
      this.showFilter = false;
    } else {
      this.showFilter = true;
    }

  }

  addFilters(addFilters) {

    // !_.includes(this.filterStatus, addFilters)
    if (this.filterStatus.find(element => element.name == addFilters.name) == undefined) {
      // this.lastFilterDataId = 0;
      this.filterStatus[0] = addFilters;
      this.filterDataArr = [];
    } else {

    }
    this.filterJson.statusFilterJson = this.filterStatus;
    this.filterRes.emit(this.filterJson);
  }

  selectedDateRange = {};

  orgValueChange(selectedDateRange) {

    this.filterJson.dateFilterJson = { begin: selectedDateRange.begin, end: selectedDateRange.end };
    this.filterRes.emit(this.filterJson);
    selectedDateRange = {};


  }

  addFiltersDate(dateFilter) {
    this.filterDate = [];

    if (this.filterDate.length >= 1) {
      this.filterDate = [];
    }
    this.filterDataArr = [];
    this.filterDate.push((dateFilter == '1: Object') ? 1 : (dateFilter == '2: Object') ? 2 : 3);
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);

    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate);

    this.selectedDateRange = { begin: beginDate, end: endDate };
    // this.callFilter(false);
    this.filterJson.dateFilterJson = this.selectedDateRange;
    this.filterJson.dateFilterArr = this.filterDate;
    this.filterRes.emit(this.filterJson);
  }

  removeDate(item) {
    this.selectedDateFilter = 'dateFilter';
    this.filterDate.splice(item, 1);

    this.filterRes.emit(this.filterJson);

  }

  remove(item) {
    if (this.filterStatus[item].name == this.selectedStatusFilter.name) {
      this.selectedStatusFilter = 'statusFilter';
    }

    this.filterStatus.splice(item, 1);
    this.filterDataArr = this.filterDataArr.filter((x) => {
      x.status != item.value;
    });

    this.filterRes.emit(this.filterJson);

  }

  onClose() {
    this.orgValueChange(this.selectedDateRange);
  }


}

