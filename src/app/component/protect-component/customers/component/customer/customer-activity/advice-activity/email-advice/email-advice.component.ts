import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-email-advice',
  templateUrl: './email-advice.component.html',
  styleUrls: ['./email-advice.component.scss']
})
export class EmailAdviceComponent implements OnInit {
  groupId: any;
  @ViewChild('tempRef', { static: true }) tempRef: ElementRef;
  @ViewChild('EmailIdTo', { static: true }) EmailIdToRef: ElementRef;
  @ViewChild('subBody', { static: true }) subBodyRef: ElementRef;
  selectedAssetId: any;
  constructor(private eventService: EventService, private subInjectService: SubscriptionInject, private cusService: CustomerService, private route: Router, private datePipe: DatePipe) { }
  @Input() set data(data) {
    this.selectedAssetId = data;
    console.log(this.selectedAssetId, "selected id")
  }
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
    let obj = this.selectedAssetId;
    this.cusService.generateGroupId(obj).subscribe(
      data => {
        this.groupId = data;
        let dateObj = new Date();
        // this.elemRef.nativeElement.innerHTML
        let obj =
        {
          "messageBody": "Test",
          "toEmail": [
            {
              "emailAddress": this.EmailIdToRef.nativeElement.innerText
            }
          ],
          "targetObject": {
            "adviceUuid": this.groupId,
            "sent": this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          },
          "fromEmail": "sarvesh@futurewise.co.in",
          "emailSubject": this.subBodyRef.nativeElement.innerText,
          "placeholder": [
            {
              "user": "$user"
            }
          ]
        }
        this.cusService.sentEmailConsent(obj).subscribe(
          data => {
            console.log(data)
            this.route.navigate(['/cus/email-consent'], { queryParams: { gropID: this.groupId } });
            this.close(false)
          }
        )

      }
    )
  }
  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
