# 数据模型设计文档

## 1. 表结构
### 1. convertible_bonds
- 描述：可转债基本信息

#### 字段
| 字段名 | 数据类型 | 约束 | 描述 |
|--------|---------|------|------|
| id | SERIAL | 主键 | 主键ID |
| code | VARCHAR(20) | 唯一 | 转债代码 |
| name | VARCHAR(100) |  | 转债名称 |
| stock_code | VARCHAR(20) |  | 正股代码 |
| stock_name | VARCHAR(100) |  | 正股名称 |
| current_price | DECIMAL(10,2) |  | 当前价格 |
| stock_price | DECIMAL(10,2) |  | 正股价格 |
| conversion_price | DECIMAL(10,2) |  | 转股价格 |
| conversion_value | DECIMAL(10,2) |  | 转股价值 |
| premium_rate | DECIMAL(10,2) |  | 溢价率 |
| volume | BIGINT |  | 成交量 |
| market_cap | BIGINT |  | 市值 |
| maturity_date | DATE |  | 到期日期 |
| created_at | TIMESTAMP | 默认: NOW() | 创建时间 |
| updated_at | TIMESTAMP | 默认: NOW() | 更新时间 |

#### 索引
- idx_convertible_bonds_code: code (唯一)
- idx_convertible_bonds_premium_rate: premium_rate

### 2. arbitrage_opportunities
- 描述：套利机会信息

#### 字段
| 字段名 | 数据类型 | 约束 | 描述 |
|--------|---------|------|------|
| id | SERIAL | 主键 | 主键ID |
| bond_id | INTEGER | 外键(convertible_bonds.id) | 转债ID |
| strategy | VARCHAR(50) |  | 套利策略 |
| profit_rate | DECIMAL(10,2) |  | 预期收益率 |
| risk_level | VARCHAR(20) |  | 风险等级 |
| status | VARCHAR(20) |  | 状态（active, executed, expired） |
| created_at | TIMESTAMP | 默认: NOW() | 创建时间 |
| expired_at | TIMESTAMP |  | 过期时间 |

#### 索引
- idx_arbitrage_opportunities_bond_id: bond_id
- idx_arbitrage_opportunities_status: status

### 3. transactions
- 描述：交易记录

#### 字段
| 字段名 | 数据类型 | 约束 | 描述 |
|--------|---------|------|------|
| id | SERIAL | 主键 | 主键ID |
| opportunity_id | INTEGER | 外键(arbitrage_opportunities.id) | 套利机会ID |
| bond_id | INTEGER | 外键(convertible_bonds.id) | 转债ID |
| type | VARCHAR(20) |  | 交易类型（buy, sell） |
| amount | INTEGER |  | 交易数量 |
| price | DECIMAL(10,2) |  | 交易价格 |
| total_value | DECIMAL(10,2) |  | 交易总价值 |
| status | VARCHAR(20) |  | 交易状态（pending, executed, failed） |
| created_at | TIMESTAMP | 默认: NOW() | 创建时间 |
| executed_at | TIMESTAMP |  | 执行时间 |

#### 索引
- idx_transactions_opportunity_id: opportunity_id
- idx_transactions_status: status

### 4. alerts
- 描述：监控预警信息

#### 字段
| 字段名 | 数据类型 | 约束 | 描述 |
|--------|---------|------|------|
| id | SERIAL | 主键 | 主键ID |
| bond_id | INTEGER | 外键(convertible_bonds.id) | 转债ID |
| type | VARCHAR(50) |  | 预警类型 |
| message | TEXT |  | 预警消息 |
| severity | VARCHAR(20) |  | 严重程度（low, medium, high） |
| status | VARCHAR(20) |  | 状态（active, resolved） |
| created_at | TIMESTAMP | 默认: NOW() | 创建时间 |
| resolved_at | TIMESTAMP |  | 解决时间 |

#### 索引
- idx_alerts_bond_id: bond_id
- idx_alerts_severity: severity
- idx_alerts_status: status

## 2. 关系
### 1. bond_opportunity_relationship
- 从：arbitrage_opportunities.bond_id
- 到：convertible_bonds.id
- 类型：many-to-one

### 2. opportunity_transaction_relationship
- 从：transactions.opportunity_id
- 到：arbitrage_opportunities.id
- 类型：many-to-one

### 3. bond_transaction_relationship
- 从：transactions.bond_id
- 到：convertible_bonds.id
- 类型：many-to-one

### 4. bond_alert_relationship
- 从：alerts.bond_id
- 到：convertible_bonds.id
- 类型：many-to-one

## 3. 数据字典
| 表名 | 描述 |
|------|------|
| convertible_bonds | 可转债基本信息 |
| arbitrage_opportunities | 套利机会信息 |
| transactions | 交易记录 |
| alerts | 监控预警信息 |
