# ACC Conformance 状态与证据索引

状态：非规范性的证据索引

复查日期：2026-10-12

[English](CONFORMANCE_STATUS.md)

本索引汇聚既有 ACC 要求、参考覆盖、实现声明及其限制，不新增字段、要求、Profile、认证或发布承诺。规范含义仍由 [SPEC.md](SPEC.md)、[Schema](schemas/acc.v1.schema.json) 及适用的 [Binding](bindings/README.md) 定义。

## 版本与成熟度

| 维度 | 证据与当前状态 | 限制 |
|---|---|---|
| 已发布契约基线 | [ACC v1.0.5](RELEASE_NOTES_v1.0.5.md)，Tag [`v1.0.5`](https://github.com/agent-capability/agent-capability-contract/tree/v1.0.5)，Commit `2aae4e4adcc0fb06e70556a9700ed233e7c951cb` | 声明使用 `version: 1`；规范修订与实现版本分别记录。 |
| 本次复查仓库材料 | 公开仓库快照 [`9f527009aa1068f448d377c38c03f8cbf76469f0`](https://github.com/agent-capability/agent-capability-contract/tree/9f527009aa1068f448d377c38c03f8cbf76469f0) | 后续文档和仓库检查本身不表示新的规范发布。 |
| 规范 | [ACC v1 稳定核心](SPEC.md) | 语义稳定不证明部署安全或生态已广泛采用。 |
| 生态 | [早期采用](README.zh-CN.md) | 登记规模、证据深度与规范稳定性是不同维度。 |
| Conformance 流程 | [Profiles](conformance/PROFILES.md)、[自评](conformance/SELF_ASSESSMENT.md)、参考向量 | 不声称存在官方认证计划。 |

本次复查快照中的核心、Schema、Binding 与 26 条参考向量保留 v1.0.5 基线。覆盖索引和其他解释材料用于定位证据，不改变这些预期结果。

## 九个核心字段

[JSON Schema](schemas/acc.v1.schema.json) 定义了九个顶层字段。只有 `version`、`enabled`、`scope` 必填；各字段的可选性和行为以规范为准。Schema 校验不证明运行时已执行声明中的治理要求。

| 字段 | 既有定义 | 已提供的参考观察 | 这些观察不能证明什么 |
|---|---|---|---|
| `version` | [SPEC §4.1](SPEC.md#41-version)、Schema | 声明有效性与不支持版本的样例 | 全部解析错误路径或某个实现的版本协商 |
| `enabled` | [SPEC §4.2](SPEC.md#42-enabled)、Schema | 声明与暴露样例 | 实际导入、暴露或调用分派闸门 |
| `scope` | [SPEC §4.3](SPEC.md#43-scope)、Schema | 缺失 scope 与预先提供的 scope 策略样例 | 真实路由策略、租户隔离或最终权限 |
| `risk` | [SPEC §4.4](SPEC.md#44-risk)、Schema；[OpenAPI 映射](bindings/openapi.md) | 两条默认风险样例 | 完整风险策略覆盖或部署中的实际执行 |
| `subject` | [SPEC §4.5](SPEC.md#45-subject)、Schema | 暴露样例使用预先提供的 `trusted_subject` 布尔值 | 身份认证、委托或跨信任边界的连续性 |
| `approval` | [SPEC §4.6](SPEC.md#46-approval)、Schema 与 Binding 输入映射 | 十四条审批意图/条件样例 | 已完成审批、所有运算符边界、累计限制或第三方证据验证 |
| `audit` | [SPEC §4.7](SPEC.md#47-audit)、Schema | 一条宽粒度敏感提示样例 | 实际脱敏持久化、访问权限、完整性或保留策略 |
| `execution` | [SPEC §4.8](SPEC.md#48-execution)、Schema | 默认风险样例使用 `readonly` | 实际超时/限流映射、去重或恢复行为 |
| `guidance` | [SPEC §4.9](SPEC.md#49-guidance)、Schema 与 Binding | 此 corpus 没有专门的行为向量 | 对模型/工具结果文本覆盖治理要求的抵抗能力 |

以上是覆盖描述，不是某个实现的通过结果。[覆盖索引](conformance/v1/COVERAGE.zh-CN.md) 列出了每条向量及各领域仍需的实现证据。

## 四类声明 Profile

[Profiles](conformance/PROFILES.md) 对已有职责进行分组，不增加 ACC 语义。实现可以声明生命周期中有明确文档的一部分，不必声称覆盖全部四类 Profile。

| Profile | 既有职责 | 与参考 oracle 结果分开的证据 |
|---|---|---|
| OpenAPI Binding Parser | 提取声明、校验所支持的字段、保留原生输入 Schema，并报告无效或不支持的声明 | 实际解析接口、支持的 OpenAPI 版本、诊断与适用向量结果 |
| OpenAPI Binding Generator | 生成有效的 Binding 原生材料、带类型的输入和明确版本 | 生成的 OpenAPI 材料与生成器行为；声明样例本身不证明此 Profile |
| Runtime | 执行暴露与治理，同时保留业务系统最终权威 | 实际调用接口、分派决策、主体/参数绑定、追溯及适用的集成证据 |
| Policy Component | 为另一组件评估明确列出的字段子集 | 支持字段、其余生命周期的责任方，以及决策在集成边界得到执行的证据 |

Parser 与 Generator 声明需写明 Binding；Policy Component 声明需写明字段子集。以上 Profile 不要求特定模型、UI、存储系统、队列或产品架构。

## 参考向量与仓库工具

[ACC v1 corpus](conformance/v1/README.md) 有 **26 条向量**：声明 5、暴露 4、审批 14、默认风险 2、审计提示 1。它为 OpenAPI Binding Parser 和 Runtime Profile 提供抽象输入与结果，不穷尽这两类 Profile 或九个字段的全部行为。

| 证据层 | 既有公开来源 | 含义与限制 |
|---|---|---|
| 语法与编写辅助 | [Schema](schemas/acc.v1.schema.json)、[`acc-validate` CLI](bin/acc-validate.mjs)、[校验器](lib/openapi-validator.mjs)、[作者校验器/CLI 测试](test/) | 编写辅助工具检查所支持的声明和输入映射，不是完整 OpenAPI Linter、运行时或业务授权权威。 |
| Corpus 一致性 | [参考 oracle](scripts/check-conformance.mjs)；`npm run conformance:check` | 检查已提供向量与参考预期一致；通过不代表运行了某个外部实现。 |
| 仓库检查 | [`npm run check`](package.json)、[检查工作流](.github/workflows/check.yml) | 文档/链接、向量及作者工具检查，不是部署或运行时验收。 |
| 实现 adapter | [自评模板](conformance/SELF_ASSESSMENT.md)、[覆盖索引](conformance/v1/COVERAGE.zh-CN.md) | 将适用向量送入指定实现的公开接口并保留其结果；本索引不提供新的 adapter 结果。 |
| 集成 | [检查清单](conformance/README.md)、[实现者指南](IMPLEMENTER_GUIDE.md)、[业务工作表](examples/BUSINESS_RISK_EXAMPLES.zh-CN.md) | 分派、主体、审批、持久化和恢复声明需要实际边界的证据；示例不是预先通过的集成测试。 |

审批向量中的 `allow` 表示受测条件不产生审批意图，不是最终授权。`scope_allowed` 和 `trusted_subject` 同样是预先提供的输入，不是已经验证的身份或网络观察。

## 已登记的实现声明

截至复查日期，[IMPLEMENTATIONS.md](IMPLEMENTATIONS.md) 只有一条登记：

| 项目 | 登记 Profile | ACC 家族 | 记录状态 | 上次评估 | 既有证据 |
|---|---|---|---|---|---|
| BailingHub | Runtime | v1 | Self-declared | 2026-07-11 | [登记条目及其中的公开实现链接](IMPLEMENTATIONS.md) |

该条目没有把 BailingHub 登记为全部 Profile，没有固定当前实现 Commit，也不构成独立 Conformance 评估。本索引不增加第二家实现或独立互操作结果。本仓库的作者校验器不是另一条已登记的 Runtime 实现。

覆盖索引的实现列仍为 **Not run**：它描述 corpus，没有执行外部实现。这个状态不否定登记中的自声明，也不证明实现不支持该功能；它表示该索引没有提供指定 adapter/集成观察。

新增或更新声明时，使用已有的[自评流程](conformance/SELF_ASSESSMENT.md)：记录规范修订、corpus Commit/hash、实现 Commit/包 hash、Profile、接口、日期、通过/失败/跳过/未运行 ID、证据和限制。跳过需说明范围依据；适用但不支持的行为是限制。登记不是认证、背书或生产就绪批准。

## 证据缺口与责任层

| 关注点 | 既有边界 | 应呈现的状态 |
|---|---|---|
| 超时与限流提示 | [SPEC §4.8](SPEC.md#48-execution)；实现策略映射 | 提示已定义；本索引不证明实际窗口或超时行为 |
| 审批意图与审计敏感性 | [SPEC §§4.6–4.7](SPEC.md#46-approval)；[覆盖限制](conformance/v1/COVERAGE.zh-CN.md) | 抽象样例；已完成审批和实际脱敏需要实现证据 |
| 当前边界的可信主体 | [SPEC §4.5](SPEC.md#45-subject) | 已有要求；实际验证需要该边界的证据 |
| 端到端主体连续性与委托 | [设计边界](DESIGN_RATIONALE.zh-CN.md)、[多跳指引](IMPLEMENTER_GUIDE.md#61-trust-across-multiple-hops) | 不在 ACC v1 的连续性保证内；需要补充身份/委托语义，不是 ACC planned 功能 |
| 最终权限、租户/对象隔离、累计效果 | [SPEC](SPEC.md)、[设计边界](DESIGN_RATIONALE.zh-CN.md)、[责任说明](SAFETY_GOVERNANCE_GUIDE.zh-CN.md) | 权威业务/策略层的责任，不能从 ACC 通过结果推出 |
| 存储、恢复、沙箱与部署控制 | [覆盖限制](conformance/v1/COVERAGE.zh-CN.md)、[设计边界](DESIGN_RATIONALE.zh-CN.md) | 实现/部署证据，不是新增 ACC 字段或发布承诺 |

**Not run** 表示没有在此提供指定观察，不等于 **planned**、**failed** 或 **not applicable**。补充协议或范围外责任不构成未来核心承诺。[提案状态](proposals/README.md)和[治理](GOVERNANCE.md)仍分别记录：提案不是路线图承诺，接受不等于发布。

证据变化时，更新带日期的实现报告或登记条目及相关覆盖链接。保持已发布语义、参考一致性、实现行为、独立互操作和认证声明之间的区别。
