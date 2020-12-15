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
  doSwpTransaction = {
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
        this.setAddSubbrokersPermission(transactModule.subModule.addSubbrokers);
        this.setClientMappingPermission(transactModule.subModule.clientMapping);
        this.setDoPurchaseTransactionPermission(transactModule.subModule.doPurchaseTransaction);
        this.setDoStpTransactionPermission(transactModule.subModule.doStpTransaction);
        this.setDoSipTransactionPermission(transactModule.subModule.doSipTransaction);
        this.setDoSwitchTransactionPermission(transactModule.subModule.doSwitchTransaction);
        this.setDoSwpTransactionPermission(transactModule.subModule.doSwpTransaction);
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

  setAddSubbrokersPermission(addSubbrokers) {
    if (addSubbrokers) {
      this.addSubbrokers.showModule = addSubbrokers.showModule;
      this.addSubbrokers.capabilityList = addSubbrokers.subModule.addSubbrokers.capabilityList;
      this.addSubbrokers.capabilityMap = UtilService.getCapabilityMap(this.addSubbrokers.capabilityList);
      console.log('TransactionRoleService addSubbrokers : ', this.addSubbrokers);
    }
  }

  setClientMappingPermission(clientMapping) {
    if (clientMapping) {
      this.clientMapping.showModule = clientMapping.showModule;
      this.clientMapping.capabilityList = clientMapping.subModule.clientMapping.capabilityList;
      this.clientMapping.capabilityMap = UtilService.getCapabilityMap(this.clientMapping.capabilityList);
      console.log('TransactionRoleService clientMapping : ', this.clientMapping);
    }
  }

  setDoPurchaseTransactionPermission(doPurchaseTransaction) {
    if (doPurchaseTransaction) {
      this.doPurchaseTransaction.showModule = doPurchaseTransaction.showModule;
      this.doPurchaseTransaction.capabilityList = doPurchaseTransaction.subModule.doPurchaseTransaction.capabilityList;
      this.doPurchaseTransaction.capabilityMap = UtilService.getCapabilityMap(this.doPurchaseTransaction.capabilityList);
      console.log('TransactionRoleService doPurchaseTransaction : ', this.doPurchaseTransaction);
    }
  }

  setDoStpTransactionPermission(doStpTransaction) {
    if (doStpTransaction) {
      this.doStpTransaction.showModule = doStpTransaction.showModule;
      this.doStpTransaction.capabilityList = doStpTransaction.subModule.doStpTransaction.capabilityList;
      this.doStpTransaction.capabilityMap = UtilService.getCapabilityMap(this.doStpTransaction.capabilityList);
      console.log('TransactionRoleService doStpTransaction : ', this.doStpTransaction);
    }
  }

  setDoSipTransactionPermission(doSipTransaction) {
    if (doSipTransaction) {
      this.doSipTransaction.showModule = doSipTransaction.showModule;
      this.doSipTransaction.capabilityList = doSipTransaction.subModule.doSipTransaction.capabilityList;
      this.doSipTransaction.capabilityMap = UtilService.getCapabilityMap(this.doSipTransaction.capabilityList);
      console.log('TransactionRoleService doSipTransaction : ', this.doSipTransaction);
    }
  }

  setDoSwitchTransactionPermission(doSwitchTransaction) {
    if (doSwitchTransaction) {
      this.doSwitchTransaction.showModule = doSwitchTransaction.showModule;
      this.doSwitchTransaction.capabilityList = doSwitchTransaction.subModule.doSwitchTransaction.capabilityList;
      this.doSwitchTransaction.capabilityMap = UtilService.getCapabilityMap(this.doSwitchTransaction.capabilityList);
      console.log('TransactionRoleService doSwitchTransaction : ', this.doSwitchTransaction);
    }
  }

  setDoSwpTransactionPermission(doSwpTransaction) {
    if (doSwpTransaction) {
      this.doSwpTransaction.showModule = doSwpTransaction.showModule;
      this.doSwpTransaction.capabilityList = doSwpTransaction.subModule.doSwpTransaction.capabilityList;
      this.doSwpTransaction.capabilityMap = UtilService.getCapabilityMap(this.doSwpTransaction.capabilityList);
      console.log('TransactionRoleService doSwpTransaction : ', this.doSwpTransaction);
    }
  }


}
