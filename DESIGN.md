#Design Decisions 

### Folder Structure Decision 

I am not using a complex architecture because this is a 24 hour build.

This strcture is chosen to keep things simple but still organized:

- routes -> handles API endpoints
- controllers -> contains actual logic
- db -> manages database connection
- models -> defines schema

This separation helps avoid mixing logic everywhere while still keeping the code easy to understand and debug. 

I am intentionally not overengineering with services, repositoris, etc. because that would slow down development. 

## Backend Initialization

server and database setup completed.

- Express server created
- SQLite connected
- Tables created at startup

Decision: Tables are initialized automatically when server starts to avoid manual DB setup.

## Users Module

Added support for group memebers.

- Users are tied to a group using group_id
- No global user system (kept simple for scope)

Reason: Users only exist within a group context, so no need for separate authentication or global identity.

## Expense Module (equal split)

Implemented expense creation with equal split.

Flow:
- fetch all users in group
- Divide total amount equally
- Store each user's share in expense_splits

Note: splits are stored explicitly instead of recalculating later to avoid inconsistencies.

## Balance Calculation 

Implemented balance computaion using derived values

Approach:
- Initialize all users with zero balance
- Add total expenses paid by each user
- Substract individual shares from expense_splits

Reason: Balances are not stored to avoid inconsistencies and recalcualted on demand.

## Settlement logic

Implemented greedy settlement algorithm.

Approach:
- Separate creditors and debitors
- Iteratively match smallest outstanding amounts
- Generate minimal set of transactions

Note: current implementation does not sort balances, but works for basic cases.


## Rounding Handling

Handled floating point issues in expense splitting.

Approach:
- Round each share to 2 decimal places
- Assign remaining amount to last user

Reason: Ensures total split always matches original expense amount without precision errors.


## Frontend Initialization

Initialized react app with vite.

Reason:
- Faster development server
- Minimal setup
- Better suited for short time constrsints

Cleaned default boilerplate to keep codebase simple and focused


## Frontend-Backend Integration (Groups)

Connected frontend to backend for group creation.

Flow:
- User enters group name
- Frontend sends POST request to API
- Response handled and logged

Decision:
Start with minimal UI and validate API integration before building more components.


## Display Groups in Ui

Implemented group listing in frontend

FLOW:
- fetch groups on component mount
- store in state
- render dynamically

Also re-fetched after creating a group to keep UI  in sync.


## Group Interaction and Users

Added ability to select a group and manage users.

Flow:
- User selects a group
- Fetch users for that group
- Add new users via API
- UI updates after each addition

Decision:
Keep interaction simple with single-page state instead of routing to reduce complexity.


## Expense Input (Frontend)

Added ability to create expenses from UI.

Flow:
- User inputs amount, description, and selects payer
- Sends POST request to backend
- Backend handles splitting logic

Decision:
Custom split skipped to prioritize core functionality under time constraint.