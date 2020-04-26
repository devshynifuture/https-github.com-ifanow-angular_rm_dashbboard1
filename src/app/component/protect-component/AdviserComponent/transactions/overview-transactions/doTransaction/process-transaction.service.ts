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

@Injectable({
  providedIn: 'root'
})

export class ProcessTransactionService {
  [x: string]: any;

  inverstorList: any;
  transactionSummary: {};
  schemeSelection: any;

  constructor(private eventService: EventService, private subInjectService: SubscriptionInject,) {
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
    let temp = {
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
    let temp = {
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
    let temp = {
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
    let temp = {
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
    let temp = {
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

  checkInstallments(obj, tenure, installment) {
    if (tenure == 3) {
      const endDate = new Date();
      endDate.setDate(31);
      endDate.setMonth(11);
      endDate.setFullYear(2099);
      obj.endDate = endDate.getTime();
    } else if (obj.frequencyType == 'MONTHLY' && tenure == 2) {
      obj.noOfInstallments = obj.noOfInstallments * 12;
    } else if (obj.frequencyType == 'QUATERLY' && tenure == 2) {
      obj.noOfInstallments = obj.noOfInstallments * 4;
    } else if (obj.frequencyType == 'WEEKLY' && tenure == 2) {
      obj.noOfInstallments = obj.noOfInstallments * 52;
    } else {
      obj.noOfInstallments = installment;
    }
    return obj;
  }

  calculateCurrentValue(nav, unit) {
    let currentValue = nav * unit;
    return currentValue;
  }

  getDateByArray = function(arr, flag) {
    let dArr = [], datesArr = [];
    let t = (flag == true) ? moment().add('days', 7) : moment().add('days', 30);
    console.log('setting t as step date', t);
    for (let i = 0; i < arr.length; i++) {
      datesArr.push(moment(t).set('date', arr[i]));
    }
    console.log('step date array', datesArr);
    datesArr = datesArr.filter(function(dt) {
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
    let d = (_date) ? new Date(_date) : new Date(),
      minutes = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes(),
      hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours(),
      ampm = d.getHours() >= 12 ? 'PM' : 'AM',
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let date = (d.getDate() < 10) ? '0' + d.getDate() : d.getDate();
    return date + '-' + months[d.getMonth()] + '-' + d.getFullYear();
  };
  getMonth = function(mnth) {
    let mm;
    let m = parseInt(mnth);
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

}
