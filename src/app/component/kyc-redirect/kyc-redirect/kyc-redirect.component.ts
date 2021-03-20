import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PeopleService } from '../../protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-kyc-redirect',
  templateUrl: './kyc-redirect.component.html',
  styleUrls: ['./kyc-redirect.component.scss']
})
export class KycRedirectComponent implements OnInit {
  id: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private peopleService: PeopleService) { }

  ngOnInit() {

    this.route.queryParams.subscribe((params) => {
      if (params.uuid) {
        this.id = params._id;
        this.getIdFromURL(this.id)
      } else {
        // this.router.navigate(['']);
      }
    });

  }

  getIdFromURL(id) {
    this.peopleService.kycStatusUpdate(id).subscribe(
      data => {
        // this.router.navigate(['']);
      }, err => {
        // this.router.navigate(['']);
      }
    )
  }

}
