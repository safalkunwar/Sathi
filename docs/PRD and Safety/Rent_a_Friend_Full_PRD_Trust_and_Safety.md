# Rent-a-Friend Platform PRD

## Trust & Safety, Marketplace Governance & System Architecture

> Version 1.0

## Table of Contents

1.  Vision
2.  Principles
3.  User Roles
4.  Verification System
5.  Booking Lifecycle
6.  Safety Architecture
7.  GPS Tracking
8.  Communication Controls
9.  Escrow & Payments
10. Guide Policies
11. Seeker Policies
12. Cancellation Matrix
13. Reviews
14. Disputes
15. Moderation
16. Risk Scoring
17. Incident Response
18. Admin Dashboard
19. Database Schema
20. API Overview
21. State Machine
22. Notifications
23. Privacy & Retention
24. KPIs
25. Rollout Roadmap

# 1. Vision

Build the safest marketplace for travelers to book verified local
companions for public, platonic cultural experiences.

# 2. Core Principles

-   Safety first
-   Identity before access
-   Public meetings only
-   Evidence-based enforcement
-   Fairness for both sides

# 3. User Roles

-   Seeker
-   Guide
-   Admin
-   Safety Moderator
-   Support Agent

# 4. Verification

## Guide

-   Government ID
-   Liveness
-   Phone/email
-   Payment account
-   Emergency contact
-   Background screening (where available)
-   Periodic reverification

## Seeker

-   Government ID
-   Liveness
-   Phone/email
-   Payment verification

# 5. Booking Lifecycle

Search → Request → Accept → Escrow → PIN Generated → Meet → PIN
Verification → GPS Active → Booking Active → Complete → Reviews → Payout

# 6. Safety Architecture

-   Mandatory KYC
-   4-digit check-in PIN
-   Guide GPS auto-enabled
-   Optional Seeker GPS
-   SOS button
-   Immutable audit log
-   Safe meeting recommendations
-   Group registration with attendee names and numbers

# 7. GPS Rules

-   Auto start after PIN verification
-   Warning if disabled
-   Escalation after grace period
-   Stop automatically on completion

# 8. Communication Controls

-   In-app messaging only
-   Detect/block contact sharing
-   Detect/block payment links
-   Report abuse tools

# 9. Escrow

Seeker pays platform → funds held → completion → payout.

# 10. Guide Policies

-   Public places only
-   No hotel rooms/private homes
-   No romance/escort services
-   No off-platform payments
-   Group variance rejection allowed
-   Professional conduct
-   No illegal activity

# 11. Seeker Policies

-   Respect guide
-   Register all attendees
-   Pay agreed activity expenses
-   No demand for private transport
-   No harassment
-   No off-platform bookings

# 12. Cancellation Matrix

  Window          Refund                                  Guide
  --------------- --------------------------------------- ------------------
  \>48h           Full                                    None
  24-48h          Partial                                 Partial
  \<24h           No refund except approved emergencies   Full/substantial
  Guide cancels   Full refund                             Penalty

# 13. Reviews

Blind two-way review with fraud detection.

# 14. Disputes

Evidence: - GPS - Chat - PIN - Timeline - Images (where appropriate)

Appeal supported.

# 15. Moderation Dashboard

-   Incident queue
-   GPS timeline
-   Chat review
-   Risk score
-   Suspension tools
-   Audit history

# 16. Risk Score

Inputs: - Verification - Ratings - Cancellations - Disputes -
Violations - Completion rate

# 17. Incident Response

1.  Report
2.  Preserve evidence
3.  Safety review
4.  Decision
5.  Appeal

# 18. Admin Dashboard Modules

-   Users
-   Bookings
-   Payments
-   Reviews
-   Safety
-   Analytics
-   Disputes

# 19. Database Schema

Users, Guides, Seekers, Bookings, BookingAttendees, GPSLogs,
ChatMessages, Reviews, Payments, Disputes, Incidents, Notifications,
AuditLogs.

# 20. API Overview

/auth /users /guides /bookings /payments /chat /reviews /disputes /admin

# 21. Booking State Machine

Draft → Requested → Accepted → Paid → PIN Generated → Checked In →
Active → Completed → Reviewed → Closed.

# 22. Notifications

-   Booking updates
-   GPS disabled
-   SOS
-   Review reminder
-   Payment released

# 23. Privacy

-   Encryption at rest
-   Role-based access
-   Data retention schedule
-   Consent for optional recordings

# 24. KPIs

-   Completion rate
-   Safety incidents
-   Cancellation rate
-   Average rating
-   Response time
-   Dispute resolution SLA

# 25. Rollout Roadmap

Phase 1: Core booking + KYC Phase 2: GPS + moderation Phase 3: Trust
score + analytics Phase 4: Advanced safety tooling
