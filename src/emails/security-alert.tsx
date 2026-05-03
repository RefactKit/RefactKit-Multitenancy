import { Heading, Section, Text, Button } from '@react-email/components';
import React from 'react';
import { EmailLayout } from './layout';

interface SecurityAlertProps {
  userName: string;
  email: string;
  loginUrl: string;
}

export const SecurityAlert = ({
  userName,
  email,
  loginUrl,
}: SecurityAlertProps) => (
  <EmailLayout preview="Security Alert: Sign-in attempt on your account">
    <Heading className="text-red-600 text-2xl font-bold text-center m-0 mb-4">
      Security Alert
    </Heading>
    <Text className="text-fg-2 text-base leading-relaxed mb-4">
      Hi {userName},
    </Text>
    <Text className="text-fg-2 text-base leading-relaxed mb-6">
      Someone tried to create a new account using your email address (<strong>{email}</strong>).
    </Text>
    <Text className="text-fg-2 text-base leading-relaxed mb-8">
      If this was you and you've forgotten your password, you can reset it from the login page. If this wasn't you, your account is still secure, and you can safely ignore this email.
    </Text>
    <Section className="text-center mb-8">
      <Button
        href={loginUrl}
        className="bg-fg text-white text-base font-bold py-3 px-8 rounded-lg"
      >
        Go to Login
      </Button>
    </Section>
    <Section className="p-4 bg-gray-50 rounded-lg border border-gray-100">
       <Text className="text-fg-3 text-xs m-0">
         This is an automated security notification. For your protection, we'll never ask for your password via email.
       </Text>
    </Section>
  </EmailLayout>
);

export default SecurityAlert;
