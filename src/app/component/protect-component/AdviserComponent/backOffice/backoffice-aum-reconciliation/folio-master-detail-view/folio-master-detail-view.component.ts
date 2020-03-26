import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { ReconciliationService } from '../reconciliation/reconciliation.service';

@Component({
  selector: 'app-folio-master-detail-view',
  templateUrl: './folio-master-detail-view.component.html',
  styleUrls: ['./folio-master-detail-view.component.scss']
})
export class FolioMasterDetailViewComponent implements OnInit {

  constructor(
    private subsInjectService: SubscriptionInject,
    private reconService: ReconciliationService
  ) { }

  ngOnInit() {
    this.getFolioMasterDetailList()
  }

  getFolioMasterDetailList() {
    const data = {

    };
    this.reconService.getMutualFundFolioMasterValues(data)
      .subscribe(res => {
        console.log(res)
      }, err => {
        console.error(err);
      })
  }

  close() {
    this.subsInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
