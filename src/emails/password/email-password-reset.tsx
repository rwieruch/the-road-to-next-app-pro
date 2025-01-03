import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type EmailPasswordResetProps = {
  toName: string;
  url: string;
};

const EmailPasswordReset = ({ toName, url }: EmailPasswordResetProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans m-8 text-center">
          <Container>
            <Section>
              <Text>
                Hello {toName}, you have requested to reset your password. Click
                the button below to reset your password.
              </Text>
            </Section>
            <Section>
              <Button
                href={url}
                className="bg-black rounded text-white p-2 m-2"
              >
                Reset Password
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailPasswordReset.PreviewProps = {
  toName: "Robin Wieruch",
  url: "http://localhost:3000/password-reset/abc123",
} as EmailPasswordResetProps;

export default EmailPasswordReset;
