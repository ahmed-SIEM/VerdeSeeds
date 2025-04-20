import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Sponsor{
  datapartenariat: string;
  logo: string;
  nomSponsor: string;
}
@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class SponsorsComponent implements OnInit {
  @Input() Sponsors: Sponsor[] = [];
  @Input() color: string = 'blue';
  
  ngOnInit() {
    // Set CSS variable based on sponsors count
    document.documentElement.style.setProperty('--sponsor-count', this.Sponsors.length.toString());
  }
}
