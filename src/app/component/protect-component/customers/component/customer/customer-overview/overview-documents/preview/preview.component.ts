import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { DialogData } from 'src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.component';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  link: any;
  constructor(public dialogRef: MatDialogRef<PreviewComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private eventService: EventService, ) {
  }

  ngOnInit() {
    console.log('investorList == ', this.data);
    this.link = this.data.bank;
    console.log('link == ', this.link);
  }
  onNoClick(value): void {
    this.dialogRef.close(this.link);

  }
}