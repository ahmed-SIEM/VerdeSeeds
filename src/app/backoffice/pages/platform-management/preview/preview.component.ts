import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { DynamicLoaderService } from 'src/app/frontoffice/services/dynamic-loader.service';
import { ComponentRegistry } from './component-registry';
import { settings } from './elements';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { componentServcie } from 'src/app/services/plateforme/component.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html'
})
export class PreviewComponent implements OnInit {
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true }) dynamicContainer!: ViewContainerRef;

  selectedElements: string[] = [];
  color = new BehaviorSubject<string>("#FEBA17");
  platform: any;

  constructor(
    private dynamicLoader: DynamicLoaderService,
    private route: ActivatedRoute,
    private platformService: PlateformeService,
    private componentService : componentServcie
  ) { }

  loadSelectedComponents() {
    this.dynamicContainer.clear();
    this.selectedElements.forEach(elementKey => {
      const componentType = ComponentRegistry[elementKey];
      if (componentType) {
        this.dynamicLoader.loadComponent(
          this.dynamicContainer, 
          componentType,
          {
            ...settings[elementKey as keyof typeof settings],
            color: this.color.value
          }
        );
      }
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.platformService.getPlateforme(+id).subscribe({
      next: (data) => {
        this.platform = data;
        this.color.next(this.platform.couleur);
        if (this.platform.content) {
          const content = JSON.parse(this.platform.content);
          this.selectedElements = Object.values(content)
            .map((element: any) => element.type.type)
            .filter(type => ComponentRegistry[type]);
          
          // Create an array of observables for all component requests
          const componentRequests = Object.values(content).map((element: any) => 
            this.componentService.getComponent(element.type.id)
          );

          // Wait for all component requests to complete
          forkJoin(componentRequests).subscribe({
            next: (components) => {
              // Update settings for all components
              components.forEach(component => {
                const type = component.type;
                settings[type as keyof typeof settings] = JSON.parse(component.content);
              });
              
              // Load components after all settings are updated
              this.loadSelectedComponents();
            },
            error: (error) => {
              console.error('Error loading components:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error loading platform:', error);
      }
    });
  }
}
