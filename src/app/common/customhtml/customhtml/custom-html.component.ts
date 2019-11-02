import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-custom-html',
  templateUrl: './custom-html.component.html',
  styleUrls: ['./custom-html.component.scss']
})
export class CustomHtmlComponent implements OnInit {
  @Input() data: any;
  constructor() { }

  @Input() isChecked;
  ngOnInit() {
  }

}
