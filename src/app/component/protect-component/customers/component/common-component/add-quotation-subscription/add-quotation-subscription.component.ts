import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { SubscriptionService } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import { SubscriptionUpperSliderComponent } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/upper-slider/subscription-upper-slider.component';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { CommonFroalaComponent } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/common-froala/common-froala.component';

@Component({
  selector: 'app-add-quotation-subscription',
  templateUrl: './add-quotation-subscription.component.html',
  styleUrls: ['./add-quotation-subscription.component.scss']
})
export class AddQuotationSubscriptionComponent implements OnInit {
  advisorId: any;
  planSettingData: any;
  selectedPlan: any;
  clientData: any;
  noDataFoundFlag: boolean;

  constructor(public subInjectService: SubscriptionInject, private subService: SubscriptionService, private eventService: EventService) { }
  @Input() data;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientData = AuthService.getSubscriptionUpperSliderData();
    this.getPlanOfAdvisor();
  }

  getPlanOfAdvisor() {
    const obj = {
      advisorId: this.advisorId,
      clientId: (this.clientData.data) ? this.clientData.data.id : 0,
      flag: (this.clientData) ? 4 : 3
    };
    this.subService.getQuotationReplatedPlans(obj).subscribe(
      data => {
        if (data && data.length > 0) {
          this.noDataFoundFlag = false;
          this.planSettingData = data
        }
        else {
          this.noDataFoundFlag = true;
          this.planSettingData = undefined
        }
      }
    );
  }

  createSubscription(value, data) {
    data.quotation['planId'] = data.id;
    data = data['quotation'];
    data['quotationFlag'] = true;
    // this.Close(false);
    // const fragmentData = {
    //   flag: 'openUpper',
    //   id: 1,
    //   data: { documentData: "doc", flag: 'documents' },
    //   direction: 'top',
    //   componentName: SubscriptionUpperSliderComponent,
    //   state: 'open'
    // };

    // const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
    //   upperSliderData => {
    //     if (UtilService.isDialogClose(upperSliderData)) {
    //       // this.valueChange.emit('close');
    //       // this.getPlanOfAdvisor();
    //       subscription.unsubscribe();
    //     }
    //   }
    // );
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: CommonFroalaComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isRefreshRequired(sideBarData)) {
          // this.getQuotationsData(false);
          // console.log('this is sidebardata in subs subs 2: ');
          // this.dataCount = 0;
        }
        rightSideDataSub.unsubscribe();
      }
    );
  }
  createSubscriptionResponse(data) {
    this.Close(true);
  }

  select(data) {
    this.planSettingData.forEach(element => {
      if (data.id == element.id) {
        data.selected = true
        this.selectedPlan = data
      }
      else {
        element.selected = false;
      }
    })
  }
  Close(flag) {
    this.subInjectService.changeUpperRightSliderState({ state: 'close', refreshRequired: flag });
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });

  }

}
