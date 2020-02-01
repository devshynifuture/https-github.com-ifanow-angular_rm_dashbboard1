import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddEPFComponent } from '../../../../accounts/assets/retirementAccounts/add-epf/add-epf.component';
import { NpsSchemeHoldingComponent } from '../../../../accounts/assets/retirementAccounts/add-nps/nps-scheme-holding/nps-scheme-holding.component';
import { NpsSummaryPortfolioComponent } from '../../../../accounts/assets/retirementAccounts/add-nps/nps-summary-portfolio/nps-summary-portfolio.component';
import { AddGratuityComponent } from '../../../../accounts/assets/retirementAccounts/add-gratuity/add-gratuity.component';
import { AddSuperannuationComponent } from '../../../../accounts/assets/retirementAccounts/add-superannuation/add-superannuation.component';
import { AddEPSComponent } from '../../../../accounts/assets/retirementAccounts/add-eps/add-eps.component';

@Component({
  selector: 'app-all-retrirement-asset',
  templateUrl: './all-retrirement-asset.component.html',
  styleUrls: ['./all-retrirement-asset.component.scss']
})
export class AllRetrirementAssetComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'empcon', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  dataSource = ELEMENT_DATA;
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = ELEMENT_DATA1;
  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject, ) { }

  ngOnInit() {
  }
  allAdvice = true;
  openAddEPF(data) {
    const fragmentData = {
      flag: 'addEPF',
      data,
      id: 1,
      state: 'open',
      componentName: AddEPFComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getListEPF();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openAddSchemeHolding(data) {
    const fragmentData = {
      flag: 'addSchemeHolding',
      data,
      id: 1,
      state: 'open',
      componentName: NpsSchemeHoldingComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getListNPS();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openAddSummaryPort(data) {
    const fragmentData = {
      flag: 'addSummaryPort',
      data,
      id: 1,
      state: 'open',
      componentName: NpsSummaryPortfolioComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getListNPS();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openAddGratuity(data) {
    const fragmentData = {
      flag: 'addGratuity',
      data,
      id: 1,
      state: 'open',
      componentName: AddGratuityComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getListGratuity();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  openAddSuperannuation(data) {
    const fragmentData = {
      flag: 'addSuperannuation',
      data,
      id: 1,
      state: 'open',
      componentName: AddSuperannuationComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getListSuperannuation();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  openAddEPS(data) {
    const fragmentData = {
      flag: 'addEPS',
      data,
      id: 1,
      state: 'open',
      componentName: AddEPSComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getListEPS();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}

export interface PeriodicElement1 {
  name: string;
  desc: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'Rahul Jain', desc: '1', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];
export interface PeriodicElement {
  name: string;
  desc: string;
  cvalue: string;
  empcon: string;
  emprcon: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Rahul Jain', desc: '1', cvalue: 'This is', empcon: '54000', emprcon: '23123', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', cvalue: 'This is', empcon: '54000', emprcon: '23123', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];