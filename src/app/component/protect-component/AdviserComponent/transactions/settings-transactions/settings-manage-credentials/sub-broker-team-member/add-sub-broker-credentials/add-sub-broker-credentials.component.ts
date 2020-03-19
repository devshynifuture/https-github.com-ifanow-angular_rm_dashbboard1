import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { OnlineTransactionService } from '../../../../online-transaction.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-add-sub-broker-credentials',
  templateUrl: './add-sub-broker-credentials.component.html',
  styleUrls: ['./add-sub-broker-credentials.component.scss']
})
export class AddSubBrokerCredentialsComponent implements OnInit {
  addSubCredential: any;
  dataSource: any;
  memId;
  euin;
  advisorId: any;
  brokerCredentials: any;
  nse: any;
  bse: any;

  constructor(private eventService: EventService, private fb: FormBuilder, private utilService: UtilService, private onlineTransact: OnlineTransactionService, private subInjectService: SubscriptionInject) {
  }
  ngOnInit() {
    this.getdataForm('')
    this.advisorId = AuthService.getAdvisorId()
    this.getBSECredentials()
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  getBSECredentials() {
    let obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    }
    console.log('encode', obj)
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getBSECredentialsRes(data)
    );
  }
  getBSECredentialsRes(data) {
    console.log('getBSECredentialsRes', data)
    this.brokerCredentials = data
    this.bse = this.brokerCredentials.filter(element => element.aggregatorType == 2)
    this.nse = this.brokerCredentials.filter(element => element.aggregatorType == 1)
  }
  getdataForm(data) {
    if (!data) {
      data = {};
    }
    if (this.dataSource) {
      data = this.dataSource;
    }
    this.addSubCredential = this.fb.group({
      platform: [(!data) ? '' : data.aggregatorType + '', [Validators.required]],
      accType: [(!data) ? '' : data.accountType + '', [Validators.required]],
      brokerCode: [(!data) ? '' : data.brokerCode, [Validators.required]],
      appId: [(!data) ? '' : data.userId, [Validators.required]],
      memberId: [(!data) ? '' : data.memberId, [Validators.required]],
      pwd: [(!data) ? '' : data.password, [Validators.required]],
      euin: [(!data) ? '' : data.euin, [Validators.required, Validators.max(7), Validators.pattern("/^E/i[0-9]{1,6}$/")]],
      setDefault: [(!data) ? '' : (data.defaultLogin), [Validators.required]],
    });
  }

  getFormControl(): any {
    return this.addSubCredential.controls;
  }
}
