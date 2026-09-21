/**
 * Generated API Types from OpenAPI Spec
 *
 * This file re-exports generated types with backwards-compatible aliases.
 * The SDK can use either the generated types directly or through these aliases.
 *
 * To regenerate: task partner:sdk:gen-types
 */

// Re-export all generated types
export * from './api-types';

// ============================================================================
// BACKWARDS-COMPATIBLE TYPE ALIASES
// These aliases map the SDK's original type names to the generated types.
// This ensures existing code continues to work without changes.
// ============================================================================

// --- Meetings ---
import type {
  SharedPartnerMeetingResponse,
  MeetingPartnerCreateMeetingRequest,
  MeetingPartnerUpdateMeetingRequest,
  SharedListResponseSharedPartnerMeetingResponse,
} from './api-types';

/** @deprecated Use SharedPartnerMeetingResponse - kept for backwards compatibility */
export type Meeting = SharedPartnerMeetingResponse;
/** @deprecated Use MeetingPartnerCreateMeetingRequest - kept for backwards compatibility */
export type CreateMeetingRequest = MeetingPartnerCreateMeetingRequest;
/** @deprecated Use MeetingPartnerUpdateMeetingRequest - kept for backwards compatibility */
export type UpdateMeetingRequest = MeetingPartnerUpdateMeetingRequest;
/** @deprecated Use SharedListResponseSharedPartnerMeetingResponse - kept for backwards compatibility */
export type MeetingListResponse = SharedListResponseSharedPartnerMeetingResponse;

// --- Action Items ---
import type {
  ActionItemPartnerActionItemResponse,
  ActionItemCreateActionItemRequest,
  ActionItemUpdateActionItemRequest,
  SharedListResponseActionItemPartnerActionItemResponse,
} from './api-types';

/** @deprecated Use ActionItemPartnerActionItemResponse - kept for backwards compatibility */
export type ActionItem = ActionItemPartnerActionItemResponse;
/** @deprecated Use ActionItemCreateActionItemRequest - kept for backwards compatibility */
export type CreateActionItemRequest = ActionItemCreateActionItemRequest;
/** @deprecated Use ActionItemUpdateActionItemRequest - kept for backwards compatibility */
export type UpdateActionItemRequest = ActionItemUpdateActionItemRequest;
/** @deprecated Use SharedListResponseActionItemPartnerActionItemResponse - kept for backwards compatibility */
export type ActionItemListResponse = SharedListResponseActionItemPartnerActionItemResponse;

// --- Automations ---
import type {
  AutomationAutomationResponse,
  AutomationCreateAutomationRequest,
  AutomationUpdateAutomationRequest,
  SharedListResponseAutomationAutomationResponse,
  PartnerAutomationAction,
} from './api-types';

/** @deprecated Use AutomationAutomationResponse - kept for backwards compatibility */
export type Automation = AutomationAutomationResponse;
/** @deprecated Use AutomationCreateAutomationRequest - kept for backwards compatibility */
export type CreateAutomationRequest = AutomationCreateAutomationRequest;
/** @deprecated Use AutomationUpdateAutomationRequest - kept for backwards compatibility */
export type UpdateAutomationRequest = AutomationUpdateAutomationRequest;
/** @deprecated Use SharedListResponseAutomationAutomationResponse - kept for backwards compatibility */
export type AutomationListResponse = SharedListResponseAutomationAutomationResponse;
/** @deprecated Use PartnerAutomationAction - kept for backwards compatibility */
export type AutomationAction = PartnerAutomationAction;

// --- Partner App ---
import type {
  SharedPartnerAppResponse,
  AppManagementUpdateAppRequest,
  AppManagementUpdateAppStatusRequest,
} from './api-types';

/** @deprecated Use SharedPartnerAppResponse - kept for backwards compatibility */
export type PartnerApp = SharedPartnerAppResponse;
/** @deprecated Use AppManagementUpdateAppRequest - kept for backwards compatibility */
export type UpdatePartnerAppRequest = AppManagementUpdateAppRequest;
/** @deprecated Use AppManagementUpdateAppStatusRequest - kept for backwards compatibility */
export type UpdatePartnerAppStatusRequest = AppManagementUpdateAppStatusRequest;

// --- User Connections ---
import type {
  ConnectionUserConnectionResponse,
  SharedListResponseConnectionUserConnectionResponse,
} from './api-types';

