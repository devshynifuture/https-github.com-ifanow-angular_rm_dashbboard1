import { Component, OnInit, ViewChild } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { BackOfficeService } from '../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-customise-setting',
  templateUrl: './customise-setting.component.html',
  styleUrls: ['./customise-setting.component.scss']
})
export class CustomiseSettingComponent implements OnInit {
  displayedColumns: string[] = ['name', 'mfoverview', 'mfsummary', 'mftransaction', 'mfunrealised', 'mfcapitalgain', 'mfcapitalgaindetailed'];
  data: Array<any> = [{}, {}, {}];
  @ViewChild('tableEl', { static: false }) tableEl;
  dataSource = new MatTableDataSource(this.data);
  isLoading: boolean = false;
  saveSettingMfClients: any;
  hasEndReached: boolean = false;
  infiniteScrollingFlag: boolean;
  advisorId: any;
  overviewAll: any;
  summaryAll: any;
  transactionAll: any;
  unrealisedAll: any;
  capitalGainDetailedAll: any;
  capitalGainAll: any;
  saveEvent: any;
  reportType: any;
  count: number;
  countSummary: number;
  countTrasact: number;
  countunre: number;
  countCap: number;
  countCapDetail: number;
  constructor(
    private eventService: EventService,
    private backOffice: BackOfficeService
  ) {
    this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
    this.isLoading = false
    this.hasEndReached = true;
    this.dataSource.data = [{}, {}, {}];
    this.saveSettingMfClients = []
    this.getMutualFundClient(0)
    this.overviewAll = false
    this.summaryAll = false
    this.transactionAll = false
    this.unrealisedAll = false
    this.capitalGainDetailedAll = false
    this.capitalGainAll = false
  }
  onWindowScroll(e: any) {
    if (this.tableEl._elementRef.nativeElement.querySelector('tbody').querySelector('tr:last-child').offsetTop <= (e.target.scrollTop + e.target.offsetHeight + 200)) {
      if (!this.hasEndReached) {
        this.infiniteScrollingFlag = true;
        this.hasEndReached = true;
        this.getMutualFundClient(this.dataSource.data.length);
        // this.getClientList(this.finalClientList[this.finalClientList.length - 1].clientId)
      }

    }
  }
  selectReportAll(event, reportType) {

    let obj = {
      advisorId: this.advisorId,
      reportTypeId: reportType,
      selected: event.checked
    }
    console.log(obj)
    this.backOffice.saveSettingAll(obj).subscribe(
      data => this.saveSettingAllRes(data, event, reportType)
    );
  }
  saveSettingAllRes(data, event, reportType) {
    this.getMutualFundClient(0)
    this.saveEvent = event
    this.reportType = reportType
    if (reportType == 1) {
      this.overviewAll = event.checked
    } else if (reportType == 2) {
      this.summaryAll = event.checked
    } else if (reportType == 3) {
      this.transactionAll = event.checked
    } else if (reportType == 4) {
      this.unrealisedAll = event.checked
    } else if (reportType == 5) {
      this.capitalGainAll = event.checked
    } else if (reportType == 6) {
      this.capitalGainDetailedAll = event.checked
    }
  }
  close() {
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  selectReport(event, element) {

    console.log('element', element)
    this.saveSettingMfClients.push(element)

    console.log('saveSettingMfClients', this.saveSettingMfClients)
    this.backOffice.saveSetting(element).subscribe(
      data => this.saveSettingRes(data)
    );
  }
  searchClient(event) {
    console.log('keypress', event)
    if (event.length >= 3) {
      const obj = {
        advisorId: AuthService.getAdvisorId(),
        search: true,
        searchName: event
      };
      this.backOffice.getMutualFundClientList(obj).subscribe(
        data => this.getMutualFundClientListRes(data)
      );
    }
  }
  getMutualFundClient(offset) {
    this.isLoading = true
    const obj = {
      advisorId: AuthService.getAdvisorId(),
      limit: 50,
      offset: offset
    };
    this.backOffice.getMutualFundClientList(obj).subscribe(
      data => this.getMutualFundClientListRes(data)
    );
  }
  getMutualFundClientListRes(data) {
    this.isLoading = false
    this.count = 0
    this.countSummary = 0
    this.countTrasact = 0
    this.countunre = 0
    this.countCap = 0
    this.countCapDetail = 0
    this.dataSource.data = data

    this.dataSource.data.forEach(element => {
      if (element.overview == true) {
        this.count++
        if (this.count > 0) {
          this.overviewAll = true
        }
      } if (element.summary == true) {
        this.countSummary++
        if (this.countSummary > 0) {
          this.summaryAll = true
        }
      } if (element.allTransaction == true) {
        this.countTrasact++
        if (this.countTrasact > 0) {
          this.transactionAll = true
        }
      } if (element.unrealizedTransaction == true) {
        this.countunre++
        if (this.countunre > 0) {
          this.unrealisedAll = true
        }
      } if (element.capitalGainSummary == true) {
        this.countCap++
        if (this.countCap > 0) {
          this.capitalGainAll = true
        }
      } if (element.capitalGainDetailed == true) {
        this.countCapDetail++
        if (this.countCapDetail > 0) {
          this.capitalGainDetailedAll = true
        }
      }
    });

    console.log('dataSource bulk email', data)
    this.infiniteScrollingFlag = false;
    this.hasEndReached = false;
  }
  saveSetting() {


  }
  saveSettingRes(data) {

  }
}

export interface PeriodicElement {
  name: string;
  mfoverview: string;
  mfsummary: string;
  mftransaction: string;
  mfunrealised: string;
  mfcapitalgain: string;
  mfcapitalgaindetailed: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Ronak hindocha', mfoverview: ' ', mfsummary: '', mftransaction: '', mfunrealised: '', mfcapitalgain: '', mfcapitalgaindetailed: '' },


];