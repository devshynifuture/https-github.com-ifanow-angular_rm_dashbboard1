import { SupportUpperService } from './support-upper.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support-upper',
  templateUrl: './support-upper.component.html',
  styleUrls: ['./support-upper.component.scss']
})
export class SupportUpperComponent implements OnInit {
  constructor(
    private supportUpperService: SupportUpperService
  ) { }

  data;

  ngOnInit() {
    console.log(this.data);
  }
}
