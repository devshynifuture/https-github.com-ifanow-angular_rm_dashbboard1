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
  isLoading: boolean=false;
  saveSettingMfClients: any;
  hasEndReached: boolean = false;
  infiniteScrollingFlag: boolean;
  constructor(
    private eventService: EventService,
    private backOffice: BackOfficeService
  ) { }

  ngOnInit() {
    this.isLoading = false
    this.hasEndReached = true;
    this.dataSource.data = [{}, {}, {}];
    this.saveSettingMfClients = []
    this.getMutualFundClient(0)
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
  close() {
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  selectReport(event,element) {
   
    console.log('element', element)
    this.saveSettingMfClients.push(element)

    console.log('saveSettingMfClients', this.saveSettingMfClients)
    this.backOffice.saveSetting(element).subscribe(
      data => this.saveSettingRes(data)
    );
  }
  searchClient(event){
    console.log('keypress',event)
    if(event.length >= 3){
      const obj = {
        advisorId: AuthService.getAdvisorId(),
        search:true,
        searchName : event
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
    this.dataSource = data
    console.log('dataSource bulk email', data)
    this.infiniteScrollingFlag = false;
    this.hasEndReached = false;
  }
  saveSetting() {
    
   
  }
  saveSettingRes(data){

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