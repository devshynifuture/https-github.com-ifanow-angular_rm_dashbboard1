import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SuggestHealthInsuranceComponent } from '../suggest-health-insurance/suggest-health-insurance.component';
import { AddHealthInsuranceComponent } from '../add-health-insurance/add-health-insurance.component';
import { AddInsuranceUpperComponent } from '../add-insurance-upper/add-insurance-upper.component';
import { PlanService } from '../../plan.service';
import { AuthService } from 'src/app/auth-service/authService';
import { PersonalInsuranceComponent } from '../mainInsuranceScreen/personal-insurance/personal-insurance.component';
import { CriticalInsuranceComponent } from '../mainInsuranceScreen/critical-insurance/critical-insurance.component';
import { MotorInsuranceComponent } from '../mainInsuranceScreen/motor-insurance/motor-insurance.component';
import { TravelInsuranceComponent } from '../mainInsuranceScreen/travel-insurance/travel-insurance.component';
import { HouseholdersInsuranceComponent } from '../mainInsuranceScreen/householders-insurance/householders-insurance.component';
import { FireInsuranceComponent } from '../mainInsuranceScreen/fire-insurance/fire-insurance.component';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { forkJoin, empty, of } from 'rxjs';
import { InsurancePlanningServiceService } from '../insurance-planning-service.service';
import { defaultIfEmpty, catchError } from 'rxjs/operators';
import { HelthInsurancePolicyComponent } from '../add-insurance-planning/helth-insurance-policy/helth-insurance-policy.component';
import { AddHealthInsuranceAssetComponent } from '../../../accounts/insurance/add-health-insurance-asset/add-health-insurance-asset.component';
import { AddPersonalAccidentInAssetComponent } from '../../../accounts/insurance/add-personal-accident-in-asset/add-personal-accident-in-asset.component';
import { AddCriticalIllnessInAssetComponent } from '../../../accounts/insurance/add-critical-illness-in-asset/add-critical-illness-in-asset.component';
import { AddMotorInsuranceInAssetComponent } from '../../../accounts/insurance/add-motor-insurance-in-asset/add-motor-insurance-in-asset.component';
import { AddTravelInsuranceInAssetComponent } from '../../../accounts/insurance/add-travel-insurance-in-asset/add-travel-insurance-in-asset.component';
import { AddFireAndPerilsInsuranceInAssetComponent } from '../../../accounts/insurance/add-fire-and-perils-insurance-in-asset/add-fire-and-perils-insurance-in-asset.component';
import { AddHomeInsuranceInAssetComponent } from '../../../accounts/insurance/add-home-insurance-in-asset/add-home-insurance-in-asset.component';
import { SuggestAndGiveAdviceComponent } from '../suggest-and-give-advice/suggest-and-give-advice.component';
import { ActiityService } from '../../../customer-activity/actiity.service';

