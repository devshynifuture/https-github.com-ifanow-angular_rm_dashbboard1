import { SuggestAdviceComponent } from './../suggest-advice/suggest-advice.component';
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
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { AdviceUtilsService } from '../advice-utils.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-advice-retirement-account',
  templateUrl: './advice-retirement-account.component.html',
  styleUrls: ['./advice-retirement-account.component.scss']
})
export class AdviceRetirementAccountComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'empcon', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  displayedColumns1: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'tcontro', 'advice', 'astatus', 'adate', 'icon'];
  displayedColumns2: string[] = ['checkbox', 'name', 'desc', 'amtacc', 'advice', 'astatus', 'adate', 'icon'];
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'advice', 'astatus', 'adate', 'icon'];
  displayedColumns4: string[] = ['checkbox', 'name', 'desc', 'pvalue', 'nvalue', 'advice', 'astatus', 'adate', 'icon'];
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
  epfCount: number;
  npsCOunt: number;
  gratuityCount: number;
  superannuationCount: number;
  epsCount: number;

  constructor(public dialog: MatDialog, private utilService: UtilService, private subInjectService: SubscriptionInject, private activityService: ActiityService) { }

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
      assetCategory: 9,
      adviceStatusId:1
    }
    this.isLoading = true;
    this.epfDataSource = [{}, {}, {}];
    this.npsDataSource = [{}, {}, {}];
    this.gratuityDataSource = [{}, {}, {}];
    this.superannuationDataSource = [{}, {}, {}];
    this.epsDataSource = [{}, {}, {}];
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
      }
    );
  }
  filterForAsset(data){//filter data to for showing in the table
    let filterdData=[];
    data.forEach(element => {
      var asset=element.AssetDetails;
      element.AdviceList.forEach(obj => {
        obj.assetDetails=asset;
        filterdData.push(obj);
      });
    });
    return filterdData;
  }
  getAllSchemeResponse(data) {
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
  checkSingle(flag, selectedData, tableData, tableFlag) {
    if (flag.checked) {
      selectedData.selected = true;
      this.selectedAssetId.push(selectedData.id)
    }
    else {
      selectedData.selected = false
      this.selectedAssetId.splice(this.selectedAssetId.indexOf(selectedData.id), 1)
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
  openAddEdit(value, data) {
    let Component = (value == 'adviceEPF') ? AddEPFComponent : (value == "adviceNPSSummary") ? NpsSummaryPortfolioComponent : (value == 'adviceNPSSchemeHolding') ? NpsSchemeHoldingComponent : (value == 'adviceGratuity') ? AddGratuityComponent : (value == 'adviceSuperAnnuation') ? AddSuperannuationComponent : AddEPSComponent;
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: SuggestAdviceComponent,
      childComponent: Component,
      childData: { data: null, flag: value },
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          this.getAdviceByAsset();
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  deleteModal(value, subData) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {

      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  checkAll(flag, tableDataList, tableFlag) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    // this.dataSource = new MatTableDataSource(dataList);
    this.selectedAssetId = selectedIdList;
    this.getFlagCount(tableFlag, count);
    console.log(this.selectedAssetId);
  }
}