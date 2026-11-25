# RecipeApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.30.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## IKS-24A: Home navigation and popular recipes

Trello: https://trello.com/c/jVJkp0DD/32-iks-24a-home-navigation-and-popular-recipes

Open `/` or `/home`. Popular recipes are shown immediately, ranked by their
average rating **during the previous calendar month**, highest first. Ratings
from the current month or older months are ignored. Recipes with no ratings
in that period are omitted. Equal averages are ordered by rating count and
then recipe name. The displayed month updates when the Home component opens.

`RecipeService` currently supplies demo recipes, just as `CatalogService`
supplies demo catalogs. Rating dates are relative to today so the sample
remains usable each month. Replace this data source with the ISS API when
available; the UI is not connected to a backend yet.

The main navigation links to existing Home, Profile and (for admins) Admin
routes. Recipe detail routes and other future features are not part of this
card. Andrej's profile implementation must be merged separately; this branch
does not copy his unmerged work. IKS-24B is not implemented here yet.

### Manual verification

1. Run `npm ci`, then `npm start`, and open `http://localhost:4200/`.
2. Confirm the root redirects to `/home` and Home is marked as the current page.
3. Confirm the previous month is displayed and the demo recipes are ordered:
   pancakes (4.75), pasta (4.5), risotto (4.0). The salad has only a current-month
   rating and must not appear.
4. Open Profile and return Home using the navigation.
5. Use the existing temporary role selector to select Admin. Open Admin, then
   select Guest: the app returns Home and hides the Admin link.

Validation: `npm run build` and `npm test -- --watch=false`. The tests cover
ranking, calendar boundaries (including January), invalid/unrated data, loading,
empty and error states, plus the existing app/admin/table checks.

On the installed Node 26 runtime, jsdom tests need Node's native Web Storage
disabled so they use jsdom's localStorage. In PowerShell, set this for the
test process before running the tests:

```powershell
$env:NODE_OPTIONS = '--no-experimental-webstorage'
npm test -- --watch=false
```
