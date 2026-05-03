import { Button, Heading, Section, Text } from '@react-email/components';
import React from 'react';
import { EmailLayout } from './layout';

interface ResetPasswordProps {
  url: string;
}

export const ResetPassword = ({ url }: ResetPasswordProps) => (
  <EmailLayout preview="Reset your password">
    <Heading className="text-fg text-2xl font-bold text-center m-0 mb-4">
      Reset Password
    </Heading>
    <Text className="text-fg-2 text-base leading-relaxed text-center mb-8">
      You requested a password reset for your RefactKit account. Click the button below to set a new password.
    </Text>
    <Section className="text-center mb-8">
      <Button
        href={url}
        className="bg-fg text-white text-base font-bold py-3 px-8 rounded-lg"
      >
        Reset Password
      </Button>
    </Section>
    <Text className="text-fg-3 text-sm text-center">
      This link will expire in 30 minutes. If you didn't request a password reset, please ignore this email.
    </Text>
  </EmailLayout>
);

export default ResetPassword;
