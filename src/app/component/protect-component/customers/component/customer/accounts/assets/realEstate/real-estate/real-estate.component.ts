import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-real-estate',
  templateUrl: './real-estate.component.html',
  styleUrls: ['./real-estate.component.scss']
})
export class RealEstateComponent implements OnInit {
  advisorId: any;
  datasource3: any;
  clientId: any;

  isLoading: boolean = true;

  constructor(public subInjectService: SubscriptionInject, public utilService: UtilService, public custmService: CustomerService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getRealEstate();
  }
  displayedColumns3 = ['no', 'owner', 'type', 'value', 'pvalue', 'desc', 'status', 'icons'];
  // datasource3 = ELEMENT_DATA3;

  getRealEstate() {
    let obj = {
      'advisorId': this.advisorId,
      'clientId': this.clientId
    }
    this.custmService.getRealEstate(obj).subscribe(
      data => this.getRealEstateRes(data)
    );
  }
  getRealEstateRes(data) {
    console.log(data);
    this.isLoading = false;
    this.datasource3 = data.realEstateList;
  }
  open(value, data) {
    const fragmentData = {
      Flag: value,
      data: data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getRealEstate();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
export interface PeriodicElement3 {
  no: string;
  owner: string;
  type: string;
  value: string;
  pvalue: string;
  desc: string;
  status: string;
}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { no: '1.', owner: 'Rahul Jain', type: 'Type', value: '60,000', pvalue: '60,000', desc: 'ICICI FD', status: 'ICICI FD' },
  { no: '1.', owner: 'Rahul Jain', type: 'Type', value: '60,000', pvalue: '60,000', desc: 'ICICI FD', status: 'ICICI FD' },
  { no: ' ', owner: 'Total', type: '', value: '1,28,925', pvalue: '1,28,925', desc: '', status: ' ' },
];