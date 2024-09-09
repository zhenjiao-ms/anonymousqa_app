@secure()
param provisionParameters object

module provision './provision.bicep' = {
  name: 'provisionResources'
  params: {
    provisionParameters: provisionParameters
  }
}
output provisionOutput object = provision
module config './config.bicep' = {
  name: 'configureResources'
  params: {
    provisionParameters: provisionParameters
    provisionOutputs: provision.outputs
  }
}
output BOT_ID string = provision.outputs.identityOutput.identityClientId
output BOT_TYPE string ='UserAssignedMsi'
output BOT_TENANT_ID string = provision.outputs.identityOutput.identityTenantId
output configOutput object = contains(reference(resourceId('Microsoft.Resources/deployments', config.name), '2020-06-01'), 'outputs') ? config : {}
