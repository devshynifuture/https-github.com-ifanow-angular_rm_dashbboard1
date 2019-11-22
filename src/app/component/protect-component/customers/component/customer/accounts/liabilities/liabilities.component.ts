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
  dataStore: any;
  showFilter: any;
  home = [];
  vehicle = [];
  education = [];
  creditCard = [];
  personal = [];
  mortgage = [];
  dataToShow: any;
  OtherData: any;
  OtherPayableData: any;
  clientId: any;
  showLoader: boolean;
  noData: string;

  constructor(private eventService: EventService, private subInjectService: SubscriptionInject,
    public customerService: CustomerService, public util: UtilService) {
  }
  viewMode;
  ngOnInit() {
    this.viewMode = 'tab1';
    this.showFilter = 'tab1';
    this.showLoader = true;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getPayables();
    this.getLiability('');
  }

  getPayables() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.customerService.getOtherPayables(obj).subscribe(
      data => this.getOtherPayablesRes(data)
    );
  }

  getOtherPayablesRes(data) {
    console.log(data);
    this.OtherPayableData = data;
    this.OtherData = data.length;
  }

  sortTable(data) {
    if (data == '' || data == undefined) {
      this.showFilter = 'tab1';
      data = 'tab1';
    }
    this.showFilter = data;
    const filterData = [];
    if (data == 'tab1') {
      this.dataSource = this.dataStore;
    } else {
      this.dataStore.forEach(element => {
        if (element.loanTypeId == data) {
          filterData.push(element);
        }
      });
      if(filterData.length==0){
        this.noData = "No Scheme Found";
        this.dataSource = undefined;
      }else{
        this.dataSource = filterData;

      }
    }
  }

  open(flagValue, data) {
    const fragmentData = {
      Flag: flagValue,
      data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getLiability(sideBarData);
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


  addLiabilitiesDetail(flagValue) {
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
  getLiability(data) {
    this.dataToShow = data.data;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.customerService.getLiabilty(obj).subscribe(
      data => this.getLiabiltyRes(data)
    );
  }

  getLiabiltyRes(data) {
    this.showLoader = false;
    if(data.loans==undefined){
      this.noData = "No Scheme Found";
    }else{
    this.dataStore = [];
    this.dataSource = [];
    this.home = [];
    this.vehicle = [];
    this.education = [];
    this.creditCard = [];
    this.personal = [];
    this.mortgage = [];
    this.dataStore = data.loans;
    this.dataSource = data.loans;
    this.storeData = data.loans.length;
    this.dataStore.forEach(element => {
      if (element.loanTypeId == 1) {
        this.home.push(element);
      } else if (element.loanTypeId == 2) {
        this.vehicle.push(element);
      } else if (element.loanTypeId == 3) {
        this.education.push(element);
      } else if (element.loanTypeId == 4) {
        this.creditCard.push(element);
      } else if (element.loanTypeId == 5) {
        this.personal.push(element);
      } else if (element.loanTypeId == 6) {
        this.mortgage.push(element);
      }
    });
    this.sortTable(this.dataToShow);
  }
  }
  clickHandling() {
    console.log('something was clicked');
    this.open('openHelp', 'liabilityright');
  }

  display(data) {
    this.getPayables();
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
