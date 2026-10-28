/**
 * Career content — every line comes from the resume (Oct 2026).
 * Stages run chronologically so the race ends at the present.
 */

export const career = {
  name: 'Bikash Ramtel',
  title: 'Lead Software Engineer',
  location: 'Kathmandu, Nepal',
  summary:
    "Lead Software Engineer with 12+ years building production web platforms and 5+ years leading the Container Tracking module of PortPro's drayage TMS, used by 550+ trucking companies. Owns technical direction for a real-time system tracking 100,000+ containers across North American port, rail, and terminal systems. Hands-on with Node.js, React, MongoDB, and PostgreSQL, and has shipped LLM-based extraction and automation to production.",
  headline: {
    company: 'PortPro',
    role: 'Leading Container Tracking',
    stats: [
      { label: 'YEARS', value: '12+' },
      { label: 'CONTAINERS TRACKED', value: '100,000+' },
      { label: 'TRUCKING COMPANIES', value: '550+' },
    ],
  },
  education: {
    degree: 'BE Computer Engineering',
    school: 'Purbanchal University, College of Information Technology & Engineering, Kathmandu',
  },
  stages: [
    {
      id: 'ascend',
      number: 1,
      company: 'Ascend Infotech',
      place: 'Lalitpur',
      role: 'Web Developer',
      dates: '2013 – 2015 · remote part-time 2017 – 2019',
      loadout: ['LARAVEL', 'ANGULARJS', 'REACT'],
      bullets: [
        'Designed and delivered a patient registry and dialysis tracking system for the National Kidney Center, and built remote projects for US-based stakeholders in Laravel, AngularJS, and React.',
      ],
    },
    {
      id: 'wisdom-mirror',
      number: 2,
      company: 'Wisdom Mirror',
      place: 'Kathmandu',
      role: 'Full Stack Developer',
      dates: '2016 – 2019',
      loadout: ['REACT', 'LARAVEL', 'ANGULARJS', 'MYSQL'],
      bullets: [
        'Built Karma CRM, a SaaS client and project management product, from scratch. Served as scrum master for the two-year build and delivered the React application solo for its final year.',
        'Led the development team for SkyCRM, an inventory, pricing, and quotation system for an aluminium fabrication company (Laravel, AngularJS, MySQL).',
      ],
    },
    {
      id: 'kodknackare',
      number: 3,
      company: 'Kodknackare Webblösningar AB',
      place: 'Malmö, Sweden (remote)',
      role: 'Lead Full Stack Developer',
      dates: '2019 – 2021',
      loadout: ['REACT', 'PHP'],
      bullets: [
        'Led the development team building Kod CMS v3, a content management and e-commerce platform, owning the React front end and PHP back end and coordinating delivery with the CEO in Sweden.',
      ],
    },
    {
      id: 'portpro',
      number: 4,
      company: 'PortPro',
      place: '',
      role: 'Lead Software Engineer',
      dates: 'Apr 2021 – Present',
      loadout: ['NODE', 'MONGO', 'POSTGRES', 'RABBITMQ', 'TEMPORAL', 'LLM'],
      bullets: [
        "Lead the engineering team that owns Container Tracking, a core module of PortPro's transportation management platform. Set architecture, plan development, review implementation, and resolve the hardest technical problems.",
        'Designed and built a real-time tracking system that monitors 100,000+ containers, pulling statuses, holds, and events from port terminals, rail carriers, and third-party data providers across North America.',
        'Built extraction, normalization, and validation pipelines that turn inconsistent external data into a single reliable container record consumed by downstream dispatch, billing, and tracking workflows.',
        'Automated container pickup and return appointment booking through terminal systems, including appointment lookup, submission, and confirmation processing.',
        'Designed event-driven services that react to container status changes to trigger and update logistics workflows, cutting manual data gathering and coordination for carrier operations teams.',
        'Shipped LLM-based functionality for information extraction and interpretation, evaluating AI approaches for production reliability and integrating them into established workflows.',
        'Maintain web-scraping and integration layers against constantly changing third-party interfaces, diagnosing and fixing data availability and accuracy issues in production.',
      ],
    },
  ],
}
