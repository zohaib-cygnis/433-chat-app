import { signIn, getCsrfToken } from "next-auth/react";
import Link from 'next/link'

import { useRouter } from "next/router";

import { useState } from "react";

import { Formik } from "formik";
import * as Yup from "yup";

import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";

export default function SignIn({ csrfToken }) {
  const router = useRouter();
  const [error, setError] = useState(null);

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .max(30, "Must be 30 characters or less")
            .email("Invalid email address")
            .required("Please enter your email"),
          password: Yup.string().required("Please enter your password"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          const res = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
            callbackUrl: `${window.location.origin}`,
          });
          if (res?.error) {
            setError(res.error);
          } else {
            setError(null);
          }
          if (res.url) router.push(res.url);
          setSubmitting(false);
        }}
      >
        {({ handleChange, handleSubmit, errors, touched }) => (
          <Grid
            textAlign="center"
            style={{ height: "100vh" }}
            verticalAlign="middle"
          >
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h2" color="teal" textAlign="center">
                Log-in to your account
              </Header>
              <Form size="large" onSubmit={handleSubmit} autoComplete="off">
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
                <Segment stacked>
                  <Form.Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="E-mail address"
                    name="email"
                    onChange={handleChange}
                    error={
                      errors.email && touched.email
                        ? {
                            content: "Please enter a valid email address",
                            pointing: "below",
                          }
                        : null
                    }
                  />
                  <Form.Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    error={
                      errors.password && touched.password
                        ? {
                            content: "Please enter your password",
                            pointing: "below",
                          }
                        : null
                    }
                  />

                  <Button color="teal" fluid size="large" type="submit">
                    Login
                  </Button>
                </Segment>
              </Form>
              <Message>
                New to us?  <Link href="/auth/signup">
                    <a>Sign Up</a>
                </Link>
              </Message>
            </Grid.Column>
          </Grid>
        )}
      </Formik>
    </>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
