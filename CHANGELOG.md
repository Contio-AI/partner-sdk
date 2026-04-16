# Changelog

All notable changes to the Contio Partner SDK will be documented in this file.
Versions prior to v1.3.0 were maintained in a private repository (history unavilable).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-04-16

### Added

- **Toolkit export (portable manifests)** — two new methods on `PartnerAdminClient` ([CON-3359](https://linear.app/contio/issue/CON-3359)):
  - `exportEntities(data)` — assembly-mode export; builds a portable manifest from selected entity IDs (templates, next steps, action buttons, shortcuts). Dependencies are auto-discovered.
  - `exportToolkit(toolkitId)` — toolkit-mode export; resolves an existing toolkit into a portable manifest with `$id`/`$ref` identifiers suitable for re-import.
- **New model types**: `ExportEntitiesRequest`, `ExportResponse`, `ExportMetadata`, `ExportSummary`, `ExportWarning`

### Removed

- **Standalone Next Step admin CRUD** — Next steps are now managed exclusively through the Toolkit manifest lifecycle. The following `PartnerAdminClient` methods have been removed:
  - `createNextStep()`, `getNextSteps()`, `getNextStep()`, `updateNextStep()`, `deleteNextStep()`
- **Standalone Action Button admin CRUD** — Action buttons are now managed exclusively through the Toolkit manifest lifecycle. The following `PartnerAdminClient` methods have been removed:
  - `createActionButton()`, `getActionButtons()`, `getActionButton()`, `updateActionButton()`, `deleteActionButton()`
- **Next Step ↔ Action Button association endpoints** — associations are now defined in the Toolkit manifest. The following `PartnerAdminClient` methods have been removed:
  - `getNextStepActionButtons()`, `addNextStepActionButton()`, `updateNextStepActionButton()`, `removeNextStepActionButton()`
- **Removed admin model types**: `NextStep`, `NextStepListParams`, `NextStepListResponse`, `CreateNextStepRequest`, `UpdateNextStepRequest`, `NextStepActionButton`, `NextStepActionButtonListParams`, `NextStepActionButtonListResponse`, `AddNextStepActionButtonRequest`, `UpdateNextStepActionButtonRequest`, `ActionButton`, `ActionButtonListParams`, `ActionButtonListResponse`, `CreateActionButtonRequest`, `UpdateActionButtonRequest`

### Unchanged

- **User-facing meeting endpoints** are unaffected — `getMeetingNextSteps()`, `executeNextStep()`, `getNextStepResult()`, `getMeetingActionButtons()`, and `triggerActionButton()` on `PartnerUserClient` continue to work as before.
- **User-facing model types** are preserved: `MeetingNextStep`, `MeetingActionButton`, `ExecuteNextStepRequest`, `NextStepResult`, `TriggerActionButtonRequest`, etc.

## [1.5.0] - 2026-04-03

### Added

- **Toolkits API** — declarative bundles of templates, next steps, and action buttons that can be managed and deployed as a unit:
  - **Admin (API key) endpoints** on `PartnerAdminClient`:
    - `createToolkit()`, `getToolkits()`, `getToolkit()`, `updateToolkit()`, `deleteToolkit()`
  - **User (OAuth) endpoints** on `PartnerUserClient`:
    - `getToolkits()` / `getToolkit()` — browse available toolkits with installation status
    - `installToolkit()` — install a toolkit into the user's workspace (provisions all manifest entities)
    - `uninstallToolkit()` — remove a toolkit and its provisioned entities from the workspace
- **Templates API** — reusable meeting structures with associated next steps:
  - **Admin endpoints** on `PartnerAdminClient`:
    - `createTemplate()`, `getTemplates()`, `getTemplate()`, `updateTemplate()`, `deleteTemplate()`
    - `getTemplateNextSteps()`, `addTemplateNextStep()`, `updateTemplateNextStep()`, `removeTemplateNextStep()`
  - **User endpoints** on `PartnerUserClient`:
    - `getMeetingTemplates()` / `getMeetingTemplate()` — list and retrieve templates with nested next steps and action buttons
- **Next Steps API** — AI-powered post-meeting actions:
  - **Admin endpoints** on `PartnerAdminClient`:
    - `createNextStep()`, `getNextSteps()`, `getNextStep()`, `updateNextStep()`, `deleteNextStep()`
    - `getNextStepActionButtons()`, `addNextStepActionButton()`, `updateNextStepActionButton()`, `removeNextStepActionButton()`
  - **User endpoints** on `PartnerUserClient`:
    - `getMeetingNextSteps()` — list next steps for a meeting
    - `executeNextStep()` — trigger AI execution of a next step; returns a `result_id` for polling
    - `getNextStepResult()` — retrieve the execution result
- **Action Buttons API** — delivery mechanisms (email, webhook, redirect, etc.) attached to next steps:
  - **Admin endpoints** on `PartnerAdminClient`:
    - `createActionButton()`, `getActionButtons()`, `getActionButton()`, `updateActionButton()`, `deleteActionButton()`
  - **User endpoints** on `PartnerUserClient`:
    - `getMeetingActionButtons()` — list action buttons available for a meeting
    - `triggerActionButton()` — execute a button's action; may return a `redirect_url`
- **New models** exported from the root package:
  - Toolkit: `Toolkit`, `ToolkitListParams`, `ToolkitListResponse`, `CreateToolkitRequest`, `UpdateToolkitRequest`, `ToolkitWithInstallation`, `ToolkitWithInstallationListResponse`, `ToolkitInstallation`
  - Template: `Template`, `TemplateListParams`, `TemplateListResponse`, `CreateTemplateRequest`, `UpdateTemplateRequest`, `TemplateNextStep`, `TemplateNextStepListParams`, `TemplateNextStepListResponse`, `AddTemplateNextStepRequest`, `UpdateTemplateNextStepRequest`
  - Next Step: `NextStep`, `NextStepListParams`, `NextStepListResponse`, `CreateNextStepRequest`, `UpdateNextStepRequest`, `NextStepActionButton`, `NextStepActionButtonListParams`, `NextStepActionButtonListResponse`, `AddNextStepActionButtonRequest`, `UpdateNextStepActionButtonRequest`
  - Action Button: `ActionButton`, `ActionButtonListParams`, `ActionButtonListResponse`, `CreateActionButtonRequest`, `UpdateActionButtonRequest`
  - Meeting-scoped: `MeetingNextStep`, `MeetingNextStepListParams`, `MeetingNextStepListResponse`, `MeetingActionButton`, `MeetingActionButtonListParams`, `MeetingActionButtonListResponse`, `ExecuteNextStepRequest`, `ExecuteNextStepResponse`, `TriggerActionButtonRequest`, `TriggerActionButtonResponse`, `NextStepResult`
  - User templates: `UserMeetingTemplate`, `UserMeetingTemplateListParams`, `UserMeetingTemplateListResponse`, `UserTemplateNextStep`, `UserTemplateActionButton`
- **New webhook events** — `WebhookEventHandler.on()` now accepts seven additional event types:
  - `action_button.triggered` — fired when a user triggers an action button; payload typed as `ActionButtonTriggeredPayload`
  - `meeting.context.created` — fired when context data is uploaded to a meeting; payload typed as `MeetingContextCreatedPayload`
  - `meeting.context.deleted` — fired when context data is removed from a meeting; payload typed as `MeetingContextDeletedPayload`
  - `meeting.context.processed` — fired when uploaded context data finishes preprocessing (includes sanitization report); payload typed as `MeetingContextProcessedPayload`
  - `meeting_template.applied` — fired when a template is applied to a meeting; payload typed as `MeetingTemplateAppliedPayload`
  - `next_step.completed` — fired when a Next Step execution completes; payload typed as `NextStepCompletedPayload`
  - `automation.assignment.created` — fired when an automation assignment is created; payload typed as `AutomationAssignmentCreatedPayload`
- New `WEBHOOK_EVENTS` constants: `ACTION_BUTTON_TRIGGERED`, `MEETING_CONTEXT_CREATED`, `MEETING_CONTEXT_DELETED`, `MEETING_CONTEXT_PROCESSED`, `MEETING_TEMPLATE_APPLIED`, `NEXT_STEP_COMPLETED`, `AUTOMATION_ASSIGNMENT_CREATED`
- **Automated webhook spec sync** — new CI workflow (`.github/workflows/sync-webhook-spec.yml`) that checks for upstream AsyncAPI spec updates on weekdays and opens a PR with regenerated types

### Changed

- Webhook types are now generated from AsyncAPI spec **v1.5.0** (previously v1.4.0)
- `SessionTurnCompletedData` and `SessionTurnFailedData` schemas simplified — several deprecated/verbose fields removed in favour of flattened top-level properties
- `SessionExpiredData.meeting_id` is now nullable (`string | null`)
- `assignee_id` fields on `ActionItemCompletedData` and `ActionItemCreatedData` are now nullable (`string | null`)
- `meeting_id` fields on `AgendaItemCreatedData`, `AgendaItemDeletedData`, and `AgendaItemUpdatedData` are now nullable
- `ParticipantInfo.guest_email` and `ParticipantInfo.user_id` are now nullable
- `MeetingUpdatedData.scheduled_start` is now nullable
- `ActionItemCompletedData`, `ActionItemCreatedData`, and `ParticipantAddedData` now include a `workspace_id` field
- `ActionItemUpdatedData` now includes an `assignee_id` field
- `ParticipantRemovedData` now includes `workspace_id` and nullable `user_id` fields

## [1.4.7] - 2026-03-20

### Added

- **Chat Session API** — full support for asynchronous, turn-based AI chat sessions scoped to meetings:
  - `createChatSession()` on `PartnerUserClient` — create a new session and submit the first user message (`chat:write`)
  - `getChatSessions()` on `PartnerUserClient` — list sessions with optional `meeting_id`/`status` filters and pagination (`chat:read`)
  - `getChatSession()` on `PartnerUserClient` — retrieve a session with its turns; supports `include: 'undelivered' | 'all_turns'` (`chat:read`)
  - `sendChatMessage()` on `PartnerUserClient` — enqueue the next user message turn; returns queue position (`chat:write`)
- **New Chat models** exported from the root package:
  - `ChatSession`, `ChatSessionStatus`
  - `ChatTurn`, `ChatTurnRole`, `ChatTurnStatus`
  - `ChatAgentMetadata`, `ChatToolCall`, `ChatTokenUsage`, `ChatTurnError`
  - `CreateChatSessionRequest`, `GetChatSessionParams`, `ChatSessionListParams`, `ChatSessionListResponse`
  - `SendChatMessageRequest`, `SendChatMessageResponse`, `ChatTurnListResponse`
- **New webhook events** — `WebhookEventHandler.on()` now accepts three additional event types:
  - `session.turn.completed` — fired when the agent finishes processing a turn; payload typed as `SessionTurnCompletedPayload`
  - `session.turn.failed` — fired when the agent fails to process a turn; payload typed as `SessionTurnFailedPayload`
  - `session.expired` — fired when a session expires due to inactivity; payload typed as `SessionExpiredPayload`
- `WEBHOOK_EVENTS.SESSION_EXPIRED`, `WEBHOOK_EVENTS.SESSION_TURN_COMPLETED`, `WEBHOOK_EVENTS.SESSION_TURN_FAILED` constants

## [1.4.6] - 2026-03-13

### Added
- `uploadContext()` method on `PartnerUserClient` — upload a context document for a meeting
- `listContexts()` method on `PartnerUserClient` — list all context documents for a meeting
- `getContext()` method on `PartnerUserClient` — get a specific context document
- `downloadContextContent()` method on `PartnerUserClient` — download context document content
- `deleteContext()` method on `PartnerUserClient` — delete a context document
- `MeetingContext`, `MeetingContextListResponse`, `MeetingContextResponse` types
- `context:read` and `context:write` OAuth scopes for Meeting Context endpoints

## [1.4.5] - 2026-03-06

### Added
- `updateWebhookStatus()` method on `PartnerAdminClient` — enable/disable webhooks with optional `pending_disposition`
- `setWebhookFilter()` method on `PartnerAdminClient` — set include/exclude event type filters
- `removeWebhookFilter()` method on `PartnerAdminClient` — remove event filter
- `webhook_enabled` field on `PartnerApp` type
- `webhook_filter` field on `PartnerApp` type
- `UpdateWebhookStatusRequest`, `SetWebhookFilterRequest`, `SetWebhookFilterError` types

## [1.4.3] - 2026-02-27

### Added

- **Shared workspace provisioning**: `initiatePartnerAuth()` now accepts an optional `options` parameter with `workspace_id` and `is_admin` fields, allowing partners to provision new users into existing shared workspaces ([CON-2753](https://linear.app/contio/issue/CON-2753))
- **Workspace profile fields**: `UserProfile` now includes `workspace_id`, `workspace_name`, and `workspace_role` fields
- **`WorkspaceRole` type**: New union type for workspace roles (`WORKSPACE_OWNER` | `WORKSPACE_ADMIN` | `WORKSPACE_MEMBER`)
- **`InitiatePartnerAuthOptions` interface**: Typed options for the shared workspace provisioning flow
- **`WorkspaceErrorCode` type**: New error codes for workspace operations (`workspace_not_found`, `workspace_not_authorized`, `workspace_conflict`)
- **`workspace_id` on `ErrorResponse`**: Present on `workspace_conflict` errors to indicate the user's current workspace

### Changed

- Aligned SDK with Partner API shared workspace changes ([CON-2743](https://linear.app/contio/issue/CON-2743))

## [1.4.2] - 2026-02-11

### Added

- **Date range filtering for calendar events**: New `start_date` and `end_date` parameters on `CalendarEventListParams` (preferred over the deprecated `start`/`end`)
- **Date range filtering for action items**: New `start_date` and `end_date` parameters on `ActionItemListParams`
- **Error request tracking**: `request_id` field on `ErrorResponse` for API request tracing; also surfaced as `requestId` on `ContioAPIError`

### Changed

- **Deprecated**: `CalendarEventListParams.start` and `CalendarEventListParams.end` — use `start_date` / `end_date` instead
- **Deprecated**: `ErrorResponse.message` — use `ErrorResponse.error` instead
- Aligned SDK with Partner API v1.4.2 changes ([rome#2896](https://github.com/Contio-AI/rome/pull/2896))

## [1.4.1] - 2026-02-06

### Changed

- **Deprecated**: `user.createMeetingFromCalendarEvent({calendar_event_id: string})` - The new `user.createMeetingFromCalendarEvent(calendarEventId)` method should be used instead. The argument is now a string instead of an object.
- **Deprecated**: `CreateMeetingFromCalendarEventRequest` interface - This interface is no longer used. The `createMeetingFromCalendarEvent` method now takes a string argument.

## [1.4.0] - 2026-01-31

### Added

- **New API endpoint**: `user.getCalendarEvent(calendarEventId)` - Retrieve detailed calendar event information including title, times, attendees, and organizer
- **New webhook events** (7 total):
  - `meeting.updated` - Meeting properties changed (title, scheduled time, etc.)
  - `calendar_event.created` - Calendar event synced from external calendar (Google, Outlook)
  - `calendar_event.updated` - Calendar event updated in external calendar
  - `calendar_event.deleted` - Calendar event cancelled/deleted in external calendar
  - `agenda_item.created` - Agenda item created in a meeting or backlog
  - `agenda_item.updated` - Agenda item title, status, or properties changed
  - `agenda_item.deleted` - Agenda item removed from meeting or backlog
- **TypeScript types**: Added `CalendarEventDetail` interface and all new webhook payload types with full type safety

### Changed

- Updated webhook type exports to include all new event types in `ContioWebhookEvent` union
- Updated `WEBHOOK_EVENTS` constant with new event type mappings

## [1.3.1] - 2026-01-27

### Moved from private repository to new home at https://github.com/Contio-AI/partner-sdk

## [1.3.0] - 2026-01-20

### Added

- **Calendar endpoints**: `getCalendarEvents()`, `linkCalendarEvent()`, `createMeetingFromCalendarEvent()`
- **Participant endpoints**: `getMeetingParticipants()`, `addMeetingParticipant()`, `removeMeetingParticipant()`
- **Agenda item endpoints**: `getMeetingAgendaItems()`, `createAgendaItem()`, `updateAgendaItem()`, `deleteAgendaItem()`
- **New webhook events**: `meeting.created`, `action_item.created`, `action_item.completed`
- **Webhook user context**: `for_user` field in webhook payloads identifies which user the event is for
- **Smart redirect support**: `getMeeting()` automatically follows redirect hints for copied meetings

### Changed

- Standardized OpenAPI tags for better API documentation grouping
- Updated action item status enum to include `needs_review` status

## [1.2.1] - 2026-01-14

### Added

- Sample app switched to IdP-based authentication flow
- Webhook signature validation middleware for Express

### Fixed

- Improved error handling in authentication flows

## [1.2.0] - 2026-01-09

### Added

- **Opaque token support**: Access tokens now use `cto_at_v1_` prefix format
- **Token introspection**: `introspectToken()` method for checking token validity and metadata
- **IdP configuration**: CRUD operations for partner IdP settings via `PartnerAdminClient`
- **SSO helpers**: `buildSSOEntryUrl()` for generating partner SSO entry URLs
- **Deep linking**: Support for `target` parameter in SSO URLs (desktop, backlog, meeting)

### Changed

- OAuth implementation refactored for improved reliability
- Simplified scope handling in authorization URLs

### Security

- Tokens are now opaque (not JWTs) for improved security
- Do not attempt to decode access/refresh tokens; use introspection instead

## [1.1.0] - 2026-01-05

### Added

- **Credential management**: `getCredentialStatus()`, `rotateAPIKey()`, `rotateWebhookSecret()`, `rotateClientSecret()`
- **Credential rollback**: `rollbackCredential()` for emergency recovery
- **Audit history**: `getCredentialHistory()` for compliance tracking
- **Typed webhook events**: Strongly-typed interfaces for all webhook event payloads
- **Express middleware**: `createWebhookMiddleware()` for streamlined webhook handling

### Changed

- Improved TypeScript type exports
- Better error messages for authentication failures

## [1.0.1] - 2025-12-20

### Fixed

- Fixed token refresh flow when refresh token is provided explicitly
- Corrected header handling for API key authentication

## [1.0.0] - 2025-12-15

### Added

- Initial release of the Contio Partner SDK
- **OAuth 2.0 client**: Authorization code flow, token refresh, client credentials
- **User API client**: Meetings and action items CRUD operations
- **Admin API client**: Automations, webhook deliveries, user connections
- **Webhook verification**: HMAC-SHA256 signature verification
- **Error handling**: `ContioAPIError` with structured error information
- **Retry logic**: Automatic retry with exponential backoff for transient failures

[1.6.0]: https://github.com/Contio-AI/partner-sdk/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/Contio-AI/partner-sdk/compare/v1.4.7...v1.5.0
[1.4.7]: https://github.com/Contio-AI/partner-sdk/compare/v1.4.6...v1.4.7
[1.4.6]: https://github.com/Contio-AI/partner-sdk/compare/v1.4.5...v1.4.6
[1.4.5]: https://github.com/Contio-AI/partner-sdk/compare/v1.4.3...v1.4.5
[1.4.3]: https://github.com/Contio-AI/partner-sdk/compare/v1.4.2...v1.4.3
[1.4.2]: https://github.com/Contio-AI/partner-sdk/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/Contio-AI/partner-sdk/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/Contio-AI/partner-sdk/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/Contio-AI/partner-sdk/compare/v1.3.0...v1.3.1