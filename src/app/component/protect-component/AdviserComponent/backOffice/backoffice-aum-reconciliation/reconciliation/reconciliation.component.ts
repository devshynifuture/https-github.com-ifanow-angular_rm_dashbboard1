import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ReconciliationService } from './reconciliation.service';

@Component({
  selector: 'app-reconciliation',
  templateUrl: './reconciliation.component.html',
  styleUrls: ['./reconciliation.component.scss']
})
export class ReconciliationComponent implements OnInit {

  constructor(
    private reconService: ReconciliationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.reconService.getRoutedOn().subscribe(value => {
      if (value) {
        this.router.navigate([value], { relativeTo: this.activatedRoute });
      } else {
        this.router.navigate(['cams'], { relativeTo: this.activatedRoute });
      }
    })
  }
  ngOnInit() {

  }

  setRoutedOnValue(value) {
    this.reconService.setRoutedOn(value);
  }

}
