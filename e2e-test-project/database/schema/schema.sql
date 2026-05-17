-- ========================================
-- 个人笔记应用数据库 Schema
-- 数据库类型：SQLite
-- 创建时间：2026-05-17
-- 作者：@dba Agent
-- ========================================

-- ========================================
-- 表创建
-- ========================================

-- 笔记表
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 索引创建
-- ========================================

-- 按分类筛选的索引
CREATE INDEX IF NOT EXISTS idx_notes_category 
ON notes(category);

-- 按创建时间排序的索引
CREATE INDEX IF NOT EXISTS idx_notes_created_at 
ON notes(created_at DESC);

-- 按更新时间排序的索引
CREATE INDEX IF NOT EXISTS idx_notes_updated_at 
ON notes(updated_at DESC);

-- ========================================
-- FULLTEXT 搜索索引 (FTS5)
-- ========================================

-- 创建 FTS5 虚拟表用于全文搜索
CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5(
    title,
    content,
    content='notes',
    content_rowid='id',
    tokenize='porter unicode61'
);

-- 触发器：插入时同步 FTS 索引
CREATE TRIGGER IF NOT EXISTS notes_ai AFTER INSERT ON notes BEGIN
    INSERT INTO notes_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
END;

-- 触发器：更新时同步 FTS 索引
CREATE TRIGGER IF NOT EXISTS notes_au AFTER UPDATE ON notes BEGIN
    INSERT INTO notes_fts(notes_fts, rowid, title, content) VALUES('delete', old.id, old.title, old.content);
    INSERT INTO notes_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
END;

-- 触发器：删除时同步 FTS 索引
CREATE TRIGGER IF NOT EXISTS notes_ad AFTER DELETE ON notes BEGIN
    INSERT INTO notes_fts(notes_fts, rowid, title, content) VALUES('delete', old.id, old.title, old.content);
END;

-- ========================================
-- 触发器
-- ========================================

-- 更新时间戳触发器
CREATE TRIGGER IF NOT EXISTS update_note_timestamp 
AFTER UPDATE ON notes
BEGIN
    UPDATE notes 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- ========================================
-- 初始化数据（可选）
-- ========================================

-- 示例笔记数据（用于测试）
INSERT INTO notes (title, content, category) VALUES 
('欢迎使用笔记应用', '这是您的第一条笔记！开始记录您的想法吧。', '使用指南'),
('示例笔记', '这是一个示例笔记，展示了笔记的基本功能。', '示例');

-- ========================================
-- 常用查询示例
-- ========================================

-- 查询1：获取所有笔记（按时间倒序）
-- SELECT * FROM notes ORDER BY created_at DESC;

-- 查询2：按分类筛选笔记
-- SELECT * FROM notes WHERE category = '工作' ORDER BY created_at DESC;

-- 查询3：全文搜索
-- SELECT * FROM notes WHERE rowid IN (
--     SELECT rowid FROM notes_fts WHERE notes_fts MATCH '关键词'
-- );

-- 查询4：获取分类统计
-- SELECT category, COUNT(*) as count 
-- FROM notes 
-- WHERE category != '' 
-- GROUP BY category 
-- ORDER BY count DESC;

-- ========================================
-- Schema 版本信息
-- ========================================

-- 创建版本表（用于数据库迁移）
CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- 记录当前版本
INSERT INTO schema_version (version, description) VALUES (1, 'Initial schema with notes table and fulltext search');
