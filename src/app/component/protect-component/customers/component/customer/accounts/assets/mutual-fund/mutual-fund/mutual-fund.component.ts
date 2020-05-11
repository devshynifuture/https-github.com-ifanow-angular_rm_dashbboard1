import { Component, OnInit, SimpleChanges } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MfServiceService } from '../mf-service.service';
import { map } from 'rxjs/operators';
import { SettingsService } from 'src/app/component/protect-component/AdviserComponent/setting/settings.service';

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
  isLoading = true;

  dataHolder: any = {};
  isShow

  constructor(public subInjectService: SubscriptionInject, public utilService: UtilService,
    public eventService: EventService, private custumService: CustomerService,
    private mfService: MfServiceService, private settingService: SettingsService) {
  }

  ngOnInit() {
    this.mfService.getMutualFundShowDropdown()
      .subscribe(res => {
        this.isShow = res;
      })
    this.viewMode = 'Overview Report';

    this.advisorId = AuthService.getAdvisorId();
    // this.advisorId = 2929;

    this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;

  }
  // getPersonalDetails(data){
  //   const obj={
  //     id:data
  //   }
  //   this.settingService.getProfileDetails(obj).subscribe(
  //     data => {
  //       console.log(data);
  //       this.mfData.advisorData = data;
  //     }
  //   );
  // }

  unrealiseTransaction() {
    this.mfDataUnrealised = this.mfData;
  }

  changeViewMode(data) {
    this.viewMode = data;
  }

  changeInput(value) {
    this.isShow = value;
  }

  refreshMFData(value) {
    if (value) {
    }
  }
}


