import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  constructor(private eventService: EventService, ) { }

  ngOnInit() {
  }

  _value: number;
  set value(value: number) {
    console.log('now value is ->>>>', value);
    this._value = value;
  }
}
