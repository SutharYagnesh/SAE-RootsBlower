# SAE Roots Blower Website Redesign (Next.js)

## Project Overview

Redesign the existing website:

https://saerootsblower.com/

This is NOT a completely new design.

The objective is to modernize the UI while maintaining the existing branding and industrial identity.

Use all existing product images and content from the current website wherever possible.

Only make minimal design improvements with a premium professional look.

---

# Tech Stack

Frontend

- Next.js (Latest)
- JavaScript (NOT TypeScript)
- App Router
- Tailwind CSS
- Framer Motion
- React Icons
- Swiper.js

Backend

- Next.js API Routes
- MongoDB
- Mongoose

Authentication

- JWT Authentication
- bcrypt password hashing

Image Storage

Store all uploaded images as Base64 strings inside MongoDB.

Do NOT use Cloudinary or AWS.

---

# Design Theme

Create a modern industrial premium design.

Style should look similar to premium engineering companies.

Use rounded cards, clean spacing, modern typography and smooth animations.

Do NOT make the website colorful.

Industrial style only.

---

# Color Palette

Primary
#0D3B66

Secondary
#1B5E20

Accent
#F5A623

Background
#F7F9FC

Dark
#1A1A1A

Light
#FFFFFF

Borders
#E5E7EB

Buttons should use blue with orange hover effects.

---

# Typography

Headings

Poppins Bold

Content

Inter

Buttons

Semi Bold

---

# Logo Redesign

Current Logo

https://saerootsblower.com/images/sae-logo.webp

Redesign Requirements

Keep:

- SAE text
- Industrial identity
- Blower theme

Improve:

- cleaner icon
- flat design
- modern typography
- SVG logo
- favicon
- horizontal logo
- square logo
- monochrome version
- dark mode version
- white version

---

# Website Pages

Home

Hero Section

Company Introduction

About

Products

Applications

Industries Served

Why Choose Us

Statistics

Certificates

Gallery

Testimonials

Contact Form

Google Map

Footer

---

About

Company Story

Mission

Vision

Infrastructure

Manufacturing

Quality

---

Products

Dynamic Products

Each Product contains

Title

Slug

Short Description

Long Description

Specifications

Features

Applications

Images

SEO Title

SEO Description

Status

Created Date

Updated Date

---

Product Details Page

Large Images

Gallery

Specifications Table

Applications

Related Products

Inquiry Form

---

Applications

Dynamic Categories

Application Detail Pages

---

Gallery

Image Gallery

Video Gallery

Filters

Lightbox

---

Blogs

Dynamic Blog

Blog Listing

Blog Details

Categories

Tags

Search

Recent Posts

Related Blogs

Share Buttons

---

Contact

Contact Form

Google Map

WhatsApp Button

Call Button

Email Button

---

Admin Panel

Create a complete admin dashboard.

Dashboard

Products

Blogs

Gallery

Categories

Applications

Users

Messages

Settings

SEO

---

Dashboard Features

Login

Logout

JWT Authentication

Protected Routes

Statistics

Recent Activities

---

Product Management

Add Product

Edit Product

Delete Product

Upload Images

Store Images as Base64

Draft

Publish

Search

Pagination

---

Blog Management

Rich Text Editor

Image Upload

SEO

Categories

Tags

Draft

Publish

Featured Image

Store images as Base64

---

Gallery Management

Upload Images

Delete

Categories

Store Base64

---

Contact Messages

View

Delete

Mark Read

---

Settings

Company Name

Address

Phone

Email

Social Links

Logo Upload

Favicon Upload

Meta Tags

Google Analytics

---

Database Collections

users

products

blogs

gallery

applications

categories

messages

settings

---

Product Schema

title

slug

description

longDescription

specifications

features

applications

images (Base64)

status

createdAt

updatedAt

---

Blog Schema

title

slug

content

excerpt

featuredImage (Base64)

category

tags

seoTitle

seoDescription

status

createdAt

updatedAt

---

SEO

Generate

robots.txt

sitemap.xml

OpenGraph

Twitter Cards

Dynamic Meta Tags

Canonical URLs

JSON-LD Schema

---

Performance

Lazy Loading

Image Optimization

Code Splitting

Server Components

Dynamic Metadata

ISR

---

Animations

Fade Up

Fade In

Slide

Counter

Hover Effects

Smooth Page Transition

---

Responsive

Desktop

Laptop

Tablet

Mobile

---

Extra Features

Sticky Navbar

Scroll To Top

WhatsApp Floating Button

Call Floating Button

Loading Skeleton

404 Page

500 Page

Search

Breadcrumb

Newsletter

Dark Mode (optional)

---

Folder Structure

app/

components/

lib/

models/

api/

hooks/

utils/

public/

styles/

---

Deliverables

- Complete Next.js project
- JavaScript only
- Tailwind CSS
- MongoDB
- Mongoose
- Fully responsive
- Admin Dashboard
- Blog CMS
- Product CMS
- Base64 Image Storage
- JWT Authentication
- SEO Optimized
- Modern Industrial UI
- Reuse content and images from the existing website where appropriate while giving the site a cleaner, faster, and more professional appearance.