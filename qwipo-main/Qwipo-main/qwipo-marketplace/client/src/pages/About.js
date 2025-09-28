import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Award, Globe, Zap, Shield, Heart, TrendingUp } from 'lucide-react';
import styled from 'styled-components';

const AboutContainer = styled.div`
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

const Section = styled.section`
  padding: 4rem 0;
  background: white;
`;

const SectionAlt = styled.section`
  padding: 4rem 0;
  background: #f8fafc;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #1e293b;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  text-align: center;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const CardIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: #3b82f6;
  color: white;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
`;

const CardDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const StatItem = styled.div`
  h3 {
    font-size: 3rem;
    font-weight: 700;
    color: #3b82f6;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.125rem;
    color: #64748b;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const TeamMember = styled.div`
  text-align: center;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const TeamAvatar = styled.div`
  width: 6rem;
  height: 6rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
`;

const TeamName = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
`;

const TeamRole = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const TeamBio = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  margin: 0 auto;
  display: block;
  width: fit-content;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
  }
`;

const About = () => {
  return (
    <AboutContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>About Qwipo Marketplace</HeroTitle>
          <HeroSubtitle>
            We're revolutionizing the way retailers and distributors connect, 
            powered by cutting-edge AI technology and a commitment to excellence.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Mission Section */}
      <Section>
        <Container>
          <SectionTitle>Our Mission</SectionTitle>
          <SectionSubtitle>
            To create the most intelligent and efficient marketplace that empowers 
            businesses to grow, connect, and succeed in the digital economy.
          </SectionSubtitle>
          
          <Grid>
            <Card>
              <CardIcon>
                <Target size={24} />
              </CardIcon>
              <CardTitle>Empowerment</CardTitle>
              <CardDescription>
                We empower retailers and distributors with AI-driven insights, 
                smart recommendations, and seamless business connections.
              </CardDescription>
            </Card>

            <Card>
              <CardIcon>
                <Zap size={24} />
              </CardIcon>
              <CardTitle>Innovation</CardTitle>
              <CardDescription>
                Our cutting-edge AI technology provides intelligent search, 
                personalized recommendations, and predictive analytics.
              </CardDescription>
            </Card>

            <Card>
              <CardIcon>
                <Heart size={24} />
              </CardIcon>
              <CardTitle>Community</CardTitle>
              <CardDescription>
                We foster a thriving community where businesses can grow together, 
                share knowledge, and build lasting partnerships.
              </CardDescription>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Stats Section */}
      <SectionAlt>
        <Container>
          <SectionTitle>Our Impact</SectionTitle>
          <StatsGrid>
            <StatItem>
              <h3>10,000+</h3>
              <p>Active Retailers</p>
            </StatItem>
            <StatItem>
              <h3>1,000+</h3>
              <p>Concurrent Users</p>
            </StatItem>
            <StatItem>
              <h3>99.9%</h3>
              <p>Uptime</p>
            </StatItem>
            <StatItem>
              <h3>&lt;200ms</h3>
              <p>API Response Time</p>
            </StatItem>
          </StatsGrid>
        </Container>
      </SectionAlt>

      {/* Features Section */}
      <Section>
        <Container>
          <SectionTitle>What Makes Us Different</SectionTitle>
          <Grid>
            <Card>
              <CardIcon>
                <TrendingUp size={24} />
              </CardIcon>
              <CardTitle>AI-Powered Intelligence</CardTitle>
              <CardDescription>
                Our advanced machine learning algorithms provide personalized 
                recommendations, smart search, and predictive analytics to help 
                you make better business decisions.
              </CardDescription>
            </Card>

            <Card>
              <CardIcon>
                <Shield size={24} />
              </CardIcon>
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription>
                Bank-level security with 99.9% uptime guarantee ensures your 
                business operations are always protected and available.
              </CardDescription>
            </Card>

            <Card>
              <CardIcon>
                <Globe size={24} />
              </CardIcon>
              <CardTitle>Global Reach</CardTitle>
              <CardDescription>
                Connect with distributors and retailers worldwide, expanding 
                your market reach and business opportunities.
              </CardDescription>
            </Card>

            <Card>
              <CardIcon>
                <Users size={24} />
              </CardIcon>
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>
                Join a vibrant community of like-minded businesses, share 
                experiences, and grow together in the digital marketplace.
              </CardDescription>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Team Section */}
      <SectionAlt>
        <Container>
          <SectionTitle>Meet Our Team</SectionTitle>
          <SectionSubtitle>
            The passionate individuals behind Qwipo Marketplace
          </SectionSubtitle>
          
          <TeamGrid>
            <TeamMember>
              <TeamAvatar>AR</TeamAvatar>
              <TeamName>Alex Rodriguez</TeamName>
              <TeamRole>CEO & Founder</TeamRole>
              <TeamBio>
                Visionary leader with 15+ years in e-commerce and AI technology. 
                Passionate about revolutionizing business connections.
              </TeamBio>
            </TeamMember>

            <TeamMember>
              <TeamAvatar>SM</TeamAvatar>
              <TeamName>Sarah Mitchell</TeamName>
              <TeamRole>CTO</TeamRole>
              <TeamBio>
                AI and machine learning expert with a PhD in Computer Science. 
                Leads our technical innovation and product development.
              </TeamBio>
            </TeamMember>

            <TeamMember>
              <TeamAvatar>DJ</TeamAvatar>
              <TeamName>David Johnson</TeamName>
              <TeamRole>Head of Product</TeamRole>
              <TeamBio>
                Product strategist with deep experience in marketplace platforms. 
                Focuses on user experience and business growth.
              </TeamBio>
            </TeamMember>

            <TeamMember>
              <TeamAvatar>LC</TeamAvatar>
              <TeamName>Lisa Chen</TeamName>
              <TeamRole>Head of Operations</TeamRole>
              <TeamBio>
                Operations expert ensuring smooth platform performance and 
                customer satisfaction across all touchpoints.
              </TeamBio>
            </TeamMember>
          </TeamGrid>
        </Container>
      </SectionAlt>

      {/* CTA Section */}
      <Section>
        <Container>
          <SectionTitle>Ready to Get Started?</SectionTitle>
          <SectionSubtitle>
            Join thousands of businesses already growing with Qwipo Marketplace
          </SectionSubtitle>
          <CTAButton to="/register">
            Start Your Journey
          </CTAButton>
        </Container>
      </Section>
    </AboutContainer>
  );
};

export default About;
