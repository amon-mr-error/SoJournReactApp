import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import logo from "../landing/assets/images/logo.jpeg";

const PrivacyPolicy = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm'>
        <div className='container mx-auto px-4 md:px-6 py-4'>
          <div className='flex items-center justify-between'>
            <Link to='/' className='flex items-center'>
              <img src={logo} alt='SoJourn Logo' className='h-8 mr-3' />
            </Link>
            <Link
              to='/'
              className='flex items-center text-gray-600 hover:text-gray-900 transition-colors'
            >
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 md:px-6 py-12'>
        <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            Privacy Policy
          </h1>
          <p className='text-gray-600 mb-8'>Last updated: September 27, 2025</p>

          {/* Introduction */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              1. Introduction
            </h2>
            <p className='text-gray-700 leading-relaxed'>
              Welcome to SoJourn. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our
              travel platform and services. Please read this privacy policy
              carefully. If you do not agree with the terms of this privacy
              policy, please do not access the application.
            </p>
          </section>

          {/* Information We Collect */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              2. Information We Collect
            </h2>
            <p className='text-gray-700 mb-4'>
              We may collect information about you in a variety of ways:
            </p>

            <h3 className='text-lg font-semibold text-gray-800 mb-2'>
              Personal Data
            </h3>
            <p className='text-gray-700 mb-4'>
              Personally identifiable information, such as your name, email
              address, phone number, and demographic information, that you
              voluntarily give to us when you register with the application or
              when you choose to participate in various activities related to
              the application.
            </p>

            <h3 className='text-lg font-semibold text-gray-800 mb-2'>
              Usage Data
            </h3>
            <p className='text-gray-700 mb-4'>
              Information our servers automatically collect when you access the
              site, such as your IP address, browser type, operating system,
              access times, and the pages you view.
            </p>

            <h3 className='text-lg font-semibold text-gray-800 mb-2'>
              Location Information
            </h3>
            <p className='text-gray-700 mb-4'>
              We may request access or permission to track location-based
              information from your device to provide location-based services
              and enhance your experience with local recommendations.
            </p>
          </section>

          {/* How We Use Information */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              3. How We Use Your Information
            </h2>
            <p className='text-gray-700 mb-4'>
              We use the information we collect to:
            </p>
            <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
              <li>Create and manage your account</li>
              <li>Process your bookings and transactions</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send you updates about your bookings and account</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraudulent transactions and monitor against theft</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              4. Sharing Your Information
            </h2>
            <p className='text-gray-700 mb-4'>
              We may share your information in the following situations:
            </p>
            <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
              <li>
                <strong>Service Providers:</strong> With third-party vendors who
                provide services on our behalf
              </li>
              <li>
                <strong>Business Partners:</strong> With adventure tour
                operators, car rental providers, and other service partners
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                protect our rights
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with any
                merger, sale, or acquisition
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              5. Data Security
            </h2>
            <p className='text-gray-700 leading-relaxed'>
              We use administrative, technical, and physical security measures
              to help protect your personal information. While we have taken
              reasonable steps to secure the personal information you provide to
              us, please be aware that despite our efforts, no security measures
              are perfect or impenetrable.
            </p>
          </section>

          {/* Data Retention */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              6. Data Retention
            </h2>
            <p className='text-gray-700 leading-relaxed'>
              We will retain your personal information only for as long as
              necessary to fulfill the purposes outlined in this privacy policy,
              comply with legal obligations, resolve disputes, and enforce our
              agreements.
            </p>
          </section>

          {/* Your Rights */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              7. Your Rights
            </h2>
            <p className='text-gray-700 mb-4'>You have the right to:</p>
            <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              8. Cookies and Tracking Technologies
            </h2>
            <p className='text-gray-700 leading-relaxed'>
              We use cookies and similar tracking technologies to track activity
              on our service and store certain information. These technologies
              are used to maintain your preferences, analyze trends, and improve
              our services.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              9. Third-Party Services
            </h2>
            <p className='text-gray-700 leading-relaxed'>
              Our service may contain links to other websites. We are not
              responsible for the privacy practices of other websites. We
              encourage you to read the privacy statements of each website that
              collects personally identifiable information.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              10. Changes to This Privacy Policy
            </h2>
            <p className='text-gray-700 leading-relaxed'>
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new privacy policy on
              this page and updating the "Last updated" date.
            </p>
          </section>

          {/* Contact Information */}
          <section className='mt-12 pt-8 border-t border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              Contact Us
            </h2>
            <p className='text-gray-700'>
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href='mailto:privacy@sojourn.com'
                className='text-sojourn-teal hover:underline'
              >
                privacy@sojourn.com
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-8'>
        <div className='container mx-auto px-4 md:px-6 text-center'>
          <p className='text-gray-400'>© 2024 SoJourn. All rights reserved.</p>
          <div className='flex justify-center space-x-6 mt-4'>
            <Link
              to='/privacy-policy'
              className='text-gray-400 hover:text-white transition-colors'
            >
              Privacy Policy
            </Link>
            <Link
              to='/terms-of-service'
              className='text-gray-400 hover:text-white transition-colors'
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
