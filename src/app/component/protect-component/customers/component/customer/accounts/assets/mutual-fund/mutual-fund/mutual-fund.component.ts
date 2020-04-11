import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {UtilService} from 'src/app/services/util.service';
import {CustomerService} from '../../../../customer.service';
import {AuthService} from 'src/app/auth-service/authService';
import {MfServiceService} from '../mf-service.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-mutual-fund',
  templateUrl: './mutual-fund.component.html',
  styleUrls: ['./mutual-fund.component.scss']
})
export class MutualFundComponent implements OnInit {
  viewMode: string;
  mfData: any;
  advisorId: any;
  clientId: any;
  subCategoryData: any[];
  schemeWise: any[];
  mutualFundList: any[];
  mfDataUnrealised: any;
  isLoading = false;

  dataHolder: any = {};

  constructor(public subInjectService: SubscriptionInject, public utilService: UtilService,
              public eventService: EventService, private custumService: CustomerService,
              private mfService: MfServiceService) {
  }

  ngOnInit() {
    this.viewMode = 'All Transactions';
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getMutualFund();
  }

  getMutualFund() {
    this.isLoading = true;
    const obj = {
      advisorId: 2753,
      clientId: 15545
    };
    this.custumService.getMutualFund(obj).pipe(map((data) => {
      return this.doFiltering(data);
    })).subscribe(
      data => this.getMutualFundResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }

  asyncFilter(mutualFund) {
    if (typeof Worker !== 'undefined') {
      console.log(`13091830918239182390183091830912830918310938109381093809328`);

      // Create a new
      const worker = new Worker('../mutual-fund.worker.ts', {type: 'module'});
      worker.onmessage = ({data}) => {
        console.log(`MUTUALFUND COMPONENT page got message: ${data}`);
      };
      worker.postMessage('hello');
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  doFiltering(data) {
    // return sub category list
    // this.dataHolder.subCategoryData = this.mfService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    // this.dataHolder.schemeWise = this.mfService.filter(this.dataHolder.subCategoryData, 'mutualFundSchemeMaster');
    // this.dataHolder.mutualFundList = this.mfService.filter(this.dataHolder.schemeWise, 'mutualFund');

    data.subCategoryData = this.mfService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    data.schemeWise = this.mfService.filter(data.subCategoryData, 'mutualFundSchemeMaster');
    data.mutualFundList = this.mfService.filter(data.schemeWise, 'mutualFund');
    return data;
  }


  getMutualFundResponse(data) {
    if (data) {
      this.isLoading = false;

      this.mfData = data;
      this.asyncFilter(data);
    }
    this.isLoading = false;
  }

  unrealiseTransaction() {
    this.mfDataUnrealised = this.mfData;
  }


}