/** @deprecated Use ConnectionUserConnectionResponse - kept for backwards compatibility */
export type UserConnection = ConnectionUserConnectionResponse;
/** @deprecated Use SharedListResponseConnectionUserConnectionResponse - kept for backwards compatibility */
export type UserConnectionListResponse = SharedListResponseConnectionUserConnectionResponse;

// --- Credentials ---
import type {
  CredentialCredentialStatusResponse,
  CredentialCredentialRotationRequest,
  CredentialCredentialRotationResponse,
} from './api-types';

/** @deprecated Use CredentialCredentialStatusResponse - kept for backwards compatibility */
export type CredentialStatusInfo = CredentialCredentialStatusResponse;
/** @deprecated Use CredentialCredentialRotationRequest - kept for backwards compatibility */
export type CredentialRotationRequest = CredentialCredentialRotationRequest;
/** @deprecated Use CredentialCredentialRotationResponse - kept for backwards compatibility */
export type CredentialRotationResponse = CredentialCredentialRotationResponse;

// --- Webhook Deliveries ---
import type {
  WebhookWebhookDeliveryResponse,
  WebhookWebhookDeliveriesResponse,
} from './api-types';

/** @deprecated Use WebhookWebhookDeliveryResponse - kept for backwards compatibility */
export type WebhookDelivery = WebhookWebhookDeliveryResponse;
/** @deprecated Use WebhookWebhookDeliveriesResponse - kept for backwards compatibility */
export type WebhookDeliveryListResponse = WebhookWebhookDeliveriesResponse;

// --- User Profile ---
import type { ProfileUserProfileResponse } from './api-types';

/** @deprecated Use ProfileUserProfileResponse - kept for backwards compatibility */
export type UserProfile = ProfileUserProfileResponse;

// --- Errors ---
import type { ErrorsPartnerErrorResponse } from './api-types';

/** @deprecated Use ErrorsPartnerErrorResponse - kept for backwards compatibility */
export type ErrorResponse = ErrorsPartnerErrorResponse;

// ============================================================================
// DEPRECATED GENERATED-NAME ALIASES (CON-7379)
// Partner API v1.12.0 (rome CON-7378) fixed Go package-path leaks in the
// OpenAPI definition keys, so the generated names below lost their
// `RomeApiControllersExternalPartner…` prefix. Aliases keep existing
// consumers compiling; they will be removed in the next major release.
// ============================================================================

import type {
  OauthDiscoveryDocument,
  OauthJWK,
  OauthJWKSResponse,
  OauthTokenIntrospection,
  OauthTokenResponse,
  OauthUserInfo,
  SharedListResponseBacklogItemPartnerBacklogItemResponse,
  SharedListResponseCalendarPartnerCalendarEventResponse,
  SharedListResponseMeetingPartnerAgendaItemResponse,
  SharedListResponseMeetingPartnerMeetingParticipantResponse,
  SharedListResponseMeetingTemplatePartnerMeetingTemplateResponse,
  SharedListResponseMeetingTemplateTemplateNextStepResponse,
  SharedListResponseSessionPartnerChatSessionResponse,
  SharedListResponseSharedActionButtonResponse,
  SharedListResponseSharedNextStepResponse,
  SharedListResponseTemplateTemplateNextStepResponse,
  SharedListResponseTemplateTemplateResponse,
  SharedListResponseToolkitPartnerToolkitResponse,
  SharedListResponseToolkitToolkitResponse,
  SharedListResponseToolkitToolkitWithInstallationResponse,
  SharedListResponseWorkflowPartnerWorkflowTemplateSummary,
  SharedListResponseWorkflowRunPartnerWorkflowRunResponse,
  ToolkitPartnerToolkitResponse,
  ToolkitToolkitResponse,
} from './api-types';

