import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddPlaninsuranceComponent } from '../../add-planinsurance/add-planinsurance.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AddSuggestPolicyComponent } from '../../add-suggest-policy/add-suggest-policy.component';
import { AddRecommendationsInsuComponent } from '../../add-recommendations-insu/add-recommendations-insu.component';
import { PlanService } from '../../../plan.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-life-insurance',
  templateUrl: './life-insurance.component.html',
  styleUrls: ['./life-insurance.component.scss']
})
export class LifeInsuranceComponent implements OnInit {
  displayedColumns = ['pname', 'sum2', 'premium2', 'status', 'empty'];
  dataSource = ELEMENT_DATA;
  displayedColumns1 = ['name', 'sum', 'premium', 'returns', 'advice'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2 = ['name', 'annual', 'amt', 'icons'];
  dataSource2 = ELEMENT_DATA2;
  inputData: any;
  setLogo = [{
    heading: 'Life insurance',
    logo: '/assets/images/svg/LIbig.svg',

  }, {
    heading: 'Health insurance',
    logo: '/assets/images/svg/HIbig.svg',

  }, {
    heading: 'Critical illness',
    logo: '/assets/images/svg/CIbig.svg',

  }, {
    heading: 'Cancer care',
    logo: '/assets/images/svg/CCbig.svg',

  }, {
    heading: 'Personal accident',
    logo: '/assets/images/svg/PAbig.svg',

  }, {
    heading: 'Fire insurance',
    logo: '/assets/images/svg/Fibig.svg',
  }, {
    heading: 'Householders',
    logo: '/assets/images/svg/Hbig.svg'
  }]
  logo: any;
  getData: any;
  advisorId: any;
  clientId: any;
  counter: any;
  isLoading: boolean;
  insuranceDetails: any;
  @Output() outputChange = new EventEmitter<any>();
  constructor(private subInjectService: SubscriptionInject, 
    private custumService: CustomerService, 
    private utils: UtilService,
    private eventService: EventService,
    private planService :  PlanService,
    private dialog: MatDialog,
    ) { 
      this.advisorId = AuthService.getAdvisorId();
      this.clientId = AuthService.getClientId();
  }

  @Input()
  set data(data) {
    this.inputData = data;
    this.setDetails(data)
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    console.log('inputData', this.inputData)
  }

  setDetails(data) {
    if(this.inputData){
      this.getData = data
      this.setLogo.forEach(element => {
      if (element.heading == data.heading) {
        this.logo = element.logo
      }
    });
      this.getDetailsInsurance()
    }
  }
  deleteInsurance() {
    const dialogData = {
      header: 'DELETE INSURANCE',
      body: 'Are you sure you want to delete this insurance?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.planService.deleteInsurancePlanning(this.inputData.id).subscribe((data) => {
          this.eventService.openSnackBar("insurance has been deleted successfully", "Dismiss");
          this.outputChange.emit(true);
          dialogRef.close()
        }, (err) => { this.eventService.openSnackBar(err, "Dismiss") })
      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
    });
  }
  getDetailsInsurance(){
    let obj = {
      clientId: this.clientId,
      familyMemberId : this.inputData.familyMemberId,
      id:this.inputData.id,
    }
    this.loader(1);
    this.planService.getDetailsInsurance(obj).subscribe(
      data => this.getDetailsInsuranceRes(data),
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        this.loader(-1);
      }
    );
  }
  getDetailsInsuranceRes(data){
    console.log('getDetailsInsuranceRes res',data)
    this.insuranceDetails = data

  }
  loader(increamenter) {
    this.counter += increamenter;
    if (this.counter == 0) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }
  needAnalysis(data) {
    const fragmentData = {
      flag: 'opencurrentpolicies',
      data:this.inputData,
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
        }
      }
    );
  }

  suggestPolicy(data) {
    const fragmentData = {
      flag: 'opencurrentpolicies',
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
        }
      }
    );
  }

  recommendationsPolicy(data) {
    const fragmentData = {
      flag: 'opencurrentpolicies',
      data,
      componentName: AddRecommendationsInsuComponent,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
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
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: "HDFC Ergo My Health Suraksha", name: '7,00,000', weight: "19,201", symbol: 'Waiting for approval' },
];

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