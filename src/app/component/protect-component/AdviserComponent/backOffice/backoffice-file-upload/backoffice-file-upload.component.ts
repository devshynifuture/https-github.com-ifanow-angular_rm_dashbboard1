import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-backoffice-file-upload',
  templateUrl: './backoffice-file-upload.component.html',
  styleUrls: ['./backoffice-file-upload.component.scss']
})
export class BackofficeFileUploadComponent implements OnInit {
  filterRTA:any="";
  filterStatus:any="";
  constructor() { }

  ngOnInit() {
  }

}
