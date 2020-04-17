import { AuthService } from './../../../../auth-service/authService';
import { EventService } from './../../../../Data-service/event.service';
import { SubscriptionInject } from './../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SupportService } from '../support.service';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { SettingsService } from '../../AdviserComponent/setting/settings.service';
import { UtilService } from '../../../../services/util.service';

@Component({
  selector: 'app-order-historical-file',
  templateUrl: './order-historical-file.component.html',
  styleUrls: ['./order-historical-file.component.scss']
})
export class OrderHistoricalFileComponent implements OnInit {
  rmId = 2;
  arnRiaDetails = 4;
  asOnDate: boolean = false;
  formValidationFalseCount: number = 0;
  mainFormValidationValue: boolean = false;
  fromToSameError: boolean = false;
  camsAsOnDatePastMaxDate: Date = new Date("1 January, 1993");
  karvyOrFranklinPastMaxDate = new Date("1 January, 1990");
  dateToday: Date = new Date();
  dateYesterday: Date = new Date(new Date().setDate(new Date().getDate() - 1));
  orderingFreq: {}[] = [{ id: '1', name: 'Yearly' }, { id: '2', name: 'Monthly' }, { id: '3', name: 'All at once' }];

  fileTypeOrderList: any[] = [];
  camsValueChangeSubscription: Subscription;
  karvyValueChangeSubscription: Subscription;
  franklinValueChangeSubscription: Subscription;
  isArnOrRiaSelected: boolean = false;
  dateObject = new Date();
  advisorId: any = AuthService.getAdvisorId();
  camsValueChangeSubscription1: Subscription;
  currentDate: string = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
  advisorNameInput = '';
  requestJsonForOrderingFiles: any[] = [];
  searchAdvisorForm = this.fb.group({
    searchAdvisor: [,]
  });
  errorMsg: string = '';
  arrayOfAdvisorName;
  isLoadingForDropDown: boolean = false;
  arrayAdvisorNameError: boolean;
  @ViewChild('advisorRef', { static: true }) advisorRef;

  constructor(
    private supportService: SupportService,
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private eventService: EventService,
    private settingService: SettingsService,
    private util: UtilService
  ) { }

