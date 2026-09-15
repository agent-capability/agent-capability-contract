# Catalog and Inventory Risk Worksheet

Status: Non-normative examples

Applies to: ACC v1, specification release 1.0.5

[中文](BUSINESS_RISK_EXAMPLES.zh-CN.md)

These synthetic OpenAPI services illustrate reviewed business assumptions. They are not a universal retail risk rating, implemented services, or evidence of cross-system execution. A real business owner needs to review its own data, consequences, permissions, and approval policy before adapting them. HTTP verbs and names alone do not decide risk.

- [Catalog service](openapi-catalog-service.yaml): edit a draft, publish a product, change price.
- [Inventory service](openapi-inventory-service.yaml): read stock, adjust stock.
- [Governance responsibility guide](../SAFETY_GOVERNANCE_GUIDE.md): ACC, runtime, business, and deployment boundaries.

## Example Business Assumptions

One catalog tenant uses a fixed currency. All operations require a trusted subject, and the business system independently checks that subject's current access. The draft operation cannot affect a published product or change price/stock. The publication and stock-adjustment operations always require approval. Price editing uses an illustrative absolute-price condition alongside authoritative discount and margin policies; high ACC risk does not by itself define one universal approval workflow.

The example server descriptions state obligations of a hypothetical implementation. The YAML does not enforce them. Object IDs are scoped to their respective service and tenant; matching names or IDs never link authority across systems. Synthetic values and unauthenticated placeholders are unnecessary: neither example includes credentials or a live server URL.

## Reviewed Operation Choices

Every cell below is an **Example**, not a new ACC requirement. “Reviewer” names a business role that a real adoption should assign to a responsible person.

| Operation and object | Reasonable single-operation worst consequence; external effect | ACC choice | Subject and final authority | Autonomy and batch context | Parameter and cumulative controls outside ACC | Recovery assumptions | Reviewer |
|---|---|---|---|---|---|---|---|
| `editProductDraft`: one unpublished product | Corrupt draft text/pictures and create rework; not publicly visible | `medium`; trusted subject; no unconditional ACC approval | Verified editor; catalog authorizes tenant/product and draft state | Allowed editing within a selected task; 100 edits are a separate cumulative review | Editable fields, URL policy, object set, stale-version check; count unique affected products and attempted changes under documented task policy | A business snapshot may restore a draft after version/conflict checks; not automatic rollback | Catalog owner |
| `publishProduct`: one draft and channel | Incorrect product becomes public and may be purchased | `high`; `approval.required: true` | Verified publisher; business checks approver, channel and eligibility | Human review before each invocation in this example; task approval cannot bypass it | Frozen target/channel/version; separate limits for batch publication | Taking offline limits future effects; it does not reverse purchases or prior exposure | Merchandising owner |
| `changeProductPrice`: one product | Financial loss or incorrect public pricing | `high`; `price_minor > 100000` creates conditional intent | Verified pricing subject; pricing authority checks current price, margin and discounts | Separate pricing task; forbidden in the 100-item content task below | Integer minor units; server-derived reduction; object/version checks; accumulated price exposure evaluated from business state | Restore price only after a new authorized, version-aware decision; prior purchases remain | Pricing owner |
| `getStock`: one warehouse/SKU | Reveal commercially sensitive inventory; no business mutation | `low`; `readonly: true`; `audit.sensitive: true` | Verified reader; inventory system authorizes tenant/warehouse | Read within selected warehouses; repeated reads do not grant enumeration rights | Per-object access, result minimization, query volume and export policies | Re-read if authorized; the result can legitimately change | Inventory data owner |
| `adjustStock`: one warehouse/SKU | Oversell or misstate availability, affecting orders and fulfillment | `high`; unconditional approval even when delta conditions do not match | Verified operator; inventory system checks approver and stock rules | Human review for each adjustment; separate from a read-only inventory task | Nonzero integer delta; reservations/nonnegative stock; expected version; cumulative adjustments | A repeated delta is unsafe. Reconcile the original operation; a compensating adjustment requires current-state review | Warehouse operations owner |

### Approval and Parameter Details

**Normative reference:** [SPEC §4.6](../SPEC.md#46-approval).

- `approval.required: true` is unconditional. The stock adjustment with `delta: 1` still creates approval intent; the additional conditions cannot waive it.
- When `required` is false or omitted, any matching condition creates intent. In this price example, `100001` matches and `100000` does not; these are integer minor units, not display-currency amounts. Neither outcome overrides business authorization, discount review, or stricter runtime policy.
- A string such as `"100001"` is invalid against the integer input. Do not coerce it or silently call the condition unmatched.
- The price API does not accept a model-supplied discount percentage as authority. The server computes reductions using its current price. A per-call price threshold neither measures that reduction nor limits the sum of many calls.
- Arguments stay in OpenAPI `parameters` and `requestBody`, not in ACC. `expected_version` is an example business input, not an ACC field or proof that a server implements concurrency control.

All example writes declare `idempotent: false`: this contract does not promise safe retries. A stable runtime invocation ID, an HTTP method, or an expected-version field alone does not provide business idempotence. If a write may have reached the server, use the original execution association to obtain authoritative status before deciding any next operation. The read is retryable with the same arguments, although observed stock can change.

## A Task That Uses Two Systems

**Example task:** “Update pictures and descriptions for these 100 unpublished products; read inventory to check availability; do not change prices or stock.”

**Recommended implementation worksheet**, kept outside `x-agent-capability`:

| Task item | Decision to establish before execution | Evidence to inspect |
|---|---|---|
| Original targets | Selected catalog and inventory identities, trusted subject and tenant for each; a reviewed SKU mapping if needed | No requests to unselected systems; a repeated identifier cannot select a different target |
| Permitted work | Catalog draft text/picture edits and inventory reads; explicit product/warehouse set | A price edit, stock adjustment, published-product edit, or out-of-set object is rejected |
| Batch and concurrency | Define whether budgets count objects, calls, mutations, and failures; reserve atomically before dispatch | Parallel requests cannot exceed the chosen budget; original-call recovery cannot reset or double-charge it |
| Human control | Preview task boundaries; retain original per-operation approvals; pause new dispatch on an unexpected expansion | Pausing stops new calls but accurately reports accepted, pending, failed, and unknown operations |
| Completion and recovery | Keep original target and execution references; report partial success | Unknown writes are reconciled, not silently repeated under another target |
| Evidence and data | Retain necessary decision/result records with redaction; separate conversation and file-storage policies | Credentials do not enter logs; a useful image URL does not require archiving every chat attachment |

No `task_budget`, `autonomy_level`, or object-allowlist field is added to ACC by this worksheet. The two declarations do not implement a transaction spanning systems or guarantee rollback. For existing semantic coverage and missing implementation tests, see [COVERAGE.md](../conformance/v1/COVERAGE.md).

## Validate the Declarations

From a source checkout with dependencies installed:

```bash
node bin/acc-validate.mjs examples/openapi-catalog-service.yaml
node bin/acc-validate.mjs examples/openapi-inventory-service.yaml
npm run check
```

The authoring validator checks ACC extraction and declaration/condition diagnostics; it is not a complete OpenAPI validator or a business integration test. The repository examples are not automatically included in the current npm package's explicit file list.
