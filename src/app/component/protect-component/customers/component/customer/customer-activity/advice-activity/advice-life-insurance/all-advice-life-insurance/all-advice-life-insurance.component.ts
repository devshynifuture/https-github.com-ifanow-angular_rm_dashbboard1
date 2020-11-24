import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../../actiity.service';
import { MatTableDataSource } from '@angular/material';
import { AdviceUtilsService } from '../../advice-utils.service';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { forkJoin } from 'rxjs';
import { AddInsuranceComponent } from '../../../../../common-component/add-insurance/add-insurance.component';
import { SuggestAdviceComponent } from '../../suggest-advice/suggest-advice.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-all-advice-life-insurance',
  templateUrl: './all-advice-life-insurance.component.html',
  styleUrls: ['./all-advice-life-insurance.component.scss']
})
export class AllAdviceLifeInsuranceComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'mdate', 'advice', 'astatus', 'adate', 'icon'];
  clientId: any;
  advisorId: any;
  lifeInsuranceList: any;
  isLoading: boolean;
  allAdvice = true;
  stockCount: number;
  selectedAssetId: any = [];
  termDataSource: any;
  traditionalDataSource: any;
  ulipDataSource: any;
  dataSource: any;
  termCount: any;
  traditionalCount: any;
  ulipCount: any;
  displayList: any;
  object: { data: any; displayList: any; showInsurance: string; insuranceSubTypeId: number; insuranceTypeId: number; };

  constructor(private cusService: CustomerService, private subInjectService: SubscriptionInject, private activityService: ActiityService, private eventService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAllCategory();
  }
  getAllCategory() {
    this.isLoading = true;
    this.termDataSource = [{}, {}, {}];
    this.traditionalDataSource = [{}, {}, {}];
    this.ulipDataSource = [{}, {}, {}];
    this.activityService.getAllCategory('').subscribe(
      data => {
        console.log(data);
        this.getAdviceByAsset();
      }, (error) => {
        this.eventService.openSnackBar('error', 'Dismiss');
      }
    );
  }
  getAdviceByAsset() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      // assetCategory: 7,
      // adviceStatusId: 1,
      categoryMasterId: 3,
      categoryTypeId: 0,
      status: 1
    }
    const displayList = this.cusService.getInsuranceGlobalData({});
    const allAsset = this.activityService.getAllAsset(obj);
    forkJoin(displayList, allAsset).subscribe(result => {
      this.displayList = result[0];
      this.getAllSchemeResponse(result[1]);
    }, (error) => {
      this.eventService.openSnackBar('error', 'Dismiss');
    });
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
        this.termDataSource = [];
        this.traditionalDataSource = [];
        this.ulipDataSource = [];
        this.termDataSource['tableFlag'] = (this.termDataSource.length == 0) ? false : true;
        this.traditionalDataSource['tableFlag'] = (this.traditionalDataSource.length == 0) ? false : true;
        this.ulipDataSource['tableFlag'] = (this.ulipDataSource.length == 0) ? false : true;
      }
    );
  }
  filterForAsset(data) {//filter data to for showing in the table
    let filterdData = [];
    data.forEach(element => {
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
    return filterdData;
  }
  getAllSchemeResponse(data) {
    this.isLoading = false;
    console.log('data', data)
    this.dataSource = data;
    let termData = this.filterForAsset(data.TERM_LIFE_INSURANCE)
    this.termDataSource = new MatTableDataSource(termData);
    console.log('fddata', termData);
    // this.termDataSource.sort = this.sort
    let traditionalData = this.filterForAsset(data.TRADITIONAL_LIFE_INSURANCE)
    this.traditionalDataSource = new MatTableDataSource(traditionalData);
    console.log('rdData', traditionalData)
    // this.traditionalDataSource.sort = this.sort
    let ulipData = this.filterForAsset(data.ULIP_LIFE_INSURANCE)
    this.ulipDataSource = new MatTableDataSource(ulipData);
    console.log('ulipData', ulipData)

    // this.ulipDataSource.sort = this.sort
    this.termDataSource['tableFlag'] = (data.FIXED_DEPOSIT.length == 0) ? false : true;
    this.traditionalDataSource['tableFlag'] = (data.RECURRING_DEPOSIT.length == 0) ? false : true;
    this.ulipDataSource['tableFlag'] = (data.BONDS.length == 0) ? false : true;
  }

  checkAll(flag, tableDataList, value) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.stockCount = count;
    this.selectedAssetId = selectedIdList;
    console.log(this.selectedAssetId);
  }

  getFlagCount(flag, count) {
    switch (true) {
      case (flag == 'term'):
        this.termCount = count;
        break;
      case (flag == 'recurringDeposit'):
        this.traditionalCount = count;
        break;
      default:
        this.ulipCount = count;
        break;
    }
  }

  openAddEditAdvice(value, data) {
    if (!data) {
      this.object = { data: data, displayList: this.displayList, showInsurance: '', insuranceSubTypeId: 1, insuranceTypeId: 1 }
      switch (value) {
        case "Term Insurance":
          this.object.insuranceSubTypeId = 1;
          this.object.showInsurance = 'TERM';
          break;
        case "Traditional Insurance":
          this.object.insuranceSubTypeId = 2;
          this.object.showInsurance = 'TERM'
          break;
        case "Ulip Insurance":
          this.object.insuranceSubTypeId = 3;
          this.object.showInsurance = 'TERM'
          break;
      }
    }
    let Component = AddInsuranceComponent;

    const fragmentData = {
      flag: 'Advice Insurance',
      data: { data: data, displayList: this.displayList, showInsurance: this.object.showInsurance, insuranceSubTypeId: this.object.insuranceSubTypeId, insuranceTypeId: 1, flag: 'All Advice Insurance' },
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
