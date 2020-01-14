import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { BackOfficeService } from '../../protect-component/AdviserComponent/backOffice/back-office.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import $ from 'jquery';
import { MatProgressButtonOptions } from "../../../common/progress-button/progress-button.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('btnProgress', [
      state('state1', style({
        width: '0%',
        backgroundColor: 'green',
        display: 'block'
      })),
      state('state2', style({
        width: '100%',
        backgroundColor: 'green',
        display: 'block',
        transition: '0.3s'
      })),
      transition('state1 => state2', animate('2000s')),
      transition('state2 =>state1', animate('0s'))
    ])
  ]
})
export class LoginComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Login',
    buttonColor: 'accent',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 0,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  }

  constructor(
    private formBuilder: FormBuilder, private eventService: EventService,
    public backOfficeService: BackOfficeService,
    public router: Router,
    private authService: AuthService, private eleRef: ElementRef) {
  }

  @ViewChild('animationSpan', {
    read: ElementRef,
    static: true
  }) animationSpan: ElementRef;
  btnProgressData: any;

  // @HostListener('click', ['$event.target'])
  // onclick() {
  //   console.log("animate")
  // }
  loginForm: FormGroup;

  isLoading = false;

  ngOnInit() {
    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(['admin', 'subscription', 'dashboard']);
    // } else {
    this.createForm();
    // }
    this.btnProgressData = "state1";
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
      // this.onSubmit();
    }
  }

  onSubmit() {
    // console.log(event)

    // this.authService.setToken('12333nhsdhdh1233');
    // this.authService.setUserInfo('https://res.cloudinary.com/futurewise/image/upload/v1566029063/icons_fakfxf.png');
    // this.router.navigate(['/admin/subscription']);
    if (this.loginForm.valid) {
      const loginData = {
        userName: this.loginForm.controls.name.value,
        password: this.loginForm.controls.password.value,
        roleId: 1
      };
      this.isLoading = true;
      // this.hardCodeLoginForTest();
      this.backOfficeService.loginApi(loginData).subscribe(
        data => {
          this.isLoading = false;
          // this.setTimeOutRecursive(event, 100)
          if (data) {
            console.log('data: ', data);
            this.authService.setToken(data.token);
            if (!data.advisorId) {
              data.advisorId = data.adminAdvisorId;
            }
            this.authService.setUserInfo(data);
            // this.eventService.openSnackBar('Login SuccessFully', 'dismiss');
            this.router.navigate(['admin', 'subscription', 'dashboard']);
            // Hard coded client login for testing
            this.authService.setClientData({
              id: 2978, name: 'Aryendra Kumar Saxena'
            });

          }
        },
        err => {
          this.isLoading = false;
          console.log('error on login: ', err);
          this.eventService.openSnackBar(err, 'dismiss');
        }
      );
    }
  }

  setTimeOutRecursive(event, widthPercent) {
    setTimeout(() => {
      if (this.isLoading && widthPercent <= 90) {
        $(event.toElement).animate({ width: widthPercent + '%' }, '500ms').css({ width: '0%' });
        this.setTimeOutRecursive(event, widthPercent + 10);
        // this.animationSpan.nativeElement.animate({width: i + '%'}, '100ms');
      } else if (!this.isLoading) {
        $(event.toElement).animate({ width: '100%' }, '500ms').css({ width: '0%' });
      }
    }, 500);
  }

  onEnterPressed() {
    console.log(" on enter pressed sdkvjasbhkdj");
  }

  hardCodeLoginForTest() {
    const jsonData = {
      advisorId: 2808,
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
    this.router.navigate(['admin', 'subscription', 'dashboard']);
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

  progressButtonClick() {
    this.barButtonOptions.active = true;
    // this.barButtonOptions.disabled = true;
    this.barButtonOptions.value = 0;
    this.setTimeOutRecursiveForProgressValue(0);
    this.onSubmit();
    // this.barButtonOptions.text = 'Saving Data...';
    setTimeout(() => {
      this.barButtonOptions.active = false;
      // this.barButtonOptions.disabled = true;
      // this.barButtonOptions.text = 'Login';
    }, 3500);
  }

  setTimeOutRecursiveForProgressValue(progressValue) {
    setTimeout(() => {
      if (this.barButtonOptions.active) {
        this.barButtonOptions.value = progressValue;
        this.setTimeOutRecursiveForProgressValue(progressValue + 10);
      } else {
        this.barButtonOptions.value = 0;

      }
    }, 250);
  }

}

