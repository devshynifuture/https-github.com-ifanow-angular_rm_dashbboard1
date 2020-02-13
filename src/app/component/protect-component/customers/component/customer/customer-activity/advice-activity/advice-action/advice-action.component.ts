import { Component, OnInit, Input } from '@angular/core';
import { EmailAdviceComponent } from '../email-advice/email-advice.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';

@Component({
  selector: 'app-advice-action',
  templateUrl: './advice-action.component.html',
  styleUrls: ['./advice-action.component.scss']
})
export class AdviceActionComponent implements OnInit {
  selectedAssetData: any;

  constructor(private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
  @Input() set data(data) {
    console.log(data)
    this.selectedAssetData = data;
  }
  ngOnInit() {
  }
  openConsentDialog(data) {
    console.log(this.selectedAssetData)
    const fragmentData = {
      flag: 'detailPoTd',
      data: this.selectedAssetData,
      id: 1,
      state: 'open',
      componentName: EmailAdviceComponent
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
