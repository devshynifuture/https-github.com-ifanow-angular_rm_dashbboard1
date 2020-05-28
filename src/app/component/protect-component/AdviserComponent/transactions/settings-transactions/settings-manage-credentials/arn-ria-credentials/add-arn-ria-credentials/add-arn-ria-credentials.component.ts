import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../../../online-transaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-add-arn-ria-credentials',
  templateUrl: './add-arn-ria-credentials.component.html',
  styleUrls: ['./add-arn-ria-credentials.component.scss']
})
export class AddArnRiaCredentialsComponent implements OnInit {
  addCredential: FormGroup;
  advisorId: any;
  invalidEuinStart = false;
  invalidEuinLen = false;
  euinNumber = false;
  euinAbsent = false;
  inputData: any;
  isViewInitCalled = false;
  platForm: any;
  euinValue: string;
  brokerCode: string;
  defaultLoginDisabled: boolean = false;
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
  constructor(private eventService: EventService, private fb: FormBuilder,
    private utilService: UtilService, private onlineTransact: OnlineTransactionService,
    private subInjectService: SubscriptionInject) {
  }

  @Input()
  set data(data) {
    this.inputData = data;

    if (this.isViewInitCalled) {
      this.getdataForm(data);
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.brokerCode = 'ARN-';
    this.getdataForm(this.inputData);
  }

  euinChangeFun = function (value) {
    const test = value.slice(1, value.length + 1);
    let exp = /^E/i;
    if (exp.test(value) == false) {
      this.invalidEuinStart = true;
      return;
    }
    if (value.length > 7) {
      this.invalidEuinLen = true;
      this.invalidEuinStart = false;
      this.euinNumber = false;
      if (value.length == 7) {
        this.invalidEuinLen = false;
      }
      return;
    }
    if (value.length > 1) {
      exp = /^[0-9]{1,6}$/;
      if (exp.test(test) == false) {
        this.invalidEuinLen = false;
        this.invalidEuinStart = false;
        this.euinNumber = true;
        return;
      }
    }
    if (value.length == 0) {
      this.euinAbsent = true;
      return;
    }
  };
  toUpperCase(formControl, event) {
    this.utilService.toUpperCase(formControl, event);
  }
  getdataForm(data) {
    if (!data) {
      data = {};
    }
    this.addCredential = this.fb.group({
      platform: [(!data) ? '1' : (data.aggregatorType) ? (data.aggregatorType) + '' : '1', [Validators.required]],
      accType: [(!data) ? '1' : (data.accountType) ? (data.accountType) + '' : '1', [Validators.required]],
      brokerCode: [(!data) ? '' : data.brokerCode, [Validators.required]],
      appId: [(!data) ? '' : data.userId, [Validators.required]],
      memberId: [(!data) ? '' : data.memberId, [Validators.required]],
      pwd: [(!data) ? '' : data.password, [Validators.required]],
      euin: [(!data) ? '' : data.euin, [Validators.required, Validators.maxLength(7), Validators.minLength(7),]],
      defaultLogin: [(!data) ? false : (data.defaultLogin == 1), [Validators.required]],
    });
    this.setEuinValidator(data.accountType);
    this.setBrokerCode(data.brokerCode);
    this.addCredential.controls.accType.valueChanges.subscribe((newValue) => {
      this.setEuinValidator(newValue);
    });
    if (data.defaultLogin == 1) {
      this.defaultLoginDisabled = true;
    }
    this.platForm = this.addCredential.controls.platform.value;
    if (!data.euin) {
      this.euinValue = 'E';
    } else {
      this.euinValue = this.addCredential.controls.euin.value;
    }
  }

  setBrokerCode(value) {
    if (value && value.length > 0) {
      this.brokerCode = value;
    }
  }

  setEuinValidator(newValue) {
    if (newValue == 2) {
      this.addCredential.controls.euin.clearAsyncValidators();
      this.addCredential.controls.euin.clearValidators();
      this.addCredential.controls.euin.updateValueAndValidity();

    } else {
      this.addCredential.controls.euin.setValidators([Validators.required, Validators.maxLength(7), Validators.minLength(7)]);
    }
  }

  getFormControl(): any {
    return this.addCredential.controls;
  }

  paltFormSelect(value) {
    this.platForm = value.value;
  }

  accountTypeSelect(value) {
    if (value.value == '1') {
      this.brokerCode = 'ARN-';
    } else {
      this.brokerCode = 'IN';
    }
  }

  addBSECredentials() {
    if (this.platForm == '1') {
      this.addCredential.controls.memberId.setValue(0);
    }
    if (!this.addCredential.controls.defaultLogin.value) {
      this.addCredential.controls.defaultLogin.setValue(0);
    }
    if (this.addCredential.invalid) {
      this.addCredential.markAllAsTouched();
    } else if (this.addCredential.get('euin').invalid) {
      this.addCredential.get('euin').markAsTouched();
      return;
    } else {
      if (this.platForm == '1') {
        this.addCredential.controls.memberId.setValue('');
      }
      this.barButtonOptions.active = true;
      const obj = {
        accountType: this.addCredential.controls.accType.value,
        advisorId: this.advisorId,
        aggregatorType: this.addCredential.controls.platform.value,
        brokerCode: this.addCredential.controls.brokerCode.value,
        defaultLogin: (this.addCredential.controls.defaultLogin.value == true) ? 1 : 0,
        euin: this.addCredential.controls.accType.value == 1 ? this.addCredential.controls.euin.value : '',
        memberId: (this.addCredential.controls.memberId == undefined) ? '' : this.addCredential.controls.memberId.value,
        id: (this.addCredential.controls.id == undefined) ? this.inputData.id : '',
        orderSerialNo: 0,
        tpSubBrokerCredentialId: this.inputData.tpSubBrokerCredentialId,
        password: this.addCredential.controls.pwd.value,
        subBrokerCode: (this.addCredential.controls.subBrokerCode == undefined) ? '' : this.addCredential.controls.subBrokerCode.value,
        userId: this.addCredential.controls.appId.value,
      };
      this.onlineTransact.addBSECredentilas(obj).subscribe(
        data => this.addBSECredentilasRes(data), error => {
          this.barButtonOptions.active = false;
          this.eventService.showErrorMessage(error);
        }
      );
    }

  }

  addBSECredentilasRes(data) {
    this.barButtonOptions.active = false;
    this.eventService.openSnackBar((this.inputData == 'addCredentials') ? 'Credential added successfully!' : 'Credential edited successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
