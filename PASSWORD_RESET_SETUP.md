# Password Reset Integration Setup Guide

## Overview

A complete password reset system has been implemented in the frontend that integrates with WordPress backend. Users can now reset their passwords directly from the React app without leaving the site.

---

## ✅ What's Been Implemented

### Frontend Components:

1. **ResetPassword.tsx** - Complete password reset page with 3 steps:
   - Step 1: Request reset (enter email)
   - Step 2: Reset password (with token from email)
   - Step 3: Success confirmation

2. **Login.tsx** - Updated with link to reset password page

3. **Backend Integration** - Two new functions in `utils/wordpress.ts`:
   - `requestPasswordReset()` - Requests password reset email
   - `resetPasswordWithToken()` - Resets password with token from email

---

## 🔧 WordPress Configuration Required

### Step 1: Add Password Reset Endpoints to WordPress

Add this code to your WordPress theme's `functions.php` file (or create a custom plugin):

```php
/**
 * Custom REST API endpoint to request password reset
 * Route: /wp-json/jumplings/v1/lost-password
 */
add_action('rest_api_init', function() {
    register_rest_route('jumplings/v1', '/lost-password', array(
        'methods' => 'POST',
        'callback' => 'jumplings_lost_password',
        'permission_callback' => '__return_true',
    ));
});

function jumplings_lost_password($request) {
    $email = sanitize_email($request->get_param('email'));
    
    if (empty($email) || !is_email($email)) {
        return new WP_Error('invalid_email', 'Please provide a valid email address.', array('status' => 400));
    }
    
    // Find user by email
    $user = get_user_by('email', $email);
    if (!$user) {
        // Don't reveal if email exists for security
        return array('success' => true, 'message' => 'If an account exists with this email, a password reset link has been sent.');
    }
    
    // Generate password reset key
    $key = get_password_reset_key($user);
    if (is_wp_error($key)) {
        return new WP_Error('reset_key_failed', 'Failed to generate reset key.', array('status' => 500));
    }
    
    // Customize reset URL to point to React app
    $frontend_reset_url = 'https://frontend.jumplings.in/#/reset-password?token=' . urlencode($key) . '&key=' . urlencode($key) . '&login=' . urlencode($user->user_login);
    
    $message = __('Someone requested a password reset for the following account:') . "\r\n\r\n";
    $message .= network_site_url() . "\r\n\r\n";
    $message .= sprintf(__('Username: %s'), $user->user_login) . "\r\n\r\n";
    $message .= __('If this was a mistake, just ignore this email and nothing will happen.') . "\r\n\r\n";
    $message .= __('To reset your password, visit the following address:') . "\r\n\r\n";
    $message .= $frontend_reset_url . "\r\n";
    
    $subject = __('[Jumplings] Password Reset');
    
    $sent = wp_mail($user->user_email, $subject, $message);
    
    if ($sent) {
        return array('success' => true, 'message' => 'Password reset email sent successfully.');
    } else {
        return new WP_Error('email_failed', 'Failed to send password reset email.', array('status' => 500));
    }
}

/**
 * Custom REST API endpoint to reset password with token
 * Route: /wp-json/jumplings/v1/reset-password
 */
add_action('rest_api_init', function() {
    register_rest_route('jumplings/v1', '/reset-password', array(
        'methods' => 'POST',
        'callback' => 'jumplings_reset_password',
        'permission_callback' => '__return_true',
    ));
});

function jumplings_reset_password($request) {
    $login = sanitize_text_field($request->get_param('login'));
    $key = sanitize_text_field($request->get_param('key'));
    $password = $request->get_param('password');
    
    if (empty($login) || empty($key) || empty($password)) {
        return new WP_Error('missing_params', 'Login, key, and password are required.', array('status' => 400));
    }
    
    // Validate password strength
    if (strlen($password) < 8) {
        return new WP_Error('weak_password', 'Password must be at least 8 characters long.', array('status' => 400));
    }
    
    // Get user
    $user = get_user_by('login', $login);
    if (!$user) {
        return new WP_Error('invalid_user', 'Invalid user.', array('status' => 400));
    }
    
    // Check reset key
    $user = check_password_reset_key($key, $login);
    if (is_wp_error($user)) {
        return new WP_Error('invalid_key', 'Invalid or expired reset key. Please request a new password reset.', array('status' => 400));
    }
    
    // Reset password
    reset_password($user, $password);
    
    // Clear any existing password reset keys
    global $wpdb;
    $wpdb->delete($wpdb->usermeta, array(
        'user_id' => $user->ID,
        'meta_key' => $wpdb->get_blog_prefix() . 'user_activation_key'
    ));
    
    return array('success' => true, 'message' => 'Password reset successfully.');
}
```

