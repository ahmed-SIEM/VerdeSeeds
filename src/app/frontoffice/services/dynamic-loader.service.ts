import { Injectable, ComponentFactoryResolver, ViewContainerRef, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DynamicLoaderService {
  constructor(private resolver: ComponentFactoryResolver) {}

  loadComponent(
    container: ViewContainerRef,
    component: Type<any>,
    inputs: { [key: string]: any } = {}
  ) {
    const factory = this.resolver.resolveComponentFactory(component);
    const componentRef = container.createComponent(factory);

    // Assign inputs dynamically
    Object.keys(inputs).forEach(key => {
      componentRef.instance[key] = inputs[key];
    });

    return componentRef;
  }
}
