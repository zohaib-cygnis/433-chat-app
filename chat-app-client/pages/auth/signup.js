import { useState } from "react";
import Link from "next/link";

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

export default function SignUp() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Formik
        initialValues={{ email: "", name: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .max(30, "Must be 30 characters or less")
            .email("Invalid email address")
            .required("Please enter your email"),
          name: Yup.string().required("Please enter your name"),
          password: Yup.string().required("Please enter your password"),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setLoading(true);
          const payload = {
            email: values.email,
            name: values.name,
            password: values.password,
          };

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
            {
              method: "POST",
              body: JSON.stringify(payload),
              headers: {
                "Content-Type": "application/json",
                "Accept-Language": "en-US",
              },
            }
          );

          const data = await res.json();
          if (res.ok && data) {
            setSuccess(true);
          }

          if (!res.ok) {
            setError(data.message);
          }

          setTimeout(() => {
            setError(null);
          }, "2500")

          setSubmitting(false);
          setLoading(false);
          resetForm({ values: "" });
        }}
      >
        {({ handleChange, handleSubmit, errors, touched, resetForm }) => (
          <Grid
            textAlign="center"
            style={{ height: "100vh" }}
            verticalAlign="middle"
          >
            <Grid.Column style={{ maxWidth: 450 }}>
              {success && (
                <Message
                  success
                  header="Your user registration was successful"
                  content="You may now log-in with the email and password you have chosen"
                />
              )}

              {error && (
                <Message negative>
                  <Message.Header>
                    We're sorry we can't help you with that
                  </Message.Header>
                  <p>{error}</p>
                </Message>
              )}

              <Header as="h2" color="teal" textAlign="center">
                Register your account
              </Header>
              <Form size="large" onSubmit={handleSubmit} autoComplete="off">
                <Segment stacked>
                  <Form.Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="Name"
                    name="name"
                    onChange={handleChange}
                    error={
                      errors.name && touched.name
                        ? {
                            content: "Please enter a valid name",
                            pointing: "below",
                          }
                        : null
                    }
                  />
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

                  <Button
                    loading={loading}
                    color="teal"
                    fluid
                    size="large"
                    type="submit"
                  >
                    Sign Up
                  </Button>
                </Segment>
              </Form>
              <Message>
                Already Registed?
                <Link href="/auth/signin">
                  <a> Sign In</a>
                </Link>
              </Message>
            </Grid.Column>
          </Grid>
        )}
      </Formik>
    </>
  );
}
