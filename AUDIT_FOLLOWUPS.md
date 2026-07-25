# Audit Follow-ups

## Build Warnings
- **Static Generation Error**: During the build process, a `ReferenceError: location is not defined` warning was observed. This usually occurs when browser-specific APIs (like `window.location`) are accessed directly in the module scope or during the server-side rendering/static generation phase of a Server Component. 

## Pending Features
- **P2-2 Features**: Development for the P2-2 features is currently on hold and awaiting explicit go-ahead before implementation begins.

## Notes
- **Coupon Components**: The Phase 4 audit mentioned removing inline styles in coupon components within `src/components/commerce/`. However, no coupon-related files or matching inline styles were found in this directory.

## RBAC: Dead Permission Tables (Decision Pending)
- **`schema.prisma` lines 1456-1496**: `Role`, `Permission`, `RolePermission`, `UserPermission` models exist in the Prisma schema but are **100% dead code** — zero references in `backend/src/**/*.ts`.
- **Context**: A granular permission system was modeled early but never wired up. The app relies entirely on JWT `role` claims + `RolesGuard`.
- **Recommendation**: Do NOT delete yet. With MODERATOR/LOGISTICS role growth already happening and a premium-tier RBAC upgrade on the roadmap, these tables are a candidate for implementing (not removing). A full RBAC system would:
  - Allow per-user granular permissions (e.g., "warehouse_manager can CREATE_PICK_LIST but not APPROVE_REFUND")
  - Replace the current flat-role enum with permission-based checks via a middleware/guard
  - Enable self-service admin role assignment without code changes
- **Decision**: Deferred — product owner to decide whether to build it out or prune. Update this file when decision is made. 
