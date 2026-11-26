import { CatalogKind } from '../../core/services/catalog.service';
import { TableColumn } from '../../shared/components/data-table/data-table.component';
import { CatalogItem } from '../../shared/models/catalog-item.model';

export interface AdminCatalog {
  kind: CatalogKind;
  label: string;
  columns: TableColumn<CatalogItem>[];
  editable: boolean;
}

const BASIC_COLUMNS: TableColumn<CatalogItem>[] = [
  { key: 'id', header: '#', sortable: true },
  { key: 'name', header: 'Naziv', sortable: true },
];

// Svaki katalog je jedan tab i jedna podruta admin dela (/admin/<kind>).
// Sve kataloge administrator može da dodaje, menja i briše (IKS-22B i IKS-22C).
export const ADMIN_CATALOGS: AdminCatalog[] = [
  { kind: 'meal-types', label: 'Tipovi obroka', columns: BASIC_COLUMNS, editable: true },
  { kind: 'dish-types', label: 'Tipovi jela', columns: BASIC_COLUMNS, editable: true },
  { kind: 'diet-types', label: 'Tipovi ishrane', columns: BASIC_COLUMNS, editable: true },
  {
    kind: 'ingredient-categories',
    label: 'Kategorije namirnica',
    columns: BASIC_COLUMNS,
    editable: true,
  },
  {
    kind: 'allergens',
    label: 'Alergeni',
    columns: [...BASIC_COLUMNS, { key: 'description', header: 'Opis' }],
    editable: true,
  },
];
