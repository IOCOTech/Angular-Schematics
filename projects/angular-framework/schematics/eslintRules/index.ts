import { Rule } from '@angular-devkit/schematics';
import { Tree, SchematicsException } from '@angular-devkit/schematics';

const eslintConfigPath = 'eslint.config.js';

export function updateESLint(): Rule {
    return (host: Tree) => {
        const configContent = readESLintConfig(host);
        const updatedConfigContent = updateESLintRules(configContent);
        writeESLintConfig(host, eslintConfigPath, updatedConfigContent);
        return host;
    };
}

function readESLintConfig(host: Tree): string {
    const configBuffer = host.read(eslintConfigPath);
    if (!configBuffer) {
        throw new SchematicsException(`Could not find (${eslintConfigPath})`);
    }
    return configBuffer.toString('utf-8');
}

function updateESLintRules(content: string): string {
    // This is a simplified example. You might need a more robust solution.
    // Locate the rules object and add or modify rules
    const rulesToAdd = `
      "@typescript-eslint/ban-tslint-comment": "off",
      "@typescript-eslint/consistent-indexed-object-style": "off"
      `;

      const updatedContent = content.replace(
        /rules:\s*{([\s\S]*?)}/,
        `rules: { ${rulesToAdd}, $1 }`
      );

    return updatedContent;
}

function writeESLintConfig(host: Tree, filePath: string, content: string): void {
    host.overwrite(filePath, content);
}

