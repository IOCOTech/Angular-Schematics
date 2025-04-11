#!/bin/bash
cd usr/share/nginx/html

# Replace environment variables in config.json
# Root properties
if [[ -n "$apiBaseURL" ]]; then
  contents="$(jq --arg apiBaseURL "$apiBaseURL" '.apiBaseURL = $apiBaseURL' config.json)" && echo "$contents" > config.json
fi

if [[ -n "$appendTokenUri" ]]; then
  contents="$(jq --arg appendTokenUri "$appendTokenUri" '.appendTokenUri = $appendTokenUri' config.json)" && echo "$contents" > config.json
fi

if [[ -n "$appInsightsKey" ]]; then
  contents="$(jq --arg appInsightsKey "$appInsightsKey" '.appInsightsKey = $appInsightsKey' config.json)" && echo "$contents" > config.json
fi

if [[ -n "$environment" ]]; then
  contents="$(jq --arg environment "$environment" '.environment = $environment' config.json)" && echo "$contents" > config.json
fi

# Authentication properties
if [[ -n "$authentication__authority" ]]; then
  contents="$(jq --arg authenticationAuthority "$authentication__authority" '.authentication["authority"] = $authenticationAuthority' config.json)" && echo "$contents" > config.json
fi

if [[ -n "$authentication__clientId" ]]; then
  contents="$(jq --arg authenticationClientId "$authentication__clientId" '.authentication["clientId"] = $authenticationClientId' config.json)" && echo "$contents" > config.json
fi

if [[ -n "$authentication__postLogoutRedirectUri" ]]; then
  contents="$(jq --arg authenticationPostLogoutRedirectUri "$authentication__postLogoutRedirectUri" '.authentication["postLogoutRedirectUri"] = $authenticationPostLogoutRedirectUri' config.json)" && echo "$contents" > config.json
fi

if [[ -n "$authentication__redirectUri" ]]; then
  contents="$(jq --arg authenticationRedirectUri "$authentication__redirectUri" '.authentication["redirectUri"] = $authenticationRedirectUri' config.json)" && echo "$contents" > config.json
fi

# Logging
if [[ -n "$logging__loggingLevel" ]]; then
  contents="$(jq --arg loggingLoggingLevel "$logging__loggingLevel" '.logging["loggingLevel"] = $loggingLoggingLevel' config.json)" && echo "$contents" > config.json
fi

# Cast value to boolean from string for NavigateToLoginRequestUrl
if [[ -n "$authentication__navigateToLoginRequestUrl" ]]; then
  # Cast the value to a boolean for jq
  if [[ "$authentication__navigateToLoginRequestUrl" == "true" ]]; then
    booleanValue=true
  elif [[ "$authentication__navigateToLoginRequestUrl" == "false" ]]; then
    booleanValue=false
  else
    echo "Invalid value for authentication__navigateToLoginRequestUrl. Must be 'true' or 'false'."
    exit 1
  fi

  # Use jq to update the JSON file with a true boolean value
  contents="$(jq --argjson authenticationNavigateToLoginRequestUrl "$booleanValue" '.authentication["navigateToLoginRequestUrl"] = $authenticationNavigateToLoginRequestUrl' config.json)" && echo "$contents" > config.json
fi

# Cast value to boolean from string for ValidateAuthority
if [[ -n "$authentication__validateAuthority" ]]; then
  # Cast the value to a boolean for jq
  if [[ "$authentication__validateAuthority" == "true" ]]; then
    booleanValue=true
  elif [[ "$authentication__validateAuthority" == "false" ]]; then
    booleanValue=false
  else
    echo "Invalid value for authentication__validateAuthority. Must be 'true' or 'false'."
    exit 1
  fi

  # Use jq to update the JSON file with a true boolean value
  contents="$(jq --argjson authenticationValidateAuthority "$booleanValue" '.authentication["validateAuthority"] = $authenticationValidateAuthority' config.json)" && echo "$contents" > config.json
fi

## Cast value to boolean from string for DisplayConsoleErrorsOnScreen
if [[ -n "$displayConsoleErrorsOnScreen" ]]; then
  # Cast the value to a boolean for jq
  if [[ "$displayConsoleErrorsOnScreen" == "true" ]]; then
    booleanValue=true
  elif [[ "$displayConsoleErrorsOnScreen" == "false" ]]; then
    booleanValue=false
  else
    echo "Invalid value for displayConsoleErrorsOnScreen. Must be 'true' or 'false'."
    exit 1
  fi

  # Use jq to update the JSON file with a true boolean value
  contents="$(jq --argjson displayConsoleErrorsOnScreen "$booleanValue" '.displayConsoleErrorsOnScreen = $displayConsoleErrorsOnScreen' config.json)" && echo "$contents" > config.json
fi
## Add known authorities to the config.json file
# Initialize an empty array for knownAuthorities
knownAuthorities="[]"
i=0
while [[ -n $(printenv "authentication__knownAuthorities__${i}") ]]; do
  authority=$(printenv "authentication__knownAuthorities__${i}")
  knownAuthorities=$(jq --arg authority "$authority" '. + [$authority]' <<< "$knownAuthorities")
  i=$((i + 1))
done
if [[ "$knownAuthorities" != "[]" ]]; then
  contents=$(jq --argjson knownAuthorities "$knownAuthorities" '.authentication["knownAuthorities"] = $knownAuthorities' config.json)
  echo "$contents" > config.json
fi

## Add protected resources to the config.json file
protectedResources="[]"
i=0
while [[ -n $(printenv "authentication__protectedResources__${i}__url") ]]; do
  url=$(printenv "authentication__protectedResources__${i}__url")
  scopes="[]"
  j=0
  while [[ -n $(printenv "authentication__protectedResources__${i}__scope__${j}") ]]; do
    scope=$(printenv "authentication__protectedResources__${i}__scope__${j}")
    scopes=$(jq --arg scope "$scope" '. + [$scope]' <<< "$scopes")
    j=$((j + 1))
  done
  newResource=$(jq -n --arg url "$url" --argjson scopes "$scopes" '{"url": $url, "scope": $scopes}')
  protectedResources=$(jq --argjson newResource "$newResource" '. + [$newResource]' <<< "$protectedResources")
  i=$((i + 1))
done
if [[ "$protectedResources" != "[]" ]]; then
  contents=$(jq --argjson protectedResources "$protectedResources" '.authentication["protectedResources"] = $protectedResources' config.json)
  echo "$contents" > config.json
fi

## Add error log destinations to the config.json file
errorLogTo="[]"
i=0
while [[ -n $(printenv "logging__errorLogTo__${i}") ]]; do
  logDestination=$(printenv "logging__errorLogTo__${i}")
  errorLogTo=$(jq --arg logDestination "$logDestination" '. + [$logDestination]' <<< "$errorLogTo")
  i=$((i + 1))
done
if [[ "$errorLogTo" != "[]" ]]; then
  contents=$(jq --argjson errorLogTo "$errorLogTo" '.logging["errorLogTo"] = $errorLogTo' config.json)
  echo "$contents" > config.json
fi

# Start Nginx
nginx -g 'daemon off;'
