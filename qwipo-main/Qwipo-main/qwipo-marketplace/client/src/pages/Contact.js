import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import styled from 'styled-components';
import toast from 'react-hot-toast';

const ContactContainer = styled.div`
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

const ContactSection = styled.section`
  padding: 4rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled.div`
  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #1e293b;
  }

  p {
    color: #64748b;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
`;

const ContactCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const ContactCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ContactIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: #3b82f6;
  color: white;
  border-radius: 0.75rem;
`;

const ContactCardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const ContactCardContent = styled.div`
  color: #64748b;
  line-height: 1.6;
`;

const ContactForm = styled.form`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1e293b;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input`
  width: 100%;
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

  &.error {
    border-color: #ef4444;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  min-height: 120px;
  resize: vertical;
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

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &.error {
    border-color: #ef4444;
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
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

const FAQSection = styled.section`
  padding: 4rem 0;
  background: white;
`;

const FAQContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FAQTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #1e293b;
`;

const FAQItem = styled.div`
  margin-bottom: 1.5rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

const FAQQuestion = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const FAQAnswer = styled.p`
  color: #64748b;
  line-height: 1.6;
  margin: 0;
`;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Contact form data:', data);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Get in Touch</HeroTitle>
          <HeroSubtitle>
            Have questions? We're here to help. Reach out to our team and 
            we'll get back to you as soon as possible.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Contact Section */}
      <ContactSection>
        <Container>
          <ContactGrid>
            <ContactInfo>
              <h2>Contact Information</h2>
              <p>
                We're always happy to hear from our users. Whether you have 
                questions, feedback, or need support, we're here to help.
              </p>

              <ContactCard>
                <ContactCardHeader>
                  <ContactIcon>
                    <Mail size={20} />
                  </ContactIcon>
                  <ContactCardTitle>Email Us</ContactCardTitle>
                </ContactCardHeader>
                <ContactCardContent>
                  <p>support@qwipo-marketplace.com</p>
                  <p>business@qwipo-marketplace.com</p>
                  <p>We typically respond within 24 hours</p>
                </ContactCardContent>
              </ContactCard>

              <ContactCard>
                <ContactCardHeader>
                  <ContactIcon>
                    <Phone size={20} />
                  </ContactIcon>
                  <ContactCardTitle>Call Us</ContactCardTitle>
                </ContactCardHeader>
                <ContactCardContent>
                  <p>+1 (555) 123-4567</p>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                </ContactCardContent>
              </ContactCard>

              <ContactCard>
                <ContactCardHeader>
                  <ContactIcon>
                    <MapPin size={20} />
                  </ContactIcon>
                  <ContactCardTitle>Visit Us</ContactCardTitle>
                </ContactCardHeader>
                <ContactCardContent>
                  <p>123 Business District</p>
                  <p>Tech City, TC 12345</p>
                  <p>United States</p>
                </ContactCardContent>
              </ContactCard>

              <ContactCard>
                <ContactCardHeader>
                  <ContactIcon>
                    <Clock size={20} />
                  </ContactIcon>
                  <ContactCardTitle>Business Hours</ContactCardTitle>
                </ContactCardHeader>
                <ContactCardContent>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </ContactCardContent>
              </ContactCard>
            </ContactInfo>

            <ContactForm onSubmit={handleSubmit(onSubmit)}>
              <FormTitle>Send us a Message</FormTitle>
              
              <FormGroup>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className={errors.name ? 'error' : ''}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                />
                {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="email">Email Address *</Label>
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
                  {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone"
                    {...register('phone')}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  id="subject"
                  className={errors.subject ? 'error' : ''}
                  {...register('subject', {
                    required: 'Subject is required',
                  })}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="business">Business Partnership</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </Select>
                {errors.subject && <ErrorText>{errors.subject.message}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="message">Message *</Label>
                <TextArea
                  id="message"
                  placeholder="Tell us how we can help you..."
                  className={errors.message ? 'error' : ''}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters',
                    },
                  })}
                />
                {errors.message && <ErrorText>{errors.message.message}</ErrorText>}
              </FormGroup>

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="loading" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </SubmitButton>
            </ContactForm>
          </ContactGrid>
        </Container>
      </ContactSection>

      {/* FAQ Section */}
      <FAQSection>
        <FAQContainer>
          <FAQTitle>Frequently Asked Questions</FAQTitle>
          
          <FAQItem>
            <FAQQuestion>How do I get started with Qwipo Marketplace?</FAQQuestion>
            <FAQAnswer>
              Simply create an account by clicking the "Sign Up" button, choose your account type 
              (Retailer, Distributor, or Admin), and complete your profile. You'll be ready to 
              start exploring and connecting with other businesses in minutes.
            </FAQAnswer>
          </FAQItem>

          <FAQItem>
            <FAQQuestion>What makes Qwipo different from other marketplaces?</FAQQuestion>
            <FAQAnswer>
              Qwipo uses advanced AI technology to provide personalized recommendations, intelligent 
              search capabilities, and predictive analytics. We also offer a comprehensive loyalty 
              program and real-time communication features to enhance your business experience.
            </FAQAnswer>
          </FAQItem>

          <FAQItem>
            <FAQQuestion>Is there a cost to use Qwipo Marketplace?</FAQQuestion>
            <FAQAnswer>
              We offer both free and premium plans. The free plan includes basic features and access 
              to the marketplace. Premium plans offer advanced AI features, priority support, and 
              additional business tools. Contact our sales team for detailed pricing information.
            </FAQAnswer>
          </FAQItem>

          <FAQItem>
            <FAQQuestion>How secure is my business data?</FAQQuestion>
            <FAQAnswer>
              Security is our top priority. We use enterprise-grade encryption, secure data storage, 
              and follow industry best practices to protect your information. We're also compliant 
              with major data protection regulations.
            </FAQAnswer>
          </FAQItem>

          <FAQItem>
            <FAQQuestion>Can I integrate Qwipo with my existing systems?</FAQQuestion>
            <FAQAnswer>
              Yes! We provide comprehensive APIs and integration tools that allow you to connect 
              Qwipo with your existing inventory management, CRM, and other business systems. 
              Our technical team can help you set up these integrations.
            </FAQAnswer>
          </FAQItem>

          <FAQItem>
            <FAQQuestion>What kind of support do you offer?</FAQQuestion>
            <FAQAnswer>
              We offer 24/7 customer support through multiple channels including email, phone, and 
              live chat. Premium users get priority support and dedicated account managers. We also 
              provide comprehensive documentation and training resources.
            </FAQAnswer>
          </FAQItem>
        </FAQContainer>
      </FAQSection>
    </ContactContainer>
  );
};

export default Contact;
