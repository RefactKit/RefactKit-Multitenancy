import { Button, Heading, Section, Text, Img } from '@react-email/components';
import React from 'react';
import { EmailLayout } from './layout';

interface InvitationEmailProps {
  orgName: string;
  inviterName: string;
  url: string;
  orgLogo?: string;
}

export const InvitationEmail = ({
  orgName,
  inviterName,
  url,
  orgLogo,
}: InvitationEmailProps) => (
  <EmailLayout preview={`Join ${orgName} on RefactKit`}>
    <Section className="text-center mb-6">
      {orgLogo ? (
        <Img
          src={orgLogo}
          width={64}
          height={64}
          className="mx-auto rounded-lg mb-4"
        />
      ) : (
        <Section className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <Text className="text-primary text-xl font-bold m-0">{orgName[0]}</Text>
        </Section>
      )}
    </Section>
    <Heading className="text-fg text-2xl font-bold text-center m-0 mb-4">
      Join the Team
    </Heading>
    <Text className="text-fg-2 text-base leading-relaxed text-center mb-8">
      <strong>{inviterName}</strong> has invited you to join <strong>{orgName}</strong> on RefactKit.
    </Text>
    <Section className="text-center mb-8">
      <Button
        href={url}
        className="bg-primary text-white text-base font-bold py-3 px-8 rounded-lg"
      >
        Accept Invitation
      </Button>
    </Section>
    <Text className="text-fg-3 text-sm text-center">
      If you weren't expecting this invitation, you can safely ignore this email.
    </Text>
  </EmailLayout>
);

export default InvitationEmail;
