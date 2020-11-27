import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { MatTableDataSource } from '@angular/material';
import { AdviceUtilsService } from '../advice-utils.service';
import { ActiityService } from '../../actiity.service';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from '../../../customer.service';
import { forkJoin } from 'rxjs';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { SuggestAdviceComponent } from '../suggest-advice/suggest-advice.component';
import { AddHealthInsuranceAssetComponent } from '../../../accounts/insurance/add-health-insurance-asset/add-health-insurance-asset.component';
import { AddPersonalAccidentInAssetComponent } from '../../../accounts/insurance/add-personal-accident-in-asset/add-personal-accident-in-asset.component';
import { AddCriticalIllnessInAssetComponent } from '../../../accounts/insurance/add-critical-illness-in-asset/add-critical-illness-in-asset.component';
import { AddMotorInsuranceInAssetComponent } from '../../../accounts/insurance/add-motor-insurance-in-asset/add-motor-insurance-in-asset.component';
import { AddTravelInsuranceInAssetComponent } from '../../../accounts/insurance/add-travel-insurance-in-asset/add-travel-insurance-in-asset.component';
import { AddHomeInsuranceInAssetComponent } from '../../../accounts/insurance/add-home-insurance-in-asset/add-home-insurance-in-asset.component';
import { AddFireAndPerilsInsuranceInAssetComponent } from '../../../accounts/insurance/add-fire-and-perils-insurance-in-asset/add-fire-and-perils-insurance-in-asset.component';

