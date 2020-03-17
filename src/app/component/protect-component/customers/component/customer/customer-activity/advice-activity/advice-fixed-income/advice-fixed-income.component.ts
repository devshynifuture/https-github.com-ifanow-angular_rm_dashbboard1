import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { SelectAdviceComponent } from '../select-advice/select-advice.component';
import { FixedDepositComponent } from '../../../accounts/assets/fixedIncome/fixed-deposit/fixed-deposit.component';
import { RecuringDepositComponent } from '../../../accounts/assets/fixedIncome/recuring-deposit/recuring-deposit.component';
import { BondsComponent } from '../../../accounts/assets/fixedIncome/bonds/bonds.component';
import { ActiityService } from '../../actiity.service';
import { AuthService } from 'src/app/auth-service/authService';
import { AdviceUtilsService } from '../advice-utils.service';
import { SuggestAdviceComponent } from '../suggest-advice/suggest-advice.component';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-advice-fixed-income',
  templateUrl: './advice-fixed-income.component.html',
  styleUrls: ['./advice-fixed-income.component.scss']
})

export class AdviceFixedIncomeComponent implements OnInit {
  displayedColumns3: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'mdate', 'advice', 'astatus', 'adate', 'icon'];
  advisorId: any;
  clientId: any;
  dataSource: any;
  isLoading: any;
  fixedDataSource: any;
  recurringDataSource: any;
  bondDataSource: any;
  selectedAssetId: any = [];
  checkCount: number;
  fixedCount: number;
  recurringCount: number;
  bondCount: number;
  constructor(public dialog: MatDialog, private subInjectService: SubscriptionInject, private utilService: UtilService, private activityService: ActiityService) { }
  allAdvice = false;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAdviceByAsset();
  }
  getAdviceByAsset() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 7,
      adviceStatusId:1
    }
    this.isLoading = true;
    this.fixedDataSource = [{}, {}, {}];
    this.recurringDataSource = [{}, {}, {}];
    this.bondDataSource = [{}, {}, {}];
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
  getAllSchemeResponse(data) {
    this.isLoading = false;
    console.log('data', data)
    this.dataSource = data;
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
    console.log('bondData',bondData)

    // this.bondDataSource.sort = this.sort
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
      this.selectedAssetId.push(selectedData.assetDetails.id)
    }
    else {
      selectedData.selected = false
      this.selectedAssetId.splice(this.selectedAssetId.indexOf(selectedData.assetDetails.id), 1)
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
  openAddEdit(value, data) {
    let Component = (value == 'adviceFixedDeposit') ? FixedDepositComponent : (value == 'adviceRecurringDeposit') ? RecuringDepositComponent : BondsComponent;
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
            this.getAdviceByAsset();
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
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
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
      if (result != undefined) {
        console.log(result, this.dataSource.data, 'delete result');
        const tempList = [];
        this.dataSource.data.forEach(singleElement => {
          if (singleElement.id != result.id) {
            tempList.push(singleElement);
          }
        });
        this.dataSource.data = tempList;
      }
    });
  }
}
