# DoR reference (optional extensions)

## Stronger enterprise-style add-ons

Add only when relevant; do not bloat every review.

- **Compliance**: privacy, security review touchpoints, audit logging requirements stated.
- **Observability**: metrics/logs/traces expectations for new paths or failures.
- **Rollout**: feature flag plan, default-off, kill switch, or rollback noted for risky changes.
- **Data**: schema migration strategy, backfill, idempotency, retention.

## Anti-patterns

- DoR is **not** a full technical design sign-off; keep it lightweight enough to run per ticket.
- Do not block on perfect UX for spike-sized discovery work—use a spike ticket with time box instead.
