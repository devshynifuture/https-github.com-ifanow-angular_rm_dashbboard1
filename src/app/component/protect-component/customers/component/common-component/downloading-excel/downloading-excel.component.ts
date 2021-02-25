import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-downloading-excel',
  templateUrl: './downloading-excel.component.html',
  styleUrls: ['./downloading-excel.component.scss']
})
export class DownloadingExcelComponent implements OnInit {

  constructor() { }
  fileData: any[];
  display: any[];
  ngOnInit() {
  }
  close() {

  }
}
