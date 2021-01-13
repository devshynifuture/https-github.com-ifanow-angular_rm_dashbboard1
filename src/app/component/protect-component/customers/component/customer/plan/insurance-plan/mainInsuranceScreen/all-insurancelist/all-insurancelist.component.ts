import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AddNewInsuranceComponent } from '../../add-new-insurance/add-new-insurance.component';
import { UtilService, LoaderFunction } from 'src/app/services/util.service';
import { AddPlaninsuranceComponent } from '../../add-planinsurance/add-planinsurance.component';
import { AddInsurancePlanningComponent } from '../../add-insurance-planning/add-insurance-planning.component';
import { AddInsuranceUpperComponent } from '../../add-insurance-upper/add-insurance-upper.component';
import { AddSuggestPolicyComponent } from '../../add-suggest-policy/add-suggest-policy.component';
import { CurrentPolicyComponent } from '../../current-policy/current-policy.component';
import { PlanService } from '../../../plan.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatTableDataSource } from '@angular/material';
import { InsurancePlanningServiceService } from '../../insurance-planning-service.service';
import { RoleService } from 'src/app/auth-service/role.service';

@Component({
  selector: 'app-all-insurancelist',
  templateUrl: './all-insurancelist.component.html',
  styleUrls: ['./all-insurancelist.component.scss']
})
export class AllInsurancelistComponent implements OnInit {


