import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../../../auth-service/authService';
import {Router} from '@angular/router';
import {EventService} from 'src/app/Data-service/event.service';
import {RoutingState} from 'src/app/services/routing-state.service';

@Component({
    selector: 'app-customer-overview',
    templateUrl: './customer-overview.component.html',
    styleUrls: ['./customer-overview.component.scss'],

})
export class CustomerOverviewComponent implements OnInit {
    showRouter: boolean = false;
    selected: number;
    clientData: any;
    loading: boolean;

    constructor(private authService: AuthService, private router: Router,
                private eventService: EventService, public routingStateService: RoutingState) {
        this.clientData = AuthService.getClientData();
        this.eventService.tabChangeData.subscribe(
            data => this.getTabChangeData(data)
        );
    }

    _value: any;

    set value(value: number) {
        console.log('now value is ->>>>', value);
        this._value = value;
    }

    ngOnInit() {
        console.log('overview is called');
        this.showRouter = true;
        this.selected = 1;
        this._value = 1;
        this.loading = false;
        const routeName = this.router.url.split('/')[3];
        console.log('CustomerComponent ngOnInit routeName : ', routeName);
        if (routeName == 'overview') {
            this.value = 1;
        } else if (routeName == 'myFeed') {
            this.value = 2;
        } else if (routeName == 'profile') {
            this.value = 3;
        } else if (routeName == 'documents') {
            this.value = 4;
        } else if (routeName == 'emails') {
            this.value = 5;
        } else if (routeName == 'subscription') {
            this.value = 5;
        } else if (routeName == 'settings') {
            this.value = 5;
        }
        // this.clientData = JSON.parse(sessionStorage.getItem('clientData'));
    }

    getTabChangeData(data) {
        setTimeout(() => {
            this._value = data;
            console.log('Document selected == ', data);
            this.loading = false;
        }, 300);
    }

    goToAdvisorHome() {
        this.showRouter = false;
        setTimeout(() => {
            this.routingStateService.goToSpecificRoute('/admin/subscription/dashboard');
        }, 200);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
