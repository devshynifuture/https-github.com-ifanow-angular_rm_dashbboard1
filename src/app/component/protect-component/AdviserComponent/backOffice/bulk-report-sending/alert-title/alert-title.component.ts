import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-alert-title',
  templateUrl: './alert-title.component.html',
  styleUrls: ['./alert-title.component.scss']
})
export class AlertTitleComponent implements OnInit {
  emailVerify;

  constructor(public dialogRef: MatDialogRef<AlertTitleComponent>,) {
  }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
