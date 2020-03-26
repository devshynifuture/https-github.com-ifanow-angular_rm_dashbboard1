import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ReconciliationDetailsViewComponent } from 'src/app/component/protect-component/SupportComponent/common-component/reconciliation-details-view/reconciliation-details-view.component';
import { UtilService } from 'src/app/services/util.service';
import { ReconciliationService } from '../reconciliation/reconciliation.service';

@Component({
  selector: 'app-duplicate-data',
  templateUrl: './duplicate-data.component.html',
  styleUrls: ['./duplicate-data.component.scss']
})
export class DuplicateDataComponent implements OnInit {
  brokerId: any;
  rtId: any;
  mutualFundTransactions: any;

  constructor(
    private subInjectService: SubscriptionInject,
    private reconService: ReconciliationService
  ) { }

  advisorId = AuthService.getAdvisorId();

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['arnRia', 'name', 'folioNumber', 'unitsIfanow', 'unitsRta', 'difference', 'transactions'];
  dataSource;
  isLoading: boolean = false;
  aumList: [] = [];
  duplicateDataList: DuplicateI[] = [];
  ngOnInit() {
    this.dataSource = new MatTableDataSource<DuplicateI>(ELEMENT_DATA);
    this.dataSource.sort = this.sort;

    this.duplicateFolioData();
  }

  openReconciliationDetails(value, data, tableType) {
    let tableData = [];
    if (this.mutualFundTransactions) {
      tableData = this.mutualFundTransactions;

      console.log("this is what i am sending", this.mutualFundTransactions);
    }
    const fragmentData = {
      flag: value,
      data: { ...data, tableType, brokerId: this.brokerId, tableData },
      id: 1,
      state: 'open',
      componentName: ReconciliationDetailsViewComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  duplicateFolioData() {
    this.isLoading = true;
    const data = {
      advisorId: this.advisorId,
    }
    this.reconService.getDuplicateDataValues(data)
      .subscribe(res => {
        if (res) {
          console.log("this is duplicate data values:::::::", res);

          res.forEach(item => {
            this.brokerId = item.brokerId;
            this.mutualFundTransactions = item.mutualFundTransactions;
            this.duplicateDataList.push({
              arnRia: item.brokerCode,
              name: item.schemeName,
              folioNumber: item.folioNumber,
              unitsIfanow: item.balanceUnit,
              unitsRta: item.aumUnits,
              difference: String(parseInt(item.balanceUnit.toFixed(3)) - parseInt(item.aumUnits.toFixed(3))),
              transactions: '',
              date: item.aumDate,
            })
          });
          console.log(this.duplicateDataList);
          this.dataSource.data = this.duplicateDataList;
          this.isLoading = false;
        } else {
          this.dataSource.data = null;
        }
      })
  }

}

export interface DuplicateI {
  arnRia: string;
  name: string;
  folioNumber: string;
  unitsIfanow: string;
  unitsRta: string;
  difference: string;
  transactions: string;
  date: string;
}

export const ELEMENT_DATA: DuplicateI[] = [
  { arnRia: '', name: '', folioNumber: '', unitsIfanow: '', unitsRta: '', difference: '', transactions: '', date: '' },
  { arnRia: '', name: '', folioNumber: '', unitsIfanow: '', unitsRta: '', difference: '', transactions: '', date: '' },
  { arnRia: '', name: '', folioNumber: '', unitsIfanow: '', unitsRta: '', difference: '', transactions: '', date: '' },
] 