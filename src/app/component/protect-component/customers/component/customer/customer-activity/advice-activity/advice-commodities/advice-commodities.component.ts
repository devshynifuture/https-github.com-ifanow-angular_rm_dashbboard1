import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { GoldComponent } from '../../../accounts/assets/commodities/gold/gold.component';
import { OthersComponent } from '../../../accounts/assets/commodities/others/others.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../actiity.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AdviceUtilsService } from '../advice-utils.service';

@Component({
  selector: 'app-advice-commodities',
  templateUrl: './advice-commodities.component.html',
  styleUrls: ['./advice-commodities.component.scss']
})
export class AdviceCommoditiesComponent implements OnInit, AfterViewInit {
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'mvalue', 'advice', 'astatus', 'adate', 'icon'];
  // dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
  advisorId: any;
  clientId: any;
  isLoading: boolean;
  @ViewChild("tableOne", { static: false }) sort1: MatSort;
  @ViewChild("tableTwo", { static: false }) sort2: MatSort;
  goldDataSource: any = new MatTableDataSource();
  selectedAssetId: any = [];
  otherDataSource: any = new MatTableDataSource();
  goalCount: number;
  othersCount: number;
  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject, private activityService: ActiityService) { }
  ngAfterViewInit() {
    this.goldDataSource.sort = this.sort1;
  }
  ngOnInit() {
    // this.goldDataSource.sort = this.sort1;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAdviceByAsset();
  }
  allAdvice = false
  getAdviceByAsset() {

    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 12
    }
    this.isLoading = true
    this.goldDataSource.data = [{}, {}, {}];
    this.otherDataSource.data = [{}, {}, {}]
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
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
    console.log(this.selectedAssetId)
  }
  getAllSchemeResponse(data) {
    this.goldDataSource.data = data.GOLD;
    this.goldDataSource.sort = this.sort1;
    this.otherDataSource.data = data.OTHERS;
    this.goldDataSource['tableFlag'] = (data.GOLD.length == 0) ? false : true;
    this.otherDataSource['tableFlag'] = (data.OTHERS.length == 0) ? false : true;
    console.log(data);
    this.isLoading = false
  }
  openAddEdit(value, data) {
    let Component = (value == "adviceGOLD") ? GoldComponent : OthersComponent;
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: Component,

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
}