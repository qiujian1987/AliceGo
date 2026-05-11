const fs = require('fs');
const path = require('path');

class FileOperation {
  constructor() {
    // 禁止创建的文件类型
    this.forbiddenPatterns = [
      /\.bak$/,
      /_backup\./,
      /\.tmp$/,
      /^temp_/
    ];
    
    // 目录层级限制
    this.maxDepth = 3;
    this.maxSiblingDirs = 10;
    this.maxSiblingFiles = 20;
  }

  /**
   * 创建文件
   * @param {Object} params - 参数
   * @param {string} params.filePath - 文件路径
   * @param {string} params.content - 文件内容
   * @param {boolean} params.overwrite - 是否覆盖已存在文件
   * @returns {Object} 操作结果
   */
  async createFile(params) {
    try {
      const { filePath, content, overwrite = false } = params;

      // 参数验证
      if (!filePath) {
        return { status: 'error', message: '文件路径不能为空' };
      }
      if (content === undefined || content === null) {
        return { status: 'error', message: '文件内容不能为空' };
      }

      // 安全检查
      const securityCheck = this.checkFileSecurity(filePath);
      if (!securityCheck.valid) {
        return { status: 'error', message: securityCheck.message };
      }

      // 路径检查
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        // 自动创建父目录
        await this.createDirectory({ dirPath });
      }

      // 检查是否已存在
      if (fs.existsSync(filePath)) {
        if (!overwrite) {
          return { 
            status: 'error', 
            message: `文件已存在: ${filePath}，请使用 overwrite: true 参数覆盖` 
          };
        }
        console.log(`警告：覆盖已存在的文件: ${filePath}`);
      }

      // 写入文件
      fs.writeFileSync(filePath, content, 'utf-8');

      // 创建后验证
      if (!fs.existsSync(filePath)) {
        return { status: 'error', message: '文件创建失败' };
      }

      const stats = fs.statSync(filePath);
      if (stats.size === 0 && content.length > 0) {
        return { status: 'error', message: '文件内容写入不完整' };
      }

      return {
        status: 'success',
        message: `文件创建成功: ${filePath}`,
        data: {
          filePath,
          size: stats.size,
          createdAt: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        status: 'error',
        message: `文件创建失败: ${error.message}`
      };
    }
  }

  /**
   * 修改文件内容
   * @param {Object} params - 参数
   * @param {string} params.filePath - 文件路径
   * @param {string} params.oldContent - 旧内容（用于替换）
   * @param {string} params.newContent - 新内容
   * @param {boolean} params.replaceAll - 是否替换所有匹配
   * @returns {Object} 操作结果
   */
  async modifyFile(params) {
    try {
      const { filePath, oldContent, newContent, replaceAll = false } = params;

      // 参数验证
      if (!filePath) {
        return { status: 'error', message: '文件路径不能为空' };
      }

      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        return { status: 'error', message: `文件不存在: ${filePath}` };
      }

      // 读取当前内容
      const currentContent = fs.readFileSync(filePath, 'utf-8');

      // 执行替换
      let modifiedContent;
      if (oldContent) {
        if (replaceAll) {
          modifiedContent = currentContent.split(oldContent).join(newContent);
        } else {
          modifiedContent = currentContent.replace(oldContent, newContent);
        }
      } else {
        // 如果没有指定旧内容，直接覆盖整个文件
        modifiedContent = newContent;
      }

      // 写入修改后的内容
      fs.writeFileSync(filePath, modifiedContent, 'utf-8');

      return {
        status: 'success',
        message: `文件修改成功: ${filePath}`,
        data: {
          filePath,
          changes: oldContent ? '部分替换' : '完全覆盖',
          modifiedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        status: 'error',
        message: `文件修改失败: ${error.message}`
      };
    }
  }

