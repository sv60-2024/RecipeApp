import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, filter, switchMap, tap } from 'rxjs';
import { CatalogItemInput, CatalogService } from '../../../core/services/catalog.service';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CatalogItem } from '../../../shared/models/catalog-item.model';
import { AdminCatalog } from '../admin-catalogs';
import {
  CatalogItemDialog,
  CatalogItemDialogData,
} from '../catalog-item-dialog/catalog-item-dialog.component';

@Component({
  selector: 'app-catalog-page',
  standalone: false,
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.css',
})
export class CatalogPage {
  private readonly catalogService = inject(CatalogService);
  private readonly dialog = inject(MatDialog);

  // Ruta u admin-routing.module.ts kaže koji katalog ova strana prikazuje.
  protected readonly catalog: AdminCatalog = inject(ActivatedRoute).snapshot.data['catalog'];

  // Svaki put kad reload$ emituje, lista se ponovo učitava iz servisa.
  private readonly reload$ = new BehaviorSubject<void>(undefined);
  private items: CatalogItem[] = [];
  protected readonly items$ = this.reload$.pipe(
    switchMap(() => this.catalogService.getAll(this.catalog.kind)),
    tap((items) => (this.items = items)),
  );

  add(): void {
    this.openForm(`Nova stavka: ${this.catalog.label}`)
      .pipe(switchMap((input) => this.catalogService.create(this.catalog.kind, input)))
      .subscribe(() => this.reload$.next());
  }

  edit(item: CatalogItem): void {
    this.openForm(`Izmena: ${item.name}`, item)
      .pipe(switchMap((input) => this.catalogService.update(this.catalog.kind, item.id, input)))
      .subscribe(() => this.reload$.next());
  }

  remove(item: CatalogItem): void {
    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: 'Brisanje',
          message: `Da li sigurno želiš da obrišeš „${item.name}”?`,
          confirmText: 'Obriši',
        },
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        switchMap(() => this.catalogService.delete(this.catalog.kind, item.id)),
      )
      .subscribe(() => this.reload$.next());
  }

  // Otvara formu i vraća unete podatke. Ako korisnik otkaže, dijalog vraća prazan
  // rezultat ('' ili undefined), pa filter ne propušta ništa dalje.
  private openForm(title: string, item?: CatalogItem): Observable<CatalogItemInput> {
    return this.dialog
      .open<CatalogItemDialog, CatalogItemDialogData, CatalogItemInput>(CatalogItemDialog, {
        data: {
          title,
          item,
          withDescription: this.catalog.columns.some((column) => column.key === 'description'),
          existingNames: this.items.map((existing) => existing.name),
        },
      })
      .afterClosed()
      .pipe(filter((input): input is CatalogItemInput => !!input));
  }
}
