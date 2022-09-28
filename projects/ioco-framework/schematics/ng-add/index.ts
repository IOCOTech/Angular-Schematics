import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { RunSchematicTask } from "@angular-devkit/schematics/tasks";
// import { addImportToModule } from '@schematics/angular/utility/ast-utils';
// import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
// import * as ts from 'typescript';

export function ngAdd(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding IOCO Framework.....');

        const modulePath = 'src/app/app.module.ts'
        if (!tree.exists(modulePath)) {
            throw new SchematicsException(`the file ${modulePath} doesn't exist`)
        }

        // const recorder = tree.beginUpdate(modulePath);

        // const text = tree.read(modulePath);

        // if (text === null) {
        //     throw new SchematicsException(`The file ${modulePath} doesn't exists...`);
        // }

        // const source = ts.createSourceFile(
        //     modulePath,
        //     text.toString(),
        //     ts.ScriptTarget.Latest,
        //     true
        // ) as any;

        // applyToUpdateRecorder(recorder,
        //     addImportToModule(source, modulePath, 'SuperUiLibModule', 'super-ui-lib')
        // );

        // tree.commitUpdate(recorder);

        // context.logger.info('Installing dependencies...');
        //context.addTask(new NodePackageInstallTask());
        context.addTask(new RunSchematicTask('dialog-boxes', {}));
        context.addTask(new RunSchematicTask('@angular/material', 'ng-add', {
            typography: true,
            animations: "true"
        }));
        // context.addTask(new NodePackageInstallTask({ packageName: '@angular/material' }));        
        // context.addTask(new NodePackageInstallTask({ packageName: '@angular/flex-layout' }));
        // context.addTask(new NodePackageInstallTask({ packageName: '@angular/cdk' }));


        // const rule = chain([
        //     generateRepo(name),
        //     merged
        // ]);

        // return rule(tree, _context) as Rule;

        return tree

    }
}