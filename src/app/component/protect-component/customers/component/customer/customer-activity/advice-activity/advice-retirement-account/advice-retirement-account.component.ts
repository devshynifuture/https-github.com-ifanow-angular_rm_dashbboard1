import { Component, OnInit, ViewChild } from '@angular/core';
import { NpsSummaryPortfolioComponent } from '../../../accounts/assets/retirementAccounts/add-nps/nps-summary-portfolio/nps-summary-portfolio.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { NpsSchemeHoldingComponent } from '../../../accounts/assets/retirementAccounts/add-nps/nps-scheme-holding/nps-scheme-holding.component';
import { AddEPFComponent } from '../../../accounts/assets/retirementAccounts/add-epf/add-epf.component';
import { AddGratuityComponent } from '../../../accounts/assets/retirementAccounts/add-gratuity/add-gratuity.component';
import { AddSuperannuationComponent } from '../../../accounts/assets/retirementAccounts/add-superannuation/add-superannuation.component';
import { AddEPSComponent } from '../../../accounts/assets/retirementAccounts/add-eps/add-eps.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../actiity.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AdviceUtilsService } from '../advice-utils.service';

@Component({
  selector: 'app-advice-retirement-account',
  templateUrl: './advice-retirement-account.component.html',
  styleUrls: ['./advice-retirement-account.component.scss']
})
export class AdviceRetirementAccountComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'empcon', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  dataSource = ELEMENT_DATA;
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = ELEMENT_DATA1;
  advisorId: any;
  clientId: any;
  isLoading: any;
  epfDataSource: any;
  npsDataSource: any;
  gratuityDataSource: any;
  superannuationDataSource: any;
  epsDataSource: any;
  console: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selectedAssetId: any = [];

  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject, private activityService: ActiityService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAdviceByAsset();
  }
  allAdvice = false;
  getAdviceByAsset() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 9
    }
    this.isLoading = true;
    this.epfDataSource = [{}, {}, {}];
    this.npsDataSource = [{}, {}, {}];
    this.gratuityDataSource = [{}, {}, {}];
    this.superannuationDataSource = [{}, {}, {}];
    this.epsDataSource = [{}, {}, {}];
    // let obj1 = {
    //   advisorId: this.advisorId,
    //   clientId: this.clientId,
    //   assetCategory: 16
    // }
    // let obj2 = {
    //   advisorId: this.advisorId,
    //   clientId: this.clientId,
    //   assetCategory: 17
    // }
    // let obj3 = {
    //   advisorId: this.advisorId,
    //   clientId: this.clientId,
    //   assetCategory: 18
    // }
    // let obj4 = {
    //   advisorId: this.advisorId,
    //   clientId: this.clientId,
    //   assetCategory: 19
    // }
    // let obj5 = {
    //   advisorId: this.advisorId,
    //   clientId: this.clientId,
    //   assetCategory: 20
    // }
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
      }
    );
    // this.activityService.getAllAsset(obj1).subscribe(
    //   data => this.getAllSchemeResponse(data), (error) => {
    //   }
    // );
    // this.activityService.getAllAsset(obj2).subscribe(
    //   data => this.getAllSchemeResponse(data), (error) => {
    //   }
    // );
    // this.activityService.getAllAsset(obj3).subscribe(
    //   data => this.getAllSchemeResponse(data), (error) => {
    //   }
    // );
    // this.activityService.getAllAsset(obj4).subscribe(
    //   data => this.getAllSchemeResponse(data), (error) => {
    //   }
    // );
    // this.activityService.getAllAsset(obj5).subscribe(
    //   data => this.getAllSchemeResponse(data), (error) => {
    //   }
    // );
  }
  getAllSchemeResponse(data) {
    this.isLoading = false;
    this.epfDataSource = new MatTableDataSource(data.EPF);
    this.epfDataSource.sort = this.sort;
    this.epsDataSource = new MatTableDataSource(data.EPS);
    this.epsDataSource.sort = this.sort;
    this.superannuationDataSource = new MatTableDataSource(data.SUPERANNUATION);
    this.superannuationDataSource.sort = this.sort;
    this.gratuityDataSource = new MatTableDataSource(data.GRATUITY);
    this.gratuityDataSource.sort = this.sort;
    this.npsDataSource = new MatTableDataSource(data.NPS);
    this.npsDataSource.sort = this.sort;
    this.epfDataSource['tableFlag'] = (data.EPF.length == 0) ? false : true;
    this.epsDataSource['tableFlag'] = (data.EPS.length == 0) ? false : true;
    this.superannuationDataSource['tableFlag'] = (data.SUPERANNUATION.length == 0) ? false : true;
    this.gratuityDataSource['tableFlag'] = (data.GRATUITY.length == 0) ? false : true;
    this.npsDataSource['tableFlag'] = (data.NPS.length == 0) ? false : true;
    console.log(data);
  }
  openAddEPF(data, value) {
    const fragmentData = {
      flag: value,
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
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  checkAll(flag, tableDataList) {
    console.log(flag, tableDataList)
    const { dataList, selectedIdList } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    // this.dataSource = new MatTableDataSource(dataList);
    this.selectedAssetId = selectedIdList;
    console.log(this.selectedAssetId);
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
            this.getAdviceByAsset();
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
            this.getAdviceByAsset();
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
            this.getAdviceByAsset();
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
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  openAddEPS(data, value) {
    const fragmentData = {
      flag: value,
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
            this.getAdviceByAsset();
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