import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CatalogItemInput } from '../../../core/services/catalog.service';
import { CatalogItem } from '../../../shared/models/catalog-item.model';

export interface CatalogItemDialogData {
  title: string;
  item?: CatalogItem;
  withDescription: boolean;
  existingNames: string[];
}

@Component({
  selector: 'app-catalog-item-dialog',
  standalone: false,
  templateUrl: './catalog-item-dialog.component.html',
  styleUrl: './catalog-item-dialog.component.css',
})
export class CatalogItemDialog {
  protected readonly data = inject<CatalogItemDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef =
    inject<MatDialogRef<CatalogItemDialog, CatalogItemInput>>(MatDialogRef);

  protected readonly form = new FormGroup({
    name: new FormControl(this.data.item?.name ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(50),
        notBlank,
        uniqueName(this.data.existingNames, this.data.item?.name),
      ],
    }),
    description: new FormControl(this.data.item?.description ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(200)],
    }),
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, description } = this.form.getRawValue();
    this.dialogRef.close(
      this.data.withDescription
        ? { name: name.trim(), description: description.trim() }
        : { name: name.trim() },
    );
  }
}

// Naziv ne sme biti sastavljen samo od razmaka.
function notBlank(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim() === '' ? { blank: true } : null;
}

// Naziv ne sme da postoji u katalogu (bez obzira na velika i mala slova).
// Kod izmene se sopstveni stari naziv ne računa.
function uniqueName(existingNames: string[], currentName?: string) {
  const taken = existingNames
    .filter((name) => name !== currentName)
    .map((name) => name.trim().toLowerCase());
  return (control: AbstractControl<string>): ValidationErrors | null =>
    taken.includes(control.value.trim().toLowerCase()) ? { duplicate: true } : null;
}
