import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { ProcessTransactionService } from '../../doTransaction/process-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { PostalService } from 'src/app/services/postal.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-mandate-creation',
  templateUrl: './mandate-creation.component.html',
  styleUrls: ['./mandate-creation.component.scss']
})
export class MandateCreationComponent implements OnInit {
  inputData: any;
  displayedColumns: string[] = ['set', 'position', 'name', 'weight', 'ifsc', 'aid', 'euin', 'hold'];
  data1: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.inputData);
  bankDetails: any;
  pinInvalid: boolean;
  advisorId: any;
  selectedMandate: any;
  isLoading;
  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private postalService: PostalService,
    private processTransaction: ProcessTransactionService, private onlineTransact: OnlineTransactionService,
    public utils: UtilService, public eventService: EventService) { }
  validatorType = ValidatorType
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('all data in per', this.inputData)
    this.dataSource = this.inputData
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.getdataForm('')
    this.advisorId = AuthService.getAdvisorId();
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
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
    else {
      this.pinInvalid = false;
    }
  }

  PinData(data) {
    if (data[0].Status == "Error") {
      this.pinInvalid = true;

      this.getFormControl().pinCode.setErrors(this.pinInvalid);
      this.getFormControl().city.setValue("");
      this.getFormControl().country.setValue("");
      this.getFormControl().state.setValue("");

    }
    else {
      this.getFormControl().city.setValue(data[0].PostOffice[0].Region);
      this.getFormControl().country.setValue(data[0].PostOffice[0].Country);
      this.getFormControl().state.setValue(data[0].PostOffice[0].Circle);
      this.pinInvalid = false;
    }
  }
  getdataForm(data) {
    if (!data) {
      data = {
        address: {}
      }
    }
    this.bankDetails = this.fb.group({
      ifscCode: [(!data) ? '' : data.ifscCode, [Validators.required]],
      bankName: [!data ? '' : data.bankName, [Validators.required]],
      micrCode: [!data ? '' : data.micrCode, [Validators.required]],
      accountNumber: [!data ? '' : data.accountNumber, [Validators.required]],
      accountType: [!data ? '' : data.accountType, [Validators.required]],
      branchCode: [!data ? '' : data.branchCode, [Validators.required]],
      firstHolder: [!data ? '' : data.firstHolder, [Validators.required]],
      branchName: [!data ? '' : data.branchName, [Validators.required]],
      branchAdd1: [!data.address ? '' : data.address.address1, [Validators.required]],
      branchAdd2: [!data.address ? '' : data.address.address2, [Validators.required]],
      pinCode: [!data.address ? '' : data.address.pinCode, [Validators.required]],
      city: [!data.address ? '' : data.address.city, [Validators.required]],
      state: [!data.address ? '' : data.address.state, [Validators.required]],
      country: [!data.address ? '' : data.address.country, [Validators.required]],
      branchProof: [!data.address ? '' : data.address.branchProof, [Validators.required]],
      bankMandate: [!data.address ? '' : data.address.bankMandate, [Validators.required]],
      mandateDate: [!data.address ? '' : data.address.mandateDate, [Validators.required]],
      mandateAmount: [!data.address ? '' : data.address.mandateAmount, [Validators.required]],
    });
  }
  getFormControl(): any {
    return this.bankDetails.controls;
  }
  createMandate() {

    if (this.bankDetails.get('ifscCode').invalid) {
      this.bankDetails.get('ifscCode').markAsTouched();
      return;
    } else if (this.bankDetails.get('bankName').invalid) {
      this.bankDetails.get('bankName').markAsTouched();
      return;
    } else if (this.bankDetails.get('micrCode').invalid) {
      this.bankDetails.get('micrCode').markAsTouched();
      return
    } else if (this.bankDetails.get('accountNumber').invalid) {
      this.bankDetails.get('accountNumber').markAsTouched();
      return;
    } else if (this.bankDetails.get('accountType').invalid) {
      this.bankDetails.get('accountType').markAsTouched();
      return;
    } else if (this.bankDetails.get('firstHolder').invalid) {
      this.bankDetails.get('firstHolder').markAsTouched();
      return;
    } else if (this.bankDetails.get('branchAdd1').invalid) {
      this.bankDetails.get('branchAdd1').markAsTouched();
      return;
    } else if (this.bankDetails.get('branchAdd2').invalid) {
      this.bankDetails.get('branchAdd2').markAsTouched();
      return;
    } else if (this.bankDetails.get('pinCode').invalid) {
      this.bankDetails.get('pinCode').markAsTouched();
      return;
    } else if (this.bankDetails.get('city').invalid) {
      this.bankDetails.get('city').markAsTouched();
      return;
    } else if (this.bankDetails.get('branchProof').invalid) {
      this.bankDetails.get('branchProof').markAsTouched();
      return;
    } else if (this.bankDetails.get('bankMandate').invalid) {
      this.bankDetails.get('bankMandate').markAsTouched();
      return;
    } else if (this.bankDetails.get('mandateDate').invalid) {
      this.bankDetails.get('mandateDate').markAsTouched();
      return;
    } else if (this.bankDetails.get('mandateAmount').invalid) {
      this.bankDetails.get('mandateAmount').markAsTouched();
      return;
    } else {
      let address = {
        address1: this.bankDetails.controls.branchAdd1.value,
        address2: this.bankDetails.controls.branchAdd2.value,
        pinCode: this.bankDetails.controls.pinCode.value,
        state: this.bankDetails.controls.state.value,
        city: this.bankDetails.controls.city.value,
        country: this.bankDetails.controls.country.value,
        branchProof: this.bankDetails.controls.branchProof.value,
        bankMandate: this.bankDetails.controls.bankMandate.value,
        mandateDate: this.bankDetails.controls.mandateDate.value,
        mandateAmount: this.bankDetails.controls.mandateAmount.value,
      }
      let value = {
        ifscCode: this.bankDetails.controls.ifscCode.value,
        accountNumber: this.bankDetails.controls.accountNumber.value,
        accountType: this.bankDetails.controls.accountType.value,
        bankName: this.bankDetails.controls.bankName.value,
        branchName: this.bankDetails.controls.branchName.value,
        branchCode: this.bankDetails.controls.branchCode.value,
        micrCode: this.bankDetails.controls.micrCode.value,
        firstHolder: this.bankDetails.controls.firstHolder.value,
        address: address
      }
      console.log('mandate details', value)
    }
  }
}
