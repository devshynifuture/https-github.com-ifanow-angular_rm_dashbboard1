import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { AddInsuranceComponent } from '../../../common-component/add-insurance/add-insurance.component';
import { DetailedViewComponent } from "../../../common-component/detailed-view/detailed-view.component";
import { AddHealthInsuranceAssetComponent } from './add-health-insurance-asset/add-health-insurance-asset.component';
import { AddPersonalAccidentInAssetComponent } from './add-personal-accident-in-asset/add-personal-accident-in-asset.component';
import { AddCriticalIllnessInAssetComponent } from './add-critical-illness-in-asset/add-critical-illness-in-asset.component';
import { AddMotorInsuranceInAssetComponent } from './add-motor-insurance-in-asset/add-motor-insurance-in-asset.component';
import { AddTravelInsuranceInAssetComponent } from './add-travel-insurance-in-asset/add-travel-insurance-in-asset.component';
import { AddHomeInsuranceInAssetComponent } from './add-home-insurance-in-asset/add-home-insurance-in-asset.component';
import { AddFireAndPerilsInsuranceInAssetComponent } from './add-fire-and-perils-insurance-in-asset/add-fire-and-perils-insurance-in-asset.component';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})

export class InsuranceComponent implements OnInit {
  displayedColumns = ['no', 'life', 'name', 'number', 'sum', 'cvalue', 'premium', 'term', 'pterm', 'desc', 'status', 'icons'];
  displayedColumns1 = ['no', 'owner', 'cvalue', 'amt', 'mvalue', 'rate', 'mdate', 'type', 'ppf', 'desc', 'status', 'icons'];
  displayedColumns2 = ['no', 'life', 'insurerName', 'sumInsured', 'premiumAmount', 'policyExpiryDate', 'Duration', 'planName', 'policyNumber','status', 'icons'];

  dataSource1;
  isLoading = false;
  advisorId: any;
  insuranceSubTypeId: any;
  clientId: any;
  noData: string;
  lifeInsuranceFlag: boolean;
  generalInsuranceFlag: boolean;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  data2: Array<any> = [{}, {}, {}];
  dataSourceGeneralInsurance = new MatTableDataSource(this.data);
  @ViewChild("tableOne", { static: true }) sort: MatSort;
  lifeInsuranceList = [{ name: 'Term', id: 1 }, { name: 'Traditional', id: 2 }, { name: 'ULIP', id: 3 }];

  viewMode;
  dislayList: any;
  sumAssured = 0;
  totalSumAssured=0;
  totalPremiunAmount=0;
  totalCurrentValue = 0;
  totalPremiunAmountLifeIns = 0;
  totalSumAssuredLifeIns = 0;

  constructor(private eventService: EventService, public dialog: MatDialog,
    private subInjectService: SubscriptionInject, private cusService: CustomerService) {
  }

