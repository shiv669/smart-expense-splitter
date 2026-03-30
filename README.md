# Smart Expense Splitter

## Overview 
A lightweight web application to manage and split shared expenses among groups.

This project focuses on building a correct and usable system under strict time constraints, prioritizing clarity in balance calculation, simplicity in design, and handling real-world edge cases.

---

## Status
**In progress (24-hour assessment for NeevAI Internship Program)**

---

## Tech Stack

- Frontend: React  
- Backend: Node.js (Express)  
- Database: SQLite  

### Why this stack?

- SQLite was chosen for simplicity and zero setup overhead, enabling faster development within a 24-hour constraint.
- Node.js provides a minimal API layer for clean separation of concerns.
- React enables fast UI development with clear state management.

### Trade-offs

- Not using a full production-grade database (e.g., PostgreSQL) to prioritize speed.
- Minimal backend features to focus on correctness of core logic rather than infrastructure.

---

## Features 

- Create groups and add members  
- Add expenses (equal and custom split)  
- Real-time balance calculation  
- Summary of who owes whom  

---

## Balance Calculation Strategy

Each user maintains a net balance:

- Positive → should receive money  
- Negative → owes money  

For each expense:
- The payer's balance increases by the total amount paid  
- Each participant’s balance decreases based on their share  

Final settlements are derived by matching debtors (negative balances) with creditors (positive balances), minimizing the number of transactions.

---

## Edge Cases

- Uneven splits and rounding errors  
- Empty groups or no participants  
- Self-pay scenarios  
- Duplicate or invalid inputs  

---

## Out of Scope

- No authentication system (not required for scope)  
- No heavy database setup (to avoid unnecessary complexity)  
- No Docker setup (focus was on product delivery over infrastructure)  

---

## Design Philosophy

This project intentionally avoids unnecessary complexity and focuses on delivering a complete, correct, and user-friendly solution within the given constraints.
