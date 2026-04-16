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
  RomeApiControllersExternalPartnerUserSharedListResponseSharedPartnerMeetingResponse,
} from './api-types';

/** @deprecated Use SharedPartnerMeetingResponse - kept for backwards compatibility */
export type Meeting = SharedPartnerMeetingResponse;
/** @deprecated Use MeetingPartnerCreateMeetingRequest - kept for backwards compatibility */
export type CreateMeetingRequest = MeetingPartnerCreateMeetingRequest;
/** @deprecated Use MeetingPartnerUpdateMeetingRequest - kept for backwards compatibility */
export type UpdateMeetingRequest = MeetingPartnerUpdateMeetingRequest;
/** @deprecated Use RomeApiControllersExternalPartnerUserSharedListResponseSharedPartnerMeetingResponse - kept for backwards compatibility */
export type MeetingListResponse = RomeApiControllersExternalPartnerUserSharedListResponseSharedPartnerMeetingResponse;

// --- Action Items ---
import type {
  ActionItemPartnerActionItemResponse,
  ActionItemCreateActionItemRequest,
  ActionItemUpdateActionItemRequest,
  RomeApiControllersExternalPartnerUserSharedListResponseActionItemPartnerActionItemResponse,
} from './api-types';

/** @deprecated Use ActionItemPartnerActionItemResponse - kept for backwards compatibility */
export type ActionItem = ActionItemPartnerActionItemResponse;
/** @deprecated Use ActionItemCreateActionItemRequest - kept for backwards compatibility */
export type CreateActionItemRequest = ActionItemCreateActionItemRequest;
/** @deprecated Use ActionItemUpdateActionItemRequest - kept for backwards compatibility */
export type UpdateActionItemRequest = ActionItemUpdateActionItemRequest;
/** @deprecated Use RomeApiControllersExternalPartnerUserSharedListResponseActionItemPartnerActionItemResponse - kept for backwards compatibility */
export type ActionItemListResponse = RomeApiControllersExternalPartnerUserSharedListResponseActionItemPartnerActionItemResponse;

// --- Automations ---
import type {
  AutomationAutomationResponse,
  AutomationCreateAutomationRequest,
  AutomationUpdateAutomationRequest,
  RomeApiControllersExternalPartnerAdminSharedListResponseAutomationAutomationResponse,
  PartnerAutomationAction,
} from './api-types';

/** @deprecated Use AutomationAutomationResponse - kept for backwards compatibility */
export type Automation = AutomationAutomationResponse;
/** @deprecated Use AutomationCreateAutomationRequest - kept for backwards compatibility */
export type CreateAutomationRequest = AutomationCreateAutomationRequest;
/** @deprecated Use AutomationUpdateAutomationRequest - kept for backwards compatibility */
export type UpdateAutomationRequest = AutomationUpdateAutomationRequest;
/** @deprecated Use RomeApiControllersExternalPartnerAdminSharedListResponseAutomationAutomationResponse - kept for backwards compatibility */
export type AutomationListResponse = RomeApiControllersExternalPartnerAdminSharedListResponseAutomationAutomationResponse;
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
  RomeApiControllersExternalPartnerAdminSharedListResponseConnectionUserConnectionResponse,
} from './api-types';

/** @deprecated Use ConnectionUserConnectionResponse - kept for backwards compatibility */
export type UserConnection = ConnectionUserConnectionResponse;
/** @deprecated Use RomeApiControllersExternalPartnerAdminSharedListResponseConnectionUserConnectionResponse - kept for backwards compatibility */
export type UserConnectionListResponse = RomeApiControllersExternalPartnerAdminSharedListResponseConnectionUserConnectionResponse;

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
