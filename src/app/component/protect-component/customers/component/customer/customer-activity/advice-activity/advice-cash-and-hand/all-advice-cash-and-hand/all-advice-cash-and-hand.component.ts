import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { BankAccountsComponent } from '../../../../accounts/assets/cash&bank/bank-accounts/bank-accounts.component';
import { CashInHandComponent } from '../../../../accounts/assets/cash&bank/cash-in-hand/cash-in-hand.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../../actiity.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AdviceUtilsService } from '../../advice-utils.service';

@Component({
  selector: 'app-all-advice-cash-and-hand',
  templateUrl: './all-advice-cash-and-hand.component.html',
  styleUrls: ['./all-advice-cash-and-hand.component.scss']
})
export class AllAdviceCashAndHandComponent implements OnInit {

  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'balance', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = ELEMENT_DATA1;
  clientId: any;
  advisorId: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  bankAccDataSource: any = new MatTableDataSource();
  cashInHandDataSource: any = new MatTableDataSource();
  isLoading: boolean;
  selectedAssetId: any = [];
  bankCount: any;
  cashCount: any;
  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject,private activityService:ActiityService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAllAdviceByAsset();
  }
  allAdvice = true
  getAllAdviceByAsset() {
    this.cashInHandDataSource.data = [{}, {}, {}];
    this.bankAccDataSource.data = [{}, {}, {}]
    this.isLoading = true;
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 11,
      adviceStatusId:0
    }
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
        this.isLoading = false;
        this.cashInHandDataSource.data = [];
        this.bankAccDataSource.data = []
        this.bankAccDataSource['tableFlag'] = (this.bankAccDataSource.data.length == 0) ? false : true;
        this.cashInHandDataSource['tableFlag'] = (this.cashInHandDataSource.data.length == 0) ? false : true;
      }
    );
  }
  checkAll(flag, tableDataList, tableFlag) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.getFlagCount(tableFlag, count)
    this.selectedAssetId = selectedIdList;
    console.log(this.selectedAssetId);
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
    this.getFlagCount(tableFlag, countValue)
    console.log(this.selectedAssetId)
  }
  getFlagCount(flag, count) {
    (flag == 'bank') ? this.bankCount = count : this.cashCount = count
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
    console.log(data);
    let bankAccData=this.filterForAsset(data.BANK_ACCOUNTS)
    this.bankAccDataSource.data = bankAccData;
    let cashInHandData=this.filterForAsset(data.CASH_IN_HAND)
    this.cashInHandDataSource.data = cashInHandData;
    this.bankAccDataSource['tableFlag'] = (data.BANK_ACCOUNTS.length == 0) ? false : true;
    this.cashInHandDataSource['tableFlag'] = (data.CASH_IN_HAND.length == 0) ? false : true;
    this.isLoading = false;
  }
  openCashAndBank(data) {
    const fragmentData = {
      flag: '',
      data,
      id: 1,
      state: 'open',
      componentName: BankAccountsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getBankAccountList();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  openCashInHand(data) {
    const fragmentData = {
      flag: 'addCashInHand',
      data,
      id: 1,
      state: 'open',
      componentName: CashInHandComponent

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getCashInHandList();
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
  balance: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'Rahul Jain', desc: '1',balance:'20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2',balance:'20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];