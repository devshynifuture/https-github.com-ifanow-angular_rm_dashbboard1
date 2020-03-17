import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddRealEstateComponent } from '../../../../accounts/assets/realEstate/add-real-estate/add-real-estate.component';
import { UtilService } from 'src/app/services/util.service';
import { SelectAdviceComponent } from '../../select-advice/select-advice.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../../actiity.service';
import { AdviceUtilsService } from '../../advice-utils.service';

@Component({
  selector: 'app-all-advice-real-estate',
  templateUrl: './all-advice-real-estate.component.html',
  styleUrls: ['./all-advice-real-estate.component.scss']
})
export class AllAdviceRealAssetComponent implements OnInit {
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'pvalue', 'mvalue', 'ngain', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = ELEMENT_DATA1;
  clientId: any;
  advisorId: any;
  isLoading: any;
  dataSource: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  realEstateCount: number;
  selectedAssetId: any = [];

  constructor(private eventService: EventService, public dialog: MatDialog, private subInjectService: SubscriptionInject,
    private cusService: CustomerService, private activityService: ActiityService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAllAdviceByAsset();
  }
  allAdvice = true;
  getAllAdviceByAsset() {
  this.isLoading = true;
    this.dataSource = [{}, {}, {}];
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 8,
      adviceStatusId: 0
    }
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
        this.isLoading = false;
        this.dataSource = [];
        this.dataSource['tableFlag'] = (this.dataSource.length == 0) ? false : true;
      }
    );
  }
  getAllSchemeResponse(data) {
    this.isLoading = false;
    let filterdData = [];
    let realEstateData = data.REAL_ESTATE;
    realEstateData.forEach(element => {
      var asset = element.AssetDetails;
      if (element.AdviceList.length > 0) {
        element.AdviceList.forEach(obj => {
          obj.assetDetails = asset;
          filterdData.push(obj);
        });
      } else {
        const obj = {
          assetDetails: asset
        }
        filterdData.push(obj);
      }
    });
    this.dataSource = new MatTableDataSource(filterdData);
    this.dataSource['tableFlag'] = (data.REAL_ESTATE.length == 0) ? false : true;
    this.dataSource.sort = this.sort
    console.log(data);
  }
  checkAll(flag, tableDataList) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.realEstateCount = count;
    this.selectedAssetId = selectedIdList;
    console.log(this.selectedAssetId);
  }
  checkSingle(flag, selectedData, tableData) {
    if (flag.checked) {
      selectedData.selected = true;
      this.selectedAssetId.push(selectedData.assetDetails.id)
    }
    else {
      selectedData.selected = false
      this.selectedAssetId.splice(this.selectedAssetId.indexOf(selectedData.assetDetails.id), 1)
    }
    this.realEstateCount = AdviceUtilsService.selectSingleCheckbox(Object.assign([], tableData));
  }
  openRealEstate(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddRealEstateComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getFixedDepositList();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openselectAdvice(data) {
    const fragmentData = {
      flag: 'openselectAdvice',
      data,
      componentName: SelectAdviceComponent,

      state: 'open65'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
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
  { name: 'Rahul Jain', desc: '1', mvalue: '20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', mvalue: '20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];