import {ComponentFactoryResolver, Injectable,} from '@angular/core';

@Injectable(
  // { providedIn: 'root' }
)
export class DynamicComponentService {

  constructor(private factoryResolver: ComponentFactoryResolver) {
  }

  addDynamicComponent(viewContainerRef, component, data, popupHeaderText = '') {
    const componentFactory = this.factoryResolver.resolveComponentFactory(component);

    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance).data = data;

    // popupHeaderText is an input with default value in the respective components. Directly assigning changes the value inside it.
    if (popupHeaderText) {
      (componentRef.instance).popupHeaderText = popupHeaderText;
    }
    // component.data = data;
    // console.log('componentRef: ', componentRef);
    // console.log('data: ', data);
    // console.log('component: ', component);

    return componentRef;
  }
}
