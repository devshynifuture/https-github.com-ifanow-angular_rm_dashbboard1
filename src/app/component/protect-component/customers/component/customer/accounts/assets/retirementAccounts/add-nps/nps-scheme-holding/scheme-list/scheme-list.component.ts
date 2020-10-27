import { Component, OnInit, Inject } from '@angular/core';
import { CustomerService } from '../../../../../../customer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-scheme-list',
  templateUrl: './scheme-list.component.html',
  styleUrls: ['./scheme-list.component.scss']
})
export class SchemeListComponent implements OnInit {
  schemeList: any;
  constructor(private custumService: CustomerService,
    public dialogRef: MatDialogRef<SchemeListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) { 
      this.schemeListData = data;
    }

  ngOnInit() {
    this.getGlobalList();
  }

  getGlobalList() {
    this.custumService.getSchemeChoice().subscribe(
      data => this.getGlobalRes(data)
    );
  }
  schemeListData:any=[];
  getGlobalRes(data) {

    console.log('getGlobalRes', data)
    this.schemeListData = data.npsSchemeList;
    this.schemeList = this.schemeListData;
    // this.startFilter();
  }

  filterSchemeOptions(name){
    if(name.length >=3){
      let obj={
        name:name
      }
      this.custumService.getFilterSchemeChoice(obj).subscribe(
      data =>{
        this.schemeList = data;
      });
    }
    else{
      this.schemeList = this.schemeListData;
    }
  }

  getSelected(scheme){
    this.dialogRef.close(scheme);
  }
}
