import { Directive, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { AuthService } from 'src/app/auth-service/authService';

@Directive({
  selector: '[appOwner]'
})

export class OwnerDirective {
  isownerName = false;
  owner;
  family = [];
  advisorId: any;
  ownerData: any;
  clientId: any;
  sendData: any;
  constructor(private fb: FormBuilder, private custumService: CustomerService) { }
  @Output() valueChange = new EventEmitter();
  @Output() valueChange1 = new EventEmitter();

  @Input()
  set data(data) {
    this.ownerData = data;
    if (data) {
      this.getListFamilyMem()
    }
  }

  get data() {
    return this.ownerData;
  }
  getListFamilyMem() {

    this.advisorId = AuthService.getAdvisorId();
    // for development purpose


    // this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;

    // for development purpose
    this.clientId = 15545;

    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.custumService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }

  getOwnerName(value) {
    value.familyList = this.family;
    this.valueChange.emit(value);
  }

  getListOfFamilyByClientRes(data) {
    this.sendData = data;
    if (data.familyMembersList && data.familyMembersList.length > 0) {
      data.familyMembersList.forEach((singleData) => {
        if (this.ownerData.ownerName.value && this.ownerData.ownerName.value.length > 0) {
          if (singleData.userName == this.ownerData.ownerName.value) {
          }
        }
        this.family.push(singleData);
      });
    }
    this.valueChange1.emit(this.sendData);
  }

  getdataForm() {
    if (this.owner) {
      // this.owner = this.fb.group({
      //   ownerName: [(this.ownerData.ownerName.value == null) ? '' : this.ownerData.ownerName.value, [Validators.required]],
      // });
    } else {
      this.owner = this.fb.group({
        ownerName: [(this.ownerData.ownerName.value == null) ? '' : this.ownerData.ownerName.value, [Validators.required]],
      });
    }
  }

}
