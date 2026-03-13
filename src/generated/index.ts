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

// --- Workflows ---
import type {
  AdminWorkflowResponse,
  AdminCreateWorkflowRequest,
  AdminUpdateWorkflowRequest,
  AdminListResponseAdminWorkflowResponse,
  PartnerWorkflowAction,
} from './api-types';

/** @deprecated Use AdminWorkflowResponse - kept for backwards compatibility */
export type Workflow = AdminWorkflowResponse;
/** @deprecated Use AdminCreateWorkflowRequest - kept for backwards compatibility */
export type CreateWorkflowRequest = AdminCreateWorkflowRequest;
/** @deprecated Use AdminUpdateWorkflowRequest - kept for backwards compatibility */
export type UpdateWorkflowRequest = AdminUpdateWorkflowRequest;
/** @deprecated Use AdminListResponseAdminWorkflowResponse - kept for backwards compatibility */
export type WorkflowListResponse = AdminListResponseAdminWorkflowResponse;
/** @deprecated Use PartnerWorkflowAction - kept for backwards compatibility */
export type WorkflowAction = PartnerWorkflowAction;

// --- Partner App ---
import type {
  AdminPartnerAppResponse,
  AdminUpdateAppRequest,
  AdminUpdateAppStatusRequest,
} from './api-types';

/** @deprecated Use AdminPartnerAppResponse - kept for backwards compatibility */
export type PartnerApp = AdminPartnerAppResponse;
/** @deprecated Use AdminUpdateAppRequest - kept for backwards compatibility */
export type UpdatePartnerAppRequest = AdminUpdateAppRequest;
/** @deprecated Use AdminUpdateAppStatusRequest - kept for backwards compatibility */
export type UpdatePartnerAppStatusRequest = AdminUpdateAppStatusRequest;

// --- User Connections ---
import type {
  AdminUserConnectionResponse,
  AdminListResponseAdminUserConnectionResponse,
} from './api-types';

/** @deprecated Use AdminUserConnectionResponse - kept for backwards compatibility */
export type UserConnection = AdminUserConnectionResponse;
/** @deprecated Use AdminListResponseAdminUserConnectionResponse - kept for backwards compatibility */
export type UserConnectionListResponse = AdminListResponseAdminUserConnectionResponse;

// --- Credentials ---
import type {
  AdminCredentialStatusResponse,
  AdminCredentialRotationRequest,
  AdminCredentialRotationResponse,
} from './api-types';

/** @deprecated Use AdminCredentialStatusResponse - kept for backwards compatibility */
export type CredentialStatusInfo = AdminCredentialStatusResponse;
/** @deprecated Use AdminCredentialRotationRequest - kept for backwards compatibility */
export type CredentialRotationRequest = AdminCredentialRotationRequest;
/** @deprecated Use AdminCredentialRotationResponse - kept for backwards compatibility */
export type CredentialRotationResponse = AdminCredentialRotationResponse;

// --- Webhook Deliveries ---
import type {
  AdminWebhookDeliveryResponse,
  AdminWebhookDeliveriesResponse,
} from './api-types';

/** @deprecated Use AdminWebhookDeliveryResponse - kept for backwards compatibility */
export type WebhookDelivery = AdminWebhookDeliveryResponse;
/** @deprecated Use AdminWebhookDeliveriesResponse - kept for backwards compatibility */
export type WebhookDeliveryListResponse = AdminWebhookDeliveriesResponse;

// --- User Profile ---
import type { ProfileUserProfileResponse } from './api-types';

/** @deprecated Use ProfileUserProfileResponse - kept for backwards compatibility */
export type UserProfile = ProfileUserProfileResponse;

// --- Errors ---
import type { ErrorsPartnerErrorResponse } from './api-types';

/** @deprecated Use ErrorsPartnerErrorResponse - kept for backwards compatibility */
export type ErrorResponse = ErrorsPartnerErrorResponse;
