import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';
import { Validators, FormControl } from '@angular/forms';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-age-popup',
  templateUrl: './age-popup.component.html',
  styleUrls: ['./age-popup.component.scss']
})
export class AgePopupComponent implements OnInit {
  birthDate;
  maxDate = new Date();
  constructor(public dialogRef: MatDialogRef<AgePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private peopleService: PeopleService, private eventService: EventService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.birthDate = new FormControl(new Date(this.data.dateOfBirth), [Validators.required])
  }
  editBirthDate() {
    if (this.birthDate.invalid) {
      this.birthDate.markAsTouched();
      return;
    }
    const obj =
    {
      "dateOfBirth": this.datePipe.transform(this.birthDate.value, 'dd/MM/yyyy'),
      "clientId": this.data.clientId
    }
    this.peopleService.editBirthDate(obj).subscribe(
      data => {
        console.log(data);
        this.cancel(data);
      },
      err => {
        this.eventService.openSnackBar(err, "Dismiss");
      }
    )
  }
  cancel(data) {
    (data == undefined) ? this.dialogRef.close({ flag: 'cancel' }) : this.dialogRef.close({ flag: data });
  }
}
