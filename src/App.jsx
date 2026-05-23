import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'oslegal_roles_ai_v2';
const SESSION_KEY = 'oslegal_roles_ai_session';
const LANG_KEY = 'oslegal_roles_ai_lang';

const roles = {
  manager: 'Manager User',
  lawfirm: 'Law Firm User',
  client: 'Client User'
};

const roleLabels = {
  manager: 'Manager',
  lawfirm: 'Law Firm',
  client: 'Client'
};

const tAr = {
  Dashboard: 'لوحة التحكم',
  Leads: 'العملاء المحتملون',
  Matters: 'الملفات',
  Calendar: 'التقويم',
  Templates: 'النماذج',
  Phonebook: 'دليل الهاتف',
  AI: 'الذكاء الاصطناعي',
  Users: 'المستخدمون',
  Settings: 'الإعدادات',
  'Client Portal': 'بوابة العميل',
  Documents: 'المستندات',
  Updates: 'التحديثات',
  'New Matter': 'ملف جديد',
  'New Lead': 'عميل محتمل جديد',
  Create: 'إنشاء',
  Save: 'حفظ',
  Convert: 'تحويل',
  Copy: 'نسخ',
  Login: 'دخول',
  Logout: 'خروج',
  Username: 'اسم المستخدم',
  Password: 'كلمة المرور',
  Role: 'الدور',
  Manager: 'مدير',
  'Law Firm': 'موظف المكتب',
  Client: 'عميل',
  Matter: 'ملف',
  Client: 'العميل',
  Opponent: 'الخصم',
  Stage: 'المرحلة',
  Status: 'الحالة',
  Owner: 'المسؤول',
  Deadline: 'الموعد',
  Priority: 'الأولوية',
  Type: 'النوع',
  Forum: 'الجهة',
  Email: 'البريد',
  Phone: 'الهاتف',
  Name: 'الاسم',
  Title: 'العنوان',
  Date: 'التاريخ',
  Location: 'الموقع',
  Notes: 'ملاحظات',
  Facts: 'الوقائع',
  'Next Step': 'الخطوة التالية',
  'Active Matters': 'الملفات النشطة',
  'Open Leads': 'العملاء المحتملون',
  'Urgent Dates': 'المواعيد العاجلة',
  'Outstanding Fees': 'الأتعاب المستحقة',
  'Document Templates': 'نماذج المستندات',
  'Email Templates': 'نماذج البريد',
  'Legal Notices': 'الإنذارات القانونية',
  Contracts: 'العقود',
  'Engagement Letters': 'خطابات التعاقد',
  'Client Updates': 'تحديثات العملاء',
  'AI Assistant': 'مساعد الذكاء الاصطناعي',
  Generate: 'توليد',
  'Select Matter': 'اختر الملف',
  'Select Template': 'اختر النموذج',
  'Client Visible': 'ظاهر للعميل',
  'Internal Only': 'داخلي فقط',
  'My Matters': 'ملفاتي',
  'My Documents': 'مستنداتي',
  'My Updates': 'تحديثاتي',
  Active: 'نشط',
  Closed: 'مغلق',
  Pending: 'قيد الانتظار',
  Received: 'تم الاستلام',
  Draft: 'مسودة',
  Sent: 'مرسل',
  High: 'مرتفع',
  Normal: 'عادي',
  Urgent: 'عاجل',
  'New Enquiry': 'استفسار جديد',
  'Conflict Check': 'فحص التعارض',
  'Engagement Letter': 'خطاب التعاقد',
  'Legal Notice': 'إنذار قانوني',
  'Filing / Registration': 'القيد / التسجيل',
  'Hearing / Investigation': 'جلسة / تحقيق',
  'Judgment / Award': 'حكم / قرار',
  'Execution / Recovery': 'تنفيذ / تحصيل'
};

const matterTypes = [
  'Commercial / Civil Recovery',
  'Criminal Complaint',
  'Employment / Labour',
  'Real Estate / Tenancy',
  'Corporate / Contract',
  'DIFC / Arbitration',
  'Family / Settlement',
  'Travel Ban / Police Inquiry',
  'Insurance / Sanadak',
  'Intellectual Property'
];

const forums = [
  'Dubai Courts',
  'DIFC Courts',
  'Abu Dhabi Courts',
  'Federal Courts',
  'Rental Dispute Centre',
  'MOHRE',
  'Dubai Police / Public Prosecution',
  'DIAC Arbitration',
  'Sanadak / Insurance Dispute',
  'Notary / DED / Government Authority',
  'Other'
];

const stages = [
  'New Enquiry',
  'Conflict Check',
  'Engagement Letter',
  'Legal Notice',
  'Filing / Registration',
  'Hearing / Investigation',
  'Judgment / Award',
  'Execution / Recovery',
  'Closed'
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
}

