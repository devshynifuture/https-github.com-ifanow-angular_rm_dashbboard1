import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { ReconciliationService } from '../reconciliation/reconciliation.service';

@Component({
  selector: 'app-folio-master-detail-view',
  templateUrl: './folio-master-detail-view.component.html',
  styleUrls: ['./folio-master-detail-view.component.scss']
})
export class FolioMasterDetailViewComponent implements OnInit {
  folioDetailData: any;
  folioNomineesPresent: boolean = false;

  constructor(
    private subsInjectService: SubscriptionInject,
    private reconService: ReconciliationService
  ) { }

  data;
  canShowData: boolean = false;
  isLoading: boolean = false;

  ngOnInit() {
    this.getFolioMasterDetailList()
  }

  isFolioNomineesPresent() {
    this.folioNomineesPresent = this.folioDetailData && this.folioDetailData.nominees.length !== 0
  }

  getFolioMasterDetailList() {
    const data = {
      mutualFundId: this.data.mutualFundId
    };
    this.reconService.getMutualFundFolioMasterValues(data)
      .subscribe(res => {
        this.folioDetailData = res;
        this.canShowData = true;
      }, err => {
        console.error(err);
      })
  }

  close() {
    this.subsInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
