import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MAT_DATE_FORMATS, MatBottomSheet} from '@angular/material';
import {MY_FORMATS2} from 'src/app/constants/date-format.constant';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {calendarService} from './calendar.service';
import {AuthService} from '../../../../../auth-service/authService';
import { BottomSheetComponent } from '../../../customers/component/common-component/bottom-sheet/bottom-sheet.component';


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
export class CalendarComponent implements OnInit {
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
  eventData:any = [];
  eventTitle;
  eventDescription;
  startTime;
  endTime;
  current_day = new Date();
  userInfo:any;
  currentYear:any;
  constructor(public dialog: MatDialog, private calenderService : calendarService) { }

  ngOnInit() {
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.viewDate = new Date();
    this.userInfo = AuthService.getUserInfo()
    this.updatecalendar();
    this.getEvent();
    this.curruntDayIndex = this.daysArr.indexOf(this.todayDate);

    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone, localStorage.getItem('userInfo'), this.curruntDayIndex, this.currentMonth, this.month, this.year, this.currentYear, "test date");

  }

  getEvent(){
    let eventData = {
      "calendarId": "gaurav@futurewise.co.in",
      "userId": 2727
    }
    this.calenderService.getEvent(eventData).subscribe((data)=>{
      if(data != undefined){

        this.eventData = data;

        console.log(this.eventData, data, "event data");
        this.formatedEvent = [];
        for(let e of this.eventData){
          e["day"] = this.formateDate(new Date(e.start.dateTime == null? e.created : e.start.dateTime));
          e["month"] = this.formateMonth(new Date(e.start.dateTime == null ? e.created : e.start.dateTime));
          e["year"] = this.formateYear(new Date(e.start.dateTime == null ? e.created : e.start.dateTime));
          e["startTime"] = this.formateTime(new Date(e.start.dateTime == null ? e.created : e.start.dateTime));
          e["endTime"] = this.formateTime(new Date(e.end.dateTime == null? e.created : e.end.dateTime));

          this.formatedEvent.push(e);
        }
        console.log(this.formatedEvent, "this.eventData 12345");
      }
    });
  }

  getDaysCount(month: number, year: number, ch: string): any{
    switch(ch){
      case "currentMonthDays": return 32 - new Date(year, month, 32).getDate();

      case "lastMonthDays": return 32 - new Date(year - 1, month - 1, 32).getDate();

      case "nextMonthDays": return 32 - new Date(year + 1, month + 1, 32).getDate();
    }

  }

  curruntDayIndex:any;

  updatecalendar() {
    this.month = this.viewDate.getMonth();
    this.year = this.viewDate.getFullYear();
    this.todayDate = this.viewDate.getDate();
    // this.numbersOfDays = this.daysInMonth(this.month, this.year)
    this.numbersOfDays = this.getDaysCount(this.month, this.year, "currentMonthDays");
    this.lastMonthDays = this.getDaysCount(this.month, this.year, "lastMonthDays");
    this.nextMonthDays = this.getDaysCount(this.month, this.year, "nextMonthDays");
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



    console.log(this.daysArr, this.addLastMonthDays, "daysArr 123");
  }

  persentMonth(){
    this.viewDate = new Date();
  }

  nextMonth() {
    this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() + 1))
    this.daysArr = [];
    // if(this.currentMonth != this.month){
    //   this.curruntDayIndex = 41;
    // }else{
    //   this.curruntDayIndex = this.daysArr.indexOf(this.todayDate);
    // }
    this.updatecalendar();
    console.log( this.curruntDayIndex, this.currentMonth, this.month, this.year, this.currentYear, "test date");
  }

  lastMonth() {
    this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() - 1))
    this.daysArr = [];
    this.updatecalendar();
    console.log( this.curruntDayIndex, this.currentMonth, this.month, this.year, this.currentYear, "test date");
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

    var hh = date.getHours() > 12? date.getHours() - 12 : date.getHours();
    var mm = date.getMinutes();
    var amPm = date.getHours() > 12? "pm" : "am";
    hh = hh < 10 ? '0' + hh : hh;
    mm = mm < 10 ? '0' + mm : mm;
    console.log(date, hh, mm, "time check");
    return hh + ":" + mm + amPm + " ";

    // var now = date;
    // // now.setHours(now.getHours()+2);
    // var isPM = now.getHours() >= 12;
    // var isMidday = now.getHours() == 12;
    // var result = document.querySelector('#result');
    // var time = [now.getHours() - (isPM && !isMidday ? 12 : 0),
    //             now.getMinutes(),
    //             now.getSeconds() || '00'].join(':')
    //              +(isPM ? ' pm' : 'am');
    // return time;
  }

  addEvent(day,month,year){
    let event:any;
    if(month == 0){
      month = 12;
    }
    else if(month == 13){
      month = 1;
      year += 1;
    }
    let eventDate = month + "/" + day + "/" + year;
    console.log(eventDate, "eventDate 123");

    event = {
          "eventId": "",
          "summary": "",
          "location": "",
          "title": "",
          "description":"",
          "start": {
            "dateTime": new Date(eventDate),
            "timeZone": null
          },
          "end": {
            "dateTime": new Date(eventDate),
            "timeZone": null
          },
          "recurrence": "",
          "attendee": "",
          "attendeesList":""
        }

        this.openDialog(event);

    // const dialogRef = this.dialog.open(EventDialog, {
    //   width: '50%',
    //   data: event
    // });
  }

  editEvent(eventData){
    let event:any;
    if(eventData != null){
      event = eventData;
    }
    else{
      event = {
          "eventId": "",
          "summary": "",
          "location": "",
          "title": "",
          "description":"",
          "start": {
            "dateTime": null,
            "timeZone": null
          },
          "end": {
            "dateTime": null,
            "timeZone": null
          },
          "recurrence": "",
          "attendee": "",
          "attendeesList":""
        }
    }

    this.openDialog(event);
  }

  openDialog(eventData): void {

    const dialogRef = this.dialog.open(EventDialog, {
      width: '50%',
      data: eventData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result, "result 123");
    if(result != undefined){
      this.dialogData =
        {
          "calendarId": "gaurav@futurewise.co.in",
          "userId": 2727,
          "eventId": result.eventId,
          "summary": result.title,
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


      this.startTime = result.startTime;
      this.endTime = result.endTime;
      this.dialogData.start.dateTime = this.googleDate(result.startDateTime._d == undefined? new Date(result.startDateTime) : result.startDateTime._d , "start");
      this.dialogData.end.dateTime = this.googleDate(result.endDateTime._d == undefined? new Date(result.endDateTime) : result.endDateTime._d, "end");
      console.log(this.dialogData, 'The dialog was closed');

      if(this.dialogData.eventId != null){
        this.calenderService.updateEvent(this.dialogData).subscribe((data)=>{

        })
      }
      else{
        this.calenderService.addEvent(this.dialogData).subscribe((data)=>{

        })
      }
    }
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
  eventDescription:any;
  eventForm: FormGroup;
  showTime:boolean = false;
  eventData:any;
  isEditAdd:boolean = true;
  isEditable:boolean = false;
  showBothDate:boolean = true;
  userInfo:any;
  timeArr = ["01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00","06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:20","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30","24:00"]
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialog>,
    private changeDetectorRef: ChangeDetectorRef,
    private calenderService : calendarService,
    private _bottomSheet: MatBottomSheet,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      console.log(data, "this.eventData 111");
      this.eventData = data;
  }


  ngOnInit(){
    this.eventForm = this.fb.group({
      eventId:[this.eventData.id],
      summary: [this.eventData.summary,[Validators.required]],
      location: [this.eventData.location],
      title: [this.eventData.summary,[Validators.required]],
      description: [this.eventDescription],
      startDateTime: ["",[Validators.required]],
      endDateTime: ["",[Validators.required]],
      recurrence: [this.eventData.recurrence],
      attendee:  ["",[Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      attendeesList:  [this.attendeesArr],
      startTime:[this.startTime],
      endTime: [this.endTime]
    });

    this.userInfo = AuthService.getUserInfo();


    if(this.eventData.id != undefined){
      this.isEditAdd = false;
    }

    if(this.eventData.id != undefined) {
      this.showTime = true;
      if (new Date(this.eventData.start.dateTime).getDate() == new Date(this.eventData.end.dateTime).getDate() && new Date(this.eventData.start.dateTime).getMonth() == new Date(this.eventData.end.dateTime).getMonth()) {
        this.showBothDate = false;
      }
      this.eventForm.get("startTime").setValue(this.formateTime(new Date(this.eventData.start.dateTime)));
      this.eventForm.get("endTime").setValue(this.formateTime(new Date(this.eventData.end.dateTime)));
    }

    this.eventForm.get("description").setValue(this.eventData.description);
    this.eventForm.get("startDateTime").setValue(this.eventData.start.dateTime);

    console.log(this.eventForm.get("attendee").value == "", "see value");
    if(this.eventData.attendees != undefined){
      for(let att of this.eventData.attendees){
        this.attendeesArr.push({"email":att.email});
      }
    }
    this.setEndDate();
  }

  model:any;
  writeValue(content: any): void {
    this.model = content;
  }

  descriptionData(data) {
    console.log("description 123");

    this.eventForm.get("description").setValue(data);
  }

  addAttendee(){
    this.attendeesArr.push({"email":this.eventForm.value.attendee});
    this.eventForm.get("attendee").setValue("");
  }

  removeMember(member){
    // this.attendeesArr.splice(this.attendeesArr.indexOf(member.email), 1)
    this.attendeesArr = this.attendeesArr.filter((x)=> x.email != member.email);
  }

  addTime() {
    this.showTime = true;
    this.eventForm.get("startTime").setValue("09:00");
    this.eventForm.get("endTime").setValue("10:00");
  }

  setEndDate(){
    if(this.eventData.start.dateTime != null && this.eventData.end.dateTime != null){
      if(this.eventForm.value.startDateTime._d != undefined){
        if(new Date(this.eventForm.value.startDateTime._d).getTime() > new Date(this.eventForm.value.endDateTime).getTime()){
          this.eventForm.get("endDateTime").setValue(this.eventForm.value.startDateTime._d);
        }
      }
      else{
        if(this.eventData.end.dateTime != undefined){
          this.eventForm.get("endDateTime").setValue(this.eventData.end.dateTime);
        }
        else{
          this.eventForm.get("endDateTime").setValue(this.startDate);
        }
      }
    }
    else{
      this.eventForm.get("startDateTime").setValue(this.eventData.created);
      this.eventForm.get("endDateTime").setValue(this.eventData.created);
    }
  }

  setTime(mood){
    if(mood == "start" && this.eventForm.value.endTime < this.eventForm.value.startTime) {
      console.log("hi");

      console.log(this.eventForm.value.startDateTime._d, "this.eventForm.value.startDateTime_d 123");

      this.eventForm.get("endTime").setValue(this.timeArr[this.timeArr.indexOf(this.eventForm.value.startTime) + 2]);
      // this.eventForm.get("endDateTime").setValue(this.eventForm.value.startDateTime._d);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();

    console.log(this.eventForm.value, "check from value");
    console.log(this.eventDescription, "check from value2");
    console.log(this.eventData.description, "check from value3");

  }

  formateTime(date){
    var hh = date.getHours();
    var mm = date.getMinutes();
    hh = hh < 10 ? '0' + hh : hh;
    mm = mm < 10 ? '0' + mm : mm;
    return hh + ":" + mm;
  }


  editEvent(){
    this.isEditAdd = true;
    this.isEditable = true;
  }

  deleteEvent(eventId){
    let deleteData = {
      "calendarId": "gaurav@futurewise.co.in",
        "userId": 2727,
        "eventId": eventId,
    }
    this.calenderService.deleteEvent(deleteData).subscribe((data)=>{

    });
  }
 
  myFiles:any = [];
  filenm:any;
  parentId:any;
  // upload file
  getFileDetails(e) {
    console.log(e.target.files, "e.target.files 123");
    
    for (let i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
    this.myFiles.forEach(fileName => {
      this.filenm = fileName;
      this.parentId = (this.parentId == undefined) ? 0 : this.parentId;
      // this.uploadFile(this.parentId, this.filenm);
    });
    console.log(this.myFiles, "e.target.files 123 myFiles");
    // const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent, {
    //   data: this.myFiles,
    // });
  }

  // uploadFile(element, fileName) {
  //   const obj = {
  //     clientId: this.clientId,
  //     advisorId: this.userInfo.advisorId,
  //     folderId: element,
  //     fileName: fileName.name
  //   };
  //   this.custumService.uploadFile(obj).subscribe(
  //     data => this.uploadFileRes(data, fileName)
  //   );
  // }
}