@Component({
  selector: 'app-show-health-planning',
  templateUrl: './show-health-planning.component.html',
  styleUrls: ['./show-health-planning.component.scss']
})
export class ShowHealthPlanningComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'advice', 'icons'];
  dataSource: any;
  inputData: any;
  showInsurance: any;

  displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol', 'icons'];
  displayedColumns2: string[] = ['position', 'name', 'weight', 'symbol', 'icons'];
  dataSource1: any;
  clientId: any;
  advisorId: any;
  isLoading = false;
  displayList = [];
  newPolicyData: { data: any; insuranceTypeId: number; insuranceSubTypeId: any; displayList: any; showInsurance: any; inputData: any; };
  showNewPolicy = false;
  insuranceType: any;
  ownerIds = [];
  familyMemberList: any;
  insuranceIds = [];
  isRefreshRequired = false;
  storedData: any;
  needAnalysisData: any;
  globalArray = [];
  adviceName: any;
  editedData: any;
  stringObject: any;
  recommendOrNot: boolean;
  dataSource3 = []
  dataSaved: boolean;
  adviceDetails: any;
  object: any;
  adviceHeaderList = [{ id: '1', value: 'Continue' }, { id: '2', value: 'Discontinue' }, { id: '3', value: 'Port policy' }, { id: '4', value: 'Increase sum assured' }, { id: '5', value: 'Decrease sum assured' }, { id: '6', value: 'Add members' }, { id: '7', value: 'Remove members' }]
  adviceNameObj: { adviceName: any; };
  constructor(
    private activityService:ActiityService,
    private subInjectService: SubscriptionInject,
    private custumService: CustomerService,
    private utils: UtilService,
    private eventService: EventService,
    private planService: PlanService,
    public dialog: MatDialog,
    public peopleService: PeopleService,
    private ipService: InsurancePlanningServiceService
  ) { }


  @Input()
  set data(data) {
    this.ipService.getIpData()
      .subscribe(res => {
        this.storedData = '';
        this.storedData = res;
      })
    this.ipService.getNeedAnlysisData()
      .subscribe(res => {
        this.needAnalysisData = res;
      })
    this.ipService.getFamilyMemberList()
      .subscribe(res => {
        this.familyMemberList = res;
      })
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId()
    this.inputData = data;
    this.insuranceType = this.inputData.insuranceType;
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    console.log('insurance data', this.inputData)
    this.showInsurance = this.inputData
    this.insuranceIds.push(this.inputData.id);
    if (this.chekToCallApi()) {
      this.getStepOneAndTwoData();
    } else {
      let singleObjectData = this.getData();
      this.forkJoinResponse(singleObjectData[0]);
    }
    this.getGlobalDataInsurance();
  }
  getData() {
    let singleData = this.needAnalysisData.filter(d => d.id == this.inputData.id);
    return singleData;
  }
  formatNumber(data, noOfPlaces: number = 0) {
    if (data) {
      data = parseFloat(data)
      if (isNaN(data)) {
        return data;
      } else {
        // console.log(' original ', data);
        const formattedValue = parseFloat((data).toFixed(noOfPlaces)).toLocaleString('en-IN', { 'minimumFractionDigits': noOfPlaces, 'maximumFractionDigits': noOfPlaces });
        // console.log(' original / roundedValue ', data, ' / ', formattedValue);
        return formattedValue;
      }
    } else {
      return '0';
    }
    return data;
  }
  chekToCallApi() {
    let data = [];
    if (this.needAnalysisData) {
      data = this.needAnalysisData.filter(d => d.id == this.inputData.id);
    }
    return data.length > 0 ? false : true

  }
  getStepOneAndTwoData() {
    let familyMemberList;
    if (!this.isRefreshRequired) {
      this.dataSource = [{}, {}, {}];
      this.dataSource1 = [{}, {}, {}];
      this.isLoading = true;
    }
    let obj = {
      id: this.insuranceIds[0] == null ? -1 : this.insuranceIds,
      insuranceType: this.inputData.insuranceType
    }
    const obj2 = {
      clientId: this.clientId
    };
    const obj3 = {
      clientId: this.clientId,
      insuranceType: this.insuranceType,
      realOrFictious: 2
    };
    const getCurrentPolicy = this.planService.getGeneralInsuranceNeedAnalysis(obj);
    if (!this.familyMemberList && this.familyMemberList == '') {
      familyMemberList = this.peopleService.getClientFamilyMemberListAsset(obj2)
    } else {
      familyMemberList = empty().pipe(defaultIfEmpty(''));

    }
    // const suggestNewGet = this.planService.getGeneralInsuranceReview(obj3);
    forkJoin(getCurrentPolicy, familyMemberList).subscribe(result => {
      result['id'] = this.inputData.id;
      if (this.needAnalysisData) {
        this.needAnalysisData = [...new Map(this.needAnalysisData.map(item => [item.id, item])).values()];
      }
      this.globalArray.push(result);
      this.ipService.setNeedAnlysisData(this.globalArray);
      this.globalArray = [];
      this.forkJoinResponse(result);
    }, err => {
      this.eventService.openSnackBar(err, 'Dismiss');
    })
  }
  forkJoinResponse(result) {
    if (result[1]) {
      this.familyMemberList = result[1];
      this.ipService.setFamilyMemberList(this.familyMemberList);
    }
    if (result) {
      let data = result[0];
      if (data) {
        this.dataSource = this.getFilterData(data.current);
        this.dataSource = data.current;
        this.checkAndPushSuggestedData(result[0])
        if (data.current) {
          data.current.forEach(element => {
            if (element.insuranceDetails.insuredMembers.length > 0) {
              element.insuranceDetails.insuredMembers.forEach(ele => {
                this.ownerIds.push({
                  'ownerId': ele.familyMemberId
                })
              });
            } else {
              this.ownerIds.push({
                'ownerId': element.insuranceDetails.policyHolderId
              })
            }
          });
        }
      } else {
        this.dataSource = [];
      }
      if (data.suggested) {
        this.dataSource1 = this.getFilterData(data.suggested);
      } else {
        this.dataSource1 = [];
      }
      this.isLoading = false;
    }
  }
  checkAndPushSuggestedData(array) {
    const myArray = this.storedData;
    let list = [];
    myArray.forEach(val => list.push(Object.assign({}, val)));
    let arrStoreData = list;
    let singleData = arrStoreData.filter(d => d.id == this.inputData.id);
    if (singleData.length > 0) {
      let suggestPolicy = singleData[0][1];
      this.pushData(array, suggestPolicy, singleData, 'suggested');
      this.pushData(array, suggestPolicy, singleData, 'current');
    }
  }
  pushData(array, suggestPolicy, singleData, value) {
    let dataArray = suggestPolicy[value].length > 0 ? suggestPolicy[value] : []
    dataArray = dataArray.flat();
    dataArray = this.ipService.pushId(dataArray)
    dataArray =[];
    dataArray.push(array[value]);
    dataArray = dataArray.flat();
    dataArray = this.ipService.pushId(dataArray)
    dataArray = [...new Map(dataArray.map(item => [item.id, item])).values()];
    singleData[0][1][value] = dataArray;
    //  singleData[0][2] = dataArray;
     if(array && singleData[0][2]){
      singleData[0][2] =[];
       let merge =[...array.current,...array.suggested]
      singleData[0][2]=merge
      singleData[0][2] = singleData[0][2].flat();
     }
    if (singleData[0][2]) {
      let arr = singleData[0][2]
      arr.forEach(element => {
        element.insurance = element.insuranceDetails ?  element.insuranceDetails :  element.insurance
        });
    }
    singleData[0][2] = [...new Map(singleData[0][2].map(item => [item['insurance'].id, item])).values()];
    console.log('recommendation', singleData[0][2])
    this.storedData = singleData;
    this.ipService.setIpData(this.storedData);
  }
  getPolicyHolderName(data) {
    let finalData = this.familyMemberList.filter(item => item.familyMemberId === (data.policyHolderId == this.clientId ? 0 : data.policyHolderId));
    return finalData[0].name
  }
  getFilterData(array) {
    if (array) {
      let countSuggest = 0
      this.getSumAssured(array);
      array.forEach(singleInsuranceData => {
        this.editedData = singleInsuranceData.insuranceDetails
        this.adviceName = singleInsuranceData.advice;
        singleInsuranceData.insuranceDetails['adviceDetails'] = singleInsuranceData.adviceDetails ? singleInsuranceData.adviceDetails : null
        this.adviceDetails = singleInsuranceData.insuranceDetails['adviceDetails'];
        if (singleInsuranceData['insurance'] ? singleInsuranceData['insurance'].isRecommend == 1 : singleInsuranceData['insuranceDetails'] == 1) {
          countSuggest++
          this.recommendOrNot = true;
        }
        (countSuggest >= 1) ? this.recommendOrNot = true : this.recommendOrNot = false;
        singleInsuranceData.insuranceDetails = singleInsuranceData.insurance ? singleInsuranceData.insurance : singleInsuranceData.insuranceDetails;
        if (singleInsuranceData.insuranceDetails && singleInsuranceData.insuranceDetails.insuredMembers.length > 0) {
          singleInsuranceData.displayHolderName = singleInsuranceData.insuranceDetails.insuredMembers[0].name;
          singleInsuranceData.displayHolderSumInsured = this.formatNumber(singleInsuranceData.insuranceDetails.insuredMembers[0].sumInsured ? singleInsuranceData.insuranceDetails.insuredMembers[0].sumInsured : singleInsuranceData.insuranceDetails.sumInsuredIdv);
          if (singleInsuranceData.insuranceDetails.insuredMembers.length > 1) {
            for (let i = 1; i < singleInsuranceData.insuranceDetails.insuredMembers.length; i++) {
              if (singleInsuranceData.insuranceDetails.insuredMembers[i].name) {
                const firstName = (singleInsuranceData.insuranceDetails.insuredMembers[i].name as string).split(' ')[0];
                singleInsuranceData.displayHolderName += ', ' + firstName;
                if (singleInsuranceData.insuranceDetails.insuredMembers[i].sumInsured) {
                  singleInsuranceData.insuranceDetails.insuredMembers[i].sumInsured = this.formatNumber(singleInsuranceData.insuranceDetails.insuredMembers[i].sumInsured, 0);
                  const firstSumInsured = (singleInsuranceData.insuranceDetails.insuredMembers[i].sumInsured as string).split(' ')[0];
                  singleInsuranceData.displayHolderSumInsured += ', ₹' + firstSumInsured;
                } else {
                  singleInsuranceData.displayHolderSumInsured = singleInsuranceData.insuranceDetails.sumInsuredIdv ? singleInsuranceData.insuranceDetails.sumInsuredIdv : 0;
                }
              }
            }
          }
        } else {
          singleInsuranceData.displayHolderName = this.getPolicyHolderName(singleInsuranceData.insuranceDetails);
          singleInsuranceData.displayHolderSumInsured = singleInsuranceData.insuranceDetails.sumInsuredIdv;;
        }
      });
    } else {
      array = []
    }

    return array;
  }
  getSumAssured(data) {
    data.forEach(element => {
      element.insuranceDetails = element.insurance ? element.insurance : element.insuranceDetails;
      element.sumAssured = 0;
      if (element.insuranceDetails && element.insuranceDetails.hasOwnProperty('insuredMembers') && element.insuranceDetails.insuredMembers.length > 0) {
        element.insuranceDetails.insuredMembers.forEach(ele => {
          ele.sumAssured += ele.sumInsured;
        });
      } else if (element.insuranceDetails && element.insuranceDetails.hasOwnProperty('policyFeatures') && element.insuranceDetails.policyFeatures.length > 0) {
        element.insuranceDetails.policyFeatures.forEach(ele => {
          element.insuranceDetails.sumInsuredIdv += ele.featureSumInsured;
        });
      } else {
        element.insuranceDetails.sumInsuredIdv = element.insuranceDetails.sumInsuredIdv;
      }

      if (!element.insuranceDetails.sumInsuredIdv && element.insuranceDetails && element.insuranceDetails.hasOwnProperty('addOns') && element.insuranceDetails.addOns.length > 0) {
        element.insuranceDetails.addOns.forEach(ele => {
          element.insuranceDetails.sumInsuredIdv += ele.addOnSumInsured;
        });
      }
    });

  }
  openDialog(value, data): void {
    const dialogRef = this.dialog.open(HelthInsurancePolicyComponent, {
      width: '780px',
      height: '600px',
      data: { value, data }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isRefreshedRequired) {
        this.isRefreshRequired = true;
        // this.addGeneralInsurance(sideBarData.data.id);
        if (result.data.adviceId) {
          this.stringObject = result.data
          let id = result.data.adviceId;
          this.adviceName = (id == 1) ? 'Continue' : (id == 2) ? 'Discontinue' : (id == 3) ? 'Port policy' : (id == 4) ? 'Increase sum assured' : (id == 5) ? 'Decrease sum assured' : (id == 6) ? 'Add members' : (id == 7) ? 'Remove members' : ''
          this.dataSource[0].advice = this.adviceName
        } else {
          this.getStepOneAndTwoData();
        }
      }
      console.log('The dialog was closed', result);
    });
  }

  openAddEditAdvice(value, data,flag) {
    if(flag!='suggestNew'){
      let id = data ? (data.adviceDetails ? (data.adviceDetails.gen_insurance_advice_id) :this.adviceName ) :this.adviceName;
      this.adviceName = (id == 1) ? 'Continue' : (id == 2) ? 'Discontinue' : (id == 3) ? 'Port policy' : (id == 4) ? 'Increase sum assured' : (id == 5) ? 'Decrease sum assured' : (id == 6) ? 'Add members' : (id == 7) ? 'Remove members' : ''
      this.adviceNameObj = {adviceName:this.adviceName};
    }else{
      this.adviceNameObj = {adviceName:null};
    }
    let component;
      this.object = { data: data, displayList: this.displayList, showInsurance: '', insuranceSubTypeId: 1, insuranceTypeId: 2 }
      switch (this.showInsurance.insuranceType) {
        case 5:
          this.object.insuranceSubTypeId = 5;
          this.object.showInsurance = 'Health';
          this.object.adviceToCategoryId = 34;
          component = SuggestHealthInsuranceComponent;
          break;
        case 7:
          this.object.insuranceSubTypeId = 7;
          this.object.showInsurance = 'Personal accident';
          this.object.adviceToCategoryId = 35;
          component = PersonalInsuranceComponent;
          break;
        case 6:
          this.object.insuranceSubTypeId = 6;
          this.object.showInsurance = 'Critical illness';
          this.object.adviceToCategoryId = 36;
          component = CriticalInsuranceComponent;
          break;
        case 4:
          this.object.insuranceSubTypeId = 4;
          this.object.showInsurance = 'Motor';
          this.object.adviceToCategoryId = 37;
          component = MotorInsuranceComponent;
          break;
        case 8:
          this.object.insuranceSubTypeId = 8;
          this.object.showInsurance = 'Travel';
          this.object.adviceToCategoryId = 38;
          component = TravelInsuranceComponent;
          break;
        case 9:
          this.object.insuranceSubTypeId = 9;
          this.object.showInsurance = 'Home';
          this.object.adviceToCategoryId = 39;
          component = HouseholdersInsuranceComponent;
          break;
        case 10:
          this.object.insuranceSubTypeId = 10;
          this.object.adviceToCategoryId = 40;
          this.object.showInsurance = 'Fire & special perils';
          component = FireInsuranceComponent;

          break;
      }
    data ? data['adviceHeaderList'] = this.adviceHeaderList : null;
    const fragmentData = {
      flag:flag,
      adviceHeaderList:flag!='suggestNew' ? this.adviceHeaderList : '',
      adviceNameObj:this.adviceNameObj,
      recommendOrNot :flag=='suggestNew'? (data ? (data.isRecommend == 1 ? false : (this.recommendOrNot ? true : false)) : (this.recommendOrNot ? true : false)) : false,
      data,
      id: 1,
      state: 'open',
      componentName: SuggestAndGiveAdviceComponent,
      childComponent: component,
      childData: {
        recommendOrNot : flag=='suggestNew'? (data ? (data.isRecommend == 1 ? false : (this.recommendOrNot ? true : false)) : (this.recommendOrNot ? true : false)) : false,
        data: data ? data : null,adviceNameObj:this.adviceNameObj,inputData : this.inputData, displayList: this.displayList,insuranceSubTypeId: this.object.insuranceSubTypeId, insuranceTypeId: 2,adviceToCategoryId:this.object.adviceToCategoryId, flag: 'Advice General Insurance' },
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.isRefreshRequired = true;
            this.getStepOneAndTwoData();
            // this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  deleteModal(value, data,flag) {
    let deletedId = data ? data.id : null;
    let deletedAdviceId = data ? (data.adviceDetails ? data.adviceDetails.id : null) : null
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        if(flag != 'existingAdvice'){
          const deleteInsurance = this.planService.deleteSuggestNew(data.id);
          const deleteAdvice = this.activityService.deleteAdvice(deletedAdviceId).pipe(
            catchError(error => of(''))
          );
          forkJoin(deleteInsurance, deleteAdvice).subscribe(result => {
            this.eventService.openSnackBar('Insurance is deleted', 'Dismiss');
              dialogRef.close();
              this.isRefreshRequired = true;
              this.deleteNewPolicy(deletedId);
              // this.getStepOneAndTwoData();
              this.isRefreshRequired = true;
          }, (error) => {
            this.eventService.openSnackBar('error', 'Dismiss');
          })
        }else{
          this.activityService.deleteAdvice(deletedAdviceId).subscribe(
            data => {
              // this.isRefresh = true;
              this.eventService.openSnackBar('Advice deleted successfully', 'Dismiss');
              this.isRefreshRequired = true;
              this.getStepOneAndTwoData();
              dialogRef.close();
              // this.isRefreshRequired = true;
            },
            error => {
              this.eventService.openSnackBar('error', 'Dismiss');
            }
          );
        }

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
  deleteNewPolicy(id) {
    let singleData = this.needAnalysisData.filter(d => d.id == this.inputData.id);
    let suggestPolicy = singleData[0][0];
    let suggested = suggestPolicy.suggested.length > 0 ? suggestPolicy.suggested : []
    suggested.forEach(element => {
      element.id = element.insurance ? element.insurance.id : element.insuranceDetails.id
    });
    suggested = suggested.filter(d => d.id != id);
    singleData[0][0].suggested = suggested;
    this.ipService.setNeedAnlysisData(this.needAnalysisData);
    this.forkJoinResponse(singleData[0]);
    this.checkAndPushSuggestedData(singleData[0])
  }
  close(data) {
    data.isRefreshRequired = this.isRefreshRequired
    const fragmentData = {
      direction: 'top',
      componentName: ShowHealthPlanningComponent,
      state: 'close',
      data: data
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  // closeUpper(data){
  //   const fragmentData = {
  //     direction: 'top',
  //     componentName: AddInsuranceUpperComponent,
  //     state: 'close',
  //     data,
  //   };

  //   this.eventService.changeUpperSliderState(fragmentData);
  // }
  getGlobalDataInsurance() {
    const obj = {};
    this.custumService.getInsuranceGlobalData(obj).subscribe(
      data => {
        console.log(data),
          this.displayList = data;
      }
    );
  }
  openSuggestHealth(data, value) {
    data.recommendOrNot = value ? (value.isRecommend == 1 ? false : (this.recommendOrNot ? true : false)) : (this.recommendOrNot ? true : false);
    data.data = value;
    data.adviceStringObj = this.stringObject;
    data.insuranceTypeId = 2;
    data.insuranceSubTypeId = data.insuranceType;
    data.displayList = this.displayList;
    data.adviceDetails = this.adviceDetails
    data.showInsurance = this.showInsurance;
    data.inputData = this.inputData;
    data.adviceName = this.adviceName;
    data.flag = 'ExistingSuggestNew';
    const fragmentData = {
      flag: 'suggestExistingPolicy',
      data: data,
      componentName: null,
      id: 1,
      state: 'open',
    };
    switch (data.insuranceType) {
      case 5:
        fragmentData.componentName = SuggestHealthInsuranceComponent;
        break;
      case 7:
        fragmentData.componentName = PersonalInsuranceComponent;
        break;
      case 6:
        fragmentData.componentName = CriticalInsuranceComponent;
        break;
      case 4:
        fragmentData.componentName = MotorInsuranceComponent;
        break;
      case 8:
        fragmentData.componentName = TravelInsuranceComponent;
        break;
      case 9:
        fragmentData.componentName = HouseholdersInsuranceComponent;
        break;
      case 10:
        fragmentData.componentName = FireInsuranceComponent;
        break;
      default:
        fragmentData.componentName = SuggestHealthInsuranceComponent;
        break;

    }
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.refreshRequired) {
            this.isRefreshRequired = true;
            if (sideBarData.data.adviceId) {
              this.stringObject = sideBarData.data
              let id = sideBarData.data.adviceId;
              this.adviceName = (id == 1) ? 'Continue' : (id == 2) ? 'Discontinue' : (id == 3) ? 'Port policy' : (id == 4) ? 'Increase sum assured' : (id == 5) ? 'Decrease sum assured' : (id == 6) ? 'Add members' : (id == 7) ? 'Remove members' : ''
              this.dataSource[0].advice = this.adviceName
              this.dataSaved = true;
              this.getDataSource3(this.stringObject);
            } else {
              // this.dataSaved = true;
              // this.stringObject = sideBarData.data
              // this.getDataSource3(this.stringObject);
              this.getStepOneAndTwoData();
            }
            // this.getStepOneAndTwoData();
          } else {
            this.isRefreshRequired = false;
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  getDataSource3(data) {
    let Arry = [{ advice: this.adviceName, insuranceDetails: data.stringObject }]
    Arry = this.getFilterData(Arry)
    this.dataSource3 = Arry
  }
  getOutput(value) {
    this.showNewPolicy = false;
  }
  saveAdviceAndClose(data) {
    if (this.stringObject && (this.adviceName == 'Port policy' || this.adviceName == 'Increase sum assured' || this.adviceName == 'Decrease sum assured' || this.adviceName == 'Add members' || this.adviceName == 'Remove members')) {
      this.planService.addAdviseOnGeneralInsurance(this.stringObject).subscribe(
        res => {
          this.eventService.openSnackBar("Advice given sucessfully", "Dimiss");
          this.close(data)
        }, err => {
          this.eventService.openSnackBar(err, "Dimiss");
        }
      )
    } else {
      this.close(data)
    }
  }
  addGeneralInsurance(id) {
    let obj = {
      "planningList":
        JSON.stringify({
          "advisorId": this.advisorId,
          "clientId": this.clientId,
          "insuranceType": this.inputData.insuranceType,
          "owners": this.ownerIds
        }),
      "needAnalysis": JSON.stringify([id])
    }

    this.planService.addGeneralInsurance(obj).subscribe(
      data => {
        if (data) {
          this.getStepOneAndTwoData();
        }
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
  openHelthInsurance(data) {
    if (data == null) {
      data = {}
      data.showExisting = true
    } else {
      data.showExisting = true
    }
    data.flag = "suggestExistingPolicy";
    const fragmentData = {
      flag: 'suggestExistingPolicy',
      data,
      componentName: AddHealthInsuranceComponent,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.refreshRequired) {
            this.isRefreshRequired = true;
            // this.insuranceIds.push(sideBarData.data)
            this.getStepOneAndTwoData();
          } else {
            this.isRefreshRequired = false;
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  advice: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Apollo Munich Optima Restore', name: '27,290/year', weight: 'Rahul Jain | 38Y',
    symbol: '5,00,000', advice: 'Port policy'
  },

];

export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    position: 'ICICI Lombard Health Suraksha (Recommended)',
    name: '32,300/year', weight: 'Rahul Jain | 38Y', symbol: '20,00,000'
  },
  {
    position: 'HDFC Ergo Health Super (Option 2)',
    name: '35,100/year', weight: 'Rahul Jain | 38Y', symbol: '20,00,000'
  },
];