# WooCommerce Email Configuration Guide

## Issue: Order Confirmation Emails Not Being Sent

When orders are created via the WooCommerce REST API, **emails are not automatically sent**. This is by design to prevent duplicate emails when orders are created programmatically.

## Solution Overview

This guide explains how to ensure order confirmation emails are sent when orders are created through the React frontend.

---

## Option 1: WordPress Function (Recommended)

Add this code to your WordPress theme's `functions.php` file or create a custom plugin:

```php
/**
 * Trigger order email when order is created via REST API
 */
add_action('woocommerce_new_order', 'send_api_order_email', 10, 1);
add_action('woocommerce_rest_insert_shop_order_object', 'send_api_order_email_rest', 10, 3);

function send_api_order_email($order_id) {
    $order = wc_get_order($order_id);
    if ($order) {
        // Send customer notification
        do_action('woocommerce_order_status_pending_to_processing_notification', $order_id, $order);
        do_action('woocommerce_order_status_pending_to_on-hold_notification', $order_id, $order);
    }
}

function send_api_order_email_rest($order, $request, $creating) {
    if ($creating) {
        // Order was just created via REST API
        $order_id = $order->get_id();
        
        // Trigger the new order email
        WC()->mailer()->emails['WC_Email_New_Order']->trigger($order_id);
        
        // Trigger customer notification
        WC()->mailer()->emails['WC_Email_Customer_Processing_Order']->trigger($order_id);
    }
}
```

**How to add this:**
1. Log into WordPress admin
2. Go to **Appearance** > **Theme Editor**
3. Select `functions.php`
4. Add the code above at the end of the file
5. Click **Update File**

**OR** create a custom plugin:
1. Create a new file: `wp-content/plugins/jumplings-email-fix/jumplings-email-fix.php`
2. Add plugin header and the code above
3. Activate the plugin

---

## Option 2: Use SMTP Plugin (Recommended for Production)

WooCommerce emails depend on WordPress's email system. Many hosting providers have unreliable email delivery. Use an SMTP plugin:

### Recommended Plugin: WP Mail SMTP

1. **Install Plugin:**
   - Go to **Plugins** > **Add New**
   - Search for "WP Mail SMTP"
   - Install and activate

2. **Configure SMTP:**
   - Go to **WP Mail SMTP** > **Settings**
   - Choose your email provider (Gmail, Outlook, SendGrid, etc.)
   - Enter SMTP credentials
   - Send a test email

3. **Benefits:**
   - Reliable email delivery
   - Better email deliverability
   - Email logging
   - Prevents emails going to spam

---

## Option 3: WooCommerce Email Settings

Ensure WooCommerce emails are enabled:

1. **Check Email Settings:**
   - Go to **WooCommerce** > **Settings** > **Emails**
   - Verify these emails are enabled:
     - ✅ **New Order** (admin notification)
     - ✅ **Processing Order** (customer notification)
     - ✅ **On Hold Order** (customer notification)

2. **Check Email Recipients:**
   - Ensure admin email is correct
   - Customer emails use the email from the order

---

## Option 4: Custom REST API Endpoint (Advanced)

If the above methods don't work, create a custom endpoint to trigger emails:

**Add to `functions.php` or custom plugin:**

```php
/**
 * Custom REST API endpoint to trigger order email
 */
add_action('rest_api_init', function () {
    register_rest_route('jumplings/v1', '/orders/(?P<id>\d+)/send-email', array(
        'methods' => 'POST',
        'callback' => 'trigger_order_email_endpoint',
        'permission_callback' => '__return_true', // Add proper auth in production
    ));
});

function trigger_order_email_endpoint($request) {
    $order_id = $request->get_param('id');
    $order = wc_get_order($order_id);
    
    if (!$order) {
        return new WP_Error('order_not_found', 'Order not found', array('status' => 404));
    }
    
    // Trigger emails
    WC()->mailer()->emails['WC_Email_New_Order']->trigger($order_id);
    WC()->mailer()->emails['WC_Email_Customer_Processing_Order']->trigger($order_id);
    
    return rest_ensure_response(array('success' => true, 'message' => 'Email sent'));
}
```

Then update the frontend code to call this endpoint after order creation.

---

## Testing Email Delivery

1. **Place a Test Order:**
   - Use a real email address
   - Check spam/junk folder
   - Check email server logs

2. **Use Email Logging Plugin:**
   - Install **WP Mail Logging** plugin
   - View logs at **Tools** > **WP Mail Log**
   - See if emails were attempted to be sent

3. **Check WordPress Debug Log:**
   - Enable `WP_DEBUG` in `wp-config.php`
   - Check for email-related errors in `wp-content/debug.log`

---

## Current Frontend Implementation

The frontend code now includes `triggerOrderEmail()` function that:
1. Updates order status to trigger email hooks
2. Adds customer notes (which can trigger emails)
3. Logs any errors (but doesn't fail order creation)

**However**, for emails to actually be sent, you **must** configure WordPress/WooCommerce as described above.

---

## Troubleshooting

### Emails Still Not Sending?

1. **Check Spam Folder** - First thing to check

2. **Verify SMTP Configuration** - Use WP Mail SMTP plugin

3. **Check Hosting Email Restrictions** - Some hosts block PHP mail()

4. **Test WordPress Email** - Go to **WP Mail SMTP** > **Email Test** and send test email

5. **Check WooCommerce Email Settings** - Ensure emails are enabled

6. **Check Order Status** - Emails trigger on status changes (pending → processing)

7. **Review Error Logs** - Check WordPress debug log for email errors

---

## Quick Checklist

- [ ] Added WordPress function to trigger emails (Option 1)
- [ ] Installed and configured SMTP plugin (Option 2 - Recommended)
- [ ] Verified WooCommerce email settings are enabled
- [ ] Tested with a real order
- [ ] Checked spam folder
- [ ] Verified emails are being sent (use WP Mail Logging)

---

## Important Notes

1. **REST API Limitation**: WooCommerce REST API doesn't automatically send emails to prevent duplicate emails in automated systems.

2. **Email Reliability**: PHP's default mail function is unreliable. Use SMTP plugin for production.

3. **Order Status**: Emails are typically triggered when order status changes (e.g., pending → processing).

4. **Customer vs Admin Emails**: Make sure both customer and admin notifications are enabled in WooCommerce settings.

---

## Need Help?

If emails still aren't working after trying these solutions:

1. Check WordPress error logs
2. Contact your hosting provider about email restrictions
3. Consider using a transactional email service (SendGrid, Mailgun, etc.)
4. Review WooCommerce documentation on email configuration

