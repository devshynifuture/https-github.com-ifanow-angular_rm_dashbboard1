import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../../Data-service/event.service';
import { MarketplacePostsAddComponent } from './marketplace-posts-add/marketplace-posts-add.component';
import { UtilService } from '../../../../../services/util.service';

@Component({
  selector: 'app-marketplace-posts',
  templateUrl: './marketplace-posts.component.html',
  styleUrls: ['./marketplace-posts.component.scss']
})
export class MarketplacePostsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'views', 'likes', 'menu'];
  dataSource = ELEMENT_DATA;
  constructor(
    private eventService: EventService
  ) { }

  ngOnInit() {
  }

  addNewPost(flag, data) {
    const fragmentData = {
      flag,
      id: 1,
      data,
      direction: 'top',
      componentName: MarketplacePostsAddComponent,
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
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  views: string;
  likes: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Five things to do for your personal finance durning Covid-19 Outbreak',
    name: 'Financial Planning,Budgeting', weight: 'Basic,Advance', symbol: '30/03/2020', views: '479', likes: '29'
  },

];