function money(value) {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function daysUntil(date) {
  if (!date) return null;
  return Math.ceil((new Date(date) - new Date(today())) / 86400000);
}

function dueLabel(date) {
  const diff = daysUntil(date);
  if (diff === null) return '-';
  if (diff < 0) return `${Math.abs(diff)} day(s) overdue`;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `In ${diff} days`;
}

function seed() {
  const cli1 = 'CLI-001';
  const cli2 = 'CLI-002';
  const mat1 = 'MAT-001';
  const mat2 = 'MAT-002';

  return {
    firm: {
      name: 'OS Legal',
      email: 'info@oslegal.ae',
      phone: '+971 56 333 3108',
      whatsapp: '971563333108'
    },
    users: [
      {
        id: 'USR-001',
        username: 'manager',
        password: 'Manager@123',
        role: 'manager',
        name: 'Omar Manager',
        email: 'manager@oslegal.ae'
      },
      {
        id: 'USR-002',
        username: 'lawyer',
        password: 'Lawyer@123',
        role: 'lawfirm',
        name: 'OS Legal Lawyer',
        email: 'lawyer@oslegal.ae'
      },
      {
        id: 'USR-003',
        username: 'client',
        password: 'Client@123',
        role: 'client',
        name: 'Demo Client',
        email: 'client@example.com',
        clientId: cli1
      }
    ],
    clients: [
      { id: cli1, name: 'Demo Trading LLC', type: 'Company', email: 'client@example.com', phone: '+971 50 000 0000', identity: 'TL-000000', address: 'Dubai' },
      { id: cli2, name: 'Demo Employee', type: 'Individual', email: 'employee@example.com', phone: '+971 55 000 0000', identity: 'Passport pending', address: 'Dubai' }
    ],
    phonebook: [
      { id: 'PB-001', name: 'Dubai Courts', type: 'Court', phone: '+971 4 000 0000', email: '', notes: 'Court contact placeholder' },
      { id: 'PB-002', name: 'Demo Client', type: 'Client', phone: '+971 50 000 0000', email: 'client@example.com', notes: 'Primary client contact' },
      { id: 'PB-003', name: 'Hozaifa', type: 'Team', phone: '', email: 'hozaifa@oslegal.ae', notes: 'Legal researcher' }
    ],
    leads: [
      { id: 'LEAD-001', name: 'New Company Enquiry', email: 'lead@example.com', phone: '+971 52 000 0000', type: 'Commercial / Civil Recovery', forum: 'Dubai Courts', opponent: 'Potential Debtor LLC', stage: 'New Enquiry', priority: 'High', owner: 'Omar', followup: addDays(1), facts: 'Potential unpaid invoice dispute.' }
    ],
    matters: [
      {
        id: mat1,
        ref: 'OSL-2026-001',
        title: 'Commercial Recovery Claim',
        clientId: cli1,
        client: 'Demo Trading LLC',
        email: 'client@example.com',
        phone: '+971 50 000 0000',
        type: 'Commercial / Civil Recovery',
        forum: 'Dubai Courts',
        opponent: 'Counterparty LLC',
        stage: 'Legal Notice',
        status: 'Active',
        owner: 'Omar',
        priority: 'High',
        deadline: addDays(5),
        claimAmount: 250000,
        professionalFee: 30000,
        courtFee: 15000,
        paid: 15000,
        facts: 'Unpaid invoices for completed services. Legal notice is pending final approval.',
        nextStep: 'Serve legal notice and prepare statement of claim if no settlement is reached.'
      },
      {
        id: mat2,
        ref: 'OSL-2026-002',
        title: 'Employment Final Settlement Claim',
        clientId: cli2,
        client: 'Demo Employee',
        email: 'employee@example.com',
        phone: '+971 55 000 0000',
        type: 'Employment / Labour',
        forum: 'DIFC Courts',
        opponent: 'Former Employer Ltd',
        stage: 'Filing / Registration',
        status: 'Active',
        owner: 'Hozaifa',
        priority: 'Normal',
        deadline: addDays(10),
        claimAmount: 78000,
        professionalFee: 20000,
        courtFee: 3000,
        paid: 10000,
        facts: 'Unpaid salary, gratuity and withheld final settlement.',
        nextStep: 'Prepare claim summary, calculate dues and confirm documents.'
      }
    ],
    documents: [
      { id: 'DOC-001', matterId: mat1, name: 'Trade licence / ID', status: 'Received', requiredBy: addDays(2), clientVisible: true },
      { id: 'DOC-002', matterId: mat1, name: 'Agreement / invoice', status: 'Pending', requiredBy: addDays(2), clientVisible: true },
      { id: 'DOC-003', matterId: mat2, name: 'Employment contract', status: 'Pending', requiredBy: addDays(3), clientVisible: true }
    ],
    tasks: [
      { id: 'TASK-001', matterId: mat1, title: 'Send approved legal notice', owner: 'Omar', due: addDays(1), priority: 'High', status: 'Pending' },
      { id: 'TASK-002', matterId: mat2, title: 'Prepare dues calculation', owner: 'Hozaifa', due: addDays(2), priority: 'High', status: 'Pending' }
    ],
    events: [
      { id: 'EVT-001', matterId: mat1, type: 'Court hearing', title: 'Legal notice follow-up date', date: addDays(5), time: '10:00', location: 'Dubai Courts', status: 'Scheduled' },
      { id: 'EVT-002', matterId: mat2, type: 'Filing deadline', title: 'Employment claim filing deadline', date: addDays(10), time: '', location: 'DIFC Courts', status: 'Scheduled' }
    ],
    updates: [
      { id: 'UPD-001', matterId: mat1, date: today(), title: 'Legal notice prepared', message: 'The legal notice has been prepared and is awaiting final approval before service.', clientVisible: true },
      { id: 'UPD-002', matterId: mat2, date: today(), title: 'Documents requested', message: 'We requested the employment contract and final salary records.', clientVisible: true }
    ],
    templates: [
      {
        id: 'TPL-CON-001',
        type: 'Contract',
        name: 'Basic Settlement Agreement',
        language: 'English',
        subject: 'Settlement Agreement — {matter_ref}',
        body: 'SETTLEMENT AGREEMENT\\n\\nThis Settlement Agreement is made between {client} and {opponent}.\\n\\nMatter: {matter_ref} — {matter_title}\\n\\nBackground:\\n{facts}\\n\\nTerms:\\n1. The parties agree to settle the dispute amicably.\\n2. The payment and obligations shall be confirmed in writing.\\n3. Each party shall comply with the settlement terms.\\n\\nSigned by the parties.'
      },
      {
        id: 'TPL-ENG-001',
        type: 'Engagement Letter',
        name: 'Standard Engagement Letter',
        language: 'English',
        subject: 'Engagement Letter — {matter_ref}',
        body: 'Dear {client},\\n\\nWe are pleased to confirm our engagement in relation to {matter_title}.\\n\\nScope of work:\\n{next_step}\\n\\nProfessional fees and government/court fees shall be confirmed separately.\\n\\nBest regards,\\n{firm}'
      },
      {
        id: 'TPL-NOT-001',
        type: 'Legal Notice',
        name: 'Payment Demand Legal Notice',
        language: 'English',
        subject: 'Legal Notice — {matter_ref}',
        body: 'WITHOUT PREJUDICE\\n\\nTo: {opponent}\\n\\nWe act for {client}.\\n\\nOur client has instructed us regarding {matter_title}. The relevant background is as follows:\\n{facts}\\n\\nAccordingly, you are hereby requested to remedy the breach and settle the outstanding amounts within the legal notice period, failing which our client reserves all rights to commence legal proceedings without further notice.\\n\\nOS Legal'
      },
      {
        id: 'TPL-UPD-001',
        type: 'Client Update',
        name: 'General Client Update Email',
        language: 'English',
        subject: 'Update regarding {matter_ref} — {matter_title}',
        body: 'Dear {client},\\n\\nWe would like to update you regarding your matter {matter_ref} — {matter_title}.\\n\\nCurrent stage: {stage}\\nNext deadline/date: {deadline}\\n\\nNext step:\\n{next_step}\\n\\nBest regards,\\n{firm}'
      },
      {
        id: 'TPL-AR-UPD-001',
        type: 'Client Update',
        name: 'تحديث عام للعميل',
        language: 'Arabic',
        subject: 'تحديث بخصوص الملف {matter_ref} — {matter_title}',
        body: 'السيد/السيدة {client} المحترم/ة،\\n\\nنود إفادتكم بآخر المستجدات بخصوص ملفكم رقم {matter_ref} — {matter_title}.\\n\\nالمرحلة الحالية: {stage}\\nالموعد القادم: {deadline}\\n\\nالخطوة التالية:\\n{next_step}\\n\\nمع خالص التحية،\\n{firm}'
      }
    ],
    emails: [],
    aiHistory: []
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seed();
  } catch {
    return seed();
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function fillTemplate(template, matter, firm) {
  const values = {
    client: matter?.client || '',
    opponent: matter?.opponent || '',
    matter_ref: matter?.ref || '',
    matter_title: matter?.title || '',
    stage: matter?.stage || '',
    deadline: matter?.deadline || 'To be confirmed',
    next_step: matter?.nextStep || '',
    facts: matter?.facts || '',
    forum: matter?.forum || '',
    firm: firm?.name || 'OS Legal',
    owner: matter?.owner || ''
  };

  const replace = (text) => String(text || '').replace(/\{([a-z_]+)\}/g, (_, key) => values[key] ?? '');
  return {
    subject: replace(template?.subject || ''),
    body: replace(template?.body || '')
  };
}

function roleNav(role) {
  if (role === 'client') {
    return [
      ['portal', 'Client Portal'],
      ['documents', 'Documents'],
      ['updates', 'Updates'],
      ['settings', 'Settings']
    ];
  }

  if (role === 'lawfirm') {
    return [
      ['dashboard', 'Dashboard'],
      ['leads', 'Leads'],
      ['matters', 'Matters'],
      ['calendar', 'Calendar'],
      ['templates', 'Templates'],
      ['phonebook', 'Phonebook'],
      ['ai', 'AI'],
      ['settings', 'Settings']
    ];
  }

  return [
    ['dashboard', 'Dashboard'],
    ['leads', 'Leads'],
    ['matters', 'Matters'],
    ['calendar', 'Calendar'],
    ['templates', 'Templates'],
    ['phonebook', 'Phonebook'],
    ['ai', 'AI'],
    ['users', 'Users'],
    ['settings', 'Settings']
  ];
}

function Card({ title, action, children }) {
  return (
    <section className="card">
      <div className="cardHeader">
        <h2>{title}</h2>
        {action}
      </div>
      <div className="cardBody">{children}</div>
    </section>
  );
}

function Stat({ label, value }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong></div>;
}

function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

export default function App() {
  const [data, setData] = useState(loadData);
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  });
  const [lang, setLang] = useState(localStorage.getItem(LANG_KEY) || 'en');
  const [page, setPage] = useState(session?.role === 'client' ? 'portal' : 'dashboard');
  const [login, setLogin] = useState({ username: 'manager', password: 'Manager@123' });
  const [selectedMatterId, setSelectedMatterId] = useState(data.matters[0]?.id || '');
  const [toast, setToast] = useState('');

  const isArabic = lang === 'ar';
  const tr = (text) => isArabic ? (tAr[text] || text) : text;

  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    localStorage.setItem(LANG_KEY, lang);
  }, [lang, isArabic]);

  useEffect(() => {
    saveData(data);
  }, [data]);

  function updateData(fn) {
    setData((current) => {
      const copy = structuredClone(current);
      fn(copy);
      return copy;
    });
  }

  function flash(message) {
    setToast(message);
    setTimeout(() => setToast(''), 2400);
  }

  function doLogin(event) {
    event.preventDefault();

    const found = data.users.find(
      (user) => user.username === login.username && user.password === login.password
    );

    if (!found) {
      alert('Invalid username or password');
      return;
    }

    const safeSession = {
      id: found.id,
      username: found.username,
      role: found.role,
      name: found.name,
      email: found.email,
      clientId: found.clientId || null
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeSession));
    setSession(safeSession);
    setPage(found.role === 'client' ? 'portal' : 'dashboard');
  }

  function doLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  if (!session) {
    return (
      <main className="loginPage">
        <section className="loginCard">
          <div className="brandMark">OS</div>
          <h1>OS Legal CRM + AI</h1>
          <p>Role-based demo login. Replace with secure authentication before real use.</p>

          <form onSubmit={doLogin}>
            <Field label={tr('Username')}>
              <input value={login.username} onChange={(event) => setLogin({ ...login, username: event.target.value })} />
            </Field>

            <Field label={tr('Password')}>
              <input type="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} />
            </Field>

            <button className="primary full" type="submit">{tr('Login')}</button>
          </form>

          <div className="demoCredentials">
            <strong>Demo credentials</strong>
            <span>Manager: manager / Manager@123</span>
            <span>Law Firm: lawyer / Lawyer@123</span>
            <span>Client: client / Client@123</span>
          </div>

          <button className="full" onClick={() => setLang(isArabic ? 'en' : 'ar')}>{isArabic ? 'English' : 'العربية'}</button>
        </section>
      </main>
    );
  }

  const currentNav = roleNav(session.role);
  const visibleMatters = session.role === 'client'
    ? data.matters.filter((matter) => matter.clientId === session.clientId)
    : data.matters;
  const selectedMatter = visibleMatters.find((matter) => matter.id === selectedMatterId) || visibleMatters[0];

  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="logo">
          <span>OS</span>
          <small>{roleLabels[session.role]} Portal</small>
        </div>

        <nav>
          {currentNav.map(([key, label]) => (
            <button key={key} className={page === key ? 'active' : ''} onClick={() => setPage(key)}>
              {tr(label)}
            </button>
          ))}
        </nav>

        <div className="userBox">
          <strong>{session.name}</strong>
          <small>{roles[session.role]}</small>
        </div>

        <div className="sidebarFooter">
          <button onClick={() => setLang(isArabic ? 'en' : 'ar')}>{isArabic ? 'English' : 'العربية'}</button>
          <button onClick={doLogout}>{tr('Logout')}</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{tr(currentNav.find((item) => item[0] === page)?.[1] || 'Dashboard')}</h1>
            <p>{roles[session.role]} — {data.firm.name}</p>
          </div>
          {session.role !== 'client' && (
            <div className="topActions">
              <button onClick={() => addLead(updateData, setPage)}>{tr('New Lead')}</button>
              <button className="primary" onClick={() => addMatter(updateData, setPage, setSelectedMatterId, data)}>{tr('New Matter')}</button>
            </div>
          )}
        </header>

        <section className="content">
          {page === 'dashboard' && <Dashboard data={data} tr={tr} openMatter={(id) => { setSelectedMatterId(id); setPage('matters'); }} />}
          {page === 'leads' && <Leads data={data} tr={tr} updateData={updateData} />}
          {page === 'matters' && <Matters data={data} tr={tr} visibleMatters={visibleMatters} matter={selectedMatter} selectedMatterId={selectedMatter?.id} setSelectedMatterId={setSelectedMatterId} updateData={updateData} />}
          {page === 'calendar' && <Calendar data={data} tr={tr} updateData={updateData} />}
          {page === 'templates' && <Templates data={data} tr={tr} updateData={updateData} />}
          {page === 'phonebook' && <Phonebook data={data} tr={tr} updateData={updateData} />}
          {page === 'ai' && <AITool data={data} tr={tr} updateData={updateData} />}
          {page === 'users' && <Users data={data} tr={tr} updateData={updateData} />}
          {page === 'portal' && <ClientPortal data={data} tr={tr} matters={visibleMatters} />}
          {page === 'documents' && <ClientDocuments data={data} tr={tr} matters={visibleMatters} />}
          {page === 'updates' && <ClientUpdates data={data} tr={tr} matters={visibleMatters} />}
          {page === 'settings' && <Settings data={data} tr={tr} updateData={updateData} session={session} />}
        </section>
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function addLead(updateData, setPage) {
  const name = prompt('Lead name');
  if (!name) return;

  updateData((draft) => {
    draft.leads.unshift({
      id: uid('LEAD'),
      name,
      email: '',
      phone: '',
      type: matterTypes[0],
      forum: forums[0],
      opponent: '',
      stage: 'New Enquiry',
      priority: 'Normal',
      owner: 'Omar',
      followup: addDays(2),
      facts: ''
    });
  });

  setPage('leads');
}

