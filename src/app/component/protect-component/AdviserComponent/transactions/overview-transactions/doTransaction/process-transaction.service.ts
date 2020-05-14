import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {UtilService} from 'src/app/services/util.service';
import {ConfirmationTransactionComponent} from './confirmation-transaction/confirmation-transaction.component';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from '../../../Subscriptions/subscription-inject.service';
import {PersonalDetailsInnComponent} from '../IIN/UCC-Creation/personal-details-inn/personal-details-inn.component';
import {ContactDetailsInnComponent} from '../IIN/UCC-Creation/contact-details-inn/contact-details-inn.component';
import {BankDetailsIINComponent} from '../IIN/UCC-Creation/bank-details-iin/bank-details-iin.component';
import {NomineeDetailsIinComponent} from '../IIN/UCC-Creation/nominee-details-iin/nominee-details-iin.component';
import {FatcaDetailsInnComponent} from '../IIN/UCC-Creation/fatca-details-inn/fatca-details-inn.component';
import {OnlineTransactionService} from '../../online-transaction.service';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProcessTransactionService {
  [x: string]: any;

  countryCodeList;
  inverstorList: any;
  transactionSummary: {};
  schemeSelection: any;

  constructor(private eventService: EventService, private subInjectService: SubscriptionInject,
              private onlineTransactService: OnlineTransactionService) {
    this.transactionSummary = {};
  }

  static errorValidator(familyList) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (familyList == undefined) {
        return {isFamilyListInvalid: true};
      }
      return null;
    };

  }

  openPersonal(data) {
    const temp = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: PersonalDetailsInnComponent,
      state: 'open'
    };

    return this.eventService.changeUpperSliderState(temp);
  }

  openContact(data) {
    const temp = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: ContactDetailsInnComponent,
      state: 'open'
    };

    return this.eventService.changeUpperSliderState(temp);
  }

  openBank(data) {
    const temp = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: BankDetailsIINComponent,
      state: 'open'
    };

    return this.eventService.changeUpperSliderState(temp);
  }

  openNominee(data) {
    const temp = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: NomineeDetailsIinComponent,
      state: 'open'
    };

    return this.eventService.changeUpperSliderState(temp);
  }

  openFataca(data) {
    const temp = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: FatcaDetailsInnComponent,
      state: 'open'
    };

    return this.eventService.changeUpperSliderState(temp);
  }

  selectionList() {
    this.schemeSelection = [{
      select: 'Invest in existing scheme',
      value: 1
    }, {
      select: 'Select a new scheme',
      value: 2
    }];
  }

  getIINList() {
    this.inverstorList = [
      {
        iin: '5011102595'
      },
      {
        iin: '2011103545'
      }
    ];
    return this.inverstorList;
  }

  getDefaultLoginDetials() {

  }

  getEuinList() {

  }

  onAddTransaction(value, data) {
    this.confirmTrasaction = true;
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: 'open65',
      componentName: ConfirmationTransactionComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  calculateInstallmentAndEndDateNew(startDate, frequencyType, tenure, noOfInstallments) {
    const obj: any = {startDate, frequencyType, tenure, noOfInstallments};
    if (tenure == 3) {
      const endDate = new Date();
      endDate.setDate(31);
      endDate.setMonth(11);
      endDate.setFullYear(2099);
      obj.endDate = endDate.getTime();
    } else if (frequencyType == 'MONTHLY' && tenure == 2) {
      obj.noOfInstallments = noOfInstallments * 12;
    } else if (frequencyType == 'QUATERLY' && tenure == 2) {
      obj.noOfInstallments = noOfInstallments * 4;
    } else if ((frequencyType == 'WEEKLY' || frequencyType == 'ONCE_IN_A_WEEK') && tenure == 2) {
      obj.noOfInstallments = noOfInstallments * 52;
    } else if (frequencyType == 'YEARLY' && tenure == 2) {
      obj.noOfInstallments = noOfInstallments;
    } else if (frequencyType == 'BUSINESS_DAY' && tenure == 2) {
      obj.noOfInstallments = noOfInstallments * 365;
    } else {
      obj.noOfInstallments = noOfInstallments;
    }
    if (tenure != '3') {
      obj.endDate = this.calculateEndDateFromInstallment(startDate, frequencyType, noOfInstallments);
    }
    return obj;
  }

  calculateInstallmentAndEndDate(obj, tenure, installment) {
    if (tenure == 3) {
      const endDate = new Date();
      endDate.setDate(31);
      endDate.setMonth(11);
      endDate.setFullYear(2099);
      obj.endDate = endDate.getTime();
    } else if (obj.frequencyType == 'MONTHLY' && tenure == 2) {
      obj.noOfInstallments = installment * 12;
    } else if (obj.frequencyType == 'QUATERLY' && tenure == 2) {
      obj.noOfInstallments = installment * 4;
    } else if ((obj.frequencyType == 'WEEKLY' || obj.frequencyType == 'ONCE_IN_A_WEEK') && tenure == 2) {
      obj.noOfInstallments = installment * 52;
    } else if (obj.frequencyType == 'YEARLY' && tenure == 2) {
      obj.noOfInstallments = installment;
    } else if (obj.frequencyType == 'BUSINESS_DAY' && tenure == 2) {
      obj.noOfInstallments = installment * 365;
    } else {
      obj.noOfInstallments = installment;
    }
    if (tenure != '3') {
      obj.endDate = this.calculateEndDateFromInstallment(obj.startDate, obj.frequencyType, installment);
    }
    return obj;
  }

  calculateEndDateFromInstallment(startDate, frequencyType, noOfInstallment) {
    const endDate = new Date(startDate);
    if (frequencyType == 'MONTHLY') {
      endDate.setMonth(endDate.getMonth() + noOfInstallment);
    } else if (frequencyType == 'QUATERLY') {
      endDate.setMonth(endDate.getMonth() + noOfInstallment * 3);
    } else if ((frequencyType == 'WEEKLY' || frequencyType == 'ONCE_IN_A_WEEK')) {
      endDate.setDate(endDate.getDate() + noOfInstallment * 7);
    } else if (frequencyType == 'YEARLY') {
      endDate.setMonth(endDate.getMonth() + noOfInstallment * 12);
    } else if (frequencyType == 'BUSINESS_DAY') {
      endDate.setDate(endDate.getDate() + noOfInstallment);
    }
    return endDate.getTime();
  }

  calculateCurrentValue(nav, unit) {
    const currentValue = nav * unit;
    return currentValue;
  }

  getDateByArray = function(arr, flag) {
    let dArr = [], datesArr = [];
    const t = (flag == true) ? moment().add('days', 7) : moment().add('days', 30);
    console.log('setting t as step date', t);
    for (let i = 0; i < arr.length; i++) {
      datesArr.push(moment(t).set('date', arr[i]));
    }
    console.log('step date array', datesArr);
    datesArr = datesArr.filter((dt) => {
      return (moment(dt).isSameOrBefore(t));
    });
    console.log('step date array filtered isSameOrBefore of step date', datesArr);
    for (let i = 0; i < arr.length; i++) {
      datesArr.push(moment(t).set('date', arr[i]).add(1, 'months'));
    }
    console.log('after step datesArr adition of next month', datesArr);
    datesArr.forEach(_dt => {
      dArr.push({
        date: _dt.toDate(),
        dateToDisplay: this.formatApiDates(_dt),
        tomm: moment(_dt).add('days', 1).toDate()
      });
    });
    console.log('dArr', dArr);
    return dArr;
  };
  formatApiDates = function(_date) {
    const d = (_date) ? new Date(_date) : new Date(),
      minutes = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes(),
      hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours(),
      ampm = d.getHours() >= 12 ? 'PM' : 'AM',
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = (d.getDate() < 10) ? '0' + d.getDate() : d.getDate();
    return date + '-' + months[d.getMonth()] + '-' + d.getFullYear();
  };
  getMonth = function(mnth) {
    let mm;
    const m = parseInt(mnth);
    switch (m - 1) {
      case 0:
        mm = 'January';
        break;
      case 1:
        mm = 'February';
        break;
      case 2:
        mm = 'March';
        break;
      case 3:
        mm = 'April';
        break;
      case 4:
        mm = 'May';
        break;
      case 5:
        mm = 'June';
        break;
      case 6:
        mm = 'July';
        break;
      case 7:
        mm = 'August';
        break;
      case 8:
        mm = 'September';
        break;
      case 9:
        mm = 'October';
        break;
      case 10:
        mm = 'November';
        break;
      case 11:
        mm = 'December';
        break;
    }
    return mm;
  };

  public filterScheme(value: any, schemeList): any[] {
    const filterValue = this.normalizeValue(value + '');
    console.log('_filter value : ', value);
    console.log('_filter this.schemeList : ', schemeList);

    if (schemeList) {
      return schemeList.filter(singleScheme => this.normalizeValue(singleScheme.schemeName).includes(filterValue));
    } else {
      return [];
    }
  }

  public normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  public filterActiveMandateData(data, amount?, toDate?) {
    let selectedMandate;
    return data.filter(element => {
      if (element.statusString == 'ACCEPTED') {
        if (amount && amount > 0 && amount > element.amount) {
          return false;
        }
        if (toDate && toDate > 0 && toDate > element.toDate) {
          return false;
        }
        if (selectedMandate) {
          if (selectedMandate.amount < element.amount) {
            selectedMandate = element;
          } else if (selectedMandate.amount == element.amount) {
            if (selectedMandate.toDate < element.toDate) {
              selectedMandate = element;
            }
          }
        } else {
          selectedMandate = element;
        }
        return true;
      } else {
        return false;
      }
    });
  }

  public filterRejectedMandateData(data, amount?, toDate?) {
    let selectedMandate;
    return data.filter(element => {
      if (element.status != 3) {
        if (amount && amount > 0 && amount > element.amount) {
          return false;
        }
        if (toDate && toDate > 0 && toDate > element.toDate) {
          return false;
        }
        if (selectedMandate) {
          if (selectedMandate.amount < element.amount) {
            selectedMandate = element;
          } else if (selectedMandate.amount == element.amount) {
            if (selectedMandate.toDate < element.toDate) {
              selectedMandate = element;
            }
          }
        } else {
          selectedMandate = element;
        }
        return true;
      } else {
        return false;
      }
    });
  }

  public getMaxAmountMandate(data) {
    let selectedMandate;
    data.filter(element => {
      // if (element.statusString == 'ACCEPTED') {
      if (selectedMandate) {
        if (selectedMandate.amount < element.amount) {
          selectedMandate = element;
        } else if (selectedMandate.amount == element.amount) {
          if (selectedMandate.toDate < element.toDate) {
            selectedMandate = element;
          }
        }
      } else {
        selectedMandate = element;
      }
      return true;
      // } else {
      //   return false;
      // }
    });
    return selectedMandate;
  }

  public getMaxEndDateMandate(data) {
    let selectedMandate;
    data.filter(element => {
      if (element.statusString == 'ACCEPTED') {
        if (selectedMandate) {
          if (selectedMandate.toDate < element.toDate) {
            selectedMandate = element;
          } else if (selectedMandate.toDate == element.toDate) {
            if (selectedMandate.amount < element.amount) {
              selectedMandate = element;
            }
          }
        } else {
          selectedMandate = element;
        }
        return true;
      } else {
        return false;
      }
    });
    return selectedMandate;

  }

  filterFrequencyList(data) {
    return data.filter((element) => {
      if (element.frequency) {
        if (element.frequency == 'ONCE_IN_A_WEEK') {
          element.frequencyName = 'WEEKLY';
        } else if (element.frequency == 'BUSINESS_DAY') {
          element.frequencyName = 'BUSINESS DAY';
        } else {
          element.frequencyName = element.frequency;
        }
      }
      return element.frequency;
    });
  }

  displaySchemeName(scheme) {
    return scheme && scheme.schemeName ? scheme.schemeName : '';
  }

  getCountryCodeList() {
    if (this.countryCodeList) {
      return of(this.countryCodeList);
    } else {
      this.onlineTransactService.getCountryCodeList({});
    }
  }
}