  /**
   * 删除文件
   * @param {Object} params - 参数
   * @param {string} params.filePath - 文件路径
   * @param {boolean} params.force - 是否强制删除（跳过确认）
   * @returns {Object} 操作结果
   */
  async deleteFile(params) {
    try {
      const { filePath, force = false } = params;

      // 参数验证
      if (!filePath) {
        return { status: 'error', message: '文件路径不能为空' };
      }

      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        return { status: 'error', message: `文件不存在: ${filePath}` };
      }

      // 安全检查：不允许删除关键文件
      const criticalFiles = [
        /package\.json$/,
        /package-lock\.json$/,
        /\.gitignore$/,
        /\.trae/
      ];
      
      for (const pattern of criticalFiles) {
        if (pattern.test(filePath)) {
          return { status: 'error', message: `禁止删除关键文件: ${filePath}` };
        }
      }

      // 非强制模式下，检查是否被引用（简单检查）
      if (!force) {
        const isReferenced = await this.checkFileReferences(filePath);
        if (isReferenced) {
          return {
            status: 'warning',
            message: `文件可能被其他文件引用: ${filePath}，请确认后使用 force: true 删除`
          };
        }
      }

      // 删除文件
      fs.unlinkSync(filePath);

      // 验证删除成功
      if (fs.existsSync(filePath)) {
        return { status: 'error', message: '文件删除失败' };
      }

      return {
        status: 'success',
        message: `文件删除成功: ${filePath}`,
        data: {
          filePath,
          deletedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        status: 'error',
        message: `文件删除失败: ${error.message}`
      };
    }
  }

