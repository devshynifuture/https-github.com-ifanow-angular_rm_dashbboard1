import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../../actiity.service';
import { AdviceUtilsService } from '../../advice-utils.service';
import { CustomerService } from '../../../../customer.service';
import { forkJoin, of } from 'rxjs';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddHealthInsuranceAssetComponent } from '../../../../accounts/insurance/add-health-insurance-asset/add-health-insurance-asset.component';
import { AddPersonalAccidentInAssetComponent } from '../../../../accounts/insurance/add-personal-accident-in-asset/add-personal-accident-in-asset.component';
import { AddCriticalIllnessInAssetComponent } from '../../../../accounts/insurance/add-critical-illness-in-asset/add-critical-illness-in-asset.component';
import { AddMotorInsuranceInAssetComponent } from '../../../../accounts/insurance/add-motor-insurance-in-asset/add-motor-insurance-in-asset.component';
import { AddTravelInsuranceInAssetComponent } from '../../../../accounts/insurance/add-travel-insurance-in-asset/add-travel-insurance-in-asset.component';
import { AddHomeInsuranceInAssetComponent } from '../../../../accounts/insurance/add-home-insurance-in-asset/add-home-insurance-in-asset.component';
import { AddFireAndPerilsInsuranceInAssetComponent } from '../../../../accounts/insurance/add-fire-and-perils-insurance-in-asset/add-fire-and-perils-insurance-in-asset.component';
import { SuggestAdviceComponent } from '../../suggest-advice/suggest-advice.component';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { catchError } from 'rxjs/operators';
import { EditSuggestedAdviceComponent } from '../../edit-suggested-advice/edit-suggested-advice.component';
import { SuggestHealthInsuranceComponent } from '../../../../plan/insurance-plan/suggest-health-insurance/suggest-health-insurance.component';
import { PersonalInsuranceComponent } from '../../../../plan/insurance-plan/mainInsuranceScreen/personal-insurance/personal-insurance.component';
import { CriticalInsuranceComponent } from '../../../../plan/insurance-plan/mainInsuranceScreen/critical-insurance/critical-insurance.component';
import { MotorInsuranceComponent } from '../../../../plan/insurance-plan/mainInsuranceScreen/motor-insurance/motor-insurance.component';
import { TravelInsuranceComponent } from '../../../../plan/insurance-plan/mainInsuranceScreen/travel-insurance/travel-insurance.component';
import { HouseholdersInsuranceComponent } from '../../../../plan/insurance-plan/mainInsuranceScreen/householders-insurance/householders-insurance.component';
import { FireInsuranceComponent } from '../../../../plan/insurance-plan/mainInsuranceScreen/fire-insurance/fire-insurance.component';
import { DetailedViewInsurancePlanningComponent } from '../../../../plan/insurance-plan/detailed-view-insurance-planning/detailed-view-insurance-planning.component';
import { OtherInsuranceInsurancePlanningComponent } from '../../../../plan/insurance-plan/mainInsuranceScreen/other-insurance-insurance-planning/other-insurance-insurance-planning.component';

