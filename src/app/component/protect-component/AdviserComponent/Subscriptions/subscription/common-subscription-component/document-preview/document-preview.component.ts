import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../../../../Activities/calendar/calendar.component';

@Component({
  selector: 'app-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.scss']
})
export class DocumentPreviewComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DocumentPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  @ViewChild('dataContainer', { static: true }) dataContainer: ElementRef;


  ngOnInit() {
    this.dataContainer.nativeElement.innerHTML = this.data.data;
  }
  downloadDocumentAsPDF() {
    this.data.cancelButton()
  }
}


