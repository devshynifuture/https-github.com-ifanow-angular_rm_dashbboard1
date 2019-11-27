import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-quotation',
  templateUrl: './add-quotation.component.html',
  styleUrls: ['./add-quotation.component.scss']
})
export class AddQuotationComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<AddQuotationComponent>,@Inject(MAT_DIALOG_DATA) public fragmentData: any) { }

  ngOnInit() {
  }

}
