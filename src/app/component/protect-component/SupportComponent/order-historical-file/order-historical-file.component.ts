import { AuthService } from './../../../../auth-service/authService';
import { EventService } from './../../../../Data-service/event.service';
import { SubscriptionInject } from './../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SupportService } from '../support.service';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { SettingsService } from '../../AdviserComponent/setting/settings.service';
import { UtilService } from '../../../../services/util.service';
import { ReconciliationService } from '../../AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { DateAdapter } from 'saturn-datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from '../../../../constants/date-format.constant';
import { default as _rollupMoment } from 'node_modules/moment/src/moment';

const moment = _rollupMoment;

@Component({
  selector: 'app-order-historical-file',
  templateUrl: './order-historical-file.component.html',
  styleUrls: ['./order-historical-file.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class OrderHistoricalFileComponent implements OnInit {
  rmId = AuthService.getRmId() ? AuthService.getRmId() : 0;
  arnRiaDetails = 4;
  asOnDate: boolean = false;
  formValidationFalseCount: number = 0;
  mainFormValidationValue: boolean = false;
  fromToSameError: boolean = false;
  camsAsOnDatePastMaxDate: Date = new Date("1 January, 1990");
  karvyOrFranklinPastMaxDate = new Date("1 January, 1993");
  dateToday: Date = new Date();
  dateYesterday: Date = new Date(new Date().setDate(new Date().getDate() - 1));
  orderingFreq: {}[] = [{ id: '1', name: 'Yearly' }, { id: '2', name: 'Monthly' }, { id: '3', name: 'All at once' }];
  arnRiaIdList: any[] = [];
  fileTypeOrderList: any[] = [];
  moreArnRiaObj: any[] = [];
  camsValueChangeSubscription: Subscription;
  karvyValueChangeSubscription: Subscription;
  franklinValueChangeSubscription: Subscription;
  isArnOrRiaSelected: boolean = false;
  dateObject = new Date();
  advisorId: any = AuthService.getAdvisorId();
  currentDate: string = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
  advisorNameInput = '';
  requestJsonForOrderingFiles: any[] = [];
  searchAdvisorForm = this.fb.group({
    searchAdvisor: [, Validators.required]
  });
  errorMsg: string = '';
  arrayOfAdvisorName;
  isLoadingForDropDown: boolean = false;
  arrayAdvisorNameError: boolean;
  @ViewChild('advisorRef', { static: true }) advisorRef;
  arnRiaDetailsList: any[] = [];
  rtList: any[] = [];
  camsRtId;
  karvyRtId;
  franklinRtId;
  filteredReqObj = [];
  changedArnRiaList = [];
  minFromDate;
  minToDate;

  constructor(
    private supportService: SupportService,
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private eventService: EventService,
    private settingService: SettingsService,
    private util: UtilService,
    private reconService: ReconciliationService
  ) { }

  resetDateAsOnDateAndFormCheckbox() {
    if (this.orderHistoryFileForm.get('selectRta').value !== this.camsRtId) {
      this.asOnDate = false;
      this.orderHistoryFileForm.get('orderingFreq').reset();
      this.orderHistoryFileForm.addControl('fromDate', new FormControl('', Validators.required));
      this.orderHistoryFileForm.addControl('toDate', new FormControl('', Validators.required));

      for (const key in this.orderHistoryFileForm.get('selectFilesToOrder.cams')['controls']) {
        if (this.orderHistoryFileForm.get('selectFilesToOrder.cams')['controls'].hasOwnProperty(key)) {
          const element = this.orderHistoryFileForm.get('selectFilesToOrder.cams')['controls'][key];
          element.value = false;
        }
      }

      for (const key in this.orderHistoryFileForm.get('selectFilesToOrder.karvy')['controls']) {
        if (this.orderHistoryFileForm.get('selectFilesToOrder.karvy')['controls'].hasOwnProperty(key)) {
          const element = this.orderHistoryFileForm.get('selectFilesToOrder.karvy')['controls'][key];
          element.value = false;
        }
      }

      for (const key in this.orderHistoryFileForm.get('selectFilesToOrder.franklin')['controls']) {
        if (this.orderHistoryFileForm.get('selectFilesToOrder.franklin')['controls'].hasOwnProperty(key)) {
          const element = this.orderHistoryFileForm.get('selectFilesToOrder.franklin')['controls'][key];
          element.value = false;
        }
      }
      this.camsAsOnDatePastMaxDate = this.karvyOrFranklinPastMaxDate;
    } else {
      this.camsAsOnDatePastMaxDate = new Date("1 January, 1993");
    }
  }

  setAdvisorId(advisor) {
    this.advisorId = advisor.id;
    this.advisorNameInput = advisor.name;
    this.getArnRiaDetails();
  }

  addArnRia() {
    let arnRia = this.orderHistoryFileForm.controls.selectArnRia as FormArray;
    this.arnRiaDetailsList.forEach(element => {
      arnRia.push(this.fb.group({
        selection: [element.form,]
      }));
    });

    this.setArnRiaId(0);
  }

  setArnRiaId(index) {
    if (index === 0) {
      this.arnRiaDetails = this.arnRiaDetailsList[index].id;
      // console.log(this.arnRiaDetails);
    } else {
      if (!this.arnRiaIdList.includes(this.arnRiaDetailsList[index].id)) {
        this.arnRiaIdList.push(this.arnRiaDetailsList[index].id);
      }
    }
    console.log(this.arnRiaIdList);
  }

  getArnRiaDetails() {
    this.supportService.getArnRiaOfAdvisors({
      advisorId: this.advisorId,
      rtId: this.orderHistoryFileForm.get('selectRta').value
    })
      .subscribe(data => {
        if (data && data.length !== 0) {
          let arnRia = this.orderHistoryFileForm.controls.selectArnRia as FormArray;
          arnRia.clear();
          this.arnRiaDetailsList = [];
          data.forEach((element, index) => {
            if (index === 0) {
              this.arnRiaDetails = element.id;
            }

            this.arnRiaDetailsList.push({
              form: (index === 0),
              id: element.id,
              arnRia: element.arnOrRia,
              name: element.arnOrRia === 1 ? "ARN" + "-" + element.number : element.arnOrRia === 2 ? "RIA" + "-" + element.number : null
            });
          });
          console.log("arn ria details:::", data);
          this.addArnRia();
        }
      });
  }

  hasFormControlArnRia(index) {
    return this.arnRiaDetailsList[index].hasOwnProperty('selectArn') ? 'selectArn' : 'selectRia';
  }

  orderHistoryFileForm = this.fb.group({
    "selectRta": [1, Validators.required],
    "selectArnRia": this.fb.array([], Validators.required),
    "fromDate": [moment(), Validators.required],
    "toDate": [moment(), Validators.required],
    "asOnDate": [moment(),],
    "orderingFreq": [, Validators.required],
    "selectFilesToOrder": this.fb.group({
      "cams": this.fb.group({
        "wbr2": [false,],
        "wbr2a": [false,],
        "wbr49Active": [false,],
        "wbr49Ceased": [false,],
        "wbr9": [false,],
        "wbr22": [false,]
      }),
      "karvy": this.fb.group({
        "mfsd201": [false,],
        "mfsd243": [false,],
        "mfsd231": [false,],
        "mfsd211": [false,],
        "mfsd203": [false,]
      }),
      "franklin": this.fb.group({
        "transactions": [false,],
        "active_sip": [false,],
        "ceased_sip": [false,],
        "investor_folio": [false,],
        "aum": [false,]
      })
    }),
  });

  ngOnInit() {
    console.log("this is yesterday's date::::   ", this.dateYesterday);
    // this.isOnlyAumSelected()
    this.getRtaList();
  }
  ngOnDestroy(): void {
    this.camsValueChangeSubscription.unsubscribe();
    this.karvyValueChangeSubscription.unsubscribe();
    this.franklinValueChangeSubscription.unsubscribe();
  }

  getRtaList() {
    this.reconService.getRTListValues({})
      .subscribe(res => {
        let rtList = []
        if (res && res.length !== 0) {
          res.forEach(element => {
            if (element.name === 'CAMS') {
              this.camsRtId = element.id;
              rtList.push({
                name: 'CAMS',
                id: element.id
              })
            }
            if (element.name === 'KARVY') {
              this.karvyRtId = element.id;
              rtList.push({
                name: 'KARVY',
                id: element.id
              })
            }
            if (element.name === 'FRANKLIN_TEMPLETON') {
              this.franklinRtId = element.id;
              rtList.push({
                name: 'FRANKLIN',
                id: element.id
              })
            }

          });

          this.rtList = rtList;
          this.searchAdvisorCredentials();
          this.conditionalRenderingOfForm();
          this.getFileTypeOrderValues();
          this.setValueChangesOnRta();
          // this.setValueChangeForRta();
        }
      })
  }

  setValueChangesOnRta() {
    this.orderHistoryFileForm.get('selectRta').valueChanges
      .subscribe(res => {
        this.getArnRiaDetails();
      })
  }

  getPaddingTop(index) {
    return (index !== this.rtList.length) ? '10px' : '';
  }

  displayFn(value): string | undefined {
    return value ? value.name : undefined;
  }

  searchAdvisorCredentials() {
    this.searchAdvisorForm.get('searchAdvisor').valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.arrayOfAdvisorName = [];
          this.isLoadingForDropDown = true;
        }),
        switchMap(value => this.getAdvisorNameList(value)
          .pipe(
            finalize(() => {
              this.isLoadingForDropDown = false
            }),
          )
        )
      )
      .subscribe(data => {
        this.arrayOfAdvisorName = data;
        console.log("this is advisor name::::::::", data);
        if (data && data.length > 0) {
          this.arrayAdvisorNameError = false;
        } else {
          this.arrayAdvisorNameError = true;
          this.errorMsg = 'No data Found';
        }
        console.log("this is some value", this.arrayOfAdvisorName);
      }, err => {
        this.arrayAdvisorNameError = true;
        this.errorMsg = 'Something went wrong';
        this.eventService.openSnackBar(err, "DISMISS");
      });
  }

  getAdvisorNameList(value) {
    if (value !== '') {
      const data = {
        name: value
      }
      return this.supportService.getBackofficeAdvisorSearchByName(data);
    } else {
      this.eventService.openSnackBar("Advisor Name must not be empty!", "DISMISS");
    }
  }

  getFileTypeOrderValues() {
    this.supportService.getFileTypeOrder({})
      .subscribe(data => {
        if (data) {
          data.forEach(element => {
            if (element.id === 3 || element.id === 4) {
              element.type = element.type.split(" ")[0].toLowerCase() + element.type.split(" ")[1];
            } else if (element.id !== 3 && element.id !== 4 && element.id <= 7) {
              element.type = element.type.toLowerCase();
            } else if (element.id > 7) {
              element.type = element.type.split(" ")[0].toLowerCase();
            }
            this.fileTypeOrderList = data;
          });
          console.log(data);
        } else {
          this.eventService.openSnackBar("Can't fetch File Type Order list", "DISMISS");
        }
      });
  }

  conditionalRenderingOfForm() {
    this.orderHistoryFileForm.valueChanges.subscribe(val => console.log(val));

    this.camsValueChangeSubscription = this.orderHistoryFileForm.get('selectFilesToOrder.cams').valueChanges.subscribe(val => {
      if (val['wbr2']) {
        this.changesDueToCamsSelection(1)
      } else if (val['wbr2a']) {
        this.changesDueToCamsSelection(1);
      } else if (val['wbr49Active']) {
        this.changesDueToCamsSelection(1);
      } else if (val['wbr49Ceased']) {
        this.changesDueToCamsSelection(1);
      } else if (val['wbr9']) {
        this.changesDueToCamsSelection(1);
      } else if (val['wbr22']) {
        this.changesDueToCamsSelection(2);
      } else {
        this.changesDueToCamsSelection(1);
      }
    });
    this.karvyValueChangeSubscription = this.orderHistoryFileForm.get('selectFilesToOrder.karvy').valueChanges.subscribe(val => {
      if (val['mfsd201']) {
        this.changesDueToCamsSelection(1)
      } else if (val['mfsd243']) {
        this.changesDueToCamsSelection(1)
      } else if (val['mfsd231']) {
        this.changesDueToCamsSelection(1)
      } else if (val['mfsd211']) {
        this.changesDueToCamsSelection(1)
      } else if (val['mfsd203']) {
        this.changesDueToCamsSelection(2)
      } else {
        this.changesDueToCamsSelection(1);
      }
    });

    this.franklinValueChangeSubscription = this.orderHistoryFileForm.get('selectFilesToOrder.franklin').valueChanges.subscribe(val => {
      if (val['transactions']) {
        this.changesDueToCamsSelection(1);
      } else if (val['active_sip']) {
        this.changesDueToCamsSelection(1);
      } else if (val['ceased_sip']) {
        this.changesDueToCamsSelection(1);
      } else if (val['investor_folio']) {
        this.changesDueToCamsSelection(1);
      } else if (val['aum']) {
        this.changesDueToCamsSelection(2);
      } else {
        this.changesDueToCamsSelection(1);
      }
    });
  }

  changesDueToCamsSelection(option) {
    if (option === 1) {
      this.asOnDate = false;
      this.orderHistoryFileForm.get('orderingFreq').reset();
      this.orderHistoryFileForm.get('asOnDate').setValidators([]);
      this.orderHistoryFileForm.addControl('fromDate', new FormControl('', Validators.required));
      this.orderHistoryFileForm.addControl('toDate', new FormControl('', Validators.required));
    } else if (option === 2) {
      this.asOnDate = true;
      this.orderHistoryFileForm.get('orderingFreq').setValue('3');
      this.orderHistoryFileForm.get('asOnDate').setValidators(Validators.required);
      this.orderHistoryFileForm.get('asOnDate').setErrors({ 'error': true });
      this.orderHistoryFileForm.removeControl('fromDate');
      this.orderHistoryFileForm.removeControl('toDate');
    }
  }

  dialogClose(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  validationOfSelectFilesToOrder(rtaValue) {
    let count = 0;
    let selectFormGroup;


    (rtaValue === this.camsRtId) ? selectFormGroup = 'cams' :
      (rtaValue === this.karvyRtId) ? selectFormGroup = 'karvy' :
        (rtaValue === this.franklinRtId) ? selectFormGroup = 'franklin' : null;

    if (this.orderHistoryFileForm.get('selectRta').value === rtaValue) {
      for (const key in this.orderHistoryFileForm.get(`selectFilesToOrder.${selectFormGroup}`)['controls']) {
        if (this.orderHistoryFileForm.get(`selectFilesToOrder.${selectFormGroup}`)['controls'].hasOwnProperty(key)) {
          const element = this.orderHistoryFileForm.get(`selectFilesToOrder.${selectFormGroup}`)['controls'][key];
          if (element.value === false) {
            count++;
          }
        }
      }
      if (count === (rtaValue === this.camsRtId ? 6 : 5)) {
        this.orderHistoryFileForm.get(`selectFilesToOrder.${selectFormGroup}`).setErrors({ 'error': true });
        this.orderHistoryFileForm.get(`selectFilesToOrder.${selectFormGroup}`).markAsTouched();
        return false;
      } else {
        return true;
      }
    }
  }

  formValidations(whichTable) {
    // console.log("this is formGroup::::::::::", whichTable);
    let selectFileOrderValidation = false;
    for (let key in whichTable.controls) {
      if (key === 'selectFilesToOrder') {
        selectFileOrderValidation = this.validationOfSelectFilesToOrder(this.orderHistoryFileForm.get('selectRta').value);
      } else if (whichTable.get(key).invalid) {
        whichTable.get(key).markAsTouched();
        return (selectFileOrderValidation && false);
      }
    }
    return (whichTable.valid) ? (selectFileOrderValidation && true) : (selectFileOrderValidation && false);
  }

  orderHistoricalFileSave() {
    if (this.formValidations(this.orderHistoryFileForm)) {
      // api call
      if (this.searchAdvisorForm.get('searchAdvisor').valid) {
        console.log('must be closed', this.orderHistoryFileForm.value);
        this.calculateDateAndObject();
        this.dialogClose(true);
      } else {
        this.searchAdvisorForm.get('searchAdvisor').setErrors({ error: true });
        this.searchAdvisorForm.get('searchAdvisor').markAsTouched();
      }
    } else {
      this.formValidationFalseCount++;
      this.eventService.openSnackBar("Must fill required field", "Dismiss");
    }
  }

  calculateDateAndObject() {
    // yearly
    let requestObj = [];
    const fromDateValueObj = this.orderHistoryFileForm.get('fromDate').value._d;
    const toDateValueObj = this.orderHistoryFileForm.get('toDate').value._d;
    const whichRta = (this.orderHistoryFileForm.get('selectRta').value === this.camsRtId) ? 'cams' :
      ((this.orderHistoryFileForm.get('selectRta').value === this.karvyRtId) ? 'karvy' :
        ((this.orderHistoryFileForm.get('selectRta').value === this.franklinRtId) ? 'franklin' : ''));

    if (this.orderHistoryFileForm.get('fromDate').value && this.orderHistoryFileForm.get('toDate').value) {
      // adding file Type ids

      //  for CAMS
      // yearly
      if (this.orderHistoryFileForm.get('orderingFreq').value === '1') {
        const yearDiffr = toDateValueObj.getFullYear() - fromDateValueObj.getFullYear();
        console.log('this is year Difference::', yearDiffr);
        let fromDateIter;
        let toDateIter;

        //  middle date
        const fromDateString = (fromDateValueObj.getMonth() + 1) + "-" + fromDateValueObj.getDate();
        if (fromDateString !== "1-1") {
          fromDateIter = fromDateValueObj;
          toDateIter = new Date(new Date().setFullYear(fromDateValueObj.getFullYear(), 11, 31));

          const fileToOrder = this.orderHistoryFileForm.get(`selectFilesToOrder.${whichRta}`).value;
          let fileTypeId;
          let rtId;
          if (fileToOrder) {
            for (const key in fileToOrder) {
              if (fileToOrder[key]) {

                this.fileTypeOrderList.forEach(element => {
                  if (element.type === key) {
                    fileTypeId = element.id;
                    rtId = element.rtId;
                  }
                });

                if (fileTypeId === 6 || fileTypeId === 12) {
                  if (!(requestObj.some(item => item.fileTypeId === fileTypeId))) {
                    requestObj.push({
                      advisorId: this.advisorId,
                      rmId: this.rmId,
                      rtId,
                      arnRiaDetailId: this.arnRiaDetails,
                      fromDate: null,
                      toDate: toDateValueObj.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateValueObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateValueObj.getDate(), 2),
                      fileTypeId: fileTypeId,
                      orderingFrequency: 3
                    });
                  }
                } else if (fileTypeId !== 2 && fileTypeId !== 6) {
                  requestObj.push({
                    advisorId: this.advisorId,
                    rmId: this.rmId,
                    rtId,
                    arnRiaDetailId: this.arnRiaDetails,
                    fromDate: typeof (fromDateIter) === 'object' ? fromDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((fromDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(fromDateIter.getDate(), 2) : fromDateIter,
                    toDate: typeof (toDateIter) === 'object' ? toDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateIter.getDate(), 2) : toDateIter,
                    fileTypeId: fileTypeId,
                    orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                  });
                } else if (fileTypeId === 2) {
                  let temp = fromDateValueObj;
                  let startDateIter;
                  if (yearDiffr !== 0) {
                    let monthDiff = this.getMonthDifference(fromDateValueObj, toDateValueObj);
                    for (let index = 0; index <= (monthDiff / 3); index++) {
                      if (index == 0) {
                        startDateIter = fromDateValueObj;
                      } else {
                        temp.setDate(temp.getDate() + 1);
                        startDateIter = temp;
                      }
                      let days90aheadTime = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                      if (days90aheadTime.getTime() >= toDateValueObj.getTime()) {

                        temp = toDateValueObj;
                        requestObj.push({
                          advisorId: this.advisorId,
                          rmId: this.rmId,
                          rtId,
                          arnRiaDetailId: this.arnRiaDetails,
                          fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                          toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                          fileTypeId: fileTypeId,
                          orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                        });
                        break;
                      } else {
                        temp = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                        requestObj.push({
                          advisorId: this.advisorId,
                          rmId: this.rmId,
                          rtId,
                          arnRiaDetailId: this.arnRiaDetails,
                          fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                          toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                          fileTypeId: fileTypeId,
                          orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                        });
                      }
                    }
                  }

                }
              }
            }
          }
          for (let index = 1; index <= yearDiffr; index++) {

            if (index === 1) {
              fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
              if (index === yearDiffr) {
                toDateIter = toDateValueObj.getFullYear() + "-" + (toDateValueObj.getMonth() + 1) + "-" + toDateValueObj.getDate();
                if (toDateIter === fromDateIter) {
                  break;
                }
              } else {
                toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'year');
              }
            } else {
              fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
              if (index === yearDiffr) {
                toDateIter = toDateValueObj.getFullYear() + "-" + (toDateValueObj.getMonth() + 1) + "-" + toDateValueObj.getDate();
                if (JSON.stringify(toDateIter) === JSON.stringify(fromDateIter)) {
                  break;
                }
              } else {
                toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'year');
              }
            }

            let fileToOrder = this.orderHistoryFileForm.get(`selectFilesToOrder.${whichRta}`).value;
            let fileTypeId;
            let rtId;
            if (fileToOrder) {
              for (const key in fileToOrder) {
                if (fileToOrder[key]) {

                  this.fileTypeOrderList.forEach(element => {
                    if (element.type === key) {
                      fileTypeId = element.id;
                      rtId = element.rtId;
                    }
                  });

                  if (fileTypeId === 6 || fileTypeId === 12) {
                    if (!(requestObj.some(item => item.fileTypeId === fileTypeId))) {
                      requestObj.push({
                        advisorId: this.advisorId,
                        rmId: this.rmId,
                        rtId,
                        arnRiaDetailId: this.arnRiaDetails,
                        fromDate: null,
                        toDate: toDateValueObj.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateValueObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateValueObj.getDate(), 2),
                        fileTypeId: fileTypeId,
                        orderingFrequency: 3
                      });
                    }
                  } else if (fileTypeId !== 2 && fileTypeId !== 6) {
                    requestObj.push({
                      advisorId: this.advisorId,
                      rmId: this.rmId,
                      rtId,
                      arnRiaDetailId: this.arnRiaDetails,
                      fromDate: typeof (fromDateIter) === 'object' ? fromDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((fromDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(fromDateIter.getDate(), 2) : fromDateIter,
                      toDate: typeof (toDateIter) === 'object' ? toDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateIter.getDate(), 2) : toDateIter,
                      fileTypeId: fileTypeId,
                      orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                    });
                  } else if (fileTypeId === 2) {

                    let temp = fromDateValueObj;
                    let startDateIter;
                    if (yearDiffr !== 0) {
                      let monthDiff = this.getMonthDifference(fromDateValueObj, toDateValueObj);
                      for (let index = 0; index <= (monthDiff / 3); index++) {
                        if (index == 0) {
                          startDateIter = fromDateValueObj;
                        } else {
                          temp.setDate(temp.getDate() + 1);
                          startDateIter = temp;
                        }
                        let days90aheadTime = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                        if (days90aheadTime.getTime() >= toDateValueObj.getTime()) {

                          temp = toDateValueObj;
                          requestObj.push({
                            advisorId: this.advisorId,
                            rmId: this.rmId,
                            rtId,
                            arnRiaDetailId: this.arnRiaDetails,
                            fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                            toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                            fileTypeId: fileTypeId,
                            orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                          });
                          break;
                        } else {
                          temp = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                          requestObj.push({
                            advisorId: this.advisorId,
                            rmId: this.rmId,
                            rtId,
                            arnRiaDetailId: this.arnRiaDetails,
                            fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                            toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                            fileTypeId: fileTypeId,
                            orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                          });
                        }
                      }
                    }

                  }
                }
              }
            }

          }
          console.log(requestObj);

        } else {

          for (let index = 0; index <= yearDiffr; index++) {

            if (index === 0) {
              fromDateIter = fromDateValueObj;
              toDateIter = this.addYearMonthOrDayToDate(fromDateValueObj, 1, 'year');
            } else {
              fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
              if (index === yearDiffr) {
                toDateIter = toDateValueObj.getFullYear() + "-" + (toDateValueObj.getMonth() + 1) + "-" + toDateValueObj.getDate();
                if (toDateIter === fromDateIter) {
                  break;
                }
              } else {
                toDateIter = this.addYearMonthOrDayToDate(fromDateValueObj, index + 1, 'year');
              }
            }

            let fileToOrder = this.orderHistoryFileForm.get(`selectFilesToOrder.${whichRta}`).value;
            let fileTypeId;
            let rtId;
            if (fileToOrder) {
              for (const key in fileToOrder) {
                if (fileToOrder[key]) {

                  this.fileTypeOrderList.forEach(element => {
                    if (element.type === key) {
                      fileTypeId = element.id;
                      rtId = element.rtId;
                    }
                  });

                  if (fileTypeId === 6 || fileTypeId === 12) {
                    if (!(requestObj.some(item => item.fileTypeId === fileTypeId))) {
                      requestObj.push({
                        advisorId: this.advisorId,
                        rmId: this.rmId,
                        rtId,
                        arnRiaDetailId: this.arnRiaDetails,
                        fromDate: null,
                        toDate: toDateValueObj.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateValueObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateValueObj.getDate(), 2),
                        fileTypeId: fileTypeId,
                        orderingFrequency: 3
                      });
                    }
                  } else if (fileTypeId !== 2 && fileTypeId !== 6) {
                    requestObj.push({
                      advisorId: this.advisorId,
                      rmId: this.rmId,
                      rtId,
                      arnRiaDetailId: this.arnRiaDetails,
                      fromDate: typeof (fromDateIter) === 'object' ? fromDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((fromDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(fromDateIter.getDate(), 2) : fromDateIter,
                      toDate: typeof (toDateIter) === 'object' ? toDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateIter.getDate(), 2) : toDateIter,
                      fileTypeId: fileTypeId,
                      orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                    });
                  } else if (fileTypeId === 2) {

                    let temp = fromDateValueObj;
                    let startDateIter;
                    if (yearDiffr !== 0) {
                      let monthDiff = this.getMonthDifference(fromDateValueObj, toDateValueObj);
                      for (let index = 0; index <= (monthDiff / 3); index++) {
                        if (index == 0) {
                          startDateIter = fromDateValueObj;
                        } else {
                          temp.setDate(temp.getDate() + 1);
                          startDateIter = temp;
                        }
                        let days90aheadTime = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                        if (days90aheadTime.getTime() >= toDateValueObj.getTime()) {

                          temp = toDateValueObj;
                          requestObj.push({
                            advisorId: this.advisorId,
                            rmId: this.rmId,
                            rtId,
                            arnRiaDetailId: this.arnRiaDetails,
                            fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                            toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                            fileTypeId: fileTypeId,
                            orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                          });
                          break;
                        } else {
                          temp = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                          requestObj.push({
                            advisorId: this.advisorId,
                            rmId: this.rmId,
                            rtId,
                            arnRiaDetailId: this.arnRiaDetails,
                            fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                            toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                            fileTypeId: fileTypeId,
                            orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                          });
                        }
                      }
                    }

                  }
                }
              }
            }

          }
          console.log(requestObj);
        }

      }

      // monthly

      else if (this.orderHistoryFileForm.get('orderingFreq').value === '2') {
        let fromDateIter;
        let toDateIter;
        let fromDateString = fromDateValueObj.getDate();

        if (fromDateString !== 1) {
          fromDateIter = fromDateValueObj;

          toDateIter = new Date(fromDateIter.getFullYear(), (fromDateIter.getMonth() + 1));
          toDateIter = new Date(toDateIter.setDate(toDateIter.getDate() - 1));

          let fileToOrder = this.orderHistoryFileForm.get(`selectFilesToOrder.${whichRta}`).value;
          let fileTypeId;
          let rtId;
          if (fileToOrder) {
            for (const key in fileToOrder) {
              if (fileToOrder[key]) {
                this.fileTypeOrderList.forEach(element => {
                  if (element.type === key) {
                    fileTypeId = element.id;
                    rtId = element.rtId;
                  }
                });


                if (fileTypeId === 6 || fileTypeId === 12) {
                  if (!(requestObj.some(item => item.fileTypeId === fileTypeId))) {
                    requestObj.push({
                      advisorId: this.advisorId,
                      rmId: this.rmId,
                      rtId,
                      arnRiaDetailId: this.arnRiaDetails,
                      fromDate: null,
                      toDate: toDateValueObj.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateValueObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateValueObj.getDate(), 2),
                      fileTypeId: fileTypeId,
                      orderingFrequency: 3
                    });
                  }
                } else if (fileTypeId === 2) {
                  let temp = fromDateValueObj;
                  let startDateIter;
                  let monthDiff = this.getMonthDifference(fromDateValueObj, toDateValueObj);
                  for (let index = 0; index <= (monthDiff / 3); index++) {
                    if (index == 0) {
                      startDateIter = fromDateValueObj;
                    } else {
                      temp.setDate(temp.getDate() + 1);
                      startDateIter = temp;
                    }
                    let days90aheadTime = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                    if (days90aheadTime.getTime() >= toDateValueObj.getTime()) {

                      temp = toDateValueObj;
                      requestObj.push({
                        advisorId: this.advisorId,
                        rmId: this.rmId,
                        rtId,
                        arnRiaDetailId: this.arnRiaDetails,
                        fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                        toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                        fileTypeId: fileTypeId,
                        orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                      });
                      break;
                    } else {
                      temp = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                      requestObj.push({
                        advisorId: this.advisorId,
                        rmId: this.rmId,
                        rtId,
                        arnRiaDetailId: this.arnRiaDetails,
                        fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                        toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                        fileTypeId: fileTypeId,
                        orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                      });
                    }
                  }
                }

                else {
                  requestObj.push({
                    advisorId: this.advisorId,
                    rmId: this.rmId,
                    rtId,
                    arnRiaDetailId: this.arnRiaDetails,
                    fromDate: typeof (fromDateIter) === 'object' ? fromDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((fromDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(fromDateIter.getDate(), 2) : fromDateIter,
                    toDate: typeof (toDateIter) === 'object' ? toDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateIter.getDate(), 2) : toDateIter,
                    fileTypeId: fileTypeId,
                    orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                  });
                }
              }
            }
          }
          fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');

          let yearDiffr = toDateValueObj.getFullYear() - fromDateIter.getFullYear();
          if (yearDiffr === 0) {
            let monthDiff = (toDateValueObj.getMonth() - fromDateIter.getMonth());
            for (let index = 0; index < monthDiff; index++) {
              if (index == 0) {
                // toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');

                if (monthDiff === 1) {
                  if (toDateValueObj.getDate() === 1) {
                    toDateIter = toDateValueObj;
                  } else {
                    toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                  }
                } else {
                  toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                }
              } else {
                fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
                // toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');

                if (fromDateIter.getDate() === toDateValueObj.getDate() && fromDateIter.getMonth() === toDateValueObj.getMonth()) {
                  toDateIter = fromDateIter;
                } else if (index === (monthDiff - 1)) {
                  toDateIter = toDateValueObj;
                } else {
                  toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                }
              }
              let fileToOrder = this.orderHistoryFileForm.get(`selectFilesToOrder.${whichRta}`).value;
              let fileTypeId;
              let rtId;
              if (fileToOrder) {
                for (const key in fileToOrder) {
                  if (fileToOrder[key]) {
                    this.fileTypeOrderList.forEach(element => {
                      if (element.type === key) {
                        fileTypeId = element.id;
                        rtId = element.rtId;
                      }
                    });


                    if (fileTypeId === 6 || fileTypeId === 12) {
                      if (!(requestObj.some(item => item.fileTypeId === fileTypeId))) {
                        requestObj.push({
                          advisorId: this.advisorId,
                          rmId: this.rmId,
                          rtId,
                          arnRiaDetailId: this.arnRiaDetails,
                          fromDate: null,
                          toDate: toDateValueObj.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateValueObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateValueObj.getDate(), 2),
                          fileTypeId: fileTypeId,
                          orderingFrequency: 3
                        });
                      }
                    } else if (fileTypeId === 2) {
                      let temp = fromDateValueObj;
                      let startDateIter;
                      if (yearDiffr !== 0) {
                        let monthDiff = this.getMonthDifference(fromDateValueObj, toDateValueObj);
                        for (let index = 0; index <= (monthDiff / 3); index++) {
                          if (index == 0) {
                            startDateIter = fromDateValueObj;
                          } else {
                            temp.setDate(temp.getDate() + 1);
                            startDateIter = temp;
                          }
                          let days90aheadTime = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                          if (days90aheadTime.getTime() >= toDateValueObj.getTime()) {

                            temp = toDateValueObj;
                            requestObj.push({
                              advisorId: this.advisorId,
                              rmId: this.rmId,
                              rtId,
                              arnRiaDetailId: this.arnRiaDetails,
                              fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                              toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                              fileTypeId: fileTypeId,
                              orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                            });
                            break;
                          } else {
                            temp = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                            requestObj.push({
                              advisorId: this.advisorId,
                              rmId: this.rmId,
                              rtId,
                              arnRiaDetailId: this.arnRiaDetails,
                              fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                              toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                              fileTypeId: fileTypeId,
                              orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                            });
                          }
                        }
                      }
                    }
                    else {
                      requestObj.push({
                        advisorId: this.advisorId,
                        rmId: this.rmId,
                        rtId,
                        arnRiaDetailId: this.arnRiaDetails,
                        fromDate: typeof (fromDateIter) === 'object' ? fromDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((fromDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(fromDateIter.getDate(), 2) : fromDateIter,
                        toDate: typeof (toDateIter) === 'object' ? toDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateIter.getDate(), 2) : toDateIter,
                        fileTypeId: fileTypeId,
                        orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                      });
                    }
                  }
                }
              }
            }
          } else {

            for (let index = 1; index <= yearDiffr; index++) {
              // is 
              for (let index1 = 1; index1 <= 12; index1++) {
                if (index1 === 1) {
                  toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                } else {
                  fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
                  if ((toDateIter.getMonth() === toDateValueObj.getMonth()) && (toDateIter.getFullYear() === toDateValueObj.getFullYear())) {
                    toDateIter = toDateValueObj;
                  } else {
                    toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                  }
                }
                let fileToOrder = this.orderHistoryFileForm.get(`selectFilesToOrder.${whichRta}`).value;
                let fileTypeId;
                let rtId;
                if (fileToOrder) {
                  for (const key in fileToOrder) {
                    if (fileToOrder[key]) {
                      this.fileTypeOrderList.forEach(element => {
                        if (element.type === key) {
                          fileTypeId = element.id;
                          rtId = element.rtId;
                        }
                      });


                      if (fileTypeId === 6 || fileTypeId === 12) {
                        if (!(requestObj.some(item => item.fileTypeId === fileTypeId))) {
                          requestObj.push({
                            advisorId: this.advisorId,
                            rmId: this.rmId,
                            rtId,
                            arnRiaDetailId: this.arnRiaDetails,
                            fromDate: null,
                            toDate: toDateValueObj.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateValueObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateValueObj.getDate(), 2),
                            fileTypeId: fileTypeId,
                            orderingFrequency: 3
                          });
                        }
                      }

                      else if (fileTypeId === 2) {
                        let temp = fromDateValueObj;
                        let startDateIter;
                        if (yearDiffr !== 0) {
                          let monthDiff = this.getMonthDifference(fromDateValueObj, toDateValueObj);
                          for (let index = 0; index <= (monthDiff / 3); index++) {
                            if (index == 0) {
                              startDateIter = fromDateValueObj;
                            } else {
                              temp.setDate(temp.getDate() + 1);
                              startDateIter = temp;
                            }
                            let days90aheadTime = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                            if (days90aheadTime.getTime() >= toDateValueObj.getTime()) {

                              temp = toDateValueObj;
                              requestObj.push({
                                advisorId: this.advisorId,
                                rmId: this.rmId,
                                rtId,
                                arnRiaDetailId: this.arnRiaDetails,
                                fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                                toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                                fileTypeId: fileTypeId,
                                orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                              });
                              break;
                            } else {
                              temp = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                              requestObj.push({
                                advisorId: this.advisorId,
                                rmId: this.rmId,
                                rtId,
                                arnRiaDetailId: this.arnRiaDetails,
                                fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                                toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                                fileTypeId: fileTypeId,
                                orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                              });
                            }
                          }
                        }
                      }
                      else {
                        requestObj.push({
                          advisorId: this.advisorId,
                          rmId: this.rmId,
                          rtId,
                          arnRiaDetailId: this.arnRiaDetails,
                          fromDate: typeof (fromDateIter) === 'object' ? fromDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((fromDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(fromDateIter.getDate(), 2) : fromDateIter,
                          toDate: typeof (toDateIter) === 'object' ? toDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateIter.getDate(), 2) : toDateIter,
                          fileTypeId: fileTypeId,
                          orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                        });
                      }
                    }
                  }
                }
              }
            }
            if (fromDateIter.getFullYear() !== toDateValueObj.getFullYear()) {
              toDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
              let monthDiff = (toDateValueObj.getMonth() - toDateIter.getMonth()) + 1;

              console.log(fromDateIter, toDateIter, monthDiff);
              for (let index = 1; index <= monthDiff; index++) {
                if (index === 1) {
                  fromDateIter = toDateIter;
                  if (monthDiff === 1) {
                    if (toDateValueObj.getDate() === 1) {
                      toDateIter = toDateValueObj;
                    } else {
                      toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                    }
                  } else {
                    toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                  }
                  // toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                } else {
                  if (index === monthDiff) {
                    fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
                    toDateIter = toDateValueObj;
                  } else {
                    fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
                    toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                  }
                }
                let fileToOrder = this.orderHistoryFileForm.get(`selectFilesToOrder.${whichRta}`).value;
                let fileTypeId;
                let rtId;
                if (fileToOrder) {
                  for (const key in fileToOrder) {
                    if (fileToOrder[key]) {
                      this.fileTypeOrderList.forEach(element => {
                        if (element.type === key) {
                          fileTypeId = element.id;
                          rtId = element.rtId;
                        }
                      });


                      if (fileTypeId === 6 || fileTypeId === 12) {
                        if (!(requestObj.some(item => item.fileTypeId === fileTypeId))) {
                          requestObj.push({
                            advisorId: this.advisorId,
                            rmId: this.rmId,
                            rtId,
                            arnRiaDetailId: this.arnRiaDetails,
                            fromDate: null,
                            toDate: toDateValueObj.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateValueObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateValueObj.getDate(), 2),
                            fileTypeId: fileTypeId,
                            orderingFrequency: 3
                          });
                        }
                      } else if (fileTypeId === 2) {
                        let temp = fromDateValueObj;
                        let startDateIter;
                        if (yearDiffr !== 0) {
                          let monthDiff = this.getMonthDifference(fromDateValueObj, toDateValueObj);
                          for (let index = 0; index <= (monthDiff / 3); index++) {
                            if (index == 0) {
                              startDateIter = fromDateValueObj;
                            } else {
                              temp.setDate(temp.getDate() + 1);
                              startDateIter = temp;
                            }
                            let days90aheadTime = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                            if (days90aheadTime.getTime() >= toDateValueObj.getTime()) {

                              temp = toDateValueObj;
                              requestObj.push({
                                advisorId: this.advisorId,
                                rmId: this.rmId,
                                rtId,
                                arnRiaDetailId: this.arnRiaDetails,
                                fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                                toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                                fileTypeId: fileTypeId,
                                orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                              });
                              break;
                            } else {
                              temp = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                              requestObj.push({
                                advisorId: this.advisorId,
                                rmId: this.rmId,
                                rtId,
                                arnRiaDetailId: this.arnRiaDetails,
                                fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                                toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                                fileTypeId: fileTypeId,
                                orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                              });
                            }
                          }
                        }
                      }
                      else {
                        requestObj.push({
                          advisorId: this.advisorId,
                          rmId: this.rmId,
                          rtId,
                          arnRiaDetailId: this.arnRiaDetails,
                          fromDate: typeof (fromDateIter) === 'object' ? fromDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((fromDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(fromDateIter.getDate(), 2) : fromDateIter,
                          toDate: typeof (toDateIter) === 'object' ? toDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateIter.getDate(), 2) : toDateIter,
                          fileTypeId: fileTypeId,
                          orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                        });
                      }
                    }
                  }
                }
              }
            }

          }
          console.log(requestObj);
        } else {
          let yearDiffr = toDateValueObj.getFullYear() - fromDateValueObj.getFullYear();
          if (yearDiffr === 0) {
            let monthDiff = (toDateValueObj.getMonth() - fromDateValueObj.getMonth());
            for (let index = 0; index < monthDiff; index++) {
              if (index == 0) {
                fromDateIter = fromDateValueObj;
                if (monthDiff === 1) {
                  if (toDateValueObj.getDate() === 1) {
                    toDateIter = toDateValueObj;
                  } else {
                    toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                  }
                } else {
                  toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                }
              } else {
                fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
                if (fromDateIter.getDate() === toDateValueObj.getDate() && fromDateIter.getMonth() === toDateValueObj.getMonth()) {
                  toDateIter = fromDateIter;
                } else if (index === (monthDiff - 1)) {
                  toDateIter = toDateValueObj;
                } else {
                  toDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'month');
                }
              }
              let fileToOrder = this.orderHistoryFileForm.get(`selectFilesToOrder.${whichRta}`).value;
              let fileTypeId;
              let rtId;
              if (fileToOrder) {
                for (const key in fileToOrder) {
                  if (fileToOrder[key]) {
                    this.fileTypeOrderList.forEach(element => {
                      if (element.type === key) {
                        fileTypeId = element.id;
                        rtId = element.rtId;
                      }
                    });


                    if (fileTypeId === 6 || fileTypeId === 12) {
                      if (!(requestObj.some(item => item.fileTypeId === fileTypeId))) {
                        requestObj.push({
                          advisorId: this.advisorId,
                          rmId: this.rmId,
                          rtId,
                          arnRiaDetailId: this.arnRiaDetails,
                          fromDate: null,
                          toDate: toDateValueObj.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateValueObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateValueObj.getDate(), 2),
                          fileTypeId: fileTypeId,
                          orderingFrequency: 3
                        });
                      }
                    } else if (fileTypeId === 2) {
                      let temp = fromDateValueObj;
                      let startDateIter;
                      if (yearDiffr !== 0) {
                        let monthDiff = this.getMonthDifference(fromDateValueObj, toDateValueObj);
                        for (let index = 0; index <= (monthDiff / 3); index++) {
                          if (index == 0) {
                            startDateIter = fromDateValueObj;
                          } else {
                            temp.setDate(temp.getDate() + 1);
                            startDateIter = temp;
                          }
                          let days90aheadTime = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                          if (days90aheadTime.getTime() >= toDateValueObj.getTime()) {

                            temp = toDateValueObj;
                            requestObj.push({
                              advisorId: this.advisorId,
                              rmId: this.rmId,
                              rtId,
                              arnRiaDetailId: this.arnRiaDetails,
                              fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                              toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                              fileTypeId: fileTypeId,
                              orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                            });
                            break;
                          } else {
                            temp = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                            requestObj.push({
                              advisorId: this.advisorId,
                              rmId: this.rmId,
                              rtId,
                              arnRiaDetailId: this.arnRiaDetails,
                              fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                              toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                              fileTypeId: fileTypeId,
                              orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                            });
                          }
                        }
                      }
                    }
                    else {
                      requestObj.push({
                        advisorId: this.advisorId,
                        rmId: this.rmId,
                        rtId,
                        arnRiaDetailId: this.arnRiaDetails,
                        fromDate: typeof (fromDateIter) === 'object' ? fromDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((fromDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(fromDateIter.getDate(), 2) : fromDateIter,
                        toDate: typeof (toDateIter) === 'object' ? toDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateIter.getDate(), 2) : toDateIter,
                        fileTypeId: fileTypeId,
                        orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                      });
                    }
                  }
                }
              }
            }
          } else {

            for (let index = 1; index <= yearDiffr; index++) {
              // is 
              for (let index1 = 1; index1 <= 12; index1++) {
                if (index1 === 1) {
                  fromDateIter = fromDateValueObj;
                  toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                } else {
                  fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');

                  if ((toDateValueObj.getMonth() === toDateIter.getMonth()) && (toDateValueObj.getFullYear() === toDateIter.getFullYear())) {
                    toDateIter = toDateValueObj;
                  } else {
                    toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                  }
                }
                let fileToOrder = this.orderHistoryFileForm.get(`selectFilesToOrder.${whichRta}`).value;
                let fileTypeId;
                let rtId;
                if (fileToOrder) {
                  for (const key in fileToOrder) {
                    if (fileToOrder[key]) {
                      this.fileTypeOrderList.forEach(element => {
                        if (element.type === key) {
                          fileTypeId = element.id;
                          rtId = element.rtId;
                        }
                      });


                      if (fileTypeId === 6 || fileTypeId === 12) {
                        if (!(requestObj.some(item => item.fileTypeId === fileTypeId))) {
                          requestObj.push({
                            advisorId: this.advisorId,
                            rmId: this.rmId,
                            rtId,
                            arnRiaDetailId: this.arnRiaDetails,
                            fromDate: null,
                            toDate: toDateValueObj.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateValueObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateValueObj.getDate(), 2),
                            fileTypeId: fileTypeId,
                            orderingFrequency: 3
                          });
                        }
                      } else if (fileTypeId === 2) {
                        let temp = fromDateValueObj;
                        let startDateIter;
                        if (yearDiffr !== 0) {
                          let monthDiff = this.getMonthDifference(fromDateValueObj, toDateValueObj);
                          for (let index = 0; index <= (monthDiff / 3); index++) {
                            if (index == 0) {
                              startDateIter = fromDateValueObj;
                            } else {
                              temp.setDate(temp.getDate() + 1);
                              startDateIter = temp;
                            }
                            let days90aheadTime = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                            if (days90aheadTime.getTime() >= toDateValueObj.getTime()) {

                              temp = toDateValueObj;
                              requestObj.push({
                                advisorId: this.advisorId,
                                rmId: this.rmId,
                                rtId,
                                arnRiaDetailId: this.arnRiaDetails,
                                fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                                toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                                fileTypeId: fileTypeId,
                                orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                              });
                              break;
                            } else {
                              temp = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                              requestObj.push({
                                advisorId: this.advisorId,
                                rmId: this.rmId,
                                rtId,
                                arnRiaDetailId: this.arnRiaDetails,
                                fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                                toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                                fileTypeId: fileTypeId,
                                orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                              });
                            }
                          }
                        }
                      }
                      else {
                        requestObj.push({
                          advisorId: this.advisorId,
                          rmId: this.rmId,
                          rtId,
                          arnRiaDetailId: this.arnRiaDetails,
                          fromDate: typeof (fromDateIter) === 'object' ? fromDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((fromDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(fromDateIter.getDate(), 2) : fromDateIter,
                          toDate: typeof (toDateIter) === 'object' ? toDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateIter.getDate(), 2) : toDateIter,
                          fileTypeId: fileTypeId,
                          orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                        });
                      }
                    }
                  }
                }
              }
            }
            if (fromDateIter.getFullYear() !== toDateValueObj.getFullYear()) {
              toDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
              let monthDiff = (toDateValueObj.getMonth() - toDateIter.getMonth()) + 1;

              console.log(fromDateIter, toDateIter, monthDiff);
              for (let index = 1; index <= monthDiff; index++) {
                if (index === 1) {
                  fromDateIter = toDateIter;
                  if (monthDiff === 1) {
                    if (toDateValueObj.getDate() === 1) {
                      toDateIter = toDateValueObj;
                    } else {
                      toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                    }
                  } else {
                    toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                  }
                  // toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                } else {
                  if (index === monthDiff) {
                    fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
                    toDateIter = toDateValueObj;
                  } else {
                    fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
                    toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                  }
                }
                let fileToOrder = this.orderHistoryFileForm.get(`selectFilesToOrder.${whichRta}`).value;
                let fileTypeId;
                let rtId;
                if (fileToOrder) {
                  for (const key in fileToOrder) {
                    if (fileToOrder[key]) {
                      this.fileTypeOrderList.forEach(element => {
                        if (element.type === key) {
                          fileTypeId = element.id;
                          rtId = element.rtId;
                        }
                      });


                      if (fileTypeId === 6 || fileTypeId === 12) {
                        if (!(requestObj.some(item => item.fileTypeId === fileTypeId))) {
                          requestObj.push({
                            advisorId: this.advisorId,
                            rmId: this.rmId,
                            rtId,
                            arnRiaDetailId: this.arnRiaDetails,
                            fromDate: null,
                            toDate: toDateValueObj.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateValueObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateValueObj.getDate(), 2),
                            fileTypeId: fileTypeId,
                            orderingFrequency: 3
                          });
                        }
                      } else if (fileTypeId === 2) {
                        let temp = fromDateValueObj;
                        let startDateIter;
                        if (yearDiffr !== 0) {
                          let monthDiff = this.getMonthDifference(fromDateValueObj, toDateValueObj);
                          for (let index = 0; index <= (monthDiff / 3); index++) {
                            if (index == 0) {
                              startDateIter = fromDateValueObj;
                            } else {
                              temp.setDate(temp.getDate() + 1);
                              startDateIter = temp;
                            }
                            let days90aheadTime = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                            if (days90aheadTime.getTime() >= toDateValueObj.getTime()) {

                              temp = toDateValueObj;
                              requestObj.push({
                                advisorId: this.advisorId,
                                rmId: this.rmId,
                                rtId,
                                arnRiaDetailId: this.arnRiaDetails,
                                fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                                toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                                fileTypeId: fileTypeId,
                                orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                              });
                              break;
                            } else {
                              temp = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                              requestObj.push({
                                advisorId: this.advisorId,
                                rmId: this.rmId,
                                rtId,
                                arnRiaDetailId: this.arnRiaDetails,
                                fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                                toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                                fileTypeId: fileTypeId,
                                orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                              });
                            }
                          }
                        }
                      } else {
                        requestObj.push({
                          advisorId: this.advisorId,
                          rmId: this.rmId,
                          rtId,
                          arnRiaDetailId: this.arnRiaDetails,
                          fromDate: typeof (fromDateIter) === 'object' ? fromDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((fromDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(fromDateIter.getDate(), 2) : fromDateIter,
                          toDate: typeof (toDateIter) === 'object' ? toDateIter.getFullYear() + "-" + this.util.addZeroBeforeNumber((toDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateIter.getDate(), 2) : toDateIter,
                          fileTypeId: fileTypeId,
                          orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                        });
                      }
                    }
                  }
                }
              }
            }

          }
          console.log(requestObj);
        }
      }
      else if (this.orderHistoryFileForm.get('orderingFreq').value === '3') {
        let yearDiffr = toDateValueObj.getFullYear() - fromDateValueObj.getFullYear();
        console.log("this is year Difference::", yearDiffr);
        // let fromDateIter;
        // let toDateIter;
        // if (yearDiffr !== 0) {

        // for (let index = 1; index <= yearDiffr; index++) {
        let fileToOrder = this.orderHistoryFileForm.get(`selectFilesToOrder.${whichRta}`).value;
        let fileTypeId;
        let rtId;
        if (fileToOrder) {
          for (const key in fileToOrder) {
            if (fileToOrder[key]) {

              this.fileTypeOrderList.forEach(element => {
                if (element.type === key) {
                  fileTypeId = element.id;
                  rtId = element.rtId;
                }
              });
              if (fileTypeId === 6 || fileTypeId === 12) {
                if (!(requestObj.some(item => item.fileTypeId === fileTypeId))) {
                  requestObj.push({
                    advisorId: this.advisorId,
                    rmId: this.rmId,
                    rtId,
                    arnRiaDetailId: this.arnRiaDetails,
                    fromDate: null,
                    toDate: toDateValueObj.getFullYear() + '-' + this.util.addZeroBeforeNumber((toDateValueObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateValueObj.getDate(), 2),
                    fileTypeId: fileTypeId,
                    orderingFrequency: 3
                  });
                }
              } else if (fileTypeId === 2) {
                let temp = fromDateValueObj;
                let startDateIter;
                if (yearDiffr !== 0) {
                  let monthDiff = this.getMonthDifference(fromDateValueObj, toDateValueObj);
                  for (let index = 0; index <= (monthDiff / 3); index++) {
                    if (index == 0) {
                      startDateIter = fromDateValueObj;
                    } else {
                      temp.setDate(temp.getDate() + 1);
                      startDateIter = temp;
                    }
                    let days90aheadTime = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                    if (days90aheadTime.getTime() >= toDateValueObj.getTime()) {

                      temp = toDateValueObj;
                      requestObj.push({
                        advisorId: this.advisorId,
                        rmId: this.rmId,
                        rtId,
                        arnRiaDetailId: this.arnRiaDetails,
                        fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                        toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                        fileTypeId: fileTypeId,
                        orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                      });
                      break;
                    } else {
                      temp = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                      requestObj.push({
                        advisorId: this.advisorId,
                        rmId: this.rmId,
                        rtId,
                        arnRiaDetailId: this.arnRiaDetails,
                        fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                        toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                        fileTypeId: fileTypeId,
                        orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                      });
                    }
                  }
                } else {
                  let monthDiffr = (toDateValueObj.getMonth() - fromDateValueObj()) - 1;
                  startDateIter = fromDateValueObj;
                  if (startDateIter.getDate() !== 1) {

                    temp = new Date(fromDateValueObj.getFullYear(), fromDateValueObj.getMonth() + 1, 0);

                    requestObj.push({
                      advisorId: this.advisorId,
                      rmId: this.rmId,
                      rtId,
                      arnRiaDetailId: this.arnRiaDetails,
                      fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                      toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                      fileTypeId: fileTypeId,
                      orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                    });
                  }
                  temp = fromDateValueObj;
                  for (let i = 0; i < monthDiffr % 4; i++) {
                    if (JSON.stringify(temp) === JSON.stringify(toDateValueObj)) {
                      requestObj.push({
                        advisorId: this.advisorId,
                        rmId: this.rmId,
                        rtId,
                        arnRiaDetailId: this.arnRiaDetails,
                        fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                        toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                        fileTypeId: fileTypeId,
                        orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                      });
                    } else {
                      temp = this.addYearMonthOrDayToDate(startDateIter, 90, 'day');
                      requestObj.push({
                        advisorId: this.advisorId,
                        rmId: this.rmId,
                        rtId,
                        arnRiaDetailId: this.arnRiaDetails,
                        fromDate: startDateIter.getFullYear() + '-' + this.util.addZeroBeforeNumber((startDateIter.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(startDateIter.getDate(), 2),
                        toDate: temp.getFullYear() + '-' + this.util.addZeroBeforeNumber((temp.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(temp.getDate(), 2),
                        fileTypeId: fileTypeId,
                        orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                      });
                    }

                  }

                  // this.....
                }
              } else {
                requestObj.push({
                  advisorId: this.advisorId,
                  rmId: this.rmId,
                  rtId,
                  arnRiaDetailId: this.arnRiaDetails,
                  fromDate: fromDateValueObj.getFullYear() + '-' + this.util.addZeroBeforeNumber((fromDateValueObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(fromDateValueObj.getDate(), 2),
                  toDate: toDateValueObj.getFullYear() + '-' + this.util.addZeroBeforeNumber((toDateValueObj.getMonth() + 1), 2) + "-" + this.util.addZeroBeforeNumber(toDateValueObj.getDate(), 2),
                  fileTypeId: fileTypeId,
                  orderingFrequency: this.orderHistoryFileForm.get('orderingFreq').value
                });
              }
              console.log("this is request Object:;", requestObj);
            }
          }
        }
      }
      this.requestJsonForOrderingFiles = requestObj;

      console.log("this is request object:::", requestObj, this.arnRiaIdList);

      if (this.arnRiaIdList.length !== 0) {
        this.orderHistoryFileForm.get('selectArnRia').value.forEach(element => {
          console.log("select arn ria details::: value", element.selection, element);
          if (element.selection) {
            this.arnRiaIdList.forEach(element1 => {

              requestObj.forEach(element2 => {
                let compareObj = {
                  advisorId: element2.advisorId,
                  rmId: element2.rmId,
                  rtId: element2.rtId,
                  arnRiaDetailId: element1,
                  fromDate: element2.fromDate,
                  toDate: element2.toDate,
                  fileTypeId: element2.fileTypeId,
                  orderingFrequency: element2.orderingFrequency
                }
                if (!this.moreArnRiaObj.some(item => this.util.areTwoObjectsSame(item, compareObj))) {
                  this.moreArnRiaObj.push({
                    advisorId: element2.advisorId,
                    rmId: element2.rmId,
                    rtId: element2.rtId,
                    arnRiaDetailId: element1,
                    fromDate: element2.fromDate,
                    toDate: element2.toDate,
                    fileTypeId: element2.fileTypeId,
                    orderingFrequency: element2.orderingFrequency
                  })
                }
              });
            });
          }
        });

        requestObj = [...requestObj, ...this.moreArnRiaObj];

        this.orderHistoryFileForm.get('selectArnRia').value.forEach((item, index) => {
          if (!item.selection) {
            let id = this.arnRiaDetailsList[index].id;
            requestObj.forEach((item, index1) => {
              if (item.arnRiaDetailId === id) {
                requestObj.splice(index1, 1);
              }
            })
          }
        });
        this.requestJsonForOrderingFiles = requestObj;
      }

    }
    console.log("this is request Obj", requestObj);
    this.postFileOrderingData();
  }

  postFileOrderingData() {

    console.log("i need this for post call", this.requestJsonForOrderingFiles);
    this.supportService.postFileOrderingData(this.requestJsonForOrderingFiles)
      .subscribe(data => {
        if (data) {
          console.log("success::", data);
        } else {
          console.error("error::", data)
        }
      }, err => {
        this.eventService.openSnackBar(err, "DISMISS");
      })
  }

  addYearMonthOrDayToDate(date, value, choice) {
    let result = new Date(date);
    switch (choice) {
      case 'day':
        result.setDate(result.getDate() + value);
        break;
      case 'month':
        result.setMonth(result.getMonth() + value);
        result.setDate(result.getDate() - 1);
        break;
      case 'year':
        result.setFullYear(result.getFullYear() + value);
        result.setDate(result.getDate() - 1);
        break;
    }
    return result;
  }

  getMonthDifference(d1, d2) {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

}