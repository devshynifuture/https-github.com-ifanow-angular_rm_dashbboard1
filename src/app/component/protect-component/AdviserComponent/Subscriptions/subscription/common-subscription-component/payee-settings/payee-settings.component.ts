import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {AuthService} from 'src/app/auth-service/authService';
import {UtilService} from 'src/app/services/util.service';

@Component({
  selector: 'app-payee-settings',
  templateUrl: './payee-settings.component.html',
  styleUrls: ['./payee-settings.component.scss']
})
export class PayeeSettingsComponent implements OnInit {
  clientId: any;
  @Input() upperData;
  @Output() totalPayeeData = new EventEmitter<Object>();
  settingsModal;
  payeeSettingsForm;
  sendData;
  updatedData: any;
  inputData: any;
  isCustomerName = false;
  isDisplayName = false;
  isCompanyName = false;
  isEmailId = false;
  isMobileNo = false;
  isPan = false;
  isGstIn = false;
  isBillingAddress = false;
  isPincode = false;
  @Output() getEditData = new EventEmitter();
  obj = [
    {
      id: null,
      subscriptionId: 12,
      clientBillerId: 7,
      share: 25,
      createdDate: '2000-02-22',
      lastupdatedDate: '2000-03-23',
      isActive: 1
    },
    {
      id: null,
      subscriptionId: 12,
      clientBillerId: 25,
      share: 5,
      createdDate: '2000-02-22',
      lastupdatedDate: '2000-03-23',
      isActive: 1
    },
    {
      id: null,
      subscriptionId: 12,
      clientBillerId: 55,
      share: 5,
      createdDate: '2000-02-22',
      lastupdatedDate: '2000-03-23',
      isActive: 1
    },
    {
      id: null,
      subscriptionId: 12,
      clientBillerId: 75,
      share: 5,
      createdDate: '2000-02-22',
      lastupdatedDate: '2000-03-23',
      isActive: 1
    }
  ];
  advisorId: any;
  family: any;
  familyMemberId: any;

  constructor(public utils: UtilService, public subInjectService: SubscriptionInject, private eventService: EventService,
              private subService: SubscriptionService, private fb: FormBuilder) {
  }

  get data() {
    return this.inputData;
  }

  @Input()
  set data(data) {
    this.inputData = data;
    this.clientId = AuthService.getClientId()
    this.getClientPayeeSettings(data);
  }

  OnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  getListFamilyMem() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    const obj = {
      advisorId: this.advisorId,
      clientId: this.upperData.id
    };
    this.subService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }
  getListOfFamilyByClientRes(data) {
    console.log('family Memebers', data)
    this.family = data.familyMembersList
  }
  getOwnerName(data){
    this.familyMemberId = data.id
  }
  getFormControl() {
    return this.payeeSettingsForm.controls;
  }

  getClientPayeeSettings(data) {
    data = data.data;
    console.log('payee data', data);
    this.payeeSettingsForm = this.fb.group({
      customerName: [data.name, [Validators.required]],
      displayName: [data.companyDisplayName, [Validators.required]],
      customerType: [(data.customerTypeId == 1) ? 'Bussiness' : 'Individual'],
      companyName: [data.companyName, [Validators.required]],
      emailId: [data.email, [Validators.required]],
      primaryContact: [data.primaryContact, [Validators.required]],
      pan: [data.pan, [Validators.required]],
      gstTreatment: [(data.gstTreatmentId == 1) ? 'Registered Business - Regular' : (data.gstTreatmentId == 2) ? 'Registered Business - Composition' : 'Unregistered Business'],
      gstIn: [data.gstin, [Validators.required]],
      billingAddress: [data.billerAddress, [Validators.required]],
      city: [data.city],
      state: [data.state],
      country: [data.country],
      pincode: [data.zipCode, [Validators.required]],
      id: [data.id]
    });
    this.getFormControl().customerName.maxLength = 50;
    this.getFormControl().displayName.maxLength = 40;
    this.getFormControl().companyName.maxLength = 50;
    this.getFormControl().emailId.maxLength = 40;
    this.getFormControl().primaryContact.maxLength = 10;
    this.getFormControl().pan.maxLength = 10;
    this.getFormControl().gstIn.maxLength = 16;
    this.getFormControl().billingAddress.maxLength = 150;
    this.getFormControl().pincode.maxLength = 6;
    this.getListFamilyMem();
  }

  getRightSliderData(data) {
    this.settingsModal = data;
  }

  ngOnInit() {
    this.getChangePayeeSetting();
  }

  getChangePayeeSetting() {
    this.subService.changePayeeSetting(this.obj).subscribe(
        data => this.changePayeeSettingData(data)
    );
  }

  changePayeeSettingData(data) {
    console.log('data', data);
  }

  Close(data) {
    // this.subInjectService.rightSliderData(state)
    // this.subInjectService.rightSideData(state);
    this.subInjectService.changeUpperRightSliderState({state: 'close', data});
  }

  savePayeeSettings() {
    this.inputData
    if (this.payeeSettingsForm.get('customerName').invalid) {
      this.payeeSettingsForm.get('customerName').markAsTouched();
      return
    } else if (this.payeeSettingsForm.get('customerName').invalid) {
      this.payeeSettingsForm.get('customerName').markAsTouched();
      return
    } else if (this.payeeSettingsForm.get('companyName').invalid) {
      this.payeeSettingsForm.get('companyName').markAsTouched();
      return
    }  else if(this.payeeSettingsForm.get('emailId').invalid) {
      this.payeeSettingsForm.get('emailId').markAsTouched();
      return
    }else if (this.payeeSettingsForm.get('pan').invalid) {
      this.payeeSettingsForm.get('pan').markAsTouched();
      return
    } else if (this.payeeSettingsForm.get('pincode').invalid) {
      this.payeeSettingsForm.get('pincode').markAsTouched();
      return
    } else if (this.payeeSettingsForm.get('gstIn').invalid) {
      this.payeeSettingsForm.get('gstIn').markAsTouched();
      return
    } else if (this.payeeSettingsForm.get('primaryContact').invalid) {
      this.payeeSettingsForm.get('primaryContact').markAsTouched();
      return
    }else if (this.payeeSettingsForm.get('billingAddress').invalid) {
      this.payeeSettingsForm.get('billingAddress').markAsTouched();
      return
    } else if (this.payeeSettingsForm.get('city').invalid) {
      this.payeeSettingsForm.get('city').markAsTouched();
      return
    } else if (this.payeeSettingsForm.get('country').invalid) {
      this.payeeSettingsForm.get('country').markAsTouched();
      return
    } else if (this.payeeSettingsForm.get('state').invalid) {
      this.payeeSettingsForm.get('state').markAsTouched();
      return
    } else {
      if (this.payeeSettingsForm.controls.id.value != undefined) {
        const obj1 = {
          customerName: this.getFormControl().customerName.value,
          city: this.payeeSettingsForm.controls.city.value,
          clientBillerId: 1,
          familyMemberId :  this.familyMemberId,
          companyName: this.payeeSettingsForm.controls.companyName.value,
          country: this.payeeSettingsForm.controls.country.value,
          currency: 'string',
          customerTypeId: (this.payeeSettingsForm.controls.customerType.value == 'Bussiness') ? 1 : 2,
          email: this.payeeSettingsForm.controls.emailId.value,
          gstTreatmentId: (this.payeeSettingsForm.controls.gstTreatment.value == 'Registered Business - Regular') ? 1 : (this.payeeSettingsForm.controls.gstTreatment.value == 'Registered Business - Composition') ? 2 : 3,
          gstin: this.payeeSettingsForm.controls.gstIn.value,
          payeeTypeId: 1,
          paymentTermsId: 1,
          billerAddress: this.payeeSettingsForm.controls.billingAddress.value,
          primaryContact: this.payeeSettingsForm.controls.primaryContact.value,
          state: this.payeeSettingsForm.controls.state.value,
          zipCode: this.payeeSettingsForm.controls.pincode.value,
          id: this.payeeSettingsForm.controls.id.value,
          clientId: this.upperData.id
        };
        this.sendData = obj1;
        this.subService.editPayeeSettings(obj1).subscribe(
            data => this.editSettingResData(data)
        );

      } else {

        const obj = {
          customerName: this.getFormControl().customerName.value,
          gstin: this.getFormControl().gstIn.value,
          familyMemberId :  this.familyMemberId ,
          gstTreatmentId: (this.getFormControl().gstTreatment.value == 'Registered Business - Regular') ? 1 : (this.payeeSettingsForm.controls.gstTreatment.value == 'Registered Business - Composition') ? 2 : 3,
          email: this.getFormControl().emailId.value,
          customerTypeId: (this.getFormControl().customerType.value == 'Bussiness') ? '1' : '2',
          primaryContact: this.getFormControl().primaryContact.value,
          companyName: this.getFormControl().companyName.value,
          companyDisplayName: this.getFormControl().displayName.value,
          billerAddress: this.getFormControl().billingAddress.value,
          city: this.getFormControl().city.value,
          state: this.getFormControl().state.value,
          pan: this.getFormControl().pan.value,
          country: this.getFormControl().country.value,
          zipCode: this.getFormControl().pincode.value,
          clientId: this.clientId,

        };
        this.subService.addClientBillerProfile(obj).subscribe(
            data => this.addClientBillerProfileRes(data)
        );

      }
    }

  }

  addClientBillerProfileRes(data) {
    if (this.inputData.data == "Add") {
      // this.totalPayeeData.emit(true)obj=
      let obj = {
        data: data,
        flag: true
      }
      this.subInjectService.addEvent(obj)
      this.subInjectService.changeUpperRightSliderState({state: 'close', data});
      this.eventService.openSnackBar('Client profile added Successfully', 'OK');
    } else {
      console.log('addClientBillerProfileRes', data);
      this.updatedData = data;
      this.closeTab(data);
      this.subInjectService.changeUpperRightSliderState({state: 'close', data});
      this.eventService.openSnackBar('Client profile added Successfully', 'OK');
    }
  }

  editSettingResData(data) {
    if (data.status == 1) {
      this.subInjectService.changeUpperRightSliderState({state: 'close', data});
      this.eventService.openSnackBar('Client profile update Successfully', 'OK');
      this.getEditData.emit(this.sendData);
      this.closeTab(data);
    }
  }

  closeTab(data) {
    // if (data.status == 1) {
    this.Close(data);
    // }
  }
}
