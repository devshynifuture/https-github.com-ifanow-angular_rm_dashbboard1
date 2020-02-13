import { Component, OnInit } from '@angular/core';
import { ReconciliationDetailsViewComponent } from '../reconciliation-details-view/reconciliation-details-view.component';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-upper-slider-backoffice',
  templateUrl: './upper-slider-backoffice.component.html',
  styleUrls: ['./upper-slider-backoffice.component.scss']
})
export class UpperSliderBackofficeComponent implements OnInit {

  displayedColumns: string[] = ['doneOne', 'totalfolios', 'before_recon', 'after_recon', 'aum_balance', 'transaction', 'export_folios'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = ['name', 'folioNumber', 'unitsIfnow', 'unitsRta', 'difference', 'transactions'];
  dataSource1 = ELEMENT_DATA1;

  displayedColumns3: string[] = ['foliosOrdered', 'file_order', 'file_status', 'id', 'trx_file', 'trx_added', 'file_name', 'download'];
  dataSource3 = ELEMENT_DATA3;



  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }

  openReconciliationDetails(value, data) {
    const fragmentData = {
      flag: value,
      data,
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

export interface PeriodicElement {
  doneOne: string;
  totalfolios: string;
  before_recon: string;
  after_recon: string;
  aum_balance: string;
  transaction: string;
  export_folios: string;

}
const ELEMENT_DATA: PeriodicElement[] = [
  { doneOne: '08/01/20 11:28AM', totalfolios: '890', before_recon: '14', after_recon: '0', aum_balance: '07/01/2020', transaction: '08/01/2020', export_folios: ' ' },
];



export interface PeriodicElement1 {
  name: string;
  folioNumber: string;
  unitsIfnow: string;
  unitsRta: string;
  difference: string;
  transactions: string;


}
const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'IIFL Dividend Opportunities Index Fund - Growth', folioNumber: '7716853/43	', unitsIfnow: '0', unitsRta: '463.820', difference: '463.82', transactions: ' ' },
];



export interface PeriodicElement3 {
  foliosOrdered: string;
  file_order: string;
  file_status: string;
  id: string;
  trx_file: string;
  trx_added: string;
  file_name: string;
  download: string;

}
const ELEMENT_DATA3: PeriodicElement3[] = [
  { foliosOrdered: 'IIFL Dividend Opportunities Index Fund - Growth', file_order: '7716853/43	', file_status: '0', id: '463.820', trx_file: '463.82', trx_added: ' ', file_name: '', download: '' },
];