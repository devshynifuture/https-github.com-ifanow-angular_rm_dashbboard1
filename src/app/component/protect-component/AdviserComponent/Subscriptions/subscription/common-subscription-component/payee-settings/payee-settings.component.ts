import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { PostalService } from 'src/app/services/postal.service';

@Component({
  selector: 'app-payee-settings',
  templateUrl: './payee-settings.component.html',
  styleUrls: ['./payee-settings.component.scss']
})
export class PayeeSettingsComponent implements OnInit {
  clientId: any;
  @Output() totalPayeeData = new EventEmitter<Object>();
  settingsModal;
  payeeSettingsForm;
  sendData;
  updatedData: any;
  inputData: any;
  validatorType = ValidatorType;

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
  showGstin: any;
  clientData: any;

  constructor(public utils: UtilService, public subInjectService: SubscriptionInject, private eventService: EventService,
    private subService: SubscriptionService, private fb: FormBuilder, private postalService: PostalService, ) {
  }

  get data() {
    return this.inputData;
  }

  @Input()
  set data(data) {
    this.inputData = data;
    // this.clientId = AuthService.getClientId()
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
      clientId: this.clientData.id
    };
    this.subService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }
  getPostalPin(value) {
    let obj = {
      zipCode: value
    }
    if (value.length > 5) {
      this.postalService.getPostalPin(value).subscribe(data => {
        console.log('postal 121221', data)
        this.PinData(data)
      })
    }
  }
  PinData(data) {
    this.getFormControl().city.setValue(data[0].PostOffice[0].District)
    this.getFormControl().country.setValue(data[0].PostOffice[0].Country)
    this.getFormControl().state.setValue(data[0].PostOffice[0].Circle)
  }
  gstTreatmentRemove(value) {
    this.showGstin = value
  }
  getListOfFamilyByClientRes(data) {
    console.log('family Memebers', data)
    this.family = data.familyMembersList
  }
  getOwnerName(data) {
    this.familyMemberId = data.id
  }
  getFormControl() {
    return this.payeeSettingsForm.controls;
  }

  getClientPayeeSettings(data) {
    (data == 'Add') ? data = {} : data
    this.clientData = data.clientData;
    console.log('payee data', data);
    this.payeeSettingsForm = this.fb.group({
      customerName: [data.name, [Validators.required]],
      displayName: [data.companyDisplayName, [Validators.required]],
      customerType: [(data.customerTypeId == 1) ? 'Business' : 'Individual'],
      companyName: [data.companyName, [Validators.required]],
      emailId: [data.email, [Validators.required]],
      primaryContact: [data.primaryContact, [Validators.required]],
      pan: [data.pan, [Validators.required, Validators.pattern("^[A-Za-z]{5}[0-9]{4}[A-z]{1}")]],
      gstTreatment: [(data.gstTreatmentId == 1) ? 'Registered Business - Regular' : (data.gstTreatmentId == 2) ? 'Registered Business - Composition' : 'Unregistered Business'],
      gstIn: [data.gstin, [Validators.required]],
      billingAddress: [data.billerAddress, [Validators.required]],
      city: [data.city],
      state: [data.state],
      country: [data.country],
      pincode: [data.zipCode, [Validators.required, Validators.minLength(6)]],
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
    this.subInjectService.changeNewRightSliderState({ state: 'close', data });
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
    } else if (this.payeeSettingsForm.get('emailId').invalid) {
      this.payeeSettingsForm.get('emailId').markAsTouched();
      return
    } else if (this.payeeSettingsForm.get('pan').invalid) {
      this.payeeSettingsForm.get('pan').markAsTouched();
      return
    } else if (this.payeeSettingsForm.get('pincode').invalid) {
      this.payeeSettingsForm.get('pincode').markAsTouched();
      return
    } else if (this.payeeSettingsForm.get('primaryContact').invalid) {
      this.payeeSettingsForm.get('primaryContact').markAsTouched();
      return
    } else if (this.payeeSettingsForm.get('billingAddress').invalid) {
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
          customerName: this.payeeSettingsForm.controls.customerName.value,
          city: this.payeeSettingsForm.controls.city.value,
          clientBillerId: 1,
          companyDisplayName: this.payeeSettingsForm.controls.displayName.value,
          familyMemberId: this.familyMemberId,
          companyName: this.payeeSettingsForm.controls.companyName.value,
          country: this.payeeSettingsForm.controls.country.value,
          currency: 'string',
          customerTypeId: (this.payeeSettingsForm.controls.customerType.value == 'Business') ? 1 : 2,
          email: this.payeeSettingsForm.controls.emailId.value,
          gstTreatmentId: (this.payeeSettingsForm.controls.gstTreatment.value == 'Registered Business - Regular') ? 1 : (this.payeeSettingsForm.controls.gstTreatment.value == 'Registered Business - Composition') ? 2 : 3,
          gstin: (this.payeeSettingsForm.controls.gstIn.value == null) ? 0 : this.payeeSettingsForm.controls.gstIn.value,
          payeeTypeId: 1,
          paymentTermsId: 1,
          billerAddress: this.payeeSettingsForm.controls.billingAddress.value,
          primaryContact: this.payeeSettingsForm.controls.primaryContact.value,
          state: this.payeeSettingsForm.controls.state.value,
          zipCode: this.payeeSettingsForm.controls.pincode.value,
          id: this.payeeSettingsForm.controls.id.value,
          clientId: this.clientData.id
        };
        this.sendData = obj1;
        this.subService.editPayeeSettings(obj1).subscribe(
          data => this.editSettingResData(data)
        );

      } else {

        const obj = {
          customerName: this.getFormControl().customerName.value,
          gstin: (this.getFormControl().gstIn.value == null) ? 0 : this.payeeSettingsForm.controls.gstIn.value,
          familyMemberId: this.familyMemberId,
          gstTreatmentId: (this.getFormControl().gstTreatment.value == 'Registered Business - Regular') ? 1 : (this.payeeSettingsForm.controls.gstTreatment.value == 'Registered Business - Composition') ? 2 : 3,
          email: this.getFormControl().emailId.value,
          customerTypeId: (this.getFormControl().customerType.value == 'Business') ? '1' : '2',
          primaryContact: this.getFormControl().primaryContact.value,
          companyName: this.getFormControl().companyName.value,
          companyDisplayName: this.getFormControl().displayName.value,
          billerAddress: this.getFormControl().billingAddress.value,
          city: this.getFormControl().city.value,
          state: this.getFormControl().state.value,
          pan: this.getFormControl().pan.value,
          country: this.getFormControl().country.value,
          zipCode: this.getFormControl().pincode.value,
          clientId: this.clientData.id,

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
      this.subInjectService.changeNewRightSliderState({ state: 'close', data });
      this.eventService.openSnackBar('Client profile added Successfully', 'OK');
    } else {
      console.log('addClientBillerProfileRes', data);
      this.updatedData = data;
      this.closeTab(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close', data });
      this.eventService.openSnackBar('Client profile added Successfully', 'OK');
    }
  }

  editSettingResData(data) {
    if (data.status == 1) {
      this.subInjectService.changeNewRightSliderState({ state: 'close', data });
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
