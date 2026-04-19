# API合同文档

## 1. 基础信息
- 版本：1.0.0
- 基础路径：/api
- 认证方式：JWT

## 2. API列表
### 1. GET /api/data/convertible-bonds
- 描述：获取可转债数据

#### 请求参数
##### 查询参数
- page (number)
- limit (number)
- sort (string)

#### 响应
##### 200
```json
{
  "data": "array",
  "total": "number",
  "page": "number",
  "limit": "number"
}```
##### 400
```json
{
  "error": "string"
}```

### 2. POST /api/strategy/analyze
- 描述：分析可转债套利机会

#### 请求参数
##### 请求体
```json
{
  "bonds": "array",
  "strategy": "string"
}```

#### 响应
##### 200
```json
{
  "opportunities": "array",
  "analysis": "object"
}```
##### 400
```json
{
  "error": "string"
}```

### 3. GET /api/monitor/alerts
- 描述：获取监控预警信息

#### 请求参数
##### 查询参数
- status (string)
- limit (number)

#### 响应
##### 200
```json
{
  "alerts": "array",
  "total": "number"
}```
##### 400
```json
{
  "error": "string"
}```

### 4. POST /api/trading/execute
- 描述：执行自动交易

#### 请求参数
##### 请求体
```json
{
  "opportunity_id": "string",
  "amount": "number",
  "type": "string"
}```

#### 响应
##### 200
```json
{
  "transaction_id": "string",
  "status": "string",
  "details": "object"
}```
##### 400
```json
{
  "error": "string"
}```

### 5. GET /api/trading/history
- 描述：获取交易历史

#### 请求参数
##### 查询参数
- start_date (string)
- end_date (string)
- page (number)
- limit (number)

#### 响应
##### 200
```json
{
  "transactions": "array",
  "total": "number",
  "page": "number",
  "limit": "number"
}```
##### 400
```json
{
  "error": "string"
}```

## 3. 错误处理
| 状态码 | 描述 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
