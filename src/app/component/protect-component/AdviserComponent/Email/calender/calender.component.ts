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

  eventTitle;
  eventDescription;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.currentMonth = new Date().getMonth();
    this.viewDate = new Date();
    this.updateCalender();
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

  openDialog(): void {
    const dialogRef = this.dialog.open(EventDialog, {
      width: '30%',
      data: { name: this.eventTitle, animal: this.eventDescription }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogData = {
        "eventId": "v8o6srjpr3kqa50a0cu2f2abls",
        "userId": 2727,
        "fileId": 12345,
        "calendarId": "gaurav@futurewise.co.in",
        "summary": "new event",
        "location": "800 Howard St., San Francisco, CA 94103",
        "title": "it is successful",
        "description": "it is successful",
        "startDateTime": result.startDateTime._d,
        "timeZone": "America/Los_Angeles",
        "endDateTime": "2019-12-18T17:00:00-07:00",
        "recurrence": ["RRULE:FREQ=DAILY;COUNT=2"],
        "attendees": ["chetan@futurewise.co.in", "chetan@futurewise.co.in"]
      }
      console.log(this.dialogData, 'The dialog was closed');
      console.log(result.startDateTime._d  , 'The dialog was closed123');
    });
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
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      
    // this.dialogData = {
    //   "eventId": "v8o6srjpr3kqa50a0cu2f2abls",
    //   "userId": 2727,
    //   "fileId": 12345,
    //   "calendarId": "gaurav@futurewise.co.in",
    //   "summary": "new event",
    //   "location": "800 Howard St., San Francisco, CA 94103",
    //   "title": "it is successful",
    //   "description": "it is successful",
    //   "startDateTime": "",
    //   "timeZone": "America/Los_Angeles",
    //   "endDateTime": "2019-12-18T17:00:00-07:00",
    //   "recurrence": ["RRULE:FREQ=DAILY;COUNT=2"],
    //   "attendees": ["chetan@futurewise.co.in", "chetan@futurewise.co.in"]
    // }
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


  onNoClick(): void {
    this.dialogRef.close();
  }

  

}

