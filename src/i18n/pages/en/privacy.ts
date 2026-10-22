/**
 * ⚠ DRAFT — MUST BE LEGALLY REVIEWED BEFORE GOING LIVE.
 * Mirrors the French version; see ../fr/privacy.ts.
 */
export const privacy = {
  seo: {
    title: 'Privacy policy — Lagni Consulting',
    description:
      'What personal information Lagni Consulting collects, why, how long it is kept, and how to exercise your rights.',
  },

  hero: {
    eyebrow: 'Privacy',
    title: 'Privacy policy',
    lead: 'This page explains what personal information Lagni Consulting collects through this website, for what purposes, how long it is kept, and how you can exercise your rights.',
    updated: 'Last updated',
    updatedDate: '6 October 2026',
  },

  draftNotice:
    'This text is a working draft prepared by the development team. It must be reviewed and approved by Lagni Consulting, and checked by legal counsel, before the site goes into production.',

  sections: [
    {
      title: 'Who is responsible for your information',
      body: [
        'Lagni Consulting, based in Quebec, Canada, is responsible for the personal information collected through this website.',
        'For any question about this policy or to exercise your rights, write to us at the address given at the end of this page.',
      ],
    },
    {
      title: 'What information is collected',
      body: [
        'We only collect what you send us voluntarily through the forms on this site. No account is created and no data is bought from third parties.',
      ],
      items: [
        'Contact form: first name, last name, email, country, type of request and the content of your message. Depending on the request: organization, training of interest, profile, solution concerned, role being hired for, programme or number of students.',
        'Employer form (recruitment): organization, name, work email, role, area, contract type and a description of the need.',
        'Candidate form (recruitment): name, email, area of expertise, years of experience and your résumé (PDF, DOC or DOCX, 5 MB maximum).',
        'Institution form: name of the institution, country, contact name and role, email, programme concerned, number of students and intended timeframe.',
      ],
    },
    {
      title: 'Why it is collected',
      items: [
        'To answer your request and follow up on the exchanges that result from it.',
        'To send you the information you asked for about our training, our services or our partnership offer.',
        'For applications: to assess your profile against current recruitment mandates and share relevant professional opportunities with you.',
        'For employer enquiries: to understand the need and prepare a service proposal.',
      ],
      note: 'Your information is used for no other purpose. We do not sell, rent or trade any personal information.',
    },
    {
      title: 'On what basis we process it',
      body: [
        'Processing is based on your consent, given by ticking the box provided before each form is sent, and on our legitimate interest in answering a commercial enquiry you initiated.',
        'You may withdraw your consent at any time, without affecting exchanges that have already taken place.',
      ],
    },
    {
      title: 'Who has access to it',
      body: ['The information is accessible to the people at Lagni Consulting handling your request.'],
      items: [
        'Website hosting and form processing: submissions, including CVs, are received and stored on Lagni Consulting’s own server, not with a third-party form collection service. Server location: to be confirmed.',
        'Email: notifications of new enquiries are sent to Lagni Consulting’s professional mailbox.',
      ],
      note: 'We do not share your information with any other third party, except where legally required. As part of a recruitment mandate, a résumé is only passed to an employer after you have been informed.',
    },
    {
      title: 'How long it is kept',
      items: [
        'Contact and information requests: kept for as long as needed to handle the request, then archived for a maximum of 24 months.',
        'Applications and résumés: kept for up to 24 months from receipt, so that we can share opportunities with you. After that period they are deleted.',
        'Employer and partnership enquiries: kept for the duration of the business relationship, then according to applicable accounting and legal obligations.',
      ],
      note: 'You may ask for your information to be deleted at any time, before those periods end.',
    },
    {
      title: 'Your rights',
      body: ['Under the legislation applicable in Quebec, you have the following rights:'],
      items: [
        'Access the personal information we hold about you.',
        'Have inaccurate, incomplete or ambiguous information corrected.',
        'Withdraw your consent and ask for your information to be deleted.',
        'Ask for your information to be provided in a structured, commonly used technological format.',
        'File a complaint with the Commission d’accès à l’information du Québec if you believe your rights have not been respected.',
      ],
      note: 'To exercise any of these rights, write to us. We reply within 30 days.',
    },
    {
      title: 'Cookies and analytics',
      body: [
        'This site sets no advertising or tracking cookies, and uses no third-party analytics tool.',
        'The only technical data processed are the hosting provider’s connection logs, which are necessary to run and secure the site.',
        'If an analytics tool were added, this page would be updated and a consent mechanism put in place beforehand.',
      ],
    },
    {
      title: 'Security',
      body: [
        'The site is served over HTTPS and form submissions are transmitted encrypted. Access to submissions is protected by authentication.',
        'No system is infallible, so we cannot guarantee absolute security, but we undertake to inform you without delay of any incident likely to affect your information.',
      ],
    },
    {
      title: 'Changes to this policy',
      body: [
        'This policy may be amended to reflect changes to the site or to applicable regulations. The date it was last updated appears at the top of this page.',
      ],
    },
  ],

  contact: {
    title: 'Contact us',
    body: 'For any question about this policy, or to exercise your rights:',
    cta: 'Write to us',
  },
} as const;
