# ACC v1 覆盖与实现证据索引

Status: Non-normative coverage index（非规范性覆盖索引）

语料：`vectors.json`，格式版本 1，规范修订 1.0.5

[English](COVERAGE.md)

本索引说明已有 26 个参考向量，不改变预期结果或参考 oracle。规范义务及建议以 [SPEC.md](../../SPEC.md) 和 [OpenAPI Binding](../../bindings/openapi.md) 为准；先选定适用 [Profile](../PROFILES.md)。

## 不同证据能证明什么

- `npm run conformance:check` 用参考 oracle 检查语料；成功仅代表**语料内部一致性**，不是网关、SDK 或生产运行时验收。
- 实现适配器需要通过公共接口输入适用向量并观测结果。本索引未执行外部实现，因此实现证据为 **Not run（未运行）**。
- 决策是否真正阻断派发、主体是否正确、日志是否实际脱敏持久化、失败后能否恢复，需要集成证据。[自评模板](../SELF_ASSESSMENT.md)分别记录这些结论。

审批向量中的 `allow` 仅表示本条件未产生审批意图，不授予最终权限。`scope_allowed` 和 `trusted_subject` 是给定的抽象输入，不是身份校验或网络观察结果。

## 已有向量

每行都有抽象向量，末两列指真实实现而非 oracle。章节号指 SPEC，另有明确标记的 OpenAPI Binding 章节。

