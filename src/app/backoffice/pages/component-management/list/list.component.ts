import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { componentServcie } from 'src/app/services/plateforme/component.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

type ComponentType = 'headerwithicons' | 'centeredhero' | 'herowithimage' | 'verticallycenteredhero' | 
                    'columnswithicons' | 'customcards' | 'headings' | 'headingleftwithimage' | 
                    'headingrightwithimage' | 'newsletter' | 'plateformeabout';

interface ComponentPlatforme {
  id: number;
  name: string; // Added name field
  type: ComponentType;
  content: string;
}

interface output {
  content: string;
  type: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-componentlist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild('recommendationDialog') recommendationDialog!: ElementRef<HTMLDialogElement>;
  components: ComponentPlatforme[] = [];
  searchTerm: string = '';
  selectedPreviewImage: string = '';
  selectedType: ComponentType | '' = ''; // Added type filter property
  currentPage: number = 1;
  itemsPerPage: number = 5;
  stats: any = {
    headerwithicons: 0,
    centeredhero: 0,
    herowithimage: 0,
    verticallycenteredhero: 0,
    columnswithicons: 0,
    customcards: 0,
    headings: 0,
    headingleftwithimage: 0,
    headingrightwithimage: 0,
    newsletter: 0,
    plateformeabout: 0
  };
  topComponents: {type: ComponentType, count: number}[] = []; // Update the type definition
  output :  output = {
    content: '',
    type: '',
    name: '',
    description: ''
  };
  isLoading: boolean = false;
 userid = 1;
 user: any[] = [];
  constructor(
    private commonservice: CommonService,
    private componentService: componentServcie, private router: Router) {}

  categorizedComponents: Record<ComponentType, { name: string; preview: string }> = {
    headerwithicons: { name: 'Header with Icons', preview: '../../../../../assets/backoffice/img/preview-images/CustomHeaderWithIcons.png' },
    centeredhero: { name: 'Centered Hero', preview: '../../../../../assets/backoffice/img/preview-images/HeadingWithImageTitle.png' },
    herowithimage: { name: 'Hero with Image', preview: '../../../../../assets/backoffice/img/preview-images/HeadingRightWithImageTitle.png' },
    verticallycenteredhero: { name: 'Vertically Centered Hero', preview: '../../../../../assets/backoffice/img/preview-images/VerticallyCenteredHeroSignUpForm.png' },
    columnswithicons: { name: 'Columns with Icons', preview: '../../../../../assets/backoffice/img/preview-images/ColumnsWithIcons.png' },
    customcards: { name: 'Custom Cards', preview: '../../../../../assets/backoffice/img/preview-images/CustomCards.png' },
    headings: { name: 'Headings', preview: '../../../../../assets/backoffice/img/preview-images/Headings.png' },
    headingleftwithimage: { name: 'Heading Left with Image', preview: '../../../../../assets/backoffice/img/preview-images/LeftImage.png' },
    headingrightwithimage: { name: 'Heading Right with Image', preview: '../../../../../assets/backoffice/img/preview-images/RightImage.png' },
    newsletter: { name: 'Newsletter', preview: '../../../../../assets/backoffice/img/preview-images/Newsletter.png' },
    plateformeabout: { name: 'Plateforme About', preview: '../../../../../assets/backoffice/img/preview-images/AboutUs.png' }
  };

  toString(elemnt: any): string {
    return JSON.stringify(elemnt);
  }
  loaduser() {
    this.commonservice.getUserById(this.userid).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  ngOnInit(): void {
    this.loadComponents();
    this.loaduser();
    
  }

  get filteredComponentsList() {
    const filtered = this.components.filter(component => {
      const matchesSearch = !this.searchTerm || 
        component.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        component.name.toLowerCase().includes(this.searchTerm.toLowerCase()); // Added name search
      const matchesType = !this.selectedType || component.type === this.selectedType; // Added type filter
      return matchesSearch && matchesType;
    });

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    const filtered = this.components.filter(component => {
      const matchesSearch = !this.searchTerm || 
        component.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        component.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = !this.selectedType || component.type === this.selectedType;
      return matchesSearch && matchesType;
    });
    return Math.ceil(filtered.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  loadComponents(): void {
    this.componentService.getComponents().subscribe(data => {
      this.components = data;
    });
    this.loadstats();
  }

  deleteComponent(id: number): void {
    if (confirm('Are you sure you want to delete this component?')) {
      this.componentService.deleteComponent(id).subscribe(() => {
        this.loadComponents();
      });
    }
  }

  editComponent(component: any): void {
    this.router.navigate(['/backoffice/component', component.id, 'edit']);
  }

  PreviewComponent(id: any): void {
    this.router.navigate(['/backoffice/component', id]);

  }

  addComponent(): void {
    this.router.navigate(['/backoffice/component', 'add']);
  }

  loadstats(): void {
    this.componentService.getusageRate().subscribe(data => {
      this.stats = data;
      this.topComponents = Object.entries(this.stats)
        .map(([type, count]) => ({
          type: type as ComponentType, // Cast the type to ComponentType
          count: count as number
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6); // Changed from 3 to 6 to show top 6 components
    });
  }

  getelementtype(type: string): string {
    switch (type) {
      case 'headerwithicons':
        return 'Header with Icons';
      case 'centeredhero':
        return 'Centered Hero';
      case 'herowithimage':
        return 'Hero with Image';
      case 'verticallycenteredhero':
        return 'Vertically Centered Hero';
      case 'columnswithicons':
        return 'Columns with Icons';
      case 'customcards':
        return 'Custom Cards';
      case 'headings':
        return 'Headings';
      case 'headingleftwithimage':
        return 'Heading Left with Image';
      case 'headingrightwithimage':
        return 'Heading Right with Image';
      case 'newsletter':
        return 'Newsletter';
      case 'plateformeabout':
        return 'Plateforme About';
      default:
        return '';
    }

  }

  async generateRecommandation(type: ComponentType): Promise<void> {
    try {
      const requestBody = JSON.stringify({ type });

      const response = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: requestBody
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      this.output = result;
      this.output.content = JSON.stringify(this.output.content)
    } catch (error) {
      console.error('Error getting recommendation:', error);
    }
  }

  openDialog() {
    this.recommendationDialog.nativeElement.showModal();
  }

  closeDialog() {
    this.recommendationDialog.nativeElement.close();
  }

  async startRecommendation(type: string): Promise<void> {
    if (!type) {
      alert('Please select a component type');
      return;
    }

    const componentType = type as ComponentType;
    this.closeDialog();
    
    this.isLoading = true;
    try {
      await this.generateRecommandation(componentType);
      console.log('Recommendation output:', this.output);

      if(confirm(`Dont Forget To edit and add your own Images`)){
        const newComponent: any = {
          name: this.output.name,
          type: this.output.type,
          content: this.output.content,
          user: this.user 
        };

        this.componentService.createComponent(newComponent).subscribe(() => {
          this.loadComponents();
        });
      }
    


    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
