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