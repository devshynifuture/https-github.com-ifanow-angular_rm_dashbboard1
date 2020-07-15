import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {ProcessTransactionService} from '../../doTransaction/process-transaction.service';
import {CustomerService} from 'src/app/component/protect-component/customers/component/customer/customer.service';
import {DatePipe} from '@angular/common';
import {UtilService} from 'src/app/services/util.service';
import {OnlineTransactionService} from '../../../online-transaction.service';
import {EventService} from 'src/app/Data-service/event.service';
import {AuthService} from 'src/app/auth-service/authService';
import {FileUploadService} from 'src/app/services/file-upload.service';
import {apiConfig} from 'src/app/config/main-config';
import {appConfig} from 'src/app/config/component-config';
import {FileItem, ParsedResponseHeaders} from 'ng2-file-upload';
import {IinUccCreationComponent} from '../../IIN/UCC-Creation/iin-ucc-creation/iin-ucc-creation.component';
import {map, startWith} from 'rxjs/operators';
import {EnumDataService} from 'src/app/services/enum-data.service';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';

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
  customValue: any = 2;
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
  imageUploaded: any = undefined;
  imageLoader: boolean = false;

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
            let list = this.enumDataService.getClientAndFamilyData(state);
            if (list.length == 0) {
              this.generalDetails.controls.ownerName.setErrors({invalid: true});
            }
            return this.enumDataService.getClientAndFamilyData(state);
          } else {
            return this.enumDataService.getEmptySearchStateData();
          }
        }),
      );
  }

  closeRightSlider(flag) {
    this.subInjectService.changeNewRightSliderState({state: 'close', refreshRequired: flag});
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


  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
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

  getBankDetailsNSERes(data) {
    this.isLoadingBank = false;
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
      holdingType: [(!data) ? '' : data.ownerName, [Validators.required]],
      bank: [(!data) ? '' : data.bank, [Validators.required]],
      // taxStatus: [data ? '' : data.ownerName, [Validators.required]],
      fromDate: [fromDate, [Validators.required]],
      toDate: [endDate, [Validators.required]],
      mandateAmount: [data ? '' : data.mandateAmount, [Validators.required, Validators.min(100)]],
      selectDateOption: [this.customValue, [Validators.required]],
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
    this.nomineesListFM = Object.assign([], value);
  }

  ownerList(value) {
    if (value == '') {
      this.nomineesListFM = undefined;
      this.showSpinnerOwner = false;
      this.errorMsg = undefined;
      this.generalDetails.controls.holdingType.reset();
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
      holdingType: this.generalDetails.controls.holdingType.value,
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
          this.clientCodeData = data;
          if (this.clientCodeData.length == 1) {
            this.generalDetails.controls.holdingType.setValue(this.clientCodeData[0].clientCode);
            this.selectIINUCC(this.clientCodeData[0]);
          }
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
    this.barButtonOptions.active = true;
    this.formDate = new Date(this.generalDetails.controls.fromDate.value);
    this.toDate = new Date(this.generalDetails.controls.toDate.value);
    Object.assign(this.selectedMandate, {advisorId: this.detailsIIN.advisorId});
    Object.assign(this.selectedMandate, {clientCode: this.detailsIIN.clientCode});
    Object.assign(this.selectedMandate, {amount: this.generalDetails.controls.mandateAmount.value});
    Object.assign(this.selectedMandate, {toDate: (this.toDate).getTime()});
    Object.assign(this.selectedMandate, {fromDate: (this.formDate).getTime()});
    Object.assign(this.selectedMandate, {tpUserCredFamilyMappingId: this.detailsIIN.tpUserCredFamilyMappingId});
    Object.assign(this.selectedMandate, {tpUserCredentialId: this.detailsIIN.tpUserCredentialId});
    this.onlineTransact.addMandate(this.selectedMandate).subscribe(
      data => this.addMandateRes(data), (error) => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar(error, 'Dismiss');
        this.errorMsg = error;
      }
    );
  }

  addMandateRes(data) {

    if (data) {
      this.barButtonOptions.active = false;
      this.madateResponse = data;
      this.eventService.openSnackBar('Added successfully!', 'Dismiss');
      // this.subInjectService.changeNewRightSliderState({state: 'close', data, refreshRequired: true});

      this.showUploadSection = true;
    }
  }

  getFileDetails(e, flag) {

    this.imageLoader = true;
    this.file = e.target.files[0];
    const file = e.target.files[0];
    const requestMap = {
      // tpUserRequestId: 1,
      documentType: flag,
      tpMandateDetailId: this.madateResponse.id,
      // clientCode: this.detailsIIN.clientCode
    };
    FileUploadService.uploadFileToServer(apiConfig.TRANSACT + appConfig.MANDATE_UPLOAD,
      file, requestMap, (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {

        if (status == 200) {
          this.imageLoader = false;
          this.closeRightSlider(true);
          const responseObject = JSON.parse(response);
          this.eventService.openSnackBar('File uploaded successfully', "Dismiss");
        } else {
          const responseObject = JSON.parse(response);
          this.imageLoader = false;
          this.eventService.openSnackBar(responseObject.message, 'Dismiss', null, 60000);
        }
      });
  }
}
