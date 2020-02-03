import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { AddArnRiaCredentialsComponent } from './add-arn-ria-credentials/add-arn-ria-credentials.component';

@Component({
  selector: 'app-arn-ria-credentials',
  templateUrl: './arn-ria-credentials.component.html',
  styleUrls: ['./arn-ria-credentials.component.scss']
})
export class ArnRiaCredentialsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'code', 'euin', 'icons'];
  dataSource = ELEMENT_DATA;
  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject) { }
  isLoading = false;
  ngOnInit() {
  }
  openAddCredential(data, flag) {
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open35' : 'open',
      componentName: AddArnRiaCredentialsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
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
  code: string;
  euin: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'NSE', name: 'ARN', weight: 'ARN-83865', symbol: 'Ankit Mehta', code: 'ABC123', euin: 'E983726' },
  { position: 'NSE', name: 'ARN', weight: 'ARN-83865', symbol: 'Ankit Mehta', code: 'ABC123', euin: 'E983726' },

];