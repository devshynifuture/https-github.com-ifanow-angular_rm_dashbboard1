import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-support-aum-reconciliation',
  templateUrl: './support-aum-reconciliation.component.html',
  styleUrls: ['./support-aum-reconciliation.component.scss']
})
export class SupportAumReconciliationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.navigate(['/support/aum-reconciliation/all-rta'])
  }

}
