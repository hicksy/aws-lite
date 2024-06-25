/**
 * Plugin maintained by: @architect
 */

import incomplete from './incomplete.mjs'
import lib from './lib.mjs'
const { serializeTags, normalizeObjectArrays } = lib

const service = 'iam'
const property = 'IAM'
const required = true
const docRoot = 'https://docs.aws.amazon.com/IAM/latest/APIReference/'
const userGuide = 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/'

const arr = { type: 'array' }
// const bool = { type: 'boolean' }
// const obj = { type: 'object' }
const num = { type: 'number' }
const str = { type: 'string' }

const AccessKeyId = { ...str, required, comment: 'ID of the access key' }
const Description = { ...str, comment: 'Description of the resource' }
const GroupName = { ...str, required, comment: 'Name of the group; names are not distinguished by case' }
const Marker = { ...str, comment: 'Pagination cursor' }
const MaxItems = { ...num, comment: 'Maximum number of items to be returned in a response; at most 1000' }
const MaxSessionDuration = { ...num, comment: 'Maximum session duration (in seconds) to set for the specified role' }
const Path = { ...str, comment: 'Path for the identifier', ref: userGuide + 'reference_identifiers.html' }
const PermissionsBoundary = { ...str, comment: `ARN of a managed policy to be used to set the resource's permissions boundary` }
const PolicyArn = { ...str, required, comment: 'Arn of the policy' }
const PolicyDocument = { type: [ 'string', 'object' ], required, comment: 'The policy document; can be an object, or JSON or YAML string' }
const PolicyName = { ...str, required, comment: 'Name of the policy' }
const RoleName = { ...str, required, comment: 'Name of the role' }
const Tags = { ...arr, comment: 'List of tags to attach to the resource', ref: userGuide + 'id_tags.html' }
const UserName = { ...str, required, comment: 'User name' }
const valPaginate = { type: 'boolean', comment: 'Enable automatic result pagination; use this instead of making your own individual pagination requests' }
const InstanceProfileName = { ...str, required, comment: 'Name of the instance profile' }

const paginator = { type: 'query', cursor: 'Marker' }

const emptyResponse = () => { return {} }
const defaultVersion = '2010-05-08'

