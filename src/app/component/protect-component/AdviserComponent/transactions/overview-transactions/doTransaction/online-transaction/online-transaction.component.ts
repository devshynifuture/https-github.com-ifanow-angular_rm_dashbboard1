import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {OnlineTransactionService} from '../../../online-transaction.service';
import {AuthService} from 'src/app/auth-service/authService';
import {EventService} from 'src/app/Data-service/event.service';
import {ProcessTransactionService} from '../process-transaction.service';
import {Router} from '@angular/router';
import {IinUccCreationComponent} from '../../IIN/UCC-Creation/iin-ucc-creation/iin-ucc-creation.component';
import {EnumDataService} from 'src/app/services/enum-data.service';
import {map, startWith} from 'rxjs/operators';
import {PeopleService} from '../../../../../PeopleComponent/people.service';
import {of} from 'rxjs';

@Component({
  selector: 'app-online-trasaction',
  templateUrl: './online-transaction.component.html',
  styleUrls: ['./online-transaction.component.scss']
})
export class OnlineTransactionComponent implements OnInit {

  formStep = 'step-1';
  isSaveAndAddClicked = false;
  familyMemberList = [];
  transactionAddForm: FormGroup = this.fb.group({
    selectInvestor: [, Validators.required],
    transactionType: [, Validators.required],
    schemeSelection: [,],
    investor: [,],
    folioSelection: [,],
    employeeContry: [,],
    investmentAccountSelection: [,],
    modeOfPaymentSelection: [,],
    bankAccountSelection: [,],

  });
  selectedDiv = 'div1';
  ownerName: any;
  nomineesListFM: any = [];
  ownerData: any;
  dataSource: any;
  inputData: any = {};
  isViewInitCalled: any;
  selectedFamilyMember: any;
  advisorId: any;
  checkFamilyMem: any;
  selectedPlatform: any;
  defaultClient: any;
  defaultCredential: any;
  allData: any;
  credentialList: any;
  getPlatformCount: any;
  showSpinnerOwner = false;
  ownerNameQuery = '';
  familyMemberData: any;
  noSubBroker = false;
  noMapping = false;

