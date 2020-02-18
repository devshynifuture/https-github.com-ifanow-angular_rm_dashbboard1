import { Component, OnInit } from '@angular/core';
import { AddArnRiaDetailsComponent } from '../../../setting-entry/add-arn-ria-details/add-arn-ria-details.component';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }
  addARNRIADetails(data) {
    console.log('this is detailed potd data', data);
    const fragmentData = {
      flag: 'add-ARI-RIA-details',
      data,
      id: 1,
      state: 'open',
      componentName: AddArnRiaDetailsComponent
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
  ngOnInit() {
  }

}
