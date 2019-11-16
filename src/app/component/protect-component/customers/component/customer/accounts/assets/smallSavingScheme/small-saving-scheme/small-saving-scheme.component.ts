import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';

@Component({
  selector: 'app-small-saving-scheme',
  templateUrl: './small-saving-scheme.component.html',
  styleUrls: ['./small-saving-scheme.component.scss']
})
export class SmallSavingSchemeComponent implements OnInit {
  selectedTab: number;
  constructor() { }

  ngOnInit() {
    this.selectedTab=1;
  }
}
