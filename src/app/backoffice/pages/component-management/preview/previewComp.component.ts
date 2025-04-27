import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { componentServcie } from 'src/app/services/plateforme/component.service';
import { DynamicLoaderService } from 'src/app/frontoffice/services/dynamic-loader.service';
import { BehaviorSubject } from 'rxjs';
import { ComponentRegistry } from '../../platform-management/preview/component-registry';

type ComponentType = 'headerwithicons' | 'centeredhero' | 'herowithimage' | 'verticallycenteredhero' |
  'columnswithicons' | 'customcards' | 'headings' | 'headingleftwithimage' |
  'headingrightwithimage' | 'newsletter' | 'plateformeabout';

interface ComponentData {
  id: number;
  name: string;
  type: string;
  content: string;
  user: any;
}

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewCompComponent implements OnInit {
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true }) dynamicContainer!: ViewContainerRef;
  
  componentData: ComponentData | null = null;
  componentContent: any = {};
  isLoading: boolean = true;
  error: string | null = null;
  color = new BehaviorSubject<string>("#273F4F");
  colorValue: string = "#273F4F";

  // Display name mapping for component types
  componentDisplayNames: Record<string, string> = {
    headerwithicons: 'Header with Icons',
    centeredhero: 'Centered Hero',
    herowithimage: 'Hero with Image',
    verticallycenteredhero: 'Vertically Centered Hero',
    columnswithicons: 'Columns with Icons',
    customcards: 'Custom Cards',
    headings: 'Headings',
    headingleftwithimage: 'Heading Left with Image',
    headingrightwithimage: 'Heading Right with Image',
    newsletter: 'Newsletter',
    plateformeabout: 'Plateforme About'
  };

  ELEMENTS_FIELDS: Record<ComponentType, string[]> = {
    headerwithicons: [
      "title", "subtitle", "Ftitle", "Ficon",
      "Stitle", "Sicon", "Ttitle", "Ticon",
      "Ptitle", "Picon"
    ],
    centeredhero: [
      "title", "subtitle", "imageUrl"
    ],
    herowithimage: [
      "title", "subtitle", "imageUrl"
    ],
    verticallycenteredhero: [
      "title", "subtitle"
    ],
    columnswithicons: [
      "MainTitle", "Ftitle", "Fdescription", "Ficon",
      "Stitle", "Sdescription", "Sicon",
      "Ttitle", "Tdescription", "Ticon"
    ],
    customcards: [
      "MainTitle", "Ftitle", "Fimage",
      "Stitle", "Simage", "Ttitle", "Timage"
    ],
    headings: [
      "Ftitle", "Fdescription", "Fimage",
      "Stitle", "Sdescription", "Simage",
      "Ttitle", "Tdescription", "Timage"
    ],
    headingleftwithimage: [
      "title", "subtitle", "imageUrl"
    ],
    headingrightwithimage: [
      "title", "subtitle", "imageUrl"
    ],
    newsletter: [
      "titleA", "TextB", "TextC", "Image"
    ],
    plateformeabout: [
      "title1", "title2", "description", "imageUrl"
    ]
  };

  constructor(
    private componentService: componentServcie,
    private route: ActivatedRoute,
    private router: Router,
    private dynamicLoader: DynamicLoaderService
  ) {
    this.color.subscribe(value => {
      this.colorValue = value;
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.isLoading = true;
      this.componentService.getComponent(+id).subscribe({
        next: (data) => {
          this.componentData = data;
          console.log('Component data:', data);
          
          if (data.content) {
            try {
              this.componentContent = JSON.parse(data.content);
              this.loadComponentPreview(data.type, this.componentContent);
            } catch (e) {
              this.error = 'Failed to parse component content';
              console.error('Error parsing component content:', e);
            }
          }
          
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Failed to load component';
          console.error('Error fetching component data:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'No component ID provided';
      this.isLoading = false;
    }
  }

  loadComponentPreview(type: string, content: any): void {
    if (!this.dynamicContainer) {
      console.error('Dynamic container not available');
      return;
    }
    
    this.dynamicContainer.clear();
    const componentType = ComponentRegistry[type];
    
    if (componentType) {
      this.dynamicLoader.loadComponent(
        this.dynamicContainer,
        componentType,
        {
          ...content,
          color: this.color.value
        }
      );
    } else {
      this.error = `Component type '${type}' not found in registry`;
      console.error('Component type not found:', type);
    }
  }

  getComponentDisplayName(type: string): string {
    return this.componentDisplayNames[type] || type;
  }

  goBack(): void {
    this.router.navigate(['/backoffice/component']);
  }

  editComponent(): void {
    if (this.componentData?.id) {
      this.router.navigate(['/backoffice/component', this.componentData.id, 'edit']);
    }
  }
}
