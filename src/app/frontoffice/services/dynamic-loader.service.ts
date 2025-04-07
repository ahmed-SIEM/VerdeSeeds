import { ComponentFactoryResolver, Injectable, Type, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicLoaderService {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  loadComponent(container: ViewContainerRef, component: Type<any>, props: any = {}) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = container.createComponent(componentFactory);
    
    // Set the properties on the component instance
    Object.assign(componentRef.instance, props);
    
    return componentRef;
  }
}
