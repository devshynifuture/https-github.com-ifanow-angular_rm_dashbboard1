import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { ProcessTransactionService } from '../../doTransaction/process-transaction.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { IinUccCreationComponent } from '../../IIN/UCC-Creation/iin-ucc-creation/iin-ucc-creation.component';
import { map, startWith } from 'rxjs/operators';
import { EnumDataService } from 'src/app/services/enum-data.service';

const moment = require('moment');

@Component({
  selector: 'app-add-mandate',
  templateUrl: './add-mandate.component.html',
  styleUrls: ['./add-mandate.component.scss']
})
export class AddMandateComponent implements OnInit {
  inputData: any;
  displayedColumns: string[] = ['position', 'bankName', 'accountNo', 'ifsc', 'branchName', 'accountType'];
  dataSource = [];
  nomineesListFM: any = [];
  showSpinnerOwner = false;
  familyMemberData: any;
  familyMemberId: any;
  generalDetails: any;
  clientCodeData: any;
  detailsIIN: any;
  showMandateTable = false;
  selectedMandate: any;
  customValue: any;
  toDate: any;
  formDate: Date;
  isLoading;
  advisorId: any;
  bankDetails: any;
  selectedBank: any;
  isLoadingUcc = false;
  isLoadingBank = false;
  showUploadSection = false;
  madateResponse: any;
  file: any;
  clientCodeDataShow = false;
  errorMsg: any;
  currentDate = new Date();

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private processTrasaction: ProcessTransactionService,
    private custumService: CustomerService, private datePipe: DatePipe,
    public utils: UtilService,
    private onlineTransact: OnlineTransactionService, public eventService: EventService,
    private enumDataService: EnumDataService) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.getdataForm('');
    this.showUploadSection = false;
    this.clientCodeDataShow = false;
    this.nomineesListFM = this.generalDetails.controls.ownerName.valueChanges
      .pipe(
        startWith(''),
        map(state => {
          if (state) {
            let list = this.enumDataService.getSearchData(state);
            if (list.length == 0) {
              this.generalDetails.controls.ownerName.setErrors({ invalid: true });
            }
            return this.enumDataService.getSearchData(state);
          } else {
            return this.enumDataService.getEmptySearchStateData();
          }
        }),
      );
  }

  closeRightSlider(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  close() {
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }

  continuesTill(value) {
    this.customValue = value;
    this.toDate = new Date();
    this.toDate.setDate('31');
    this.toDate.setMonth('11');
    this.toDate.setFullYear('2099');
    this.generalDetails.controls.toDate.setValue(this.toDate);
  }

  getBankDetails() {
    this.isLoadingBank = true;
    const obj = {
      tpUserCredFamilyMappingId: this.detailsIIN.tpUserCredFamilyMappingId
    };
    this.onlineTransact.getBankDetailsNSE(obj).subscribe(
      data => this.getBankDetailsNSERes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }

  getBankDetailsNSERes(data) {
    this.isLoadingBank = false;
    console.log(data);
    this.bankDetails = data;
    if (this.bankDetails && this.bankDetails.length == 1) {
      this.generalDetails.controls.bank.setValue(this.bankDetails[0].id);
      this.selectBank(this.bankDetails[0]);
    }
  }

  getdataForm(data) {
    const endDate = new Date();
    endDate.setDate(31);
    endDate.setMonth(11);
    endDate.setFullYear(2099);
    this.toDate = endDate;
    const fromDate = new Date();
    fromDate.setMinutes(fromDate.getMinutes() + 2);
    this.generalDetails = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      holdingNature: [(!data) ? '' : data.ownerName, [Validators.required]],
      bank: [(!data) ? '' : data.bank, [Validators.required]],
      // taxStatus: [data ? '' : data.ownerName, [Validators.required]],
      fromDate: [fromDate, [Validators.required]],
      toDate: [endDate, [Validators.required]],
      mandateAmount: [data ? '' : data.mandateAmount, [Validators.required, Validators.min(100)]],
      selectDateOption: [(data.mandateAmount) ? data.mandateAmount : '', [Validators.required]],
    });
  }

  getFormControl(): any {
    return this.generalDetails.controls;
  }


  lisNominee(value) {
    // this.showSpinnerOwner = false
    if (value == null) {
      this.errorMsg = undefined;
      // this.transactionAddForm.get('ownerName').setErrors({ 'setValue': 'family member does not exist' });
      // this.transactionAddForm.get('ownerName').markAsTouched();
    }
    console.log(value);
    this.nomineesListFM = Object.assign([], value);
  }

  ownerList(value) {
    if (value == '') {
      this.nomineesListFM = undefined;
      this.showSpinnerOwner = false;
      this.errorMsg = undefined;
      this.generalDetails.controls.holdingNature.reset();
      this.generalDetails.controls.bank.reset();
    } else {
      this.showSpinnerOwner = true;
    }
  }

  ownerDetails(value) {
    this.familyMemberData = value;
    this.familyMemberId = value.familyMemberId;
    this.familyMemberId = value.id;
    this.ownerDetail();
  }

  saveGeneralDetails(data) {
    const obj = {
      ownerName: this.generalDetails.controls.ownerName.value,
      holdingNature: this.generalDetails.controls.holdingNature.value,
      familyMemberId: this.familyMemberId,
      clientId: this.familyMemberData.clientId,
      advisorId: this.advisorId,
      taxStatus: this.generalDetails.controls.taxStatus.value,
    };
    this.openMandate(null);
  }

  ownerDetail() {
    this.isLoadingUcc = true;
    const obj = {
      clientId: this.familyMemberData.clientId,
      advisorId: this.advisorId,
      familyMemberId: this.familyMemberData.familyMemberId,
      // tpUserCredentialId: 292
    };
    this.onlineTransact.getClientCodes(obj).subscribe(
      data => {
        if (data) {
          this.isLoadingUcc = false;
          console.log(data);
          this.clientCodeData = data;
          if (this.clientCodeData.length == 1) {
            this.generalDetails.controls.holdingNature.setValue(this.clientCodeData[0].clientCode);
          }
          console.log('clientCodeData', this.clientCodeData);
        } else {
          this.isLoadingUcc = false;
          this.clientCodeDataShow = true;
        }
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  openNewCustomerIIN() {
    this.closeRightSlider(false);
    const fragmentData = {
      flag: 'addNewCustomer',
      id: 1,
      direction: 'top',
      componentName: IinUccCreationComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );

  }

  selectIINUCC(clientCode) {
    this.detailsIIN = clientCode;
    console.log('fg', this.detailsIIN);
    this.getBankDetails();
    //  this.getBankMandate();
  }

  /*
    getBankMandate() {
      const obj1 = {
        advisorId: this.advisorId,
        tpUserCredFamilyMappingId: this.detailsIIN.tpUserCredFamilyMappingId,
        aggregatorType: this.detailsIIN.aggregatorType,
        tpUserCredentialId: this.detailsIIN.tpUserCredentialId,
        clientCode: this.detailsIIN.clientCode,
      };
      this.onlineTransact.getMandateDetails(obj1).subscribe(
        data => this.getBankDetailsMandateRes(data), (error) => {
          this.eventService.showErrorMessage(error);
        });
    }*/

  getBankDetailsMandateRes(data) {
    console.log(data);
    this.openMandate(data);
  }

  openMandate(data) {
    this.inputData = data;
    this.dataSource = data;
  }

  selectMandate(mandate) {
    this.selectedMandate = mandate;
  }

  selectBank(bank) {
    this.dataSource = [];
    this.selectedBank = bank;
    this.selectedMandate = bank;
    this.dataSource.push(bank);
    this.showMandateTable = true;
    console.log(this.selectedBank);
  }

  createMandates() {
    if (!this.selectedMandate) {
      this.selectedMandate = {};
      return;
    }
    if (this.generalDetails.invalid) {
      this.generalDetails.markAllAsTouched();
      return;
    }
    this.formDate = new Date(this.generalDetails.controls.fromDate.value);
    this.toDate = new Date(this.generalDetails.controls.toDate.value);
    Object.assign(this.selectedMandate, { advisorId: this.detailsIIN.advisorId });
    Object.assign(this.selectedMandate, { clientCode: this.detailsIIN.clientCode });
    Object.assign(this.selectedMandate, { amount: this.generalDetails.controls.mandateAmount.value });
    Object.assign(this.selectedMandate, { toDate: (this.toDate).getTime() });
    Object.assign(this.selectedMandate, { fromDate: (this.formDate).getTime() });
    Object.assign(this.selectedMandate, { tpUserCredFamilyMappingId: this.detailsIIN.tpUserCredFamilyMappingId });
    Object.assign(this.selectedMandate, { tpUserCredentialId: this.detailsIIN.tpUserCredentialId });
    console.log('selectMandate  == ', this.selectedMandate);
    this.onlineTransact.addMandate(this.selectedMandate).subscribe(
      data => this.addMandateRes(data), (error) => {
        this.eventService.openSnackBar(error, 'Dismiss');
        console.log('err', error);
        this.errorMsg = error;
      }
    );
  }

  addMandateRes(data) {
    console.log('res mandate', data);

    if (data) {
      this.madateResponse = data;
      this.eventService.openSnackBar('Added successfully!', 'Dismiss');
      // this.subInjectService.changeNewRightSliderState({state: 'close', data, refreshRequired: true});

      this.showUploadSection = true;
    }
  }

  getFileDetails(e, flag) {
    console.log('file', e);
    this.file = e.target.files[0];
    console.log('file', e);
    const file = e.target.files[0];
    const requestMap = {
      tpUserRequestId: 1,
      documentType: flag,
      tpMandateDetailId: this.madateResponse.id,
      // clientCode: this.detailsIIN.clientCode
    };
    FileUploadService.uploadFileToServer(apiConfig.TRANSACT + appConfig.MANDATE_UPLOAD,
      file, requestMap, (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        console.log('getFileDetails uploadFileToServer callback item : ', item);
        console.log('getFileDetails uploadFileToServer callback status : ', status);
        console.log('getFileDetails uploadFileToServer callback headers : ', headers);
        console.log('getFileDetails uploadFileToServer callback response : ', response);

        if (status == 200) {
          const responseObject = JSON.parse(response);
          console.log('onChange file upload success response url : ', responseObject.url);

        }
      });
  }
}
