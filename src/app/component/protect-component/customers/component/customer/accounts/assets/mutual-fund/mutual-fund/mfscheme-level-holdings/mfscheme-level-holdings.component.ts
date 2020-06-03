import { AuthService } from './../../../../../../../../../../auth-service/authService';
import { Component, OnInit, ViewChildren, QueryList, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from '@angular/forms';
import { MatInput, MatAutocompleteTrigger, MatAutocompleteSelectedEvent, MatDatepickerInputEvent } from '@angular/material';
import { ValidatorType } from 'src/app/services/util.service';
import { MfServiceService } from '../../mf-service.service';
import { EventService } from '../../../../../../../../../../Data-service/event.service';
import { CustomerService } from '../../../../../customer.service';
import { UtilService } from '../../../../../../../../../../services/util.service';
import * as moment from 'moment';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { ReconciliationService } from '../../../../../../../../AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { DatePipe } from '@angular/common';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-mfscheme-level-holdings',
  templateUrl: './mfscheme-level-holdings.component.html',
  styleUrls: ['./mfscheme-level-holdings.component.scss']
})
export class MFSchemeLevelHoldingsComponent implements OnInit {
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
  schemeLevelHoldingForm: any = this.fb.group({
    ownerName: [, [Validators.required]],
    folioNumber: [, [Validators.required]],
    sip: [, [Validators.required]],
    tag: [],
  });
  dateChanged = false;
  ownerData: any;
  ownerName: any;
  selectedFamilyData: any;
  nomineesListFM: any = [];
  transactionTypeList = [];
  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();
  maxDate = new Date();
  parentId = AuthService.getParentId() !== 0 ? AuthService.getParentId() : this.advisorId;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  validatorType = ValidatorType;
  schemeNameControl = new FormControl();
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<Date>>
  @Input() data;

  @ViewChild(MatAutocompleteTrigger, { static: false }) trigger: MatAutocompleteTrigger;
  selectedTransactionType: any;
  maximumDate: any;

  constructor(
    public subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private eventService: EventService,
    private util: UtilService,
    private mfService: MfServiceService,
    private reconService: ReconciliationService,
    private datePipe: DatePipe
  ) { }
  familyMemberList = [];
  errorMsg = '';
  filteredSchemes = [];
  isLoadingForDropDown = false;
  filteredSchemeError: boolean = false;
  addEditMutualFund = '';
  schemeObj = {};
  rtTypeList = [];
  // @ViewChild(MatAutocompleteTrigger, { static: true }) _auto: MatAutocompleteTrigger;

  ngOnInit() {
    let date = this.maxDate.setDate(this.maxDate.getDate() - 1);
    this.maximumDate =new Date(date);
    console.log('ttra data', this.data)
    this.getRtTypeIdList();
    this.setFormValue(this.data);
    if (this.data && this.data.hasOwnProperty('family_member_list')) {
      this.familyMemberList = this.data.family_member_list;
      this.setValueChangeForScheme();
    } else {
      if (this.data && this.data.flag === 'editMutualFund') {
        this.addEditMutualFund = 'edit';
      } else if (this.data && this.data.flag === 'addMutualFund') {
        this.addEditMutualFund = 'add';
      }
      this.setValueChangeForScheme();
    }
    this.getTransactionTypeData();
    this.transactionListForm.valueChanges.subscribe(res => console.log("this is transactionForm values::::", res))
  }

