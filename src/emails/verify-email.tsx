import { Button, Heading, Section, Text } from '@react-email/components';
import React from 'react';
import { EmailLayout } from './layout';

interface VerifyEmailProps {
  url: string;
}

export const VerifyEmail = ({ url }: VerifyEmailProps) => (
  <EmailLayout preview="Verify your email address">
    <Heading className="text-fg text-2xl font-bold text-center m-0 mb-4">
      Welcome to RefactKit!
    </Heading>
    <Text className="text-fg-2 text-base leading-relaxed text-center mb-8">
      We're excited to have you on board. To get started, please verify your email address by clicking the button below.
    </Text>
    <Section className="text-center mb-8">
      <Button
        href={url}
        className="bg-primary text-white text-base font-bold py-3 px-8 rounded-lg"
      >
        Verify Email Address
      </Button>
    </Section>
    <Text className="text-fg-3 text-sm text-center">
      If you didn't create an account, you can safely ignore this email.
    </Text>
  </EmailLayout>
);

export default VerifyEmail;
