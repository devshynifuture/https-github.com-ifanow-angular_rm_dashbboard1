import { AuthService } from './../../../../auth-service/authService';
import { EventService } from './../../../../Data-service/event.service';
import { SubscriptionInject } from './../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SupportService } from '../support.service';

@Component({
  selector: 'app-order-historical-file',
  templateUrl: './order-historical-file.component.html',
  styleUrls: ['./order-historical-file.component.scss']
})
export class OrderHistoricalFileComponent implements OnInit {
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

  constructor(
    private supportService: SupportService,
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private eventService: EventService
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
    this.conditionalRenderingOfForm();
    this.getFileTypeOrderValues();

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
      this.dialogClose(false);
    } else {
      this.formValidationFalseCount++;
      this.eventService.openSnackBar("Must fill required field", "Dismiss");
    }
  }

  calculateDateAndObject() {
    const refArrObj = [
      {
        "advsiorId": 2808,
        "rmId": 2,
        "rtId": 1,
        "arnRiaDetailId": 4,
        "fromDate": "2020-01-01",
        "toDate": "2020-04-13",
        "fileTypeId": 3
      }
    ]

    // orderHistoryFileForm = this.fb.group({
    //   "selectRta": ['1', Validators.required],
    //   "selectArnRia": this.fb.group({
    //     "selectArn": [,],
    //     "selectRia": [,],
    //   }, Validators.required),
    //   "fromDate": [, Validators.required],
    //   "toDate": [, Validators.required],
    //   "asOnDate": [,],
    //   "orderingFreq": [, Validators.required],
    //   "selectFilesToOrder": this.fb.group({
    //     "cams": this.fb.group({
    //       "wbr2": [false,],
    //       "wbr2a": [false,],
    //       "wbr49Active": [false,],
    //       "wbr49Ceased": [false,],
    //       "wbr9": [false,],
    //       "wbr22": [false,]
    //     }),
    //     "karvy": this.fb.group({
    //       "mfsd201": [false,],
    //       "mfsd243Active": [false,],
    //       "mfsd231Ceased": [false,],
    //       "mfsd211": [false,],
    //       "mfsd203": [false,]
    //     }),
    //     "franklin": this.fb.group({
    //       "myTransactionsForAPeriod": [false,],
    //       "activeSip": [false,],
    //       "ceasedSip": [false,],
    //       "investorFolioDetails": [false,],
    //       "clientsWiseAumOrWhoseBalExceedsN": [false,]
    //     })
    //   }),
    // });
    // yearly
    let requestObj = [];
    if (this.orderHistoryFileForm.get('fromDate').value && this.orderHistoryFileForm.get('toDate').value) {

      let fromDateValueObj = this.orderHistoryFileForm.get('fromDate').value;
      let toDateValueObj = this.orderHistoryFileForm.get('toDate').value;

      // adding file Type ids
      if (this.orderHistoryFileForm.get('selectRta').value === '1') {
        //  for CAMS
        // yearly
        if (this.orderHistoryFileForm.get('orderingFreq').value === '1') {
          let yearDiffr = toDateValueObj.getFullYear() - fromDateValueObj.getFullYear();
          console.log("this is year Difference::", yearDiffr);
          let fromDateIter;
          let toDateIter;
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

            let fileToOrder = this.orderHistoryFileForm.get('selectFilesToOrder.cams').value;
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

                  if (fileTypeId === 6) {
                    requestObj.push({
                      advisorId: this.advisorId,
                      rmId: 2,
                      rtId,
                      arnRiaDetailId: 4,
                      fromDate: null,
                      toDate: toDateValueObj.getFullYear() + "-" + (toDateValueObj.getMonth() + 1) + "-" + toDateValueObj.getDate(),
                      fileTypeId: fileTypeId,
                      orderingFrequency: 3
                    });
                  } else if (fileTypeId !== 2 && fileTypeId !== 6) {
                    requestObj.push({
                      advisorId: this.advisorId,
                      rmId: 2,
                      rtId,
                      arnRiaDetailId: 4,
                      fromDate: typeof (fromDateIter) === 'object' ? fromDateIter.getFullYear() + "-" + (fromDateIter.getMonth() + 1) + "-" + fromDateIter.getDate() : fromDateIter,
                      toDate: typeof (toDateIter) === 'object' ? toDateIter.getFullYear() + "-" + (toDateIter.getMonth() + 1) + "-" + toDateIter.getDate() : toDateIter,
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
                        rmId: 2,
                        rtId,
                        arnRiaDetailId: 4,
                        fromDate: startDateIter.getFullYear() + '-' + (startDateIter.getMonth() + 1) + "-" + startDateIter.getDate(),
                        toDate: temp.getFullYear() + '-' + (temp.getMonth() + 1) + "-" + temp.getDate(),
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

        // monthly

        else if (this.orderHistoryFileForm.get('orderingFreq').value === '2') {
          let yearDiffr = toDateValueObj.getFullYear() - fromDateValueObj.getFullYear();
          let fromDateIter;
          let toDateIter;
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
              let fileToOrder = this.orderHistoryFileForm.get('selectFilesToOrder.cams').value;
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


                    if (fileTypeId === 6) {
                      requestObj.push({
                        advisorId: this.advisorId,
                        rmId: 2,
                        rtId,
                        arnRiaDetailId: 4,
                        fromDate: null,
                        toDate: this.currentDate,
                        fileTypeId: fileTypeId,
                        orderingFrequency: 3
                      });
                    } else {
                      requestObj.push({
                        advisorId: this.advisorId,
                        rmId: 2,
                        rtId,
                        arnRiaDetailId: 4,
                        fromDate: typeof (fromDateIter) === 'object' ? fromDateIter.getFullYear() + "-" + (fromDateIter.getMonth() + 1) + "-" + fromDateIter.getDate() : fromDateIter,
                        toDate: typeof (toDateIter) === 'object' ? toDateIter.getFullYear() + "-" + (toDateIter.getMonth() + 1) + "-" + toDateIter.getDate() : toDateIter,
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
                  toDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'month');
                }
                let fileToOrder = this.orderHistoryFileForm.get('selectFilesToOrder.cams').value;
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


                      if (fileTypeId === 6) {
                        requestObj.push({
                          advisorId: this.advisorId,
                          rmId: 2,
                          rtId,
                          arnRiaDetailId: 4,
                          fromDate: null,
                          toDate: this.currentDate,
                          fileTypeId: fileTypeId,
                          orderingFrequency: 3
                        });
                      } else {
                        requestObj.push({
                          advisorId: this.advisorId,
                          rmId: 2,
                          rtId,
                          arnRiaDetailId: 4,
                          fromDate: typeof (fromDateIter) === 'object' ? fromDateIter.getFullYear() + "-" + (fromDateIter.getMonth() + 1) + "-" + fromDateIter.getDate() : fromDateIter,
                          toDate: typeof (toDateIter) === 'object' ? toDateIter.getFullYear() + "-" + (toDateIter.getMonth() + 1) + "-" + toDateIter.getDate() : toDateIter,
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
              let monthDiff = (fromDateIter.getMonth() - toDateValueObj.getMonth()) + 1;
              console.log(fromDateIter, toDateIter, monthDiff);

              for (let index = 0; index < monthDiff; index++) {
                fromDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'day');
                toDateIter = this.addYearMonthOrDayToDate(toDateIter, 1, 'month');
                let fileToOrder = this.orderHistoryFileForm.get('selectFilesToOrder.cams').value;
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


                      if (fileTypeId === 6) {
                        requestObj.push({
                          advisorId: this.advisorId,
                          rmId: 2,
                          rtId,
                          arnRiaDetailId: 4,
                          fromDate: null,
                          toDate: this.currentDate,
                          fileTypeId: fileTypeId,
                          orderingFrequency: 3
                        });
                      } else {
                        requestObj.push({
                          advisorId: this.advisorId,
                          rmId: 2,
                          rtId,
                          arnRiaDetailId: 4,
                          fromDate: typeof (fromDateIter) === 'object' ? fromDateIter.getFullYear() + "-" + (fromDateIter.getMonth() + 1) + "-" + fromDateIter.getDate() : fromDateIter,
                          toDate: typeof (toDateIter) === 'object' ? toDateIter.getFullYear() + "-" + (toDateIter.getMonth() + 1) + "-" + toDateIter.getDate() : toDateIter,
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
        //       "wbr2": [false,],
        //       "wbr2a": [false,],
        //       "wbr49Active": [false,],
        //       "wbr49Ceased": [false,],
        //       "wbr9": [false,],
        //       "wbr22": [false,]

      } else if (this.orderHistoryFileForm.get('selectRta').value === '2') {
        // KARVY  

      } else if (this.orderHistoryFileForm.get('selectRta').value === '3') {
        //  for Franklin

      }



      // not for this 
      // WBR22, MFSD203 - Client-wise AUM Report and WBR2A

    } else if (this.orderHistoryFileForm.get('asOnDate').value) {
      let fileToOrder = this.orderHistoryFileForm.get('selectFilesToOrder.cams').value;
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
            if (fileTypeId === 6) {
              requestObj.push({
                advisorId: this.advisorId,
                rmId: 2,
                rtId,
                arnRiaDetailId: 4,
                fromDate: null,
                toDate: this.orderHistoryFileForm.get('asOnDate').value,
                fileTypeId: fileTypeId,
                orderingFrequency: 3
              });
            }
          }
        }
      }
    }
  }

  addYearMonthOrDayToDate(date, value, choice) {
    let result = new Date(date);
    switch (choice) {
      case 'day':
        result.setDate(result.getDate() + value);
        break;
      case 'month':
        result.setMonth(result.getMonth() + value);
        break;
      case 'year':
        result.setFullYear(result.getFullYear() + value);
        result.setDate(result.getDate() - 1);
        break;
    }
    return result;
  }

}