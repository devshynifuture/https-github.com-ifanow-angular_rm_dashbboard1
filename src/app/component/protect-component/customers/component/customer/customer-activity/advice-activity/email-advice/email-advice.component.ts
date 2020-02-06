import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-advice',
  templateUrl: './email-advice.component.html',
  styleUrls: ['./email-advice.component.scss']
})
export class EmailAdviceComponent implements OnInit {
  groupId: any;

  constructor(private eventService: EventService, private subInjectService: SubscriptionInject, private cusService: CustomerService, private route: Router) { }

  ngOnInit() {
  }
  OpenProceedConsent() {
    const fragmentData = {
      flag: 'plan',
      id: 1,
      direction: 'top',
      // componentName: AdviceConsentReportComponent,
      state: 'open',
      Name: 'plan-upper-slider'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        console.log(upperSliderData, 'show what happens');

        if (UtilService.isDialogClose(upperSliderData)) {
          if (UtilService.isRefreshRequired(upperSliderData)) {
          }
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }
  sendEmail() {
    let obj = [1];
    this.cusService.generateGroupId(obj).subscribe(
      data => {
        this.groupId = data
        this.route.navigate(['/cus/email-consent'], { queryParams: { gropID: data } });
        this.close(false)
      }
    )
  }
  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
