import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-setting-activity-task-setting',
  templateUrl: './setting-activity-task-setting.component.html',
  styleUrls: ['./setting-activity-task-setting.component.scss']
})

export class SettingActivityTaskSettingComponent implements OnInit {
  viewMode: string;

  constructor() { }

  ngOnInit() {
    this.viewMode = 'tab1'
  }
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [
    { name: 'Lemon' },
    { name: 'Lime' },
    { name: 'Apple' },
  ];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
}
