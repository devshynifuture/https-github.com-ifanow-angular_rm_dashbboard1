import {Injectable} from '@angular/core/src/metadata/*';
import {Router} from '@angular/router';
import {SettingsService} from '../setting/settings.service';
import {UtilService} from '../../../../services/util.service';
import {AuthService} from '../../../../auth-service/authService';
import {BehaviorSubject} from 'rxjs';
import {RoleService} from '../../../../auth-service/role.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionRoleService {

  transactionPermissionData = new BehaviorSubject<any>({});
  addArnRiaCredentials = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };

  doRedemptionTransaction = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };
  addSubbrokers = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };
  clientMapping = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };
  doPurchaseTransaction = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };
  doSipTransaction = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };
  doStpTransaction = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };
  doSwitchTransaction = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private utilService: UtilService,
    private authService: AuthService,
    private roleService: RoleService
  ) {
    console.log('TransactionRoleService constructor : ');

    this.roleService.getAllPermissionData().subscribe(allPermissionData => {
      console.log('TransactionRoleService allPermissionData transaction : ', allPermissionData);
      if (allPermissionData && allPermissionData.transact) {
        const transactModule = allPermissionData.transact;
        this.transactionPermissionData.next(transactModule.subModule);
        this.setAddArnRiaDetailPermission(transactModule.subModule.addArnRiaCredentials);
        this.setDoRedemptionTransactionPermission(transactModule.subModule.doRedemptionTransaction);
        console.log('TransactionRoleService allPermissionData transaction : ', transactModule.subModule);
      }
    });
  }

  setAddArnRiaDetailPermission(addArnRiaCredentialsData) {
    if (addArnRiaCredentialsData) {
      this.addArnRiaCredentials.showModule = addArnRiaCredentialsData.showModule;
      this.addArnRiaCredentials.capabilityList = addArnRiaCredentialsData.subModule.addArnRiaCredentials.capabilityList;
      this.addArnRiaCredentials.capabilityMap = UtilService.getCapabilityMap(this.addArnRiaCredentials.capabilityList);
      console.log('TransactionRoleService setAddArnRiaDetailPermission addArnRiaCredentials : ', this.addArnRiaCredentials);
    }
  }

  setDoRedemptionTransactionPermission(doRedemptionTransaction) {
    if (doRedemptionTransaction) {
      this.doRedemptionTransaction.showModule = doRedemptionTransaction.showModule;
      this.doRedemptionTransaction.capabilityList = doRedemptionTransaction.subModule.doRedemptionTransaction.capabilityList;
      this.doRedemptionTransaction.capabilityMap = UtilService.getCapabilityMap(this.doRedemptionTransaction.capabilityList);
      console.log('TransactionRoleService doRedemptionTransaction : ', this.doRedemptionTransaction);
    }
  }

}
