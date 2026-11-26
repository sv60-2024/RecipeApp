import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, filter, switchMap } from 'rxjs';
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
export class CatalogPage implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Ruta u admin-routing.module.ts kaže koji katalog ova strana prikazuje.
  protected readonly catalog: AdminCatalog = this.route.snapshot.data['catalog'];

  // Svaki put kad reload$ emituje, lista se ponovo učitava iz servisa.
  private readonly reload$ = new BehaviorSubject<void>(undefined);
  protected readonly items$ = this.reload$.pipe(
    switchMap(() => this.catalogService.getAll(this.catalog.kind)),
  );

  ngOnInit(): void {
    // IKS-22C: kategorija iz predloga. Predlozi (IKS-23) otvaraju ovu stranu kao
    // /admin/ingredient-categories?proposal=<naziv>, pa se forma otvara sa tim nazivom.
    const proposal = this.route.snapshot.queryParamMap.get('proposal');
    if (proposal && this.catalog.kind === 'ingredient-categories') {
      // Predlog se koristi samo jednom: uklanja se iz adrese, pa se forma otvara.
      this.router
        .navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true })
        .then(() => this.addFromProposal(proposal));
    }
  }

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

  private addFromProposal(name: string): void {
    this.openForm('Nova kategorija iz predloga', undefined, name)
      .pipe(switchMap((input) => this.catalogService.create(this.catalog.kind, input)))
      .subscribe(() => this.reload$.next());
  }

  // Otvara formu i vraća unete podatke. Ako korisnik otkaže, dijalog vraća prazan
  // rezultat ('' ili undefined), pa filter ne propušta ništa dalje.
  private openForm(
    title: string,
    item?: CatalogItem,
    initialName?: string,
  ): Observable<CatalogItemInput> {
    // Postojeći nazivi se uzimaju iz servisa, da bi forma prijavila duplikat.
    return this.catalogService.getAll(this.catalog.kind).pipe(
      switchMap((items) =>
        this.dialog
          .open<CatalogItemDialog, CatalogItemDialogData, CatalogItemInput>(CatalogItemDialog, {
            data: {
              title,
              item,
              initialName,
              withDescription: this.catalog.columns.some((column) => column.key === 'description'),
              existingNames: items.map((existing) => existing.name),
            },
          })
          .afterClosed(),
      ),
      filter((input): input is CatalogItemInput => !!input),
    );
  }
}
