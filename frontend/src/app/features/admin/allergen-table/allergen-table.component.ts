import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AllergenService } from '../../../core/services/allergen.service';
import { Allergen } from '../../../shared/models/allergen.model';

@Component({
  selector: 'app-allergen-table',
  standalone: false,
  templateUrl: './allergen-table.component.html',
  styleUrl: './allergen-table.component.css',
})
export class AllergenTable implements OnInit, AfterViewInit {
  private readonly allergenService = inject(AllergenService);

  protected readonly displayedColumns = ['id', 'name', 'description'];
  protected readonly dataSource = new MatTableDataSource<Allergen>([]);
  protected searchText = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.dataSource.filterPredicate = (allergen, filter) =>
      normalize(`${allergen.name} ${allergen.description}`).includes(filter);

    this.allergenService.getAll().subscribe((allergens) => (this.dataSource.data = allergens));
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

// Pretraga ne zavisi od velikih slova i kvačica: "orasasti" pronalazi "Orašasti plodovi".
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/đ/g, 'dj')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}