  setValueChangeForScheme() {
    this.schemeNameControl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredSchemes = [];
          this.isLoadingForDropDown = true;
        }),
        switchMap(value => this.getFilteredSchemesList(value)
          .pipe(
            finalize(() => {
              this.isLoadingForDropDown = false
            }),
          )
        )
      )
      .subscribe(data => {
        this.filteredSchemes = data;
        console.log("this is what i need::::::::", data);
        // this.schemeLevelHoldingForm.get('schemeName').setValue(this.filteredSchemes[0].name);
        if (data) {
          this.filteredSchemeError = false;
        } else {
          this.filteredSchemeError = true;
          this.errorMsg = "No data found";
        }
        console.log(this.filteredSchemes);
      });
    this.getFamilyMemberList();
  }

  getRtTypeIdList() {
    this.reconService.getRTListValues({})
      .subscribe(res => {
        if (res) {
          this.rtTypeList = res;
          console.log("this is res for rt type list:::", res);
        } else {
          this.eventService.openSnackBar("No Rt Type List Found", "Dismiss");
        }
      })
  }

  displayFn(scheme?): string | undefined {
    return scheme ? scheme.schemeName : undefined;
  }

  getFilteredSchemesList(value) {
    if (value !== '' && (typeof value === 'string')) {
      return this.customerService.getSchemeNameList({ schemeName: value })
    } else if (typeof (value) === 'object') {
      return this.customerService.getSchemeNameList({ schemeName: value.schemeName })
    }
  }

  mapSchemeWithForm(scheme) {
    this.schemeObj = scheme;
    console.log("this is scheme obj", this.schemeObj);
  }

  getFamilyMemberList() {
    this.customerService.getFamilyMemberListByClientId({ clientId: this.clientId })
      .subscribe(res => {
        if (res) {
          this.familyMemberList = res;
          console.log(res);
        } else {
          this.eventService.openSnackBar("No Family Member found!", "Dismiss");
        }
      })
  }
  setFormValue(data) {

    if (this.data) {
      // this.schemeLevelHoldingForm = this.fb.group({
      //   ownerName: [{ value: !this.data.ownerName ? '' : this.data.ownerName, disabled: (this.data && this.data.flag === 'addTransaction') ? true : false }, [Validators.required]],
      //   folioNumber: [{ value: this.data.folioNumber, disabled: (this.data && this.data.flag === 'addTransaction') ? true : false }, [Validators.required]],
      //   sip: [{ value: this.data.sipAmount, disabled: (this.data && this.data.flag === 'addTransaction') ? true : false }, [Validators.required]],
      //   tag: [{ value: this.data.tag, disabled: (this.data && this.data.flag === 'addTransaction') ? true : false }, [Validators.required]],
      // });
      this.schemeLevelHoldingForm.get('ownerName').setValue(!this.data.ownerName ? '' : this.data.ownerName);
      this.schemeLevelHoldingForm.get('folioNumber').setValue(this.data.folioNumber);
      this.schemeLevelHoldingForm.get('sip').setValue(this.data.sipAmount);
      this.schemeLevelHoldingForm.get('tag').setValue(this.data.tag);
      this.schemeNameControl.patchValue(this.data.schemeName);
    } else {
      // this.schemeLevelHoldingForm = this.fb.group({
      //   ownerName: [{ value: '', disabled: (this.data && this.data.flag === 'addTransaction') ? true : false }, [Validators.required]],
      //   folioNumber: [{ value: '', disabled: (this.data && this.data.flag === 'addTransaction') ? true : false }, [Validators.required, Validators.minLength(6)]],
      //   sip: [{ value: '', disabled: (this.data && this.data.flag === 'addTransaction') ? true : false }, [Validators.required]],
      //   tag: [{ value: '', disabled: (this.data && this.data.flag === 'addTransaction') ? true : false }, [Validators.required]],
      // });

      this.schemeLevelHoldingForm.get('ownerName').setValue('');
      this.schemeLevelHoldingForm.get('folioNumber').setValue('');
      this.schemeLevelHoldingForm.get('sip').setValue('');
      this.schemeLevelHoldingForm.get('tag').setValue('');
      this.schemeNameControl.patchValue('');

    }

    if (this.data && this.data.flag === 'addTransaction' || this.data.flag === 'editTransaction') {
      this.schemeLevelHoldingForm.get('ownerName').disable();
      this.schemeLevelHoldingForm.get('folioNumber').disable();
      this.schemeLevelHoldingForm.get('sip').disable();
      this.schemeLevelHoldingForm.get('tag').disable();
      this.schemeNameControl.disable();
    } else if (this.data && this.data.flag === 'editTransaction' || this.data.flag === 'editMutualFund') {
      this.schemeNameControl.disable();
    }

  }

  setTransactionType(id, fg, item) {
    fg.patchValue(id);
    fg.get('assetMutualFundTransactionTypeMasterId').setValue(item.assetTypeTransactionId);
    this.selectedTransactionType = item
  }
  getIndexOfSelectedElement(value, trn) {
    trn.get('isEdited').setValue(true);
  }
  getTransactionTypeData() {
    this.customerService.getTransactionTypeData({})
      .subscribe(res => {
        if (res) {
          console.log("this is transaction Type:::", res);
          this.transactionTypeList = res;
          this.getSchemeLevelHoldings(this.data);
        }
      }, err => {
        this.eventService.openSnackBar(err, "Dismiss");
      })
  }


  getSchemeLevelHoldings(data) {
    if(data && ((data.mutualFundTransactions) ? data.mutualFundTransactions.length != 0 : data) && this.data.flag == 'editTransaction'){
      this.transactionArray.push(this.fb.group({
        transactionType: [this.data.transactionTypeMasterId],
        date: [new Date(this.data.transactionDate)],
        transactionAmount: [this.data.amount],
        Units: [this.data.unit],
        id: [this.data.id],
        assetMutualFundTransactionTypeMasterId: [this.data.assetMutualFundTransactionTypeMasterId],
        isEdited: this.data.isEdited,
        isAdded:null,
        previousUnit: this.data.previousUnit,
        previousEffect: this.data.effect
      }))
    }else{
      if (data && ((data.mutualFundTransactions) ? data.mutualFundTransactions.length != 0 : data) && (this.data.flag === 'editMutualFund')) {
        data.mutualFundTransactions.forEach((element: { transactionTypeMasterId: any; transactionDate: string | number | Date; amount: any; unit: any; id: any; assetMutualFundTransactionTypeMasterId :any;assetTypeTransactionId: any; isEdited: any; previousUnit: any; effect: any; }) => {
          this.transactionArray.push(this.fb.group({
            transactionType: [element.transactionTypeMasterId],
            date: [new Date(element.transactionDate)],
            transactionAmount: [element.amount],
            Units: [element.unit],
            id: [element.id],
            assetMutualFundTransactionTypeMasterId: [element.assetMutualFundTransactionTypeMasterId],
            isEdited: element.isEdited,
            isAdded:null,
            previousUnit: element.previousUnit,
            previousEffect: element.effect
          }))
        });
      } 
      else {
        this.transactionArray.push(this.fb.group({
          transactionType: [],
          date: [],
          transactionAmount: [],
          Units: [],
          id: [],
          assetMutualFundTransactionTypeMasterId: [],
          isEdited: false,
          isAdded:null,
          previousUnit: [],
          previousEffect: []
  
        }))
      }
  
    }
   
    this.ownerData = this.schemeLevelHoldingForm.controls;
  }
  transactionListForm = this.fb.group({
    transactionListArray: new FormArray([])
  })
  get transactionList() { return this.transactionListForm.controls };
  get transactionArray() { return this.transactionList.transactionListArray as FormArray };
  addTransactions() {
    this.transactionArray.push(this.fb.group({
      transactionType: [],
      date: [],
      transactionAmount: [],
      Units: [],
      id: [],
      assetMutualFundTransactionTypeMasterId: [],
      isEdited: false,
      previousUnit: [],
      previousEffect: [],
      isAdded:true
    }))
  }
  setDateChange(event) {
    console.log("this is event", event);
    this.dateChanged = true;
  }
  removeTransactions(index) {
    if(this.transactionArray.controls[index].value.id){
      let id = this.transactionArray.controls[index].value.id;
      this.customerService.deletePartPayment(id).subscribe(
        data => {
          console.log('delete',data)
        }
      )
    }
    (this.transactionArray.length == 1) ? console.log("cannot remove") : this.transactionArray.removeAt(index)
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    let item = this.familyMemberList.find(c => c.name === value);
    this.selectedFamilyData = item;
  }
  getTransactionName(id) {
    return this.transactionTypeList.find(c => c.id === id).transactionType;
  }
  getAssetMutualFundTransactionTypeMasterId(id) {
    return this.transactionTypeList.find(c => c.assetTypeTransactionId === id).assetTypeTransactionId;
  }
  getTransactionEffect(id) {
    return this.transactionTypeList.find(c => c.id === id).effect;
  }

  getRtMasterTypeId(name) {
    return this.rtTypeList.find(c => c.name === name).id;
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  saveMfSchemeLevel() {
    if (this.schemeLevelHoldingForm.invalid) {
      // this.inputs.find(input => !input.ngControl.valid).focus();
      // this.schemeLevelHoldingForm.get('ownerName').markAsTouched();
      // // this.schemeLevelHoldingForm.get('schemeName').markAsTouched();
      // this.schemeLevelHoldingForm.get('folioNumber').markAsTouched();
      // this.schemeLevelHoldingForm.get('sip').markAsTouched();
      // this.schemeLevelHoldingForm.get('tag').markAsTouched();
      // this.transactionArray.controls.forEach(element => {
      //   element.get('transactionType').markAsTouched();
      //   element.get('date').markAsTouched();
      //   element.get('transactionAmount').markAsTouched();
      //   element.get('Units').markAsTouched();
      // });
      this.schemeLevelHoldingForm.markAllAsTouched()
    } else {
      this.barButtonOptions.active = true;
      let mutualFundTransactions = [];
      this.transactionArray.value.forEach(element => {
        console.log("single element", element);
        let obj1;
        if (element) {
          if (this.data && this.data.flag === 'editTransaction') {
            obj1 = {
              investorName: (this.ownerName == null) ? this.schemeLevelHoldingForm.controls.ownerName.value : this.ownerName,
              schemeCode: this.data.schemeCode,
              folioNumber: this.schemeLevelHoldingForm.controls.folioNumber.value,
              mutualFundId: this.data.mutualFundId,
              sip: this.schemeLevelHoldingForm.controls.sip.value,
              tag: this.schemeLevelHoldingForm.controls.tag.value,
              fwTransactionType: (element.transactionType) ? this.getTransactionName(element.transactionType) : null,
              transactionDate: (element.date) ? this.getDateFormatted(element.date) : null,
              unit: element.Units,
              amount: element.transactionAmount,
              id: element.id,
              transactionTypeId: element.transactionType,
              effect: (element.transactionType) ? this.getTransactionEffect(element.transactionType) : null,
               isEdited:(element.isAdded) ? null :element.isEdited,
              isAdded:element.isAdded,
              previousUnit: element.previousUnit,
              previousEffect: element.previousEffect,
              assetMutualFundTransactionTypeMasterId:(element.assetMutualFundTransactionTypeMasterId) ? this.getAssetMutualFundTransactionTypeMasterId(element.assetMutualFundTransactionTypeMasterId) : null,
            }
            mutualFundTransactions.push(obj1);
          } else if (this.data && this.data.flag === 'addTransaction') {
            obj1 = {
              investorName: (this.ownerName == null) ? this.schemeLevelHoldingForm.controls.ownerName.value : this.ownerName,
              folioNumber: this.schemeLevelHoldingForm.controls.folioNumber.value,
              schemeCode: this.data.schemeCode,
              mutualFundId: this.data.id,
              fwTransactionType: (element.transactionType) ? this.getTransactionName(element.transactionType) : null,
              transactionDate: element.date ? this.getDateFormatted(element.date) : null,
              unit: element.Units,
              amount: element.transactionAmount,
              transactionTypeId: element.transactionType,
              effect: element.transactionType ? this.getTransactionEffect(element.transactionType) : null,
              assetMutualFundTransactionTypeMasterId:(element.assetMutualFundTransactionTypeMasterId) ? this.getAssetMutualFundTransactionTypeMasterId(element.assetMutualFundTransactionTypeMasterId) : null,
            }
            mutualFundTransactions.push(obj1);
          }
          if (this.data.flag == 'addMutualFund' || this.addEditMutualFund === 'add') {
            console.log(this.schemeObj);
            obj1 = {
              investorName: (this.ownerName == null) ? this.schemeLevelHoldingForm.controls.ownerName.value : this.ownerName,
              folioNumber: this.schemeLevelHoldingForm.controls.folioNumber.value,
              schemeCode: this.schemeObj['schemeCode'],
              // mutualFundId: this.data.id,
              fwTransactionType: element.transactionType ? this.getTransactionName(element.transactionType) : null,
              transactionDate: element.date ? this.getDateFormatted(element.date) : null,
              unit: element.Units,
              amount: element.transactionAmount,
              transactionTypeId: element.transactionType,
              effect: element.transactionType ? this.getTransactionEffect(element.transactionType) : null,
              assetMutualFundTransactionTypeMasterId:(element.assetMutualFundTransactionTypeMasterId) ? this.getAssetMutualFundTransactionTypeMasterId(element.assetMutualFundTransactionTypeMasterId) : null,
            }
            mutualFundTransactions.push(obj1);
          } else if (this.data.flag == 'editMutualFund' || this.addEditMutualFund === 'edit') {
            obj1 = {
              investorName: (this.ownerName == null) ? this.schemeLevelHoldingForm.controls.ownerName.value : this.ownerName,
              folioNumber: this.schemeLevelHoldingForm.controls.folioNumber.value,
              // schemeCode: this.schemeObj['schemeCode'],
              schemeCode: this.data.schemeCode,
              mutualFundId: this.data.id,
              fwTransactionType: element.transactionType ? this.getTransactionName(element.transactionType) : null,
              transactionDate: this.getDateFormatted(element.date),
              unit: element.Units,
              amount: element.transactionAmount,
              transactionTypeId: element.transactionType,
              effect: element.transactionType ? this.getTransactionEffect(element.transactionType) : null,
              isEdited:(element.isAdded) ? null :element.isEdited,
              isAdded:element.isAdded,
              previousUnit: element.previousUnit,
              previousEffect: element.previousEffect,
              id: element.id,
              assetMutualFundTransactionTypeMasterId:(element.assetMutualFundTransactionTypeMasterId) ? this.getAssetMutualFundTransactionTypeMasterId(element.assetMutualFundTransactionTypeMasterId) : null,
            }
            mutualFundTransactions.push(obj1);
          }
        }
      });
      let postObj;
      if (this.data.flag == 'addMutualFund' || this.addEditMutualFund === 'add') {
        postObj = {
          mutualFundSchemeMasterId: this.schemeObj['id'],
          ownerName: (this.ownerName == null) ? this.schemeLevelHoldingForm.controls.ownerName.value : this.ownerName,
          advisorId: this.advisorId,
          clientId: this.clientId,
          familyMemberId: this.selectedFamilyData.id,
          pan: this.selectedFamilyData.pan,
          rtMasterId: this.getRtMasterTypeId("MANUAL"),
          schemeName: this.schemeObj['schemeName'],
          folioNumber: this.schemeLevelHoldingForm.controls.folioNumber.value,
          schemeCode: this.schemeObj['schemeCode'],
          balanceUnit: 0,
          sipAmount: this.schemeLevelHoldingForm.controls.sip.value,
          tag: this.schemeLevelHoldingForm.controls.tag.value,
          realOrFictitious: 0,
          parentId: this.parentId,
          mutualFundTransactions
        }
        console.log(postObj);
        if (mutualFundTransactions.length > 0) {
          if (!mutualFundTransactions[0].transactionTypeId) {
            delete postObj.mutualFundTransactions
          }
        }
        this.customerService.postMutualFundAdd(postObj)
          .subscribe(res => {
            if (res) {
              console.log("this is what i am getting:::: after adding mutual fund", res);
              this.barButtonOptions.active = false;
              this.Close(true);
            }
          })

      } else if (this.data.flag == 'editMutualFund' || this.addEditMutualFund === 'edit') {
        postObj = {
          id: this.data.id,
          mutualFundSchemeMasterId: this.schemeObj['id'],
          ownerName: (this.ownerName == null) ? this.schemeLevelHoldingForm.controls.ownerName.value : this.ownerName,
          advisorId: this.advisorId,
          clientId: this.clientId,
          familyMemberId: (this.selectedFamilyData) ? this.selectedFamilyData.id : this.data.familyMemberId,
          pan: (this.selectedFamilyData) ? this.selectedFamilyData.pan : this.data.pan,
          rtMasterId: this.getRtMasterTypeId("MANUAL"),
          // schemeName: this.schemeObj['schemeName'],
          folioNumber: this.schemeLevelHoldingForm.controls.folioNumber.value,
          // schemeCode: this.schemeObj['schemeCode'],
          balanceUnit: this.data.balanceUnit,
          isSip: this.data.isSip,
          sipAmount: this.schemeLevelHoldingForm.controls.sip.value,
          tag: this.schemeLevelHoldingForm.controls.tag.value,
          // realOrFictitious: 0,
          parentId: this.parentId,
          // mutualFundTransactions: mutualFundTransactions,
          // mutualFundTransactions
        }
        console.log("for edit:::", postObj);

        // first transaction edit
        let transactionEditObj = {
          id: this.data.id,
          mutualFundTransactions
        };

        if (mutualFundTransactions.length > 0) {
          this.customerService.postEditTransactionMutualFund(transactionEditObj)
            .subscribe(res => {
              if (res) {
                console.log("success:: transaction::", res);

                this.customerService.postMutualFundEdit(postObj)
                  .subscribe(res => {
                    if (res) {
                      console.log("success:: edit mutual fund", res);
                      this.barButtonOptions.active = false;
                      this.Close(true);
                    } else {
                      this.eventService.openSnackBar(res, "Dismiss");
                    }
                  })
              } else {
                this.eventService.openSnackBar(res, "Dismiss");
              }
            }, err => {
              this.eventService.openSnackBar(err, "Dismiss");
            })
        } else {
          this.customerService.postMutualFundEdit(postObj)
            .subscribe(res => {
              if (res) {
                console.log("success:: edit mutual fund", res);
                this.barButtonOptions.active = false;
                this.Close(true);
              } else {
                this.eventService.openSnackBar(res, "Dismiss");
              }
            })
        }

      } else {

        console.log("this is object for adding transaction post::", mutualFundTransactions);
        postObj = {
          // id: this.data.id,
          mutualFundTransactions
        }
      }

      if (this.data && this.data.flag == 'editTransaction') {
        console.log('edit Trnasaction:', postObj);
        this.customerService.postEditTransactionMutualFund(postObj)
          .subscribe(res => {
            if (res || res == 0) {
              console.log("success::", res);
              this.barButtonOptions.active = false;
              this.Close(true);
            } else {
              this.eventService.openSnackBar(res, "Dismiss");
            }
          }, err => {
            this.eventService.openSnackBar(err, "Dismiss");
          })

      } else if (this.data && this.data.flag == 'addTransaction') {
        console.log("add transaction", postObj);
        this.customerService.postAddTransactionMutualFund(postObj)
          .subscribe(res => {
            if (res) {
              console.log("success::", res);
              this.mfService.sendUpdatedTransactionAfterAdd(res);
              this.barButtonOptions.active = false;
              this.Close(true);
            } else {
              this.eventService.openSnackBar(res, "Dismiss");
            }
          }, err => {
            this.eventService.openSnackBar(err, "Dismiss");
          })
      }


    }
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  // getDateFormatted(dateObj) {
  //   if (this.dateChanged == false) {
  //     return String(dateObj.getFullYear()) + "-" + this.util.addZeroBeforeNumber((dateObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(dateObj.getDate(), 2);
  //   } else if (this.data && this.data.flag === 'addTransaction' || this.dateChanged === true) {
  //     dateObj = new Date(dateObj.format("YYYY-MM-DDTHH:mm:ssZ"));
  //     return String(dateObj.getFullYear()) + "-" + this.util.addZeroBeforeNumber((dateObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(dateObj.getDate(), 2);
  //   }
  //   if (this.addEditMutualFund === 'add') {
  //     dateObj = new Date(dateObj.format("YYYY-MM-DDTHH:mm:ssZ"));
  //     return String(dateObj.getFullYear()) + "-" + this.util.addZeroBeforeNumber((dateObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(dateObj.getDate(), 2);
  //   }
  // }
  getDateFormatted(dateObj) {
    if (this.dateChanged == false) {
      return this.datePipe.transform(dateObj, 'yyyy-MM-dd');
    }
    else if (this.data && this.data.flag === 'addTransaction' || this.dateChanged === true) {
      return this.datePipe.transform(dateObj, 'yyyy-MM-dd');
    }
    if (this.addEditMutualFund === 'add') {
      return this.datePipe.transform(dateObj, 'yyyy-MM-dd');
    }
  }
}
export interface Scheme {
  schemeName: string;
}