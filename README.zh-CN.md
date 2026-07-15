<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/acc-logo-light.svg">
    <img src="./assets/acc-logo.svg" width="88" alt="Agent Capability Contract logo">
  </picture>
</p>

<h1 align="center">Agent Capability Contract（ACC）</h1>

**ACC（Agent Capability Contract）** 是一套开放的 Agent 能力声明契约，用来描述业务系统可以把哪些业务能力开放给 Agent 调用，以及这些能力应该如何被治理。

ACC 不是运行时、不是聊天机器人框架、也不是工作流引擎。它只定义一件事：业务能力在进入 Agent 世界前，应该如何声明可见范围、风险、主体、审批意图、审计和扩展信息。

ACC 以独立、实现中立的标准方式维护。任何产品实现都不能定义 ACC 语义，也不会因为与维护者的关系获得优先兼容地位。

ACC 是 **A2B（Agent-to-Business）** 场景下的能力声明契约。A2B 指的是：让 Agent 安全、可治理地接入已有业务系统，并代替真实业务主体查数据、办业务、走流程。

ACC 所回答的治理问题，也可能在 Agent 行动跨越后果、授权或信任边界时反复出现。这是一项更上位的研究判断，不表示 ACC v1 已经治理所有 Agent 行动。关于“共同问题”与“当前规范范围”的区别，见 [核心概念](CONCEPTS.zh-CN.md)。

ACC 有意保持一个小而明确的规范核心。关于权限、租户隔离、审批流程、合规保留、回滚、编排等已知问题为什么不直接进入 ACC 核心，以及它们分别应该由哪一层负责，见 [设计依据与边界](DESIGN_RATIONALE.zh-CN.md)。

关于 ACC 与 OpenAPI、MCP、A2A、运行时控制、策略系统和工作流层的中立分层关系，见英文信息文档 [ACC in the Agent Governance Landscape](LANDSCAPE.md)。

| 维度 | 当前状态 |
|---|---|
| 规范 | ACC v1 稳定核心，按语义化版本治理 |
| 生态 | 早期采用阶段，欢迎独立实现 |
| Conformance | Profile、自评流程和机器可读的 v1 参考测试向量 |

## 为什么需要 ACC

传统业务系统通常不是为 A2B 而设计的。一旦 Agent 可以调用业务 API，团队很快会遇到同一组问题：

- 哪些接口可以暴露给 Agent？
- 哪些路由、场景、产品入口可以使用某个能力？
- 调用是否必须有真实业务主体？
- 这次调用是只读、低风险、中风险，还是高风险？
- 某些参数是否需要触发人工审批意图？
- 哪些字段是敏感数据，审计时应该脱敏？
- 业务自定义扩展如何保留，同时不隐式改变安全闸门？

ACC 把这些声明放到接口契约旁边，同时保留一个核心边界：

```text
ACC 管 reach：Agent 最多能触达哪些能力。
业务系统管 authority：这个主体此刻到底能不能做。
```

## OpenAPI 绑定

ACC v1 的首个绑定是 OpenAPI 扩展字段：

```yaml
x-agent-capability:
  version: 1
  enabled: true
  scope: order.read
  risk:
    level: low
  subject:
    required: true
  execution:
    readonly: true
```

规范正文见 [SPEC.md](SPEC.md)。

ACC v1 声明固定使用 `version: 1`；规范仓通过 `v1.0.1` 这类 Tag 标记准确发布修订。产品和运行时版本与 ACC 规范版本完全独立。

## 实现 ACC

- 阅读非规范性的 [实现者指南](IMPLEMENTER_GUIDE.md)；
- 从 [合规 Profile](conformance/PROFILES.md) 中选择准确的实现声明；
- 运行适用的 [机器可读 ACC v1 测试向量](conformance/v1/README.md)；
- 使用 [实现登记与自评流程](conformance/SELF_ASSESSMENT.md) 发布证据；
- 通过 pull request 登记到中立的 [实现列表](IMPLEMENTATIONS.md)。

## 目录结构

```text
SPEC.md                       ACC v1 规范正文
CONCEPTS.md                   A2B 与 ACC 核心概念
CONCEPTS.zh-CN.md             核心概念与范围边界中文版
bindings/openapi.md           OpenAPI 扩展绑定说明
schemas/acc.v1.schema.json    机器可读 JSON Schema
examples/                     OpenAPI 示例
conformance/README.md         实现者兼容性检查清单
conformance/PROFILES.md       Parser、Generator、Runtime 与策略组件 Profile
conformance/SELF_ASSESSMENT.md 开放登记与证据模板
conformance/v1/                机器可读的 ACC v1 Conformance 测试向量
proposals/                     公开的规范提案流程与模板
IMPLEMENTER_GUIDE.md          非规范性的实现架构指引
DESIGN_RATIONALE.md           ACC 保持小核心的原因与相邻职责边界
DESIGN_RATIONALE.zh-CN.md     设计依据与边界中文版
LANDSCAPE.md                  相邻协议与治理层的非规范性分层说明
IMPLEMENTATIONS.md            已知实现与声明口径
RELEASE_NOTES_v1.0.1.md       当前 ACC v1 补丁发布摘要
RELEASE_NOTES_v1.0.0.md       ACC v1 首个稳定规范发布摘要
GOVERNANCE.md                 维护、版本和扩展规则
CONTRIBUTING.md               契约修改贡献规则
CHANGELOG.md                  公开变更记录
NOTICE                        来源说明
LICENSE                       Apache-2.0 协议
```

## 实现

ACC 保持实现无关。控制面、API 网关、SDK 生成器、开发者工具、Agent 运行时、MCP 网关、策略引擎都可以实现 ACC。

已知实现按项目名称排序登记在 [IMPLEMENTATIONS.md](IMPLEMENTATIONS.md)。任何实现 ACC 的项目都可以发布自评证据并通过 pull request 申请登记；被列入不代表认证或背书。

## 协议

ACC 使用 Apache License 2.0。详见 [LICENSE](LICENSE)。

该协议允许使用、修改、再分发和商业实现 ACC。
