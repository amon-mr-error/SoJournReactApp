import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import logo from "../landing/assets/images/logo.jpeg";

const TermsOfService = () => {
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
            Terms of Service
          </h1>
          <p className='text-gray-600 mb-8'>Service Level Agreement (SLA)</p>

          {/* Introduction */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              1. Introduction
            </h2>
            <p className='text-gray-700 leading-relaxed'>
              This Service Level Agreement (SLA) establishes the terms and
              conditions between Sojourn ("the Company") and Self-Drive Cars
              Kashmir ("the Vendor") for the provision of self-drive car rental
              services listed on the Sojourn platform.
            </p>
          </section>

          {/* Scope of Services */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              2. Scope of Services
            </h2>
            <p className='text-gray-700 mb-4'>The Vendor agrees to:</p>
            <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
              <li>
                <strong>Vehicle Listings:</strong> Accurately list and regularly
                update all available vehicles on the Sojourn platform, ensuring
                details such as model, year, features, and availability are
                current.
              </li>
              <li>
                <strong>Service Provision:</strong> Provide self-drive car
                rental services to customers booking through the Sojourn
                platform, ensuring vehicles are in optimal condition and meet
                all regulatory requirements.
              </li>
            </ul>
          </section>

          {/* Performance Standards */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              3. Performance Standards
            </h2>
            <p className='text-gray-700 mb-4'>
              The Vendor commits to the following service standards:
            </p>
            <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
              <li>
                <strong>Service Availability:</strong> Maintain a minimum
                availability of 95% for all listed vehicles.
              </li>
              <li>
                <strong>Response Time:</strong> Respond to customer inquiries
                and booking requests within 12 hours.
              </li>
              <li>
                <strong>Booking Confirmation:</strong> Confirm all bookings
                within 12 hours of receipt.
              </li>
              <li>
                <strong>Customer Satisfaction:</strong> Aim for a customer
                satisfaction rating of 4.5 out of 5 or higher.
              </li>
              <li>
                <strong>Vehicle Condition:</strong> Ensure all vehicles are
                clean, well-maintained, and meet safety standards before each
                rental.
              </li>
            </ul>
          </section>

          {/* Compliance and Safety */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              4. Compliance and Safety
            </h2>
            <p className='text-gray-700 mb-4'>The Vendor shall:</p>
            <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
              <li>
                <strong>Licensing and Permits:</strong> Hold all necessary
                licenses, permits, and insurance required by local and national
                authorities.
              </li>
              <li>
                <strong>Regulatory Compliance:</strong> Adhere to all applicable
                laws and regulations pertaining to car rental services.
              </li>
              <li>
                <strong>Safety Protocols:</strong> Implement and follow safety
                protocols to ensure the well-being of customers.
              </li>
              <li>
                <strong>Staff Training:</strong> Ensure all staff members are
                adequately trained and knowledgeable about the services offered.
              </li>
            </ul>
          </section>

          {/* Reporting and Communication */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              5. Reporting and Communication
            </h2>
            <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
              <li>
                <strong>Monthly Reports:</strong> Provide monthly reports
                detailing service delivery metrics, customer feedback, and any
                incidents or issues encountered.
              </li>
              <li>
                <strong>Notifications:</strong> Immediately inform Sojourn of
                any changes to service availability, safety concerns, or other
                significant matters affecting service delivery.
              </li>
            </ul>
          </section>

          {/* Payment Terms */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              6. Payment Terms
            </h2>
            <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
              <li>
                <strong>Payment Schedule:</strong> Sojourn will remit payments
                to the Vendor on a weekly basis for all completed bookings.
              </li>
              <li>
                <strong>Commission:</strong> A commission of 16% will be
                retained by Sojourn from each booking.
              </li>
              <li>
                <strong>Invoices:</strong> The Vendor shall issue invoices
                detailing the services provided, and Sojourn shall process
                payments accordingly.
              </li>
            </ul>
          </section>

          {/* Confidentiality */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              7. Confidentiality
            </h2>
            <p className='text-gray-700 mb-4'>Both parties agree to:</p>
            <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
              <li>
                <strong>Confidential Information:</strong> Maintain the
                confidentiality of proprietary information exchanged during the
                course of this agreement.
              </li>
              <li>
                <strong>Non-Disclosure:</strong> Not disclose any confidential
                information to third parties without prior written consent from
                the other party.
              </li>
            </ul>
          </section>

          {/* Term and Termination */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              8. Term and Termination
            </h2>
            <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
              <li>
                <strong>Term:</strong> This agreement shall commence on the
                Effective Date and continue for one year, automatically renewing
                annually unless terminated earlier by either party.
              </li>
              <li>
                <strong>Termination:</strong> Either party may terminate this
                agreement with 30 days' written notice.
              </li>
              <li>
                <strong>Breach:</strong> In the event of a material breach of
                this agreement, the non-breaching party may terminate the
                agreement immediately upon written notice.
              </li>
            </ul>
          </section>

          {/* Dispute Resolution */}
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              9. Dispute Resolution
            </h2>
            <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
              <li>
                <strong>Mediation:</strong> Any disputes arising under this
                agreement shall first be attempted to be resolved through
                mediation.
              </li>
              <li>
                <strong>Arbitration:</strong> If mediation fails, disputes shall
                be submitted to binding arbitration under the laws of
                Jurisdiction.
              </li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className='mt-12 pt-8 border-t border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              Contact Information
            </h2>
            <p className='text-gray-700'>
              For questions about these Terms of Service, please contact us at{" "}
              <a href='mailto:' className='text-sojourn-teal hover:underline'>
                sojournhelpdesk@gmail.com
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

export default TermsOfService;
