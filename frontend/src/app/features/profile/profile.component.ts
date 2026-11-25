import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

interface UserProfile {
  username: string;
  profilePictureUrl: string;
  region: string;
  bio?: string;
  publishedRecipeCount: number;
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class Profile {
  private readonly route = inject(ActivatedRoute);

  // Probni prijavljeni korisnik dok ne povežemo backend.
  private readonly demoCurrentUsername = 'andrej';

  private readonly demoProfiles: UserProfile[] = [
    {
      username: 'andrej',
      profilePictureUrl: 'profile-placeholder.svg',
      region: 'Novi Sad',
      bio: 'I enjoy trying new recipes and sharing my favorites.',
      publishedRecipeCount: 3,
    },
    {
      username: 'marko',
      profilePictureUrl: 'profile-placeholder.svg',
      region: 'Vojvodina',
      publishedRecipeCount: 0,
    },
  ];

  // Podaci profila koji se trenutno prikazuje.
  readonly profile$ = this.route.paramMap.pipe(
    map((params) => {
      const username = params.get('username') ?? this.demoCurrentUsername;

      return this.demoProfiles.find((profile) => profile.username === username);
    }),
  );

  // Da li je forma za izmenu otvorena?
  isEditing = false;

  // Privremene vrednosti tokom izmene profila.
  editedRegion = '';
  editedBio = '';
  editedProfilePictureUrl = '';

  // Otvaranje forme.
  startEditing(profile: UserProfile): void {
    if (profile.username !== this.demoCurrentUsername) {
      return;
    }

    this.editedRegion = profile.region;
    this.editedBio = profile.bio ?? '';
    this.editedProfilePictureUrl = profile.profilePictureUrl;

    this.isEditing = true;
  }

  // Zatvaranje forme bez čuvanja izmena.
  saveChanges(): void {
    console.log('Save Changes clicked!');
    const region = this.editedRegion.trim();
    const bio = this.editedBio.trim();

    // Region je obavezan.
    if (!region) {
      alert('Region cannot be empty.');
      return;
    }

    // Pronalazimo profil prijavljenog korisnika.
    const profile = this.demoProfiles.find(
      (profile) => profile.username === this.demoCurrentUsername,
    );

    if (!profile) {
      return;
    }

    // Čuvamo izmene.
    profile.region = region;
    profile.bio = bio;
    profile.profilePictureUrl = this.editedProfilePictureUrl;

    // Zatvaramo formu.
    this.isEditing = false;
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  onProfilePictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5 MB.');
      input.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.editedProfilePictureUrl = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
}