  generalLifeInsuranceList = [/*"Health", "Car/2 Wheeler", "Travel", "Personal accident", "Critical illness", "Cancer", "Home", "Others"*/];
  insuranceTypeId;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.insuranceTypeId = 1;
    this.insuranceSubTypeId = 0;
    this.getGlobalDataInsurance();
    this.getInsuranceData(1);
    this.lifeInsuranceFlag = true;
    this.generalInsuranceFlag = false;
  }

  getInsuranceSubTypeData(advisorId, clientId, insuranceId, insuranceSubTypeId) {
    this.dataSource = new MatTableDataSource([{}, {}, {}]);
    this.dataSourceGeneralInsurance = new MatTableDataSource([{}, {}, {}]);
    this.isLoading = true;
    const obj = {
      advisorId: advisorId,
      clientId: clientId,
      insuranceSubTypeId: insuranceSubTypeId,
      insuranceTypeId: insuranceId
    };
    if(insuranceId==1){
      this.cusService.getLifeInsuranceData(obj).subscribe(
        data => this.getInsuranceDataResponse(data)
      );
    }else{
      delete obj.insuranceTypeId;
      this.cusService.getGeneralInsuranceData(obj).subscribe(
        data => this.getGeneralInsuranceDataRes(data)
      );
    }
 
  }

  getInsuranceDataResponse(data) {
    this.isLoading = false
    if (data) {
      this.dataSource.data = data.insuranceList;
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.data.forEach(element => {
        this.totalCurrentValue += (element.currentValue) ? element.currentValue :0,
        this.totalPremiunAmountLifeIns += (element.premiumAmount) ? element.premiumAmount :0
        this.totalSumAssuredLifeIns +=( element.sumAssured) ?  element.sumAssured :0
      });
    } else {
      this.dataSource.data = [];
    }
  }

  getInsuranceData(typeId) {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource([{}, {}, {}]);
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      insuranceTypeId: typeId
    };
    // this.dataSource.data = [{}, {}, {}];
    this.cusService.getInsuranceData(obj).subscribe(
      data => this.getInsuranceDataRes(data)
      // , (error) => {
      //   this.eventService.openSnackBar('Something went wrong!', 'Dismiss');
      //   this.dataSource.data = [];
      //   this.isLoading = false;
      // }
    );
  }
  getInsuranceDataRes(data) {
    if (data) {
      this.dataSource.data = data.insuranceList;
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.data.forEach(element => {
        this.totalCurrentValue += (element.currentValue) ? element.currentValue :0,
        this.totalPremiunAmountLifeIns += (element.premiumAmount) ? element.premiumAmount :0
        this.totalSumAssuredLifeIns +=( element.sumAssured) ?  element.sumAssured :0
      });
      this.isLoading = false;
    } else {
      this.dataSource.data = [];
  
    }
  }
  getGeneralInsuranceDataRes(data) {
  
    if (data) {
      this.dataSourceGeneralInsurance.data = data.generalInsuranceList;
      this.dataSourceGeneralInsurance = new MatTableDataSource(this.dataSourceGeneralInsurance.data);
      this.dataSourceGeneralInsurance.sort = this.sort;
      this.totalSumAssured= 0;
      this.totalPremiunAmount= 0;
      this.dataSourceGeneralInsurance.data.forEach(element => {
        this.sumAssured = 0;
        element.insuredMembers.forEach(ele => {
          this.sumAssured += ele.sumInsured
        });
        element.sumAssured = this.sumAssured
      });
      this.dataSourceGeneralInsurance.data.forEach(element => {
        this.totalSumAssured += element.sumAssured,
        this.totalPremiunAmount += element.premiumAmount

      });
      this.isLoading = false;
    } else {
      this.dataSourceGeneralInsurance.data = [];
  
    }
  }
  getGlobalDataInsurance() {
    const obj = {};
    this.cusService.getInsuranceGlobalData(obj).subscribe(
      data => {
        console.log(data),
        this.dislayList = data;
      }
    );
  }

  getInsuranceTypeData(typeId, typeSubId) {
    this.lifeInsuranceFlag = false;
    this.insuranceTypeId = typeId;
    this.insuranceSubTypeId = typeSubId;
    this.getInsuranceSubTypeData(this.advisorId, this.clientId, typeId, typeSubId);
  }

  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        if(this.insuranceTypeId == 1){
          this.cusService.deleteInsurance(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Insurance is deleted', 'Dismiss');
              dialogRef.close();
              this.getInsuranceData(this.insuranceTypeId)
            },
            error => this.eventService.showErrorMessage(error)
          );
        }else{
          this.cusService.deleteGeneralInsurance(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Insurance is deleted', 'Dismiss');
              dialogRef.close();
              this.getInsuranceSubTypeData(this.advisorId, this.clientId, this.insuranceTypeId, this.insuranceSubTypeId); 
            },
            error => this.eventService.showErrorMessage(error)
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

  toggle(value) {
    if (value === 'lifeInsurance') {
      this.lifeInsuranceFlag = true;
      this.generalInsuranceFlag = false;
      this.insuranceSubTypeId = 0;
      this.generalLifeInsuranceList = [];
      this.lifeInsuranceList = [];
      [{ name: 'Term', id: 1 }, { name: 'Traditional', id: 2 }, { name: 'ULIP', id: 3 }].map((i) => {
        this.lifeInsuranceList.push(i);
      });
    } else {
      this.lifeInsuranceList = [];
      this.lifeInsuranceFlag = false;
      this.generalInsuranceFlag = true;
      this.generalLifeInsuranceList = [];
      [{ name: 'Health', id: 4 }, { name: 'Personal accident', id: 5 }, { name: 'Critical illness', id: 6 }, {
        name: 'Motor',
        id: 7
      }, { name: 'Travel', id: 8 }, { name: 'Home', id: 9 }, { name: 'Fire & special perils', id: 10 }, {
        name: 'Others',
        id: 11
      }].map((i) => {
        this.generalLifeInsuranceList.push(i);
      });
    }
  }

  editInsurance(data) {
    console.log(data);
  }

  open(data) {
    const fragmentData = {
      flag: 'detailedView',
      data,
      componentName: DetailedViewComponent,
      insuranceTypeId: this.insuranceTypeId,
      insuranceSubTypeId: this.insuranceSubTypeId,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getInsuranceSubTypeData(this.advisorId, this.clientId, this.insuranceTypeId, this.insuranceSubTypeId);
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

  openAddInsurance(data) {

  
    const inputData = {
      data,
      insuranceTypeId: this.insuranceTypeId,
      insuranceSubTypeId: this.insuranceSubTypeId,
      displayList:this.dislayList,
    };
    const fragmentData = {
      flag: 'addInsurance',
      data: inputData,
      componentName:null,
      state: 'open'
    };
    switch (this.insuranceSubTypeId) {
      case 1:
        fragmentData.componentName = AddInsuranceComponent;
        break;
      case 2: 
        fragmentData.componentName = AddInsuranceComponent;
        break;
      case 3: 
        fragmentData.componentName = AddInsuranceComponent;
        break;
      case 4: 
        fragmentData.componentName = AddHealthInsuranceAssetComponent;
        break;
        case 5: 
        fragmentData.componentName = AddPersonalAccidentInAssetComponent;
        break;
        case 6: 
        fragmentData.componentName = AddCriticalIllnessInAssetComponent;
        break;
        case 7: 
        fragmentData.componentName = AddMotorInsuranceInAssetComponent;
        break;
        case 8: 
        fragmentData.componentName = AddTravelInsuranceInAssetComponent;
        break;
        case 9:
        fragmentData.componentName = AddHomeInsuranceInAssetComponent;
        break;
        case 10: 
        fragmentData.componentName = AddFireAndPerilsInsuranceInAssetComponent;
        break;
        default:
        fragmentData.componentName = AddInsuranceComponent;
          break; 
       
    }
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if(sideBarData.data){
            this.lifeInsuranceFlag = true
            if(this.insuranceTypeId==1){
              this.insuranceSubTypeId = 0;
              this.getInsuranceData(this.insuranceTypeId)
              console.log('this is sidebardata in subs subs 2: ', sideBarData);
            }else{
              this.getInsuranceSubTypeData(this.advisorId, this.clientId, this.insuranceTypeId, this.insuranceSubTypeId) 
            }
            
          }

          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

}


export interface PeriodicElement {
  no: string;
  life: string;
  name: string;
  number: string;
  sum: string;
  cvalue: string;
  premium: string;
  term: string;
  pterm: string;
  desc: string;
  status: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    no: '1', life: 'Rahul Jain', name: 'Cumulative', number: '358656327863', sum: '94,925', cvalue: '60,000',
    premium: '1,00,000', term: '45', pterm: '45', desc: 'ICICI FD', status: 'MATURED'
  },
  {
    no: '2', life: 'Shilpa Jain', name: 'Cumulative', number: '358656327863', sum: '94,925', cvalue: '60,000',
    premium: '1,00,000', term: '45', pterm: '45', desc: 'ICICI FD', status: 'MATURED'
  },
  {
    no: '', life: '', name: '', number: '', sum: '94,925', cvalue: '60,000',
    premium: '1,00,000', term: '', pterm: '', desc: '', status: ''
  },
];

export interface PeriodicElement1 {
  no: string;
  owner: string;
  cvalue: string;
  amt: string;
  mvalue: string;
  rate: string;
  mdate: string;
  type: string;
  ppf: string;
  desc: string;
  status: string;

}
