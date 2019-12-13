import { Component, OnInit, Input } from '@angular/core';
import { AddScripComponent } from '../add-scrip/add-scrip.component';
import { MatDialog } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from '../../../../customer.service';

@Component({
  selector: 'app-scrip-field',
  templateUrl: './scrip-field.component.html',
  styleUrls: ['./scrip-field.component.scss']
})
export class ScripFieldComponent implements OnInit {
  scripList: any;
  scripFormControl: any;
  scripTransactionForm: any;

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
  getScripList() {
    let obj = {}
    this.cusService.getScripList(obj).subscribe(
      data => this.getScripListRes(data),
      err => this.eventService.openSnackBar(err)
    )
  }
  getScripListRes(data) {
    console.log(data)
    this.scripList = data.scripName;
  }
}
