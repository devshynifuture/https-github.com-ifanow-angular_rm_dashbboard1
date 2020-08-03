import { EventService } from './../../../../../Data-service/event.service';
import { BackofficeFolioMappingService } from './bckoffice-folio-mapping.service';
import { AuthService } from './../../../../../auth-service/authService';
import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-backoffice-folio-mapping',
  templateUrl: './backoffice-folio-mapping.component.html',
  styleUrls: ['./backoffice-folio-mapping.component.scss']
})
export class BackofficeFolioMappingComponent implements OnInit {
  displayedColumns: string[] = ['checkBoxIcon', 'schemeName', 'number', 'investName'];
  dataSource = ELEMENT_DATA;
  tableEl: any;
  hasEndReached: boolean;
  infiniteScrollingFlag: boolean;
  finalUnmappedList: any = [];
  advisorId: string;
  isLoading: boolean = false;
  unmappedDataSource: any;
  unmappedTableSort;

  constructor(
    private backOfcFolioMapService: BackofficeFolioMappingService,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.initPoint();
  }

  initPoint(): void {
    this.advisorId = AuthService.getAdvisorId();
    this.getMutualFundFolioList(0);
  }

  onWindowScroll(e: any): void {
    if (this.tableEl._elementRef.nativeElement.querySelector('tbody').querySelector('tr:last-child').offsetTop <= (e.target.scrollTop + e.target.offsetHeight + 200)) {
      if (!this.hasEndReached) {
        this.infiniteScrollingFlag = true;
        this.hasEndReached = true;
        this.getMutualFundFolioList(this.finalUnmappedList.length);
        // this.getClientList(this.finalUnmappedList[this.finalClientList.length - 1].clientId)
      }
    }
  }

  getMutualFundFolioList(offset: number): void {
    const data = {
      advisorId: this.advisorId,
      offset,
      limit: 300
    }

    this.backOfcFolioMapService.getMutualFundUnmapFolio(data)
      .subscribe(res => {
        if (res) {
          (this.finalUnmappedList.length > 0) ? '' : this.isLoading = false;

          this.finalUnmappedList = this.finalUnmappedList.concat(res);
          this.unmappedDataSource.data = this.finalUnmappedList;
          this.unmappedDataSource.sort = this.unmappedTableSort;
          this.hasEndReached = false;
          this.infiniteScrollingFlag = false;
        } else {
          this.eventService.openSnackBar("No Data Found !", "DISMISS")
        }
      })
  }

}


export interface PeriodicElement {
  checkBoxIcon: string;
  schemeName: string;
  number: string;
  investName: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { checkBoxIcon: '', schemeName: 'ICICI Prudential Long Term Equity Fund (Tax Saving) - Growth', number: 'K126860', investName: 'Rahul jain' },
  { checkBoxIcon: '', schemeName: 'Tata Hybrid Equity Fund Regular Plan- Monthly Dividend Option ', number: 'K126860', investName: 'Devshyani Jadhav' },
  { checkBoxIcon: '', schemeName: 'ICICI Prudential Long Term Equity Fund (Tax Saving) - Growth', number: 'K126860', investName: 'Rahul jain' },
  { checkBoxIcon: '', schemeName: 'Tata Hybrid Equity Fund Regular Plan- Monthly Dividend Option ', number: 'K126860', investName: 'Devshyani Jadhav' },
  { checkBoxIcon: '', schemeName: 'ICICI Prudential Long Term Equity Fund (Tax Saving) - Growth', number: 'K126860', investName: 'Rahul jain' },
  { checkBoxIcon: '', schemeName: 'Tata Hybrid Equity Fund Regular Plan- Monthly Dividend Option ', number: 'K126860', investName: 'Devshyani Jadhav' },
  { checkBoxIcon: '', schemeName: 'ICICI Prudential Long Term Equity Fund (Tax Saving) - Growth', number: 'K126860', investName: 'Rahul jain' },
  { checkBoxIcon: '', schemeName: 'Tata Hybrid Equity Fund Regular Plan- Monthly Dividend Option ', number: 'K126860', investName: 'Devshyani Jadhav' },

];