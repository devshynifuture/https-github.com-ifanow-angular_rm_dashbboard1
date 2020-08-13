import { SelectionModel } from '@angular/cdk/collections';
import { EventService } from './../../../../../../Data-service/event.service';
import { BackOfficeService } from 'src/app/component/protect-component/AdviserComponent/backOffice/back-office.service';
import { AuthService } from './../../../../../../auth-service/authService';
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { RecordDetailsComponent } from './record-details/record-details.component';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-sip-cleanup',
  templateUrl: './sip-cleanup.component.html',
  styleUrls: ['./sip-cleanup.component.scss']
})
export class SipCleanupComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'tra', 'action', 'menu'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  arnRiaDetailsIdFilter: any;
  markedUnmarkStatusFilter: any;
  constructor(
    private subInjectService: SubscriptionInject,
    private eventService:EventService,
    private backOfficeService: BackOfficeService    
  ) { }
  activeCeasedAllFilter;
  advisorId = AuthService.getAdvisorId();

  isLoading = false;

  selection = new SelectionModel<PeriodicElement>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  ngOnInit() {
    this.initPoint();
  }

  initPoint(){
    this.getSipCleanUpList(false);
  }

  getSipCleanUpList(byFilter){
    let data;
    if(byFilter){
      data = {
        advisorId: this.advisorId,
        arnRiaDetailsId: this.arnRiaDetailsIdFilter,
        markedStatus: this.markedUnmarkStatusFilter,
        activeStatus: this.activeCeasedAllFilter
      }
    } else {
      data = {
        advisorId: this.advisorId,
        arnRiaDetailsId: -1,
        markedStatus: 0,
        activeStatus: -1
      }
    }
     
    this.isLoading = true;
    this.backOfficeService.getSipCleanUpListData(data)
      .subscribe(res=>{
        this.isLoading = false;
        if(res){
          console.log("this is backoffice sip cleanup data",res);
          this.dataSource.data = res;
        }
      }, err => console.error(err))
  }
  
  openRecordDeatils() {

    const fragmentData = {
      id: 1,
      state: 'open35',
      componentName: RecordDetailsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  tra: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'HDFC Prudence Fund - Growth	 / 9878787/90', name: 'Rahul Jain',
    weight: 'SIP / ₹12,000', symbol: '23-04-20 / 15-06-20 / 15-06-99', tra: '5437372732'
  },

];