@Component({
  selector: 'app-all-advice-general-insurance',
  templateUrl: './all-advice-general-insurance.component.html',
  styleUrls: ['./all-advice-general-insurance.component.scss']
})
export class AllAdviceGeneralInsuranceComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'empcon', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  adviceHeaderList = [{ id: '1', value: 'Continue' }, { id: '2', value: 'Discontinue' }, { id: '3', value: 'Port policy' }, { id: '4', value: 'Increase sum assured' }, { id: '5', value: 'Decrease sum assured' }, { id: '6', value: 'Add members' }, { id: '7', value: 'Remove members' }]
  advisorId: any;
  clientId: any;
  isLoading: boolean;
  selectedAssetId: any = [];
  healthCount: any;
  personalCount: any;
  criticalCount: any;
  motorCount: any;
  travelCount: any;
  homeCount: any;
  fireCount: any;
  allAdvice = true
  displayList: any;
  object: any;
  sumAssured: any;
  healthCpy: any;
  presonalCpy: any;
  criticalCpy: any;
  motorCpy: any;
  travelCpy: any;
  homeCpy: any;
  fireCpy: any;
  GIData: any;
  healthInsuranceDataSource: any;
  personalAccidentDataSource: any;
  criticalInsDataSource: any;
  motorDataSource: any;
  travelDataSource: any;
  homeInsDataSource: any;
  FireDataSource: any;
  adviceName: string;
  adviceNameObj: { adviceName: string; };
  recommendOrNot: boolean;
  allInsurance = [{ name: 'Term', id: 1 }, { name: 'Traditional', id: 2 }, { name: 'ULIP', id: 3 }, {
    name: 'Health',
    id: 5
  }, { name: 'Personal accident', id: 7 }, { name: 'Critical illness', id: 6 }, {
    name: 'Motor',
    id: 4
  }, { name: 'Travel', id: 8 }, { name: 'Home', id: 9 }, { name: 'Fire & special perils', id: 10 }];
  constructor(private adviceUtilService: AdviceUtilsService, public dialog: MatDialog, private cusService: CustomerService, private subInjectService: SubscriptionInject, private activityService: ActiityService, private eventService: EventService) { }
  globalObj: {};
  clientIdToClearStorage: string;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    // this.getAllCategory();
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
    //   this.GIData = this.globalObj['GIData'];
    //   this.getAllSchemeResponse(this.globalObj['AllAdviceGeneralInsurance']);
    //   this.displayList = this.globalObj['displayList'];
    // }

  }
  chekToCallApi() {
    return this.globalObj && this.globalObj['AllAdviceGeneralInsurance'] && Object.keys(this.globalObj['AllAdviceGeneralInsurance']).length > 0 ? false : true;
  }
  getAllCategory() {
    this.isLoading = true;
    // this.termDataSource = [{}, {}, {}];
    // this.traditionalDataSource = [{}, {}, {}];
    // this.ulipDataSource = [{}, {}, {}];
    // this.healthInsuranceDataSource =  [{}, {}, {}];
    //   this.personalAccidentDataSource =  [{}, {}, {}];
    //   this.criticalInsDataSource =  [{}, {}, {}];
    //   this.motorDataSource =  [{}, {}, {}];
    //   this.travelDataSource =  [{}, {}, {}];
    //   this.homeInsDataSource =  [{}, {}, {}];
    //   this.FireDataSource =  [{}, {}, {}];
    const obj2 = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      insuranceTypeId: 1,
      insuranceSubTypeId: 0
    };
    const displayList = this.cusService.getInsuranceGlobalData({});
    const allCat = this.activityService.getAllCategory({});
    forkJoin(displayList, allCat).subscribe(result => {
      this.displayList = result[0];
      this.getAdviceByAsset();
    }, (error) => {
      this.eventService.openSnackBar('error', 'Dismiss');
    });

  }
  getAdviceByAsset() {
    this.isLoading = true;
    this.healthInsuranceDataSource = [{}, {}, {}];
    this.personalAccidentDataSource = [{}, {}, {}];
    this.criticalInsDataSource = [{}, {}, {}];
    this.motorDataSource = [{}, {}, {}];
    this.travelDataSource = [{}, {}, {}];
    this.homeInsDataSource = [{}, {}, {}];
    this.FireDataSource = [{}, {}, {}];
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      // assetCategory: 10,
      // adviceStatusId:1
      categoryMasterId: 4,
      categoryTypeId: 4,
      statusFlag: 0
    }
    const obj2 = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      insuranceSubTypeId: 0,
      id: 0
    };
    // const displayList = this.cusService.getInsuranceGlobalData({});
    // const allAsset = this.activityService.getAllAsset(obj);
    // const portfoliGi = this.cusService.getGeneralInsuranceData(obj2);
    const displayList = this.cusService.getInsuranceGlobalData({}).pipe(
      catchError(error => of(error))
    );
    const allAsset = this.activityService.getAllAsset(obj).pipe(
      catchError(error => of(error))
    );
    const portfoliGi = this.cusService.getGeneralInsuranceData(obj2).pipe(
      catchError(error => of(error))
    );
    forkJoin(displayList, allAsset, portfoliGi).subscribe(result => {
      this.globalObj['AllAdviceGeneralInsurance'] = result[1];
      this.globalObj['displayList'] = result[0];
      if (result[2]) {
        this.globalObj['GIData'] = result[2].generalInsuranceList;
      } else {
        this.globalObj['GIData'] = [];
      }
      this.displayList = result[0];
      this.GIData = result[2] ? result[2].generalInsuranceList : [];
      this.getAllSchemeResponse(result[1]);
    }, (error) => {
      this.eventService.openSnackBar('error', 'Dismiss');
      this.isLoading = false;
      this.healthInsuranceDataSource = [];
      this.personalAccidentDataSource = [];
      this.criticalInsDataSource = [];
      this.motorDataSource = [];
      this.travelDataSource = [];
      this.homeInsDataSource = [];
      this.FireDataSource = [];
      this.healthInsuranceDataSource['tableFlag'] = (this.healthInsuranceDataSource.length == 0) ? false : true;
      this.personalAccidentDataSource['tableFlag'] = (this.personalAccidentDataSource.length == 0) ? false : true;
      this.criticalInsDataSource['tableFlag'] = (this.criticalInsDataSource.length == 0) ? false : true;
      this.motorDataSource['tableFlag'] = (this.motorDataSource.length == 0) ? false : true;
      this.travelDataSource['tableFlag'] = (this.travelDataSource.length == 0) ? false : true;
      this.homeInsDataSource['tableFlag'] = (this.homeInsDataSource.length == 0) ? false : true;
      this.FireDataSource['tableFlag'] = (this.FireDataSource.length == 0) ? false : true;
    });
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
    if (data.HEALTH || data.PERSONAL_ACCIDENT || data.CRITICAL_ILLNESS) {
      this.isLoading = false;
      // let healthData = this.filterForAsset(data.HEALTH)
      let healthData = this.filterData(data.HEALTH, 5);
      this.healthCpy = healthData;
      this.healthInsuranceDataSource = new MatTableDataSource(healthData);
      let personalData = this.filterData(data.PERSONAL_ACCIDENT, 7);
      this.presonalCpy = healthData;
      this.personalAccidentDataSource = new MatTableDataSource(personalData);
      let critical = this.filterData(data.CRITICAL_ILLNESS, 6);
      this.criticalCpy = healthData;
      this.criticalInsDataSource = new MatTableDataSource(critical);
      let motorData = this.filterData(data.MOTOR, 4);
      this.motorCpy = healthData;
      this.motorDataSource = new MatTableDataSource(motorData);
      let travelData = this.filterData(data.TRAVEL, 8);
      this.travelCpy = healthData;
      this.travelDataSource = new MatTableDataSource(travelData);
      let homeData = this.filterData(data.HOME, 9);
      this.homeCpy = healthData;
      this.homeInsDataSource = new MatTableDataSource(homeData);
      let fireData = this.filterData(data.FIRE, 10);
      this.fireCpy = healthData;
      this.FireDataSource = new MatTableDataSource(fireData);
      this.healthInsuranceDataSource['tableFlag'] = (this.healthInsuranceDataSource.data.length == 0) ? false : true;
      this.personalAccidentDataSource['tableFlag'] = (this.personalAccidentDataSource.data.length == 0) ? false : true;
      this.criticalInsDataSource['tableFlag'] = (this.criticalInsDataSource.data.length == 0) ? false : true;
      this.motorDataSource['tableFlag'] = (this.motorDataSource.data.length == 0) ? false : true;
      this.travelDataSource['tableFlag'] = (this.travelDataSource.data.length == 0) ? false : true;
      this.homeInsDataSource['tableFlag'] = (this.homeInsDataSource.data.length == 0) ? false : true;
      this.FireDataSource['tableFlag'] = (this.FireDataSource.data.length == 0) ? false : true;
      console.log("::::::::::::::::", data)
    } else {
      this.isLoading = false;
      this.healthInsuranceDataSource = [];
      this.personalAccidentDataSource = [];
      this.criticalInsDataSource = [];
      this.motorDataSource = [];
      this.travelDataSource = [];
      this.homeInsDataSource = [];
      this.FireDataSource = [];
      this.healthInsuranceDataSource['tableFlag'] = (this.healthInsuranceDataSource.length == 0) ? false : true;
      this.personalAccidentDataSource['tableFlag'] = (this.personalAccidentDataSource.length == 0) ? false : true;
      this.criticalInsDataSource['tableFlag'] = (this.criticalInsDataSource.length == 0) ? false : true;
      this.motorDataSource['tableFlag'] = (this.motorDataSource.length == 0) ? false : true;
      this.travelDataSource['tableFlag'] = (this.travelDataSource.length == 0) ? false : true;
      this.homeInsDataSource['tableFlag'] = (this.homeInsDataSource.length == 0) ? false : true;
      this.FireDataSource['tableFlag'] = (this.FireDataSource.length == 0) ? false : true;
    }

  }
  display(value) {
    if (value) {
      this.getAdviceByAsset();
    }
  }
  filterData(data, id) {
    let countSuggest = 0
    let GIArry = this.GIData.filter(item => item.insuranceSubTypeId === id);
    GIArry = GIArry.filter(item => item.realOrFictitious === 1);
    if (GIArry.length > 0) {
      GIArry.forEach(element => {
        element.adviceDetails = { adviceToCategoryTypeMasterId: 4, adviceStatusId: 0, adviceId: null };
        element.InsuranceDetails = element
      });
    } else {
      GIArry = [];
    }
    if (GIArry.length > 0 && data.length > 0) {
      GIArry.forEach(element => {
        data.forEach(ele => {
          if (ele.InsuranceDetails && element.InsuranceDetails && (ele.InsuranceDetails.id == element.InsuranceDetails.id)) {
            element.hideGiveAdvice = true;
          }
        });
      });
      GIArry = GIArry.filter(d => !d.hideGiveAdvice);
    }
    if (GIArry.length > 0) {
      GIArry = GIArry.filter(item => item.realOrFictitious === 1);
      data = [...GIArry, ...data];
    }
    if (data.length > 0) {
      this.sumAssured = 0;
      data.forEach(element => {
        element.adviceDetails.adviceToCategoryTypeMasterId = 4
        if (element['insurance'] ? element['insurance'].isRecommend == 1 : element['insuranceDetails']) {
          countSuggest++
          this.recommendOrNot = true;
        }
        if (element.InsuranceDetails) {
          if (element.InsuranceDetails.hasOwnProperty("insuredMembers") &&
            element.InsuranceDetails.insuredMembers.length > 0) {
            element.InsuranceDetails.displayHolderName = element.InsuranceDetails.insuredMembers[0].name;
            if (element.InsuranceDetails.insuredMembers.length > 1) {
              for (let i = 1; i < element.InsuranceDetails.insuredMembers.length; i++) {
                if (element.InsuranceDetails.insuredMembers[i].name) {
                  const firstName = (element.InsuranceDetails.insuredMembers[i].name as string).split(' ')[0];
                  element.InsuranceDetails.displayHolderName += ', ' + firstName;
                }
              }
            }
          } else {
            element.InsuranceDetails.displayHolderName = element.InsuranceDetails.policyHolderName;
          }
          if (!element.InsuranceDetails.sumAssured && element.InsuranceDetails.hasOwnProperty("insuredMembers") &&
            element.InsuranceDetails.insuredMembers.length > 0) {
            element.InsuranceDetails.sumAssured = 0;
            element.InsuranceDetails.insuredMembers.forEach(ele => {
              element.InsuranceDetails.sumAssured += ele.sumInsured;
            });
            if (element.InsuranceDetails.sumAssured == 0) {
              element.InsuranceDetails.sumAssured = element.InsuranceDetails.sumInsuredIdv;
            }
          } else {
            element.InsuranceDetails.sumAssured = element.InsuranceDetails.sumInsuredIdv;
          }
          if (element.InsuranceDetails.hasOwnProperty("addOns") &&
            element.InsuranceDetails.addOns.length > 0 && !element.InsuranceDetails.sumAssured) {
            element.InsuranceDetails.addOns.forEach(ele => {
              element.InsuranceDetails.sumAssured += ele.addOnSumInsured;
            });
          }
        }

      });
    }

    return data;
  }
  openDetailedView(heading, data) {
    if (data) {
      data.parentAsset = data.childParentRel.REAL
      data.childAsset = data.childParentRel.FICT
    }
    let id = data ? (data.adviceDetails ? (data.adviceDetails.adviceId) : this.adviceName) : this.adviceName;
    this.adviceName = (id == 1) ? 'Continue' : (id == 2) ? 'Discontinue' : (id == 3) ? 'Port policy' : (id == 4) ? 'Increase sum assured' : (id == 5) ? 'Decrease sum assured' : (id == 6) ? 'Add members' : (id == 7) ? 'Remove members' : 'Proposed policy'
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
    this.selectedAssetId = [...new Map(this.selectedAssetId.map(item => [item, item])).values()];
    console.log(this.selectedAssetId)
  }

  checkAll(flag, tableDataList, tableFlag, ) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAllIns(flag, tableDataList._data._value, this.selectedAssetId, '');
    this.getFlagCount(tableFlag, count)
    this.selectedAssetId = selectedIdList;
    console.log(this.selectedAssetId);
  }
  openAddEditAdvice(value, data) {
    let component;
    if (data) {
      data.InsuranceDetails['adviceDetails'] = data.adviceDetails;
      data['insurance'] = data.InsuranceDetails;
    }
    let id = data ? (data.adviceDetails ? (data.adviceDetails.adviceId) : this.adviceName) : this.adviceName;
    this.adviceName = (id == 1) ? 'Continue' : (id == 2) ? 'Discontinue' : (id == 3) ? 'Port policy' : (id == 4) ? 'Increase sum assured' : (id == 5) ? 'Decrease sum assured' : (id == 6) ? 'Add members' : (id == 7) ? 'Remove members' : 'Proposed policy'
    this.adviceNameObj = { adviceName: this.adviceName };
    this.object = { data: data, displayList: this.displayList, showInsurance: '', insuranceSubTypeId: 1, insuranceTypeId: 2 }
    switch (value) {
      case "Health Insurance":
        this.object.insuranceSubTypeId = 5;
        this.object.value = '1';
        this.object.insuranceType = 5;
        this.object.showInsurance = 'Health';
        this.object.adviceToCategoryId = 34;
        component = SuggestHealthInsuranceComponent;
        break;
      case "Personal accident":
        this.object.insuranceSubTypeId = 7;
        this.object.value = '4',
          this.object.insuranceType = 7;
        this.object.showInsurance = 'Personal accident';
        this.object.adviceToCategoryId = 35;
        component = PersonalInsuranceComponent;
        break;
      case "Critical illness":
        this.object.insuranceSubTypeId = 6;
        this.object.insuranceType = 6;
        this.object.value = '2',
          this.object.showInsurance = 'Critical illness';
        this.object.adviceToCategoryId = 36;
        component = CriticalInsuranceComponent;
        break;
      case "Motor insurance":
        this.object.insuranceSubTypeId = 4;
        this.object.insuranceType = 4;
        this.object.value = '8',
          this.object.showInsurance = 'Motor';
        this.object.adviceToCategoryId = 37;
        component = MotorInsuranceComponent;
        this.adviceHeaderList = [{ id: '1', value: 'Continue' }, { id: '2', value: 'Discontinue' }, { id: '3', value: 'Port policy' }]
        break;
      case "Travel insurance":
        this.object.insuranceSubTypeId = 8;
        this.object.insuranceType = 8;
        this.object.value = '7',
          this.object.showInsurance = 'Travel';
        this.object.adviceToCategoryId = 38;
        component = TravelInsuranceComponent;
        this.adviceHeaderList = [{ id: '1', value: 'Continue' }, { id: '2', value: 'Discontinue' }]
        break;
      case "Home insurance":
        this.object.insuranceSubTypeId = 9;
        this.object.insuranceType = 9;
        this.object.value = '5',
          this.object.showInsurance = 'Home';
        this.object.adviceToCategoryId = 39;
        component = HouseholdersInsuranceComponent;
        this.adviceHeaderList = [{ id: '1', value: 'Continue' }, { id: '2', value: 'Discontinue' }, { id: '3', value: 'Port policy' }, { id: '4', value: 'Increase sum assured' }, { id: '5', value: 'Decrease sum assured' }]
        break;
      case "Fire & special perils insurance":
        this.object.insuranceSubTypeId = 10;
        this.object.insuranceType = 10;
        this.object.value = '6',
          this.object.adviceToCategoryId = 40;
        this.object.showInsurance = 'Fire & special perils';
        component = FireInsuranceComponent;
        this.adviceHeaderList = [{ id: '1', value: 'Continue' }, { id: '2', value: 'Discontinue' }, { id: '3', value: 'Port policy' }, { id: '4', value: 'Increase sum assured' }, { id: '5', value: 'Decrease sum assured' }]
        break;
      case "Other insurance":
        this.object.insuranceSubTypeId = 11;
        this.object.insuranceType = 11;
        this.object.value = '9',
          this.object.adviceToCategoryId = 40;
        this.object.showInsurance = 'other insurance';
        component = OtherInsuranceInsurancePlanningComponent;
        this.adviceHeaderList = [{ id: '1', value: 'Continue' }, { id: '2', value: 'Discontinue' }, { id: '3', value: 'Port policy' }, { id: '4', value: 'Increase sum assured' }, { id: '5', value: 'Decrease sum assured' }]
        break;
    }
    data ? data['adviceHeaderList'] = this.adviceHeaderList : null;
    data ? data['displayList'] = this.displayList : null;
    data ? data['showInsurance'] = this.object.showInsurance : null;
    data ? data['insuranceSubTypeId'] = data.InsuranceDetails.insuranceSubTypeId : null;
    data ? data['insuranceTypeId'] = 1 : null;
    data ? data['adviceToCategoryId'] = this.object.adviceToCategoryId : null;
    const fragmentData = {
      flag: 'Advice General Insurance',
      data,
      id: 1,
      state: 'open',
      componentName: SuggestAdviceComponent,
      adviceNameObj: this.adviceNameObj,
      adviceToCategoryId: this.object.adviceToCategoryId,
      adviceToCategoryTypeMasterId: 3,
      childComponent: component,
      recommendOrNot: data ? (data.insurance.isRecommend == 1 ? false : (this.recommendOrNot ? true : false)) : (this.recommendOrNot ? true : false),
      adviceHeaderList: this.adviceHeaderList,
      // showHeaderEdit:(data ? (data.adviceDetails ? (data.adviceDetails.adviceId == null ? true : false) : false) : false),
      showHeaderEdit: (data ? (data.adviceDetails ? (data.adviceDetails.adviceId == null ? true : !data.adviceDetails.adviceId ? false : true) : false) : false),
      childData: {
        recommendOrNot: data ? (data.insurance.isRecommend == 1 ? false : (this.recommendOrNot ? true : false)) : (this.recommendOrNot ? true : false),
        inputData: { insuranceType: this.object.insuranceType, value: this.object.value }, adviceNameObj: this.adviceNameObj, data: data ? data.InsuranceDetails : null, displayList: this.displayList, showInsurance: this.object.showInsurance, insuranceSubTypeId: this.object.insuranceSubTypeId, insuranceTypeId: 2, adviceToCategoryId: this.object.adviceToCategoryId, flag: 'Advice General Insurance'
      },
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
      case "Health Insurance":
        this.object.insuranceSubTypeId = 5;
        this.object.showInsurance = 'Health';
        this.object.adviceToCategoryId = 34;
        break;
      case "Personal accident":
        this.object.insuranceSubTypeId = 7;
        this.object.showInsurance = 'Personal accident';
        this.object.adviceToCategoryId = 35;
        break;
      case "Critical illness":
        this.object.insuranceSubTypeId = 6;
        this.object.showInsurance = 'Critical illness';
        this.object.adviceToCategoryId = 36;
        break;
      case "Motor insurance":
        this.object.insuranceSubTypeId = 4;
        this.object.showInsurance = 'Motor';
        this.object.adviceToCategoryId = 37;
        break;
      case "Travel insurance":
        this.object.insuranceSubTypeId = 8;
        this.object.showInsurance = 'Travel';
        this.object.adviceToCategoryId = 38;
        break;
      case "Home insurance":
        this.object.insuranceSubTypeId = 9;
        this.object.showInsurance = 'Home';
        this.object.adviceToCategoryId = 39;
        break;
      case "Fire & special perils insurance":
        this.object.insuranceSubTypeId = 10;
        this.object.adviceToCategoryId = 40;
        this.object.showInsurance = 'Fire & special perils';

        break;
    }
    // this.getCategoriId(this.object.insuranceSubTypeId);
    data ? data['adviceHeaderList'] = this.adviceHeaderList : null;
    data['displayList'] = this.displayList;
    data['showInsurance'] = this.object.showInsurance;
    data['insuranceSubTypeId'] = data.InsuranceDetails.insuranceSubTypeId;
    data['insuranceTypeId'] = 1;
    data['adviceToCategoryId'] = this.object.adviceToCategoryId;
    data['showHeader'] = true;
    const fragmentData = {
      flag: 'Advice General Insurance',
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
  filterInsurance(key: string, value: any, name, array, dataSource) {
    let dataFiltered;
    array = (name == 'Health Insurance') ? this.healthCpy : (name == 'Personal accident') ? this.presonalCpy : (name == 'Critical illness') ? this.criticalCpy : (name == 'Motor insurance') ? this.motorCpy : (name == 'Travel insurance') ? this.travelCpy : (name == 'Home insurance') ? this.homeCpy : (name == 'Fire & special perils insurance') ? this.fireCpy : this.fireCpy;
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
            if (this.globalObj && this.globalObj['AllAdviceGeneralInsurance'] && Object.keys(this.globalObj['AllAdviceGeneralInsurance']).length > 0) {
              if (value == 'Health Insurance') {
                this.globalObj['AllAdviceGeneralInsurance']['HEALTH'] = this.deleteValue(this.globalObj['AllAdviceGeneralInsurance']['HEALTH'], deletedId)
              } else if (value == 'Personal accident') {
                this.globalObj['AllAdviceGeneralInsurance']['PERSONAL_ACCIDENT'] = this.deleteValue(this.globalObj['AllAdviceGeneralInsurance']['PERSONAL_ACCIDENT'], deletedId)
              } else if (value == 'Critical illness') {
                this.globalObj['AllAdviceGeneralInsurance']['CRITICAL_ILLNESS'] = this.deleteValue(this.globalObj['AllAdviceGeneralInsurance']['CRITICAL_ILLNESS'], deletedId)
              } else if (value == 'Motor insurance') {
                this.globalObj['AllAdviceGeneralInsurance']['MOTOR'] = this.deleteValue(this.globalObj['AllAdviceGeneralInsurance']['MOTOR'], deletedId)
              } else if (value == 'Travel insurance') {
                this.globalObj['AllAdviceGeneralInsurance']['TRAVEL'] = this.deleteValue(this.globalObj['AllAdviceGeneralInsurance']['TRAVEL'], deletedId)
              } else if (value == 'Home insurance') {
                this.globalObj['AllAdviceGeneralInsurance']['HOME'] = this.deleteValue(this.globalObj['AllAdviceGeneralInsurance']['HOME'], deletedId)
              } else {
                this.globalObj['AllAdviceGeneralInsurance']['FIRE'] = this.deleteValue(this.globalObj['AllAdviceGeneralInsurance']['FIRE'], deletedId)
              }
            }

            this.getAllSchemeResponse(this.globalObj['AllAdviceGeneralInsurance']); dialogRef.close();
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
  getFlagCount(flag, count) {
    switch (true) {
      case (flag == 'health'):
        this.healthCount = count;
        break;
      case (flag == 'personal'):
        this.personalCount = count;
        break;
      case (flag == 'critical'):
        this.criticalCount = count;
        break;
      case (flag == 'motor'):
        this.motorCount = count;
        break;
      case (flag == 'travel'):
        this.travelCount = count;
        break;
      case (flag == 'home'):
        this.homeCount = count;
        break;
      case (flag == 'fire'):
        this.fireCount = count;
        break;
    }
  }
}
