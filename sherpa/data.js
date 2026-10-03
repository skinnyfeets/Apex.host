/* Apex Sherpa: example data. Everything here is invented for the demo. */
window.SHERPA_DATA = (function () {
  'use strict';

  // Every camp Sherpa knows. Each industry picks the ones it needs below, renames them and swaps their tools.
  var CAMPS = [
    { id: 'mail', name: 'Mail & Calendar', short: 'Mail', icon: 'mail', core: true, tools: ['Gmail', 'Outlook'], hours: 5.2, memories: 2552, est: '+4 to 6 h',
      groups: [['Threads', 812], ['Contacts', 604], ['Meetings', 388], ['Drafts', 301], ['Rules', 247], ['Files', 200]],
      named: [['Marcus Lee', 1], ['Friday block', 2], ['Board deck', 5], ['Halcyon thread', 0]] },
    { id: 'chat', name: 'Chat', short: 'Chat', icon: 'chat', core: true, tools: ['Slack', 'Teams', 'Google Chat'], hours: 2.4, memories: 1240, est: '+2 to 3 h',
      groups: [['Channels', 402], ['People', 318], ['Threads', 290], ['Decisions', 230]],
      named: [['#ops', 0], ['Pricing call', 3], ['Dana Ruiz', 1]] },
    { id: 'clients', name: 'Clients', short: 'Clients', icon: 'clients', core: true, tools: ['HubSpot', 'Salesforce', 'Pipedrive'], hours: 2.6, memories: 708, est: '+3 to 5 h',
      groups: [['Contacts', 214], ['Proposals', 202], ['Calls', 117], ['Invoices', 96], ['Accounts', 41], ['Deals', 38]],
      named: [['Sarah Okafor', 0], ['Proposal v3', 1], ["Tuesday's call", 2], ['Invoice 1042', 3], ['Northwind', 4]] },
    { id: 'money', name: 'Money', short: 'Money', icon: 'money', core: true, tools: ['Stripe', 'QuickBooks', 'Xero'], hours: 0.8, memories: 312, est: '+1 to 2 h',
      groups: [['Invoices', 120], ['Bills', 84], ['Payroll', 60], ['Payments', 48]],
      named: [['Invoice 1042', 0], ["Friday's payroll", 2]] },
    { id: 'projects', name: 'Projects', short: 'Projects', icon: 'projects', core: false, tools: ['Asana', 'Linear', 'Notion'], hours: 2.0, memories: 420, est: '+2 h',
      groups: [['Tasks', 180], ['Docs', 150], ['Projects', 90]],
      named: [['Q4 launch', 2]] },
    { id: 'support', name: 'Support', short: 'Support', icon: 'support', core: false, tools: ['Zendesk', 'Intercom', 'Help Scout'], hours: 1.0, memories: 260, est: '+1 h',
      groups: [['Tickets', 140], ['Customers', 80], ['Macros', 40]],
      named: [['Password resets', 0]] },
    { id: 'docs', name: 'Docs & Files', short: 'Docs', icon: 'docs', core: false, tools: ['Google Drive', 'Dropbox', 'OneDrive'], hours: 1.2, memories: 640, est: '+1 h',
      groups: [['Docs', 260], ['Folders', 150], ['Sheets', 140], ['Decks', 90]],
      named: [['Q4 plan', 0], ['Price list', 2], ['Board deck', 3]] },
    { id: 'marketing', name: 'Marketing', short: 'Marketing', icon: 'marketing', core: false, tools: ['Mailchimp', 'Klaviyo', 'Meta Ads'], hours: 1.5, memories: 480, est: '+1 to 2 h',
      groups: [['Results', 160], ['Campaigns', 120], ['Ads', 110], ['Audiences', 90]],
      named: [['Spring launch', 1], ['Newsletter', 1], ['Retargeting', 2]] },
    { id: 'social', name: 'Social', short: 'Social', icon: 'social', core: false, tools: ['Instagram', 'LinkedIn', 'YouTube'], hours: 1.3, memories: 520, est: '+1 h',
      groups: [['Posts', 220], ['Comments', 180], ['DMs', 120]],
      named: [['Launch reel', 0], ['Partner DMs', 2]] },
    { id: 'store', name: 'Store', short: 'Store', icon: 'store', core: false, tools: ['Shopify', 'Square', 'WooCommerce'], hours: 1.6, memories: 900, est: '+1 to 2 h',
      groups: [['Orders', 420], ['Customers', 220], ['Products', 180], ['Returns', 80]],
      named: [['Order 2207', 0], ['Restock', 2]] },
    { id: 'team', name: 'Team & Payroll', short: 'Team', icon: 'team', core: false, tools: ['Gusto', 'Rippling', 'Deel'], hours: 1.1, memories: 300, est: '+1 h',
      groups: [['Onboarding', 100], ['Payroll', 90], ['Time off', 70], ['People', 40]],
      named: [["Leo's onboarding", 0], ['Friday payroll', 1]] }
  ];

  // Trails: work Sherpa offers to take over. hours is Sherpa's estimate, shown only as an estimate. What counts
  // is each task Sherpa actually finishes: done is how it reads in the log, min the time it would have taken you.
  var TRAILS = [
    { id: 't1', min: 6, camp: 'clients', title: 'Send invoices on signing', text: '14 invoices sent by hand. Let me send them the moment a deal signs.', hours: 1.5, done: 'Sent an invoice the moment a deal signed' },
    { id: 't2', min: 15, camp: 'mail', title: 'Handle rescheduling', text: 'You move 9 meetings a week. Let me handle the back and forth.', hours: 1.2, done: 'Rescheduled a meeting for you' },
    { id: 't3', min: 15, camp: 'clients', title: 'Draft proposal follow-ups', text: 'Follow-ups wait 3 days on average. Let me draft them the next morning.', hours: 1.0, done: 'Drafted a proposal follow-up' },
    { id: 't4', min: 10, camp: 'mail', title: 'Guard your Fridays', text: 'Meetings keep landing on your Friday block. Let me decline them.', hours: 1.0, done: 'Declined a meeting on your Friday block' },
    { id: 't5', min: 8, camp: 'chat', title: 'Answer repeat questions', text: 'The same five questions come up in #ops. Let me answer them.', hours: 0.9, done: 'Answered a repeat question in #ops' },
    { id: 't6', min: 10, camp: 'projects', title: 'Emails to tasks', text: 'Action items die in your inbox. Let me turn them into tasks.', hours: 0.8, done: 'Turned emails into tasks' },
    { id: 't7', min: 8, camp: 'money', title: 'Chase late invoices', text: 'Late invoices sit for two weeks. Let me send the reminders.', hours: 0.7, done: 'Chased a late invoice' },
    { id: 't8', min: 20, camp: 'chat', title: 'One evening summary', text: 'Let me send one summary at 6 instead of 40 pings.', hours: 0.6, done: 'Sent your evening summary' },
    { id: 't9', min: 12, camp: 'support', title: 'Answer password resets', text: 'Half your tickets are password resets. Let me answer them.', hours: 0.6, done: 'Answered password resets' },
    { id: 't10', min: 10, camp: 'money', title: 'Sort expenses', text: 'Let me sort expenses as they come in.', hours: 0.5, done: 'Sorted new expenses' },
    { id: 't11', min: 15, camp: 'store', title: 'Answer order questions', text: '"Where\'s my order?" is a third of your inbox. Let me answer it.', hours: 1.2, done: 'Answered an order question' },
    { id: 't12', min: 45, camp: 'marketing', title: 'Weekly campaign report', text: 'You pull campaign numbers by hand every Monday. Let me send them.', hours: 1.0, done: 'Sent the campaign report' },
    { id: 't13', min: 15, camp: 'social', title: 'Reply to comments', text: 'Comments sit for days. Let me reply the same day.', hours: 0.8, done: 'Replied to new comments' },
    { id: 't14', min: 8, camp: 'docs', title: 'File attachments', text: 'Attachments pile up in your inbox. Let me file them in Drive.', hours: 0.6, done: 'Filed new attachments' },
    { id: 't15', min: 5, camp: 'team', title: 'Approve time off', text: 'Time-off requests wait on you. Let me approve the routine ones.', hours: 0.5, done: 'Approved a time-off request' }
  ];

  var APPROVALS = [
    { id: 'a1', who: 'Sarah Okafor', what: 'Proposal follow-up', verb: 'Send', camp: 'clients', min: 15, log: "Sent Sarah Okafor's follow-up", src: 'tool',
      kind: 'Draft email', detail: 'Hi Sarah, following up on the proposal from Tuesday. Happy to walk through pricing on a quick call this week. Does Thursday work?',
      why: 'She opened the proposal twice and hasn\'t replied in three days.', no: 'The follow-up won\'t go out.',
      waited: 3, cost: 'She has opened the proposal twice since.' },
    { id: 'a2', who: 'Payroll', what: "Friday's run", verb: 'Approve', camp: 'money', min: 20, log: "Approved Friday's payroll", src: 'tool',
      kind: 'Payroll run', detail: "6 people, $18,420 in total. Same as last run, except Leo's overtime: +$320.",
      why: "Leo logged the overtime on Tuesday and his manager signed it off.", no: 'Payroll is on hold. Nothing gets paid until you say so.',
      waited: 1, cost: 'Payroll runs Friday. After tomorrow it goes out late.' },
    { id: 'a3', who: 'Marcus Lee', what: 'Thursday at 2', verb: 'Confirm', camp: 'mail', min: 5, log: 'Confirmed Marcus for Thursday at 2', src: 'cal',
      kind: 'Meeting move', detail: "Marcus asked to move Friday's call. Thursday 2:00 to 2:30 is free on both calendars.",
      why: 'He asked this morning. Thursday at 2 is the first time you are both free.', no: 'The call stays on Friday.',
      waited: 0, cost: 'Thursday at 2 may not stay free for long.' },
    { id: 'a4', who: 'Dana Ruiz', what: 'Answer about the launch date', verb: 'Send', camp: 'chat', min: 10, log: 'Answered Dana about the launch date', src: 'tool',
      kind: 'Draft reply', detail: 'Launch is locked for the 14th. Assets are due to you by the 9th so we have a buffer.',
      why: 'She asked in #ops yesterday and two people are waiting on the answer.', no: 'Dana keeps waiting for an answer.', waited: 1, cost: 'Two people are blocked until she hears back.' },
    { id: 'a5', who: 'Invoice 1042', what: 'Second reminder', verb: 'Send', camp: 'money', min: 8, log: 'Sent the second reminder for invoice 1042', src: 'tool',
      kind: 'Payment reminder', detail: 'A friendly nudge for $6,200, now 14 days late, with the payment link.',
      why: 'The first reminder went out a week ago with no reply.', no: 'The invoice stays unpaid for now.', waited: 2, cost: '$6,200 is 14 days late.' },
    { id: 'a6', who: 'Kestrel Co.', what: 'Move to Proposal', verb: 'Move', camp: 'clients', min: 6, log: 'Moved Kestrel to Proposal', src: 'tool',
      kind: 'Deal update', detail: 'Move Kestrel from Discovery to Proposal and draft the proposal from the call notes.',
      why: 'On Tuesday\'s call they asked for pricing by Friday.', no: 'Kestrel stays in Discovery.', waited: 1, cost: 'They asked for pricing by Friday.' },
    { id: 'a7', who: 'Quarterly planning', what: 'Decline, it\'s on your Friday', verb: 'Decline', camp: 'mail', min: 12, log: 'Declined the Friday planning meeting', src: 'cal',
      kind: 'Meeting decline', detail: 'Decline politely and offer Monday at 10 or Tuesday at 3 instead.',
      why: 'It lands on your protected Friday block.', no: 'The meeting stays on your Friday.', waited: 0, cost: 'Your Friday block is the next thing to go.' },
    { id: 'a8', who: 'Q4 launch', what: 'Turn 5 emails into tasks', verb: 'Create', camp: 'projects', min: 14, log: 'Turned 5 emails into Q4 launch tasks', src: 'tool',
      kind: 'New tasks', detail: 'Five action items from this week\'s email, each with an owner and a due date.',
      why: 'They\'re sitting in your inbox with nobody assigned.', no: 'The items stay in your inbox.', waited: 1, cost: 'Nobody owns them yet.' },
    { id: 'a9', who: '8 tickets', what: 'Password resets', verb: 'Send', camp: 'support', min: 24, log: 'Answered 8 password resets', src: 'tool',
      kind: 'Ticket replies', detail: 'The usual reset steps, sent to all eight customers at once.',
      why: 'They came in overnight and they\'re all the same question.', no: 'The tickets stay open.', waited: 0, cost: 'Eight customers can\'t log in.' },
    { id: 'a10', who: 'Board deck', what: 'Share with the board', verb: 'Share', camp: 'docs', min: 5, log: 'Shared the board deck', src: 'tool',
      kind: 'File share', detail: 'View-only link to the five board members, with comments on.',
      why: 'The meeting is Thursday and they asked for it two days ahead.', no: 'The deck stays private.', waited: 1, cost: 'The board asked for it two days ahead.' },
    { id: 'a11', who: 'Spring launch', what: 'Schedule the newsletter', verb: 'Schedule', camp: 'marketing', min: 25, log: 'Scheduled the spring launch newsletter', src: 'tool',
      kind: 'Campaign', detail: 'Tuesday 9:00 to 4,200 subscribers. Subject: Spring is here.',
      why: 'Tuesday mornings get your best open rates.', no: 'The newsletter waits.', waited: 0, cost: 'Miss Tuesday and it slides a week.' },
    { id: 'a12', who: '9 comments', what: 'Reply on the launch reel', verb: 'Post', camp: 'social', min: 20, log: 'Replied to 9 comments on the launch reel', src: 'tool',
      kind: 'Comment replies', detail: 'Short replies in your voice, thanking people and answering two questions about price.',
      why: 'Comments answered the same day get far more replies back.', no: 'The comments go unanswered for now.', waited: 1, cost: 'Two people asked about price.' },
    { id: 'a13', who: 'Order 2207', what: 'Refund a damaged item', verb: 'Refund', camp: 'store', min: 10, log: 'Refunded order 2207', src: 'tool',
      kind: 'Refund', detail: '$84 back to the original card, with an apology and a 10% code.',
      why: 'The customer sent a photo of the damage this morning.', no: 'The customer waits for an answer.', waited: 0, cost: 'An unhappy customer, waiting.' },
    { id: 'a14', who: 'Leo', what: 'Time off, Dec 22 to 29', verb: 'Approve', camp: 'team', min: 5, log: 'Approved Leo\'s time off', src: 'tool',
      kind: 'Time off', detail: 'Six days. Nobody else on the team is off then.',
      why: 'It fits the holiday plan and his work is covered.', no: 'The request stays pending.', waited: 2, cost: 'He\'s waiting to book flights.' }
  ];

  // Work Sherpa finishes in your connected camps once you reach Base Camp. Minutes are the time each
  // task would have taken you. Nothing here counts until Sherpa has actually done it.
  var TASKS = [
    { text: 'Sent invoice 1042', camp: 'money', min: 6, src: 'tool' },
    { text: 'Booked Marcus for Thursday', camp: 'mail', min: 9, src: 'cal' },
    { text: 'Answered 4 clients', camp: 'mail', min: 32, src: 'tool' },
    { text: 'Moved Halcyon to Proposal', camp: 'clients', min: 4, src: 'tool' },
    { text: 'Logged Kestrel call notes', camp: 'clients', min: 12, src: 'tool' },
    { text: 'Replied in the ops channel', camp: 'chat', min: 5, src: 'tool' },
    { text: 'Declined 2 meetings on Friday', camp: 'mail', min: 60, src: 'cal' },
    { text: 'Paid 3 bills', camp: 'money', min: 18, src: 'tool' },
    { text: 'Drafted 6 replies', camp: 'chat', min: 41, src: 'tool' },
    { text: 'Sent 2 proposals', camp: 'clients', min: 38, src: 'tool' },
    { text: 'Turned 5 emails into tasks', camp: 'projects', min: 14, src: 'tool' },
    { text: 'Answered 8 password resets', camp: 'support', min: 24, src: 'tool' },
    { text: 'Filed 12 documents', camp: 'docs', min: 15, src: 'tool' },
    { text: 'Scheduled the newsletter', camp: 'marketing', min: 25, src: 'tool' },
    { text: 'Replied to 9 comments', camp: 'social', min: 20, src: 'tool' },
    { text: 'Answered 5 order questions', camp: 'store', min: 22, src: 'tool' },
    { text: "Prepared Friday's payroll", camp: 'team', min: 30, src: 'tool' }
  ];

  // Today's step: the one thing each day only you can do. Sherpa starts it first (started; short is the
  // one-line version for the card), so you review instead of facing a blank page. block: minutes to protect for it. saved: the drafting Sherpa did, counted
  // once you finish the step. log: how it reads in the trail log.
  var STEPS = [
    { id: 's1', short: 'Draft ready. You set the price.', camp: 'clients', title: 'Finish the Northwind proposal', block: 45, saved: 60, log: 'Drafted the Northwind proposal',
      started: 'I drafted it from Tuesday\'s call: scope, timeline and the v3 pricing. It\'s about 80% there. Only you can sign off the price.',
      draft: 'Northwind · Proposal v4. Scope: the spring rebrand across web, social and print. Timeline: six weeks from sign-off. Price: $48,000, as in v3, with the print run now included. Next step: a 20-minute call to walk through it.' },
    { id: 's2', short: 'Draft ready. You decide the hires.', camp: 'mail', title: 'Answer the board on Q4', block: 30, saved: 40, log: 'Drafted your Q4 board reply',
      started: 'I pulled the numbers from the board deck and wrote a first reply. It needs your call on the two hires.',
      draft: 'Hi all, Q4 is tracking 6% ahead on revenue and on plan for spend. The open question is the two hires. My recommendation: [your call]. Happy to take questions on Thursday.' },
    { id: 's3', short: 'Two options ready. You pick one.', camp: 'chat', title: 'Decide the pricing change', block: 20, saved: 35, log: 'Summarised the pricing debate',
      started: 'I boiled the #ops pricing thread down to two options with the trade-offs. You pick one.',
      draft: 'Option A: raise the retainer 8% for new clients only. Simple, no churn risk. Option B: raise it 5% for everyone in January. More revenue, two clients may push back.' },
    { id: 's4', short: 'Review ready. You sign off.', camp: 'money', title: 'Sign off the Q4 budget', block: 25, saved: 45, log: 'Prepared the Q4 budget review',
      started: 'I matched this quarter\'s spend against plan and flagged the three lines that are over.',
      draft: 'Q4 budget: on plan overall. Over: software (+$1,200), contractors (+$3,400), travel (+$600). Under: ads (-$2,100). Sign off as is, or trim contractors next month.' }
  ];

  // Industries. Each one shapes the map: which camps exist (camps, in order), which four are the everyday camps
  // nearest Base Camp (core), and what each camp is called and connects to in that line of work (over).
  // plural: how the leaderboard names businesses like yours.
  var INDUSTRIES = [
    { id: 'agency', name: 'Agency', plural: 'Agency owners', icon: 'projects', blurb: 'Marketing, creative or dev shop',
      core: ['clients', 'projects', 'mail', 'money'], camps: ['clients', 'projects', 'mail', 'money', 'chat', 'docs', 'marketing', 'social', 'team'],
      over: { clients: { name: 'Clients', tools: ['HubSpot', 'Pipedrive', 'Salesforce'] }, projects: { name: 'Client work', short: 'Work', tools: ['Asana', 'ClickUp', 'Monday'] },
        money: { name: 'Invoicing', short: 'Invoicing', tools: ['Xero', 'QuickBooks', 'Stripe'] }, marketing: { name: 'New business', short: 'New biz' } } },
    { id: 'saas', name: 'SaaS / software', plural: 'SaaS founders', icon: 'chat', blurb: 'Software, apps or a platform',
      core: ['support', 'clients', 'mail', 'chat'], camps: ['support', 'clients', 'mail', 'chat', 'projects', 'money', 'marketing', 'docs', 'team', 'social'],
      over: { support: { name: 'Customer support', short: 'Support', tools: ['Intercom', 'Zendesk', 'Help Scout'] }, clients: { name: 'Sales pipeline', short: 'Sales', tools: ['HubSpot', 'Salesforce', 'Attio'] },
        chat: { name: 'Team chat', tools: ['Slack', 'Teams', 'Discord'] }, projects: { name: 'Product & roadmap', short: 'Product', tools: ['Linear', 'Jira', 'Notion'] },
        money: { name: 'Billing', short: 'Billing', tools: ['Stripe', 'Chargebee', 'QuickBooks'] } } },
    { id: 'coach', name: 'Coach or consultant', plural: 'Coaches and consultants', icon: 'clients', blurb: 'Coaching, advisory or courses',
      core: ['clients', 'mail', 'money', 'marketing'], camps: ['clients', 'mail', 'money', 'marketing', 'social', 'chat', 'docs', 'projects'],
      over: { clients: { name: 'Clients & sessions', short: 'Clients', tools: ['HoneyBook', 'Dubsado', 'HubSpot'] }, mail: { name: 'Inbox & bookings', short: 'Inbox', tools: ['Gmail', 'Outlook', 'Calendly'] },
        money: { name: 'Payments', tools: ['Stripe', 'PayPal', 'QuickBooks'] }, marketing: { name: 'Courses & email', short: 'Courses', tools: ['Kajabi', 'ConvertKit', 'Mailchimp'] },
        chat: { name: 'Community', tools: ['Circle', 'Skool', 'Slack'] } } },
    { id: 'creator', name: 'Creator', plural: 'Creators', icon: 'social', blurb: 'A personal brand that runs a business',
      core: ['social', 'clients', 'mail', 'money'], camps: ['social', 'clients', 'mail', 'money', 'marketing', 'store', 'chat', 'projects', 'docs'],
      over: { social: { name: 'Channels', tools: ['YouTube', 'Instagram', 'TikTok'] }, clients: { name: 'Brand deals', short: 'Deals', tools: ['Passionfroot', 'HubSpot', 'Notion'] },
        mail: { name: 'Inbox & DMs', short: 'Inbox' }, money: { name: 'Income', tools: ['Stripe', 'PayPal', 'QuickBooks'] }, marketing: { name: 'Newsletter', tools: ['beehiiv', 'ConvertKit', 'Mailchimp'] },
        store: { name: 'Merch & products', short: 'Merch', tools: ['Shopify', 'Gumroad', 'Stan'] }, chat: { name: 'Community', tools: ['Discord', 'Circle', 'Patreon'] },
        projects: { name: 'Content pipeline', short: 'Content', tools: ['Notion', 'Trello', 'Asana'] } } },
    { id: 'ecom', name: 'Online store', plural: 'Store owners', icon: 'store', blurb: 'Selling products online',
      core: ['store', 'support', 'mail', 'money'], camps: ['store', 'support', 'mail', 'money', 'marketing', 'social', 'docs', 'team', 'chat', 'projects'],
      over: { store: { name: 'Store', tools: ['Shopify', 'WooCommerce', 'BigCommerce'] }, support: { name: 'Customer service', short: 'Service', tools: ['Gorgias', 'Zendesk', 'Help Scout'] },
        money: { name: 'Finance', tools: ['QuickBooks', 'Xero', 'Stripe'] }, marketing: { name: 'Email & SMS', short: 'Email', tools: ['Klaviyo', 'Mailchimp', 'Attentive'] },
        projects: { name: 'Suppliers & stock', short: 'Stock', tools: ['Notion', 'Airtable', 'Asana'] } } },
    { id: 'trades', name: 'Trades & local services', plural: 'Trades businesses', icon: 'team', blurb: 'Contractors, clinics, salons, field crews',
      core: ['clients', 'mail', 'money', 'team'], camps: ['clients', 'mail', 'money', 'team', 'marketing', 'social', 'docs', 'chat'],
      over: { clients: { name: 'Jobs & quotes', short: 'Jobs', tools: ['Jobber', 'ServiceTitan', 'Housecall Pro'] }, mail: { name: 'Calls & calendar', short: 'Calendar', tools: ['Gmail', 'Outlook', 'Google Calendar'] },
        money: { name: 'Invoicing', short: 'Invoicing', tools: ['QuickBooks', 'Square', 'Stripe'] }, team: { name: 'Crew & scheduling', short: 'Crew', tools: ['Jobber', 'Deputy', 'Gusto'] },
        marketing: { name: 'Reviews & ads', short: 'Reviews', tools: ['Google Business', 'Yelp', 'Meta Ads'] } } },
    // Anything else: the basic layout, every camp under its plain name.
    { id: 'other', name: 'Other', plural: 'Other businesses', icon: 'base', blurb: 'Something else',
      core: ['mail', 'chat', 'clients', 'money'], camps: ['mail', 'chat', 'clients', 'money', 'projects', 'support', 'docs', 'marketing', 'social', 'store', 'team'], over: {} }
  ];

  var MODELS = [
    { id: 'Claude', by: 'Anthropic' },
    { id: 'ChatGPT', by: 'OpenAI' },
    { id: 'Gemini', by: 'Google' },
    { id: 'Other', by: 'Any other model' }
  ];

  var WHY = ['Family', 'Health', 'Rest', 'Travel', 'Friends', 'Hobbies', 'Learning', 'Deep work', 'Selling', 'The next venture'];

  // Example hikers for the leaderboard. Invented people, generated the same way every time. week: hours saved in
  // the last seven days; all: hours saved since they started; summits reached; streak in days.
  var HIKERS = (function () {
    var first = ['Ava', 'Noah', 'Mia', 'Leo', 'Zara', 'Kai', 'Ines', 'Omar', 'Priya', 'Theo', 'Lena', 'Mateo', 'Hana', 'Felix', 'Nora', 'Arjun', 'Elif', 'Jonas', 'Yuki', 'Rosa', 'Sami', 'Clara', 'Diego', 'Freya', 'Idris', 'Lucia', 'Max', 'Amara', 'Tomas', 'Wren'];
    var places = ['Austin', 'Leeds', 'Lisbon', 'Toronto', 'Melbourne', 'Berlin', 'Denver', 'Cape Town', 'Dublin', 'Auckland', 'Portland', 'Oslo', 'Nairobi', 'Madrid', 'Vancouver'];
    var seed = 20261003, out = [];
    function r() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
    for (var i = 0; i < 240; i++) {
      var week = Math.round(Math.pow(r(), 1.6) * 34 * 10) / 10, weeks = 1 + Math.floor(r() * 40);
      out.push({ name: first[Math.floor(r() * first.length)] + ' ' + 'ABCDEFGHJKLMNOPRSTVW'.charAt(Math.floor(r() * 20)) + '.', place: places[Math.floor(r() * places.length)],
        type: ['agency', 'saas', 'coach', 'creator', 'ecom', 'trades', 'other'][Math.floor(r() * 7)], week: week, all: Math.round((week * weeks * (0.6 + r() * 0.5)) * 10) / 10, summits: Math.floor(weeks / (4 + r() * 6)), streak: Math.floor(r() * Math.min(60, weeks * 7)) });
    }
    return out;
  })();

  return { CAMPS: CAMPS, TRAILS: TRAILS, APPROVALS: APPROVALS, TASKS: TASKS, MODELS: MODELS, WHY: WHY, HIKERS: HIKERS, STEPS: STEPS, INDUSTRIES: INDUSTRIES, ALL_CAMPS: CAMPS.slice() };
})();
