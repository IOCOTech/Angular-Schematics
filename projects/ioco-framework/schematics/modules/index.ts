import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, externalSchematic, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const materialDesignPath = 'modules/material-design';
const msalPath = 'modules/microsoft-authentication-library';
const msalEnvironmentPath = 'msal'

export function addMaterialDesign(): Rule {
    return () => {

        console.log("Adding material design")
        const materialDesignRule = generateMaterialDesignRule();
        
        return chain([
            externalSchematic('@schematics/angular', 'module', { name: `${materialDesignPath}` }),
            mergeWith(materialDesignRule, MergeStrategy.Overwrite),
        ]);
    }
}

function generateMaterialDesignRule(): Source {
    return apply(
        url('./modules-root/material-design'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${materialDesignPath}`)),
        ]
    )
}

export function addMSAL(): Rule {
    return () => {

        console.log("Adding Microsoft Authentication Library")
        const MSALRule = generateMSALRule();
        const MSALEnvironmentRule = generateMsalEnvironmentRule();
        
        return chain([
            externalSchematic('@schematics/angular', 'module', { name: `${msalPath}` }),
            mergeWith(MSALRule, MergeStrategy.Overwrite),
            mergeWith(MSALEnvironmentRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateMSALRule(): Source {
    return apply(
        url('./modules-root/microsoft-authentication-library'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${msalPath}`)),
        ]
    )
}

function generateMsalEnvironmentRule(): Source {
    return apply(
        url('./modules-root/msal.environment'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/environments/${msalEnvironmentPath}`)),
        ]
    )
}
