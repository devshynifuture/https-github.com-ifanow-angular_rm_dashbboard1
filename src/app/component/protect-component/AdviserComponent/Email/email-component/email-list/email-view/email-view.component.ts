import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss']
})
export class EmailViewComponent implements OnInit {
  @Input() email: Object;
  constructor() { }

  ngOnInit() {
  }

}
