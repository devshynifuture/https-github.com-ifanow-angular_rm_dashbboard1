import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddEPFComponent } from '../../../../accounts/assets/retirementAccounts/add-epf/add-epf.component';
import { NpsSchemeHoldingComponent } from '../../../../accounts/assets/retirementAccounts/add-nps/nps-scheme-holding/nps-scheme-holding.component';
import { NpsSummaryPortfolioComponent } from '../../../../accounts/assets/retirementAccounts/add-nps/nps-summary-portfolio/nps-summary-portfolio.component';
import { AddGratuityComponent } from '../../../../accounts/assets/retirementAccounts/add-gratuity/add-gratuity.component';
import { AddSuperannuationComponent } from '../../../../accounts/assets/retirementAccounts/add-superannuation/add-superannuation.component';
import { AddEPSComponent } from '../../../../accounts/assets/retirementAccounts/add-eps/add-eps.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../../actiity.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { AdviceUtilsService } from '../../advice-utils.service';

@Component({
  selector: 'app-all-retirement-asset',
  templateUrl: './all-retirement-asset.component.html',
  styleUrls: ['./all-retirement-asset.component.scss']
})
export class AllRetirementAssetComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'empcon', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  displayedColumns1: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'tcontro', 'advice', 'astatus', 'adate', 'icon'];
  displayedColumns2: string[] = ['checkbox', 'name', 'desc', 'amtacc', 'advice', 'astatus', 'adate', 'icon'];
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'advice', 'astatus', 'adate', 'icon'];
  displayedColumns4: string[] = ['checkbox', 'name', 'desc', 'pvalue', 'nvalue', 'advice', 'astatus', 'adate', 'icon'];
  clientId: any;
  advisorId: any;
  isLoading: boolean;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  epfDataSource: any;
  npsDataSource: any;
  superannuationDataSource: any;
  gratuityDataSource: any;
  epsDataSource: any;
  selectedAssetId: any = [];
  epfCount: any;
  npsCOunt: any;
  gratuityCount: any;
  superannuationCount: any;
  epsCount: any;
  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject,private activityService:ActiityService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAllAdviceByAsset();
  }
  allAdvice = true;
  getAllAdviceByAsset() {
    this.isLoading = true;
    this.epfDataSource = [{}, {}, {}];
    this.npsDataSource = [{}, {}, {}];
    this.gratuityDataSource = [{}, {}, {}];
    this.superannuationDataSource = [{}, {}, {}];
    this.epsDataSource = [{}, {}, {}];
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 9,
      adviceStatusId:0
    }
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
        this.isLoading = false;
        this.epfDataSource = [];
        this.npsDataSource = [];
        this.gratuityDataSource = [];
        this.superannuationDataSource = [];
        this.epsDataSource = [];
        this.epfDataSource['tableFlag'] = (this.epfDataSource.length == 0) ? false : true;
        this.epsDataSource['tableFlag'] = (this.epsDataSource.length == 0) ? false : true;
        this.superannuationDataSource['tableFlag'] = (this.superannuationDataSource.length == 0) ? false : true;
        this.gratuityDataSource['tableFlag'] = (this.gratuityDataSource.length == 0) ? false : true;
        this.npsDataSource['tableFlag'] = (this.npsDataSource.length == 0) ? false : true;
      }
    );
  }
  filterForAsset(data){//filter data to for showing in the table
    let filterdData=[];
    data.forEach(element => {
      var asset=element.AssetDetails;
      if(element.AdviceList.length>0){
        element.AdviceList.forEach(obj => {
          obj.assetDetails=asset;
          filterdData.push(obj);
        });
      }else{
        const obj={
          assetDetails:asset
        }
        filterdData.push(obj);
      }

    });
    return filterdData;
  }
  getAllSchemeResponse(data){
    this.isLoading = false;
    let epfData=this.filterForAsset(data.EPF)
    this.epfDataSource = new MatTableDataSource(epfData);
    this.epfDataSource.sort = this.sort;
    let epsData=this.filterForAsset(data.EPS)
    this.epsDataSource = new MatTableDataSource(epsData);
    this.epsDataSource.sort = this.sort;
    let superannuationData=this.filterForAsset(data.SUPERANNUATION)
    this.superannuationDataSource = new MatTableDataSource(superannuationData);
    this.superannuationDataSource.sort = this.sort;
    let gratuityData=this.filterForAsset(data.GRATUITY)
    this.gratuityDataSource = new MatTableDataSource(gratuityData);
    this.gratuityDataSource.sort = this.sort;
    let npsData=this.filterForAsset(data.NPS)
    this.npsDataSource = new MatTableDataSource(npsData);
    this.npsDataSource.sort = this.sort;
    this.epfDataSource['tableFlag'] = (data.EPF.length == 0) ? false : true;
    this.epsDataSource['tableFlag'] = (data.EPS.length == 0) ? false : true;
    this.superannuationDataSource['tableFlag'] = (data.SUPERANNUATION.length == 0) ? false : true;
    this.gratuityDataSource['tableFlag'] = (data.GRATUITY.length == 0) ? false : true;
    this.npsDataSource['tableFlag'] = (data.NPS.length == 0) ? false : true;
    console.log(data);
  }
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
  checkSingle(flag, selectedData, tableData, tableFlag) {
    if (flag.checked) {
      selectedData.selected = true;
      this.selectedAssetId.push(selectedData.assetDetails.id)
    }
    else {
      selectedData.selected = false
      this.selectedAssetId.splice(this.selectedAssetId.indexOf(selectedData.assetDetails.id), 1)
    }
    let countValue = AdviceUtilsService.selectSingleCheckbox(Object.assign([], tableData));
    this.getFlagCount(tableFlag, countValue);
  }
  getFlagCount(flag, count) {
    switch (true) {
      case (flag == 'epf'):
        this.epfCount = count;
        break;
      case (flag == 'nps'):
        this.npsCOunt = count;
        break;
      case (flag == 'gratuity'):
        this.gratuityCount = count;
        break;
      case (flag == 'superannuation'):
        this.superannuationCount = count;
        break;
      default:
        this.epsCount = count;
        break;
    }
  }
  checkAll(flag, tableDataList, tableFlag) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    // this.dataSource = new MatTableDataSource(dataList);
    this.selectedAssetId = selectedIdList;
    this.getFlagCount(tableFlag, count);
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