import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { OnlineTransactionService } from '../../../../online-transaction.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SettingsService } from 'src/app/component/protect-component/AdviserComponent/setting/settings.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

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
  teamMemberList: any;
  subBroker: any;
  selectedTeam: any;
  selectBrokerCred: any;
  inputData: any;
  isLoadingBroker: boolean = false;
  euinValue: string;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  constructor(private eventService: EventService,
    private settingService: SettingsService,
    private fb: FormBuilder, private utilService: UtilService,
    private onlineTransact: OnlineTransactionService, private subInjectService: SubscriptionInject) {
  }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.getdataForm(this.inputData);
    this.advisorId = AuthService.getAdvisorId();
    this.getBSECredentials();
    this.getteamMemberList();
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  getBSECredentials() {
    this.isLoadingBroker = true;
    let obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    };
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getBSECredentialsRes(data)
    );
  }

  getBSECredentialsRes(data) {
    this.isLoadingBroker = false;
    this.brokerCredentials = data;
    this.bse = this.brokerCredentials.filter(element => element.aggregatorType == 2);
    this.nse = this.brokerCredentials.filter(element => element.aggregatorType == 1);
  }

  getteamMemberList() {
    const obj = {
      advisorId: this.advisorId
    };
    this.settingService.getTeamMembers(obj).subscribe(
      data => {
        this.teamMemberList = data || [];
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  getdataForm(data) {
    if (!data) {
      data = {};
    }
    if (this.dataSource) {
      data = this.dataSource;
    }
    this.addSubCredential = this.fb.group({
      // platform: [(data.aggregatorType) ? (data.aggregatorType) + '' : '', [Validators.required]],
      brokerCode: [(data.brokerCode) ? data.brokerCode : '', [Validators.required]],
      appId: [(data.name) ? data.name : '', [Validators.required]],
      memberId: [(!data) ? '' : data.subBrokerCode, [Validators.required]],
      euin: [(!data) ? '' : data.euin, [Validators.required, Validators.maxLength(7), Validators.minLength(7),]],
    });
    if (!data.euin) {
      this.euinValue = 'E';
    } else {
      this.euinValue = this.addSubCredential.controls.euin.value;
    }
  }

  getFormControl(): any {
    return this.addSubCredential.controls;
  }

  selectBroker(broker) {
    this.selectBrokerCred = broker;
  }

  selectedTeamMember(mem) {
    this.selectedTeam = mem;
  }

  saveSubBroker() {
    if (this.addSubCredential.invalid) {
      this.addSubCredential.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        id: (this.inputData) ? this.inputData.id : null,
        advisorId: this.advisorId,
        teamMemberSessionId: (this.selectedTeam == undefined) ? this.inputData.teamMemberSessionId : this.selectedTeam.adminAdvisorId,
        tpUserCredentialId: (this.selectBrokerCred == undefined) ? this.inputData.tpUserCredentialId : this.selectBrokerCred.tpUserCredentialId,
        euin: this.addSubCredential.controls.euin.value,
        subBrokerCode: this.addSubCredential.controls.memberId.value,
      };
      this.onlineTransact.addSubBroker(obj).subscribe(
        data => {
          this.barButtonOptions.active = false;
          this.subBroker = data || [];
          this.eventService.openSnackBar(this.inputData ? 'Credential edited successfully!' : 'Credential added successfully!', "Dismiss")
          this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
        },
        err => {
          this.barButtonOptions.active = false;
          this.eventService.openSnackBar(err, 'Dismiss');
        }
      );
    }
  }
}