/** @deprecated Use OauthTokenResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerOauthTokenResponse = OauthTokenResponse;
/** @deprecated Use OauthTokenIntrospection - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerOauthTokenIntrospection = OauthTokenIntrospection;
/** @deprecated Use OauthJWK - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerOauthJWK = OauthJWK;
/** @deprecated Use OauthJWKSResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerOauthJWKSResponse = OauthJWKSResponse;
/** @deprecated Use OauthDiscoveryDocument - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerOauthDiscoveryDocument = OauthDiscoveryDocument;
/** @deprecated Use OauthUserInfo - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerOauthUserInfo = OauthUserInfo;
/** @deprecated Use ToolkitToolkitResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerAdminToolkitToolkitResponse = ToolkitToolkitResponse;
/** @deprecated Use ToolkitPartnerToolkitResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserToolkitToolkitResponse = ToolkitPartnerToolkitResponse;
/** @deprecated Use SharedListResponseAutomationAutomationResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerAdminSharedListResponseAutomationAutomationResponse = SharedListResponseAutomationAutomationResponse;
/** @deprecated Use SharedListResponseConnectionUserConnectionResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerAdminSharedListResponseConnectionUserConnectionResponse = SharedListResponseConnectionUserConnectionResponse;
/** @deprecated Use SharedListResponseTemplateTemplateNextStepResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerAdminSharedListResponseTemplateTemplateNextStepResponse = SharedListResponseTemplateTemplateNextStepResponse;
/** @deprecated Use SharedListResponseTemplateTemplateResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerAdminSharedListResponseTemplateTemplateResponse = SharedListResponseTemplateTemplateResponse;
/** @deprecated Use SharedListResponseWorkflowPartnerWorkflowTemplateSummary - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerAdminSharedListResponseWorkflowPartnerWorkflowTemplateSummary = SharedListResponseWorkflowPartnerWorkflowTemplateSummary;
/** @deprecated Use SharedListResponseActionItemPartnerActionItemResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseActionItemPartnerActionItemResponse = SharedListResponseActionItemPartnerActionItemResponse;
/** @deprecated Use SharedListResponseBacklogItemPartnerBacklogItemResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseBacklogItemPartnerBacklogItemResponse = SharedListResponseBacklogItemPartnerBacklogItemResponse;
/** @deprecated Use SharedListResponseCalendarPartnerCalendarEventResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseCalendarPartnerCalendarEventResponse = SharedListResponseCalendarPartnerCalendarEventResponse;
/** @deprecated Use SharedListResponseMeetingPartnerAgendaItemResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseMeetingPartnerAgendaItemResponse = SharedListResponseMeetingPartnerAgendaItemResponse;
/** @deprecated Use SharedListResponseMeetingPartnerMeetingParticipantResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseMeetingPartnerMeetingParticipantResponse = SharedListResponseMeetingPartnerMeetingParticipantResponse;
/** @deprecated Use SharedListResponseMeetingTemplatePartnerMeetingTemplateResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseMeetingTemplatePartnerMeetingTemplateResponse = SharedListResponseMeetingTemplatePartnerMeetingTemplateResponse;
/** @deprecated Use SharedListResponseMeetingTemplateTemplateNextStepResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseMeetingTemplateTemplateNextStepResponse = SharedListResponseMeetingTemplateTemplateNextStepResponse;
/** @deprecated Use SharedListResponseSessionPartnerChatSessionResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseSessionPartnerChatSessionResponse = SharedListResponseSessionPartnerChatSessionResponse;
/** @deprecated Use SharedListResponseSharedActionButtonResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseSharedActionButtonResponse = SharedListResponseSharedActionButtonResponse;
/** @deprecated Use SharedListResponseSharedNextStepResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseSharedNextStepResponse = SharedListResponseSharedNextStepResponse;
/** @deprecated Use SharedListResponseSharedPartnerMeetingResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseSharedPartnerMeetingResponse = SharedListResponseSharedPartnerMeetingResponse;
/** @deprecated Use SharedListResponseToolkitToolkitWithInstallationResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseToolkitToolkitWithInstallationResponse = SharedListResponseToolkitToolkitWithInstallationResponse;
/** @deprecated Use SharedListResponseWorkflowRunPartnerWorkflowRunResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseWorkflowRunPartnerWorkflowRunResponse = SharedListResponseWorkflowRunPartnerWorkflowRunResponse;
/** @deprecated Use SharedListResponseToolkitToolkitResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseRomeApiControllersExternalPartnerAdminToolkitToolkitResponse = SharedListResponseToolkitToolkitResponse;
/** @deprecated Use SharedListResponseToolkitPartnerToolkitResponse - kept for backwards compatibility */
export type RomeApiControllersExternalPartnerUserSharedListResponseRomeApiControllersExternalPartnerUserToolkitToolkitResponse = SharedListResponseToolkitPartnerToolkitResponse;
