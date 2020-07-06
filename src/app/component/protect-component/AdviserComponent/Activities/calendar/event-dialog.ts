import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DATE_FORMATS, MatBottomSheet } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { calendarService } from './calendar.service';
import { AuthService } from '../../../../../auth-service/authService';
import { BottomSheetComponent } from '../../../customers/component/common-component/bottom-sheet/bottom-sheet.component';
import { DatePipe } from '@angular/common';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

// import { DialogData } from 'src/app/common/link-bank/link-bank.component';

@Component({
  selector: 'event-dialog',
  templateUrl: './event-dialog.html',
  styleUrls: ['./event-dialog.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class EventDialog implements OnInit {
  attendeesArr = [];
  startDate = new Date();
  startTime = "";
  endTime = "";
  day:any;
  month:any;
  year:any;
  numbersOfDays:any;
  eventDescription: any;
  eventForm: FormGroup;
  showTime: boolean = false;
  eventData: any;
  isEditAdd: boolean = true;
  isEditable: boolean = false;
  showBothDate: boolean = true;
  userInfo: any;
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  timeArr = ["01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:20", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "24:00"]
  constructor(
    private fb: FormBuilder,
    //   public dialogRef: MatDialogRef<EventDialog>,
    private changeDetectorRef: ChangeDetectorRef,
    private calenderService: calendarService,
    private _bottomSheet: MatBottomSheet,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<EventDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.eventData = data;
    console.log(this.eventData, "add this.eventData");
  }
  
  
  ngOnInit() {
    this.getAttendyList();
    // this.dialogRef.updatePosition({ top: '50px', left: '50px' });
    this.eventForm = this.fb.group({
      eventId: [this.eventData.id],
      summary: [this.eventData.summary, [Validators.required]],
      location: [this.eventData.location],
      title: [this.eventData.summary, [Validators.required]],
      description: [this.eventDescription],
      startDateTime: ["", [Validators.required]],
      endDateTime: ["", [Validators.required]],
      recurrence: [this.eventData.recurrence],
      attendee: ["", [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      attendeesList: [this.attendeesArr],
      startTime: [this.startTime],
      endTime: [this.endTime]
    });
    
    this.userInfo = AuthService.getUserInfo();


    if (this.eventData.date) {
      // this.day = this.formateDate(this.eventData.calDate);
      // this.month = this.formateMonth(this.eventData.calDate);
      // this.year = this.formateYear(this.eventData.calDate);
      this.isEditAdd = false;
      // this.numbersOfDays = this.getDaysCount(this.eventData.calDate, "currentMonthDays");
    }else{
      this.isEditAdd = false;

      this.isEditAdd = true;

    }
    
    if (this.eventData.id != undefined && !this.eventData.date) {
      this.isEditAdd = false;
      this.showTime = true;
      if (new Date(this.eventData.start.dateTime).getDate() == new Date(this.eventData.end.dateTime).getDate() && new Date(this.eventData.start.dateTime).getMonth() == new Date(this.eventData.end.dateTime).getMonth()) {
        this.showBothDate = false;
      }
      this.eventForm.get("startTime").setValue(this.formateTime(new Date(this.eventData.start.dateTime)));
      this.eventForm.get("endTime").setValue(this.formateTime(new Date(this.eventData.end.dateTime)));
    }

    if (!this.eventData.date) {
      this.eventForm.get("description").setValue(this.eventData.description);
      this.eventForm.get("startDateTime").setValue(this.eventData.start.dateTime);
      this.setEndDate();
    }

    if (this.eventData.attendees != undefined) {
      for (let att of this.eventData.attendees) {
        this.attendeesArr.push({ "email": att.email });
      }
    }
    // const eventUI =  document.getElementById('eventUI')
    // setTimeout(() => {
    //   // eventUI.scrollTop;
    //   eventUI.scrollTop
      
    // }, 1000);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.attendy.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  model: any;
  writeValue(content: any): void {
    this.model = content;
  }

  descriptionData(data) {

    this.eventForm.get("description").setValue(data);
  }

  addAttendee(event) {
    console.log(event.keyCode, this.myControl, this.eventForm.controls['attendee'],"event.keyCode");
    if (event.keyCode === 13 && this.eventForm.get("attendee").valid) {
    this.attendeesArr.push({ "email": this.eventForm.value.attendee });
    if(!this.attendy.includes(this.eventForm.get("attendee").value)){
      let obj ={
        "email": this.eventForm.get("attendee").value,
        "userId": AuthService.getUserInfo().advisorId
      }
      this.calenderService.addToAttendyList(obj).subscribe((data) => {
        
      },
      err =>{

      });
      }
      this.eventForm.get("attendee").setValue("");
    }
  }

  removeMember(member) {
    // this.attendeesArr.splice(this.attendeesArr.indexOf(member.email), 1)
    this.attendeesArr = this.attendeesArr.filter((x) => x.email != member.email);
  }

  addTime() {
    this.showTime = true;
    this.eventForm.get("startTime").setValue("09:00");
    this.eventForm.get("endTime").setValue("10:00");
  }

  setEndDate() {
    if (this.eventData.start.dateTime != null && this.eventData.end.dateTime != null) {
      if (this.eventForm.value.startDateTime._d != undefined) {
        if (new Date(this.eventForm.value.startDateTime._d).getTime() > new Date(this.eventForm.value.endDateTime).getTime()) {
          this.eventForm.get("endDateTime").setValue(this.eventForm.value.startDateTime._d);
        }
      }
      else {
        if (this.eventData.end.dateTime != undefined) {
          this.eventForm.get("endDateTime").setValue(this.eventData.end.dateTime);
        }
        else {
          this.eventForm.get("endDateTime").setValue(this.startDate);
        }
      }
    }
    else {
      this.eventForm.get("startDateTime").setValue(this.eventData.start.date);
      this.eventForm.get("endDateTime").setValue(this.eventData.start.date);
    }
  }

  setTime(mood) {
    if (mood == "start" && this.eventForm.value.endTime < this.eventForm.value.startTime) {


      this.eventForm.get("endTime").setValue(this.timeArr[this.timeArr.indexOf(this.eventForm.value.startTime) + 2]);
      // this.eventForm.get("endDateTime").setValue(this.eventForm.value.startDateTime._d);
    }
  }

  formateDate(date) {
    var dd = new Date(date).getDate();

    return dd;
  }

  formateMonth(date) {
    var mm = new Date(date).getMonth() + 1; //January is 0!
    return mm;
  }

  formateYear(date) {
    var yyyy = new Date(date).getFullYear();
    return yyyy;
  }


  onNoClick(): void {
    this.dialogRef.close();


  }

  formateTime(date) {
    var hh = date.getHours();
    var mm = date.getMinutes();
    hh = hh < 10 ? '0' + hh : hh;
    mm = mm < 10 ? '0' + mm : mm;
    return hh + ":" + mm;
  }


  editEvent() {
    this.isEditAdd = true;
    this.isEditable = true;
  }

  attendy:any=[];
  getAttendyList(){
    let obj = {
      "userId": AuthService.getUserInfo().advisorId
    }
    this.calenderService.getAttendyList(obj).subscribe((data) => {
      this.attendy = data;
      this.filteredOptions = this.eventForm.controls['attendee'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
      console.log(this.attendy,data, "this.attendy");
    });
  }

  deleteEvent(eventId) {
    let deleteData = {
      "calendarId": AuthService.getUserInfo().userName,
      "userId": AuthService.getUserInfo().advisorId,
      "eventId": eventId,
    }
    this.calenderService.deleteEvent(deleteData).subscribe((data) => {
      this.dialogRef.close('delete');
    });
  }

  myFiles: any = [];
  filenm: any;
  parentId: any;
  // upload file
  getFileDetails(e) {

    for (let i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
    this.myFiles.forEach(fileName => {
      this.filenm = fileName;
      this.parentId = (this.parentId == undefined) ? 0 : this.parentId;
      // this.uploadFile(this.parentId, this.filenm);
    });
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


  sun:any = [];
 mon:any = [];
 tue:any = [];
 wed:any = [];
 thu:any = [];
 fri:any = [];
 sat:any = [];
 addDaysOfMomth(){
   let d:any;
   let m;
  for(let i = 1; i < this.numbersOfDays; i++){
    // if(this.back){
    //   m = this.month == 0?11:this.month-1;
    // }
    // else{
    //   m = this.month == 0?1:this.month;
    // }
    d = new Date(this.year,this.month,i);
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

  viewEvent(event){
    let openEvent = {
      event:event,
      openEvent: true
    }
    this.dialogRef.close(openEvent);
  }

  E:any=[]
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
  dateTimeEvent(year, month, date) {
    let dateBe;
    if (year != null) {
      dateBe = new Date(year, month, date);
    }
    else {
      dateBe = new Date(date);
    }
    return new Date(dateBe).getTime();
  }

  getDay(year, month, day) {
    let d = new Date(year, month, day);
    return this.datePipe.transform(d, 'EEE')
  }

  

  getDaysCount(date, ch: string): any {
    switch (ch) {
      case "currentMonthDays": return 32 - new Date(date, 32).getDate();

      case "lastMonthDays": return 32 - new Date(date, 32).getDate();

      case "nextMonthDays": return 32 - new Date(date, 32).getDate();
    }

  }
}