import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  _value: number;

  set value(value: number) {
    this._value = value;
  }

  constructor(private router: Router, /* private ref: ChangeDetectorRef, */
              private locationService: Location) {
  }

  selected;

  ngOnInit() {
    this.selected = 0;
    if (this.router.url.split('/')[3] == 'summary') {
      this._value = 1;
    } else if (this.router.url.split('/')[3] == 'profile') {
      this._value = 2;
    } else if (this.router.url.split('/')[3] == 'insurance') {
      this._value = 3;
    } else if (this.router.url.split('/')[3] == 'goals') {
      this._value = 4;
    } else if (this.router.url.split('/')[3] == 'taxes') {
      this._value = 5;
    } else if (this.router.url.split('/')[3] == 'cash-flow') {
      this._value = 6;
    } else if (this.router.url.split('/')[3] == 'investments') {
      this._value = 7;
    } else if (this.router.url.split('/')[3] == 'scenarios') {
      this._value = 8;
    }
  }

  goToAdvisorHome() {
    /*this.router.navigateByUrl('/admin/subscription').then(e => {
      if (e) {
        console.log('Navigation is successful!');
      } else {
        console.log('Navigation has failed!');
      }
    });*/
    this.router.navigate(['/admin', 'subscription'], {/*replaceUrl: true*/}).then(e => {
      if (e) {
        /* setTimeout(() => {
           this.ref.markForCheck();
         }, 100);*/
        console.log('Navigation is successful!');
      } else {
        console.log('Navigation has failed!');
      }
    });
    // this.
  }
}