@Component({
  selector: 'app-advice-general-insurance',
  templateUrl: './advice-general-insurance.component.html',
  styleUrls: ['./advice-general-insurance.component.scss']
})
export class AdviceGeneralInsuranceComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'empcon', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  adviceHeaderList = [{ id: '1', value: 'Continue' }, { id: '2', value: 'Discontinue' }, { id: '3', value: 'Port policy' }, { id: '4', value: 'Increase sum assured' }, { id: '5', value: 'Decrease sum assured' }, { id: '6', value: 'Add members' }, { id: '7', value: 'Remove members' }]
  advisorId: any;
  clientId: any;
  isLoading: boolean;
  selectedAssetId: any = [];
  healthInsuranceDataSource = new MatTableDataSource([{}, {}, {}]);
  personalAccidentDataSource = new MatTableDataSource([{}, {}, {}]);
  healthCount: any;
  personalCount: any;
  criticalInsDataSource = new MatTableDataSource([{}, {}, {}]);
  criticalCount: any;
  motorDataSource = new MatTableDataSource([{}, {}, {}]);
  motorCount: any;
  travelDataSource = new MatTableDataSource([{}, {}, {}]);
  travelCount: any;
  homeInsDataSource = new MatTableDataSource([{}, {}, {}]);
  homeCount: any;
  FireDataSource = new MatTableDataSource([{}, {}, {}]);
  fireCount: any;
  allAdvice = false
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
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      // assetCategory: 10,
      // adviceStatusId:1
      categoryMasterId: 4,
      categoryTypeId: 4,
      status: 1
    }
    this.activityService.getAllAsset(obj).subscribe(
      data => {
        this.getAllSchemeResponse(data);
      }, (error) => {
        this.eventService.openSnackBar('error', 'Dismiss');
        this.isLoading = false;
        this.healthInsuranceDataSource.data = [];
        this.personalAccidentDataSource.data = [];
        this.criticalInsDataSource.data = [];
        this.motorDataSource.data = [];
        this.travelDataSource.data = [];
        this.homeInsDataSource.data = [];
        this.FireDataSource.data = [];
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
    // let healthData = this.filterForAsset(data.HEALTH)
    let healthData = data.HEALTH
    this.healthInsuranceDataSource.data = healthData;
    let personalData = data.PERSONAL_ACCIDENT
    this.personalAccidentDataSource.data = personalData;
    let critical = data.CRITICAL_ILLNESS
    this.criticalInsDataSource.data = critical;
    let motorData = data.MOTOR
    this.motorDataSource.data = motorData;
    let travelData = data.TRAVEL
    this.travelDataSource.data = travelData;
    let homeData = data.HOME
    this.homeInsDataSource.data = homeData;
    let fireData = data.FIRE
    this.FireDataSource.data = fireData;
    this.healthInsuranceDataSource['tableFlag'] = (data.PPF.length == 0) ? false : true;
    this.personalAccidentDataSource['tableFlag'] = (data.NSC.length == 0) ? false : true;
    this.criticalInsDataSource['tableFlag'] = (data.SSY.length == 0) ? false : true;
    this.motorDataSource['tableFlag'] = (data.KVP.length == 0) ? false : true;
    this.travelDataSource['tableFlag'] = (data.SCSS.length == 0) ? false : true;
    this.homeInsDataSource['tableFlag'] = (data.PO_Savings.length == 0) ? false : true;
    this.FireDataSource['tableFlag'] = (data.PO_RD.length == 0) ? false : true;
    console.log("::::::::::::::::", data)
  }
  checkAll(flag, tableDataList, tableFlag) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.selectedAssetId = selectedIdList;
    this.getFlagCount(tableFlag, count)
    // console.log(this.selectedAssetId);
  }
  openAddEditAdvice(value, data) {
    let component;
    if (!data) {
      this.object = { data: data, displayList: this.displayList, showInsurance: '', insuranceSubTypeId: 1, insuranceTypeId: 2 }
      switch (value) {
        case "Health Insurance":
          this.object.insuranceSubTypeId = 5;
          this.object.showInsurance = 'Health';
          component = AddHealthInsuranceAssetComponent;
          break;
        case "Personal accident":
          this.object.insuranceSubTypeId = 7;
          this.object.showInsurance = 'Personal accident';
          component = AddPersonalAccidentInAssetComponent;
          break;
        case "Critical illness":
          this.object.insuranceSubTypeId = 6;
          this.object.showInsurance = 'Critical illness';
          component = AddCriticalIllnessInAssetComponent;
          break;
        case "Motor insurance":
          this.object.insuranceSubTypeId = 4;
          this.object.showInsurance = 'Motor';
          component = AddMotorInsuranceInAssetComponent;
          break;
        case "Travel insurance":
          this.object.insuranceSubTypeId = 8;
          this.object.showInsurance = 'Travel';
          component = AddTravelInsuranceInAssetComponent;
          break;
        case "Home insurance":
          this.object.insuranceSubTypeId = 9;
          this.object.showInsurance = 'Home';
          component = AddHomeInsuranceInAssetComponent;
          break;
        case "Fire & special perils insurance":
          this.object.insuranceSubTypeId = 10;
          this.object.showInsurance = 'Fire & special perils';
          component = AddFireAndPerilsInsuranceInAssetComponent;

          break;
      }
    }
    data ? data['adviceHeaderList'] = this.adviceHeaderList : data = { adviceHeaderList: this.adviceHeaderList };
    const fragmentData = {
      flag: 'Advice Insurance',
      data,
      id: 1,
      state: 'open',
      componentName: SuggestAdviceComponent,
      childComponent: component,
      childData: { data: data, displayList: this.displayList, showInsurance: this.object.showInsurance, insuranceSubTypeId: this.object.insuranceSubTypeId, insuranceTypeId: 2, flag: 'Advice Insurance' },
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
  checkSingle(flag, selectedData, tableData, tableFlag) {
    if (flag.checked) {
      selectedData.selected = true;
      this.selectedAssetId.push(selectedData.assetDetails.id)
    }
    else {
      selectedData.selected = false
      this.selectedAssetId.splice(this.selectedAssetId.indexOf(selectedData.assetDetails.id), 1);
    }
    let countValue = AdviceUtilsService.selectSingleCheckbox(Object.assign([], tableData));
    this.getFlagCount(tableFlag, countValue)
    console.log(this.selectedAssetId)
  }

}
