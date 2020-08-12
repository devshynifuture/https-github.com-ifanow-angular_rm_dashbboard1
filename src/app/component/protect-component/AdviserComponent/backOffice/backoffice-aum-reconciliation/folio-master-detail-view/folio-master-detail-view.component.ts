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
    return this.folioDetailData && this.folioDetailData.hasOwnProperty('nominees') && this.folioDetailData.nominees.length !== 0
  }

  getFolioMasterDetailList() {
    const data = {
      mfId: this.data.mutualFundId
    };
    this.reconService.getMutualFundFolioMasterValues(data)
      .subscribe(res => {
        if(res){
          console.log("detail view folio master",res)
          this.folioDetailData = res[0];
          this.canShowData = true;
        } else {
          this.folioDetailData = null;
          this.canShowData = false
        }
      }, err => {
        console.error(err);
      })
  }

  close() {
    this.subsInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
