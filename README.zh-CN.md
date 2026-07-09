<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/acc-logo-light.svg">
    <img src="./assets/acc-logo.svg" width="88" alt="Agent Capability Contract logo">
  </picture>
</p>

<h1 align="center">Agent Capability Contract（ACC）</h1>

**ACC（Agent Capability Contract）** 是一套开放的 Agent 能力声明契约，用来描述业务系统可以把哪些业务能力开放给 Agent 调用，以及这些能力应该如何被治理。

ACC 不是运行时、不是聊天机器人框架、也不是工作流引擎。它只定义一件事：业务能力在进入 Agent 世界前，应该如何声明可见范围、风险、主体、审批意图、审计和扩展信息。

ACC 是 **A2B（Agent-to-Business）** 场景下的能力声明契约。A2B 指的是：让 Agent 安全、可治理地接入已有业务系统，并代替真实业务主体查数据、办业务、走流程。

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

## 目录结构

```text
SPEC.md                       ACC v1 规范正文
CONCEPTS.md                   A2B 与 ACC 核心概念
bindings/openapi.md           OpenAPI 扩展绑定说明
schemas/acc.v1.schema.json    机器可读 JSON Schema
examples/                     OpenAPI 示例
conformance/README.md         实现者兼容性检查清单
IMPLEMENTATIONS.md            已知实现与声明口径
GOVERNANCE.md                 维护、版本和扩展规则
CONTRIBUTING.md               契约修改贡献规则
CHANGELOG.md                  公开变更记录
NOTICE                        来源说明
LICENSE                       Apache-2.0 协议
```

## 实现

ACC 保持实现无关。控制面、API 网关、SDK 生成器、开发者工具、Agent 运行时、MCP 网关、策略引擎都可以实现 ACC。

已知实现见 [IMPLEMENTATIONS.md](IMPLEMENTATIONS.md)。任何实现 ACC 的项目都可以通过 pull request 提交到该列表。

## 协议

ACC 使用 Apache License 2.0。详见 [LICENSE](LICENSE)。

该协议允许使用、修改、再分发和商业实现 ACC。
