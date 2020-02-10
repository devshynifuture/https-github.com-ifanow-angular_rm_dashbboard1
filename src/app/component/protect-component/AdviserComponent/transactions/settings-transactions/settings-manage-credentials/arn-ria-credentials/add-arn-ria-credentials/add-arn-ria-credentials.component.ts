import {Component, Input, OnInit} from '@angular/core';
import {UtilService} from 'src/app/services/util.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {OnlineTransactionService} from '../../../../online-transaction.service';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from 'src/app/auth-service/authService';

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

  constructor(private fb: FormBuilder, private utilService: UtilService, private onlineTransact: OnlineTransactionService, private subInjectService: SubscriptionInject) {
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
  }
  euinChangeFun = function (value) {
    var test = value.slice(1, value.length + 1)
    var exp = /^E/i
    if (exp.test(value) == false) {
      this.invalidEuinStart = true;
      return;
    }
    if(value.length > 7){
     this.invalidEuinLen = true;
     this.invalidEuinStart = false
     this.euinNumber = false;
     if(value.length == 7){
      this.invalidEuinLen = false;
     }
      return;
    }
  if(value.length > 1){
    var exp = /^[0-9]{1,6}$/
    if(exp.test(test) == false){
      this.invalidEuinLen = false;
      this.invalidEuinStart = false
      this.euinNumber = true;
      return;
    }
  }
  if(value.length == 0){
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
      platform: [(!data) ? '' : data.aggregatorType+'', [Validators.required]],
      accType: [(!data) ? '' : data.accountType+'', [Validators.required]],
      brokerCode: [(!data) ? '' : data.brokerCode, [Validators.required]],
      appId: [(!data) ? '' : data.userId, [Validators.required]],
      memberId:[(!data) ? '' : data.memberId, [Validators.required]],
      pwd: [(!data) ? '' : data.apiPassword, [Validators.required]],
      euin: [(!data) ? '' : data.euin, [Validators.required,Validators.max(7),Validators.pattern("/^E/i[0-9]{1,6}$/")]],
      setDefault: [(!data) ? '' : data.defaultLogin, [Validators.required]],
    });
  }

  getFormControl(): any {
    return this.addCredential.controls;
  }


  addBSECredentials() {
    if (this.addCredential.get('platform').invalid) {
      this.addCredential.get('platform').markAsTouched();
      return
    }
    else if (this.addCredential.get('accType').invalid) {
      this.addCredential.get('accType').markAsTouched();
      return
    }
    else if (this.addCredential.get('brokerCode').invalid) {
      this.addCredential.get('brokerCode').markAsTouched();
      return
    }
    else if (this.addCredential.get('appId').invalid) {
      this.addCredential.get('appId').markAsTouched();
      return
    }
    else if (this.addCredential.get('pwd').invalid) {
      this.addCredential.get('pwd').markAsTouched();
      return
    }
    else if (this.addCredential.get('euin').invalid) {
      this.addCredential.get('euin').markAsTouched();
      return
    } else {
      let obj = {
        accountType : this.addCredential.controls.accType.value,
        advisorId : this.advisorId,
        aggregatorType : this.addCredential.controls.platform.value,
        brokerCode:this.addCredential.controls.brokerCode.value,
        defaultLogin : this.addCredential.controls.setDefault.value,
        euin : this.addCredential.controls.euin.value,
        memberId: (this.addCredential.controls.memberId == undefined)?'':this.addCredential.controls.memberId.value,
        id : (this.addCredential.controls.id== undefined)?'':this.addCredential.controls.memberId.value,
        orderSerialNo : 0,
        password: this.addCredential.controls.pwd.value,
        subBrokerCode :(this.addCredential.controls.subBrokerCode == undefined)?'':this.addCredential.controls.subBrokerCode.value,
        teamMemberSessionId :1,
        userId:this.addCredential.controls.appId.value,
      }
      this.onlineTransact.addBSECredentilas(obj).subscribe(
        data => this.addBSECredentilasRes(data)
      );
    }

  }
  addBSECredentilasRes(data) {

  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