function addMatter(updateData, setPage, setSelectedMatterId, data) {
  const clientName = prompt('Client name');
  if (!clientName) return;

  const title = prompt('Matter title') || `${matterTypes[0]} — ${clientName}`;
  const client = data.clients.find((candidate) => candidate.name.toLowerCase() === clientName.toLowerCase());

  updateData((draft) => {
    let clientId = client?.id;

    if (!clientId) {
      clientId = uid('CLI');
      draft.clients.push({
        id: clientId,
        name: clientName,
        type: 'Individual',
        email: '',
        phone: '',
        identity: '',
        address: ''
      });
    }

    const matter = {
      id: uid('MAT'),
      ref: `OSL-${new Date().getFullYear()}-${String(draft.matters.length + 1).padStart(3, '0')}`,
      title,
      clientId,
      client: clientName,
      email: client?.email || '',
      phone: client?.phone || '',
      type: matterTypes[0],
      forum: forums[0],
      opponent: '',
      stage: 'New Enquiry',
      status: 'Active',
      owner: 'Omar',
      priority: 'Normal',
      deadline: addDays(7),
      claimAmount: 0,
      professionalFee: 0,
      courtFee: 0,
      paid: 0,
      facts: '',
      nextStep: 'Complete conflict check and engagement letter.'
    };

    draft.matters.unshift(matter);
    draft.documents.push(
      { id: uid('DOC'), matterId: matter.id, name: 'Power of Attorney', status: 'Pending', requiredBy: addDays(5), clientVisible: true },
      { id: uid('DOC'), matterId: matter.id, name: 'Client ID / Trade Licence', status: 'Pending', requiredBy: addDays(5), clientVisible: true },
      { id: uid('DOC'), matterId: matter.id, name: 'Supporting evidence', status: 'Pending', requiredBy: addDays(5), clientVisible: true }
    );
    setSelectedMatterId(matter.id);
  });

  setPage('matters');
}

