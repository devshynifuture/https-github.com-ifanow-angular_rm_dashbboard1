import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType } from 'src/app/services/util.service';
import { PostalService } from 'src/app/services/postal.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-client-address',
  templateUrl: './client-address.component.html',
  styleUrls: ['./client-address.component.scss']
})
export class ClientAddressComponent implements OnInit {
  userData: any;

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private postalService: PostalService, private peopleService: PeopleService, private eventService: EventService) { }
  addressForm;
  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();
  @Input() set data(data) {
    this.userData = data;
  }
  ngOnInit() {
    this.addressForm = this.fb.group({
      proofType: ['1', [Validators.required]],
      addProofType: [, [Validators.required]],
      proofIdNum: [, [Validators.required]],
      addressLine1: [, [Validators.required]],
      addressLine2: [, [Validators.required]],
      pinCode: [, [Validators.required]],
      city: [, [Validators.required]],
      state: [, [Validators.required]],
      country: [, [Validators.required]]
    })
  }
  getPostalPin(value) {
    let obj = {
      zipCode: value
    }
    console.log(value, "check value");
    if (value != "") {
      this.postalService.getPostalPin(value).subscribe(data => {
        console.log('postal 121221', data)
        this.PinData(data)
      })
    }
  }
  PinData(data) {
    let pincodeData = (data == undefined) ? data = {} : data[0].PostOffice;
    this.addressForm.get('city').setValue(pincodeData[0].District)
    this.addressForm.get('state').setValue(pincodeData[0].State);
    this.addressForm.get('country').setValue(pincodeData[0].Country);
  }
  addMore() {
    this.addressForm.reset();
  }
  saveNext(flag) {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    else {

      let obj =
      {
        "address1": this.addressForm.get('addressLine1').value,
        "address2": this.addressForm.get('addressLine2').value,
        "address3": '',
        "pinCode": this.addressForm.get('pinCode').value,
        "city": this.addressForm.get('city').value,
        "state": this.addressForm.get('state').value,
        "stateId": '',
        "country": this.addressForm.get('country').value,
        "userId": this.userData.clientId,
        "userType": 1,
        "addressType": this.addressForm.get('proofType').value,
        "proofType": this.addressForm.get('addProofType').value,
        "proofIdNumber": this.addressForm.get('proofIdNum').value,
        "userAddressMappingId": null,
        "addreesId": null
      }

      this.peopleService.addEditClientAddress(obj).subscribe(
        data => {
          console.log(data);
          (flag == 'Next') ? this.tabChange.emit(1) : this.close();
        },
        err => this.eventService.openSnackBar(err, "Dismiss")
      )
    }
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
