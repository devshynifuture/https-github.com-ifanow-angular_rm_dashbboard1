import { Component, OnInit } from '@angular/core';
// import {UtilService} from '../../../../../../../services/util.service';
import { EventService } from '../../../../../../../Data-service/event.service';
import { SubscriptionInject } from '../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-liabilities',
  templateUrl: './liabilities.component.html',
  styleUrls: ['./liabilities.component.scss']
})

export class LiabilitiesComponent implements OnInit {
  displayedColumns = ['no', 'name', 'type', 'loan', 'ldate', 'today', 'ten', 'rate', 'emi', 'fin', 'status', 'icons'];
  // dataSource = ELEMENT_DATA;
  advisorId: any;
  dataSource: any;
  storeData: any;

  constructor(private eventService: EventService, private subInjectService: SubscriptionInject,public custmService:CustomerService) {
  }


  viewMode;

  ngOnInit() {
    this.viewMode = 'tab1';
    this.advisorId = AuthService.getAdvisorId();
    this.getLiability();
  }
  open(flagValue, data) {
    const fragmentData = {
      Flag: flagValue,
      data :data,
      id: 1,
      state: 'open'
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

  openThirtyPercent(flagValue, data) {
    const fragmentData = {
      Flag: flagValue,
      data,
      id: 1,
      state: 'openHelp'
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

 
  
  addLiabilitiesDetail(flagValue){
    const fragmentData = {
      Flag: flagValue,
      id: 1,
      state: 'openHelp'
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




  getLiability(){
    let obj={
      'advisorId':this.advisorId,
      'clientId':2978
    }
    this.custmService.getLiabilty(obj).subscribe(
      data => this.getLiabiltyRes(data)
    );
  }
  getLiabiltyRes(data){
    console.log(data);
    this.dataSource=data.loans;
    this.storeData=data.loans.length;
    data.loans.forEach(element => {
      switch (element.loanTypeId) {
        case 1: element.loanTypeId = 'Home Loan';
            break;
        case 2: element.loanTypeId = 'Vehicle';
            break;
        case 3: element.loanTypeId = 'Education';
            break;
        case 4: element.loanTypeId = 'Credit Card';
            break;
        case 5: element.loanTypeId = 'Personal';
            break;
        case 6: element.loanTypeId = 'Mortgage';
            break;
        default:
          element.loanTypeId = '-';
    }
    });
  }
  clickHandling() {
    console.log('something was clicked');
    // this.openFragment('', 'plan');
    this.open('openHelp', 'liabilityright');
  }

}

export interface PeriodicElement {
  no: string;
  name: string;
  type: string;
  loan: string;
  ldate: string;
  today: string;
  ten: string;
  rate: string;
  emi: string;
  fin: string;
  status: string;

}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {
//     no: '1',
//     name: 'Rahul Jain',
//     type: 'Home loan',
//     loan: '60,000',
//     ldate: '18/09/2021',
//     today: '1,00,000',
//     ten: '5y 9m',
//     rate: '8.40%',
//     emi: '60,000',
//     fin: 'ICICI FD',
//     status: 'MATURED'
//   },
//   {
//     no: '2',
//     name: 'Shilpa Jain',
//     type: 'Home loan',
//     loan: '60,000',
//     ldate: '18/09/2021',
//     today: '1,00,000',
//     ten: '5y 9m',
//     rate: '8.40%',
//     emi: '60,000',
//     fin: 'ICICI FD',
//     status: 'MATURED'
//   },
//   {
//     no: '',
//     name: 'Total',
//     type: '',
//     loan: '1,20,000',
//     ldate: '',
//     today: '1,50,000',
//     ten: '',
//     rate: '',
//     emi: '',
//     fin: '',
//     status: ''
//   },
// ];
