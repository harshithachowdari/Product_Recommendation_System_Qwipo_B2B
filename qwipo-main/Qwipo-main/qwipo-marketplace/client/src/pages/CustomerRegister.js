import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, User, Phone, Building, ArrowLeft, CheckCircle } from 'lucide-react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  padding: var(--space-8);
  width: 100%;
  max-width: 500px;
  border: 1px solid var(--gray-200);
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-8);
`;

const RegisterTitle = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--gray-800);
  margin-bottom: var(--space-2);
`;

const RegisterSubtitle = styled.p`
  color: var(--gray-600);
  font-size: var(--font-size-lg);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--gray-700);
  font-size: var(--font-size-sm);
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: var(--space-3) var(--space-4);
  padding-right: ${props => props.hasIcon ? '2.5rem' : '1rem'};
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px var(--primary-100);
    background: var(--primary-50);
  }

  &.error {
    border-color: var(--error-500);
    background: var(--error-50);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  cursor: pointer;
`;

const ErrorText = styled.span`
  color: var(--error-600);
  font-size: var(--font-size-xs);
  font-weight: 500;
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: var(--space-4);
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--font-size-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    background: var(--gray-300);
    cursor: not-allowed;
    transform: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: var(--space-6) 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gray-200);
  }
  
  span {
    padding: 0 var(--space-4);
    color: var(--gray-500);
    font-size: var(--font-size-sm);
  }
`;

const LoginLink = styled(Link)`
  color: var(--primary-600);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: color 0.2s ease;
  text-align: center;

  &:hover {
    color: var(--primary-700);
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--gray-600);
  text-decoration: none;
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-4);
  transition: color 0.2s ease;

  &:hover {
    color: var(--gray-800);
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--success-50);
  border: 1px solid var(--success-200);
  border-radius: var(--radius-lg);
  color: var(--success-700);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-4);
`;

const CustomerRegister = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const password = watch('password');
  const [locating, setLocating] = useState(false);

  const useMyLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        setValue('address.location.coordinates', [longitude, latitude]);
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await resp.json();
        const addr = data.address || {};
        if (addr.city || addr.town || addr.village) setValue('city', addr.city || addr.town || addr.village);
        if (addr.state) setValue('state', addr.state);
        if (addr.postcode) setValue('zipCode', addr.postcode);
        toast.success('Location detected');
      } catch (e) {
        console.error(e);
        toast.error('Failed to fetch address from location');
      } finally {
        setLocating(false);
      }
    }, (err) => {
      console.error(err);
      toast.error('Unable to get your location');
      setLocating(false);
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        userType: 'customer',
        phone: data.phone,
        address: {
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
          country: 'India',
          ...(data.address?.location?.coordinates ? { location: { type: 'Point', coordinates: data.address.location.coordinates } } : {})
        }
      };

      const result = await registerUser(userData);
      if (result.success) {
        setIsSuccess(true);
        toast.success('Registration successful! Welcome to Qwipo!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (isSuccess) {
    return (
      <RegisterContainer>
        <RegisterCard>
          <SuccessMessage>
            <CheckCircle size={20} />
            Registration successful! Redirecting to dashboard...
          </SuccessMessage>
        </RegisterCard>
      </RegisterContainer>
    );
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <BackLink to="/">
          <ArrowLeft size={16} />
          Back to Home
        </BackLink>

        <RegisterHeader>
          <RegisterTitle>Join Qwipo</RegisterTitle>
          <RegisterSubtitle>Create your account to start shopping</RegisterSubtitle>
        </RegisterHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">First Name *</Label>
              <InputContainer>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  className={errors.firstName ? 'error' : ''}
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters',
                    },
                  })}
                />
                <InputIcon>
                  <User size={16} />
                </InputIcon>
              </InputContainer>
              {errors.firstName && <ErrorText>{errors.firstName.message}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="lastName">Last Name *</Label>
              <InputContainer>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  className={errors.lastName ? 'error' : ''}
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters',
                    },
                  })}
                />
                <InputIcon>
                  <User size={16} />
                </InputIcon>
              </InputContainer>
              {errors.lastName && <ErrorText>{errors.lastName.message}</ErrorText>}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="email">Email Address *</Label>
            <InputContainer>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              <InputIcon>
                <Mail size={16} />
              </InputIcon>
            </InputContainer>
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">Phone Number *</Label>
            <InputContainer>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                className={errors.phone ? 'error' : ''}
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^\+?[\d\s-()]+$/,
                    message: 'Invalid phone number',
                  },
                })}
              />
              <InputIcon>
                <Phone size={16} />
              </InputIcon>
            </InputContainer>
            {errors.phone && <ErrorText>{errors.phone.message}</ErrorText>}
          </FormGroup>

          {/* Address Section */}
          <FormRow>
            <FormGroup>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                placeholder="Enter your city"
                className={errors.city ? 'error' : ''}
                {...register('city', {
                  required: 'City is required',
                })}
              />
              {errors.city && <ErrorText>{errors.city.message}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                type="text"
                placeholder="Enter your state"
                className={errors.state ? 'error' : ''}
                {...register('state', {
                  required: 'State is required',
                })}
              />
              {errors.state && <ErrorText>{errors.state.message}</ErrorText>}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              type="text"
              placeholder="Enter ZIP/postal code"
              className={errors.zipCode ? 'error' : ''}
              {...register('zipCode', {
                required: 'ZIP code is required',
              })}
            />
            {errors.zipCode && <ErrorText>{errors.zipCode.message}</ErrorText>}
          </FormGroup>

          {/* Hidden field for coordinates if detected */}
          <input type="hidden" {...register('address.location.coordinates')} />

          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid var(--primary-300)',
              background: 'var(--primary-50)',
              color: 'var(--primary-700)',
              cursor: 'pointer',
              marginBottom: '0.5rem'
            }}
          >
            {locating ? 'Detecting location…' : 'Use my location'}
          </button>

          <FormRow>
            <FormGroup>
              <Label htmlFor="password">Password *</Label>
              <InputContainer>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  className={errors.password ? 'error' : ''}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                />
                <InputIcon onClick={togglePasswordVisibility}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </InputIcon>
              </InputContainer>
              {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <InputContainer>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'error' : ''}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                />
                <InputIcon onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </InputIcon>
              </InputContainer>
              {errors.confirmPassword && <ErrorText>{errors.confirmPassword.message}</ErrorText>}
            </FormGroup>
          </FormRow>

          <RegisterButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="loading" />
                Creating Account...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Create Account
              </>
            )}
          </RegisterButton>

          <Divider>
            <span>or</span>
          </Divider>

          <div style={{ textAlign: 'center' }}>
            <span style={{ color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)' }}>
              Already have an account?{' '}
            </span>
            <LoginLink to="/login">Sign in here</LoginLink>
          </div>
        </Form>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default CustomerRegister;
