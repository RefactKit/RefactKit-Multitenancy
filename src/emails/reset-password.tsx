import { Button, Heading, Section, Text, Img } from '@react-email/components';
import React from 'react';
import { EmailLayout } from './layout';

interface ResetPasswordProps {
  url: string;
}

const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

export const ResetPassword = ({ url }: ResetPasswordProps) => (
  <EmailLayout preview="Reset your password">
    <Section className="mb-3">
       <Img
        src={`${baseUrl}/static/logo.png`}
        alt="Logo"
        width={48}
        className="mx-auto mb-5 block"
      />
      <Heading as="h1" className="font-font-28 text-fg m-0 font-bold">
        Reset Password
      </Heading>
    </Section>

    <Text className="font-font-16 text-fg-2 mx-auto mt-0 mb-8 max-w-[380px] text-center">
      You requested a password reset for your RefactKit account. 
      Click the button below to set a new password.
    </Text>

    <Section className="mb-6 text-center">
      <Button
        href={url}
        className="bg-fg font-font-16 text-white inline-block rounded-lg px-7 py-4 text-center font-bold leading-6"
      >
        Reset Password
      </Button>
    </Section>

    <Text className="font-font-13 text-fg-3 mx-auto mt-8 mb-0 max-w-[400px] text-center">
      This link will expire in 30 minutes. If you didn't request a password reset, please ignore this email.
    </Text>
  </EmailLayout>
);

export default ResetPassword;
