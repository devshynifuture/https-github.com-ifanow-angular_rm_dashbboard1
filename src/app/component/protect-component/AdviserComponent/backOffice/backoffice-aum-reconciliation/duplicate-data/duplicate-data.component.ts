import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ReconciliationDetailsViewComponent } from 'src/app/component/protect-component/SupportComponent/common-component/reconciliation-details-view/reconciliation-details-view.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-duplicate-data',
  templateUrl: './duplicate-data.component.html',
  styleUrls: ['./duplicate-data.component.scss']
})
export class DuplicateDataComponent implements OnInit {

  constructor(
    private subInjectService: SubscriptionInject
  ) { }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['arnRia', 'schemeName', 'folioNumber', 'unitsIfanow', 'unitsRta', 'difference', 'transaction'];
  dataSource;
  isLoading: boolean = false;
  ngOnInit() {
    this.dataSource = new MatTableDataSource<DuplicateI>(ELEMENT_DATA);
    this.dataSource.sort = this.sort;
  }

  openReconciliationDetails(value, data, tableType) {
    const fragmentData = {
      flag: value,
      data: { ...data, tableType },
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

}

export interface DuplicateI {
  arnRia: string;
  schemeName: string;
  folioNumber: string;
  unitsIfanow: string;
  unitsRta: string;
  difference: string;
  transaction: string;
}

export const ELEMENT_DATA: DuplicateI[] = [
  { arnRia: 'string', schemeName: '3', folioNumber: 'string', unitsIfanow: 'string', unitsRta: 'string', difference: 'string', transaction: 'string', },
  { arnRia: 'a', schemeName: 'string', folioNumber: 'string', unitsIfanow: '45', unitsRta: 'string', difference: 'string', transaction: 'string', },
  { arnRia: 'string', schemeName: 'string', folioNumber: 'string', unitsIfanow: 'string', unitsRta: 'string', difference: 'string', transaction: 'string', },
  { arnRia: '36', schemeName: '643', folioNumber: 'string', unitsIfanow: '5', unitsRta: 'string', difference: 'string', transaction: 'string', }
] 