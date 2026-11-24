import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../../shared.module';
import { DataTable, TableColumn } from './data-table.component';

interface Row {
  id: number;
  name: string;
}

const COLUMNS: TableColumn<Row>[] = [
  { key: 'id', header: '#', sortable: true },
  { key: 'name', header: 'Naziv', sortable: true },
];

const ROWS: Row[] = ['Supa', 'Čorba', 'Ćufte', 'Cicvara', 'Pica', 'Sendvič', 'Burger'].map(
  (name, index) => ({ id: index + 1, name }),
);

describe('DataTable', () => {
  let fixture: ComponentFixture<DataTable<Row>>;
  let element: HTMLElement;

  const rows = () => element.querySelectorAll('tr[mat-row]');
  const names = () =>
    Array.from(rows(), (row) => row.querySelector('td.mat-column-name')?.textContent?.trim());

  const search = async (text: string) => {
    const input = element.querySelector('input') as HTMLInputElement;
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTable<Row>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should show 5 rows on the first page', () => {
    expect(rows().length).toBe(5);
  });

  it('should search without diacritics', async () => {
    await search('corba');
    expect(names()).toEqual(['Čorba']);
  });

  it('should show a message when nothing matches', async () => {
    await search('xyz');
    expect(rows().length).toBe(0);
    expect(element.textContent).toContain('Nema rezultata za „xyz”');
  });

  it('should sort by name in Serbian alphabetical order', async () => {
    const nameHeader = element.querySelector('th.mat-column-name') as HTMLElement;
    nameHeader.click();
    await fixture.whenStable();
    expect(names()).toEqual(['Burger', 'Cicvara', 'Čorba', 'Ćufte', 'Pica']);
  });
});
