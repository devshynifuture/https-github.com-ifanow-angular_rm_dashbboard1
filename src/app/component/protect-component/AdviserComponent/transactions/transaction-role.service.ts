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
  empanelledAmcList = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };
  folioMapping = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };
  investorsModule = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };
  kycModule = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };
  mandateModule = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };
  moduleVisibility = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };
  settingsVisibility = {
    showModule: true,
    capabilityList: [],
    capabilityMap: {view: true, add: true, edit: true, delete: true}
  };
  transactionsModule = {
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

        this.setEmpanelledAmcListPermission(transactModule.subModule.empanelledAmcList);
        this.setFolioMappingPermission(transactModule.subModule.folioMapping);
        this.setInvestorsModulePermission(transactModule.subModule.investorsModule);
        this.setKycModulePermission(transactModule.subModule.kycModule);
        this.setMandateModulePermission(transactModule.subModule.mandateModule);
        this.setModuleVisibilityPermission(transactModule.subModule.moduleVisibility);
        this.setSettingsVisibilityPermission(transactModule.subModule.settingsVisibility);
        this.setTransactionsModulePermission(transactModule.subModule.transactionsModule);
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

  setEmpanelledAmcListPermission(empanelledAmcList) {
    if (empanelledAmcList) {
      this.empanelledAmcList.showModule = empanelledAmcList.showModule;
      this.empanelledAmcList.capabilityList = empanelledAmcList.subModule.empanelledAmcList.capabilityList;
      this.empanelledAmcList.capabilityMap = UtilService.getCapabilityMap(this.empanelledAmcList.capabilityList);
      console.log('TransactionRoleService doSwpTransaction : ', this.empanelledAmcList);
    }
  }

  setFolioMappingPermission(folioMapping) {
    if (folioMapping) {
      this.folioMapping.showModule = folioMapping.showModule;
      this.folioMapping.capabilityList = folioMapping.subModule.folioMapping.capabilityList;
      this.folioMapping.capabilityMap = UtilService.getCapabilityMap(this.folioMapping.capabilityList);
      console.log('TransactionRoleService folioMapping : ', this.folioMapping);
    }
  }

  setInvestorsModulePermission(investorsModule) {
    if (investorsModule) {
      this.investorsModule.showModule = investorsModule.showModule;
      this.investorsModule.capabilityList = investorsModule.subModule.investorsModule.capabilityList;
      this.investorsModule.capabilityMap = UtilService.getCapabilityMap(this.investorsModule.capabilityList);
      console.log('TransactionRoleService investorsModule : ', this.investorsModule);
    }
  }

  setKycModulePermission(kycModule) {
    if (kycModule) {
      this.kycModule.showModule = kycModule.showModule;
      this.kycModule.capabilityList = kycModule.subModule.kycModule.capabilityList;
      this.kycModule.capabilityMap = UtilService.getCapabilityMap(this.kycModule.capabilityList);
      console.log('TransactionRoleService kycModule : ', this.kycModule);
    }
  }

  setMandateModulePermission(mandateModule) {
    if (mandateModule) {
      this.mandateModule.showModule = mandateModule.showModule;
      this.mandateModule.capabilityList = mandateModule.subModule.mandateModule.capabilityList;
      this.mandateModule.capabilityMap = UtilService.getCapabilityMap(this.mandateModule.capabilityList);
      console.log('TransactionRoleService mandateModule : ', this.mandateModule);
    }
  }

  setModuleVisibilityPermission(moduleVisibility) {
    if (moduleVisibility) {
      this.moduleVisibility.showModule = moduleVisibility.showModule;
      this.moduleVisibility.capabilityList = moduleVisibility.subModule.moduleVisibility.capabilityList;
      this.moduleVisibility.capabilityMap = UtilService.getCapabilityMap(this.moduleVisibility.capabilityList);
      console.log('TransactionRoleService moduleVisibility : ', this.moduleVisibility);
    }
  }

  setSettingsVisibilityPermission(settingsVisibility) {
    if (settingsVisibility) {
      this.settingsVisibility.showModule = settingsVisibility.showModule;
      this.settingsVisibility.capabilityList = settingsVisibility.subModule.settingsVisibility.capabilityList;
      this.settingsVisibility.capabilityMap = UtilService.getCapabilityMap(this.settingsVisibility.capabilityList);
      console.log('TransactionRoleService settingsVisibility : ', this.settingsVisibility);
    }
  }

  setTransactionsModulePermission(transactionsModule) {
    if (transactionsModule) {
      this.transactionsModule.showModule = transactionsModule.showModule;
      this.transactionsModule.capabilityList = transactionsModule.subModule.transactionsModule.capabilityList;
      this.transactionsModule.capabilityMap = UtilService.getCapabilityMap(this.transactionsModule.capabilityList);
      console.log('TransactionRoleService transactionsModule : ', this.transactionsModule);
    }
  }
}
