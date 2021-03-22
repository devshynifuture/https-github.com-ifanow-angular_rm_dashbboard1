import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PeopleService } from '../../protect-component/PeopleComponent/people.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-kyc-redirect',
  templateUrl: './kyc-redirect.component.html',
  styleUrls: ['./kyc-redirect.component.scss']
})
export class KycRedirectComponent implements OnInit {
  id: any;
  logImage: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private peopleService: PeopleService) { }

  ngOnInit() {
    this.logImage = AuthService.getDomainDetails() ? AuthService.getDomainDetails().logoUrl : this.getLogoUrl();
    this.route.queryParams.subscribe((params) => {
      if (params._id || params.id) {
        this.id = params._id || params.id;
        this.getIdFromURL(this.id)
      } else {
        // this.router.navigate(['']);
      }
    });

  }

  getLogoUrl() {
    this.peopleService.getClientLogo({ hostName: window.location.hostname })
      .subscribe(res => {
        if (res) {
          localStorage.removeItem('token');
          console.log(res);
          this.logImage = res.logoUrl;
        }
      }, err => {
        console.error(err);
      });
  }

  getIdFromURL(id) {
    const obj = {
      id: id
    }
    this.peopleService.kycStatusUpdate(obj).subscribe(
      data => {
        // this.router.navigate(['']);
      }, err => {
        // this.router.navigate(['']);
      }
    )
  }

}
