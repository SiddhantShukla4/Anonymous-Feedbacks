import {Html, Head,Font,Preview,Body, Heading,Row, Section,Text,Button} from '@react-email/components';

interface VerificationEmailProps {
    username:string;
    otp:string;
}

export default function VerificationEmail({username,otp}:VerificationEmailProps){
   return (
    <Html>
        <Head>
            <title> Verification Code</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" />
        </Head>
        <Preview> Here &apos;s your verification code :{otp}</Preview>
        <Body>
            <Section>
                <Row>
                    <Heading as="h2">Hello {username},</Heading>
                    <Text>Thank you for registering. please use the following verification code to complete your registration </Text>
                    {/* <Button href="https://example.com/verify">Verify</Button> */}
                </Row>
                <Row>{otp}</Row>
                <Row>
                    if you did not register for account please ignore this email.
                </Row>
            </Section>
        </Body>
    </Html>
   ) 
}