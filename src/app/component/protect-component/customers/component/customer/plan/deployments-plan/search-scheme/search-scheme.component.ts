import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.component';

@Component({
  selector: 'app-search-scheme',
  templateUrl: './search-scheme.component.html',
  styleUrls: ['./search-scheme.component.scss']
})
export class SearchSchemeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SearchSchemeComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    console.log(this.data)
  }

}
