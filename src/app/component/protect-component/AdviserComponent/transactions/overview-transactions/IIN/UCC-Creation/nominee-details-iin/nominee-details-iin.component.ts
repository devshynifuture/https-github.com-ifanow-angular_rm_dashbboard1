import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { OnlineTransactionService } from '../../../../online-transaction.service';

@Component({
  selector: 'app-nominee-details-iin',
  templateUrl: './nominee-details-iin.component.html',
  styleUrls: ['./nominee-details-iin.component.scss']
})
export class NomineeDetailsIinComponent implements OnInit {
  holdingList: any[];
  nomineeDetails: any;
  inputData: any;
  allData: any;
  nomineeList: any;
  holderList: any;
  bankDetailList: any;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,private onlineTransact: OnlineTransactionService,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }
    @Input()
    set data(data) {
      this.inputData = data;
      this.allData = data
      this.getdataForm(data)
    }
  
    get data() {
      return this.inputData;
    }
  ngOnInit() {
    this.getdataForm('')
    this.holdingList = []
  }
  close() {
    const fragmentData = {
      direction: 'top',
      componentName: NomineeDetailsIinComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  getdataForm(data) {

    this.nomineeDetails = this.fb.group({
      nomineeName: [(!data) ? '' : data.nomineeName, [Validators.required]],
      relationType: [data ? '' : data.relationType, [Validators.required]],
      nomineeType: [data ? '' : data.nomineeType, [Validators.required]],
      nominneDOB: [data ? '' : data.nominneDOB, [Validators.required]],
      nomineePercentage: [data ? '' : data.nomineePercentage, [Validators.required]],
      addressType: [data ? '' : data.nameAsPan, [Validators.required]],
      addressLine1: [data ? '' : data.motherName, [Validators.required]],
      addressLine2: [data ? '' : data.dateOfBirth, [Validators.required]],
      pinCode: [data ? '' : data.gender, [Validators.required]],
      city: [data ? '' : data.maritalStatus, [Validators.required]],
      district: [data ? '' : data.maritalStatus, [Validators.required]],
      state: [data ? '' : data.maritalStatus, [Validators.required]],
      country: [data ? '' : data.maritalStatus, [Validators.required]],
    });
  }
  getFormControl(): any {
    return this.nomineeDetails.controls;
  }

  saveNomineeDetails(value) {
    this.nomineeList =[]
    this.holderList = []
    this.bankDetailList = []
    if (value == 'skip') {
      let address = {
        addressType: this.nomineeDetails.controls.addressType.value,
        addressLine1: this.nomineeDetails.controls.addressLine1.value,
        addressLine2: this.nomineeDetails.controls.addressLine2.value,
        pinCode: this.nomineeDetails.controls.pinCode.value,
        city: this.nomineeDetails.controls.city.value,
        district: this.nomineeDetails.controls.district.value,
        state: this.nomineeDetails.controls.state.value,
        country: this.nomineeDetails.controls.country.value,
      }
      let obj = {
        nomineeName: this.nomineeDetails.controls.nomineeName.value,
        relationType: this.nomineeDetails.controls.relationType.value,
        nomineeType: this.nomineeDetails.controls.nomineeType.value,
        nominneDOB: this.nomineeDetails.controls.nominneDOB.value,
        nomineePercentage: this.nomineeDetails.controls.nomineePercentage.value,
        address:address
      }
      console.log('personalDetials obj', obj)
      this.holdingList.push(obj);
      //this.openContactDetails(obj)
    }
    if (this.nomineeDetails.get('nomineeName').invalid) {
      this.nomineeDetails.get('nomineeName').markAsTouched();
      return
    } else if (this.nomineeDetails.get('relationType').invalid) {
      this.nomineeDetails.get('relationType').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('nomineeType').invalid) {
      this.nomineeDetails.get('nomineeType').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('nominneDOB').invalid) {
      this.nomineeDetails.get('nominneDOB').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('nomineePercentage').invalid) {
      this.nomineeDetails.get('nomineePercentage').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('addressType').invalid) {
      this.nomineeDetails.get('addressType').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('addressLine1').invalid) {
      this.nomineeDetails.get('addressLine1').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('addressLine2').invalid) {
      this.nomineeDetails.get('addressLine2').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('pinCode').invalid) {
      this.nomineeDetails.get('pinCode').markAsTouched();
      return;
    }else if (this.nomineeDetails.get('city').invalid) {
      this.nomineeDetails.get('city').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('district').invalid) {
      this.nomineeDetails.get('district').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('country').invalid) {
      this.nomineeDetails.get('country').markAsTouched();
      return;
    } else {
      let address = {
        addressType: this.nomineeDetails.controls.addressType.value,
        addressLine1: this.nomineeDetails.controls.addressLine1.value,
        addressLine2: this.nomineeDetails.controls.addressLine2.value,
        pinCode: this.nomineeDetails.controls.pinCode.value,
        city: this.nomineeDetails.controls.city.value,
        district: this.nomineeDetails.controls.district.value,
        state: this.nomineeDetails.controls.state.value,
        country: this.nomineeDetails.controls.country.value,
      }
      let obj = {
        nomineeName: this.nomineeDetails.controls.nomineeName.value,
        relationType: this.nomineeDetails.controls.relationType.value,
        nomineeType: this.nomineeDetails.controls.nomineeType.value,
        nominneDOB: this.nomineeDetails.controls.nominneDOB.value,
        nomineePercentage: this.nomineeDetails.controls.nomineePercentage.value,
        address:address
      }

      console.log('nominnee list obj', obj)
      this.nomineeList.push(obj);
      this.holderList.push(this.allData.holderList)
      const sendData = {
        nomineeList : this.nomineeList,
        holderList: this.holderList,
        bankDetailList: this.allData.bankDetailList,
        ownerName: this.allData.ownerName,
        holdingType: this.allData.holdingNature,
        taxStatus: this.allData.taxStatus,
        id: 2,
        advisorId: 414,
        aggregatorType: 1,
        familyMemberId: 112166,
        commMode: 1,
        confirmationFlag: 1,
        tpUserSubRequestClientId1: 2,
        bankDetail1: 3,
        nomineeDetailId1: 2,
      }
      
      this.onlineTransact.createIINUCC(sendData).subscribe(
        data => this.createIINUCCRes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    }
  }
  createIINUCCRes(data){
      console.log('data to created',data)
  }
}