function Dashboard({ data, tr, openMatter }) {
  const active = data.matters.filter((matter) => matter.status !== 'Closed').length;
  const openLeads = data.leads.filter((lead) => lead.stage !== 'Retained').length;
  const urgentDates = [...data.events.map((event) => event.date), ...data.tasks.map((task) => task.due)].filter((date) => {
    const diff = daysUntil(date);
    return diff !== null && diff <= 7;
  }).length;
  const outstanding = data.matters.reduce((sum, matter) => sum + Math.max(Number(matter.professionalFee || 0) - Number(matter.paid || 0), 0), 0);

  return (
    <>
      <div className="stats">
        <Stat label={tr('Active Matters')} value={active} />
        <Stat label={tr('Open Leads')} value={openLeads} />
        <Stat label={tr('Urgent Dates')} value={urgentDates} />
        <Stat label={tr('Outstanding Fees')} value={money(outstanding)} />
      </div>

      <div className="grid two">
        <Card title={tr('Matters')}>
          <table>
            <tbody>
              {data.matters.slice(0, 7).map((matter) => (
                <tr key={matter.id} onClick={() => openMatter(matter.id)}>
                  <td><strong>{matter.ref}</strong><br /><small>{matter.title}</small></td>
                  <td>{matter.client}</td>
                  <td><Pill>{tr(matter.stage)}</Pill></td>
                  <td><small>{dueLabel(matter.deadline)}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title={tr('Calendar')}>
          {data.events.slice(0, 8).map((event) => (
            <div className="line" key={event.id}>
              <strong>{event.date}</strong>
              <span>{event.title}</span>
              <small>{event.location}</small>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}

function Leads({ data, tr, updateData }) {
  function convertLead(leadId) {
    updateData((draft) => {
      const lead = draft.leads.find((item) => item.id === leadId);
      if (!lead) return;

      let client = draft.clients.find((candidate) => candidate.name.toLowerCase() === lead.name.toLowerCase());
      if (!client) {
        client = { id: uid('CLI'), name: lead.name, type: 'Individual', email: lead.email, phone: lead.phone, identity: '', address: '' };
        draft.clients.push(client);
      }

      const matter = {
        id: uid('MAT'),
        ref: `OSL-${new Date().getFullYear()}-${String(draft.matters.length + 1).padStart(3, '0')}`,
        title: `${lead.type} — ${lead.name}`,
        clientId: client.id,
        client: lead.name,
        email: lead.email,
        phone: lead.phone,
        type: lead.type,
        forum: lead.forum,
        opponent: lead.opponent,
        stage: 'Engagement Letter',
        status: 'Active',
        owner: lead.owner,
        priority: lead.priority,
        deadline: lead.followup || addDays(7),
        claimAmount: 0,
        professionalFee: 0,
        courtFee: 0,
        paid: 0,
        facts: lead.facts,
        nextStep: 'Send engagement letter and request documents.'
      };

      lead.stage = 'Retained';
      draft.matters.unshift(matter);
    });
  }

  return (
    <Card title={tr('Leads')}>
      <table>
        <thead>
          <tr>
            <th>{tr('Name')}</th>
            <th>{tr('Type')}</th>
            <th>{tr('Opponent')}</th>
            <th>{tr('Stage')}</th>
            <th>{tr('Owner')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.leads.map((lead) => (
            <tr key={lead.id}>
              <td><strong>{lead.name}</strong><br /><small>{lead.email || lead.phone}</small></td>
              <td>{lead.type}</td>
              <td>{lead.opponent}</td>
              <td><Pill>{tr(lead.stage)}</Pill></td>
              <td>{lead.owner}</td>
              <td><button onClick={() => convertLead(lead.id)}>{tr('Convert')}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function Matters({ data, tr, visibleMatters, matter, selectedMatterId, setSelectedMatterId, updateData }) {
  if (!matter) return <Card title={tr('Matters')}>No matters available.</Card>;

  const docs = data.documents.filter((doc) => doc.matterId === matter.id);
  const updates = data.updates.filter((update) => update.matterId === matter.id);
  const tasks = data.tasks.filter((task) => task.matterId === matter.id);

  function saveMatter(patch) {
    updateData((draft) => {
      const target = draft.matters.find((candidate) => candidate.id === matter.id);
      Object.assign(target, patch);
    });
  }

  return (
    <div className="grid mattersLayout">
      <Card title={tr('Matters')}>
        <div className="matterList">
          {visibleMatters.map((item) => (
            <button key={item.id} className={item.id === selectedMatterId ? 'selected' : ''} onClick={() => setSelectedMatterId(item.id)}>
              <strong>{item.ref}</strong>
              <span>{item.title}</span>
              <small>{item.client}</small>
            </button>
          ))}
        </div>
      </Card>

      <div>
        <Card title={`${matter.ref} — ${matter.title}`}>
          <div className="formGrid">
            <Field label={tr('Stage')}>
              <select value={matter.stage} onChange={(event) => saveMatter({ stage: event.target.value })}>
                {stages.map((stage) => <option key={stage} value={stage}>{tr(stage)}</option>)}
              </select>
            </Field>

            <Field label={tr('Status')}>
              <select value={matter.status} onChange={(event) => saveMatter({ status: event.target.value })}>
                {['Active', 'Closed'].map((status) => <option key={status} value={status}>{tr(status)}</option>)}
              </select>
            </Field>

            <Field label={tr('Owner')}>
              <input value={matter.owner} onChange={(event) => saveMatter({ owner: event.target.value })} />
            </Field>

            <Field label={tr('Deadline')}>
              <input type="date" value={matter.deadline || ''} onChange={(event) => saveMatter({ deadline: event.target.value })} />
            </Field>

            <Field label={tr('Facts')}>
              <textarea value={matter.facts || ''} onChange={(event) => saveMatter({ facts: event.target.value })} />
            </Field>

            <Field label={tr('Next Step')}>
              <textarea value={matter.nextStep || ''} onChange={(event) => saveMatter({ nextStep: event.target.value })} />
            </Field>
          </div>
        </Card>

        <div className="grid three">
          <Card title={tr('Documents')}>
            {docs.map((doc) => (
              <label className="check" key={doc.id}>
                <input type="checkbox" checked={doc.status === 'Received'} onChange={(event) => updateData((draft) => {
                  const target = draft.documents.find((candidate) => candidate.id === doc.id);
                  target.status = event.target.checked ? 'Received' : 'Pending';
                })} />
                <span>{doc.name}</span>
                <small>{tr(doc.status)}</small>
              </label>
            ))}
          </Card>

          <Card title="Tasks">
            {tasks.map((task) => (
              <label className="check" key={task.id}>
                <input type="checkbox" checked={task.status === 'Done'} onChange={(event) => updateData((draft) => {
                  const target = draft.tasks.find((candidate) => candidate.id === task.id);
                  target.status = event.target.checked ? 'Done' : 'Pending';
                })} />
                <span>{task.title}</span>
                <small>{task.due}</small>
              </label>
            ))}
            <button onClick={() => updateData((draft) => draft.tasks.push({
              id: uid('TASK'),
              matterId: matter.id,
              title: prompt('Task title') || 'New task',
              owner: matter.owner,
              due: addDays(2),
              priority: 'Normal',
              status: 'Pending'
            }))}>{tr('Create')}</button>
          </Card>

          <Card title={tr('Updates')}>
            {updates.map((update) => (
              <div className="update" key={update.id}>
                <strong>{update.title}</strong>
                <p>{update.message}</p>
                <small>{update.date}</small>
              </div>
            ))}
            <button onClick={() => updateData((draft) => draft.updates.unshift({
              id: uid('UPD'),
              matterId: matter.id,
              date: today(),
              title: prompt('Update title') || 'General update',
              message: prompt('Update message') || '',
              clientVisible: true
            }))}>{tr('Create')}</button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Calendar({ data, tr, updateData }) {
  const items = [
    ...data.events,
    ...data.matters.filter((matter) => matter.deadline).map((matter) => ({
      id: `DEADLINE-${matter.id}`,
      matterId: matter.id,
      title: `${matter.ref} — ${matter.stage}`,
      date: matter.deadline,
      time: '',
      location: matter.forum,
      status: 'Scheduled'
    }))
  ].sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));

  return (
    <Card
      title={tr('Calendar')}
      action={<button onClick={() => updateData((draft) => draft.events.push({
        id: uid('EVT'),
        matterId: draft.matters[0]?.id,
        type: 'Court hearing',
        title: prompt('Event title') || 'New event',
        date: addDays(1),
        time: '',
        location: 'Dubai Courts',
        status: 'Scheduled'
      }))}>{tr('Create')}</button>}
    >
      <table>
        <thead>
          <tr>
            <th>{tr('Date')}</th>
            <th>{tr('Matter')}</th>
            <th>{tr('Title')}</th>
            <th>{tr('Location')}</th>
            <th>{tr('Status')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((event) => (
            <tr key={event.id}>
              <td><strong>{event.date}</strong><br /><small>{dueLabel(event.date)}</small></td>
              <td>{data.matters.find((matter) => matter.id === event.matterId)?.ref || '-'}</td>
              <td>{event.title}</td>
              <td>{event.location}</td>
              <td><Pill>{event.status || 'Scheduled'}</Pill></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function Templates({ data, tr, updateData }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(data.templates[0]?.id || '');
  const [selectedMatterId, setSelectedMatterId] = useState(data.matters[0]?.id || '');

  const template = data.templates.find((candidate) => candidate.id === selectedTemplateId) || data.templates[0];
  const matter = data.matters.find((candidate) => candidate.id === selectedMatterId) || data.matters[0];
  const rendered = fillTemplate(template, matter, data.firm);

  return (
    <div className="grid two">
      <Card
        title={tr('Document Templates')}
        action={<button onClick={() => updateData((draft) => draft.templates.push({
          id: uid('TPL'),
          type: 'Client Update',
          name: prompt('Template name') || 'New template',
          language: 'English',
          subject: 'Update regarding {matter_ref}',
          body: 'Dear {client},\\n\\n{next_step}\\n\\nBest regards,\\n{firm}'
        }))}>{tr('Create')}</button>}
      >
        <table>
          <thead>
            <tr>
              <th>{tr('Name')}</th>
              <th>{tr('Type')}</th>
              <th>Language</th>
            </tr>
          </thead>
          <tbody>
            {data.templates.map((item) => (
              <tr key={item.id} onClick={() => setSelectedTemplateId(item.id)}>
                <td><strong>{item.name}</strong></td>
                <td>{item.type}</td>
                <td>{item.language}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Template Preview">
        <div className="formGrid single">
          <Field label={tr('Select Matter')}>
            <select value={selectedMatterId} onChange={(event) => setSelectedMatterId(event.target.value)}>
              {data.matters.map((item) => <option key={item.id} value={item.id}>{item.ref} — {item.title}</option>)}
            </select>
          </Field>
          <Field label="Subject">
            <input readOnly value={rendered.subject} />
          </Field>
          <Field label="Body">
            <textarea readOnly value={rendered.body} />
          </Field>
        </div>
        <button onClick={() => navigator.clipboard.writeText(`${rendered.subject}\\n\\n${rendered.body}`)}>{tr('Copy')}</button>
      </Card>
    </div>
  );
}

function Phonebook({ data, tr, updateData }) {
  return (
    <Card
      title={tr('Phonebook')}
      action={<button onClick={() => updateData((draft) => draft.phonebook.push({
        id: uid('PB'),
        name: prompt('Name') || 'New Contact',
        type: 'General',
        phone: '',
        email: '',
        notes: ''
      }))}>{tr('Create')}</button>}
    >
      <table>
        <thead>
          <tr>
            <th>{tr('Name')}</th>
            <th>{tr('Type')}</th>
            <th>{tr('Phone')}</th>
            <th>{tr('Email')}</th>
            <th>{tr('Notes')}</th>
          </tr>
        </thead>
        <tbody>
          {data.phonebook.map((contact) => (
            <tr key={contact.id}>
              <td><strong>{contact.name}</strong></td>
              <td>{contact.type}</td>
              <td>{contact.phone}</td>
              <td>{contact.email}</td>
              <td>{contact.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function AITool({ data, tr, updateData }) {
  const [matterId, setMatterId] = useState(data.matters[0]?.id || '');
  const [mode, setMode] = useState('Draft Client Update');
  const [prompt, setPrompt] = useState('Prepare a professional client update based on this matter.');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const matter = data.matters.find((item) => item.id === matterId) || data.matters[0];

  const context = matter ? [
    `Matter Ref: ${matter.ref}`,
    `Title: ${matter.title}`,
    `Client: ${matter.client}`,
    `Opponent: ${matter.opponent}`,
    `Forum: ${matter.forum}`,
    `Stage: ${matter.stage}`,
    `Facts: ${matter.facts}`,
    `Next Step: ${matter.nextStep}`
  ].join('\\n') : '';

  async function generate() {
    setLoading(true);
    setOutput('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, prompt, context })
      });

      const json = await res.json();
      const text = json.text || json.error || 'No response returned.';
      setOutput(text);

      updateData((draft) => {
        draft.aiHistory.unshift({
          id: uid('AI'),
          date: today(),
          mode,
          matterId,
          prompt,
          output: text
        });
      });
    } catch {
      const fallback = [
        'Demo AI Draft',
        '',
        `Mode: ${mode}`,
        '',
        'This is a local fallback response. Deploy on Vercel and add OPENAI_API_KEY to enable real AI generation.',
        '',
        'Matter context:',
        context,
        '',
        'Suggested draft:',
        'Dear Client,',
        '',
        `We would like to update you regarding ${matter?.ref || 'your matter'}. The current stage is ${matter?.stage || 'under review'}.`,
        '',
        `Next step: ${matter?.nextStep || 'We will update you shortly.'}`,
        '',
        'Best regards,',
        data.firm.name
      ].join('\\n');

      setOutput(fallback);
    } finally {
      setLoading(false);
    }
  }

  function saveAsUpdate() {
    if (!output || !matter) return;

    updateData((draft) => {
      draft.updates.unshift({
        id: uid('UPD'),
        matterId: matter.id,
        date: today(),
        title: `AI: ${mode}`,
        message: output,
        clientVisible: false
      });
    });
  }

  return (
    <div className="grid two">
      <Card title={tr('AI Assistant')}>
        <div className="formGrid single">
          <Field label={tr('Select Matter')}>
            <select value={matterId} onChange={(event) => setMatterId(event.target.value)}>
              {data.matters.map((item) => <option key={item.id} value={item.id}>{item.ref} — {item.title}</option>)}
            </select>
          </Field>

          <Field label="AI Tool">
            <select value={mode} onChange={(event) => setMode(event.target.value)}>
              <option>Draft Client Update</option>
              <option>Draft Legal Notice</option>
              <option>Draft Engagement Letter</option>
              <option>Summarize Matter</option>
              <option>Translate English Arabic</option>
              <option>Draft Contract Clause</option>
            </select>
          </Field>

          <Field label="Prompt">
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} />
          </Field>
        </div>

        <button className="primary" disabled={loading} onClick={generate}>{loading ? 'Generating...' : tr('Generate')}</button>
      </Card>

      <Card title="AI Output">
        <textarea className="outputBox" value={output} onChange={(event) => setOutput(event.target.value)} />
        <div className="actions">
          <button onClick={() => navigator.clipboard.writeText(output)}>{tr('Copy')}</button>
          <button onClick={saveAsUpdate}>Save as internal update</button>
        </div>
      </Card>
    </div>
  );
}

function Users({ data, tr, updateData }) {
  return (
    <Card
      title={tr('Users')}
      action={<button onClick={() => updateData((draft) => draft.users.push({
        id: uid('USR'),
        username: prompt('Username') || 'newuser',
        password: 'ChangeMe@123',
        role: 'lawfirm',
        name: 'New User',
        email: ''
      }))}>{tr('Create')}</button>}
    >
      <table>
        <thead>
          <tr>
            <th>{tr('Username')}</th>
            <th>{tr('Name')}</th>
            <th>{tr('Role')}</th>
            <th>{tr('Email')}</th>
            <th>{tr('Password')}</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user) => (
            <tr key={user.id}>
              <td><strong>{user.username}</strong></td>
              <td>{user.name}</td>
              <td><Pill>{roles[user.role]}</Pill></td>
              <td>{user.email}</td>
              <td><code>{user.password}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function ClientPortal({ data, tr, matters }) {
  return (
    <div className="grid two">
      {matters.map((matter) => (
        <Card key={matter.id} title={`${matter.ref} — ${matter.title}`}>
          <p><strong>{tr('Stage')}:</strong> {tr(matter.stage)}</p>
          <p><strong>{tr('Deadline')}:</strong> {matter.deadline} — {dueLabel(matter.deadline)}</p>
          <p><strong>{tr('Next Step')}:</strong> {matter.nextStep}</p>
        </Card>
      ))}
    </div>
  );
}

function ClientDocuments({ data, tr, matters }) {
  const matterIds = matters.map((matter) => matter.id);
  const docs = data.documents.filter((doc) => matterIds.includes(doc.matterId) && doc.clientVisible);

  return (
    <Card title={tr('Documents')}>
      {docs.map((doc) => (
        <label className="check" key={doc.id}>
          <span>{doc.name}</span>
          <small>{doc.requiredBy}</small>
          <Pill>{tr(doc.status)}</Pill>
        </label>
      ))}
    </Card>
  );
}

function ClientUpdates({ data, tr, matters }) {
  const matterIds = matters.map((matter) => matter.id);
  const updates = data.updates.filter((update) => matterIds.includes(update.matterId) && update.clientVisible);

  return (
    <Card title={tr('Updates')}>
      {updates.map((update) => (
        <div className="update" key={update.id}>
          <strong>{update.title}</strong>
          <p>{update.message}</p>
          <small>{update.date}</small>
        </div>
      ))}
    </Card>
  );
}

function Settings({ data, tr, updateData, session }) {
  function exportBackup() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `os-legal-backup-${today()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid two">
      <Card title={tr('Settings')}>
        <p><strong>{tr('Role')}:</strong> {roles[session.role]}</p>
        <p>This demo uses browser storage. Use Supabase/Auth before using real client information.</p>
        <button onClick={exportBackup}>Export Backup JSON</button>
      </Card>

      <Card title="Firm Profile">
        <Field label="Firm Name">
          <input value={data.firm.name} onChange={(event) => updateData((draft) => { draft.firm.name = event.target.value; })} />
        </Field>
        <Field label={tr('Email')}>
          <input value={data.firm.email} onChange={(event) => updateData((draft) => { draft.firm.email = event.target.value; })} />
        </Field>
        <Field label={tr('Phone')}>
          <input value={data.firm.phone} onChange={(event) => updateData((draft) => { draft.firm.phone = event.target.value; })} />
        </Field>
      </Card>
    </div>
  );
}
