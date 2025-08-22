# ViuWi Email Templates for Supabase

This directory contains professionally designed email templates for ViuWi's authentication system, optimized for Supabase Auth integration. All templates are localized in Bahasa Indonesia and feature the updated ViuWi brand identity focused on AI chatbot automation.

## 📧 Available Templates

### 1. Account Confirmation (`confirmation.html`)
- **Purpose**: Selamat datang pengguna baru dan konfirmasi pembuatan akun
- **Trigger**: Pendaftaran pengguna
- **Key Features**: Pesan selamat datang, info akses dashboard, panduan onboarding

### 2. Magic Link Login (`magic_link.html`)
- **Purpose**: Autentikasi tanpa kata sandi
- **Trigger**: Permintaan login magic link
- **Key Features**: Login aman, pesan akses cepat, informasi keamanan

### 3. Password Recovery (`recovery.html`)
- **Purpose**: Fungsi reset kata sandi
- **Trigger**: Permintaan reset kata sandi
- **Key Features**: Peringatan keamanan, tips kata sandi, peringatan akses tidak sah

### 4. Team Invitation (`invite.html`)
- **Purpose**: Mengundang pengguna untuk bergabung dengan workspace
- **Trigger**: Undangan anggota tim
- **Key Features**: Detail undangan, gambaran fitur, panduan memulai

### 5. Email Change Confirmation (`email_change.html`)
- **Purpose**: Verifikasi alamat email baru
- **Trigger**: Permintaan perubahan alamat email
- **Key Features**: Verifikasi perubahan, pemberitahuan keamanan, informasi dukungan

## 🎨 Design Features

- **Brand Consistency**: ViuWi red (#FF002E) primary color - Updated 2025
- **Apple-Style Design**: 24px rounded corners throughout
- **Typography**: Nunito Sans font family with fallbacks
- **Responsive**: Mobile-optimized with 600px max width
- **Accessibility**: High contrast, semantic HTML structure
- **Email Client Compatible**: Table-based layout, inline CSS
- **Localization**: Full Bahasa Indonesia content
- **Brand Message**: "Automasi bisnis dengan ViuWi" - AI chatbot focus

## 🔧 Supabase Integration

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Select the template type you want to customize

### Step 2: Copy Template Content
1. Open the corresponding `.html` file from this directory
2. Copy the entire HTML content (Updated 2025 - Bahasa Indonesia)
3. Paste it into the Supabase template editor
4. Save the changes

### Step 3: Configure Variables
Ensure your Supabase project has the following variables configured:

#### Required Supabase Variables
```
{{ .ConfirmationURL }}  - Auto-generated confirmation/action URL
{{ .Email }}            - User's email address
{{ .SiteURL }}          - Your application's URL
{{ .InvitedByEmail }}   - Email of user who sent invitation (invite template)
{{ .NewEmail }}         - New email address (email change template)
{{ .RequestedAt }}      - Timestamp of request (email change template)
```

## 📋 Template-Specific Configuration

### Confirmation Template
- **Supabase Setting**: Sign up confirmation
- **Variables Used**: `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .SiteURL }}`
- **Redirect**: Should redirect to `/dashboard` after confirmation
- **Language**: Bahasa Indonesia - "Selamat Datang di ViuWi"

### Magic Link Template
- **Supabase Setting**: Magic link
- **Variables Used**: `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .SiteURL }}`
- **Redirect**: Should redirect to `/dashboard` after login
- **Language**: Bahasa Indonesia - "Masuk ke ViuWi"

### Recovery Template
- **Supabase Setting**: Password recovery
- **Variables Used**: `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .SiteURL }}`
- **Redirect**: Should redirect to password reset form
- **Language**: Bahasa Indonesia - "Reset Kata Sandi Anda"

### Invite Template
- **Supabase Setting**: User invitation
- **Variables Used**: `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .InvitedByEmail }}`, `{{ .SiteURL }}`
- **Redirect**: Should redirect to registration/onboarding flow
- **Language**: Bahasa Indonesia - "Anda Diundang ke ViuWi"

### Email Change Template
- **Supabase Setting**: Email change confirmation
- **Variables Used**: `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .NewEmail }}`, `{{ .RequestedAt }}`, `{{ .SiteURL }}`
- **Redirect**: Should redirect to account settings
- **Language**: Bahasa Indonesia - "Konfirmasi Perubahan Email"

## 🚀 Deployment Checklist

- [ ] Copy each template to corresponding Supabase email template section
- [ ] Verify all Supabase variables are properly configured
- [ ] Test email delivery in development environment
- [ ] Confirm redirect URLs point to correct application routes
- [ ] Test templates across different email clients (Gmail, Outlook, Apple Mail)
- [ ] Verify Bahasa Indonesia content displays correctly
- [ ] Confirm new brand color (#FF002E) renders properly
- [ ] Test "Automasi bisnis dengan ViuWi" tagline visibility

## 📅 Version History

### 2025 Update
- ✅ Localized all content to Bahasa Indonesia
- ✅ Updated brand color from #FF6B35 to #FF002E
- ✅ Changed tagline to "Automasi bisnis dengan ViuWi"
- ✅ Updated copyright year to 2025
- ✅ Enhanced AI chatbot automation messaging

---

© 2025 ViuWi. All rights reserved. | Automasi bisnis dengan ViuWi
- [ ] Verify mobile responsiveness
- [ ] Check spam folder delivery
- [ ] Validate all links work correctly

## 🎯 Customization Guidelines

### Brand Colors
- **Primary Red**: `#FF002E` (ViuWi brand color)
- **Light Red**: `#fef2f2` (background accents)
- **Dark Red**: `#dc2626` (hover states)
- **Text Colors**: `#1e293b` (headings), `#475569` (body), `#64748b` (muted)

### Typography Scale
- **H1 (Logo)**: 32px, font-weight: 700
- **H2 (Main Heading)**: 24px, font-weight: 600
- **H3 (Section Heading)**: 18px, font-weight: 600
- **Body Text**: 16px, font-weight: 400
- **Small Text**: 14px, font-weight: 400
- **Footer Text**: 12px, font-weight: 400

### Spacing System
- **Border Radius**: 24px (Apple-style rounded corners)
- **Container Padding**: 40px desktop, 20px mobile
- **Section Spacing**: 32px between major sections
- **Text Spacing**: 20px between paragraphs

## 🔍 Testing Recommendations

### Email Client Testing
- **Desktop**: Gmail, Outlook, Apple Mail, Thunderbird
- **Mobile**: iOS Mail, Gmail App, Outlook Mobile
- **Webmail**: Gmail Web, Outlook Web, Yahoo Mail

### Functionality Testing
- Verify all confirmation links work
- Test email delivery speed
- Check spam folder placement
- Validate mobile responsiveness
- Confirm brand consistency

## 📞 Support

For questions about these email templates or Supabase integration:

1. **Template Issues**: Check this README and template comments
2. **Supabase Configuration**: Refer to [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
3. **Design Questions**: Follow ViuWi brand guidelines in `/docs/DAISYUI_STYLE_GUIDE.md`

## 📝 Version History

- **v1.0.0**: Initial release with 5 core authentication templates
- **Features**: ViuWi branding, mobile responsive, Supabase compatible
- **Design**: Apple-style rounded corners, brand orange color scheme

---

**Note**: These templates are specifically designed for ViuWi's business intelligence platform and follow the established design system documented in the project's UI guidelines.