  displayedColumns = ['pname', 'sum2', 'premium2', 'status', 'empty'];
  displayedColumns1 = ['name', 'sum', 'premium', 'returns', 'advice'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2 = ['name', 'annual', 'amt', 'icons'];
  dataSource2 = ELEMENT_DATA2;
  dataSource: any = new MatTableDataSource();
  insurancePlanningList = [{}, {}, {}]
  insuranceList = [{
    header: 'Add Life insurance',
    heading: 'Life insurance',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125641/svg_assets/LIsmall.svg',
  }, {
    header: 'Add Health insurance',
    heading: 'Health insurance',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125641/svg_assets/HIsmall.svg',
  }, {
    header: 'Add Critical Insurance',
    heading: 'Critical illness',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606126530/svg_assets/CIsmall.svg',
  }, {
    header: 'Add Cancer Insurance',
    heading: 'Cancer care',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606126528/svg_assets/CCsmall.svg',
  }, {
    header: 'Add Personal accident',
    heading: 'Personal accident',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125643/svg_assets/PAsmall.svg',
  }, {
    header: 'Add Fire Insurance',
    heading: 'Fire insurance',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125641/svg_assets/FIsmall.svg',
  }, {
    header: 'Add Householders Insurance',
    heading: 'Householders',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125641/svg_assets/Hsmall.svg',
  },
  {
    header: 'Add Other Insurance',
    heading: 'Other insurance',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125641/svg_assets/Hsmall.svg',
  }]
  detailsInsurance: any;
  clientId: any;
  advisorId: any;
  insuranceLoader: boolean;
  counter: any;
  data: Array<any> = [{}, {}, {}];
  // showIsurance: boolean = false;
  showIsurance: boolean = true; //page initial loads blank ..
  isLoadingInInsurance: any;
  id = 0;
  index: any;
  selectedId: any;
  allInsuranceData: any;
  plannerObj: any;
  clientIdToClearStorage: string;
  constructor(private subInjectService: SubscriptionInject,
    private planService: PlanService,
    private eventService: EventService,
    private ipService: InsurancePlanningServiceService,
    public roleService: RoleService) {
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId()
  }

  isLoading = false;
  isLoadingPlan = false;
  ngOnInit() {
    // this.detailsInsurance = {}
    this.ipService.getClientId().subscribe(res => {
      this.clientIdToClearStorage = res;
    });
    if (this.clientIdToClearStorage) {
      if (this.clientIdToClearStorage != this.clientId) {
        this.ipService.clearStorage();
      }
    }
    this.ipService.setClientId(this.clientId);
    this.ipService.getAllInsuranceData()
      .subscribe(res => {
        this.allInsuranceData = res;
      })
    this.ipService.getPlannerObj()
      .subscribe(res => {
        this.plannerObj = res;
      })
    if (!this.allInsuranceData && this.allInsuranceData == '') {
      this.getInsuranceList();
    } else {
      this.isLoadingInInsurance = { isLoading: false };
      this.getInsurancePlaningListRes(this.allInsuranceData);
    }
  }
  openDetailsInsurance(insurance) {
    this.selectedId = insurance.id
    console.log('insurance', insurance)
    this.detailsInsurance = insurance
    this.detailsInsurance.dataLoaded = true;
    this.showIsurance = true
  }
  getInsuranceList() {
    this.showIsurance = true
    this.isLoadingInInsurance = { isLoading: true };
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.loader(1);
    this.isLoadingPlan = true;
    this.planService.getInsurancePlaningList(obj).subscribe(
      data => this.getInsurancePlaningListRes(data),
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        this.insuranceLoader = true;
        this.isLoadingPlan = false;
        this.showIsurance = false
        this.loader(-1);
      }
    );
  }
  getOutput(value) {
    if (value) {
      if (value.loadResponse) {
        this.allInsuranceData.length == 0 ? this.allInsuranceData = null : this.allInsuranceData;
        this.selectedId = this.allInsuranceData ? this.allInsuranceData[0].id : ''
        this.getInsurancePlaningListRes(this.allInsuranceData)
      } else if (value.id) {
        this.id = value.id;
      } else {
        this.selectedId = '';
      }
      if (value.isRefreshRequired) {
        this.getInsuranceList()
      }
    }
  }
  getInsurancePlaningListRes(data) {
    // this.selectedId='';
    this.loader(-1);
    if (data) {
      data.forEach(singleInsuranceData => {
        if (singleInsuranceData.owners.length > 0) {
          singleInsuranceData.displayHolderName = singleInsuranceData.owners[0].holderName;
          singleInsuranceData.displayHolderName = singleInsuranceData.owners[0].holderName;
          singleInsuranceData.displayHolderId = singleInsuranceData.owners[0].ownerId;
          if (singleInsuranceData.owners.length > 1) {
            for (let i = 1; i < singleInsuranceData.owners.length; i++) {
              if (singleInsuranceData.owners[i].holderName) {
                const firstName = (singleInsuranceData.owners[i].holderName as string).split(' ')[0];
                singleInsuranceData.displayHolderName += ', ' + firstName;
              }
            }
          }
        } else {
          singleInsuranceData.displayHolderName = '';
        }
      });
      this.dataSource = data
      this.dataSource.forEach(element => {
        if (element.insuranceType == 1) {
          element.header = 'Add Life insurance'
          element.heading = 'Life insurance'
          element.logo = '/assets/images/svg/LIsmall.svg'
        } else if (element.insuranceType == 5) {
          element.value = '1';
          element.header = 'Add Health insurance'
          element.heading = 'Health insurance'
          element.logo = '/assets/images/svg/HIsmall.svg'
        } else if (element.insuranceType == 6) {
          element.value = '2';
          element.header = 'Add Critical insurance'
          element.heading = 'Critical illness'
          element.logo = '/assets/images/svg/CIsmall.svg'
        } else if (element.insuranceType == 10) {
          element.value = '6';
          element.header = 'Add Fire insurance'
          element.heading = 'Fire insurance'
          element.logo = '/assets/images/svg/FIsmall.svg'
        } else if (element.insuranceType == 9) {
          element.value = '5';
          element.header = 'Add Home insurance'
          element.heading = 'Home insurance'
          element.logo = '/assets/images/svg/Hsmall.svg'
        } else if (element.insuranceType == 7) {
          element.value = '4';
          element.header = 'Add Personal accident'
          element.heading = 'Personal accident'
          element.logo = '/assets/images/svg/PAsmall.svg'
        } else if (element.insuranceType == 8) {
          element.value = '7';
          element.header = 'Add Travel insurance'
          element.heading = 'Travel insurance'
          element.logo = '/assets/images/svg/PAsmall.svg'
        } else if (element.insuranceType == 4) {
          element.value = '8';
          element.header = 'Add Motor insurance'
          element.heading = 'Motor insurance'
          element.logo = '/assets/images/svg/PAsmall.svg'
        }
      });
      console.log(this.dataSource)
      this.insuranceList = this.dataSource
      this.insurancePlanningList = this.dataSource;
      this.ipService.setAllInsuranceData(this.insurancePlanningList);
      if (!this.selectedId) {
        this.selectedId = this.dataSource[0].id;
      }
      if (this.id) {
        this.index = this.dataSource.findIndex(x => x.id === this.id);
        this.detailsInsurance = this.insuranceList[this.index]
      } else {
        this.detailsInsurance = this.insuranceList[0]
      }
      if (this.detailsInsurance) {
        this.detailsInsurance.dataLoaded = true;
      } else {
        this.detailsInsurance = { dataLoaded: true }
      }

      this.showIsurance = true;
    } else {
      this.showIsurance = false;
    }
  }
  loader(increamenter) {
    this.counter += increamenter;
    if (this.counter == 0) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }
  addnewinsurance(data) {
    console.log('hello mf button clicked');
    const fragmentData = {
      flag: 'openAddgoals',
      id: 1,
      data,
      direction: 'top',
      componentName: AddNewInsuranceComponent,
      state: 'open'
    };

    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }
  openAddPlanInsurance(data) {
    this.isLoading = true;
    const fragmentData = {
      flag: 'addPlanInsurance',
      data,
      componentName: AddPlaninsuranceComponent,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
          this.isLoading = false;

        }
      }
    );
  }

  insuranceplanning(data) {
    this.isLoading = true;
    const fragmentData = {
      flag: 'addPlanInsurance',
      data,
      componentName: AddInsurancePlanningComponent,
      id: 1,
      state: 'open70',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
          this.isLoading = false;

        }
      }
    );
  }
  openUpperInsurance(data) {
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: AddInsuranceUpperComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          if (UtilService.isRefreshRequired(upperSliderData) || upperSliderData['data'] == true) {
            this.selectedId = '';
            if (this.detailsInsurance) {
              this.detailsInsurance.dataLoaded = false;
            }
            this.getInsuranceList();
          }
          // if (upperSliderData['data']) {

          // }
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }
  stopLoader(value) {
    if (value) {
      this.isLoadingPlan = false;
    }
  }
  opensuggestpolicy(data) {
    this.isLoading = true;
    const fragmentData = {
      flag: 'opensuggestpolicy',
      data,
      componentName: AddSuggestPolicyComponent,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
          this.isLoading = false;

        }
      }
    );
  }

  openAddgoals(){}

  opencurrentpolicies(data) {
    this.isLoading = true;
    const fragmentData = {
      flag: 'opencurrentpolicies',
      data,
      componentName: CurrentPolicyComponent,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
          this.isLoading = false;

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
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   { position: "HDFC Ergo My Health Suraksha", name: '7,00,000', weight: "19,201", symbol: 'Waiting for approval' },
// ];

export interface PeriodicElement1 {
  name: string;
  sum: string;
  premium: string;
  returns: string;
  advice: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: "LIC Jeevan Saral", sum: '20,00,000', premium: "27,000", returns: '4.78%', advice: 'Stop paying premiums' },
];

export interface PeriodicElement2 {

  name: string;
  annual: string;
  amt: string;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },

];

