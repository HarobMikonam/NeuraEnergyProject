# Django Vue 3 + Vite + Tailwind CSS

Version: 1.0.0
Initialized Project and read through some documentation. Explored the project structure.

Version 1.1.0
Added Login component, non functional at their current state. Installed router vue and configured it.

Version 1.2.0
Downloaded shadcn charts due to lower bundle size and experimented with implementation.

Version 1.3.0
Defined an Auth composable to make the logged in state globally accessible and defined redirects for the router.

Version 1.4.0
Due to time constraints, i have reverted the front end that i had already established. The concept of the login page with all its redirects manually set will eat too much time. I have since implemented a template for the login page and dashboard page.

Version 1.5.0
Project cleanup, fixed some redirection rules.

Version 1.6.0
Minor changes to javascript. Added a modal to the daterangeselector component to be able to do crud operations on the data. Added a modal in the dashboard to be able to select a specific data point, such as electricity used, cost, total time etc.

Version 1.7.0
Added a postgres datbase, made migrations for admin, auth, contenttypes and sessions. Exploring django file structure.

Version 1.8.0
Fixed the frontend Dashboard HomeStats to show correct value, reflecting the mockData file i have created.

Version 1.9.0
Added a /login api endpoint to the backend, responses are token based so the users cant login by setting their email in localStorage. Started working on a data_view endpoint to retrieve data from the database.

Version 1.10.0
Routes were updated, and overall project cleanup was done to simplify things. Fixed issues with models.py after re-generating from the database (PowerShell encoding issue)

Veresion 1.11.0
Configurtional change, removed a package that came bundled with the template and had issues.
