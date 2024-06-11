import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from "@angular-devkit/schematics/tasks";

const appConfigPath = '/src/app/app.config.ts';
const angularJsonPath = 'angular.json';
const tsConfigAppPath = 'tsconfig.app.json';
const angularVersion = '17.x.x'
const msalVersion = '3.x.x'
let projectName = '';

export function ngAdd(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding IOCO Angular Framework.....');
        projectName = getProjectName(tree);
        context.logger.info(`ProjectName: ${projectName}`);
        if (!tree.exists(appConfigPath)) {
            throw new SchematicsException(`The file ${appConfigPath} doesn't exists...`);
        }

        updateTsConfigAppJson(tree, context);

        // Run tasks to add custom schematics
        context.addTask(new RunSchematicTask('app-component', { tree, context }));
        context.addTask(new RunSchematicTask('app-config', { tree, context }));
        context.addTask(new RunSchematicTask('arm-templates', {}));
        context.addTask(new RunSchematicTask('authentication', { tree, context }));
        context.addTask(new RunSchematicTask('azure-pipeline', {}));
        context.addTask(new RunSchematicTask('configuration', { tree, context }));
        context.addTask(new RunSchematicTask('confirmation-dialog-box', { tree, context }));
        context.addTask(new RunSchematicTask('docker', {}));
        context.addTask(new RunSchematicTask('endpoints', { tree, context }));
        context.addTask(new RunSchematicTask('enums', { tree, context }));
        context.addTask(new RunSchematicTask('error-dialog-box', { tree, context }));
        context.addTask(new RunSchematicTask('error-interceptor', { tree, context }));
        context.addTask(new RunSchematicTask('extension-methods', { tree, context }));
        context.addTask(new RunSchematicTask('helpers', { tree, context }));
        context.addTask(new RunSchematicTask('karma-config', {}));
        context.addTask(new RunSchematicTask('loading-indicator', { tree, context }));
        context.addTask(new RunSchematicTask('mock-data', { tree, context }));
        context.addTask(new RunSchematicTask('monitoring', { tree, context }));
        context.addTask(new RunSchematicTask('page-not-found', { tree, context }));
        context.addTask(new RunSchematicTask('router', { tree, context }));
        context.addTask(new RunSchematicTask('unit-test-helpers', {}));
        context.addTask(new RunSchematicTask('user', { tree, context }));
        context.addTask(new RunSchematicTask('vscode', {}));
        context.addTask(new RunSchematicTask('web-config', { tree, context }));

        context.logger.info('Adding Angular Material.....');
        context.addTask(new RunSchematicTask(`@angular/material`, 'ng-add', {
            theme: "custom",
            typography: true,
            animations: "true"
        }));
        context.addTask(new NodePackageInstallTask({ packageName: `@angular/cdk@${angularVersion}` }));
        context.logger.info('Adding Microsoft Authentication Library.....');
        context.addTask(new NodePackageInstallTask({ packageName: `@azure/msal-browser@${msalVersion}` }));
        context.addTask(new NodePackageInstallTask({ packageName: `@azure/msal-angular@${msalVersion}` }));
        context.logger.info('Adding Application insights.....');
        context.addTask(new NodePackageInstallTask({ packageName: '@microsoft/applicationinsights-web' }));
        context.logger.info('Adding ESLint.....');
        context.addTask(new RunSchematicTask(`@angular-eslint/schematics`, 'ng-add', {}));
        context.logger.info('Adding DevDependency: concurrently.....');
        context.addTask(new NodePackageInstallTask({ packageName: 'concurrently --save-dev' }));
        context.logger.info('Adding DevDependency: dev-error-reporter.....');
        context.addTask(new NodePackageInstallTask({ packageName: 'dev-error-reporter --save-dev' }));
        context.logger.info('Adding DevDependency: json-concat.....');
        context.addTask(new NodePackageInstallTask({ packageName: 'json-concat --save-dev' }));
        context.logger.info('Adding DevDependency: json-server.....');
        context.addTask(new NodePackageInstallTask({ packageName: 'json-server --save-dev' }));
        context.logger.info('Adding DevDependency: karma-junit-reporter.....');
        context.addTask(new NodePackageInstallTask({ packageName: 'karma-junit-reporter --save-dev' }));
        context.logger.info('Adding DevDependency: karma-sonarqube-unit-reporter.....');
        context.addTask(new NodePackageInstallTask({ packageName: 'karma-sonarqube-unit-reporter --save-dev' }));
        context.logger.info('Adding DevDependency: onchange.....');
        context.addTask(new NodePackageInstallTask({ packageName: 'onchange --save-dev' }));
        context.logger.info('Adding DevDependency: typescript-json-schema.....');
        context.addTask(new NodePackageInstallTask({ packageName: 'typescript-json-schema --save-dev' }));

        context.logger.info('Update package.json.....');
        addScriptToPackageJson(tree, "build:config", "npx typescript-json-schema \"src/environments/config/config.interface.ts\" \"IConfig\" -o \"src/environments/config/config.schema.json\" --required true")
        addScriptToPackageJson(tree, "build:prod", "ng build -c production")
        addScriptToPackageJson(tree, "build:db", "json-concat ./src/app/mock-data/separated-entities/ ./src/app/mock-data/db.json")
        addScriptToPackageJson(tree, "start:mock-server", "npm run build:db & json-server --watch ./src/app/mock-data/db.json --silent")
        addScriptToPackageJson(tree, "start:mock", "concurrently \"ng serve --configuration=mock\" \"npm run start:mock-server\" \"npm run build:config\" \"npm run lint:watch\"")
        addScriptToPackageJson(tree, "start", "npm run start:mock")
        addScriptToPackageJson(tree, "start:dev", "ng serve --configuration=development")
        addScriptToPackageJson(tree, "lint:fix", "npm run lint --silent -- --fix")
        addScriptToPackageJson(tree, "lint:watch", "onchange \"src/**/*.ts\" -- onerror \"npm run lint --silent\"  -t Error -m \"There are linting errors on your Angular project\"")
        addScriptToPackageJson(tree, "e2e", "ng e2e")

        context.logger.info('Update angular.json.....');
        updateAngularJson(tree);

        context.logger.info('Installing dependencies (npm install)...');
        context.addTask(new NodePackageInstallTask());

        return tree;
    }

    interface PackageJson {
        scripts: Record<string, string>;
    }
    function addScriptToPackageJson(tree: Tree, scriptName: string, scriptContent: string): Tree {
        if (tree.exists("package.json")) {
            const sourceText = tree.read("package.json")!.toString("utf-8");
            const json = JSON.parse(sourceText) as PackageJson;
            if (!json.scripts) {
                json.scripts = {};
            }
            json.scripts[scriptName] = scriptContent;
            json.scripts = sortObjectByKeys(json.scripts);
            tree.overwrite("package.json", JSON.stringify(json, null, 2));
        }
        return tree;
    }

    /**
     * Sorts the keys of the given object.
     * @returns A new object instance with sorted keys
     */
    function sortObjectByKeys(obj: Record<string, string>) {
        return Object.keys(obj)
            .sort()
            .reduce((result, key) => {
                result[key] = obj[key];
                return result;
            }, {} as Record<string, string>);
    }

    function updateAngularJson(tree: Tree) {

        const assets: string[] = [
            "src/config.json",
            "src/web.config",
        ];
        const assetDev = JSON.parse(
            `[{
            "input": "src/config/dev",
            "output": "/",
            "glob": "config.json"
        }]`
        )
        const assetMock = JSON.parse(
            `[{
            "input": "src/config/mock",
            "output": "/",
            "glob": "config.json"
        }]`
        )
        const testOptionsReplacements = JSON.parse(
            `{
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ],
            "tsConfig": "tsconfig.spec.json",
            "karmaConfig": "karma.conf.js",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.scss"
            ],
            "scripts": []
          }`
        )

        if (tree.exists(angularJsonPath)) {
            const currentAngularJson = tree.read(angularJsonPath)!.toString('utf-8');
            const json = JSON.parse(currentAngularJson);
            const projectName = Object.keys(json['projects'])[0];

            const serveConfiguration = JSON.parse(
                `
            {
                "browserTarget": "${projectName}:build:mock"
            }
            `
            )

            const optionsJson = json['projects'][projectName]['architect']['build']['options'];
            assets.forEach((asset: string) => {
                optionsJson['assets'].push(asset);
            });
            json['projects'][projectName]['architect']['build']['options'] = optionsJson;


            const configurationDevJson = json['projects'][projectName]['architect']['build']['configurations']['development'];
            json['projects'][projectName]['architect']['build']['configurations']['mock'] = JSON.parse(JSON.stringify(configurationDevJson));
            const configurationMockJson = json['projects'][projectName]['architect']['build']['configurations']['mock'];

            configurationDevJson['assets'] = assetDev;
            json['projects'][projectName]['architect']['build']['configurations']['development'] = configurationDevJson;

            configurationMockJson['assets'] = assetMock;
            json['projects'][projectName]['architect']['build']['configurations']['mock'] = configurationMockJson;

            const configurationServe = json['projects'][projectName]['architect']['serve']['configurations']
            configurationServe['mock'] = serveConfiguration;
            json['projects'][projectName]['architect']['serve']['configurations'] = configurationServe;

            const configurationTest = json['projects'][projectName]['architect']['test']
            configurationTest["options"] = testOptionsReplacements
            json['projects'][projectName]['architect']['test'] = configurationTest;

            tree.overwrite(angularJsonPath, JSON.stringify(json, null, 2));
        } else {
            throw new SchematicsException('angular.json not found at ' + angularJsonPath);
        }
        return tree;
    }

    function getProjectName(tree: Tree): string {
        const workspaceConfigBuffer = tree.read(angularJsonPath);
        if (!workspaceConfigBuffer) {
            throw new Error('Could not find angular.json');
        }

        const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());

        if (!workspaceConfig.projects) {
            throw new Error('No projects found in angular.json');
        }

        // Assuming the first project listed is the default project
        const projectNames = Object.keys(workspaceConfig.projects);
        const defaultProjectName = workspaceConfig.defaultProject || projectNames[0];

        return defaultProjectName;
    }

    function updateTsConfigAppJson(tree: Tree, context: SchematicContext) {
        // Read the file
        const buffer = tree.read(tsConfigAppPath);
        if (!buffer) {
            throw new Error(`Could not find file: ${tsConfigAppPath}`);
        }

        // Parse the JSON content
        const tsConfig = JSON.parse(buffer.toString());

        // Add "resolveJsonModule": true
        if (!tsConfig.compilerOptions) {
            tsConfig.compilerOptions = {};
        }
        tsConfig.compilerOptions.resolveJsonModule = true;

        // Convert the JSON back to a string
        const updatedTsConfig = JSON.stringify(tsConfig, null, 2);

        // Write the updated content back to the file
        tree.overwrite(tsConfigAppPath, updatedTsConfig);

        context.logger.info(`Updated ${tsConfigAppPath} to include "resolveJsonModule": true`);
    }
}
