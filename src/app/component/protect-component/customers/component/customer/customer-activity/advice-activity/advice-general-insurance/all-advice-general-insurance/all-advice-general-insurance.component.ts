import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../../actiity.service';
import { AdviceUtilsService } from '../../advice-utils.service';
import { CustomerService } from '../../../../customer.service';
import { forkJoin } from 'rxjs';
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
  allAdvice = true
  displayList: any;
  object: { data: any; displayList: any; showInsurance: string; insuranceSubTypeId: number; insuranceTypeId: number; };
  sumAssured: any;
  healthCpy: any;
  presonalCpy: any;
  criticalCpy: any;
  motorCpy: any;
  travelCpy: any;
  homeCpy: any;
  fireCpy: any;
  GIData: any;
  constructor(public dialog: MatDialog, private cusService: CustomerService, private subInjectService: SubscriptionInject, private activityService: ActiityService, private eventService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    // this.getAllCategory();
    this.getAdviceByAsset();
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
      insuranceSubTypeId:0  
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
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      // assetCategory: 10,
      // adviceStatusId:1
      categoryMasterId: 4,
      categoryTypeId: 4,
      status: 1
    }
    const obj2 = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      insuranceSubTypeId: 0,
      id: 0
    };
    const displayList = this.cusService.getInsuranceGlobalData({});
    const allAsset = this.activityService.getAllAsset(obj);
    const portfoliGi = this.cusService.getGeneralInsuranceData(obj2);
    forkJoin(displayList, allAsset , portfoliGi).subscribe(result => {
      this.displayList = result[0];
      this.GIData = result[2].generalInsuranceList;
      this.getAllSchemeResponse(result[1]);
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
    this.isLoading = false;
    // let healthData = this.filterForAsset(data.HEALTH)
    let healthData = this.filterData(data.HEALTH,5);
    this.healthCpy = healthData;
    this.healthInsuranceDataSource.data = healthData;
    let personalData = this.filterData(data.PERSONAL_ACCIDENT,7);
    this.presonalCpy = healthData;
    this.personalAccidentDataSource.data = personalData;
    let critical = this.filterData(data.CRITICAL_ILLNESS,6);
    this.criticalCpy = healthData;
    this.criticalInsDataSource.data = critical;
    let motorData = this.filterData(data.MOTOR,4);
    this.motorCpy = healthData;
    this.motorDataSource.data = motorData;
    let travelData = this.filterData(data.TRAVEL,8);
    this.travelCpy = healthData;
    this.travelDataSource.data = travelData;
    let homeData = this.filterData(data.HOME,9);
    this.homeCpy = healthData;
    this.homeInsDataSource.data = homeData;
    let fireData = this.filterData(data.FIRE,10);
    this.fireCpy = healthData;
    this.FireDataSource.data = fireData;
    this.healthInsuranceDataSource['tableFlag'] = (data.HEALTH.length == 0) ? false : true;
    this.personalAccidentDataSource['tableFlag'] = (data.PERSONAL_ACCIDENT.length == 0) ? false : true;
    this.criticalInsDataSource['tableFlag'] = (data.CRITICAL_ILLNESS.length == 0) ? false : true;
    this.motorDataSource['tableFlag'] = (data.MOTOR.length == 0) ? false : true;
    this.travelDataSource['tableFlag'] = (data.TRAVEL.length == 0) ? false : true;
    this.homeInsDataSource['tableFlag'] = (data.HOME.length == 0) ? false : true;
    this.FireDataSource['tableFlag'] = (data.FIRE.length == 0) ? false : true;
    console.log("::::::::::::::::", data)
  }
  filterData(data,id) {
    let GIArry = this.GIData.filter(item => item.insuranceSubTypeId === id);
    if(GIArry.length > 0){
      GIArry.forEach(element => {
        element.adviceDetails={adviceToCategoryTypeMasterId: 4,adviceStatusId:0,adviceId:0};
        element.InsuranceDetails = element
      });
    }else{
      GIArry = [];
    }
    if(data.length > 0){
      if(GIArry.length > 0 && data.length > 0){
        data = [...GIArry, ...data];
      }
      this.sumAssured = 0;
      data.forEach(element => {
        element.adviceDetails.adviceToCategoryTypeMasterId = 4
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
        if (element.InsuranceDetails.hasOwnProperty("policyFeatures") &&
          element.InsuranceDetails.policyFeatures.length > 0) {
          element.InsuranceDetails.policyFeatures.forEach(ele => {
            this.sumAssured += ele.featureSumInsured;
          });
          element.InsuranceDetails.sumAssured = this.sumAssured;
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
      });
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
  openAddEditAdvice(value, data) {
    let component;
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
    data ? data['adviceHeaderList'] = this.adviceHeaderList : null;
    const fragmentData = {
      flag: 'Advice General Insurance',
      data,
      id: 1,
      state: 'open',
      componentName: SuggestAdviceComponent,
      childComponent: component,
      childData: { data: data ? data.InsuranceDetails : null, displayList: this.displayList, showInsurance: this.object.showInsurance, insuranceSubTypeId: this.object.insuranceSubTypeId, insuranceTypeId: 2, flag: 'Advice General Insurance' },
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
    array = (name == 'Health Insurance') ? this.healthCpy : (name == 'Personal accident') ? this.presonalCpy :(name == 'Critical illness') ? this.criticalCpy : (name == 'Motor insurance') ? this.motorCpy : (name == 'Travel insurance') ? this.travelCpy : (name == 'Home insurance') ? this.homeCpy :(name == 'Fire & special perils insurance') ? this.fireCpy : this.fireCpy;
    dataFiltered = array.filter(function (item) {
      return item.adviceDetails[key] === parseInt(value);
    });
    if (dataFiltered.length > 0) {
      dataSource.data = dataFiltered;
      dataSource = new MatTableDataSource(dataSource.data);
    } else {
      this.eventService.openSnackBar("No data found", "Dismiss")
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
            this.getAdviceByAsset()
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
