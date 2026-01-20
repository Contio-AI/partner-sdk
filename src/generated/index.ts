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
  UserPartnerMeetingResponse,
  UserCreateMeetingRequest,
  UserUpdateMeetingRequest,
  UserListResponseUserPartnerMeetingResponse,
} from './api-types';

/** @deprecated Use UserPartnerMeetingResponse - kept for backwards compatibility */
export type Meeting = UserPartnerMeetingResponse;
/** @deprecated Use UserCreateMeetingRequest - kept for backwards compatibility */
export type CreateMeetingRequest = UserCreateMeetingRequest;
/** @deprecated Use UserUpdateMeetingRequest - kept for backwards compatibility */
export type UpdateMeetingRequest = UserUpdateMeetingRequest;
/** @deprecated Use UserListResponseUserPartnerMeetingResponse - kept for backwards compatibility */
export type MeetingListResponse = UserListResponseUserPartnerMeetingResponse;

// --- Action Items ---
import type {
  UserPartnerActionItemResponse,
  UserCreateActionItemRequest,
  UserUpdateActionItemRequest,
  UserListResponseUserPartnerActionItemResponse,
} from './api-types';

/** @deprecated Use UserPartnerActionItemResponse - kept for backwards compatibility */
export type ActionItem = UserPartnerActionItemResponse;
/** @deprecated Use UserCreateActionItemRequest - kept for backwards compatibility */
export type CreateActionItemRequest = UserCreateActionItemRequest;
/** @deprecated Use UserUpdateActionItemRequest - kept for backwards compatibility */
export type UpdateActionItemRequest = UserUpdateActionItemRequest;
/** @deprecated Use UserListResponseUserPartnerActionItemResponse - kept for backwards compatibility */
export type ActionItemListResponse = UserListResponseUserPartnerActionItemResponse;

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
import type { UserUserProfileResponse } from './api-types';

/** @deprecated Use UserUserProfileResponse - kept for backwards compatibility */
export type UserProfile = UserUserProfileResponse;

// --- Errors ---
import type { ErrorsPartnerErrorResponse } from './api-types';

/** @deprecated Use ErrorsPartnerErrorResponse - kept for backwards compatibility */
export type ErrorResponse = ErrorsPartnerErrorResponse;
