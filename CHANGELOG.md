# Changelog

All notable changes to the Contio Partner SDK will be documented in this file. 
Versions prior to v1.3.0 were maintained in a private repository (history unavilable).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- **Admin API client**: Workflows, webhook deliveries, user connections
- **Webhook verification**: HMAC-SHA256 signature verification
- **Error handling**: `ContioAPIError` with structured error information
- **Retry logic**: Automatic retry with exponential backoff for transient failures

[1.3.0]: https://github.com/Contio-AI/partner-sdk/compare/v0.0.0...v1.3.0