  transactionType: any;
  transactionData: any;
  filteredStates: any;
  selectedClientOrFamily: any;
  selectedName: any;

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
              private eventService: EventService, private fb: FormBuilder,
              public processTransaction: ProcessTransactionService, private router: Router,
              private enumDataService: EnumDataService, private peopleService: PeopleService) {
    this.advisorId = AuthService.getAdvisorId();
  }

  stateCtrl = new FormControl('', [Validators.required]);

  @Input()
  set data(data) {
    this.familyMemberList = this.enumDataService.getEmptySearchStateData();
    this.inputData = data;
    if (!this.inputData) {
      this.inputData = {};
    }

    if (this.isViewInitCalled) {
      this.getdataForm(data);
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.getdataForm(this.inputData);
    this.setClientFilterList();
    // this.getDefaultDetails(null)
  }

  isAdvisorSection;

  setClientFilterList() {
    if (!this.inputData || this.inputData.isAdvisorSection == null ||
      this.inputData.isAdvisorSection == undefined ||
      this.inputData.isAdvisorSection) {
      this.isAdvisorSection = true;
      this.stateCtrl.valueChanges
        .subscribe(newValue => {
          this.filteredStates = of(this.familyMemberList).pipe(startWith(''),
            map(value => {
              if (newValue) {
                return this.enumDataService.getClientAndFamilyData(newValue);
              } else {
                return this.enumDataService.getEmptySearchStateData();
              }
            }));
        });
    } else {
      this.isAdvisorSection = false;
      const obj = {
        clientId: AuthService.getClientId(),
      };

      this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
        data => {
          this.familyMemberList = data;
          this.filteredStates = of(this.familyMemberList);
        }, error => {
          console.error('error data : ', error);
        }
      );
      this.stateCtrl.valueChanges
        .subscribe(newValue => {
          this.filteredStates = of(this.familyMemberList).pipe(startWith(''),
            map(value => this.processTransaction.filterName(newValue + '', this.familyMemberList)));
        });
    }

    this.stateCtrl.setValue('');
  }

  checkOwnerList(event) {
  }

  getDefaultDetails(platform) {
    this.selectedClientOrFamily = platform.name;
    this.showSpinnerOwner = true;
    this.noMapping = true;

    const obj = {
      advisorId: this.advisorId,
      familyMemberId: platform.userType == 3 ? platform.familyMemberId : 0,
      clientId: platform.clientId,
      // aggregatorType: platform
    };

    this.onlineTransact.getDefaultDetails(obj).subscribe(
      data => {
        this.showSpinnerOwner = false;
        this.getDefaultDetailsRes(data);
      }, error => {
        this.showSpinnerOwner = false;
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getDefaultDetailsRes(data) {
    if (data == undefined) {
      return;
    } else {
      if (data.defaultCredential != undefined) {
        this.noSubBroker = false;
        if (data.defaultClient == undefined) {
          this.noMapping = true;
        } else {
          this.noMapping = false;
        }
      } else {
        this.noSubBroker = true;
      }
    }
    this.showData(data);
  }

  showData(value) {
    if (this.stateCtrl.valid) {
      if (this.formStep == 'step-1') {
        if (this.noMapping == false && this.noSubBroker == false) {
          this.formStep = 'step-2';
        }
      } else if (this.transactionAddForm.get('transactionType').valid && this.formStep == 'step-2' && this.transactionType != undefined) {
        const data = {
          selectedFamilyMember: this.ownerData.ownerName.value,
          transactionType: this.transactionAddForm.controls.transactionType.value,
          clientId: this.familyMemberData.clientId,
          familyMemberId: this.familyMemberData.userType == 3 ? this.familyMemberData.familyMemberId : 0,
          defaultValue: value,
          isAdvisorSection: this.inputData.isAdvisorSection
        };
        this.openPurchaseTransaction(data.transactionType, data);
      }

    }
  }

  noMapFunction() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
    this.router.navigate(['/admin/transactions/investors']);
  }

  noBroakerFun() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
    this.router.navigate(['/admin/transactions/settings/manage-credentials/arn-ria-creds']);

  }


  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

  ownerList(value) {
    if (value == '') {
      this.ownerNameQuery = '';
      this.showSpinnerOwner = false;
    } else {
      this.ownerNameQuery = value;
      this.showSpinnerOwner = true;
    }
  }

  ownerDetails(value) {
    this.selectedName = value.name;
    this.familyMemberData = value;
    this.getDefaultDetails(value);
  }

  getdataForm(data) {
    // this.formStep = data
    if (!data) {
      data = {};
    }
    if (this.dataSource) {
      data = this.dataSource;
    }
    this.transactionAddForm = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      transactionType: [(!data) ? '' : data.transactionType, [Validators.required]],
      bankAccountSelection: [(!data) ? '' : data.bankAccountSelection, [Validators.required]],
      schemeSelection: [(!data) ? '' : data.schemeSelection, [Validators.required]],
      investor: [(!data) ? '' : data.investor, [Validators.required]],
      employeeContry: [(!data) ? '' : data.employeeContry, [Validators.required]],
      investmentAccountSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      modeOfPaymentSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      folioSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
    });

    this.ownerData = this.transactionAddForm.controls;
    this.selectedFamilyMember = this.ownerData.ownerName.value;
  }

  getFormControl(): any {
    return this.transactionAddForm.controls;
  }

  openPurchaseTransaction(value, data) {
    this.transactionType = value;
    this.transactionData = data;

  }

  selectTransactionType(value: string) {
    // this.selectedDiv = value;
    this.transactionAddForm.controls.transactionType.setValue(value);

  }


  getResponse(data) {
    this.formStep = data;
    this.transactionType = undefined;
  }

  openNewCustomerIIN() {
    this.close();
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

  saveAndNext() {
    if (this.noMapping) {
      return;
    }
    if (this.stateCtrl.valid) {

      // if (this.formStep == 'step-1' == this.checkFamilyMem == true) {
      //   if (this.allData && this.allData.length > 0) {
      //     this.formStep = 'step-2';
      //   }
      //   this.formStep = 'step-2';
      // }
      if (this.transactionAddForm.get('transactionType').valid && this.formStep == 'step-2') {
        const data = {
          selectedFamilyMember: this.stateCtrl.value.name,
          transactionType: this.transactionAddForm.controls.transactionType.value,
          clientId: this.familyMemberData.clientId,
          familyMemberId: this.familyMemberData.userType == 3 ? this.familyMemberData.familyMemberId : 0,
          isAdvisorSection: this.isAdvisorSection
        };
        this.openPurchaseTransaction(data.transactionType, data);
      } else {
        this.eventService.openSnackBar('Please select transaction type', 'Ok');
      }
    } else {
      if (this.formStep == 'step-1') {
        this.transactionAddForm.get('ownerName').markAsTouched();
      } else if (this.formStep === 'step-2') {
        this.transactionAddForm.get('transactionType').markAsTouched();
      } else if (this.formStep === 'step-3') {

      }
    }
  }
}
