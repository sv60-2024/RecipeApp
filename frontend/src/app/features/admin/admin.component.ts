import { Component } from '@angular/core';
import { ADMIN_CATALOGS } from './admin-catalogs';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class Admin {
  protected readonly catalogs = ADMIN_CATALOGS;
}
