import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-preview-fin-plan',
  templateUrl: './preview-fin-plan.component.html',
  styleUrls: ['./preview-fin-plan.component.scss']
})
export class PreviewFinPlanComponent implements OnInit {

  link: any;
  loadSpinner: boolean = false;
  selectedElement: any;
  imgPreview: any;
  constructor(public dialogRef: MatDialogRef<PreviewFinPlanComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private eventService: EventService,) {
  }

  ngOnInit() {
    console.log('preview == ', this.data);
    this.link = this.data.selectedElement.preSignedUrl;
    this.imgPreview = this.data.bank
    this.selectedElement = this.data.selectedElement
    console.log('preview == ', this.selectedElement);
    console.log('link == ', this.link);
    this.loadSpinner = false
    if (this.data.bank.content) {
      document.getElementById("dId").innerHTML = this.data.bank.content;
      this.loadSpinner = false
    }
    setTimeout(() => {
      this.getLoader()
    }, 4000);
  }
  getLoader() {
    this.loadSpinner = false
  }
  onNoClick(value): void {
    this.dialogRef.close(this.link);

  }


}
