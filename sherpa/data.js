/* Apex Sherpa: example data. Everything here is invented for the demo. */
window.SHERPA_DATA = (function () {
  'use strict';

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

  // Trails: work Sherpa offers to take over. Each one raises how much time Sherpa can save you;
  // the time only counts once Sherpa has actually done the work (done: how each finished task reads in the log).
  var TRAILS = [
    { id: 't1', camp: 'clients', title: 'Send invoices on signing', text: '14 invoices sent by hand. Let me send them the moment a deal signs.', hours: 1.5, done: 'Sent an invoice the moment a deal signed' },
    { id: 't2', camp: 'mail', title: 'Handle rescheduling', text: 'You move 9 meetings a week. Let me handle the back and forth.', hours: 1.2, done: 'Rescheduled a meeting for you' },
    { id: 't3', camp: 'clients', title: 'Draft proposal follow-ups', text: 'Follow-ups wait 3 days on average. Let me draft them the next morning.', hours: 1.0, done: 'Drafted a proposal follow-up' },
    { id: 't4', camp: 'mail', title: 'Guard your Fridays', text: 'Meetings keep landing on your Friday block. Let me decline them.', hours: 1.0, done: 'Declined a meeting on your Friday block' },
    { id: 't5', camp: 'chat', title: 'Answer repeat questions', text: 'The same five questions come up in #ops. Let me answer them.', hours: 0.9, done: 'Answered a repeat question in #ops' },
    { id: 't6', camp: 'projects', title: 'Emails to tasks', text: 'Action items die in your inbox. Let me turn them into tasks.', hours: 0.8, done: 'Turned emails into tasks' },
    { id: 't7', camp: 'money', title: 'Chase late invoices', text: 'Late invoices sit for two weeks. Let me send the reminders.', hours: 0.7, done: 'Chased a late invoice' },
    { id: 't8', camp: 'chat', title: 'One evening summary', text: 'Let me send one summary at 6 instead of 40 pings.', hours: 0.6, done: 'Sent your evening summary' },
    { id: 't9', camp: 'support', title: 'Answer password resets', text: 'Half your tickets are password resets. Let me answer them.', hours: 0.6, done: 'Answered password resets' },
    { id: 't10', camp: 'money', title: 'Sort expenses', text: 'Let me sort expenses as they come in.', hours: 0.5, done: 'Sorted new expenses' },
    { id: 't11', camp: 'store', title: 'Answer order questions', text: '"Where\'s my order?" is a third of your inbox. Let me answer it.', hours: 1.2, done: 'Answered an order question' },
    { id: 't12', camp: 'marketing', title: 'Weekly campaign report', text: 'You pull campaign numbers by hand every Monday. Let me send them.', hours: 1.0, done: 'Sent the campaign report' },
    { id: 't13', camp: 'social', title: 'Reply to comments', text: 'Comments sit for days. Let me reply the same day.', hours: 0.8, done: 'Replied to new comments' },
    { id: 't14', camp: 'docs', title: 'File attachments', text: 'Attachments pile up in your inbox. Let me file them in Drive.', hours: 0.6, done: 'Filed new attachments' },
    { id: 't15', camp: 'team', title: 'Approve time off', text: 'Time-off requests wait on you. Let me approve the routine ones.', hours: 0.5, done: 'Approved a time-off request' }
  ];

  var APPROVALS = [
    { id: 'a1', who: 'Sarah Okafor', what: 'Proposal follow-up', verb: 'Send', camp: 'clients', min: 15, log: "Sent Sarah Okafor's follow-up", src: 'tool',
      kind: 'Draft email', detail: 'Hi Sarah, following up on the proposal from Tuesday. Happy to walk through pricing on a quick call this week. Does Thursday work?',
      why: 'She opened the proposal twice and hasn\'t replied in three days.', no: 'The follow-up won\'t go out.' },
    { id: 'a2', who: 'Payroll', what: "Friday's run", verb: 'Approve', camp: 'money', min: 20, log: "Approved Friday's payroll", src: 'tool',
      kind: 'Payroll run', detail: "6 people, $18,420 in total. Same as last run, except Leo's overtime: +$320.",
      why: "Leo logged the overtime on Tuesday and his manager signed it off.", no: 'Payroll is on hold. Nothing gets paid until you say so.' },
    { id: 'a3', who: 'Marcus Lee', what: 'Thursday at 2', verb: 'Confirm', camp: 'mail', min: 5, log: 'Confirmed Marcus for Thursday at 2', src: 'cal',
      kind: 'Meeting move', detail: "Marcus asked to move Friday's call. Thursday 2:00 to 2:30 is free on both calendars.",
      why: 'He asked this morning. Thursday at 2 is the first time you are both free.', no: 'The call stays on Friday.' }
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

  var MODELS = [
    { id: 'Claude', by: 'Anthropic' },
    { id: 'GPT', by: 'OpenAI' },
    { id: 'Gemini', by: 'Google' },
    { id: 'Llama', by: 'Meta, open source' }
  ];

  var WHY = ['Family', 'Deep work', 'Health', 'Selling', 'The next venture', 'Rest'];

  return { CAMPS: CAMPS, TRAILS: TRAILS, APPROVALS: APPROVALS, TASKS: TASKS, MODELS: MODELS, WHY: WHY };
})();
