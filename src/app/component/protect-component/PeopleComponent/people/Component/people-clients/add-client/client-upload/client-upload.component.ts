import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-client-upload',
  templateUrl: './client-upload.component.html',
  styleUrls: ['./client-upload.component.scss']
})
export class ClientUploadComponent implements OnInit {

  constructor() { }
  @Output() tabChange = new EventEmitter();
  ngOnInit() {
  }

}
