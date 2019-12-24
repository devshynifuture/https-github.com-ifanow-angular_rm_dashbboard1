import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalenderComponent implements OnInit {
  viewDate: any;
  numbersOfDays: any;
  lastMonthDays: any;
  nextMonthDays: any;
  updateDate: any;
  month;
  year;
  todayDate;
  dialogData: any
  currentMonth;
  addLastMonthDays;
  daysArr = [];
  formatedEvent = []
  eventData:any;
  eventTitle;
  eventDescription;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.currentMonth = new Date().getMonth();
    this.viewDate = new Date();
    this.updateCalender();
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone, "test date");
    this.eventData = [{
      "eventId":"02megf77o1dqjkhevj9udlfh25",
      "userId":2808,
      "fileId":12345,
      "calendarId":"chetan@futurewise.co.in",
      "summary":"doom event",
        "location":"800 Howard St., San Francisco, CA 94103",
        "title":"it is successful",
        "description":"it is successful",
        "start":{
          "dateTime":"2019-12-23T05:00:00-07:00",
          "timeZone":"America/Los_Angeles"
        },
        "end":{
          "dateTime":"2019-12-23T06:00:00-07:00",
          "timeZone":"America/Los_Angeles"
        },
        "timeZone":"America/Los_Angeles",
        "recurrence":["RRULE:FREQ=DAILY;COUNT=2"],
        "attendeeList":["chetan@futurewise.co.in","chetan@futurewise.co.in"]
    }]

    this.formatedEvent = [];
    for(let e of this.eventData){
      e["day"] = this.formateDate(new Date(e.start.dateTime));
      e["month"] = this.formateMonth(new Date(e.start.dateTime));
      e["year"] = this.formateYear(new Date(e.start.dateTime));
      e["time"] = this.formateTime(new Date(e.start.dateTime));
     
      this.formatedEvent.push(e);
    }
    console.log(this.formatedEvent, "this.eventData 12345", this.viewDate.toISOString());
  }

  updateCalender() {
    this.month = this.viewDate.getMonth();
    this.year = this.viewDate.getFullYear();
    this.todayDate = this.viewDate.getDate();
    this.numbersOfDays = this.daysInMonth(this.month, this.year)
    this.lastMonthDays = this.daysInLastMonth(this.month, this.year)
    this.nextMonthDays = this.daysInNextMonth(this.month, this.year)
    // console.log(this.numbersOfDays, this.lastMonthDays, this.nextMonthDays, "this.numbersOfDays");
    let firstDay = (new Date(this.year, this.month)).getDay();
    // console.log(firstDay, "firstDay", this.month);

    for (let i = 1; i <= this.numbersOfDays; i++) {
      this.daysArr.push(i);
    }

    if (firstDay == 0) {
      this.addLastMonthDays = 6;
    }
    else {
      this.addLastMonthDays = firstDay - 1;
    }

    for (let d = 1; d <= this.addLastMonthDays; d++) {
      this.daysArr.unshift(this.lastMonthDays);
      this.lastMonthDays -= 1;
    }

    for (let fd = 1; this.daysArr.length <= 41; fd++) {
      this.daysArr.push(fd);
    }

    console.log(this.daysArr, "daysArr 123");
  }

  daysInMonth(month, year) {
    return 32 - new Date(year, month, 32).getDate();
  }

  daysInLastMonth(month, year) {
    return 32 - new Date(year - 1, month - 1, 32).getDate();
  }

  daysInNextMonth(month, year) {
    return 32 - new Date(year + 1, month + 1, 32).getDate();
  }

  persentMonth(){
    this.viewDate = new Date();
  }

  nextMonth() {
    this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() + 1))
    this.daysArr = [];
    this.updateCalender();

  }

  lastMonth() {
    this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() - 1))
    this.daysArr = [];
    this.updateCalender();
  }

  formateDate(date){
    var dd = date.getDate();
   
    return dd;
  }

  formateMonth(date){
    var mm = date.getMonth()+1; //January is 0!
    return mm;
  }

  formateYear(date){
    var yyyy = date.getFullYear();
    return yyyy;
  }

  formateTime(date){
    var hh = date.getUTCHours();
    var mm = date.getUTCMinutes();
    return hh + ":" + mm;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EventDialog, {
      width: '30%',
      data: this.eventData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(this.googleDate(result.startDateTime._d) , 'The dialog was qqqq123');

      this.dialogData = {
        "eventId": "v8o6srjpr3kqa50a0cu2f2abls",
        "userId": 2727,
        "fileId": 12345,
        "calendarId": "gaurav@futurewise.co.in",
        "summary": "new event",
        "location": "800 Howard St., San Francisco, CA 94103",
        "title": "it is successful",
        "description": "it is successful",
        "startDateTime": this.googleDate(result.startDateTime._d),
        "timeZone": "America/Los_Angeles",
        "endDateTime": this.googleDate(result.endDateTime._d),
        "recurrence": ["RRULE:FREQ=DAILY;COUNT=2"],
        "attendees": ["chetan@futurewise.co.in", "chetan@futurewise.co.in"]
      }
      console.log(new Date(this.dialogData.startDateTime), 'The dialog was closed777');
      // this.dialogData.startDateTime = new Date(this.dialogData.startDateTime).setHours(13,47,22);
      this.dialogData.startDateTime = this.googleDate(result.startDateTime._d);
      this.dialogData.endDateTime = this.googleDate(result.endDateTime._d);
      console.log(this.dialogData, 'The dialog was closed');
      console.log(this.googleDate(result.startDateTime._d) , 'The dialog was closed123');
    });
  }

googleDate(date){
  var current_day = new Date();
  var current_date = date.getDate();
  var current_month = date.getMonth() + 1;
  var current_year = date.getFullYear();
  var current_hrs = current_day.getHours();
  var current_mins = current_day.getMinutes();
  var current_secs = current_day.getSeconds();
   
  // Add 0 before date, month, hrs, mins or secs if they are less than 0
  current_date = current_date < 10 ? '0' + current_date : current_date;
  current_month = current_month < 10 ? '0' + current_month : current_month;
  console.log(current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs, "hi date");
  
  // Current datetime
  // String such as 2016-07-16T19:20:30
  return current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs;
  }
}

@Component({
  selector: 'event-dialog',
  templateUrl: './event-dialog.html',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class EventDialog implements OnInit{
  
  startDate;
  eventForm: FormGroup;
  eventData:any;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      console.log(data, "this.eventData 111");
      this.eventData = data;
  }

  ngOnInit(){
    this.eventForm = this.fb.group({
      eventId: new FormControl("v8o6srjpr3kqa50a0cu2f2abls"),
      userId: new FormControl(2727),
      fileId: new FormControl(12345),
      calendarId: new FormControl("gaurav@futurewise.co.in"),
      summary: new FormControl("new event"),
      location: new FormControl("800 Howard St., San Francisco, CA 94103"),
      title: new FormControl("it is successful"),
      description: new FormControl("it is successful"),
      startDateTime: new FormControl(new Date()),
      timeZone: new FormControl("America/Los_Angeles"),
      endDateTime: new FormControl(new Date()),
      recurrence: new FormControl("RRULE:FREQ=DAILY;COUNT=2"),
      attendees: new FormControl(["chetan@futurewise.co.in", "chetan@futurewise.co.in"])
    });
  }

  setTime(event, timeMood){
    console.log(event, timeMood, "hahah");
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  

}

