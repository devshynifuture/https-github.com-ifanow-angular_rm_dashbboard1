import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogData } from 'src/app/component/protect-component/interface';

@Component({
  selector: 'app-search-scheme',
  templateUrl: './search-scheme.component.html',
  styleUrls: ['./search-scheme.component.scss']
})
export class SearchSchemeComponent implements OnInit {
  searchSchemeForm: any;

  constructor(public dialogRef: MatDialogRef<SearchSchemeComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.data)
    this.getdataForm(this.data);
  }
  getdataForm(data) {
    this.searchSchemeForm = this.fb.group({
      schemeName: [(!data) ? '' : data.schemeName, [Validators.required]],
      amount: [(!data) ? '' : data.amount, [Validators.required]]
    });
  }
  close(flag) {
    this.dialogRef.close({ isRefreshRequired: flag })
  }
}
