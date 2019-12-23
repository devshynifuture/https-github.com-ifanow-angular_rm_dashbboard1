import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { BackOfficeService } from '../../protect-component/AdviserComponent/backOffice/back-office.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder, private eventService: EventService,
    public backOfficeService: BackOfficeService,
    public router: Router,
    private authService: AuthService) {
  }

  loginForm: FormGroup;

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      name: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(55)],
        updateOn: 'change'
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(55)],
        updateOn: 'change'
      }),
    });
  }

  getError() {
    return ' *This is required field';
  }

  cancel(): void {
    this.loginForm.reset();
  }

  enterEvent(event) {
    if (event.keyCode === 13) {
      this.onSubmit();
    }
  }

  onSubmit() {
    // this.authService.setToken('12333nhsdhdh1233');
    // this.authService.setUserInfo('https://res.cloudinary.com/futurewise/image/upload/v1566029063/icons_fakfxf.png');
    // this.router.navigate(['/admin/subscription']);
    if (this.loginForm.valid) {
      const loginData = {
        userName: this.loginForm.controls.name.value,
        password: this.loginForm.controls.password.value,
        roleId: 1
      };

      // this.hardCodeLoginForTest();
      // console.log(loginData);
      this.backOfficeService.loginApi(loginData).subscribe(
        data => {
          if (data) {
            console.log('data: ', data);
            this.authService.setToken(data.token);
            if (!data.advisorId) {
              data.advisorId = data.adminAdvisorId;
            }
            this.authService.setUserInfo(data);
            this.eventService.openSnackBar('Login SuccessFully', 'dismiss');
            this.router.navigate(['admin','subscription','dashboard']);

            // Hard coded client login for testing
            this.authService.setClientData({
              id: 2978, name: 'Aryendra Kumar Saxena'
            });
          }
          this.closeDialog(data);
        },
        err => {
          console.log('error on login: ', err);
          this.eventService.openSnackBar(err, 'dismiss');
        }
      );
    }
  }

  hardCodeLoginForTest() {
    const jsonData = {
      advisorId: 2727,
      clientId: 2978,
      emailId: 'gaurav@futurewise.co.in',
      authToken: 'data',
      imgUrl: 'https://res.cloudinary.com/futurewise/image/upload/v1566029063/icons_fakfxf.png'
    };

    this.authService.setToken('data');

    this.authService.setUserInfo(jsonData);
    this.authService.setClientData({
      id: 2978, name: 'Aryendra Kumar Saxena'
    });
    // this.authService.setToken(loginData.payLoad);
    this.eventService.openSnackBar('Login SuccessFully', 'dismiss');
    this.router.navigate(['admin','subscription','dashboard']);
  }

  closeDialog(data) {
    const loginData = data;
    console.log(data);
    if (data.status === 200) {
      this.authService.setToken(loginData.payLoad);
      this.eventService.openSnackBar('Login SuccessFully ', 'dismiss');
      this.router.navigate(['/admin/service']);
    } else {
      this.eventService.openSnackBar(loginData.message, 'dismiss');
    }
  }

}

