import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Building, MapPin, Settings, Save, Edit3 } from 'lucide-react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfileContainer = styled.div`
  min-height: calc(100vh - 4rem);
  background: #f8fafc;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContentSection = styled.section`
  padding: 4rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const ProfileAvatar = styled.div`
  width: 8rem;
  height: 8rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
`;

const ProfileName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const ProfileRole = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  text-transform: capitalize;
`;

const ProfileStats = styled.div`
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StatLabel = styled.span`
  color: #64748b;
  font-size: 0.875rem;
`;

const StatValue = styled.span`
  color: #1e293b;
  font-weight: 600;
  font-size: 0.875rem;
`;

const MainContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
  }
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

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #f8fafc;
    color: #6b7280;
  }

  &.error {
    border-color: #ef4444;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #f8fafc;
    color: #6b7280;
  }

  &.error {
    border-color: #ef4444;
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: fit-content;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      businessName: user?.businessName || '',
      businessType: user?.businessType || '',
      address: {
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
      }
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>My Profile</HeroTitle>
          <HeroSubtitle>
            Manage your account information and preferences.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Content Section */}
      <ContentSection>
        <Container>
          <ProfileGrid>
            {/* Sidebar */}
            <Sidebar>
              <ProfileAvatar>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </ProfileAvatar>
              <ProfileName>
                {user.firstName} {user.lastName}
              </ProfileName>
              <ProfileRole>{user.userType}</ProfileRole>
              
              <ProfileStats>
                <StatItem>
                  <StatLabel>Loyalty Points</StatLabel>
                  <StatValue>{user.loyaltyPoints || 0}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Tier</StatLabel>
                  <StatValue>{user.loyaltyTier || 'Bronze'}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Email Verified</StatLabel>
                  <StatValue>{user.isEmailVerified ? 'Yes' : 'No'}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Phone Verified</StatLabel>
                  <StatValue>{user.isPhoneVerified ? 'Yes' : 'No'}</StatValue>
                </StatItem>
              </ProfileStats>
            </Sidebar>

            {/* Main Content */}
            <MainContent>
              <SectionHeader>
                <SectionTitle>Profile Information</SectionTitle>
                {!isEditing && (
                  <EditButton onClick={handleEdit}>
                    <Edit3 size={16} />
                    Edit Profile
                  </EditButton>
                )}
              </SectionHeader>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      disabled={!isEditing}
                      className={errors.firstName ? 'error' : ''}
                      {...register('firstName', {
                        required: 'First name is required',
                        minLength: {
                          value: 2,
                          message: 'First name must be at least 2 characters',
                        },
                      })}
                    />
                    {errors.firstName && <ErrorText>{errors.firstName.message}</ErrorText>}
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      disabled={!isEditing}
                      className={errors.lastName ? 'error' : ''}
                      {...register('lastName', {
                        required: 'Last name is required',
                        minLength: {
                          value: 2,
                          message: 'Last name must be at least 2 characters',
                        },
                      })}
                    />
                    {errors.lastName && <ErrorText>{errors.lastName.message}</ErrorText>}
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    disabled
                    value={user.email}
                  />
                  <ErrorText>Email cannot be changed. Contact support if needed.</ErrorText>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    disabled={!isEditing}
                    className={errors.phone ? 'error' : ''}
                    {...register('phone', {
                      pattern: {
                        value: /^\+?[\d\s-()]+$/,
                        message: 'Invalid phone number',
                      },
                    })}
                  />
                  {errors.phone && <ErrorText>{errors.phone.message}</ErrorText>}
                </FormGroup>

                {(user.userType === 'retailer' || user.userType === 'distributor') && (
                  <>
                    <FormGroup>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        type="text"
                        disabled={!isEditing}
                        className={errors.businessName ? 'error' : ''}
                        {...register('businessName', {
                          minLength: {
                            value: 2,
                            message: 'Business name must be at least 2 characters',
                          },
                        })}
                      />
                      {errors.businessName && <ErrorText>{errors.businessName.message}</ErrorText>}
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select
                        id="businessType"
                        disabled={!isEditing}
                        className={errors.businessType ? 'error' : ''}
                        {...register('businessType')}
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
                  </>
                )}

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      disabled={!isEditing}
                      className={errors.address?.city ? 'error' : ''}
                      {...register('address.city', {
                        minLength: {
                          value: 2,
                          message: 'City must be at least 2 characters',
                        },
                      })}
                    />
                    {errors.address?.city && <ErrorText>{errors.address.city.message}</ErrorText>}
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      type="text"
                      disabled={!isEditing}
                      className={errors.address?.state ? 'error' : ''}
                      {...register('address.state', {
                        minLength: {
                          value: 2,
                          message: 'State must be at least 2 characters',
                        },
                      })}
                    />
                    {errors.address?.state && <ErrorText>{errors.address.state.message}</ErrorText>}
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    type="text"
                    disabled={!isEditing}
                    className={errors.address?.zipCode ? 'error' : ''}
                    {...register('address.zipCode', {
                      minLength: {
                        value: 5,
                        message: 'ZIP code must be at least 5 characters',
                      },
                    })}
                  />
                  {errors.address?.zipCode && <ErrorText>{errors.address.zipCode.message}</ErrorText>}
                </FormGroup>

                {isEditing && (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <SaveButton type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="loading" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </SaveButton>
                    <button
                      type="button"
                      onClick={handleCancel}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#f1f5f9',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        color: '#374151',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </Form>
            </MainContent>
          </ProfileGrid>
        </Container>
      </ContentSection>
    </ProfileContainer>
  );
};

export default Profile;