  resetDateAsOnDateAndFormCheckbox() {
    if (this.orderHistoryFileForm.get('selectRta').value !== '1') {
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

  getArnRiaDetails() {
    this.settingService.getArnlist({ advisorId: this.advisorId })
      .subscribe(data => {
        if (data && data.length !== 0) {
          data.forEach(element => {
            this.arnRiaDetails = element.id;
          });
          console.log("arn ria details:::", data);
        }
      });
  }

  orderHistoryFileForm = this.fb.group({
    "selectRta": ['1', Validators.required],
    "selectArnRia": this.fb.group({
      "selectArn": [,],
      "selectRia": [,],
    }, Validators.required),
    "fromDate": [, Validators.required],
    "toDate": [, Validators.required],
    "asOnDate": [,],
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
        "mfsd243Active": [false,],
        "mfsd231Ceased": [false,],
        "mfsd211": [false,],
        "mfsd203": [false,]
      }),
      "franklin": this.fb.group({
        "myTransactionsForAPeriod": [false,],
        "activeSip": [false,],
        "ceasedSip": [false,],
        "investorFolioDetails": [false,],
        "clientsWiseAumOrWhoseBalExceedsN": [false,]
      })
    }),
  });

  ngOnInit() {
    console.log("this is yesterday's date::::   ", this.dateYesterday);
    // this.isOnlyAumSelected()

    this.searchAdvisorCredentials();
    this.conditionalRenderingOfForm();
    this.getFileTypeOrderValues();
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
    const data = {
      name: value
    }
    return this.supportService.getBackofficeAdvisorSearchByName(data);
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
      } else if (val['mfsd243Active']) {
        this.changesDueToCamsSelection(1)
      } else if (val['mfsd231Ceased']) {
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
      if (val['myTransactionsForAPeriod']) {
        this.changesDueToCamsSelection(1);
      } else if (val['activeSip']) {
        this.changesDueToCamsSelection(1);
      } else if (val['ceasedSip']) {
        this.changesDueToCamsSelection(1);
      } else if (val['investorFolioDetails']) {
        this.changesDueToCamsSelection(1);
      } else if (val['clientsWiseAumOrWhoseBalExceedsN']) {
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
    (rtaValue === '1') ? selectFormGroup = 'cams' :
      (rtaValue === '2') ? selectFormGroup = 'karvy' :
        (rtaValue === '3') ? selectFormGroup = 'franklin' : null;

    if (this.orderHistoryFileForm.get('selectRta').value === rtaValue) {
      for (const key in this.orderHistoryFileForm.get(`selectFilesToOrder.${selectFormGroup}`)['controls']) {
        if (this.orderHistoryFileForm.get(`selectFilesToOrder.${selectFormGroup}`)['controls'].hasOwnProperty(key)) {
          const element = this.orderHistoryFileForm.get(`selectFilesToOrder.${selectFormGroup}`)['controls'][key];
          if (element.value === false) {
            count++;
          }
        }
      }
      if (count === (rtaValue === '1' ? 6 : 5)) {
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
      } else if (key === 'selectArnRia') {
        let isRiaSelected = false;
        if (this.orderHistoryFileForm.get('selectArnRia.selectRia').value !== true) {
          isRiaSelected = true;
        }
        if (this.orderHistoryFileForm.get('selectArnRia.selectArn').value !== true && isRiaSelected) {
          this.orderHistoryFileForm.get('selectArnRia').setErrors({ error: true });
        }

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
      console.log('must be closed', this.orderHistoryFileForm.value);
      this.calculateDateAndObject();
      this.dialogClose(true);
    } else {
      this.formValidationFalseCount++;
      this.eventService.openSnackBar("Must fill required field", "Dismiss");
    }
  }

  calculateDateAndObject() {
    // yearly
    let requestObj = [];
    let fromDateValueObj = this.orderHistoryFileForm.get('fromDate').value;
    let toDateValueObj = this.orderHistoryFileForm.get('toDate').value;
    let whichRta = (this.orderHistoryFileForm.get('selectRta').value === '1') ? 'cams' :
      ((this.orderHistoryFileForm.get('selectRta').value === '2') ? 'karvy' :
        ((this.orderHistoryFileForm.get('selectRta').value === '3') ? 'franklin' : ''));

    if (this.orderHistoryFileForm.get('fromDate').value && this.orderHistoryFileForm.get('toDate').value) {
      // adding file Type ids

      //  for CAMS
      // yearly
      if (this.orderHistoryFileForm.get('orderingFreq').value === '1') {
        let yearDiffr = toDateValueObj.getFullYear() - fromDateValueObj.getFullYear();
        console.log("this is year Difference::", yearDiffr);
        let fromDateIter;
        let toDateIter;

        //  middle date
        let fromDateString = (fromDateValueObj.getMonth() + 1) + "-" + fromDateValueObj.getDate();
        if (fromDateString !== "1-1") {
          fromDateIter = fromDateValueObj;
          toDateIter = new Date(new Date().setFullYear(fromDateValueObj.getFullYear(), 11, 31));

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
                  let temp;
                  let startDateIter;
                  for (let index1 = 0; index1 < 4; index1++) {
                    if (index1 == 0) {
                      startDateIter = fromDateValueObj;
                    } else {
                      temp.setDate(temp.getDate() + 1)
                      startDateIter = temp;
                    }
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
          for (let index = 1; index <= yearDiffr; index++) {

            if (index === 1) {
              fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
              if (index === yearDiffr) {
                toDateIter = toDateValueObj.getFullYear() + "-" + (toDateValueObj.getMonth() + 1) + "-" + toDateValueObj.getDate();
                if (toDateIter === fromDateIter) {
                  break;
                }
              } else {
                toDateIter = this.addYearMonthOrDayToDate(fromDateIter, index, 'year');
              }
            } else {
              fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
              if (index === yearDiffr) {
                toDateIter = toDateValueObj.getFullYear() + "-" + (toDateValueObj.getMonth() + 1) + "-" + toDateValueObj.getDate();
                if (JSON.stringify(toDateIter) === JSON.stringify(fromDateIter)) {
                  break;
                }
              } else {
                toDateIter = this.addYearMonthOrDayToDate(fromDateIter, index, 'year');
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
                    let temp;
                    let startDateIter;
                    for (let index1 = 0; index1 < 4; index1++) {
                      if (index1 == 0) {
                        startDateIter = fromDateValueObj;
                      } else {
                        temp.setDate(temp.getDate() + 1)
                        startDateIter = temp;
                      }
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
          console.log(requestObj);

        } else {

          for (let index = 0; index <= yearDiffr; index++) {

            if (index === 0) {
              fromDateIter = fromDateValueObj;
              toDateIter = this.addYearMonthOrDayToDate(fromDateValueObj, index + 1, 'year');
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
                    let temp;
                    let startDateIter;
                    for (let index1 = 0; index1 < 4; index1++) {
                      if (index1 == 0) {
                        startDateIter = fromDateValueObj;
                      } else {
                        temp.setDate(temp.getDate() + 1)
                        startDateIter = temp;
                      }
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
          console.log(requestObj);
        }

      }

      // monthly

      else if (this.orderHistoryFileForm.get('orderingFreq').value === '2') {
        let fromDateIter;
        let toDateIter;
        let fromDateString = fromDateValueObj.getDate();

        if (fromDateString !== "1") {
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
          fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');

          let yearDiffr = toDateValueObj.getFullYear() - fromDateIter.getFullYear();
          if (yearDiffr === 0) {
            let monthDiff = (toDateValueObj.getMonth() - fromDateIter.getMonth()) + 1;
            for (let index = 0; index < monthDiff; index++) {
              if (index == 0) {
                toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
              } else {
                fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
                toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
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
          } else {

            for (let index = 1; index <= yearDiffr; index++) {
              // is 
              for (let index1 = 1; index1 <= 12; index1++) {
                if (index1 === 1) {
                  toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                } else {
                  fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
                  toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
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
            if (fromDateIter.getFullYear() !== toDateValueObj.getFullYear()) {
              toDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
              let monthDiff = (toDateValueObj.getMonth() - toDateIter.getMonth()) + 1;

              console.log(fromDateIter, toDateIter, monthDiff);
              for (let index = 1; index <= monthDiff; index++) {
                if (index === 1) {
                  fromDateIter = toDateIter;
                  toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
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
        } else {
          let yearDiffr = toDateValueObj.getFullYear() - fromDateValueObj.getFullYear();
          if (yearDiffr === 0) {
            let monthDiff = (toDateValueObj.getMonth() - fromDateValueObj.getMonth()) + 1;
            for (let index = 0; index < monthDiff; index++) {
              if (index == 0) {
                fromDateIter = fromDateValueObj;
                toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
              } else {
                fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
                toDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'month');
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
          } else {

            for (let index = 1; index <= yearDiffr; index++) {
              // is 
              for (let index1 = 1; index1 <= 12; index1++) {
                if (index1 === 1) {
                  fromDateIter = fromDateValueObj;
                  toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
                } else {
                  fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
                  toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
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
            if (fromDateIter.getFullYear() !== toDateValueObj.getFullYear()) {
              toDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
              let monthDiff = (toDateValueObj.getMonth() - toDateIter.getMonth()) + 1;

              console.log(fromDateIter, toDateIter, monthDiff);
              for (let index = 1; index <= monthDiff; index++) {
                if (index === 1) {
                  fromDateIter = toDateIter;
                  toDateIter = this.addYearMonthOrDayToDate(fromDateIter, 1, 'month');
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
        if (yearDiffr !== 0) {

          for (let index = 1; index <= yearDiffr; index++) {
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
                    requestObj.push({
                      advisorId: this.advisorId,
                      rmId: this.rmId,
                      rtId,
                      arnRiaDetailId: this.arnRiaDetails,
                      fromDate: null,
                      toDate: this.orderHistoryFileForm.get('asOnDate').value,
                      fileTypeId: fileTypeId,
                      orderingFrequency: 3
                    });
                  } else if (fileTypeId === 2) {
                    let temp;
                    let startDateIter;
                    for (let index1 = 0; index1 < 4; index1++) {
                      if (index1 == 0) {
                        startDateIter = fromDateValueObj;
                      } else {
                        temp.setDate(temp.getDate() + 1)
                        startDateIter = temp;
                      }
                      if (JSON.stringify(temp) === JSON.stringify(toDateValueObj)) {
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

        } else {
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
                  requestObj.push({
                    advisorId: this.advisorId,
                    rmId: this.rmId,
                    rtId,
                    arnRiaDetailId: this.arnRiaDetails,
                    fromDate: null,
                    toDate: this.orderHistoryFileForm.get('asOnDate').value,
                    fileTypeId: fileTypeId,
                    orderingFrequency: 3
                  });
                } else if (fileTypeId === 2) {
                  let temp;
                  let startDateIter;
                  for (let index1 = 0; index1 < 4; index1++) {
                    if (index1 == 0) {
                      startDateIter = fromDateValueObj;
                    } else {
                      temp.setDate(temp.getDate() + 1)
                      startDateIter = temp;
                    }
                    if (JSON.stringify(temp) === JSON.stringify(toDateValueObj)) {
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
              }
            }
          }
        }
      }
      this.requestJsonForOrderingFiles = requestObj;
      console.log("this is request object:::", requestObj);

    }
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

}