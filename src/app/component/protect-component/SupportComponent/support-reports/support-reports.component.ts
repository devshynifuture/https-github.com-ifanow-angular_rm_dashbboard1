import { Component, OnInit } from '@angular/core';
import { SupportService } from '../support.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-support-reports',
  templateUrl: './support-reports.component.html',
  styleUrls: ['./support-reports.component.scss']
})
export class SupportReportsComponent implements OnInit {

  constructor(private supportService: SupportService, private eventService: EventService) { }

  ngOnInit() {
  }
  getReports() {
    let obj = {};
    this.supportService.getBackofficeReports(obj).subscribe(
      data => {
        console.log(data);
        if (data) {

        }
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
}
