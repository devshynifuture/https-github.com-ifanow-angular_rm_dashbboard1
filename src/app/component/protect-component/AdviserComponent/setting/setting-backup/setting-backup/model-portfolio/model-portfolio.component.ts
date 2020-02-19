import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { AddModelPortfolioComponent } from '../../../setting-entry/add-model-portfolio/add-model-portfolio.component';

@Component({
  selector: 'app-model-portfolio',
  templateUrl: './model-portfolio.component.html',
  styleUrls: ['./model-portfolio.component.scss']
})
export class ModelPortfolioComponent implements OnInit {

  constructor(private eventService: EventService,
    private utilService: UtilService, private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }

  openAddModelPortfolio(data) {
    const fragmentData = {
      // flag: 'app-upper-setting',
      id: 1,
      data,
      direction: 'top',
      componentName: AddModelPortfolioComponent,
      state: 'open'
    };
    const rightSideDataSub = this.eventService.changeUpperSliderState(fragmentData).subscribe(
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
