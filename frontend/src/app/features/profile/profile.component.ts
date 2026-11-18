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

  // Probni prijavljeni korisnik dok ne povežemo ISS backend.
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

  readonly profile$ = this.route.paramMap.pipe(
    map((params) => {
      const username = params.get('username') ?? this.demoCurrentUsername;

      return this.demoProfiles.find(
        (profile) => profile.username === username
      );
    })
  );
}