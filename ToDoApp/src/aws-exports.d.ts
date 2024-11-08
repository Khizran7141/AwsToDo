declare const awsmobile: {
  aws_project_region: string
  aws_cognito_identity_pool_id?: string
  aws_cognito_region?: string
  aws_user_pools_id?: string
  aws_user_pools_web_client_id?: string
  oauth?: Record<string, unknown>
  aws_appsync_graphqlEndpoint?: string
  aws_appsync_region?: string
  aws_appsync_authenticationType?: string
  [key: string]: unknown // Catch-all for other Amplify settings
}

export default awsmobile
