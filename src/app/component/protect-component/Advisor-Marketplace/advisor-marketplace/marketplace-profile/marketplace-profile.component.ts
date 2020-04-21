import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../../Data-service/event.service';
import { MarketplaceProfileEditComponent } from './marketplace-profile-edit/marketplace-profile-edit.component';
import { UtilService } from '../../../../../services/util.service';

@Component({
  selector: 'app-marketplace-profile',
  templateUrl: './marketplace-profile.component.html',
  styleUrls: ['./marketplace-profile.component.scss']
})
export class MarketplaceProfileComponent implements OnInit {

  constructor(
    private eventService: EventService,

  ) { }

  ngOnInit() {
  }

  openMarketplaceProfileEdit(flag, data) {
    const fragmentData = {
      flag,
      id: 1,
      data,
      direction: 'top',
      componentName: MarketplaceProfileEditComponent,
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
