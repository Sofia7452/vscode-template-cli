import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.generateFiles', async () => {
        // 提示用户输入文件夹名称
        const folderName = await vscode.window.showInputBox({
            prompt: '请输入要检查的文件夹名称',
            placeHolder: '例如：specific_folder'
        });

        if (!folderName) {
            vscode.window.showErrorMessage('未输入文件夹名称');
            return;
        }

        // 获取工作区根路径
        const rootPath = vscode.workspace.rootPath || '';
        const specificFolderPath = path.join(rootPath, folderName);

        // 配置文件路径
        const configFilePath = path.join(specificFolderPath, 'config.json');

        // 检查特定文件夹是否存在
        if (!fs.existsSync(specificFolderPath)) {
            vscode.window.showErrorMessage(`${folderName} 文件夹不存在`);
            return;
        }

        // 检查配置文件是否存在
        if (!fs.existsSync(configFilePath)) {
            vscode.window.showErrorMessage('config.json 文件不存在');
            return;
        }

        // 读取配置文件
        const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
        const modules = config.module_list;

        // 生成文件夹路径
        const outputDir = specificFolderPath;  // 在用户指定的文件夹下生成文件

        // 确保生成文件夹存在
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // 生成模板文件
        Object.entries(modules).forEach(([moduleName, moduleValue]) => {
            const fileName = path.join(outputDir, `${moduleName}.html`);
            const content = `<!-- ${moduleValue} 模板 -->\n`;
            fs.writeFileSync(fileName, content, 'utf8');
            vscode.window.showInformationMessage(`生成文件: ${fileName}`);
        });

        // 生成整体文件
        const overallFileName = path.join(outputDir, 'overall.html');
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div>
    {{name}}
    {{age}}
  </div>
</body>
</html>`;
        fs.writeFileSync(overallFileName, htmlContent, 'utf8');
        vscode.window.showInformationMessage(`生成整体文件: ${overallFileName}`);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}