| ID | 已有语义依据 | 抽象向量覆盖的观察 | 预期结果 | 仍需实现证据 | 实现状态 |
|---|---|---|---|---|---|
| `T-PARSE-01` | §§4.1–4.3, 6 | 最小 ACC v1 声明合法。 | `valid=true` | 解析器接口的提取及诊断 | Not run |
| `T-PARSE-02` | §§4.1–4.3, 6 | 缺少 scope 非法。 | `valid=false, diagnostic="invalid_declaration"` | 解析器接口的提取及诊断 | Not run |
| `T-PARSE-03` | §§4.1–4.3, 6 | 未知主版本被拒绝或跳过并产生诊断。 | `valid=false, diagnostic="unsupported_version"` | 解析器接口的提取及诊断 | Not run |
| `T-PARSE-04` | §§4.1–4.3, 6 | 未知字段不导致声明非法。 | `valid=true` | 解析器接口的提取及诊断 | Not run |
| `T-PARSE-05` | §§4.1–4.3, 6 | 缺少 version 是非法声明，不是未知版本。 | `valid=false, diagnostic="invalid_declaration"` | 解析器接口的提取及诊断 | Not run |
| `T-EXPOSE-01` | §§4.2–4.3, 4.5, 5 | 禁用的能力不暴露。 | `exposed=false` | 真实目标/主体校验及派发边界 | Not run |
| `T-EXPOSE-02` | §§4.2–4.3, 4.5, 5 | 要求可信主体但主体不可用时不暴露。 | `exposed=false` | 真实目标/主体校验及派发边界 | Not run |
| `T-EXPOSE-03` | §§4.2–4.3, 4.5, 5 | scope 不在运行时策略内时不暴露。 | `exposed=false` | 真实目标/主体校验及派发边界 | Not run |
| `T-EXPOSE-04` | §§4.2–4.3, 4.5, 5 | 启用、scope 允许且所需主体可用时暴露。 | `exposed=true` | 真实目标/主体校验及派发边界 | Not run |
| `T-APPROVAL-01` | §4.6 | 无条件审批优先，条件不匹配不能取消。 | `decision="approval_required"` | 决策接口及参数/派发绑定 | Not run |
| `T-APPROVAL-02` | §4.6 | 第一个条件命中足以触发审批。 | `decision="approval_required"` | 决策接口及参数/派发绑定 | Not run |
| `T-APPROVAL-03` | §4.6 | 后续条件命中也足以触发审批。 | `decision="approval_required"` | 决策接口及参数/派发绑定 | Not run |
| `T-APPROVAL-04` | §4.6 | 全部条件不匹配时不产生条件审批意图。 | `decision="allow"` | 决策接口及参数/派发绑定 | Not run |
| `T-APPROVAL-05` | §4.6 | 参数类型不符合原生结构时拒绝调用。 | `decision="reject_invalid_arguments"` | 决策接口及参数/派发绑定 | Not run |
| `T-APPROVAL-06` | §4.6 | 空 when 数组不产生条件审批意图。 | `decision="allow"` | 决策接口及参数/派发绑定 | Not run |
| `T-APPROVAL-07` | §4.6 | in 使用严格 JSON 相等匹配数组成员。 | `decision="approval_required"` | 决策接口及参数/派发绑定 | Not run |
| `T-APPROVAL-08` | §4.6 | in 不把数值转换成字符串。 | `decision="allow"` | 决策接口及参数/派发绑定 | Not run |
| `T-APPROVAL-09` | §4.6 | 字符串 contains 使用子串匹配。 | `decision="approval_required"` | 决策接口及参数/派发绑定 | Not run |
| `T-APPROVAL-10` | §4.6 | 数组 contains 使用严格 JSON 相等。 | `decision="approval_required"` | 决策接口及参数/派发绑定 | Not run |
| `T-APPROVAL-11` | §4.6 | 数组 contains 不把数值转换成字符串。 | `decision="allow"` | 决策接口及参数/派发绑定 | Not run |
| `T-APPROVAL-12` | §4.6 | exists 命中存在且非 null 的值。 | `decision="approval_required"` | 决策接口及参数/派发绑定 | Not run |
| `T-APPROVAL-13` | §4.6 | exists 不命中缺失路径。 | `decision="allow"` | 决策接口及参数/派发绑定 | Not run |
| `T-APPROVAL-14` | §4.6 | exists 不命中显式 null。 | `decision="allow"` | 决策接口及参数/派发绑定 | Not run |
| `T-RISK-01` | §4.4; [OpenAPI input mapping](../../bindings/openapi.md#input-and-value-mapping) | OpenAPI GET 在未声明风险与 readonly 时默认低风险。 | `effective_risk="low"` | Binding 映射及有效策略保留 | Not run |
| `T-RISK-02` | §4.4; [OpenAPI input mapping](../../bindings/openapi.md#input-and-value-mapping) | 非只读写操作省略风险时默认中风险。 | `effective_risk="medium"` | Binding 映射及有效策略保留 | Not run |
| `T-AUDIT-01` | §4.7 | 保留 audit.sensitive 为 true 的提示。 | `audit_sensitive=true` | 提示传递；另外验证脱敏持久化 | Not run |

向量统计：声明 5、暴露 4、审批 14、风险默认值 2、审计提示 1，共 **26** 项。

## 语料没有证明的部分

参考语料未穷尽规范或检查清单。缺少向量不取消规范义务；建议的部署控制也不会因为列在这里而成为 ACC 要求。

| 关注点 | 已有依据/性质 | 抽象语料覆盖 | 仍需证据 | 实现证据 |
|---|---|---|---|---|
| 给定样例之外的审批运算符和默认值 | SPEC §§4.4、4.6 及 OpenAPI Binding | 部分：样例取值，不是每种运算符/类型/默认值组合 | 对声明支持范围做边界及非法输入测试 | Not run |
| timeout 与 rate-limit 提示映射 | SPEC §4.8 提示；映射属实现策略 | 无 | 实际窗口/超时及映射后的行为观察 | Not run |
| 最终业务授权和跨跳主体核验 | SPEC §§2.1、4.5、5 | 仅抽象暴露布尔值 | 每个权威层对撤销、伪造、错误租户/对象的真实判断 | Not run |
| 模型/工具结果文本不能覆盖治理 | SPEC §§4.9、5 | 无 | 经真实接收、选择及派发接口进行对抗输入测试 | Not run |
| 审批意图与审批完成 | SPEC §4.6；实现指南 §7 建议绑定 | 仅抽象意图 | 审批人权限、冻结目标/参数、过期及失败路径观察 | Not run |
| 累计业务影响 | SPEC §4.6；由业务/策略层执行 | 无 | 使用权威状态和明确限制的并发/批量测试 | Not run |
| 敏感提示与实际日志 | SPEC §4.7；保留和证明属部署策略 | 仅一个广义敏感提示存在 | 持久化/导出前脱敏、访问、完整性、保留测试；有声明时的独立验证 | Not run |
| 结果未知的写、取消、重开、防重放 | 实现恢复策略；§4.8 幂等是提示 | 无 | 保留原调用/目标，核对已接受/未知影响，证明没有不安全重放 | Not run |
| 来源信任、本地沙箱、任务停用、数据驻留 | 互补实现/部署控制，不是 ACC 字段 | 无 | 明确责任人、策略及符合该部署的集成证据 | Not run |

生成器还需要对实际生成的 Binding 原生材料提供证据。抽象声明通过不等于完整 OpenAPI 文档或业务 API 的语义已验证。

## 附上实现报告

**Recommended：**记录规范修订、语料提交或 SHA-256、实现提交/包哈希、适用 Profile、公共接口/适配器入口、日期、通过/失败/跳过/未运行 ID、证据链接和限制。解释每个跳过原因：“不适用”不同于“适用但未支持”。

不要将 oracle 输出复制成运行时验收，声称已经执行该运行时。实现自己的适配器和集成结果分别保留。[业务工作表](../../examples/BUSINESS_RISK_EXAMPLES.zh-CN.md)提供集成证据规划场景，不提供预先通过的测试。
