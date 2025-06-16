Tasks to be added:

1. Auth0 Enhancements （done）

2. Save-to-Dashboard Feature (requires back-end, not implemented yet)

- Add/save/delete/update book entries tied to the Auth0 user.
- Include proper visual feedback (like “Saved!” states).

3. Global BookProvider for State Management (optional)

- smooth rendering and enhancements(not user visible, rather rendering without refresh etc. this is optional)

4. DashboardPage enhancements

- only contains placeholder now. when a user is not logged in, they should be prompted to log in upon this page.

Note:
Sidebar only works with the current 30 results at first and increments later as more pages are visited, we can add more if we actually have back-end or api, and it is scaling to infinity after too many pages
