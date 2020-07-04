import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {calendarService} from './../calendar.service';
import {AuthService} from '../../../../../../auth-service/authService';
import {EventDialog} from './../event-dialog';
import {Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';
import {DashEvent} from '../dash-event';

@Component({
  selector: 'app-calendar-schedule',
  templateUrl: './calendar-schedule.component.html',
  styleUrls: ['./calendar-schedule.component.scss']
})
export class CalendarScheduleComponent implements OnInit {
  dialogData: any;

  viewDate: any;
  numbersOfDays: any;
  lastMonthDays: any;
  nextMonthDays: any;
  month;
  year;
  todayDate;
  formatedEvent = [];
  currentMonth;
  addLastMonthDays;
  daysArr: any = [];
  back = false;
  eventData: any = [];
  startTime;
  endTime;
  current_day = new Date();
  userInfo: any;
  currentYear: any;
  private unSubcrip: Subscription;
  E = [];
  sun: any = [];
  mon: any = [];
  tue: any = [];
  wed: any = [];
  thu: any = [];
  fri: any = [];
  sat: any = [];
  //  dashEvents:boolean = false;
  curruntDayIndex: any;
  currentMonthEvents: any = [];

  @Input() dashEvents: boolean;

  constructor(public dialog: MatDialog, private calenderService: calendarService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.viewDate = new Date();
    this.userInfo = AuthService.getUserInfo();
    this.updatecalendar();
    this.getEvent();
    this.curruntDayIndex = this.daysArr.indexOf(this.todayDate);
    // this.excessAllow = localStorage.getItem('successStoringToken')
    this.unSubcrip = this.calenderService.updateDayArr().subscribe((data: any) => {
      this.daysArr = data[0];
      this.back = data[1].back;
      this.sun = [];
      this.mon = [];
      this.tue = [];
      this.wed = [];
      this.thu = [];
      this.fri = [];
      this.sat = [];
      this.month = data[1].month;
      this.year = data[1].year;
      this.addDaysOfMomth();
      this.numbersOfDays = data[1].numbersOfDays;
      this.lastMonthDays = data[1].lastMonthDays;
      this.nextMonthDays = data[1].nextMonthDays;
      this.viewDate = data[1].nextMonthDays;
      this.currentMonthEvents = [];
      this.createDayJson();
      this.addLastMonthDays = data[1].addLastMonthDays;
      // console.log(this.daysArr, this.month, "this.daysArr....");
    });

  }


  getEvent() {
    const eventData = {
      calendarId: AuthService.getUserInfo().userName,
      userId: AuthService.getUserInfo().advisorId
    };
    this.calenderService.getEvent(eventData).subscribe((data) => {

      if (data != undefined) {

        this.eventData = data;

        // console.log(data, "events calender", this.eventData);
        // this.formatedEvent = [];

        for (const e of this.eventData) {
          if (e.rrule != null) {
            e.isRe = e.rrule.FREQ;
            if (e.rrule.UNTIL) {
              this.E = [];
              for (let i = 0; i < e.rrule.UNTIL.length; i++) {
                this.E.push(e.rrule.UNTIL.charAt(i));
              }
              const y = this.E[0] + this.E[1] + this.E[2] + this.E[3];
              const m = this.E[4] + this.E[5];
              const d = this.E[6] + this.E[7];
              switch (e.rrule.FREQ) {
                case 'DAILY':
                  e.reUntil = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                  break;
                case 'WEEKLY':
                  break;
                default:
                  break;
              }
            } else {
              if (e.start.date != null) {
                e.reStart = this.startDateFormate(e.start.date);
                e.reUntil = new Date(this.startDateFormate(e.start.date).setFullYear(this.startDateFormate(e.start.date).getFullYear() + 2));
              } else if (e.rrule.COUNT) {
                e.reStart = new Date(e.start.dateTime);
                e.reUntil = new Date(new Date(e.start.dateTime).setDate(new Date(e.start.dateTime).getDate() + parseInt(e.rrule.COUNT) - 1));
              } else {
                e.reStart = new Date(e.start.dateTime);
                e.reUntil = new Date(new Date(e.start.dateTime).setFullYear(new Date(e.start.dateTime).getFullYear() + 2));
              }
            }
          } else {
            e.isRe = undefined;
            if (e.start) {
              e.reStart = new Date(e.start.dateTime);
              e.reUntil = new Date(e.end.dateTime);
            }
          }
          if (e.start) {
            e.day = this.formateDate(!e.start.dateTime ? new Date(e.created) : new Date(e.start.dateTime));
            e.month = this.formateMonth(!e.start.dateTime ? new Date(e.created) : new Date(e.start.dateTime));
            e.year = this.formateYear(!e.start.dateTime ? new Date(e.created) : new Date(e.start.dateTime));
            e.startTime = this.formateTime(!e.start.dateTime ? new Date(e.created) : new Date(e.start.dateTime));
            e.endTime = this.formateTime(!e.end.dateTime ? new Date(e.created) : new Date(e.end.dateTime));
            this.formatedEvent.push(e);
            // console.log(this.formatedEvent,"formatedEvent calender1",);
          }
        }
        // console.log("events recurring", this.formatedEvent);
        this.createDayJson();
      }
    });

  }


  getDay(year, month, day) {
    let d = new Date(year, month, day);
    return this.datePipe.transform(d, 'EEE')
  }

  validateMonthDays(eDays, cDate, startDate, interval) {
    if (eDays) {
      let d = new Date(cDate);
      let dayNum = parseInt(eDays.charAt(0));
      let monthDay = eDays.charAt(1) + eDays.charAt(2);

      switch (monthDay) {
        case "SU":
          return new Date(this.sun[dayNum - 1]).getTime() == new Date(d).getTime() ? false : true;
        case "MO":
          return new Date(this.mon[dayNum - 1]).getTime() == new Date(d).getTime() ? false : true;
        case "TU":
          return new Date(this.tue[dayNum - 1]).getTime() == new Date(d).getTime() ? false : true;
        case "WE":
          return new Date(this.wed[dayNum - 1]).getTime() == new Date(d).getTime() ? false : true;
        case "TH":
          return new Date(this.thu[dayNum - 1]).getTime() == new Date(d).getTime() ? false : true;
        case "FR":
          return new Date(this.fri[dayNum - 1]).getTime() == new Date(d).getTime() ? false : true;
        case "SA":
          return new Date(this.sat[dayNum - 1]).getTime() == new Date(d).getTime() ? false : true;
      }
    }
    else {
      if (this.formateDate(cDate) == this.formateDate(startDate)) {
        return false;
      }
      else {
        return true;
      }
    }
  }

  validateYearly(startDate,day, month){
    let d = new Date(startDate).getDate();
    let m = new Date(startDate).getMonth();
    if(d == day && m == month){
      return false;
    }
    else{
      return true;
    }
   }

  createDayJson() {
    for (let i = 1; i < this.numbersOfDays; i++) {
      const dayArr = {
        date: null,
        events: []
      };
      for (let e = 0; e < this.formatedEvent.length; e++) {
        const calMonth = new Date(this.year, this.month, this.formateDate(this.current_day));
        // console.log(this.formateMonth(calMonth),this.formatedEvent[e].month, this.formateYear(calMonth));

        if(this.formatedEvent[e].day== i && this.formatedEvent[e].month == this.formateMonth(calMonth) && this.formatedEvent[e].year ==  this.formateYear(calMonth)||(this.formatedEvent[e].isRe && this.dateTimeEvent(this.year,this.month,i) > this.dateTimeEvent(null,null,this.formatedEvent[e].reStart) && this.dateTimeEvent(this.year,this.month,i) < this.dateTimeEvent(null,null,this.formatedEvent[e].reUntil)) && (this.formatedEvent[e].isRe == 'DAILY' || (this.formatedEvent[e].isRe == 'WEEKLY' && !this.validateWeekDays(this.formatedEvent[e].rrule.BYDAY, this.getDay(this.year,this.month,i),this.formatedEvent[e].rrule.INTERVAL)) || (this.formatedEvent[e].isRe == 'MONTHLY' && !this.validateMonthDays(this.formatedEvent[e].rrule.BYDAY, this.dateTimeEvent(this.year,this.month,i), this.formatedEvent[e].start.date,this.formatedEvent[e].rrule.INTERVAL)) || (this.formatedEvent[e].isRe == 'YEARLY' && !this.validateYearly(this.formatedEvent[e].start.date,i,this.month)))){
            dayArr.date = new Date(this.formatedEvent[e].year, this.month, i);
            dayArr.events.push(this.formatedEvent[e]);
          }
        
        // console.log(this.currentMonthEvents, "this.currentMonthEvents");
      }
      if (dayArr.date != null) {
        this.currentMonthEvents.push(dayArr);
      }
    }
  }

  formateDate(date) {
    const dd = new Date(date).getDate();

    return dd;
  }

  formateMonth(date) {
    const mm = new Date(date).getMonth() + 1; // January is 0!
    return mm;
  }

  formateYear(date) {
    const yyyy = new Date(date).getFullYear();
    return yyyy;
  }

  formateTime(date) {

    let hh = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    let mm = date.getMinutes();
    const amPm = date.getHours() > 12 ? 'pm' : 'am';
    hh = hh < 10 ? '0' + hh : hh;
    mm = mm < 10 ? '0' + mm : mm;
    return hh + ':' + mm + amPm + ' ';
  }

  addDaysOfMomth() {
    let d: any;
    let m;
    for (let i = 1; i < this.numbersOfDays; i++) {
      // if(this.back){
      //   m = this.month == 0?11:this.month-1;
      // }
      // else{
      //   m = this.month == 0?1:this.month;
      // }
      d = new Date(this.year, this.month, i);
      switch (d.getDay()) {
        case 0:
          this.sun.push(d);
          break;
        case 1:
          this.mon.push(d);
          break;
        case 2:
          this.tue.push(d);
          break;
        case 3:
          this.wed.push(d);
          break;
        case 4:
          this.thu.push(d);
          break;
        case 5:
          this.fri.push(d);
          break;
        case 6:
          this.sat.push(d);
          break;
      }
    }
  }

  updatecalendar() {
    this.month = this.viewDate.getMonth();
    this.year = this.viewDate.getFullYear();
    this.todayDate = this.viewDate.getDate();
    // this.numbersOfDays = this.daysInMonth(this.month, this.year)
    this.numbersOfDays = this.getDaysCount(this.month, this.year, 'currentMonthDays');
    this.lastMonthDays = this.getDaysCount(this.month, this.year, 'lastMonthDays');
    this.nextMonthDays = this.getDaysCount(this.month, this.year, 'nextMonthDays');
    const firstDay = (new Date(this.year, this.month)).getDay();


    for (let i = 1; i <= this.numbersOfDays; i++) {
      this.daysArr.push(i);
    }

    if (firstDay == 0) {
      this.addLastMonthDays = 6;
    } else {
      this.addLastMonthDays = firstDay - 1;
    }

    for (let d = 1; d <= this.addLastMonthDays; d++) {
      this.daysArr.unshift(this.lastMonthDays);
      this.lastMonthDays -= 1;
    }

    for (let fd = 1; this.daysArr.length <= 41; fd++) {
      this.daysArr.push(fd);
    }
    this.currentMonthEvents = [];
    this.createDayJson();
  }

  getDaysCount(month: number, year: number, ch: string): any {
    switch (ch) {
      case 'currentMonthDays':
        return 32 - new Date(year, month, 32).getDate();

      case 'lastMonthDays':
        return 32 - new Date(year - 1, month - 1, 32).getDate();

      case 'nextMonthDays':
        return 32 - new Date(year + 1, month + 1, 32).getDate();
    }

  }

  startDateFormate(date) {
    this.E = [];
    for (let i = 0; i < date.length; i++) {
      if (date.charAt(i) != '-') {
        this.E.push(date.charAt(i));
      }
    }
    const y = this.E[0] + this.E[1] + this.E[2] + this.E[3];
    const m = this.E[4] + this.E[5];
    const d = this.E[6] + this.E[7];

    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  }

  dateTimeEvent(year, month, date) {
    let dateBe;
    if (year != null) {
      dateBe = new Date(year, month, date);
    } else {
      dateBe = new Date(date);
    }
    return new Date(dateBe).getTime();
  }

  editEvent(eventData) {
    let event: any;
    if (eventData != null) {
      event = eventData;
    } else {
      event = {
        eventId: '',
        summary: '',
        location: '',
        title: '',
        description: '',
        start: {
          dateTime: null,
          timeZone: null
        },
        end: {
          dateTime: null,
          timeZone: null
        },
        recurrence: '',
        attendee: '',
        attendeesList: ''
      };
    }

    this.openDialog(event, null);
  }

  openDialog(eventData, date): void {
    let h = '673px';
    let component;
    if (date != null) {
      eventData = {
        events: eventData,
        calDate: date
      };
    }

    if (eventData.id || date != null) {
      h = 'auto';
    }

    if (this.dashEvents) {
      component = DashEvent;
    } else {
      component = EventDialog;
    }
    const dialogRef = this.dialog.open(component, {
      width: '576px',
      height: h,
      data: eventData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != 'delete' && !result.openEvent) {
        this.dialogData = {
          calendarId: AuthService.getUserInfo().userName,
          userId: AuthService.getUserInfo().advisorId,
          eventId: result.eventId,
          summary: result.title,
          location: result.location,
          description: result.description,
          start: {
            dateTime: '',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          end: {
            dateTime: '',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          recurrence: [
            'RRULE:FREQ=DAILY;COUNT=2'
          ],
          attendees: result.attendeesList
        };


        this.startTime = result.startTime;
        this.endTime = result.endTime;
        this.dialogData.start.dateTime = this.googleDate(result.startDateTime._d == undefined ? new Date(result.startDateTime) : result.startDateTime._d, 'start');
        this.dialogData.end.dateTime = this.googleDate(result.endDateTime._d == undefined ? new Date(result.endDateTime) : result.endDateTime._d, 'end');

        if (this.dialogData.eventId != null) {
          this.calenderService.updateEvent(this.dialogData).subscribe((data) => {
            this.getEvent();
          });
        } else {
          this.calenderService.addEvent(this.dialogData).subscribe((data) => {
            this.getEvent();
          });
        }
      } else {
        if (result) {
          this.openDialog(result.event, null);
        }
      }
      if (result == 'delete') {
        this.getEvent();
      }
    });
  }

  googleDate(date, timeMood) {

    this.current_day = new Date();
    let current_date = date.getDate();
    let current_month = date.getMonth() + 1;
    const current_year = date.getFullYear();
    let current_hrs: any;
    let current_mins: any;
    let start_hrs_mins;
    let end_hrs_mins;
    if (this.startTime == '' || this.endTime == '') {
      current_hrs = this.current_day.getHours();
      current_mins = this.current_day.getMinutes();
      current_hrs = current_hrs < 10 ? '0' + current_hrs : current_hrs;
      current_mins = current_mins < 10 ? '0' + current_mins : current_mins;
    } else {
      start_hrs_mins = this.startTime;
      end_hrs_mins = this.endTime;
    }
    let current_secs: any = this.current_day.getSeconds();

    // Add 0 before date, month, hrs, mins or secs if they are less than 0
    current_date = current_date < 10 ? '0' + current_date : current_date;
    current_month = current_month < 10 ? '0' + current_month : current_month;

    current_secs = current_secs < 10 ? '0' + current_secs : current_secs;

    // Current datetime
    // String such as 2016-07-16T19:20:30
    if (timeMood == 'start' && this.startTime != '') {
      return current_year + '-' + current_month + '-' + current_date + 'T' + start_hrs_mins + ':' + current_secs;
    } else if (timeMood == 'end' && this.endTime != '') {
      return current_year + '-' + current_month + '-' + current_date + 'T' + end_hrs_mins + ':' + current_secs;
    } else {
      return current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs;
    }
  }


  nextMonth() {
    this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() + 1));
    this.updatecalendar();
  }

  lastMonth() {
    this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() - 1));
    this.updatecalendar();
  }

  validateWeekDays(eDays, day, interval) {
    this.E = [];
    let d;
    eDays += ',';
    if (this.E.length <= 0) {
      for (let i = 0; i < eDays.length; i++) {
        if (eDays.charAt(i) != ",") {
          if (d) {
            d += eDays.charAt(i);
          } else {
            d = eDays.charAt(i);
          }
        }
        else {
          switch (d) {
            case "SU":
              // return day == 'Sun'?false:true;
              this.E.push('Sun');
              break;
            case "MO":
              // return day == 'Mon'?false:true;
              this.E.push('Mon');
              break;
            case "TU":
              // return day == 'Tus'?false:true;
              this.E.push('Tue');
              break;
            case "WE":
              // return day == 'Wed'?false:true;
              this.E.push('Wed');
              break;
            case "TH":
              // return day == 'Thu'?false:true;
              this.E.push('Thu');
              break;
            case "FR":
              // return day == 'Fri'?false:true;
              this.E.push('Fri');
              break;
            case "SA":
              // return day == 'Sat'?false:true;
              this.E.push('Sat');
              break;
          }

          d = '';
        }
      }
    }

    return this.E.includes(day) ? false : true;

  }
}
