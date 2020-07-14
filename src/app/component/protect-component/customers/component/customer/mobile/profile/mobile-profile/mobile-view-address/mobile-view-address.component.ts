import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CustomerService } from '../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-mobile-view-address',
  templateUrl: './mobile-view-address.component.html',
  styleUrls: ['./mobile-view-address.component.scss']
})
export class MobileViewAddressComponent implements OnInit {
  adressFlag: boolean;
  addressList: any;
  @Output() backfunc = new EventEmitter();
  selectedAddress: any;
  userData: any;
  constructor(private cusService: CustomerService) { }

  ngOnInit() {
  }

  @Input() set data(data) {
    this.userData = data;
    this.getAddressList(data);
  }

  getAddressList(data) {
    this.adressFlag = true;
    const obj = {
      userId: data.familyMemberId,
      userType: data.userType
    };
    this.cusService.getAddressList(obj).subscribe(
      data => {
        console.log(data);
        if (data && data.length > 0) {
          this.addressList = data;
        } else {
          this.addressList == undefined;
        }
        this.adressFlag = false;
      },
      err => {
        this.adressFlag = false;
        console.error(err);
      }
    );
  }

  back() {
    this.backfunc.emit("FamilyMember");
  }

  addEditFlag(data) {
    this.selectedAddress = undefined;
    this.getAddressList(this.userData);
  }
  addEditAddress(data) {
    this.selectedAddress = this.userData;
    this.selectedAddress['addressData'] = data;
  }
}