  /**
   * 创建目录
   * @param {Object} params - 参数
   * @param {string} params.dirPath - 目录路径
   * @returns {Object} 操作结果
   */
  async createDirectory(params) {
    try {
      const { dirPath } = params;

      // 参数验证
      if (!dirPath) {
        return { status: 'error', message: '目录路径不能为空' };
      }

      // 检查是否已存在
      if (fs.existsSync(dirPath)) {
        return { status: 'success', message: `目录已存在: ${dirPath}` };
      }

      // 检查目录层级
      const depth = dirPath.split(path.sep).filter(p => p).length;
      if (depth > this.maxDepth) {
        return { status: 'error', message: `目录层级超过限制（最大${this.maxDepth}层）` };
      }

      // 创建目录
      fs.mkdirSync(dirPath, { recursive: true });

      // 验证创建成功
      if (!fs.existsSync(dirPath)) {
        return { status: 'error', message: '目录创建失败' };
      }

      return {
        status: 'success',
        message: `目录创建成功: ${dirPath}`,
        data: {
          dirPath,
          createdAt: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        status: 'error',
        message: `目录创建失败: ${error.message}`
      };
    }
  }

  /**
   * 删除目录
   * @param {Object} params - 参数
   * @param {string} params.dirPath - 目录路径
   * @param {boolean} params.force - 是否强制删除（包括非空目录）
   * @returns {Object} 操作结果
   */
  async deleteDirectory(params) {
    try {
      const { dirPath, force = false } = params;

      // 参数验证
      if (!dirPath) {
        return { status: 'error', message: '目录路径不能为空' };
      }

      // 检查目录是否存在
      if (!fs.existsSync(dirPath)) {
        return { status: 'error', message: `目录不存在: ${dirPath}` };
      }

      // 安全检查：不允许删除关键目录
      const criticalDirs = ['node_modules', '.git', '.trae'];
      const dirName = path.basename(dirPath);
      if (criticalDirs.includes(dirName)) {
        return { status: 'error', message: `禁止删除关键目录: ${dirPath}` };
      }

      // 检查目录是否为空
      const files = fs.readdirSync(dirPath);
      if (files.length > 0 && !force) {
        return {
          status: 'warning',
          message: `目录非空（包含${files.length}个文件），请使用 force: true 删除`
        };
      }

      // 删除目录
      fs.rmdirSync(dirPath, { recursive: true });

      // 验证删除成功
      if (fs.existsSync(dirPath)) {
        return { status: 'error', message: '目录删除失败' };
      }

      return {
        status: 'success',
        message: `目录删除成功: ${dirPath}`,
        data: {
          dirPath,
          deletedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        status: 'error',
        message: `目录删除失败: ${error.message}`
      };
    }
  }

  /**
   * 追加内容到文件
   * @param {Object} params - 参数
   * @param {string} params.filePath - 文件路径
   * @param {string} params.content - 追加内容
   * @returns {Object} 操作结果
   */
  async appendFile(params) {
    try {
      const { filePath, content } = params;

      // 参数验证
      if (!filePath) {
        return { status: 'error', message: '文件路径不能为空' };
      }
      if (!content) {
        return { status: 'error', message: '追加内容不能为空' };
      }

      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        return { status: 'error', message: `文件不存在: ${filePath}` };
      }

      // 追加内容
      fs.appendFileSync(filePath, content, 'utf-8');

      return {
        status: 'success',
        message: `内容追加成功: ${filePath}`,
        data: {
          filePath,
          appendedLength: content.length,
          modifiedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        status: 'error',
        message: `内容追加失败: ${error.message}`
      };
    }
  }

  /**
   * 读取文件内容
   * @param {Object} params - 参数
   * @param {string} params.filePath - 文件路径
   * @returns {Object} 操作结果
   */
  async readFile(params) {
    try {
      const { filePath } = params;

      // 参数验证
      if (!filePath) {
        return { status: 'error', message: '文件路径不能为空' };
      }

      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        return { status: 'error', message: `文件不存在: ${filePath}` };
      }

      // 读取文件内容
      const content = fs.readFileSync(filePath, 'utf-8');

      return {
        status: 'success',
        message: `文件读取成功: ${filePath}`,
        data: {
          filePath,
          content,
          size: content.length
        }
      };

    } catch (error) {
      return {
        status: 'error',
        message: `文件读取失败: ${error.message}`
      };
    }
  }

  /**
   * 列出目录内容
   * @param {Object} params - 参数
   * @param {string} params.dirPath - 目录路径
   * @returns {Object} 操作结果
   */
  async listDirectory(params) {
    try {
      const { dirPath } = params;

      // 参数验证
      if (!dirPath) {
        return { status: 'error', message: '目录路径不能为空' };
      }

      // 检查目录是否存在
      if (!fs.existsSync(dirPath)) {
        return { status: 'error', message: `目录不存在: ${dirPath}` };
      }

      // 读取目录内容
      const items = fs.readdirSync(dirPath, { withFileTypes: true });

      // 组织结果
      const result = {
        directories: [],
        files: []
      };

      items.forEach(item => {
        const fullPath = path.join(dirPath, item.name);
        const stats = fs.statSync(fullPath);
        
        if (item.isDirectory()) {
          result.directories.push({
            name: item.name,
            path: fullPath,
            lastModified: stats.mtime.toISOString()
          });
        } else {
          result.files.push({
            name: item.name,
            path: fullPath,
            size: stats.size,
            lastModified: stats.mtime.toISOString()
          });
        }
      });

      return {
        status: 'success',
        message: `目录内容读取成功: ${dirPath}`,
        data: result
      };

    } catch (error) {
      return {
        status: 'error',
        message: `目录内容读取失败: ${error.message}`
      };
    }
  }

  /**
   * 检查文件安全性
   * @param {string} filePath - 文件路径
   * @returns {Object} 检查结果
   */
  checkFileSecurity(filePath) {
    // 检查文件名是否符合规范
    const fileName = path.basename(filePath);
    
    // 检查禁止创建的文件类型
    for (const pattern of this.forbiddenPatterns) {
      if (pattern.test(fileName)) {
        return {
          valid: false,
          message: `禁止创建此类文件: ${fileName}`
        };
      }
    }

    // 检查路径遍历攻击
    if (filePath.includes('..')) {
      return {
        valid: false,
        message: '文件路径不允许包含 ..'
      };
    }

    return {
      valid: true,
      message: '安全检查通过'
    };
  }

  /**
   * 检查文件是否被引用（简单实现）
   * @param {string} filePath - 文件路径
   * @returns {boolean} 是否被引用
   */
  async checkFileReferences(filePath) {
    // 简单实现：检查同目录下的文件是否引用该文件
    try {
      const dirPath = path.dirname(filePath);
      const fileName = path.basename(filePath);
      
      if (!fs.existsSync(dirPath)) {
        return false;
      }

      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
      for (const file of files) {
        if (file === fileName) continue;
        
        const content = fs.readFileSync(path.join(dirPath, file), 'utf-8');
        if (content.includes(fileName)) {
          return true;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }
}

// 导出技能
module.exports = new FileOperation();
