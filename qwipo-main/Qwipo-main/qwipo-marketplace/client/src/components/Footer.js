import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight,
  Shield,
  Award,
  Truck,
  Headphones,
  CreditCard,
  Clock,
} from 'lucide-react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: #1f2937;
  color: #f9fafb;
  margin-top: auto;
  position: relative;
`;

const FooterContent = styled.div`
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-16) var(--space-4) var(--space-8);
  z-index: 1;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-16);
  margin-bottom: var(--space-16);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
`;

const BrandSection = styled.div`
  max-width: 400px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: white;
  text-decoration: none;
  margin-bottom: var(--space-6);
  transition: all 0.2s ease;
  
  &:hover {
    color: #3b82f6;
  }
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #3b82f6;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: var(--font-size-xl);
`;

const BrandDescription = styled.p`
  font-size: var(--font-size-lg);
  line-height: 1.6;
  color: #d1d5db;
  margin-bottom: var(--space-8);
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: #d1d5db;
  font-size: var(--font-size-sm);
`;

const ContactIcon = styled.div`
  width: 20px;
  height: 20px;
  color: #3b82f6;
  flex-shrink: 0;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-6);
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: #374151;
  border-radius: var(--radius-lg);
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: #3b82f6;
    color: white;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-8);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: #374151;
  border-radius: var(--radius-xl);
  border: 1px solid #4b5563;
  transition: all 0.2s ease;
  
  &:hover {
    background: #4b5563;
  }
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #3b82f6;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const FeatureText = styled.div`
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: white;
`;

const FooterMain = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-8);
  margin-bottom: var(--space-16);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--space-6);
    color: white;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: var(--space-3);
  }
  
  a {
    color: var(--gray-300);
    text-decoration: none;
    font-size: var(--font-size-sm);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    
    &:hover {
      color: var(--primary-400);
      transform: translateX(4px);
    }
  }
`;

const NewsletterSection = styled.div`
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  text-align: center;
  margin-bottom: var(--space-16);
`;

const NewsletterTitle = styled.h3`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: white;
  margin-bottom: var(--space-4);
`;

const NewsletterDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--space-6);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: var(--space-4);
  max-width: 500px;
  margin: 0 auto;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: var(--space-4) var(--space-6);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.2);
  }
`;

const NewsletterButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  background: white;
  color: var(--primary-600);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--primary-50);
    transform: translateY(-1px);
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-8);
  border-top: 1px solid var(--gray-700);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-4);
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: var(--gray-400);
  font-size: var(--font-size-sm);
  margin: 0;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: var(--space-6);
  
  @media (max-width: 640px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const FooterLink = styled(Link)`
  color: var(--gray-400);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--primary-400);
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        {/* Top Section */}
        <FooterTop>
          <BrandSection>
            <Logo to="/">
              <LogoIcon>Q</LogoIcon>
              Qwipo
            </Logo>
            <BrandDescription>
              The ultimate B2B marketplace powered by AI. Connect with suppliers, 
              discover products, and grow your business with confidence.
            </BrandDescription>
            <ContactInfo>
              <ContactItem>
                <ContactIcon>
                  <Mail size={20} />
                </ContactIcon>
                support@qwipo.com
              </ContactItem>
              <ContactItem>
                <ContactIcon>
                  <Phone size={20} />
                </ContactIcon>
                +1 (555) 123-4567
              </ContactItem>
              <ContactItem>
                <ContactIcon>
                  <MapPin size={20} />
                </ContactIcon>
                123 Business St, City, State 12345
              </ContactItem>
            </ContactInfo>
            <SocialLinks>
              <SocialLink href="#" aria-label="Facebook">
                <Facebook size={20} />
              </SocialLink>
              <SocialLink href="#" aria-label="Twitter">
                <Twitter size={20} />
              </SocialLink>
              <SocialLink href="#" aria-label="Instagram">
                <Instagram size={20} />
              </SocialLink>
              <SocialLink href="#" aria-label="LinkedIn">
                <Linkedin size={20} />
              </SocialLink>
            </SocialLinks>
          </BrandSection>
          
          <FeaturesGrid>
            <FeatureItem>
              <FeatureIcon>
                <Shield size={20} />
              </FeatureIcon>
              <FeatureText>Secure Transactions</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>
                <Truck size={20} />
              </FeatureIcon>
              <FeatureText>Fast Delivery</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>
                <Award size={20} />
              </FeatureIcon>
              <FeatureText>Quality Guaranteed</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>
                <Headphones size={20} />
              </FeatureIcon>
              <FeatureText>24/7 Support</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>
                <CreditCard size={20} />
              </FeatureIcon>
              <FeatureText>Flexible Payment</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>
                <Clock size={20} />
              </FeatureIcon>
              <FeatureText>Quick Response</FeatureText>
            </FeatureItem>
          </FeaturesGrid>
        </FooterTop>

        {/* Newsletter */}
        <NewsletterSection>
          <NewsletterTitle>Stay Updated with Qwipo</NewsletterTitle>
          <NewsletterDescription>
            Get the latest product updates, exclusive offers, and business insights 
            delivered to your inbox.
          </NewsletterDescription>
          <NewsletterForm>
            <NewsletterInput
              type="email"
              placeholder="Enter your email address"
            />
            <NewsletterButton type="submit">
              Subscribe
              <ArrowRight size={16} />
            </NewsletterButton>
          </NewsletterForm>
        </NewsletterSection>

        {/* Main Footer Links */}
        <FooterMain>
          <FooterSection>
            <h3>Products</h3>
            <ul>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=electronics">Electronics</Link></li>
              <li><Link to="/products?category=grocery">Grocery</Link></li>
              <li><Link to="/products?category=clothing">Clothing</Link></li>
              <li><Link to="/products?category=pharmacy">Pharmacy</Link></li>
              <li><Link to="/products?category=general">General</Link></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Services</h3>
            <ul>
              <li><Link to="/recommendations">AI Recommendations</Link></li>
              <li><Link to="/loyalty">Loyalty Program</Link></li>
              <li><Link to="/search">Smart Search</Link></li>
              <li><Link to="/bundles">Product Bundles</Link></li>
              <li><Link to="/analytics">Business Analytics</Link></li>
              <li><Link to="/support">Customer Support</Link></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/partners">Partners</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Support</h3>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/warranty">Warranty</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Legal</h3>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
              <li><Link to="/gdpr">GDPR</Link></li>
              <li><Link to="/compliance">Compliance</Link></li>
              <li><Link to="/security">Security</Link></li>
            </ul>
          </FooterSection>
        </FooterMain>

        {/* Bottom Section */}
        <FooterBottom>
          <Copyright>
            © 2024 Qwipo Marketplace. All rights reserved. Built with ❤️ for businesses.
          </Copyright>
          <FooterLinks>
            <FooterLink to="/privacy">Privacy</FooterLink>
            <FooterLink to="/terms">Terms</FooterLink>
            <FooterLink to="/cookies">Cookies</FooterLink>
            <FooterLink to="/sitemap">Sitemap</FooterLink>
          </FooterLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;