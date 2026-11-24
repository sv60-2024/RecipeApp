import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogService } from '../../../core/services/catalog.service';
import { AdminCatalog } from '../admin-catalogs';

@Component({
  selector: 'app-catalog-page',
  standalone: false,
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.css',
})
export class CatalogPage {
  private readonly catalogService = inject(CatalogService);

  // Ruta u admin-routing.module.ts kaže koji katalog ova strana prikazuje.
  protected readonly catalog: AdminCatalog = inject(ActivatedRoute).snapshot.data['catalog'];
  protected readonly items$ = this.catalogService.getAll(this.catalog.kind);
}
