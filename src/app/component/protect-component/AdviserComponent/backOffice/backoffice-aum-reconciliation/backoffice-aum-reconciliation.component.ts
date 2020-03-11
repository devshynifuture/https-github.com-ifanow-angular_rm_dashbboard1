import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-backoffice-aum-reconciliation',
  templateUrl: './backoffice-aum-reconciliation.component.html',
  styleUrls: ['./backoffice-aum-reconciliation.component.scss']
})
export class BackofficeAumReconciliationComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }


  isLinkActive(): boolean {
    return "backoffice-aum-reconciliation" === this.router.url.split('/')[2];
  }

}
