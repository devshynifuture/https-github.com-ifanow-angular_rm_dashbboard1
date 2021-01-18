import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../customers/component/customer/customer.service';
import { ValidatorType, UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-account-and-billing',
  templateUrl: './account-and-billing.component.html',
  styleUrls: ['./account-and-billing.component.scss']
})
export class AccountAndBillingComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
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
  flag: string;
  accountBillingForm: any;
  advisorId: any;
  clientId: any;
  validatorType = ValidatorType;

  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject, private fb: FormBuilder, private eventService: EventService, private custumService: CustomerService) {
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId();
  }

  ngOnInit() {
    this.getAccBilling(null);
  }

  getAccBilling(data) {
    if (data) {
      this.flag = "Add account and billing";
    }
    else {
      this.flag = "Edit account and billing";
    }
    this.accountBillingForm = this.fb.group({
      customerType: [data ? data.customerType : '1', [Validators.required]],
      primaryContact: [data ? data.primaryContact : null, [Validators.required]],
      customerName: [data ? data.customerName : null, [Validators.required]],
      cusEmail: [data ? data.customerName : null, [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      cusDispName: [data ? data.cusDispName : null, [Validators.required]],
      cusPhone: [data ? data.cusPhone : null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(ValidatorType.NUMBER_ONLY)]],
      gstTreatment: [data ? data.gstTreatment : '', [Validators.required]],
      gstNo: [data ? data.gstNo : null, [Validators.required]],
      supplyPlace: [data ? data.supplyPlace : null, [Validators.required]],
      panNumber: [data ? data.panNumber : null, [Validators.required, Validators.pattern(this.validatorType.PAN)]],
      address: [data ? data.address : null],
      city: [data ? data.city : null],
      state: [data ? data.state : null, [Validators.required]],
      contry: [data ? data.contry : null],
      zip: [data ? data.zip : null],
    });
  }
  toUpperCase(formControl, event) {
    this.utilService.toUpperCase(formControl, event);
  }
  saveGold() {
    if (this.accountBillingForm.invalid) {
      this.accountBillingForm.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        customerType: this.accountBillingForm.controls.customerType.value,
        primaryContact: this.accountBillingForm.controls.primaryContact.value,
        customerName: this.accountBillingForm.controls.customerName.value,
        cusEmail: this.accountBillingForm.controls.cusEmail.value,
        cusDispName: this.accountBillingForm.controls.cusDispName.value,
        cusPhone: this.accountBillingForm.controls.cusPhone.value,
        gstTreatment: this.accountBillingForm.controls.gstTreatment.value,
        gstNo: this.accountBillingForm.controls.gstNo.value,
        supplyPlace: this.accountBillingForm.controls.supplyPlace.value,
        panNumber: this.accountBillingForm.controls.panNumber.value,
        address: this.accountBillingForm.controls.address.value,
        city: this.accountBillingForm.controls.city.value,
        state: this.accountBillingForm.controls.state.value,
        contry: this.accountBillingForm.controls.contry.value,
        zip: this.accountBillingForm.controls.zip.value,
      }

      if (this.flag == "Add account and billing") {
        this.custumService.addGold(obj).subscribe(
          data => {
          }, (error) => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      } else {
        this.custumService.editGold(obj).subscribe(
          data => { }, (error) => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      }
    }
  }
  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

}
