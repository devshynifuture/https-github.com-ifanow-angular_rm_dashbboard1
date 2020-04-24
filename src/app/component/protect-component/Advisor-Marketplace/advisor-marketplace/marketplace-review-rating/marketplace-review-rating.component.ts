import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../../Data-service/event.service';
import { MarketplaceReviewRequestBulkComponent } from './marketplace-review-request-bulk/marketplace-review-request-bulk.component';
import { UtilService } from '../../../../../services/util.service';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { MarketplaceReviewReplyComponent } from './marketplace-review-reply/marketplace-review-reply.component';

@Component({
  selector: 'app-marketplace-review-rating',
  templateUrl: './marketplace-review-rating.component.html',
  styleUrls: ['./marketplace-review-rating.component.scss']
})
export class MarketplaceReviewRatingComponent implements OnInit {

  constructor(
    private eventService: EventService,
    private subInjectService: SubscriptionInject
  ) { }

  ngOnInit() {
  }
  openMarketplaceReviewReply(flag, data) {
    const fragmentData = {
      flag,
      data: { ...data, flag },
      id: 1,
      state: 'open',
      componentName: MarketplaceReviewReplyComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: is refresh Required??? ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openReviewAndRatingFAQ(flag, data) {
    const fragmentData = {
      flag,
      data: { ...data, flag },
      id: 1,
      state: 'open50',
      componentName: MarketplaceReviewReplyComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: is refresh Required??? ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openReviewAndRatingsGuidelines(flag, data) {
    const fragmentData = {
      flag,
      data: { ...data, flag },
      id: 1,
      state: 'open40',
      componentName: MarketplaceReviewReplyComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: is refresh Required??? ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }


  openMarketplaceReviewBulk(flag, data) {
    console.log("hey im here")
    const fragmentData = {
      flag,
      id: 1,
      data,
      direction: 'top',
      componentName: MarketplaceReviewRequestBulkComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper']);
    // AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          if (UtilService.isRefreshRequired(upperSliderData)) {
            // call history get
          }
          subscription.unsubscribe();
        }
      }
    );
  }



}
