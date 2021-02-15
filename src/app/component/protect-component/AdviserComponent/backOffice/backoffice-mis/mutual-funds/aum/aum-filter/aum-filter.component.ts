import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-aum-filter',
  templateUrl: './aum-filter.component.html',
  styleUrls: ['./aum-filter.component.scss']
})
export class AumFilterComponent implements OnInit {
  @Input() filterList;
  @Output() emitFilterList = new EventEmitter();
  constructor(private eventService: EventService) { }

  ngOnInit() {
  }

  filterIDWise(index) {
    let count = 0;
    this.filterList.forEach(element => {
      if (element.true) {
        count++;
      }
    });
    if (count == 1) {
      return;
    }
    this.filterList[index].checked ? this.filterList[index].checked = false : this.filterList[index].checked = true;
    this.emitFilterList.emit(this.filterList);
  }


}
