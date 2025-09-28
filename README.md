1. Problem Statement :

Retailers on Qwipo’s B2B marketplace face significant challenges in product discovery, repetitive purchase behavior, and stagnant order values.

Poor Product Discovery → Retailers miss 60%+ of relevant products.

Repetitive Purchase Patterns → Limits cross-selling and upselling opportunities.

Stagnant Order Values (AOV) → Growth has plateaued.

Low Customer Retention → 35% of retailers become inactive within 6 months.

2. Detailed Proposal & Prototype Plan

We propose to build an AI-Powered Product Recommendation System for Qwipo’s B2B marketplace to:

Improve product discovery through smart search and personalized suggestions.

Increase Average Order Value (AOV) by 15–20% through intelligent recommendations.

Enhance repeat purchase rate by 25% by analyzing buying patterns.

Provide real-time updates (order tracking, delivery status) for a seamless experience.

Prototype Flow (Qwipo B2B Journey):

Discovery → NLP-based smart search for suppliers/products.

AI Recommendations → Collaborative + Content-based + Hybrid filtering.

Evaluation → Compare with current suppliers, check reviews.

Smart Cart → Add cross-sell & bulk discount suggestions.

Payment → Secure JWT authentication & confirmation.

Updates → Real-time order tracking with Socket.io.

3. Features to be Implemented

✅ User Behavior Analytics – Capture and analyze browsing/search patterns.
✅ Purchase Pattern Recognition – Identify seasonal trends, category preferences, and repeat cycles.
✅ Personalized Recommendations – Using Collaborative, Content-based, and Hybrid AI models.
✅ Smart Cart – Suggests bulk discounts, cross-sell/upsell items.
✅ Real-Time Updates – Socket.io for live delivery tracking and order status.
✅ Multi-Dashboard Support – Retailer, Distributor, and Admin panels.

4. Tech Stack Used

Frontend: React.js,CSS
Backend: Node.js (Express)
Database: MongoDB 
AI/ML Frameworks: TensorFlow.
API & Integration: WebSocket (Socket.io)
Authentication: JWT Auth


5. Contribution Details of Each Team Member
🔹 Member 1- Harshitha – Frontend (UI/UX Developer)

Built React.js dashboards (Retailer, Distributor, Admin).

Implemented React Router navigation.

Designed responsive UI with CSS.

Integrated frontend with backend APIs.
Deliverables: Discovery, Recommendations, Cart, Payment, Tracking pages.

🔹 Member 2-Kowshik – Backend & Database Engineer

Developed Node.js/Express backend services.

Built APIs for discovery, recommendations, cart, payments.

Implemented JWT Authentication.

Managed MongoDB/PostgreSQL database.
Deliverables: Secure backend with optimized queries (<200ms response).

🔹 Member 3-Pujitha – AI/ML Engineer (Recommendation System)

Built AI Recommendation Engine (Collaborative + Content-based + Hybrid).

Developed analytics for user behavior & seasonal trends.

Exposed ML outputs via APIs.
Deliverables: AI-driven recommendations, analytics feedback loop.

🔹 Member 4 –Thanuj-- System Integration & DevOps

Integrated frontend, backend, and AI modules.

Implemented real-time updates with Socket.io.

Deployed system on cloud with CI/CD pipeline.

Ensured scalability (10k+ users, 1000+ concurrent).
Deliverables: Cloud deployment, real-time order tracking, performance benchmarks.
