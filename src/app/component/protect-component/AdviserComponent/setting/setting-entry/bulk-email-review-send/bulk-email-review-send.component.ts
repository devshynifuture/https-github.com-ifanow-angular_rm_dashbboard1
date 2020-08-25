import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-bulk-email-review-send',
  templateUrl: './bulk-email-review-send.component.html',
  styleUrls: ['./bulk-email-review-send.component.scss']
})
export class BulkEmailReviewSendComponent implements OnInit {
  clientList: any;
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public authService: AuthService,
    protected eventService: EventService,
    public enumDataService: EnumDataService,
  ) { }

  logoText = 'Your Logo here';


  ngOnInit() {
  }

  @Input() set data(data) {
    this.dataSource.data = this.enumDataService.getEmptySearchStateData()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }

  close() {
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: false });
  }
}
