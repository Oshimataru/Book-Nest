import { useNavigate } from 'react-router-dom';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body:
      'By accessing or using BookNest, you agree to follow these Terms and Conditions and all applicable laws. If you do not agree, please do not use the platform.',
  },
  {
    title: '2. Eligibility and Accounts',
    body:
      'You are responsible for providing accurate account information and for maintaining the confidentiality of your login credentials. You must be legally capable of entering into a binding agreement to use this service.',
  },
  {
    title: '3. Marketplace Listings',
    body:
      'Users may list books for sale, rent, or exchange. You must ensure that descriptions, prices, images, and condition details are accurate. Misleading or fraudulent listings may be removed without notice.',
  },
  {
    title: '4. User Conduct',
    body:
      'You agree not to misuse the platform, post unlawful content, harass other users, attempt unauthorized access, or interfere with the normal operation of BookNest.',
  },
  {
    title: '5. Orders, Rentals, and Exchanges',
    body:
      'Transactions made through BookNest are the responsibility of the participating users and any connected payment or delivery process. Users should communicate clearly regarding payment, timelines, book condition, and return expectations where applicable.',
  },
  {
    title: '6. Intellectual Property',
    body:
      'The BookNest name, branding, interface, and platform content are protected by applicable intellectual property rights. You may not copy, reproduce, or distribute platform materials without permission.',
  },
  {
    title: '7. Limitation of Liability',
    body:
      'BookNest is provided on an as-is basis. We do not guarantee uninterrupted service, error-free operation, or the behavior of third-party users. To the fullest extent permitted by law, BookNest is not liable for indirect or consequential losses.',
  },
  {
    title: '8. Termination',
    body:
      'We may suspend or terminate access to the platform if a user violates these terms, harms the community, or creates security or legal risk for the service.',
  },
  {
    title: '9. Changes to These Terms',
    body:
      'These Terms and Conditions may be updated from time to time. Continued use of BookNest after changes are published means you accept the revised terms.',
  },
  {
    title: '10. Contact',
    body:
      'For questions about these terms, you can reach out through the Contact page available on the BookNest website.',
  },
];

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display:ital@0;1&display=swap');

        .terms-page {
          min-height: 100%;
          padding: 48px 20px 80px;
          background:
            radial-gradient(circle at top left, rgba(100, 216, 203, 0.16), transparent 32%),
            radial-gradient(circle at top right, rgba(126, 184, 247, 0.14), transparent 28%),
            linear-gradient(180deg, #060a12 0%, #08111d 100%);
          color: rgba(255, 255, 255, 0.92);
          font-family: 'DM Sans', sans-serif;
        }

        .terms-shell {
          max-width: 980px;
          margin: 0 auto;
        }

        .terms-hero {
          padding: clamp(32px, 5vw, 56px);
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(24px);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
        }

        .terms-label {
          margin: 0 0 14px;
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(100, 216, 203, 0.7);
        }

        .terms-title {
          margin: 0;
          font-family: 'DM Serif Display', serif;
          font-size: clamp(34px, 5vw, 58px);
          line-height: 1.05;
        }

        .terms-subtitle {
          max-width: 700px;
          margin: 18px 0 0;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.65);
        }

        .terms-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .terms-btn {
          border-radius: 999px;
          padding: 12px 20px;
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }

        .terms-btn:hover {
          transform: translateY(-2px);
        }

        .terms-btn-primary {
          border: none;
          color: #061018;
          background: linear-gradient(135deg, #64d8cb, #7eb8f7);
        }

        .terms-btn-secondary {
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.88);
          background: rgba(255, 255, 255, 0.04);
        }

        .terms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 18px;
          margin-top: 28px;
        }

        .terms-card {
          padding: 24px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(18px);
        }

        .terms-card h2 {
          margin: 0 0 12px;
          font-family: 'DM Serif Display', serif;
          font-size: 24px;
          color: #ffffff;
        }

        .terms-card p {
          margin: 0;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.7);
        }

        @media (max-width: 640px) {
          .terms-page {
            padding: 28px 16px 56px;
          }

          .terms-hero {
            border-radius: 22px;
          }
        }
      `}</style>

      <section className="terms-page">
        <div className="terms-shell">
          <div className="terms-hero">
            <p className="terms-label">Legal</p>
            <h1 className="terms-title">Terms & Conditions</h1>
            <p className="terms-subtitle">
              These terms explain the rules for using BookNest, including how listings,
              accounts, and user interactions are expected to work across the platform.
            </p>

            <div className="terms-actions">
              <button
                className="terms-btn terms-btn-primary"
                onClick={() => navigate('/books')}
              >
                Explore Books
              </button>
              <button
                className="terms-btn terms-btn-secondary"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </button>
            </div>
          </div>

          <div className="terms-grid">
            {sections.map((section) => (
              <article className="terms-card" key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsAndConditions;
