import { Component, OnInit } from '@angular/core';
import { componentServcie } from 'src/app/services/plateforme/component.service';
import { Router } from '@angular/router';

type ComponentType = 'headerwithicons' | 'centeredhero' | 'herowithimage' | 'verticallycenteredhero' | 
                    'columnswithicons' | 'customcards' | 'headings' | 'headingleftwithimage' | 
                    'headingrightwithimage' | 'newsletter' | 'plateformeabout';

interface ComponentPlatforme {
  id: number;
  name: string; // Added name field
  type: ComponentType;
  content: string;
}

@Component({
  selector: 'app-componentlist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  components: ComponentPlatforme[] = [];
  searchTerm: string = '';
  selectedPreviewImage: string = '';
  selectedType: ComponentType | '' = ''; // Added type filter property
  currentPage: number = 1;
  itemsPerPage: number = 6;
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

  constructor(private componentService: componentServcie, private router: Router) {}

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

  ngOnInit(): void {
    this.loadComponents();
    
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

  previewComponent(component: ComponentPlatforme): void {
    this.selectedPreviewImage = this.categorizedComponents[component.type].preview;
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
      console.log(this.stats);
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
}
