import {Component, Input, OnInit,EventEmitter, Output} from '@angular/core';
import {AddScripComponent} from '../add-scrip/add-scrip.component';
import {MatDialog} from '@angular/material';
import {EventService} from 'src/app/Data-service/event.service';
import {CustomerService} from '../../../../customer.service';

@Component({
  selector: 'app-scrip-field',
  templateUrl: './scrip-field.component.html',
  styleUrls: ['./scrip-field.component.scss']
})
export class ScripFieldComponent implements OnInit {
  scripList: any;
  scripFormControl: any;
  scripTransactionForm: any;
  @Output() valueChange1 = new EventEmitter();
  @Output() scriptList = new EventEmitter();

  constructor(public dialog: MatDialog, private eventService: EventService, private cusService: CustomerService) { }

  ngOnInit() {
  }
  @Input() set data(data) {
    if (data.formData) {
      this.scripTransactionForm = data.formData;
      this.getScripList();
    }
    else {
      this.scripFormControl = data;
      this.getScripList();
    }
  }
  addScrip() {
    const dialogRef = this.dialog.open(AddScripComponent, {
      width: '700px',
      height: '430px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getScripList();
      console.log('The dialog was closed');
    });
  }

  selectedScript(data){
    this.valueChange1.emit(data);
  }
  
  getScripList() {
    let obj = {}
    this.cusService.getScripList(obj).subscribe(
      data => this.getScripListRes(data),
      error => this.eventService.showErrorMessage(error)
    )
  }
  getScripListRes(data) {
    console.log(data, "scripList")
    this.scripList = data.scripName;
    this.scriptList.emit(this.scripList);

  }
}
