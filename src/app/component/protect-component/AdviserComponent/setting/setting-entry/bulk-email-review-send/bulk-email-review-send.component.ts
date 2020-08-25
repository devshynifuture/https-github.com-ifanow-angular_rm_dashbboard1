import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { element } from 'protractor';

@Component({
  selector: 'app-bulk-email-review-send',
  templateUrl: './bulk-email-review-send.component.html',
  styleUrls: ['./bulk-email-review-send.component.scss']
})
export class BulkEmailReviewSendComponent implements OnInit {
  clientList: any;
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['checkbox', 'name', 'email'];
  isLoading = false
  dataCount: number;

  
  
  constructor(
    public authService: AuthService,
    protected eventService: EventService,
    public enumDataService: EnumDataService,
  ) { }
 
  

  logoText = 'Your Logo here';


  ngOnInit() {
  }

  @Input() set data(data) {
    if (data && data.length > 0) {
      data.forEach(element => {
        element.selected = false
      });
      this.dataSource.data = data
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }

  selectAll(event) {
    this.dataCount = 0;
    if (this.dataSource != undefined) {
      this.dataSource.filteredData.forEach(element => {
        element['selected'] = event.checked;
        if (element['selected']) {
          this.dataCount++;
        }
      });
    }
  }

  changeSelect() {
    this.dataCount = 0;
    this.dataSource.filteredData.forEach(item => {
      if (item['selected']) {
        this.dataCount++;
      }
    });
  }

  close() {
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: false });
  }
}

 


 