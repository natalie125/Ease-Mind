// TermsOfService.js

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  privacyNoticeContainerStyle, privacyNoticeheaderStyle, privacyNoticesectionStyle, privacyNoticecontactEmailStyle,
} from './styles/Styles';

function TermsOfService() {
  const navigate = useNavigate(); // This line defines `navigate` by calling `useNavigate`

  const goBack = () => {
    navigate(-1); // Uses `navigate` to go back to the previous page
  };

  return (
    <div style={privacyNoticeContainerStyle}>
      <h1 style={privacyNoticeheaderStyle}>Terms of Service</h1>
      <section style={privacyNoticesectionStyle}>
        <h2>Welcome to DepressiLess!</h2>
        <p>
          By accessing or using our web application, you agree to be bound by these Terms of Service.
          If you do not agree with any part of these terms, please do not use our services.
        </p>
      </section>
      <section style={privacyNoticesectionStyle}>
        <h3>Use of Our Service</h3>
        <p>
          ○ DepressiLess provides is a support tool used for the purpose of assisting professionals in making faster and more accurate diagnosis for depression. Our services are subject to the terms below.
          ○ Users must be 15 or older to use this service.
          ○ Users must provide accurate, complete, and up-to-date information when creating an account and using the service.
        </p>
      </section>
      <section style={privacyNoticesectionStyle}>
        <h3>Privacy Policy</h3>
        <p>
          ○ Our Privacy Policy describes how we handle the information you provide to us when you use our services. You understand that through your use of our services, you consent to the collection and use of this information.
        </p>
      </section>
      <section style={privacyNoticesectionStyle}>
        <h3>User Responsibilities</h3>
        <p>
          ○ You are responsible for all activity that occurs under your account.
          ○ You must maintain the security of your account and promptly notify us if you discover or suspect that someone has accessed your account without your permission.
        </p>
      </section>
      <section style={privacyNoticesectionStyle}>
        <h3>Restrictions</h3>
        <p>
          ○ You may not use our services for any illegal or unauthorized purpose.
          ○ You must not attempt to disrupt or overload our infrastructure.
        </p>
      </section>
      <section style={privacyNoticesectionStyle}>
        <h3>Intellectual Property Rights</h3>
        <p>
          ○ All intellectual property rights in the services provided by DepressiLess are owned by us or our licensors.
        </p>
      </section>
      <section style={privacyNoticesectionStyle}>
        <h3>Termination</h3>
        <p>
          ○ We may terminate or suspend access to our service immediately, without prior notice, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
      </section>
      <section style={privacyNoticesectionStyle}>
        <h3>Termination</h3>
        <p>
          ○ We reserve the right to modify or replace these Terms at any time. We will make reasonable efforts to provide notice prior to any new terms taking effect.
        </p>
      </section>

      {/* ... Other sections ... */}

      <section style={privacyNoticesectionStyle}>
        <h3>Contact Us</h3>
        <p>
          If you have any questions about these Terms, please contact us at
          <a href="mailto:depressiLessinfo@gmail.com" style={privacyNoticecontactEmailStyle}>depressiLessinfo@gmail.com</a>
          .
        </p>
      </section>

      <h1 style={{ ...privacyNoticesectionStyle, marginTop: '90px' }}>Privacy Policy</h1>
      <section style={privacyNoticesectionStyle}>
        <p>
          ○ This policy sets out how DepressiLess collects, uses, discloses, and safeguards your data.
        </p>
      </section>

      <section style={privacyNoticesectionStyle}>
        <h3>Data Collection</h3>
        <p>
          ○ We collect information that you provide directly to us, such as when you create an account, submit information, or communicate with us.
          ○ We also collect information automatically, such as your usage details, IP addresses, and information collected through cookies.
        </p>
      </section>
      <section style={privacyNoticesectionStyle}>
        <h3>Data Usage</h3>
        <p>
          ○ The data we collect is used to provide, maintain, and improve our services, to develop new services, and to protect DepressiLess and our users.
          ○ We may also use the data to communicate with you, such as to send you service updates and support messages.
        </p>
      </section>
      <section style={privacyNoticesectionStyle}>
        <h3>Data Sharing</h3>
        <p>
          ○ We do not share personal information with companies, organizations, or individuals outside of DepressiLess except in the following cases:
          -With your consent.
          -For external processing (with vendors, consultants, and other service providers).
          -For legal reasons, such as to meet any applicable law, regulation, legal process, or enforceable governmental request.
        </p>
      </section>
      <section style={privacyNoticesectionStyle}>
        <h3>Data Security</h3>
        <p>
          ○ We work hard to protect DepressiLess and our users from unauthorized access, alteration, disclosure, or destruction of information we hold.
        </p>
      </section>
      <section style={privacyNoticesectionStyle}>
        <h3>Your Rights</h3>
        <p>
          ○ You have the right to access, update, and delete your personal information.
        </p>
      </section>
      <section style={privacyNoticesectionStyle}>
        <h3>Changes to This Policy</h3>
        <p>
          Our Privacy Policy may change from time to time. We will post any policy changes on this page and, if the changes are significant, we will provide a more prominent notice.
        </p>
      </section>

      {/* ... Privacy sections ... */}

      <section style={privacyNoticesectionStyle}>
        <h3>Contact Us</h3>
        <p>
          If you have any questions or concerns about this Privacy Policy, please contact us at
          <a href="mailto:depressiLessinfo@gmail.com" style={privacyNoticecontactEmailStyle}>depressiLessinfo@gmail.com</a>
          .
        </p>
      </section>
      <section style={privacyNoticesectionStyle}>
        <button
          type="button"
          onClick={goBack}
          style={{
            ...privacyNoticecontactEmailStyle,
            backgroundColor: '#cccccc', // Grey color
            color: 'black',
            textDecoration: 'none',
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
          Go Back
        </button>
      </section>

      <section style={privacyNoticesectionStyle}>
        <Link to="/">Return to Home</Link>
      </section>
    </div>
  );
}

export default TermsOfService;
