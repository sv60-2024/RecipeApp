import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface TableColumn<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
}

const collator = new Intl.Collator('sr-Latn', { numeric: true });

@Component({
  selector: 'app-data-table',
  standalone: false,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTable<T extends object> implements AfterViewInit {
  @Input({ required: true }) columns: TableColumn<T>[] = [];
  @Input() pageSize = 5;
  @Input() editable = false;

  @Input({ required: true })
  set data(rows: T[]) {
    this.dataSource.data = rows;
  }

  @Output() edit = new EventEmitter<T>();
  @Output() remove = new EventEmitter<T>();

  protected readonly dataSource = new MatTableDataSource<T>([]);
  protected searchText = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    // Pretraga gleda sve kolone i ne zavisi od velikih slova i kvačica.
    this.dataSource.filterPredicate = (row, filter) =>
      normalize(this.columns.map((column) => String(row[column.key] ?? '')).join(' ')).includes(
        filter,
      );

    // Sortiranje po redosledu srpske latinice (C, Č, Ć, D...); brojevi se porede kao brojevi.
    this.dataSource.sortData = (rows, sort) => {
      const key = sort.active as keyof T;
      const direction = sort.direction === 'asc' ? 1 : sort.direction === 'desc' ? -1 : 0;
      if (!key || direction === 0) {
        return rows;
      }
      return [...rows].sort(
        (a, b) => direction * collator.compare(String(a[key] ?? ''), String(b[key] ?? '')),
      );
    };
  }

  protected get displayedColumns(): string[] {
    const keys = this.columns.map((column) => column.key);
    return this.editable ? [...keys, 'actions'] : keys;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    this.dataSource.filter = normalize(this.searchText);
    this.paginator.firstPage();
  }
}

// "orasasti" pronalazi "Orašasti plodovi": mala slova, bez kvačica, đ -> dj.
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/đ/g, 'dj')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}
