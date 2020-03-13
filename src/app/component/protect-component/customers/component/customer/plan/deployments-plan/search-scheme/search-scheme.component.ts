import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-scheme',
  templateUrl: './search-scheme.component.html',
  styleUrls: ['./search-scheme.component.scss']
})
export class SearchSchemeComponent implements OnInit {
  searchSchemeForm: any;

  constructor(public dialogRef: MatDialogRef<SearchSchemeComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.data)
    this.getdataForm(this.data);
  }
  getdataForm(data) {
    this.searchSchemeForm = this.fb.group({
      schemeName: [(!data) ? '' : data.schemeName, [Validators.required]],
      amount:[(!data) ? '' : data.amount, [Validators.required]]
    });
  }
  close() {
    this.dialogRef.close()
  }
}
