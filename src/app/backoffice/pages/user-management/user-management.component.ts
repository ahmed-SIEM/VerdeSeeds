import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];

  constructor(private cs: CommonService) {}

  ngOnInit() {
    this.cs.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Utilisateurs récupérés :', this.users);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    });
  }
}
