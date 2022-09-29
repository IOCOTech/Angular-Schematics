import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, externalSchematic, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const loadingScreenName = 'loading-screen'
const loadingScreenPath = 'components'

const notFoundName = 'not-found'
const notFoundPath = 'components'

const notificationSnackbarName = 'notification-snackbar'
const notificationSnackbarPath = 'components'

const oidRedirectName = 'notification-snackbar'
const oidRedirectPath = 'components'

export function addComponents(): Rule {
    return () => {

        console.log("Adding components")
        const loadingScreenRule = generateLoadingScreenRule();
        const notFoundRule = generateNotFoundRule();
        const notificationSnackbarRule = generateNotificationSnackbarRule();
        const oidRedirectRule = generateOIDRedirectRule();
        
        return chain([
            externalSchematic('@schematics/angular', 'component', { name: `${loadingScreenPath}/${loadingScreenName}` }),
            externalSchematic('@schematics/angular', 'component', { name: `${notFoundPath}/${loadingScreenName}` }),
            externalSchematic('@schematics/angular', 'component', { name: `${notificationSnackbarPath}/${notificationSnackbarName}` }),
            externalSchematic('@schematics/angular', 'component', { name: `${oidRedirectPath}/${oidRedirectName}` }),
            mergeWith(loadingScreenRule, MergeStrategy.Overwrite),
            mergeWith(notFoundRule, MergeStrategy.Overwrite),
            mergeWith(notificationSnackbarRule, MergeStrategy.Overwrite),
            mergeWith(oidRedirectRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateLoadingScreenRule(): Source {
    return apply(
        url('./loading-screen'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
                name: loadingScreenName
            }),
            move(normalize(`src/app/${loadingScreenPath}/${strings.dasherize(loadingScreenName)}`)),
        ]
    )
}

function generateNotFoundRule(): Source {
    return apply(
        url('./not-found'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
                name: notFoundName
            }),
            move(normalize(`src/app/${notFoundPath}/${strings.dasherize(notFoundName)}`)),
        ]
    )
}

function generateNotificationSnackbarRule(): Source {
    return apply(
        url('./notification-snackbar'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
                name: notFoundName
            }),
            move(normalize(`src/app/${notificationSnackbarPath}/${strings.dasherize(notificationSnackbarName)}`)),
        ]
    )
}

function generateOIDRedirectRule(): Source {
    return apply(
        url('./oid-redirect'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
                name: notFoundName
            }),
            move(normalize(`src/app/${oidRedirectPath}/${strings.dasherize(oidRedirectName)}`)),
        ]
    )
}