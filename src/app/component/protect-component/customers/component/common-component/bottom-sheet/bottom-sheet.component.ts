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
  folderName: any;
  folderNameToDisplay: any;
  myFiles: string[] = [];
  display: any;
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>) { }

  ngOnInit() {
    console.log(this.data)
  
    // var array=[];
    // array.push(this.data)
    // this.myFiles.push(array[])
      if(this.data.flag=='uploadFolder'){
        this.display=this.data.viewFolder;
        this.display.forEach(element => {
          element.folderName=element[0].webkitRelativePath.split('/');
          element.folderNameToDisplay=element.folderName[0];
        });
      }else{
        this.fileData = this.data
        this.noOfFiles = this.data.length;
      }
    
 
    // this.folderName=this.data[0].webkitRelativePath.split('/');
    // this.folderNameToDisplay=this.folderName[0];
    console.log('folderNameToDisplay',this.folderNameToDisplay)
  }
close(){
  this._bottomSheetRef.dismiss()
}
}
