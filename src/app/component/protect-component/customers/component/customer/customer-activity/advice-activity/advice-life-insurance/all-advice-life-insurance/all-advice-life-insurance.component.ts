import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../../actiity.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { AdviceUtilsService } from '../../advice-utils.service';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { forkJoin } from 'rxjs';
import { AddInsuranceComponent } from '../../../../../common-component/add-insurance/add-insurance.component';
import { SuggestAdviceComponent } from '../../suggest-advice/suggest-advice.component';
import { UtilService } from 'src/app/services/util.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-all-advice-life-insurance',
  templateUrl: './all-advice-life-insurance.component.html',
  styleUrls: ['./all-advice-life-insurance.component.scss']
})
export class AllAdviceLifeInsuranceComponent implements OnInit {
  displayedColumns3: string[] = ['checkbox', 'position', 'policyName', 'name', 'weight', 'symbol', 'mdate', 'advice', 'astatus', 'adate', 'icon'];
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
  adviceHeaderList = [{ id: '1', value: 'Continue' }, { id: '2', value: 'Surrender' }, { id: '3', value: 'Stop paying premium' }, { id: '4', value: 'Take loan' }, { id: '5', value: 'Partial withdrawl' }]
  termCpy: any;
  tradCopy: any;
  ulipCpy: any;
  LIData: unknown;
  totalFundValues: number;
  allTrad: any;
  allUlip: any;
  allTerm: any;
  constructor(public dialog: MatDialog, private cusService: CustomerService, private subInjectService: SubscriptionInject, private activityService: ActiityService, private eventService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAdviceByAsset()
    // this.getAllCategory();
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
    this.isLoading = true;
    this.termDataSource = [{}, {}, {}];
    this.traditionalDataSource = [{}, {}, {}];
    this.ulipDataSource = [{}, {}, {}];
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      // assetCategory: 7,
      // adviceStatusId: 1,
      categoryMasterId: 3,
      categoryTypeId: 3,
      statusFlag: 0
    }
    const obj2 = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      insuranceTypeId: 1,
      id: 0
    };
    const displayList = this.cusService.getInsuranceGlobalData({});
    const allAsset = this.activityService.getAllAsset(obj);
    const portfolioLi = this.cusService.getInsuranceData(obj2);
    forkJoin(displayList, allAsset , portfolioLi).subscribe(result => {
      this.displayList = result[0];
      this.LIData = this.filterLiData(result[2].insuranceList);
      this.getAllSchemeResponse(result[1]);
    }, (error) => {
      this.eventService.openSnackBar('error', 'Dismiss');
      this.termDataSource = [];
      this.traditionalDataSource = [];
      this.ulipDataSource = [];
      this.termDataSource['tableFlag'] = (this.termDataSource.length == 0) ? false : true;
      this.traditionalDataSource['tableFlag'] = (this.traditionalDataSource.length == 0) ? false : true;
      this.ulipDataSource['tableFlag'] = (this.ulipDataSource.length == 0) ? false : true;
    });
  }
  filterLiData(data){
   data.forEach(element => {
      this.totalFundValues = 0;
      if (element.ulipFundDetails.length > 0 && element.insuranceSubTypeId == 3) {
        element.ulipFundDetails.forEach(ele => {
          this.totalFundValues += (ele.fundValueOrNav == 1) ? (ele.units * ele.nav) : ele.fundValue;
          element.currentValue = this.totalFundValues
        });
      }
    });
    return data;
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
    this.allTerm = data.TERM_LIFE_INSURANCE
    let termData = this.setCatId(data.TERM_LIFE_INSURANCE,1);
    this.termCpy = termData;
    // let termData = this.filterForAsset(data.TERM_LIFE_INSURANCE)
    this.termDataSource = new MatTableDataSource(termData);
    console.log('fddata', termData);
    // this.termDataSource.sort = this.sort
    this.allTrad  = data.TRADITIONAL_LIFE_INSURANCE;
    let traditionalData = this.setCatId(data.TRADITIONAL_LIFE_INSURANCE,2);
    this.tradCopy = traditionalData
    this.traditionalDataSource = new MatTableDataSource(traditionalData);
    console.log('rdData', traditionalData)
    // this.traditionalDataSource.sort = this.sort
    this.allUlip  = data.ULIP_LIFE_INSURANCE;
    let ulipData = this.setCatId(data.ULIP_LIFE_INSURANCE,3);
    this.ulipCpy = ulipData
    this.ulipDataSource = new MatTableDataSource(ulipData);
    console.log('ulipData', ulipData)
    // this.ulipDataSource.sort = this.sort
    this.termDataSource['tableFlag'] = data.TERM_LIFE_INSURANCE.length == 0 ? false : true;
    this.traditionalDataSource['tableFlag'] = data.TRADITIONAL_LIFE_INSURANCE.length == 0 ? false : true;
    this.ulipDataSource['tableFlag'] = data.ULIP_LIFE_INSURANCE.length == 0 ? false : true;
  }
  filterInsurance(key: string, value: any, name, array, dataSource) {
    let dataFiltered;
    array = (name == 'Term insurance') ? this.termCpy : (name == 'Traditional insurance') ? this.tradCopy : this.ulipCpy;
    if(value != 0){
      dataFiltered = array.filter(function (item) {
        return item.adviceDetails[key] === parseInt(value);
      });
      if (dataFiltered.length > 0) {
        dataSource.data = dataFiltered;
        dataSource = new MatTableDataSource(dataSource.data);
      } else {
        this.eventService.openSnackBar("No data found", "Dismiss")
      }
    }else{
      dataSource.data = array;
    }



  }

  setCatId(data,id) {
    let liArray = this.getFilterLi(data,this.LIData,id);
    let array = [];
    if (data.length > 0) {
      data.forEach(element => {
          element.adviceDetails.adviceToCategoryTypeMasterId = 3
          array.push(element);
      });
    }
    if(liArray.length > 0 && array.length > 0){
      array = [...liArray, ...array];
    }
    return array;
  }
  getFilterLi(adviceData,data,id){
    if(data.length > 0){
      data = data.filter(item => item.insuranceSubTypeId === id);
      data.forEach(element => {
        element.adviceDetails={adviceToCategoryTypeMasterId: 3,adviceStatusId:0,adviceId:0};
        element.InsuranceDetails = element
      });
    }else{
      data =[];
    }
    return data;
  }
  checkSingle(flag, selectedData, tableData, tableFlag) {
    if (flag.checked) {
      selectedData.selected = true;
      this.selectedAssetId.push(selectedData.adviceDetails)
    }
    else {
      selectedData.selected = false
      this.selectedAssetId.splice(this.selectedAssetId.indexOf(selectedData.adviceDetails), 1)
    }
    let countValue = AdviceUtilsService.selectSingleCheckbox(Object.assign([], tableData));
    this.getFlagCount(tableFlag, countValue)
    console.log(this.selectedAssetId)
  }

  checkAll(flag, tableDataList, tableFlag, ) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAllIns(flag, tableDataList._data._value, this.selectedAssetId);
    this.getFlagCount(tableFlag, count)
    this.selectedAssetId = selectedIdList;
    console.log(this.selectedAssetId);
  }
  getFlagCount(flag, count) {
    switch (true) {
      case (flag == 'term'):
        this.termCount = count;
        break;
      case (flag == 'traditional'):
        this.traditionalCount = count;
        break;
      default:
        this.ulipCount = count;
        break;
    }
  }
  deleteModal(value, subData) {
    let deletedId = subData.adviceDetails.id;
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.activityService.deleteAdvice(deletedId).subscribe(
          data => {
            this.eventService.openSnackBar("Deleted successfully", "Dismiss")
            dialogRef.close();
          },
          error => this.eventService.showErrorMessage(error)
        )
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
  openAddEditAdvice(value, data) {
    this.object = { data: data, displayList: this.displayList, showInsurance: '', insuranceSubTypeId: 1, insuranceTypeId: 1 }
    switch (value) {
      case "Term Insurance":
        this.object.insuranceSubTypeId = 1;
        this.object.showInsurance = 'TERM';
        data ? data.InsuranceDetails.insuranceSubTypeId = 1 : '';
        break;
      case "Traditional Insurance":
        this.object.insuranceSubTypeId = 2;
        this.object.showInsurance = 'TERM'
        data ? data.InsuranceDetails.insuranceSubTypeId = 2 : '';
        break;
      case "Ulip Insurance":
        this.object.insuranceSubTypeId = 3;
        this.object.showInsurance = 'TERM';
        data ? data.InsuranceDetails.insuranceSubTypeId = 3 : '';

        break;
    }
    data ? data['adviceHeaderList'] = this.adviceHeaderList : data = { adviceHeaderList: this.adviceHeaderList };
    let Component = AddInsuranceComponent;

    const fragmentData = {
      flag: 'Advice Insurance',
      data,
      id: 1,
      state: 'open',
      componentName: SuggestAdviceComponent,
      childComponent: Component,
      childData: { data: data ? data.InsuranceDetails : null, displayList: this.displayList, showInsurance: this.object.showInsurance, insuranceSubTypeId: this.object.insuranceSubTypeId, insuranceTypeId: 1, flag: 'Advice Insurance' },
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
