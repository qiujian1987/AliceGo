from fastmcp import FastMCP
from fastmcp.tools import Tool
from fastmcp.server.http import create_streamable_http_app
import uvicorn
import git
import os
from typing import Optional, List, Dict, Any

app = FastMCP("git-mcp", "Git版本控制MCP服务器")


@app.tool
def git_create_branch(branch_name: str, base_branch: Optional[str] = None) -> Dict[str, Any]:
    """
    创建新分支

    Args:
        branch_name: 新分支名称
        base_branch: 基于哪个分支创建，默认为当前分支

    Returns:
        操作结果
    """
    try:
        repo = git.Repo(os.getcwd())
        if base_branch:
            repo.git.checkout(base_branch)
        repo.create_head(branch_name)
        repo.git.checkout(branch_name)
        return {
            "status": "success",
            "message": f"分支 '{branch_name}' 创建成功",
            "current_branch": branch_name
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def git_checkout_branch(branch_name: str) -> Dict[str, Any]:
    """
    切换分支

    Args:
        branch_name: 要切换到的分支名称

    Returns:
        操作结果
    """
    try:
        repo = git.Repo(os.getcwd())
        repo.git.checkout(branch_name)
        return {
            "status": "success",
            "message": f"已切换到分支 '{branch_name}'",
            "current_branch": branch_name
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def git_list_branches() -> Dict[str, Any]:
    """
    列出所有分支

    Returns:
        分支列表
    """
    try:
        repo = git.Repo(os.getcwd())
        branches = [str(b) for b in repo.branches]
        current_branch = repo.active_branch.name
        return {
            "status": "success",
            "branches": branches,
            "current_branch": current_branch
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def git_commit(message: str, files: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    提交代码

    Args:
        message: 提交信息
        files: 要提交的文件列表，默认为所有修改的文件

    Returns:
        操作结果
    """
    try:
        repo = git.Repo(os.getcwd())
        if files:
            repo.index.add(files)
        else:
            repo.index.add("*")
        repo.index.commit(message)
        commit_hash = repo.head.commit.hexsha[:7]
        return {
            "status": "success",
            "message": f"提交成功: {commit_hash}",
            "commit_hash": repo.head.commit.hexsha,
            "short_hash": commit_hash
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def git_push(branch: Optional[str] = None) -> Dict[str, Any]:
    """
    推送分支到远程仓库

    Args:
        branch: 要推送的分支名称，默认为当前分支

    Returns:
        操作结果
    """
    try:
        repo = git.Repo(os.getcwd())
        if not branch:
            branch = repo.active_branch.name
        origin = repo.remote("origin")
        origin.push(branch)
        return {
            "status": "success",
            "message": f"分支 '{branch}' 已推送到远程仓库"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def git_pull(branch: Optional[str] = None) -> Dict[str, Any]:
    """
    从远程仓库拉取代码

    Args:
        branch: 要拉取的分支名称，默认为当前分支

    Returns:
        操作结果
    """
    try:
        repo = git.Repo(os.getcwd())
        if not branch:
            branch = repo.active_branch.name
        origin = repo.remote("origin")
        origin.pull(branch)
        return {
            "status": "success",
            "message": f"已从远程仓库拉取分支 '{branch}' 的最新代码"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def git_merge(source_branch: str, target_branch: Optional[str] = None) -> Dict[str, Any]:
    """
    合并分支

    Args:
        source_branch: 源分支（要合并的分支）
        target_branch: 目标分支（合并到哪个分支），默认为当前分支

    Returns:
        操作结果
    """
    try:
        repo = git.Repo(os.getcwd())
        if not target_branch:
            target_branch = repo.active_branch.name
        repo.git.checkout(target_branch)
        result = repo.git.merge(source_branch)
        return {
            "status": "success",
            "message": f"分支 '{source_branch}' 已合并到 '{target_branch}'",
            "merge_result": result
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def git_check_conflict(source_branch: str, target_branch: Optional[str] = None) -> Dict[str, Any]:
    """
    检查合并冲突

    Args:
        source_branch: 源分支
        target_branch: 目标分支，默认为当前分支

    Returns:
        冲突检查结果
    """
    try:
        repo = git.Repo(os.getcwd())
        if not target_branch:
            target_branch = repo.active_branch.name
        result = repo.git.merge_base(source_branch, target_branch)
        conflicts = []
        try:
            repo.git.checkout(target_branch)
            repo.git.merge("--no-commit", "--no-ff", source_branch)
            if repo.is_dirty():
                conflicts = [item.a_path for item in repo.index.diff(None)]
            repo.git.merge("--abort")
        except git.exc.GitCommandError:
            pass
        return {
            "status": "success",
            "conflicts": conflicts,
            "has_conflict": len(conflicts) > 0,
            "base_commit": result
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def git_log(limit: int = 10) -> Dict[str, Any]:
    """
    查看提交历史

    Args:
        limit: 返回的提交数量，默认为10

    Returns:
        提交历史列表
    """
    try:
        repo = git.Repo(os.getcwd())
        commits = []
        for commit in repo.iter_commits(max_count=limit):
            commits.append({
                "hash": commit.hexsha,
                "short_hash": commit.hexsha[:7],
                "message": commit.message.strip(),
                "author": commit.author.name,
                "date": commit.authored_datetime.isoformat()
            })
        return {
            "status": "success",
            "commits": commits
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.tool
def git_status() -> Dict[str, Any]:
    """
    查看工作区状态

    Returns:
        工作区状态信息
    """
    try:
        repo = git.Repo(os.getcwd())
        changed_files = []
        untracked_files = []
        for item in repo.index.diff(None):
            changed_files.append(item.a_path)
        for item in repo.untracked_files:
            untracked_files.append(item)
        return {
            "status": "success",
            "current_branch": repo.active_branch.name,
            "changed_files": changed_files,
            "untracked_files": untracked_files,
            "is_dirty": repo.is_dirty()
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    http_app = create_streamable_http_app(app, "/mcp")
    uvicorn.run(http_app, host="127.0.0.1", port=8001)