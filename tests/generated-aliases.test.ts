import * as fs from 'fs';
import * as path from 'path';
import type * as Generated from '../src/generated';

type Equals<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

// Compile-time guard: every pre-CON-7378 generated name still resolves to the
// renamed canonical type. If codegen renames a target, tsc fails here.
type _OauthAliases = [
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerOauthTokenResponse,
      Generated.OauthTokenResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerOauthTokenIntrospection,
      Generated.OauthTokenIntrospection
    >
  >,
  Expect<Equals<Generated.RomeApiControllersExternalPartnerOauthJWK, Generated.OauthJWK>>,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerOauthJWKSResponse,
      Generated.OauthJWKSResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerOauthDiscoveryDocument,
      Generated.OauthDiscoveryDocument
    >
  >,
  Expect<Equals<Generated.RomeApiControllersExternalPartnerOauthUserInfo, Generated.OauthUserInfo>>,
];

type _ToolkitAliases = [
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerAdminToolkitToolkitResponse,
      Generated.ToolkitToolkitResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserToolkitToolkitResponse,
      Generated.ToolkitPartnerToolkitResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseRomeApiControllersExternalPartnerAdminToolkitToolkitResponse,
      Generated.SharedListResponseToolkitToolkitResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseRomeApiControllersExternalPartnerUserToolkitToolkitResponse,
      Generated.SharedListResponseToolkitPartnerToolkitResponse
    >
  >,
];

type _ListResponseAliases = [
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerAdminSharedListResponseAutomationAutomationResponse,
      Generated.SharedListResponseAutomationAutomationResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerAdminSharedListResponseConnectionUserConnectionResponse,
      Generated.SharedListResponseConnectionUserConnectionResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerAdminSharedListResponseTemplateTemplateNextStepResponse,
      Generated.SharedListResponseTemplateTemplateNextStepResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerAdminSharedListResponseTemplateTemplateResponse,
      Generated.SharedListResponseTemplateTemplateResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerAdminSharedListResponseWorkflowPartnerWorkflowTemplateSummary,
      Generated.SharedListResponseWorkflowPartnerWorkflowTemplateSummary
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseActionItemPartnerActionItemResponse,
      Generated.SharedListResponseActionItemPartnerActionItemResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseBacklogItemPartnerBacklogItemResponse,
      Generated.SharedListResponseBacklogItemPartnerBacklogItemResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseCalendarPartnerCalendarEventResponse,
      Generated.SharedListResponseCalendarPartnerCalendarEventResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseMeetingPartnerAgendaItemResponse,
      Generated.SharedListResponseMeetingPartnerAgendaItemResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseMeetingPartnerMeetingParticipantResponse,
      Generated.SharedListResponseMeetingPartnerMeetingParticipantResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseMeetingTemplatePartnerMeetingTemplateResponse,
      Generated.SharedListResponseMeetingTemplatePartnerMeetingTemplateResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseMeetingTemplateTemplateNextStepResponse,
      Generated.SharedListResponseMeetingTemplateTemplateNextStepResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseSessionPartnerChatSessionResponse,
      Generated.SharedListResponseSessionPartnerChatSessionResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseSharedActionButtonResponse,
      Generated.SharedListResponseSharedActionButtonResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseSharedNextStepResponse,
      Generated.SharedListResponseSharedNextStepResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseSharedPartnerMeetingResponse,
      Generated.SharedListResponseSharedPartnerMeetingResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseToolkitToolkitWithInstallationResponse,
      Generated.SharedListResponseToolkitToolkitWithInstallationResponse
    >
  >,
  Expect<
    Equals<
      Generated.RomeApiControllersExternalPartnerUserSharedListResponseWorkflowRunPartnerWorkflowRunResponse,
      Generated.SharedListResponseWorkflowRunPartnerWorkflowRunResponse
    >
  >,
];

// Names that 1.12's TYPE_RENAMES produced must still be emitted natively.
type _CanonicalNames = [
  Generated.PartnerAutomationAction,
  Generated.ToolkitManifestRef,
  Generated.ToolkitNextStepActionButtonRelation,
  Generated.ToolkitTemplateNextStepRelation,
  Generated.TranscriptImportResponse,
  Generated.AudioTranscriptImportStatusResponse,
];

describe('generated type surface', () => {
  const generatedDir = path.join(__dirname, '..', 'src', 'generated');

  it('emits no Go package-path leaks as canonical generated types', () => {
    const apiTypes = fs.readFileSync(path.join(generatedDir, 'api-types.ts'), 'utf8');
    expect(apiTypes.match(/\bRomeApi\w+/g)).toBeNull();
  });

  it('only exposes RomeApi* names as deprecated aliases', () => {
    const index = fs.readFileSync(path.join(generatedDir, 'index.ts'), 'utf8');
    const aliasLines = index.split('\n').filter((line) => /^export type RomeApi\w+ =/.test(line));
    expect(aliasLines).toHaveLength(28);
    for (const line of aliasLines) {
      const previous = index.split('\n')[index.split('\n').indexOf(line) - 1];
      expect(previous).toMatch(/@deprecated/);
    }
  });
});
