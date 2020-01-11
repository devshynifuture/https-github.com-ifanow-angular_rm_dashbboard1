import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fee-calculations',
  templateUrl: './fee-calculations.component.html',
  styleUrls: ['./fee-calculations.component.scss']
})
export class FeeCalculationsComponent implements OnInit {
  @Input() padding;

  constructor() { }

  ngOnInit() {
  }

}
