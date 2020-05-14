import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material';
import { LiabilitiesDetailComponent } from '../../../../common-component/liabilities-detail/liabilities-detail.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-loan-amorts',
  templateUrl: './loan-amorts.component.html',
  styleUrls: ['./loan-amorts.component.scss']
})
export class LoanAmortsComponent implements OnInit {
  _data: any;
  dataSource: any = new MatTableDataSource();
  @ViewChild('epfListTable', {static: false}) holdingsTableSort: MatSort;
  displayedColumns = ['no', 'date', 'bal', 'pay-time', 'pre-pay', 'total-pay', 'interest', 'principal', 'end-bal'];
  constructor(private subInjectService: SubscriptionInject, public util: UtilService) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    console.log('AddLiabilitiesComponent Input data : ', this._data);
    this.dataSource.data = this._data.loanAmorts;
    this.dataSource.sort = this.holdingsTableSort;
  }

  ngOnInit() {
  }

  close() {
    
    const fragmentData = {
      flag: "addLiabilitiesDetail",
      id: 1,
      data: this._data,
      state: 'open35',
      componentName: LiabilitiesDetailComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isRefreshRequired(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
        }
        rightSideDataSub.unsubscribe();
      }
    );
  }

}
