import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { GoldComponent } from '../../../../accounts/assets/commodities/gold/gold.component';
import { OthersComponent } from '../../../../accounts/assets/commodities/others/others.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../../actiity.service';
import { AdviceUtilsService } from '../../advice-utils.service';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-all-advice-commodities',
  templateUrl: './all-advice-commodities.component.html',
  styleUrls: ['./all-advice-commodities.component.scss']
})
export class AllAdviceCommoditiesComponent implements OnInit {

  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'pvalue', 'mvalue', 'total', 'advice', 'astatus', 'adate', 'icon'];
  displayedColumns4: string[] = ['checkbox', 'name', 'desc', 'pvalue', 'mvalue', 'advice', 'astatus', 'adate', 'icon'];  dataSource3 = ELEMENT_DATA1;
  advisorId: any;
  clientId: any;
  selectedAssetId: any =[];
  goalCount: any;
  othersCount: any;
  isLoading: boolean;
  goldDataSource: any = new MatTableDataSource();
  otherDataSource: any = new MatTableDataSource();
  @ViewChild("tableOne", { static: false }) sort1: MatSort;
  @ViewChild("tableTwo", { static: false }) sort2: MatSort;
  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject,private activityService:ActiityService,private AdviceUtilsService:AdviceUtilsService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAllAdviceByAsset();
  }
  allAdvice = true
  getAllAdviceByAsset() {
    this.isLoading = true
    this.goldDataSource.data = [{}, {}, {}];
    this.otherDataSource.data = [{}, {}, {}]
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 12,
      adviceStatusId:0
    }
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
        this.isLoading = false;
        this.goldDataSource.data = [];
        this.otherDataSource.data = []
        this.goldDataSource['tableFlag'] = (this.goldDataSource.data.length == 0) ? false : true;
        this.otherDataSource['tableFlag'] = (this.otherDataSource.data.length == 0) ? false : true;
      }
    );
  }
  checkAll(flag, tableDataList, tableFlag) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.selectedAssetId = selectedIdList;
    this.getFlagCount(tableFlag, count);
    // console.log(this.selectedAssetId);
  }
  getFlagCount(flag, count) {
    (flag == 'gold') ? this.goalCount = count : this.othersCount = count
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
    let goldData=this.filterForAsset(data.GOLD)
    this.goldDataSource.data = goldData;
    this.goldDataSource.sort = this.sort1;
    let othersData=this.filterForAsset(data.OTHERS)
    this.otherDataSource.data = othersData;
    this.goldDataSource['tableFlag'] = (data.GOLD.length == 0) ? false : true;
    this.otherDataSource['tableFlag'] = (data.OTHERS.length == 0) ? false : true;
    console.log(data);
    this.isLoading = false
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
    console.log(this.selectedAssetId)
  }
  openCommodities(value, state, data) {
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: GoldComponent,
      popupHeaderText: 'Add Gold',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
            // if (value == 'addGold') {
            //   this.getGoldList()
            // } else {
            //   this.getOtherList()
            // }

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openOthers(value, state, data) {
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: OthersComponent,

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // if (value == 'addGold') {
            //   this.getGoldList()
            // } else {
            //   this.getOtherList()
            // }
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
  mvalue: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'Rahul Jain', desc: '1', mvalue:'20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', mvalue:'20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];
