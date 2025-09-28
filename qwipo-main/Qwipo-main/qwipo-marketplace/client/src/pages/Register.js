import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Building, Phone, MapPin, ArrowLeft } from 'lucide-react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const RegisterContainer = styled.div`
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #f9fafb;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const RegisterTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const RegisterSubtitle = styled.p`
  color: #64748b;
  font-size: 0.875rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: ${props => props.hasIcon ? '2.5rem' : '1rem'};
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &.error {
    border-color: #ef4444;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  cursor: pointer;
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
  
  span {
    padding: 0 1rem;
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

const LinkText = styled(Link)`
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: #374151;
  }
`;

const UserTypeSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const UserTypeButton = styled.button`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #374151;

  &.active {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #3b82f6;
  }

  &:hover:not(.active) {
    border-color: #d1d5db;
  }
`;

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({ 
    mode: 'onChange',
    defaultValues: {
      userType: 'retailer',
      businessType: 'general',
      'address.country': 'India'
    }
  });

  const userType = watch('userType', 'retailer');

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
        // Save coordinates as [lng, lat] into GeoJSON location
        setValue('address.location.coordinates', [longitude, latitude]);
        // Reverse geocode using OpenStreetMap Nominatim (no API key needed)
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await resp.json();
        const addr = data.address || {};
        // Best-effort mapping
        if (addr.city || addr.town || addr.village) setValue('address.city', addr.city || addr.town || addr.village);
        if (addr.state) setValue('address.state', addr.state);
        if (addr.postcode) setValue('address.zipCode', addr.postcode);
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
    console.log('Form data being submitted:', data);
    setIsLoading(true);
    try {
      const result = await registerUser(data);
      if (result.success) {
        toast.success('Registration successful! Please check your email for verification.');
        navigate('/');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error in form:', error);
      toast.error('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <BackLink to="/">
          <ArrowLeft size={16} />
          Back to Home
        </BackLink>

        <RegisterHeader>
          <RegisterTitle>Join Qwipo Marketplace</RegisterTitle>
          <RegisterSubtitle>Create your account to get started</RegisterSubtitle>
        </RegisterHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Account Type</Label>
            <UserTypeSelector>
              <UserTypeButton
                type="button"
                className={userType === 'retailer' ? 'active' : ''}
                onClick={() => {
                  setValue('userType', 'retailer', { shouldValidate: true, shouldDirty: true });
                }}
              >
                Retailer
              </UserTypeButton>
              <UserTypeButton
                type="button"
                className={userType === 'distributor' ? 'active' : ''}
                onClick={() => {
                  setValue('userType', 'distributor', { shouldValidate: true, shouldDirty: true });
                }}
              >
                Distributor
              </UserTypeButton>
              {/* B2B only: retailer and distributor */}
            </UserTypeSelector>
            <input
              type="hidden"
              {...register('userType', { required: true })}
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">First Name</Label>
              <InputContainer>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter first name"
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
              <Label htmlFor="lastName">Last Name</Label>
              <InputContainer>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
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
            <Label htmlFor="email">Email Address</Label>
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
            <Label htmlFor="phone">Phone Number</Label>
            <InputContainer>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
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

          <FormGroup>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              type="text"
              placeholder="Enter your business name"
              className={errors.businessName ? 'error' : ''}
              {...register('businessName', {
                required: 'Business name is required',
              })}
            />
            {errors.businessName && <ErrorText>{errors.businessName.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="businessType">Business Type</Label>
            <Select
              id="businessType"
              className={errors.businessType ? 'error' : ''}
              {...register('businessType', {
                required: 'Business type is required',
              })}
            >
              <option value="">Select business type</option>
              <option value="grocery">Grocery</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="general">General</option>
              <option value="other">Other</option>
            </Select>
            {errors.businessType && <ErrorText>{errors.businessType.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              type="text"
              placeholder="Enter street address"
              className={errors.address?.street ? 'error' : ''}
              {...register('address.street', {
                required: 'Street address is required',
              })}
            />
            {errors.address?.street && <ErrorText>{errors.address.street.message}</ErrorText>}
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                placeholder="Enter city"
                className={errors.address?.city ? 'error' : ''}
                {...register('address.city', {
                  required: 'City is required',
                })}
              />
              {errors.address?.city && <ErrorText>{errors.address.city.message}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                type="text"
                placeholder="Enter state"
                className={errors.address?.state ? 'error' : ''}
                {...register('address.state', {
                  required: 'State is required',
                })}
              />
              {errors.address?.state && <ErrorText>{errors.address.state.message}</ErrorText>}
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="Enter ZIP code"
                className={errors.address?.zipCode ? 'error' : ''}
                {...register('address.zipCode', {
                  required: 'ZIP code is required',
                })}
              />
              {errors.address?.zipCode && <ErrorText>{errors.address.zipCode.message}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="country">Country</Label>
              <Select
                id="country"
                className={errors.address?.country ? 'error' : ''}
                {...register('address.country', {
                  required: 'Country is required',
                })}
              >
                <option value="">Select country</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Other">Other</option>
              </Select>
              {errors.address?.country && <ErrorText>{errors.address.country.message}</ErrorText>}
            </FormGroup>
          </FormRow>

          {/* Hidden field for coordinates */}
          <input type="hidden" {...register('address.location.coordinates')} />

          <RegisterButton type="button" onClick={useMyLocation} disabled={locating} style={{ background: '#10b981' }}>
            {locating ? 'Detecting location...' : 'Use my location'}
          </RegisterButton>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
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

          <RegisterButton type="submit" disabled={isLoading || !isValid}>
            {isLoading ? (
              <>
                <div className="loading" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </RegisterButton>

          <Divider>
            <span>or</span>
          </Divider>

          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Already have an account?{' '}
            </span>
            <LinkText to="/login">Sign in here</LinkText>
          </div>
        </Form>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
