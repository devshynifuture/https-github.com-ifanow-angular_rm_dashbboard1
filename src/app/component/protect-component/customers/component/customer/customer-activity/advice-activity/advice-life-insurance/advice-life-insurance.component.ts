import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../actiity.service';
import { AdviceUtilsService } from '../advice-utils.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { SuggestAdviceComponent } from '../suggest-advice/suggest-advice.component';
import { AddInsuranceComponent } from '../../../../common-component/add-insurance/add-insurance.component';
import { forkJoin, empty } from 'rxjs';
import { CustomerService } from '../../../customer.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { EditSuggestedAdviceComponent } from '../edit-suggested-advice/edit-suggested-advice.component';
import { AddNewLifeInsComponent } from './add-new-life-ins/add-new-life-ins.component';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { defaultIfEmpty } from 'rxjs/operators';
import { DetailedViewInsurancePlanningComponent } from '../../../plan/insurance-plan/detailed-view-insurance-planning/detailed-view-insurance-planning.component';

@Component({
  selector: 'app-advice-life-insurance',
  templateUrl: './advice-life-insurance.component.html',
  styleUrls: ['./advice-life-insurance.component.scss']
})
export class AdviceLifeInsuranceComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  displayedColumns3: string[] = ['checkbox', 'position', 'policyName', 'name', 'weight', 'symbol', 'mdate', 'advice', 'astatus', 'adate', 'icon'];
  clientId: any;
  advisorId: any;
  lifeInsuranceList: any;
  isLoading: boolean;
  allAdvice = false;
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
  adviceHeaderList = [{ id: '1', value: 'Continue' }, { id: '2', value: 'Surrender' }, { id: '3', value: 'Stop paying premium' }]
  ulipCpy: any;
  tradCopy: any;
  termCpy: any[];
  allTerm: any;
  allTrad: any;
  allUlip: any;
  catObj: any;
  globalObj: {};
  clientIdToClearStorage: string;
  adviceName: string;
  adviceNameObj: { adviceName: string; };
  familyMemberList: unknown;
  allInsurance = [{ name: 'Term', id: 1 }, { name: 'Traditional', id: 2 }, { name: 'ULIP', id: 3 }, {
    name: 'Health',
    id: 5
  }, { name: 'Personal accident', id: 7 }, { name: 'Critical illness', id: 6 }, {
    name: 'Motor',
    id: 4
  }, { name: 'Travel', id: 8 }, { name: 'Home', id: 9 }, { name: 'Fire & special perils', id: 10 }];
  constructor(private peopleService: PeopleService, public dialog: MatDialog, private cusService: CustomerService, private subInjectService: SubscriptionInject, private activityService: ActiityService, private eventService: EventService, private adviceUtilService: AdviceUtilsService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.adviceUtilService.getClientId().subscribe(res => {
      this.clientIdToClearStorage = res;
    });
    this.adviceUtilService.getFamilyMemberList()
      .subscribe(res => {
        this.familyMemberList = res;
      })
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
    //   this.getAllSchemeResponse(this.globalObj['adviceLifeInsurance']);
    //   this.displayList = this.globalObj['displayList'];
    // }
    // this.getAllCategory();
  }
  chekToCallApi() {
    return this.globalObj && this.globalObj['adviceLifeInsurance'] && Object.keys(this.globalObj['adviceLifeInsurance']).length > 0 ? false : true;
  }
  getAllCategory() {
    // this.isLoading = true;
    // this.termDataSource = [{}, {}, {}];
    // this.traditionalDataSource = [{}, {}, {}];
    // this.ulipDataSource = [{}, {}, {}];
    this.activityService.getAllCategory('').subscribe(
      data => {
        this.catObj = data;
        console.log(data);
        // this.getAdviceByAsset();
      }, (error) => {
        this.eventService.openSnackBar('error', 'Dismiss');
      }
    );
  }
  getAdviceByAsset() {
    let familyMemberList;
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
    const displayList = this.cusService.getInsuranceGlobalData({});
    const allAsset = this.activityService.getAllAsset(obj);
    if (!this.familyMemberList && this.familyMemberList == '') {
      familyMemberList = this.peopleService.getClientFamilyMemberListAsset({ clientId: this.clientId })
    } else {
      familyMemberList = empty().pipe(defaultIfEmpty(''));

    }
    forkJoin(displayList, allAsset, familyMemberList).subscribe(result => {
      this.globalObj = {
        displayList: result[0],
        adviceLifeInsurance: result[1]
      }
      this.adviceUtilService.setStoredAdviceData(this.globalObj);
      this.displayList = result[0];
      if (result[2]) {
        this.familyMemberList = result[2]
        this.adviceUtilService.setFamilyMemberList(this.familyMemberList);
      }
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
    // this.activityService.getAllAsset(obj).subscribe(
    //   data => this.getAllSchemeResponse(data), (error) => {
    //     this.termDataSource = [];
    //     this.traditionalDataSource = [];
    //     this.ulipDataSource = [];
    //     this.termDataSource['tableFlag'] = (this.termDataSource.length == 0) ? false : true;
    //     this.traditionalDataSource['tableFlag'] = (this.traditionalDataSource.length == 0) ? false : true;
    //     this.ulipDataSource['tableFlag'] = (this.ulipDataSource.length == 0) ? false : true;
    //   }
    // );
  }
  display(value) {
    if (value) {
      this.getAdviceByAsset();
    }
  }
  openDetailedView(heading, data) {
    if (data && data.adviceDetails) {
      data.adviceDetails.adviceAllotment = data.adviceDetails.adviceToInsuranceProperties['adviceAllotment']
    }
    let id = data ? (data.adviceDetails ? (data.adviceDetails.adviceId) : this.adviceName) : this.adviceName;
    this.adviceName = (id == 1) ? 'Continue' : (id == 2) ? 'Surrender' : (id == 3) ? 'Stop paying premium' : (id == 4) ? 'Take loan' : (id == 5) ? 'Partial withdrawl' : 'Proposed policy'
    const sendData = {
      flag: 'detailedView',
      data: {},
      state: 'open',
      componentName: DetailedViewInsurancePlanningComponent
    };
    sendData.data = {
      data: data,
      displayList: this.displayList,
      allInsurance: this.allInsurance,
      insuranceTypeId: data ? 1 : null,
      insuranceSubTypeId: data ? data.InsuranceDetails.insuranceSubTypeId : null,
      adviceName: this.adviceName,
      showInsurance: { heading: heading },


    };

    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(sendData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          rightSideDataSub.unsubscribe();

        }
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
    this.allTerm = data.TERM_LIFE_INSURANCE
    let termData = this.setCatId(data.TERM_LIFE_INSURANCE);
    this.termCpy = termData;
    // let termData = this.filterForAsset(data.TERM_LIFE_INSURANCE)
    this.termDataSource = new MatTableDataSource(termData);
    console.log('fddata', termData);
    // this.termDataSource.sort = this.sort
    this.allTrad = data.TRADITIONAL_LIFE_INSURANCE;
    let traditionalData = this.setCatId(data.TRADITIONAL_LIFE_INSURANCE);
    this.tradCopy = traditionalData
    this.traditionalDataSource = new MatTableDataSource(traditionalData);
    console.log('rdData', traditionalData)
    // this.traditionalDataSource.sort = this.sort
    this.allUlip = data.ULIP_LIFE_INSURANCE;
    let ulipData = this.setCatId(data.ULIP_LIFE_INSURANCE);
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
    array = (name == 'Term insurance') ? this.allTerm : (name == 'Traditional insurance') ? this.allTrad : this.allUlip;
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
  setCatId(data) {
    let array = [];
    if (data.length > 0) {
      data.forEach(element => {
        element.selected = false;
        // if (element.adviceDetails.adviceStatusId == 1) {
        element.adviceDetails.adviceToCategoryTypeMasterId = 3
        array.push(element);
        // }
      });
    }
    return array;
  }
  checkSingle(flag, selectedData, tableData, tableFlag) {
    selectedData.adviceDetails.familyMemberList = this.familyMemberList;
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
    const { selectedIdList, count } = AdviceUtilsService.selectAllIns(flag, tableDataList._data._value, this.selectedAssetId, this.familyMemberList);
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
    if (data && data.childParentRel && data.childParentRel.FICT) {
      data.InsuranceDetails.familyMemberName = data.childParentRel.FICT['familyMemberName']
    }
    if (data && data.adviceDetails) {
      data.adviceDetails.adviceAllotment = data.adviceDetails.adviceToInsuranceProperties['adviceAllotment']
    }
    let id = data ? (data.adviceDetails ? (data.adviceDetails.adviceId) : this.adviceName) : this.adviceName;
    this.adviceName = (id == 1) ? 'Continue' : (id == 2) ? 'Surrender' : (id == 3) ? 'Stop paying premium' : (id == 4) ? 'Take loan' : (id == 5) ? 'Partial withdrawl' : ''
    this.adviceNameObj = { adviceName: this.adviceName };
    this.object = { data: data, displayList: this.displayList, showInsurance: '', insuranceSubTypeId: 1, insuranceTypeId: 1, adviceToCategoryId: 1 }
    switch (value) {
      case "Term Insurance":
        this.object.insuranceSubTypeId = 1;
        this.object.adviceToCategoryId = 42;
        this.object.showInsurance = 'TERM';
        data ? data.InsuranceDetails.insuranceSubTypeId = 1 : '';
        break;
      case "Traditional Insurance":
        this.object.insuranceSubTypeId = 2;
        this.object.showInsurance = 'TRADITIONAL'
        this.object.adviceToCategoryId = 43;
        data ? data.InsuranceDetails.insuranceSubTypeId = 2 : '';
        break;
      case "Ulip Insurance":
        this.object.insuranceSubTypeId = 3;
        this.object.showInsurance = 'ULIP';
        this.object.adviceToCategoryId = 44;
        data ? data.InsuranceDetails.insuranceSubTypeId = 3 : '';

        break;
    }
    // this.getCategoriId(this.object.insuranceSubTypeId);
    // data ? data['adviceHeaderList'] = this.adviceHeaderList : data = { adviceHeaderList: this.adviceHeaderList };
    let Component = AddNewLifeInsComponent;
    const fragmentData = {
      flag: 'Advice Insurance',
      data,
      id: 1,
      adviceNameObj: this.adviceNameObj,
      state: 'open',
      adviceHeaderList: this.adviceHeaderList,
      componentName: SuggestAdviceComponent,
      childComponent: Component,
      adviceToCategoryId: this.object.adviceToCategoryId,
      adviceToCategoryTypeMasterId: 3,
      showHeaderEdit: (data ? (data.adviceDetails ? (!data.adviceDetails.adviceId ? false : true) : false) : false),
      childData: { adviceNameObj: this.adviceNameObj, data: data ? data.InsuranceDetails : null, displayList: this.displayList, showInsurance: this.object.showInsurance, insuranceSubTypeId: this.object.insuranceSubTypeId, insuranceTypeId: 1, flag: 'Advice Insurance', adviceToCategoryId: this.object.adviceToCategoryId },
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
        data ? data.InsuranceDetails.insuranceSubTypeId = 1 : '';
        break;
      case "Traditional Insurance":
        this.object.insuranceSubTypeId = 2;
        this.object.showInsurance = 'TRADITIONAL'
        this.object.adviceToCategoryId = 43;
        data ? data.InsuranceDetails.insuranceSubTypeId = 2 : '';
        break;
      case "Ulip Insurance":
        this.object.insuranceSubTypeId = 3;
        this.object.showInsurance = 'ULIP';
        this.object.adviceToCategoryId = 44;
        data ? data.InsuranceDetails.insuranceSubTypeId = 3 : '';

        break;
    }
    // this.getCategoriId(this.object.insuranceSubTypeId);
    data ? data['adviceHeaderList'] = this.adviceHeaderList : data = { adviceHeaderList: this.adviceHeaderList };
    let Component = AddNewLifeInsComponent;
    data['displayList'] = this.displayList;
    data['showInsurance'] = this.object.showInsurance;
    data['insuranceSubTypeId'] = data.InsuranceDetails.insuranceSubTypeId;
    data['insuranceTypeId'] = 1;
    data['adviceToCategoryId'] = this.object.adviceToCategoryId;
    const fragmentData = {
      flag: 'Advice Insurance',
      data,
      id: 1,
      state: 'open',
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