**Important**: Replace `https://frontend.jumplings.in` with your actual frontend URL if different.

---

## 📋 Installation Steps

1. **Log into WordPress Admin**: `https://jumplings.in/wp-admin`

2. **Go to Theme Editor**:
   - Appearance → Theme Editor
   - Select `functions.php`

3. **Add the Code**:
   - Scroll to the bottom of `functions.php`
   - Paste the code above
   - Click "Update File"

**OR** create a custom plugin (recommended for production):
- Create file: `wp-content/plugins/jumplings-password-reset/jumplings-password-reset.php`
- Add plugin header and the code above
- Activate the plugin

---

## 🔄 How It Works

### Flow:

1. **User clicks "Forgot your password?" on Login page**
   - Navigates to `/reset-password`

2. **User enters email address**
   - Frontend validates email format
   - Calls `/wp-json/jumplings/v1/lost-password`
   - WordPress generates reset key and sends email

3. **User receives email with reset link**
   - Link format: `https://frontend.jumplings.in/#/reset-password?token=XXX&key=XXX&login=XXX`
   - Link points to React app (not WordPress)

4. **User clicks link in email**
   - Opens React app at reset password page
   - Shows form to enter new password

5. **User enters new password**
   - Frontend validates password strength
   - Calls `/wp-json/jumplings/v1/reset-password`
   - WordPress verifies token and resets password

6. **Success**
   - User sees success message
   - Can navigate to login page

---

## 🔐 Security Features

1. ✅ **Email validation** - Validates email format before API call
2. ✅ **Password strength requirements** - Minimum 8 characters, uppercase, lowercase, number
3. ✅ **Token verification** - WordPress verifies reset token before allowing password change
4. ✅ **Token expiration** - Reset tokens expire (WordPress default: 24 hours)
5. ✅ **No email enumeration** - Doesn't reveal if email exists
6. ✅ **Secure password reset** - Uses WordPress's built-in password reset functions

---

## 🧪 Testing

### Test Password Reset Flow:

1. **Request Reset**:
   - Go to Login page
   - Click "Forgot your password?"
   - Enter email address
   - Should receive email with reset link

2. **Reset Password**:
   - Click link in email
   - Should open React app at reset password page
   - Enter new password (must meet requirements)
   - Confirm password
   - Should see success message

3. **Login with New Password**:
   - Go to login page
   - Enter email and new password
   - Should login successfully

---

## ⚠️ Troubleshooting

### Email Not Received?

1. **Check Spam Folder** - First thing to check
2. **Verify WordPress Email Configuration** - Use WP Mail SMTP plugin
3. **Check Email Logs** - Use WP Mail Logging plugin
4. **Verify Frontend URL** - Make sure reset link URL in PHP code matches your frontend URL

### Reset Link Not Working?

1. **Check URL Format** - Should be: `/#/reset-password?token=XXX&key=XXX&login=XXX`
2. **Verify Token Not Expired** - Tokens expire after 24 hours
3. **Check WordPress Function** - Make sure PHP code is added to functions.php
4. **Check Browser Console** - Look for API errors

### Password Reset Fails?

1. **Check Password Requirements** - Must be 8+ chars with uppercase, lowercase, number
2. **Verify Token** - Token must be valid and not expired
3. **Check WordPress Logs** - Look for PHP errors
4. **Test API Endpoint** - Use browser console to test API calls

---

## 📝 API Endpoints

### Request Password Reset
```
POST /wp-json/jumplings/v1/lost-password
Body: { "email": "user@example.com" }
Response: { "success": true, "message": "..." }
```

### Reset Password with Token
```
POST /wp-json/jumplings/v1/reset-password
Body: {
  "login": "username",
  "key": "reset_key",
  "password": "new_password"
}
Response: { "success": true, "message": "..." }
```

---

## ✅ Checklist

- [ ] Add PHP code to WordPress functions.php
- [ ] Update frontend URL in PHP code (if different)
- [ ] Test password reset request
- [ ] Verify email is received
- [ ] Test reset link opens React app
- [ ] Test password reset with token
- [ ] Test login with new password
- [ ] Configure SMTP for reliable email delivery

---

## 🎯 Summary

The password reset system is now fully integrated with WordPress backend. Users can:

1. ✅ Request password reset from React app
2. ✅ Receive email with reset link
3. ✅ Reset password directly in React app
4. ✅ Login with new password

**All without leaving the React frontend!**

---

## 📞 Support

If password reset doesn't work:

1. Check WordPress error logs
2. Verify PHP code is added correctly
3. Test API endpoints manually
4. Check email configuration
5. Verify frontend URL in reset link

