# 5 分钟给现有 OpenAPI 服务加上 ACC

这份指南会给一份已有 OpenAPI 文档添加一个 ACC 声明，并验证结果。完成
这个过程不需要先部署 ACC 运行时，也不要求修改业务系统代码。

作者校验器属于非规范性工具。ACC 规范正文和 OpenAPI Binding 仍然是最终
依据。

## 第一步：安装作者校验器

无需全局安装即可运行已发布的校验器：

```bash
npx --yes agent-capability-contract@1.0.5 validate ./openapi.yaml
```

也可以把校验器添加为项目开发依赖：

```bash
npm install --save-dev agent-capability-contract@1.0.5
```

该包要求使用 Node.js 20 或更高版本。

## 第二步：声明一个已有操作

在你的 OpenAPI 文档中找到一个 operation。只读接口通常适合作为第一个
接入对象：

```yaml
paths:
  /orders/{order_id}:
    get:
      operationId: getOrder
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
      responses:
        '200':
          description: Order details
```

这段声明表示：该操作被显式开放给 Agent 入口；它属于 `order.read`
scope；风险等级为 low；调用必须绑定可信业务主体；操作本身只读。

它并不表示这个主体一定有权读取某个订单。最终授权仍然由业务系统判断。

当你希望保留声明、但不希望当前操作暴露给 Agent 时，使用
`enabled: false`。

## 第三步：验证 OpenAPI 文档

运行校验器：

```bash
npx acc-validate /你的绝对路径/openapi.yaml
```

在 CI 或其他开发者工具中使用 JSON 输出：

```bash
npx acc-validate \
  --format json \
  /你的绝对路径/openapi.yaml
```

当“整份文档没有任何 ACC 声明”也应该失败时，启用严格模式：

```bash
npx acc-validate \
  --strict \
  /你的绝对路径/openapi.yaml
```

退出码保持稳定：

| 退出码 | 含义 |
|---|---|
| `0` | 验证通过 |
| `1` | 至少一份文档失败，或严格模式将警告提升为失败 |
| `2` | 命令参数错误 |

## 第四步：只有输入已声明时，才添加条件审批

审批条件必须能解析到 OpenAPI parameter，或者 JSON 请求体中的某个属性：

```yaml
paths:
  /refunds:
    post:
      x-agent-capability:
        version: 1
        enabled: true
        scope: refund.create
        risk:
          level: high
        subject:
          required: true
        approval:
          when:
            - param: amount
              op: '>'
              value: 1000
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                amount:
                  type: number
```

校验器会拒绝无法解析或存在歧义的条件路径，也会拒绝依赖 JSON 隐式类型
转换的比较值。

完整的 [订单服务示例](examples/openapi-order-service.yaml) 在同一份 OpenAPI
文档中演示了只读、写操作、条件审批、审计和禁用操作。

## 这个工具会检查什么

- OpenAPI `3.0.x` 和 `3.1.x` 的 YAML 或 JSON 文档；
- `x-agent-capability` 是否放在 operation 层；
- ACC v1 声明结构；
- 当前文件和本地文件 `$ref`；
- OpenAPI parameter 与 JSON 请求体属性的输入映射；
- `approval.when.param` 能否解析、是否存在歧义；
- 比较操作符与 JSON Schema 类型是否兼容；
- 机器可读诊断和稳定退出码。

## 这个工具不声称什么

- 它不是完整的 OpenAPI 校验器或 Linter；
- 它不会拉取远程 `$ref`；
- 它不判断动态业务权限；
- 它不执行审批工作流或业务操作；
- 通过作者校验不等于获得 ACC 实现认证。

下一步可以阅读 [OpenAPI Binding](bindings/openapi.md) 和
[实现者指南](IMPLEMENTER_GUIDE.md)。
