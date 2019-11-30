import { Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class BottomSheetComponent implements OnInit {
  color = 'primary';
  mode = 'determinate';
  value = 90;
  fileData: any;
  noOfFiles: any;
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>) { }

  ngOnInit() {
    console.log(this.data)
    this.fileData = this.data
    this.noOfFiles = this.data.length;
  }
close(){
  this._bottomSheetRef.dismiss()
}
}
