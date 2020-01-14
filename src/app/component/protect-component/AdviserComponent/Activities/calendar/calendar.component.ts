import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { variable } from '@angular/compiler/src/output/output_ast';
import { calendarService } from './calendar.service';
import { AuthService } from '../../../../../auth-service/authService';


export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class calendarComponent implements OnInit {
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
  startTime;
  endTime;
  current_day = new Date();
  userInfo:any;
  constructor(public dialog: MatDialog, private canlenderService : calendarService) { }

  ngOnInit() {
    this.currentMonth = new Date().getMonth();
    this.viewDate = new Date();
    this.userInfo = AuthService.getUserInfo()
    this.updatecalendar();
    this.getEvent();
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone, localStorage.getItem('userInfo'), "test date");

    // demo get data calendar
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
          "dateTime":"2020-01-03T05:00:00-07:00",
          "timeZone":"America/Los_Angeles"
        },
        "end":{
          "dateTime":"2020-01-03T06:00:00-07:00",
          "timeZone":"America/Los_Angeles"
        },
        "timeZone":"America/Los_Angeles",
        "recurrence":["RRULE:FREQ=DAILY;COUNT=2"],
        "attendeeList":["chetan@futurewise.co.in","chetan@futurewise.co.in"]
    }]
    // demo get data calendar

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

  getEvent(){
    let eventData = {
      "calendarId": this.userInfo.emailId,
      "userId": this.userInfo.userId
    }
    this.canlenderService.getEvent(eventData).subscribe((data)=>{
      console.log(data, "event data");
    });
  }

  updatecalendar() {
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
    this.updatecalendar();

  }

  lastMonth() {
    this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() - 1))
    this.daysArr = [];
    this.updatecalendar();
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
      width: '50%',
      data: this.eventData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result, "result 123");
      
      this.dialogData = 
      {
        "summary": result.summary,
        "location": result.location,
        "description": result.description,
        "start": {
        "dateTime": "",
        "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        "end": {
        "dateTime": "",
        "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        "recurrence": [
        "RRULE:FREQ=DAILY;COUNT=2"
        ],
        "attendees":result.attendeesList
      }

      // summary: ["new event",[Validators.required]],
      // location: ["800 Howard St., San Francisco, CA 94103"],
      // title: ["it is successful",[Validators.required]],
      
      // {
        //   "eventId": "v8o6srjpr3kqa50a0cu2f2abls",
        //   "userId": 2727,
        //   "fileId": 12345,
      //   "calendarId": "gaurav@futurewise.co.in",
      //   "summary": "new event",
      //   "location": "800 Howard St., San Francisco, CA 94103",
      //   "title": "it is successful",
      //   "description": "it is successful",
      //   "startDateTime": "",
      //   "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
      //   "endDateTime": "",
      //   "recurrence": ["RRULE:FREQ=DAILY;COUNT=2"],
      //   "attendees": result.attendeesList
      // }
      this.startTime = result.startTime;
      this.endTime = result.endTime;
      this.dialogData.start.dateTime = this.googleDate(result.startDateTime._d == undefined? this.current_day : result.startDateTime._d , "start");
      this.dialogData.end.dateTime = this.googleDate(result.endDateTime._d == undefined? this.current_day : result.endDateTime._d, "end");
      console.log(this.dialogData, 'The dialog was closed');
    });
  }

googleDate(date, timeMood){
  console.log(date, "date 123");
  
  this.current_day = new Date();
  var current_date = date.getDate();
  var current_month = date.getMonth() + 1;
  var current_year = date.getFullYear();
  if(this.startTime == "" || this.endTime == ""){
    var current_hrs:any = this.current_day.getHours();
    var current_mins:any = this.current_day.getMinutes();
    current_hrs = current_hrs < 10 ? '0' + current_hrs : current_hrs;
    current_mins = current_mins < 10 ? '0' + current_mins : current_mins;
  }
  else{
    var start_hrs_mins = this.startTime;
    var end_hrs_mins = this.endTime;
  }
  var current_secs:any = this.current_day.getSeconds();
   
  // Add 0 before date, month, hrs, mins or secs if they are less than 0
  current_date = current_date < 10 ? '0' + current_date : current_date;
  current_month = current_month < 10 ? '0' + current_month : current_month;
  
  current_secs = current_secs < 10 ? '0' + current_secs : current_secs;
  console.log(current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs, "hi date");
  
  // Current datetime
  // String such as 2016-07-16T19:20:30
  if(timeMood == "start" && this.startTime != ""){
    return current_year + '-' + current_month + '-' + current_date + 'T' + start_hrs_mins + ':' + current_secs;
  }
  else if(timeMood == "end" && this.endTime != ""){
    return current_year + '-' + current_month + '-' + current_date + 'T' + end_hrs_mins + ':' + current_secs;
  }
  else{
    return current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs;
  }
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
  attendeesArr = [];
  startDate = new Date();
  startTime="";
  endTime="";
  eventForm: FormGroup;
  showTime:boolean = false;
  eventData:any;
  timeArr = ["01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00","06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:20","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30","24:00"]
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialog>,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      console.log(data, "this.eventData 111");
      this.eventData = data;
  }

  ngOnInit(){
    
    this.eventForm = this.fb.group({
      // eventId: ["02megf77o1dqjkhevj9udlfh25",[Validators.required]],
      // userId: [2727,[Validators.required]],
      // fileId: [12345,[Validators.required]],
      // calendarId:["gaurav@futurewise.co.in",[Validators.required]],
      summary: ["",[Validators.required]],
      location: ["800 Howard St., San Francisco, CA 94103"],
      title: ["it is successful",[Validators.required]],
      description: ["it is successful"],
      startDateTime: [new Date(),[Validators.required]],
      endDateTime: [new Date(),[Validators.required]],
      recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
      attendee:  ["",[Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      attendeesList:  [this.attendeesArr],
      startTime:[this.startTime],
      endTime: [this.endTime]
    });

    console.log(this.eventForm.get("attendee").value == "", "see value");
    

  }

  addAttendee(){
    this.attendeesArr.push({"email":this.eventForm.value.attendee});
    this.eventForm.get("attendee").setValue("");
   
  }

  removeMember(member){
    // this.attendeesArr.splice(this.attendeesArr.indexOf(member.email), 1)
    this.attendeesArr = this.attendeesArr.filter((x)=> x.email != member.email);
  }

  addTime(){
    this.showTime = true;
    this.eventForm.get("startTime").setValue("09:00"); 
    this.eventForm.get("endTime").setValue("10:00"); 
  }

  setTime(mood){
    if(mood == "start" && this.eventForm.value.endTime < this.eventForm.value.startTime){
      console.log("hi");
      
      console.log(this.eventForm.value.startDateTime._d, "this.eventForm.value.startDateTime_d 123");
      
      this.eventForm.get("endTime").setValue(this.timeArr[this.timeArr.indexOf(this.eventForm.value.startTime)+2]); 
      // this.eventForm.get("endDateTime").setValue(this.eventForm.value.startDateTime._d); 
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

