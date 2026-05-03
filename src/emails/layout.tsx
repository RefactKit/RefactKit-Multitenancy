import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
  Row,
  Column,
  Link,
} from '@react-email/components';
import React from 'react';
import { tailwindConfig } from './theme';
import { EmailFonts } from './theme-fonts';

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
  companyName?: string;
}

const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

export const EmailLayout = ({
  preview,
  children,
  companyName = 'RefactKit',
}: EmailLayoutProps) => (
  <Tailwind config={tailwindConfig}>
    <Html>
      <Head>
        <EmailFonts />
      </Head>
      <Body className="bg-bg-2 m-0 font-sans">
        <Preview>{preview}</Preview>
        <Container className="mx-auto mt-8 w-full max-w-[600px] bg-bg p-8 rounded-lg shadow-sm border border-gray-100">
          <Section className="mb-8">
             <Row>
                <Column align="left">
                   <Img
                    src={`${baseUrl}/static/logo.png`}
                    alt="RefactKit"
                    width={120}
                    className="block"
                  />
                </Column>
                <Column align="right">
                   <Text className="text-fg-3 text-xs m-0 uppercase tracking-wider">{companyName}</Text>
                </Column>
             </Row>
          </Section>
          
          {children}

          <Section className="mt-12 pt-8 border-t border-gray-100 text-center">
            <Text className="text-fg-3 text-xs leading-relaxed">
              RefactKit — The High-Performance SaaS Boilerplate.<br />
              Helping you ship faster with React 19 and TanStack.
            </Text>
            <Section className="mt-4">
               <Link href="https://refactkit.com" className="text-primary text-xs font-semibold mx-2">Website</Link>
               <Link href="https://github.com/refactkit" className="text-primary text-xs font-semibold mx-2">GitHub</Link>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);
