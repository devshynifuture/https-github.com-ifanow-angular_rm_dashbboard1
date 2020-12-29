import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../../actiity.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { AdviceUtilsService } from '../../advice-utils.service';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { forkJoin, of, empty } from 'rxjs';
import { AddInsuranceComponent } from '../../../../../common-component/add-insurance/add-insurance.component';
import { SuggestAdviceComponent } from '../../suggest-advice/suggest-advice.component';
import { UtilService } from 'src/app/services/util.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { EditSuggestedAdviceComponent } from '../../edit-suggested-advice/edit-suggested-advice.component';
import { catchError, defaultIfEmpty } from 'rxjs/operators';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

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
  object: any;
  adviceHeaderList = [{ id: '1', value: 'Continue' }, { id: '2', value: 'Surrender' }, { id: '3', value: 'Stop paying premium' },]
  termCpy: any;
  tradCopy: any;
  ulipCpy: any;
  LIData: unknown;
  totalFundValues: number;
  allTrad: any;
  allUlip: any;
  allTerm: any;
  adviceName: string;
  adviceNameObj: { adviceName: string; };
  familyMemberList: any;
  constructor(private peopleService:PeopleService,private adviceUtilService: AdviceUtilsService, public dialog: MatDialog, private cusService: CustomerService, private subInjectService: SubscriptionInject, private activityService: ActiityService, private eventService: EventService) { }
  globalObj: {};
  clientIdToClearStorage: string;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.adviceUtilService.getFamilyMemberList()
    .subscribe(res => {
      this.familyMemberList = res;
    })
    this.adviceUtilService.getClientId().subscribe(res => {
      this.clientIdToClearStorage = res;
    });
    if (this.clientIdToClearStorage) {
      if (this.clientIdToClearStorage != this.clientId) {
        this.adviceUtilService.clearStorage();
      }
    }
    this.adviceUtilService.setClientId(this.clientId);
    this.adviceUtilService.getStoredAdviceData()
      .subscribe(res => {
        this.globalObj = {};
        if (res == "") {
          this.globalObj = {}
        } else {
          this.globalObj = res;
        }
      });
    // if (this.chekToCallApi()) {
    this.getAdviceByAsset();
    // } else {
    //   this.LIData = this.globalObj['LIData']
    //   this.getAllSchemeResponse(this.globalObj['allAdviceLifeInsurance']);
    //   this.displayList = this.globalObj['displayList'];
    // }
    this.getAllCategory();
  }
  chekToCallApi() {
    return this.globalObj && this.globalObj['allAdviceLifeInsurance'] && Object.keys(this.globalObj['allAdviceLifeInsurance']).length > 0 ? false : true;
  }
  getAllCategory() {
    this.isLoading = true;
    this.termDataSource = [{}, {}, {}];
    this.traditionalDataSource = [{}, {}, {}];
    this.ulipDataSource = [{}, {}, {}];
    this.activityService.getAllCategory('').subscribe(
      data => {
        console.log(data);
      }, (error) => {
        this.eventService.openSnackBar('error', 'Dismiss');
      }
    );
  }
  getAdviceByAsset() {
    this.isLoading = true;
    let familyMemberList;
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
    // const displayList = this.cusService.getInsuranceGlobalData({});
    // const allAsset = this.activityService.getAllAsset(obj);
    // const portfolioLi = this.cusService.getInsuranceData(obj2);
    const displayList = this.cusService.getInsuranceGlobalData({}).pipe(
      catchError(error => of(error))
    );
    const allAsset = this.activityService.getAllAsset(obj).pipe(
      catchError(error => of(error))
    );
    const portfolioLi = this.cusService.getInsuranceData(obj2).pipe(
      catchError(error => of(error))
    );
    if (!this.familyMemberList && this.familyMemberList == '') {
      familyMemberList = this.peopleService.getClientFamilyMemberListAsset({clientId: this.clientId})
    } else {
      familyMemberList = empty().pipe(defaultIfEmpty(''));

    }
    forkJoin(displayList, allAsset, portfolioLi,familyMemberList).subscribe(result => {
      this.globalObj['allAdviceLifeInsurance'] = result[1];
      if(result[2]){
        this.globalObj['LIData'] = result[2].insuranceList
      }else{
        this.globalObj['LIData'] = [];
      }
      this.adviceUtilService.setStoredAdviceData(this.globalObj);
      this.displayList = result[0];
      this.LIData = this.filterLiData(result[2] ? result[2].insuranceList : []);
      if (result[2]) {
        this.familyMemberList = result[2]
        this.adviceUtilService.setFamilyMemberList(this.familyMemberList);
      }
      this.getAllSchemeResponse(result[1]);
    }, (error) => {
      this.isLoading = false;
      this.eventService.openSnackBar('error', 'Dismiss');
      this.termDataSource = [];
      this.traditionalDataSource = [];
      this.ulipDataSource = [];
      this.termDataSource['tableFlag'] = (this.termDataSource.length == 0) ? false : true;
      this.traditionalDataSource['tableFlag'] = (this.traditionalDataSource.length == 0) ? false : true;
      this.ulipDataSource['tableFlag'] = (this.ulipDataSource.length == 0) ? false : true;
    });
  }
  filterLiData(data) {
    if(data.length > 0){
      // data = data.filter(d => d.realOrFictitious === 1);
      data.forEach(element => {
        this.totalFundValues = 0;
        if (element.ulipFundDetails.length > 0 && element.insuranceSubTypeId == 3) {
          element.ulipFundDetails.forEach(ele => {
            this.totalFundValues += (ele.fundValueOrNav == 1) ? (ele.units * ele.nav) : ele.fundValue;
            element.currentValue = this.totalFundValues
          });
        }
      });
    }else{
      data = [];
    }

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
    if(data.TERM_LIFE_INSURANCE || data.TRADITIONAL_LIFE_INSURANCE || data.ULIP_LIFE_INSURANCE){
      this.isLoading = false;
      console.log('data', data)
      this.dataSource = data;
      this.allTerm = data.TERM_LIFE_INSURANCE
      let termData = this.setCatId(data.TERM_LIFE_INSURANCE, 1);
      this.termCpy = termData;
      // let termData = this.filterForAsset(data.TERM_LIFE_INSURANCE)
      this.termDataSource = new MatTableDataSource(termData);
      console.log('fddata', termData);
      // this.termDataSource.sort = this.sort
      this.allTrad = data.TRADITIONAL_LIFE_INSURANCE;
      let traditionalData = this.setCatId(data.TRADITIONAL_LIFE_INSURANCE, 2);
      this.tradCopy = traditionalData
      this.traditionalDataSource = new MatTableDataSource(traditionalData);
      console.log('rdData', traditionalData)
      // this.traditionalDataSource.sort = this.sort
      this.allUlip = data.ULIP_LIFE_INSURANCE;
      let ulipData = this.setCatId(data.ULIP_LIFE_INSURANCE, 3);
      this.ulipCpy = ulipData
      this.ulipDataSource = new MatTableDataSource(ulipData);
      console.log('ulipData', ulipData)
      // this.ulipDataSource.sort = this.sort
      this.termDataSource['tableFlag'] = this.termDataSource.data.length == 0 ? false : true;
      this.traditionalDataSource['tableFlag'] = this.traditionalDataSource.data.length == 0 ? false : true;
      this.ulipDataSource['tableFlag'] = this.ulipDataSource.data.length == 0 ? false : true;
    }else{
      this.isLoading = false;
      this.termDataSource = [];
      this.traditionalDataSource = [];
      this.ulipDataSource = [];
      this.termDataSource['tableFlag'] = (this.termDataSource.length == 0) ? false : true;
      this.traditionalDataSource['tableFlag'] = (this.traditionalDataSource.length == 0) ? false : true;
      this.ulipDataSource['tableFlag'] = (this.ulipDataSource.length == 0) ? false : true;
    }
    
  }
  filterInsurance(key: string, value: any, name, array, dataSource) {
    let dataFiltered;
    array = (name == 'Term insurance') ? this.termCpy : (name == 'Traditional insurance') ? this.tradCopy : this.ulipCpy;
    if (value != 0) {
      dataFiltered = array.filter(function (item) {
        return item.adviceDetails[key] === parseInt(value);
      });
      if (dataFiltered.length > 0) {
        dataSource.data = dataFiltered;
        dataSource = new MatTableDataSource(dataSource.data);
      } else {
        this.eventService.openSnackBar("No data found", "Dismiss")
      }
    } else {
      dataSource.data = array;
    }



  }

  setCatId(data, id) {
    let liArray = this.getFilterLi(data, this.LIData, id);
    let array = [];
    if (data.length > 0) {
      data.forEach(element => {
        element.adviceDetails.adviceToCategoryTypeMasterId = 3
        array.push(element);
      });
    }
    if(liArray.length > 0 && data.length > 0){
      liArray.forEach(element => {
        data.forEach(ele => {
          if(ele.InsuranceDetails.id == element.InsuranceDetails.id){
            element.hideGiveAdvice = true;
          }
        });
      });
      liArray = liArray.filter(d => !d.hideGiveAdvice);

    }
    if (liArray.length > 0) {
      array = [...liArray, ...array];
    }
    return array;
  }
  getFilterLi(adviceData, data, id) {
    if (data.length > 0) {
      data = data.filter(item => item.insuranceSubTypeId === id);
      data.forEach(element => {
        element.adviceDetails = { adviceToCategoryTypeMasterId: 3, adviceStatusId: 0, adviceId: null };
        element.InsuranceDetails = element
      });
    } else {
      data = [];
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
    const { selectedIdList, count } = AdviceUtilsService.selectAllIns(flag, tableDataList._data._value, this.selectedAssetId,this.familyMemberList);
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
            if (this.globalObj && this.globalObj['adviceLifeInsurance'] && Object.keys(this.globalObj['adviceLifeInsurance']).length > 0) {
              if (value == 'Term Insurance') {
                this.globalObj['adviceLifeInsurance']['TERM_LIFE_INSURANCE'] = this.deleteValue(this.globalObj['adviceLifeInsurance']['TERM_LIFE_INSURANCE'], deletedId)
              } else if (value == 'Traditional Insurance') {
                this.globalObj['adviceLifeInsurance']['TRADITIONAL_LIFE_INSURANCE'] = this.deleteValue(this.globalObj['adviceLifeInsurance']['TRADITIONAL_LIFE_INSURANCE'], deletedId)
              } else {
                this.globalObj['adviceLifeInsurance']['ULIP_LIFE_INSURANCE'] = this.deleteValue(this.globalObj['adviceLifeInsurance']['ULIP_LIFE_INSURANCE'], deletedId)
              }
            }

            this.getAllSchemeResponse(this.globalObj['adviceLifeInsurance']);
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

  deleteValue(data, id) {
    data = data.filter(d => d.adviceDetails.id != id);
    return data;
  }
  openAddEditAdvice(value, data) {
    let id = data ? (data.adviceDetails ? (data.adviceDetails.adviceId) :this.adviceName ) :this.adviceName;
    this.adviceName = (id == 1) ? 'Continue' : (id == 2) ? 'Surrender' : (id == 3) ? 'Stop paying premium' : (id == 4) ? 'Take loan' : (id == 5) ? 'Partial withdrawl' : ''
    this.adviceNameObj = {adviceName:this.adviceName};
    this.object = { data: data, displayList: this.displayList, showInsurance: '', insuranceSubTypeId: 1, insuranceTypeId: 1 }
    switch (value) {
      case "Term Insurance":
        this.object.insuranceSubTypeId = 1;
        this.object.showInsurance = 'TERM';
        this.object.adviceToCategoryId = 42;
        data ? data.InsuranceDetails.insuranceSubTypeId = 1 : '';
        break;
      case "Traditional Insurance":
        this.object.insuranceSubTypeId = 2;
        this.object.showInsurance = 'TERM'
        this.object.adviceToCategoryId = 43;
        data ? data.InsuranceDetails.insuranceSubTypeId = 2 : '';
        break;
      case "Ulip Insurance":
        this.object.insuranceSubTypeId = 3;
        this.object.showInsurance = 'TERM';
        this.object.adviceToCategoryId = 44;
        data ? data.InsuranceDetails.insuranceSubTypeId = 3 : '';

        break;
    }
    // data ? data['adviceHeaderList'] = this.adviceHeaderList : data = { adviceHeaderList: this.adviceHeaderList };
    let Component = AddInsuranceComponent;

    const fragmentData = {
      flag: 'Advice Insurance',
      data,
      id: 1,
      state: 'open',
      componentName: SuggestAdviceComponent,
      childComponent: Component,
      adviceNameObj:this.adviceNameObj,
      adviceHeaderList:this.adviceHeaderList,
      adviceToCategoryId :this.object.adviceToCategoryId,
      adviceToCategoryTypeMasterId:3,
      showHeaderEdit:(data ? (data.adviceDetails ? (!data.adviceDetails.adviceId ? false : true) : false) : false),
      childData: { adviceNameObj:this.adviceNameObj,data: data ? data.InsuranceDetails : null, displayList: this.displayList, showInsurance: this.object.showInsurance, insuranceSubTypeId: this.object.insuranceSubTypeId, insuranceTypeId: 1, flag: 'Advice Insurance' },
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
  editAdvice(value, data) {
    this.object = { data: data, displayList: this.displayList, showInsurance: '', insuranceSubTypeId: 1, insuranceTypeId: 1, adviceToCategoryId: 1 }
    switch (value) {
      case "Term Insurance":
        this.object.insuranceSubTypeId = 1;
        this.object.adviceToCategoryId = 42;
        this.object.showInsurance = 'TERM';
        this.object.adviceToCategoryTypeMasterId=3;
        data ? data.InsuranceDetails.insuranceSubTypeId = 1 : '';
        break;
      case "Traditional Insurance":
        this.object.insuranceSubTypeId = 2;
        this.object.showInsurance = 'TRADITIONAL'
        this.object.adviceToCategoryTypeMasterId = 3;
        this.object.adviceToCategoryId = 43;
        data ? data.InsuranceDetails.insuranceSubTypeId = 2 : '';
        break;
      case "Ulip Insurance":
        this.object.insuranceSubTypeId = 3;
        this.object.showInsurance = 'ULIP';
        this.object.adviceToCategoryId = 44;
        this.object.adviceToCategoryTypeMasterId = 3;
        data ? data.InsuranceDetails.insuranceSubTypeId = 3 : '';

        break;
    }
    // this.getCategoriId(this.object.insuranceSubTypeId);
    data ? data['adviceHeaderList'] = this.adviceHeaderList : data = { adviceHeaderList: this.adviceHeaderList };
    let Component = AddInsuranceComponent;
    data['displayList'] = this.displayList;
    data['showInsurance'] = this.object.showInsurance;
    data['insuranceSubTypeId'] = data.InsuranceDetails.insuranceSubTypeId;
    data['insuranceTypeId'] = 1;
    data['adviceToCategoryId'] = this.object.adviceToCategoryId;
    data['adviceToCategoryTypeMasterId'] = this.object.adviceToCategoryTypeMasterId;
    data['showHeader'] = true;
    const fragmentData = {
      flag: 'Advice Insurance',
      data,
      id: 1,
      state: 'open',
      adviceToCategoryTypeMasterId:this.object.adviceToCategoryTypeMasterId,
      adviceToCategoryId:this.object.adviceToCategoryId,
      componentName: EditSuggestedAdviceComponent,

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
