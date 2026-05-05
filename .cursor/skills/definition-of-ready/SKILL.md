---
name: definition-of-ready
description: Evaluates backlog items, tickets, specs, or PR scopes against Definition of Ready (DoR) before work starts or enters a sprint. Use when grooming backlog, planning sprints, starting implementation, writing acceptance criteria, or when the user mentions DoR, definition of ready, readiness, or ticket quality.
disable-model-invocation: true
---

# Definition of Ready (DoR)

## Instructions

When the user wants DoR coverage, **treat DoR as a gate before implementation or sprint commitment**, not as a substitute for Definition of Done.

1. **Clarify the artifact** (if unknown): issue/ticket, spec, epic slice, or PR scope.
2. **Apply the checklist** below. Mark each item **Met**, **Partial**, or **Missing**, with one concrete gap per Partial/Missing.
3. **Summarize**: list blockers first, then quick wins. If everything passes, state that explicitly.
4. **Do not invent team policy**: if the repo has no written DoR, use the default checklist below and label it as a sensible default the team can override.

## Default DoR checklist

Use this unless the user or project docs supply a different list.

- [ ] **Goal clear**: One sentence on user/value or problem solved; no purely technical title without intent.
- [ ] **Scope bounded**: In-scope vs out-of-scope called out, or small enough that boundary is obvious.
- [ ] **Acceptance criteria**: Testable conditions (Given/When/Then or bullet checks), not vague adjectives.
- [ ] **Dependencies identified**: APIs, data, design, other teams, feature flags, migrations—named or “none known.”
- [ ] **Design/UX**: If UI involved, wireframe, flow, or reference pattern agreed—or explicitly deferred with a stated minimum.
- [ ] **Technical notes**: Rough approach, risky areas, or spike outcome referenced when non-trivial.
- [ ] **Estimable**: Team could size or break down; no hidden discovery work disguised as a single task.
- [ ] **Stakeholder alignment**: Product/owner sign-off or documented decision for ambiguous product choices.

## Output format

```markdown
## DoR review: [artifact name]

**Verdict**: Ready | Not ready | Ready with assumptions

### Checklist
| Criterion | Status | Notes |
|----------|--------|-------|
| ... | Met / Partial / Missing | ... |

### Blockers (must fix before starting)
- ...

### Assumptions (if Ready with assumptions)
- ...

### Suggested next edits
- ...
```

## Examples

**Example 1 — Not ready**

User: “Is this ticket ready?” Ticket: “Fix login.”

Response: Verdict **Not ready**. Goal unclear (what broken behavior?), no acceptance criteria, dependencies unknown. Suggest adding repro steps, expected vs actual, environments, and AC for success and regression.

**Example 2 — Ready with assumptions**

User: “DoR check for adding export CSV to reports.”

Response: Most criteria **Met**; **Partial** on stakeholder alignment if product not tagged. Verdict **Ready with assumptions**: export columns per existing table spec; assumption—product confirms column set matches billing export rules.

## Additional resources

For a stricter enterprise-style template, see [reference.md](reference.md).
