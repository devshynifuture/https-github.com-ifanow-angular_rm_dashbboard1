import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../../../online-transaction.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-arn-ria-credentials',
  templateUrl: './add-arn-ria-credentials.component.html',
  styleUrls: ['./add-arn-ria-credentials.component.scss']
})
export class AddArnRiaCredentialsComponent implements OnInit {
  memId;
  euin;
  addCredential: any;
  dataSource: any;
  advisorId: any;
  invalidEuinStart = false;
  invalidEuinLen = false;
  euinNumber = false;
  euinAbsent = false;
  inputData: any;
  isViewInitCalled = false;
  platForm: any;
  euinValue: string;
  accountType: string;


  constructor(private eventService: EventService, private fb: FormBuilder, private utilService: UtilService, private onlineTransact: OnlineTransactionService, private subInjectService: SubscriptionInject) {
  }

  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of FixedDepositComponent ', data);

    if (this.isViewInitCalled) {
      this.getdataForm(data);
    }
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId()
    this.getdataForm(this.inputData)
    this.accountType = 'ARN-'
  }
  euinChangeFun = function (value) {
    var test = value.slice(1, value.length + 1)
    var exp = /^E/i
    if (exp.test(value) == false) {
      this.invalidEuinStart = true;
      return;
    }
    if (value.length > 7) {
      this.invalidEuinLen = true;
      this.invalidEuinStart = false
      this.euinNumber = false;
      if (value.length == 7) {
        this.invalidEuinLen = false;
      }
      return;
    }
    if (value.length > 1) {
      var exp = /^[0-9]{1,6}$/
      if (exp.test(test) == false) {
        this.invalidEuinLen = false;
        this.invalidEuinStart = false
        this.euinNumber = true;
        return;
      }
    }
    if (value.length == 0) {
      this.euinAbsent = true;
      return;
    }
  }
  getdataForm(data) {
    if (!data) {
      data = {};
    }
    if (this.dataSource) {
      data = this.dataSource;
    }
    this.addCredential = this.fb.group({
      platform: [(!data) ? '1' : (data.aggregatorType) ? (data.aggregatorType) + '' : '1', [Validators.required]],
      accType: [(!data) ? '1' : (data.accountType) ? (data.accountType) + '' : '1', [Validators.required]],
      brokerCode: [(!data) ? '' : data.brokerCode, [Validators.required]],
      appId: [(!data) ? '' : data.userId, [Validators.required]],
      memberId: [(!data) ? '' : data.memberId, [Validators.required]],
      pwd: [(!data) ? '' : data.password, [Validators.required]],
      euin: [(!data) ? '' : data.euin, [Validators.required, Validators.maxLength(7), Validators.minLength(7),]],
      setDefault: [(!data) ? '0' : (data.defaultLogin), [Validators.required]],
    });
    this.platForm = this.addCredential.controls.platform.value
    this.addCredential.controls.setDefault.value = 0
    if(!data.euin){
      this.euinValue = 'E'
    }else{
      this.euinValue = this.addCredential.controls.euin.value
    }
  }

  getFormControl(): any {
    return this.addCredential.controls;
  }
  paltFormSelect(value) {
    this.platForm = value.value
  }
  accountTypeSelect(value) {
    if (value.value == '1') {
      this.accountType = 'ARN-'
    } else {
      this.accountType = 'RIA-'
    }
  }
  addBSECredentials() {
    var setDefault = '0'
    if (this.platForm == '1') {
      this.addCredential.controls.memberId.setValue(0)
    } if (!this.addCredential.controls.setDefault.value) {
      this.addCredential.controls.setDefault.setValue(0)
    }
    if (this.addCredential.invalid) {
      this.addCredential.markAllAsTouched();
    }
    else if (this.addCredential.get('euin').invalid) {
      this.addCredential.get('euin').markAsTouched();
      return
    } else {
      if (this.platForm == '1') {
        this.addCredential.controls.memberId.setValue('')
      }
      let obj = {
        accountType: this.addCredential.controls.accType.value,
        advisorId: this.advisorId,
        aggregatorType: this.addCredential.controls.platform.value,
        brokerCode: this.addCredential.controls.brokerCode.value,
        defaultLogin: (this.addCredential.controls.setDefault.value == true) ? 1 : 0,
        euin: this.addCredential.controls.euin.value,
        memberId: (this.addCredential.controls.memberId == undefined) ? '' : this.addCredential.controls.memberId.value,
        id: (this.addCredential.controls.id == undefined) ? this.inputData.id : '',
        orderSerialNo: 0,
        tpSubBrokerCredentialId: this.inputData.tpSubBrokerCredentialId,
        password: this.addCredential.controls.pwd.value,
        subBrokerCode: (this.addCredential.controls.subBrokerCode == undefined) ? '' : this.addCredential.controls.subBrokerCode.value,
        userId: this.addCredential.controls.appId.value,
      }
      this.onlineTransact.addBSECredentilas(obj).subscribe(
        data => this.addBSECredentilasRes(data)
      );
    }

  }
  addBSECredentilasRes(data) {
    this.eventService.openSnackBar('Credential added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
