import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { SelectAdviceComponent } from '../../select-advice/select-advice.component';
import { FixedDepositComponent } from '../../../../accounts/assets/fixedIncome/fixed-deposit/fixed-deposit.component';
import { RecuringDepositComponent } from '../../../../accounts/assets/fixedIncome/recuring-deposit/recuring-deposit.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../../actiity.service';
import { BondsComponent } from '../../../../accounts/assets/fixedIncome/bonds/bonds.component';
import { AdviceUtilsService } from '../../advice-utils.service';

@Component({
  selector: 'app-all-advice-fixed-deposit',
  templateUrl: './all-advice-fixed-deposit.component.html',
  styleUrls: ['./all-advice-fixed-deposit.component.scss']
})
export class AllAdviceFixedDepositComponent implements OnInit {

  displayedColumns3: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = new MatTableDataSource<PeriodicElement3>(ELEMENT_DATA3);
  advisorId: any;
  clientId: any;
  isLoading: any;
  fixedDataSource: any;
  recurringDataSource:any;
  bondDataSource: any;
  selectedAssetId: any;
  fixedCount: any;
  recurringCount: any;
  bondCount: any;
  constructor(public dialog: MatDialog, private subInjectService: SubscriptionInject, private utilService: UtilService,private activityService:ActiityService) { }
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.dataSource3.sort = this.sort;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAllAdviceByAsset();
  }
  allAdvice = true;
  getAllAdviceByAsset() {
    this.isLoading = true;
    this.fixedDataSource = [{}, {}, {}];
    this.recurringDataSource = [{}, {}, {}];
    this.bondDataSource = [{}, {}, {}];
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 7,
      adviceStatusId:0
    }
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
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

    console.log(data);
    let fixedData=this.filterForAsset(data.FIXED_DEPOSIT)
    this.fixedDataSource = new MatTableDataSource(fixedData);
    console.log('fddata',fixedData);
    // this.fixedDataSource.sort = this.sort
    let rdDAta=this.filterForAsset(data.RECURRING_DEPOSIT)
    this.recurringDataSource = new MatTableDataSource(rdDAta);
    console.log('rdData',rdDAta)
    // this.recurringDataSource.sort = this.sort
    let bondData=this.filterForAsset(data.BONDS)
    this.bondDataSource = new MatTableDataSource(bondData);

    this.fixedDataSource['tableFlag'] = (data.FIXED_DEPOSIT.length == 0) ? false : true;
    this.recurringDataSource['tableFlag'] = (data.RECURRING_DEPOSIT.length == 0) ? false : true;
    this.bondDataSource['tableFlag'] = (data.BONDS.length == 0) ? false : true;
  }
  checkAll(flag, tableDataList, tableFlag) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.getFlagCount(tableFlag, count)
    this.selectedAssetId = selectedIdList;
    console.log(this.selectedAssetId);
  }
  getFlagCount(flag, count) {
    switch (true) {
      case (flag == 'fixedDeposit'):
        this.fixedCount = count;
        break;
      case (flag == 'recurringDeposit'):
        this.recurringCount = count;
        break;
      default:
        this.bondCount = count;
        break;
    }
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
  
  openFixedDeposit(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: FixedDepositComponent
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
  openRecurringDeposit(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: RecuringDepositComponent
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
  openBond(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: BondsComponent
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
}

export interface PeriodicElement3 {
  name: string;
  position: string;
  weight: number;
  symbol: string;
  advice: string;
  astatus: string;
  adate: string;
}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { position: 'Rahul ', name: '35,000', weight: 23 / 12 / 2019, symbol: 'ICICI FD', advice: 'Continue holding till maturity', astatus: 'Given', adate: '23/12/2019' },
  { position: 'Rahul Jain', name: ',000', weight: 23 / 12 / 2019, symbol: 'ICICI FD', advice: 'Continue holding till maturity', astatus: 'Given', adate: '23/12/2019' },
  { position: 'Rahul ', name: '35,000', weight: 23 / 12 / 2019, symbol: 'ICICI FD', advice: 'Continue holding till maturity', astatus: 'Given', adate: '23/12/2019' },
];