import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { PostalService } from 'src/app/services/postal.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-payee-settings',
  templateUrl: './payee-settings.component.html',
  styleUrls: ['./payee-settings.component.scss']
})
export class PayeeSettingsComponent implements OnInit {
  validatorType=ValidatorType
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'primary',
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
  }
  clientId: any;
  @Output() totalPayeeData = new EventEmitter<Object>();
  settingsModal;
  payeeSettingsForm;
  sendData;
  updatedData: any;
  inputData: any;
  @Output() closeAddPayee = new EventEmitter();
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
  showGstin: boolean= false;
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
    console.log(data, "check ani");
    if(!this.inputData.flag){
      delete data.id;
    }
    // this.clientId = AuthService.getClientId()
    this.getClientPayeeSettings(data);
  }

  OnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  getListFamilyMem() {
    this.advisorId = AuthService.getAdvisorId();
    // this.clientId = AuthService.getClientId();
    const obj = {
      advisorId: this.advisorId,
      clientId: !this.inputData.flag? this.clientData.clientId : this.clientData.id
    };
    this.subService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }

  pinInvalid:boolean = false;

  getPostalPin(value) {
    let obj = {
      zipCode: value
    }
    console.log(value,"check value");
    if(value != ""){
      this.postalService.getPostalPin(value).subscribe(data => {
        console.log('postal 121221', data)
        this.PinData(data)
      })
    }
    else{
      this.pinInvalid = false;
    }
  }

  PinData(data) {
    if(data[0].Status == "Error"){
      this.pinInvalid = true;
      
        this.getFormControl().pincode.setErrors(this.pinInvalid);
        this.getFormControl().city.setValue("");
        this.getFormControl().country.setValue("");
        this.getFormControl().state.setValue("");
      
    }
    else{
      this.getFormControl().city.setValue(data[0].PostOffice[0].District);
      this.getFormControl().country.setValue(data[0].PostOffice[0].Country);
      this.getFormControl().state.setValue(data[0].PostOffice[0].Circle);
      this.pinInvalid = false;
    }
  }

 
  gstTreatmentRemove(value) {
    console.log('gstTreatmentRemove 123', value)
    if(value == 4){
      this.getFormControl().gstIn.setValidators([Validators.required, Validators.pattern("^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$")]);
      this.showGstin = true;
    }
    else{
      this.getFormControl().gstIn.setValidators(null);
      this.showGstin = false;
    }
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
    this.clientData = data.clientData ? data.clientData : data;
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
      gstIn: [data.gstin],
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
    if(!this.inputData.flag){
      this.closeAddPayee.emit(false);
    }
    else{
      this.subInjectService.changeNewRightSliderState({ state: 'close', data });
    }
  }

  savePayeeSettings() {
    this.inputData
    if (this.payeeSettingsForm.invalid) {
      this.payeeSettingsForm.get('customerName').markAsTouched();
      this.payeeSettingsForm.get('displayName').markAsTouched();
      this.payeeSettingsForm.get('companyName').markAsTouched();
      this.payeeSettingsForm.get('emailId').markAsTouched();
      this.payeeSettingsForm.get('pan').markAsTouched();
      this.payeeSettingsForm.get('gstIn').markAsTouched();
      this.payeeSettingsForm.get('pincode').markAsTouched();
      this.payeeSettingsForm.get('primaryContact').markAsTouched();
      this.payeeSettingsForm.get('billingAddress').markAsTouched();
      this.payeeSettingsForm.get('city').markAsTouched();
      this.payeeSettingsForm.get('country').markAsTouched();
      this.payeeSettingsForm.get('state').markAsTouched();
    } else {
      this.barButtonOptions.active = true;
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
          clientId:!this.inputData.flag? this.clientData.clientId : this.clientData.id
        };
        this.sendData = obj1;
        this.subService.editPayeeSettings(obj1).subscribe(
          data =>{
            this.editSettingResData(data)
          },
          err=>{
            console.log(err, "editPayeeSettings error");
          }
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
          clientId: !this.inputData.flag? this.clientData.clientId : this.clientData.id
        };
        this.subService.addClientBillerProfile(obj).subscribe(
          data =>{
            this.addClientBillerProfileRes(data);
          },
        err=>{
          console.log(err, "addClientBillerProfileRes error");
        }
        );

      }
    }

  }

  addClientBillerProfileRes(data) {
    this.barButtonOptions.active = false;

    // if (this.inputData.data == "Add") {
    //   // this.totalPayeeData.emit(true)obj=
    //   let obj = {
    //     data: data,
    //     flag: true
    //   }
    //   this.subInjectService.addEvent(obj)
    //   this.subInjectService.changeNewRightSliderState({ state: 'close', data });
    //   this.eventService.openSnackBar('Client profile added Successfully', 'OK');
    // } else {
      if(this.inputData.flag){
        console.log('addClientBillerProfileRes', data);
        this.updatedData = data;
        this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
        this.eventService.openSnackBar('Client profile added Successfully', 'OK');
      }
      this.Close(data);
    // }
  }

  editSettingResData(data) {
    this.barButtonOptions.active = false;
    if (data.status == 1) {
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
      this.eventService.openSnackBar('Client profile update Successfully', 'OK');
      this.getEditData.emit(this.sendData);
      this.Close(data);
    }
  }

  // closeTab(data) {
  //   // if (data.status == 1) {
  //   this.Close(data);
  //   // }
  // }
}
