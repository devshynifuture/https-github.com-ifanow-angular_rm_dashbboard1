import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-response-html',
  templateUrl: './response-html.component.html',
  styleUrls: ['./response-html.component.scss']
})
export class ResponseHtmlComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  close() {
    window.close();
  }
}
