import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { DynamicLoaderService } from 'src/app/frontoffice/services/dynamic-loader.service';
import { ComponentRegistry } from './component-registry';
import { settings } from './elements';
import { BehaviorSubject } from 'rxjs';

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
    private platformService: PlateformeService
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
        console.log(this.platform.couleur);
        console.log(this.color.value);

        if (this.platform.content) {
          const content = JSON.parse(this.platform.content);
          this.selectedElements = Object.values(content)
            .map((element: any) => element.type.type)
            .filter(type => !!ComponentRegistry[type]);
          
          Object.values(content).forEach((element: any) => {
            const type = element.type.type;
            if (element.type.content) {
              settings[type as keyof typeof settings] = JSON.parse(element.type.content);
            }
          });

          this.loadSelectedComponents();
        }
      },
      error: (error) => {
        console.error('Error loading platform:', error);
      }
    });
  }
}
