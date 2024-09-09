// Auto generated content, please customize files under provision folder

@secure()
param provisionParameters object
param provisionOutputs object
@secure()
param currentAppSettings object

var webAppName = split(provisionOutputs.azureWebAppBotOutput.value.resourceId, '/')[8]
var sqlServer = provisionParameters['sqlServer']
var sqlport = provisionParameters['sqlport']
var sqldb = provisionParameters['sqldb']

resource webAppSettings 'Microsoft.Web/sites/config@2021-02-01' = {
  name: '${webAppName}/appsettings'
  properties: union({
    BOT_ID: provisionOutputs.identityOutput.value.identityClientId // ID of your bot
    BOT_TYPE:'UserAssignedMsi' // Bot type
    BOT_TENANT_ID: provisionOutputs.identityOutput.value.identityTenantId // Secret of your bot
    IDENTITY_ID: provisionOutputs.identityOutput.value.identityClientId // User assigned identity id, the identity is used to access other Azure resources
    AZURE_SQL_SERVER: sqlServer
    AZURE_SQL_PORT: sqlport
    AZURE_SQL_DATABASE: sqldb
    QUESTIONURL: ''
    EVENTNAME: 'DevDiv China All Hands'
  }, currentAppSettings)
}
