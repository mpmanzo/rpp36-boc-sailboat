import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import jwt_decode from 'jwt-decode';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp(props) {
  const onClick = props.onClick;
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const onSubmit = (data) => onClick(data);

  var handleCallbackResponse = function(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var googleUser = jwt_decode(response.credential);
    console.log(googleUser);
    setUser(googleUser);
    document.getElementById("google-signup").hidden=true;
  };

  var handleSignOut = function(event) {
    setUser({});
    document.getElementById("google-signup").hidden=false;
  };

  // React.useEffect(() => {
  //   /* global google */
  //   google.accounts.id.initialize({
  //     client_id: "613322576609-rqh45grths58apdat1427ogk93jlasfb.apps.googleusercontent.com",
  //     callback: handleCallbackResponse
  //   });

  //   google.accounts.id.renderButton(
  //     document.getElementById("google-signup"),
  //     { theme: "outline", size: "large" }
  //   );

  //   google.accounts.id.prompt();
  // }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Typography variant="h3" color="primary" align="center">
          Encompass
        </Typography>
        <Typography align="center">
          Let's get things done!
        </Typography>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box sx={{ mt: 5 }}>
            <div
              id="google-signup"
              align="center"
            >
            </div>
            <p align="center">
              or
            </p>
          </Box>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  autoComplete="given-name"
                  id="firstname-signup"
                  label="First Name"
                  name="firstName"
                  {...register('firstName', {
                    required: 'Required field',
                    pattern: {
                      value: /(?=^.{0,20}$)(^\S)(?=.*[A-Z])(?=.*[\S]+$).*/i,
                      message: 'Invalid first name',
                    },
                  })}
                  error={!!errors?.firstName}
                  helperText={errors?.firstName ? errors.firstName.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  autoComplete="family-name"
                  id="lastname-signup"
                  label="Last Name"
                  name="lastName"
                  {...register('lastName', {
                    required: 'Required field',
                    pattern: {
                      value: /(?=^.{0,20}$)(^\S)(?=.*[A-Z])(?=.*[\S]+$).*/i,
                      message: 'Invalid last name',
                    },
                  })}
                  error={!!errors?.lastName}
                  helperText={errors?.lastName ? errors.lastName.message : null}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  autoComplete="email"
                  id="email-signup"
                  label="Email Address"
                  name="email"
                  {...register('email', {
                    required: 'Required field',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={!!errors?.email}
                  helperText={errors?.email ? errors.email.message : null}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  autoComplete="new-password"
                  id="password-signup"
                  label="Password"
                  name="password"
                  type="password"
                  {...register('password', {
                    required: 'Required field',
                    pattern: {
                      value: /(?=^.{0,20}$)(^\S)(?=.*[A-Z])(?=.*[\S]+$).*/i,
                      message: 'Incorrect password',
                    },
                  })}
                  error={!!errors?.password}
                  helperText={errors?.password ? errors.password.message : null}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  autoComplete="confirm-password"
                  id="confirm-password-signup"
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Required field',
                    validate: (val, string) => {
                      if (watch('password') != val) {
                        return "Passwords must match";
                      }
                    },
                  })}
                  error={!!errors?.confirmPassword}
                  helperText={errors?.confirmPassword ? errors.confirmPassword.message : null}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

// Strict password validations:
// value: /(?=^.{8,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9])(\S+$).*/,
// - At least 8 characters required, including:
// - At least 1 of each: uppercase letter, lowercase letter, number and special character
// - No spaces allowed