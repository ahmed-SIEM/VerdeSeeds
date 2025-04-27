import { 
  Component, 
  OnInit, 
  ViewChild, 
  ViewContainerRef, 
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { componentServcie } from 'src/app/services/plateforme/component.service';
import { BehaviorSubject } from 'rxjs';
import { ComponentRegistry } from '../../platform-management/preview/component-registry';
import { settings } from '../../platform-management/preview/elements';
import { DynamicLoaderService } from 'src/app/frontoffice/services/dynamic-loader.service';

interface ComponentData {
  id: number;
  type: string;
  name: string;
  content: string;
}

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewCompComponent implements OnInit, AfterViewInit {
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true }) 
  dynamicContainer!: ViewContainerRef;

  componentData: ComponentData | null = null;
  componentContent: any = {};
  isLoading = true;
  error: string | null = null;
  color = new BehaviorSubject<string>("#273F4F");
  colorValue = "#273F4F";

  onColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.color.next(input.value);
    this.loadSingleComponent();
  }

  constructor(
    private componentService: componentServcie,
    private route: ActivatedRoute,
    private router: Router,
    private dynamicLoader: DynamicLoaderService,
  ) {
    this.color.subscribe(value => {
      this.colorValue = value;
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.handleError('No component ID provided');
      return;
    }

    this.loadComponent(+id);
  }

  ngAfterViewInit(): void {
    // If view initializes after data loads, ensure component is loaded
    if (this.componentData) {
      this.loadSingleComponent();
    }
  }

  private loadComponent(id: number): void {
    this.isLoading = true;
    this.componentService.getComponent(id).subscribe({
      next: (data) => {
        this.componentData = data;
        try {
          this.componentContent = data.content ? JSON.parse(data.content) : {};
          this.loadSingleComponent();
        } catch (e) {
          this.handleError('Failed to parse component content');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError('Failed to load component data');
      }
    });
  }

  private loadSingleComponent(): void {
    if (!this.dynamicContainer || !this.componentData) {
      return;
    }

    try {
      this.dynamicContainer.clear();
      
      const componentType = ComponentRegistry[this.componentData.type];
      if (!componentType) {
        throw new Error(`Component type '${this.componentData.type}' not registered`);
      }

      const componentSettings = settings[this.componentData.type as keyof typeof settings] || {};
      const mergedData = {
        ...componentSettings,
        ...this.componentContent,
        color: this.color.value
      };

      this.dynamicLoader.loadComponent(
        this.dynamicContainer,
        componentType,
        mergedData
      );

    } catch (error) {
      this.handleError(`Failed to load component: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private handleError(message: string): void {
    this.error = message;
    this.isLoading = false;
    console.error(message);
  }

  getComponentDisplayName(type: string): string {
    const names = {
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
      plateformeabout: 'About Section',
    };
    return names[type as keyof typeof names] || type;
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