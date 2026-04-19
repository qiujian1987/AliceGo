-- 数据库schema

-- 可转债基本信息
CREATE TABLE IF NOT EXISTS convertible_bonds (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE,
  name VARCHAR(100),
  stock_code VARCHAR(20),
  stock_name VARCHAR(100),
  current_price DECIMAL(10,2),
  stock_price DECIMAL(10,2),
  conversion_price DECIMAL(10,2),
  conversion_value DECIMAL(10,2),
  premium_rate DECIMAL(10,2),
  volume BIGINT,
  market_cap BIGINT,
  maturity_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_convertible_bonds_code ON convertible_bonds (code);
CREATE INDEX IF NOT EXISTS idx_convertible_bonds_premium_rate ON convertible_bonds (premium_rate);

-- 套利机会信息
CREATE TABLE IF NOT EXISTS arbitrage_opportunities (
  id SERIAL PRIMARY KEY,
  bond_id INTEGER,
  strategy VARCHAR(50),
  profit_rate DECIMAL(10,2),
  risk_level VARCHAR(20),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  expired_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_arbitrage_opportunities_bond_id ON arbitrage_opportunities (bond_id);
CREATE INDEX IF NOT EXISTS idx_arbitrage_opportunities_status ON arbitrage_opportunities (status);

-- 交易记录
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  opportunity_id INTEGER,
  bond_id INTEGER,
  type VARCHAR(20),
  amount INTEGER,
  price DECIMAL(10,2),
  total_value DECIMAL(10,2),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  executed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_opportunity_id ON transactions (opportunity_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions (status);

-- 监控预警信息
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  bond_id INTEGER,
  type VARCHAR(50),
  message TEXT,
  severity VARCHAR(20),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alerts_bond_id ON alerts (bond_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts (severity);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts (status);

ALTER TABLE arbitrage_opportunities ADD CONSTRAINT fk_arbitrage_opportunities_convertible_bonds FOREIGN KEY (bond_id) REFERENCES convertible_bonds (id);
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_arbitrage_opportunities FOREIGN KEY (opportunity_id) REFERENCES arbitrage_opportunities (id);
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_convertible_bonds FOREIGN KEY (bond_id) REFERENCES convertible_bonds (id);
ALTER TABLE alerts ADD CONSTRAINT fk_alerts_convertible_bonds FOREIGN KEY (bond_id) REFERENCES convertible_bonds (id);
