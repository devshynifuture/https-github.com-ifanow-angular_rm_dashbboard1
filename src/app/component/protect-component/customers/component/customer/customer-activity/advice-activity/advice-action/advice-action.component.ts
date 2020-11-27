import { Component, OnInit, Input } from '@angular/core';
import { EmailAdviceComponent } from '../email-advice/email-advice.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { DatePipe } from '@angular/common';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-advice-action',
  templateUrl: './advice-action.component.html',
  styleUrls: ['./advice-action.component.scss']
})
export class AdviceActionComponent implements OnInit {
  selectedAssetData: any;

  constructor(private eventService: EventService, private datePipe: DatePipe, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
  @Input() set data(data) {
    console.log(data)
    this.selectedAssetData = data;
  }
  ngOnInit() {
  }
  openConsentDialog(data) {
    console.log(this.selectedAssetData)
    const fragmentData = {
      flag: 'consent',
      data: {},
      id: 1,
      state: 'open',
      componentName: EmailAdviceComponent
    };
    fragmentData.data = {
      selectedAssetData: this.selectedAssetData,
      flagData: data
    }
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
  sendBypassConsent() {
    let obj = [];
    this.selectedAssetData.forEach(element => {
      obj.push(
        {
          id: element.id,
          acceptedOrDeclined: 1,
          actionPerformed: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          advice: { "adviceToCategoryTypeMasterId": element.adviceToCategoryTypeMasterId }
        })
    });
    this.cusService.updateAssetConsent(obj).subscribe(
      data => this.getResponse(data), (error) => {
      }
    );
  }
  getResponse(data) {
    console.log(data);
    this.eventService.openSnackBar("Consent sent successfully", "Dismiss")
  }

}
