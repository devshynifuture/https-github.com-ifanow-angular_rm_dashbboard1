import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DATE_FORMATS, MatBottomSheet } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { calendarService } from './calendar.service';
import { AuthService } from '../../../../../auth-service/authService';
import { BottomSheetComponent } from '../../../customers/component/common-component/bottom-sheet/bottom-sheet.component';
// import { DialogData } from 'src/app/common/link-bank/link-bank.component';

@Component({
    selector: 'event-dialog',
    templateUrl: './event-dialog.html',
    providers: [
      { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
    ],
  })
  export class EventDialog implements OnInit {
    attendeesArr = [];
    startDate = new Date();
    startTime = "";
    endTime = "";
    eventDescription: any;
    eventForm: FormGroup;
    showTime: boolean = false;
    eventData: any;
    isEditAdd: boolean = true;
    isEditable: boolean = false;
    showBothDate: boolean = true;
    userInfo: any;
    timeArr = ["01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:20", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "24:00"]
    constructor(
      private fb: FormBuilder,
    //   public dialogRef: MatDialogRef<EventDialog>,
      private changeDetectorRef: ChangeDetectorRef,
      private calenderService: calendarService,
      private _bottomSheet: MatBottomSheet,
      public dialogRef: MatDialogRef<EventDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
      this.eventData = data;
      console.log(this.eventData,"add this.eventData");
      
    }
  
  
    ngOnInit() {
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
  
  
      if (this.eventData.id != undefined) {
        this.isEditAdd = false;
      }
  
      if (this.eventData.id != undefined) {
        this.showTime = true;
        if (new Date(this.eventData.start.dateTime).getDate() == new Date(this.eventData.end.dateTime).getDate() && new Date(this.eventData.start.dateTime).getMonth() == new Date(this.eventData.end.dateTime).getMonth()) {
          this.showBothDate = false;
        }
        this.eventForm.get("startTime").setValue(this.formateTime(new Date(this.eventData.start.dateTime)));
        this.eventForm.get("endTime").setValue(this.formateTime(new Date(this.eventData.end.dateTime)));
      }
  
      this.eventForm.get("description").setValue(this.eventData.description);
      this.eventForm.get("startDateTime").setValue(this.eventData.start.dateTime);
  
      if (this.eventData.attendees != undefined) {
        for (let att of this.eventData.attendees) {
          this.attendeesArr.push({ "email": att.email });
        }
      }
      this.setEndDate();
    }
  
    model: any;
    writeValue(content: any): void {
      this.model = content;
    }
  
    descriptionData(data) {
  
      this.eventForm.get("description").setValue(data);
    }
  
    addAttendee() {
      this.attendeesArr.push({ "email": this.eventForm.value.attendee });
      this.eventForm.get("attendee").setValue("");
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
        this.eventForm.get("startDateTime").setValue(this.eventData.created);
        this.eventForm.get("endDateTime").setValue(this.eventData.created);
      }
    }
  
    setTime(mood) {
      if (mood == "start" && this.eventForm.value.endTime < this.eventForm.value.startTime) {
  
  
        this.eventForm.get("endTime").setValue(this.timeArr[this.timeArr.indexOf(this.eventForm.value.startTime) + 2]);
        // this.eventForm.get("endDateTime").setValue(this.eventForm.value.startDateTime._d);
      }
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
  }