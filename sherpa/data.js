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
      named: [['Password resets', 0]] }
  ];

  // Trails: work Sherpa offers to take over. Each one adds to your elevation.
  var TRAILS = [
    { id: 't1', camp: 'clients', title: 'Send invoices on signing', text: '14 invoices sent by hand. Let me send them the moment a deal signs.', hours: 1.5 },
    { id: 't2', camp: 'mail', title: 'Handle rescheduling', text: 'You move 9 meetings a week. Let me handle the back and forth.', hours: 1.2 },
    { id: 't3', camp: 'clients', title: 'Draft proposal follow-ups', text: 'Follow-ups wait 3 days on average. Let me draft them the next morning.', hours: 1.0 },
    { id: 't4', camp: 'mail', title: 'Guard your Fridays', text: 'Meetings keep landing on your Friday block. Let me decline them.', hours: 1.0 },
    { id: 't5', camp: 'chat', title: 'Answer repeat questions', text: 'The same five questions come up in #ops. Let me answer them.', hours: 0.9 },
    { id: 't6', camp: 'projects', title: 'Emails to tasks', text: 'Action items die in your inbox. Let me turn them into tasks.', hours: 0.8 },
    { id: 't7', camp: 'money', title: 'Chase late invoices', text: 'Late invoices sit for two weeks. Let me send the reminders.', hours: 0.7 },
    { id: 't8', camp: 'chat', title: 'One evening summary', text: 'Let me send one summary at 6 instead of 40 pings.', hours: 0.6 },
    { id: 't9', camp: 'support', title: 'Answer password resets', text: 'Half your tickets are password resets. Let me answer them.', hours: 0.6 },
    { id: 't10', camp: 'money', title: 'Sort expenses', text: 'Let me sort expenses as they come in.', hours: 0.5 }
  ];

  var APPROVALS = [
    { id: 'a1', who: 'Sarah Okafor', what: 'Proposal follow-up', verb: 'Send', camp: 'clients', min: 15, log: "Sent Sarah Okafor's follow-up", src: 'tool' },
    { id: 'a2', who: 'Payroll', what: "Friday's run", verb: 'Approve', camp: 'money', min: 20, log: "Approved Friday's payroll", src: 'tool' },
    { id: 'a3', who: 'Marcus Lee', what: 'Thursday at 2', verb: 'Confirm', camp: 'mail', min: 5, log: 'Confirmed Marcus for Thursday at 2', src: 'cal' }
  ];

  var LOG = [
    { id: 'l1', day: 'Today', time: '08:12', text: 'Sent invoice 1042', camp: 'money', min: 6, src: 'tool' },
    { id: 'l2', day: 'Today', time: '07:40', text: 'Booked Marcus for Thursday', camp: 'mail', min: 9, src: 'cal' },
    { id: 'l3', day: 'Today', time: '06:55', text: 'Answered 4 clients', camp: 'mail', min: 32, src: 'tool' },
    { id: 'l4', day: 'Today', time: '06:30', text: 'Moved Halcyon to Proposal', camp: 'clients', min: 4, src: 'tool' },
    { id: 'l5', day: 'Today', time: '06:10', text: 'Logged Kestrel call notes', camp: 'clients', min: 12, src: 'tool' },
    { id: 'l6', day: 'Today', time: '05:50', text: 'Replied in the ops channel', camp: 'chat', min: 5, src: 'tool' },
    { id: 'l7', day: 'Yesterday', time: '17:45', text: 'Declined 2 meetings on Friday', camp: 'mail', min: 60, src: 'cal' },
    { id: 'l8', day: 'Yesterday', time: '15:10', text: 'Paid 3 bills', camp: 'money', min: 18, src: 'tool' },
    { id: 'l9', day: 'Yesterday', time: '11:02', text: 'Drafted 6 replies', camp: 'chat', min: 41, src: 'tool' },
    { id: 'l10', day: 'Yesterday', time: '09:30', text: 'Sent 2 proposals', camp: 'clients', min: 38, src: 'tool' },
    { id: 'l11', day: 'Yesterday', time: '08:05', text: 'Turned 5 emails into tasks', camp: 'projects', min: 14, src: 'tool' },
    { id: 'l12', day: 'Yesterday', time: '07:20', text: 'Answered 8 password resets', camp: 'support', min: 24, src: 'tool' }
  ];

  var MODELS = [
    { id: 'Claude', by: 'Anthropic' },
    { id: 'GPT', by: 'OpenAI' },
    { id: 'Gemini', by: 'Google' },
    { id: 'Llama', by: 'Meta, open source' }
  ];

  var WHY = ['Family', 'Deep work', 'Health', 'Selling', 'The next venture', 'Rest'];

  return { CAMPS: CAMPS, TRAILS: TRAILS, APPROVALS: APPROVALS, LOG: LOG, MODELS: MODELS, WHY: WHY };
})();
