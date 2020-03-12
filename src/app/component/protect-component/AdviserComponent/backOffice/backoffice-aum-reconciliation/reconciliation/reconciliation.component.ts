import { Component, OnInit } from '@angular/core';
import { ReconciliationService } from './reconciliation.service';

@Component({
  selector: 'app-reconciliation',
  templateUrl: './reconciliation.component.html',
  styleUrls: ['./reconciliation.component.scss']
})
export class ReconciliationComponent implements OnInit {

  constructor(
    private reconService: ReconciliationService
  ) { }

  camsId: number;
  karvyId: number;
  franklinId: number;

  ngOnInit() {
    this.getRTList();
  }

  getRTList() {
    this.reconService.getRTListValues({})
      .subscribe(res => {
        console.log("this is RT list:::::", res);
        res.forEach(element => {
          if (element.name === "CAMS") {
            this.camsId = element.id;
          }
          if (element.name === 'KARVY') {
            this.karvyId = element.id;
          }
          if (element.name === 'FRANKLIN_TEMPLETON') {
            this.franklinId = element.id;
          }
        });
      });
  }

}