const AddClientIDToOpenIDConnectProvider = {
  awsDoc: docRoot + 'API_AddClientIDToOpenIDConnectProvider.html',
  validate: {
    ClientID: { ...str, required, comment: 'The client ID (aka the audience) to add to the IAM OpenId Connect provider resource' },
    OpenIDConnectProviderArn: { ...str, required, comment: 'ARN of the OpenID Connect resource' },
  },
  request: params => {
    return {
      query: {
        Action: 'AddClientIDToOpenIDConnectProvider',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const AddRoleToInstanceProfile = {
  awsDoc: docRoot + 'API_AddRoleToInstanceProfile.html',
  validate: {
    InstanceProfileName,
    RoleName: { ...str, required, comment: 'Name of the role' },
  },
  request: params => {
    return {
      query: {
        Action: 'AddRoleToInstanceProfile',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const AddUserToGroup = {
  awsDoc: docRoot + 'API_AddUserToGroup.html',
  validate: {
    GroupName,
    UserName,
  },
  request: params => {
    return {
      query: {
        Action: 'AddUserToGroup',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const AttachGroupPolicy = {
  awsDoc: docRoot + 'API_AttachGroupPolicy.html',
  validate: {
    GroupName,
    PolicyArn,
  },
  request: params => {
    return {
      query: {
        Action: 'AttachGroupPolicy',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const AttachRolePolicy = {
  awsDoc: docRoot + 'API_AttachRolePolicy.html',
  validate: {
    PolicyArn,
    RoleName,
  },
  request: params => {
    return {
      query: {
        Action: 'AttachRolePolicy',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const AttachUserPolicy = {
  awsDoc: docRoot + 'API_AttachUserPolicy.html',
  validate: {
    PolicyArn,
    UserName,
  },
  request: params => {
    return {
      query: {
        Action: 'AttachUserPolicy',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const ChangePassword = {
  awsDoc: docRoot + 'API_ChangePassword.html',
  validate: {
    NewPassword: { ...str, required, comment: 'New password; must conform to the accounts password policy' },
    OldPassword: { ...str, required, comment: 'Current password' },
  },
  request: params => {
    return {
      query: {
        Action: 'ChangePassword',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const CreateAccessKey = {
  awsDoc: docRoot + 'API_CreateAccessKey.html',
  validate: {
    UserName,
  },
  request: params => {
    return {
      query: {
        Action: 'CreateAccessKey',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: ({ payload }) => payload.CreateAccessKeyResult,
}

const CreateAccountAlias = {
  awsDoc: docRoot + 'API_CreateAccountAlias.html',
  validate: {
    AccountAlias: { ...str, required, comment: 'Account alias to create' },
  },
  request: params => {
    return {
      query: {
        Action: 'CreateAccountAlias',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const CreateGroup = {
  awsDoc: docRoot + 'API_CreateGroup.html',
  validate: {
    GroupName,
    Path,
  },
  request: params => {
    const query = {
      Action: 'CreateGroup',
      Version: defaultVersion,
      ...params,
    }
    return { query }
  },
  response: ({ payload }) => { return payload.CreateGroupResult },
}

const CreateInstanceProfile = {
  awsDoc: docRoot + 'API_CreateInstanceProfile.html',
  validate: {
    InstanceProfileName,
    Path,
    Tags,
  },
  request: params => {
    let query = {
      Action: 'CreateInstanceProfile',
      Version: defaultVersion,
      ...params,
    }
    if (query.Tags) serializeTags(query)
    return {
      query,
    }
  },
  response: ({ payload }) => {
    let { CreateInstanceProfileResult } = payload
    let { InstanceProfile } = CreateInstanceProfileResult
    let { Tags, Roles } = InstanceProfile
    if (Tags) InstanceProfile.Tags = Array.isArray(Tags.member) ? Tags.member : [ Tags.member ]
    if (Roles && !Array.isArray(Roles)) {
      Roles = [ Roles ]
    }
    else {
      Roles = []
    }
    InstanceProfile.Roles = Roles.map(i => {
      const { Tags } = i
      if (Tags) i.Tags = Array.isArray(Tags.member) ? Tags.member : [ Tags.member ]
      return i
    })
    return CreateInstanceProfileResult
  },
}

const CreatePolicy = {
  awsDoc: docRoot + 'API_CreatePolicy.html',
  validate: {
    PolicyDocument,
    PolicyName,
    Description,
    Path,
    Tags,
  },
  request: params => {
    let query = {
      Action: 'CreatePolicy',
      Version: defaultVersion,
      ...params,
    }
    if (typeof query.PolicyDocument !== 'string') {
      query.PolicyDocument = JSON.stringify(query.PolicyDocument)
    }
    if (query.Tags) serializeTags(query)
    return {
      query,
    }
  },
  response: ({ payload }) => {
    let { CreatePolicyResult } = payload
    if (CreatePolicyResult.Policy.Tags) {
      const { member } = CreatePolicyResult.Policy.Tags
      CreatePolicyResult.Policy.Tags = Array.isArray(member) ? member : [ member ]
    }
    return CreatePolicyResult
  },
}

const CreateRole = {
  awsDoc: docRoot + 'API_CreateRole.html',
  validate: {
    AssumeRolePolicyDocument: { type: [ 'string', 'object' ], required, comment: 'Trust relationship policy document granting an entity permission to assume the role; can be an object, or JSON or YAML string' },
    RoleName,
    Description,
    MaxSessionDuration,
    Path: { ...str, comment: 'Path for the role identifier', ref: userGuide + 'reference_identifiers.html' },
    PermissionsBoundary: { ...str, comment: `ARN of a managed policy to be used to set the role's permissions boundary` },
    Tags: { ...arr, comment: 'List of tags to attach to the role', ref: userGuide + 'id_tags.html' },
  },
  request: params => {
    let query = {
      Action: 'CreateRole',
      Version: '2010-05-08',
      ...params,
    }
    if (typeof query.AssumeRolePolicyDocument !== 'string') {
      query.AssumeRolePolicyDocument = JSON.stringify(query.AssumeRolePolicyDocument)
    }
    return {
      query,
    }
  },
  response: ({ payload }) => payload.CreateRoleResult,
}

const CreateUser = {
  awsDoc: docRoot + 'API_CreateUser.html',
  validate: {
    UserName,
    Path,
    PermissionsBoundary,
    Tags,
  },
  request: params => {
    let query = {
      Action: 'CreateUser',
      Version: defaultVersion,
      ...params,
    }
    if (query.Tags) {
      query.Tags = query.Tags.forEach(({ Key, Value }, i) => {
        query[`Tags.member.${i + 1}.Key`] = Key
        query[`Tags.member.${i + 1}.Value`] = Value
      })
      delete query.Tags
    }
    return {
      query,
    }
  },
  response: ({ payload }) => {
    let { CreateUserResult } = payload
    const { Tags } = CreateUserResult.User
    if (Tags) {
      const { member } = Tags
      CreateUserResult.User.Tags = Array.isArray(member) ? member : [ member ]
    }
    return CreateUserResult
  },
}

const DeleteAccessKey = {
  awsDoc: docRoot + 'API_DeleteAccessKey.html',
  validate: {
    AccessKeyId,
    UserName: { ...UserName, required: false },
  },
  request: params => {
    const query = {
      Action: 'DeleteAccessKey',
      Version: defaultVersion,
      ...params,
    }
    return { query }
  },
  response: emptyResponse,
}

const DeleteAccountAlias = {
  awsDoc: docRoot + 'API_DeleteAccountAlias.html',
  validate: {
    AccountAlias: { ...str, required, comment: 'The account alias' },
  },
  request: params => {
    const query = {
      Action: 'DeleteAccountAlias',
      Version: defaultVersion,
      ...params,
    }
    return { query }
  },
  response: emptyResponse,

}

const DeleteGroup = {
  awsDoc: docRoot + 'API_DeleteGroup.html',
  validate: {
    GroupName,
  },
  request: params => {
    const query = {
      Action: 'DeleteGroup',
      Version: defaultVersion,
      ...params,
    }
    return { query }
  },
  response: emptyResponse,
}

const DeleteGroupPolicy = {
  awsDoc: docRoot + 'API_DeleteGroupPolicy.html',
  validate: {
    GroupName,
    PolicyName,
  },
  request: params => {
    return {
      query: {
        Action: 'DeleteGroupPolicy',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const DeleteInstanceProfile = {
  awsDoc: docRoot + 'API_DeleteInstanceProfile.html',
  validate: {
    InstanceProfileName,
  },
  request: params => {
    return {
      query: {
        Action: 'DeleteInstanceProfile',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const DeletePolicy = {
  awsDoc: docRoot + 'API_DeletePolicy.html',
  validate: {
    PolicyArn,
  },
  request: params => {
    return {
      query: {
        Action: 'DeletePolicy',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const DeleteRole = {
  awsDoc: docRoot + 'API_DeleteRole.html',
  validate: {
    RoleName,
  },
  request: params => {
    return {
      query: {
        Action: 'DeleteRole',
        Version: '2010-05-08',
        ...params,
      },
    }
  },
  response: () => ({}),
}

const DeleteUser = {
  awsDoc: docRoot + 'API_DeleteUser.html',
  validate: {
    UserName,
  },
  request: params => {
    return {
      query: {
        Action: 'DeleteUser',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const DetachGroupPolicy = {
  awsDoc: docRoot + 'API_DetachGroupPolicy.html',
  validate: {
    GroupName,
    PolicyArn,
  },
  request: params => {
    return {
      query: {
        Action: 'DetachGroupPolicy',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const GetAccessKeyLastUsed = {
  awsDoc: docRoot + 'API_GetAccessKeyLastUsed.html',
  validate: {
    AccessKeyId,
  },
  request: params => {
    return {
      query: {
        Action: 'GetAccessKeyLastUsed',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: ({ payload }) => payload.GetAccessKeyLastUsedResult,
}

// TODO: stop paginator from omitting `Group` field
// TODO: figure out why `User.Tags` is mentioned in documentation, but is not returned in response
const GetGroup = {
  awsDoc: docRoot + 'API_GetGroup.html',
  validate: {
    GroupName,
    Marker,
    MaxItems,
    paginate: valPaginate,
  },
  request: params => {
    let query = {
      Action: 'GetGroup',
      Version: defaultVersion,
      ...params,
    }
    const { paginate } = params
    if (paginate) delete query.paginate
    return {
      query,
      paginate,
      paginator: {
        ...paginator,
        token: 'GetGroupResult.Marker',
        accumulator: 'GetGroupResult.Users.member',
      },
    }
  },
  response: ({ payload }) => {
    let { GetGroupResult } = payload
    let { Group, Users } = GetGroupResult
    Users = Users.member || []
    if (!Array.isArray(Users)) Users = [ Users ]
    return {
      Group,
      Users,
    }
  },
}

// TODO: make sure response is not getting mangled
const GetGroupPolicy = {
  awsDoc: docRoot + 'API_GetGroupPolicy.html',
  validate: {
    GroupName,
    PolicyName,
  },
  request: params => {
    return {
      query: {
        Action: 'GetGroupPolicy',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: ({ payload }) => payload.GetGroupPolicyResult,
}

const GetInstanceProfile = {
  awsDoc: docRoot + 'API_GetInstanceProfile.html',
  validate: {
    InstanceProfileName,
  },
  request: params => {
    return {
      query: {
        Action: 'GetInstanceProfile',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: ({ payload }) => {
    const arrayKeys = new Set([ 'Roles', 'Tags' ])
    let { GetInstanceProfileResult } = payload
    normalizeObjectArrays(GetInstanceProfileResult, arrayKeys)
    return GetInstanceProfileResult
  },
}

const GetPolicy = {
  awsDoc: docRoot + 'API_GetPolicy.html',
  validate: {
    PolicyArn,
  },
  request: params => {
    return {
      query: {
        Action: 'GetPolicy',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: ({ payload }) => {
    let { GetPolicyResult } = payload
    const { Tags } = GetPolicyResult.Policy
    if (Tags) {
      const { member } = Tags
      GetPolicyResult.Policy.Tags = Array.isArray(member) ? member : [ member ]
    }
    return GetPolicyResult
  },
}

const GetRole = {
  awsDoc: docRoot + 'API_GetRole.html',
  validate: {
    RoleName,
  },
  request: params => {
    return {
      query: {
        Action: 'GetRole',
        Version: '2010-05-08',
        ...params,
      },
    }
  },
  response: ({ payload }) => payload.GetRoleResult,
}

const GetUser = {
  awsDoc: docRoot + 'API_GetUser.html',
  validate: {
    UserName,
  },
  request: params => {
    return {
      query: {
        Action: 'GetUser',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: ({ payload }) => {
    let { GetUserResult } = payload
    if (GetUserResult.User.Tags) {
      const { member } = GetUserResult.User.Tags
      GetUserResult.User.Tags = Array.isArray(member) ? member : [ member ]
    }
    return GetUserResult
  },
}

// error occurs in paginator when no access keys exist
const ListAccessKeys = {
  awsDoc: docRoot + 'API_ListAccessKeys.html',
  validate: {
    Marker,
    MaxItems,
    UserName: { ...UserName, required: false },
    paginate: valPaginate,

  },
  request: params => {
    let query = {
      Action: 'ListAccessKeys',
      Version: defaultVersion,
      ...params,
    }
    const { paginate } = params
    if (paginate) delete query.paginate
    return {
      query,
      paginate,
      paginator: {
        ...paginator,
        token: 'ListAccessKeysResult.Marker',
        accumulator: 'ListAccessKeysResult.AccessKeyMetadata.member',
      },
    }
  },
  response: ({ payload }) => {
    let { ListAccessKeysResult } = payload
    const { member } = ListAccessKeysResult.AccessKeyMetadata
    if (member) {
      ListAccessKeysResult.AccessKeyMetadata = Array.isArray(member) ? member : [ member ]
    }
    else {
      ListAccessKeysResult.AccessKeyMetadata = []
    }
    return ListAccessKeysResult
  },
}

const ListAccountAliases = {
  awsDoc: docRoot + 'API_ListAccountAliases.html',
  validate: {
    Marker,
    MaxItems,
    paginate: valPaginate,
  },
  request: params => {
    let query = {
      Action: 'ListAccountAliases',
      Version: defaultVersion,
      ...params,
    }
    const { paginate } = params
    if (paginate) delete query.paginate
    return {
      query,
      paginate,
      paginator: {
        ...paginator,
        token: 'ListAccountAliasesResult.Marker',
        accumulator: 'ListAccountAliasesResult.AccountAliases.member',
      },
    }
  },
  response: ({ payload }) => {
    let { ListAccountAliasesResult } = payload
    const { member } = ListAccountAliasesResult.AccountAliases
    if (member) {
      ListAccountAliasesResult.AccountAliases = Array.isArray(member) ? member : [ member ]
    }
    else {
      ListAccountAliasesResult.AccountAliases = []
    }
    return ListAccountAliasesResult
  },
}

const ListInstanceProfiles = {
  awsDoc: docRoot + 'API_ListInstanceProfiles.html',
  validate: {
    Marker,
    MaxItems,
    PathPrefix: { ...str, comment: 'Filter results by path prefix' },
    paginate: valPaginate,
  },
  request: params => {
    let query = {
      Action: 'ListInstanceProfiles',
      Version: defaultVersion,
      ...params,
    }
    const { paginate } = params
    if (paginate) delete query.paginate
    return {
      query,
      paginate,
      paginator: {
        ...paginator,
        token: 'ListInstanceProfilesResult.Marker',
        accumulator: 'ListInstanceProfilesResult.InstanceProfiles.member',
      },
    }
  },
  response: ({ payload }) => {
    const arrayKeys = new Set([ 'Tags', 'InstanceProfiles', 'Roles' ])
    let { ListInstanceProfilesResult } = payload
    normalizeObjectArrays(ListInstanceProfilesResult, arrayKeys)
    return ListInstanceProfilesResult
  },
}

const ListInstanceProfilesForRole = {
  awsDoc: docRoot + 'API_ListInstanceProfilesForRole.html',
  validate: {
    RoleName,
    Marker,
    MaxItems,
    paginate: valPaginate,
  },
  request: params => {
    let query = {
      Action: 'ListInstanceProfilesForRole',
      Version: defaultVersion,
      ...params,
    }
    const { paginate } = params
    if (paginate) delete query.paginate
    return {
      query,
      paginate,
      paginator: {
        ...paginator,
        token: 'ListInstanceProfilesForRoleResult.Marker',
        accumulator: 'ListInstanceProfilesForRoleResult.InstanceProfiles.member',
      },
    }
  },
  response: ({ payload }) => {
    const arrayKeys = new Set([ 'Tags', 'InstanceProfiles', 'Roles' ])
    let { ListInstanceProfilesForRoleResult } = payload
    normalizeObjectArrays(ListInstanceProfilesForRoleResult, arrayKeys)
    return ListInstanceProfilesForRoleResult
  },
}

const PutGroupPolicy = {
  awsDoc: docRoot + 'API_PutGroupPolicy.html',
  validate: {
    GroupName,
    PolicyDocument,
    PolicyName,
  },
  request: params => {
    let query = {
      Action: 'PutGroupPolicy',
      Version: defaultVersion,
      ...params,
    }
    if (typeof query.PolicyDocument !== 'string') {
      query.PolicyDocument = JSON.stringify(query.PolicyDocument)
    }
    return {
      query,
    }
  },
  response: emptyResponse,
}

const RemoveRoleFromInstanceProfile = {
  awsDoc: docRoot + 'API_RemoveRoleFromInstanceProfile.html',
  validate: {
    InstanceProfileName,
    RoleName,
  },
  request: params => {
    return {
      query: {
        Action: 'RemoveRoleFromInstanceProfile',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const RemoveUserFromGroup = {
  awsDoc: docRoot + 'API_RemoveUserFromGroup.html',
  validate: {
    GroupName,
    UserName,
  },
  request: params => {
    return {
      query: {
        Action: 'RemoveUserFromGroup',
        Version: defaultVersion,
        ...params,
      },
    }
  },
  response: emptyResponse,
}

const TagInstanceProfile = {
  awsDoc: docRoot + 'API_TagInstanceProfile.html',
  validate: {
    InstanceProfileName,
    Tags: { ...Tags, required },
  },
  request: params => {
    const query = {
      Action: 'TagInstanceProfile',
      Version: defaultVersion,
      ...params,
    }
    if (query.Tags) serializeTags(query)
    return { query }
  },
  response: emptyResponse,
}

const UntagInstanceProfile = {
  awsDoc: docRoot + 'API_UntagInstanceProfile.html',
  validate: {
    InstanceProfileName,
    TagKeys: { ...arr, required, comment: 'Array of tag keys' },
  },
  request: params => {
    const { InstanceProfileName, TagKeys } = params
    let query = {
      Action: 'UntagInstanceProfile',
      Version: defaultVersion,
      InstanceProfileName,
    }
    TagKeys.forEach((value, i) => {
      query[`TagKeys.member.${i + 1}`] = value
    })
    return { query }
  },
  response: emptyResponse,
}

const UpdateAccessKey = {
  awsDoc: docRoot + 'API_UpdateAccessKey.html',
  validate: {
    AccessKeyId,
    Status: { ...str, required, comment: 'New status for the access key; can be one of: `Active`, `Inactive`' },
    UserName: { ...UserName, required: false },
  },
  request: params => {
    const query = {
      Action: 'UpdateAccessKey',
      Version: defaultVersion,
      ...params,
    }
    return { query }
  },
  response: emptyResponse,
}

const UpdateRole = {
  awsDoc: docRoot + 'API_UpdateRole.html',
  validate: {
    RoleName,
    Description,
    MaxSessionDuration,
  },
  request: params => {
    return {
      query: {
        Action: 'UpdateRole',
        Version: '2010-05-08',
        ...params,
      },
    }
  },
  response: () => ({}),
}

export default {
  name: '@aws-lite/iam',
  service,
  property,
  methods: {
    AddClientIDToOpenIDConnectProvider,
    AddRoleToInstanceProfile,
    AddUserToGroup,
    AttachGroupPolicy,
    AttachRolePolicy,
    AttachUserPolicy,
    ChangePassword,
    CreateAccessKey,
    CreateAccountAlias,
    CreateGroup,
    CreateInstanceProfile,
    CreatePolicy,
    CreateRole,
    CreateUser,
    DeleteAccessKey,
    DeleteAccountAlias,
    DeleteGroup,
    DeleteGroupPolicy,
    DeleteInstanceProfile,
    DeletePolicy,
    DeleteRole,
    DeleteUser,
    DetachGroupPolicy,
    GetAccessKeyLastUsed,
    GetGroup,
    GetGroupPolicy,
    GetInstanceProfile,
    GetPolicy,
    GetRole,
    GetUser,
    ListAccessKeys,
    ListAccountAliases,
    ListInstanceProfiles,
    ListInstanceProfilesForRole,
    PutGroupPolicy,
    RemoveUserFromGroup,
    RemoveRoleFromInstanceProfile,
    TagInstanceProfile,
    UntagInstanceProfile,
    UpdateAccessKey,
    UpdateRole,
    ...incomplete,
  },
}
