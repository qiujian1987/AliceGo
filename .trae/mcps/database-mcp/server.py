from fastmcp import FastMCP
from fastmcp.tools import Tool
from fastmcp.server.http import create_streamable_http_app
import uvicorn
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from typing import Optional, Dict, Any, List
import os

app = FastMCP("database-mcp", "数据库操作MCP服务器")

_connections: Dict[str, Engine] = {}


@app.tool
def db_connect(database_url: str, connection_name: str = "default") -> Dict[str, Any]:
    """
    连接到数据库

    Args:
        database_url: 数据库连接URL，格式为 dialect+driver://username:password@host:port/database
        connection_name: 连接名称，默认为default

    Returns:
        连接结果
    """
    try:
        engine = create_engine(database_url)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        _connections[connection_name] = engine
        return {
            "status": "success",
            "message": f"数据库连接成功: {connection_name}",
            "connection_name": connection_name
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def db_disconnect(connection_name: str = "default") -> Dict[str, Any]:
    """
    断开数据库连接

    Args:
        connection_name: 连接名称，默认为default

    Returns:
        断开结果
    """
    try:
        if connection_name in _connections:
            _connections[connection_name].dispose()
            del _connections[connection_name]
            return {
                "status": "success",
                "message": f"数据库连接已断开: {connection_name}"
            }
        else:
            return {"status": "error", "message": f"连接不存在: {connection_name}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def db_execute_query(query: str, params: Optional[Dict[str, Any]] = None, connection_name: str = "default") -> Dict[str, Any]:
    """
    执行SQL查询（只读）

    Args:
        query: SQL查询语句
        params: 查询参数，字典格式
        connection_name: 连接名称，默认为default

    Returns:
        查询结果
    """
    try:
        if connection_name not in _connections:
            return {"status": "error", "message": f"连接不存在: {connection_name}"}
        
        engine = _connections[connection_name]
        with engine.connect() as conn:
            if params:
                result = conn.execute(text(query), params)
            else:
                result = conn.execute(text(query))
            
            columns = result.keys()
            rows = result.fetchall()
            
            data = []
            for row in rows:
                data.append(dict(zip(columns, row)))
            
            return {
                "status": "success",
                "columns": list(columns),
                "data": data,
                "row_count": len(data)
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def db_execute(command: str, params: Optional[Dict[str, Any]] = None, connection_name: str = "default") -> Dict[str, Any]:
    """
    执行SQL命令（写操作）

    Args:
        command: SQL命令
        params: 命令参数，字典格式
        connection_name: 连接名称，默认为default

    Returns:
        执行结果
    """
    try:
        if connection_name not in _connections:
            return {"status": "error", "message": f"连接不存在: {connection_name}"}
        
        engine = _connections[connection_name]
        with engine.connect() as conn:
            if params:
                result = conn.execute(text(command), params)
            else:
                result = conn.execute(text(command))
            conn.commit()
            
            return {
                "status": "success",
                "message": "命令执行成功",
                "row_count": result.rowcount if hasattr(result, 'rowcount') else 0
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def db_insert(table: str, data: Dict[str, Any], connection_name: str = "default") -> Dict[str, Any]:
    """
    插入数据

    Args:
        table: 表名
        data: 要插入的数据，字典格式
        connection_name: 连接名称，默认为default

    Returns:
        插入结果
    """
    try:
        if connection_name not in _connections:
            return {"status": "error", "message": f"连接不存在: {connection_name}"}
        
        columns = ", ".join(data.keys())
        placeholders = ", ".join([f":{k}" for k in data.keys()])
        query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
        
        engine = _connections[connection_name]
        with engine.connect() as conn:
            result = conn.execute(text(query), data)
            conn.commit()
            
            return {
                "status": "success",
                "message": f"数据插入成功，影响 {result.rowcount} 行",
                "row_count": result.rowcount
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def db_update(table: str, data: Dict[str, Any], where: str, connection_name: str = "default") -> Dict[str, Any]:
    """
    更新数据

    Args:
        table: 表名
        data: 要更新的数据，字典格式
        where: WHERE条件
        connection_name: 连接名称，默认为default

    Returns:
        更新结果
    """
    try:
        if connection_name not in _connections:
            return {"status": "error", "message": f"连接不存在: {connection_name}"}
        
        set_clause = ", ".join([f"{k} = :{k}" for k in data.keys()])
        query = f"UPDATE {table} SET {set_clause} WHERE {where}"
        
        engine = _connections[connection_name]
        with engine.connect() as conn:
            result = conn.execute(text(query), data)
            conn.commit()
            
            return {
                "status": "success",
                "message": f"数据更新成功，影响 {result.rowcount} 行",
                "row_count": result.rowcount
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def db_delete(table: str, where: str, connection_name: str = "default") -> Dict[str, Any]:
    """
    删除数据

    Args:
        table: 表名
        where: WHERE条件
        connection_name: 连接名称，默认为default

    Returns:
        删除结果
    """
    try:
        if connection_name not in _connections:
            return {"status": "error", "message": f"连接不存在: {connection_name}"}
        
        query = f"DELETE FROM {table} WHERE {where}"
        
        engine = _connections[connection_name]
        with engine.connect() as conn:
            result = conn.execute(text(query))
            conn.commit()
            
            return {
                "status": "success",
                "message": f"数据删除成功，影响 {result.rowcount} 行",
                "row_count": result.rowcount
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def db_get_schema(table: Optional[str] = None, connection_name: str = "default") -> Dict[str, Any]:
    """
    获取数据库或表的schema信息

    Args:
        table: 表名，如不指定则返回所有表信息
        connection_name: 连接名称，默认为default

    Returns:
        Schema信息
    """
    try:
        if connection_name not in _connections:
            return {"status": "error", "message": f"连接不存在: {connection_name}"}
        
        engine = _connections[connection_name]
        
        if table:
            inspector = engine.inspect()
            columns = inspector.get_columns(table)
            return {
                "status": "success",
                "table": table,
                "columns": columns
            }
        else:
            inspector = engine.inspect()
            tables = inspector.get_table_names()
            return {
                "status": "success",
                "tables": tables
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def db_list_tables(connection_name: str = "default") -> Dict[str, Any]:
    """
    列出所有表

    Args:
        connection_name: 连接名称，默认为default

    Returns:
        表列表
    """
    try:
        if connection_name not in _connections:
            return {"status": "error", "message": f"连接不存在: {connection_name}"}
        
        engine = _connections[connection_name]
        inspector = engine.inspect()
        tables = inspector.get_table_names()
        
        return {
            "status": "success",
            "tables": tables
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def db_optimize_query(query: str, connection_name: str = "default") -> Dict[str, Any]:
    """
    分析和优化SQL查询

    Args:
        query: SQL查询语句
        connection_name: 连接名称，默认为default

    Returns:
        查询分析结果和优化建议
    """
    try:
        if connection_name not in _connections:
            return {"status": "error", "message": f"连接不存在: {connection_name}"}
        
        engine = _connections[connection_name]
        dialect = engine.dialect.name
        
        suggestions = []
        
        if "SELECT *" in query.upper():
            suggestions.append("避免使用 SELECT *，只选择需要的列")
        
        if "LIMIT" not in query.upper() and query.upper().startswith("SELECT"):
            suggestions.append("对于查询量大的SELECT语句，建议添加LIMIT限制")
        
        if "WHERE" not in query.upper() and query.upper().startswith("SELECT"):
            suggestions.append("建议添加WHERE条件过滤数据")
        
        return {
            "status": "success",
            "dialect": dialect,
            "original_query": query,
            "suggestions": suggestions,
            "optimized": len(suggestions) == 0
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def db_ping(connection_name: str = "default") -> Dict[str, Any]:
    """
    检查数据库连接是否正常

    Args:
        connection_name: 连接名称，默认为default

    Returns:
        连接状态
    """
    try:
        if connection_name not in _connections:
            return {"status": "error", "message": f"连接不存在: {connection_name}"}
        
        engine = _connections[connection_name]
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        
        return {
            "status": "success",
            "message": "数据库连接正常",
            "connection_name": connection_name
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def db_get_connection_info(connection_name: str = "default") -> Dict[str, Any]:
    """
    获取连接信息

    Args:
        connection_name: 连接名称，默认为default

    Returns:
        连接信息
    """
    try:
        if connection_name not in _connections:
            return {"status": "error", "message": f"连接不存在: {connection_name}"}
        
        engine = _connections[connection_name]
        return {
            "status": "success",
            "connection_name": connection_name,
            "dialect": engine.dialect.name,
            "host": engine.url.host if hasattr(engine.url, 'host') else None,
            "database": engine.url.database if hasattr(engine.url, 'database') else None,
            "port": engine.url.port if hasattr(engine.url, 'port') else None
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    http_app = create_streamable_http_app(app, "/mcp")
    uvicorn.run(http_app, host="127.0.0.1", port=8002)