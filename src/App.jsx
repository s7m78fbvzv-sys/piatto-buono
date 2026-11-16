import React, { useMemo, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { supabase, isSupabaseConfigured } from './supabase';
import {
  ArrowLeft, ArrowRight, UtensilsCrossed, MapPin, Instagram,
  Settings, Search, Plus, Pencil, Trash2, Eye, Save, QrCode,
  LogOut, LayoutDashboard, X, Check, ExternalLink, Menu as MenuIcon,
  Leaf, ChevronLeft
} from 'lucide-react';

const categories = ['پنینی', 'ساندویچ', 'سالاد', 'فرایز', 'دسر', 'نوشیدنی'];
const seed = [
  {id:'p1',name:'پنینی بولد بیف',en:'Bold Beef Panini',category:'پنینی',price:790,description:'نان چاباتا، گوشت ریش‌ریش، قارچ، پنیر، پیاز کاراملی، پنیر گودا، روکولا و سس خردل دودی.',image:'/menu-images/panini-bold-beef.jpg',available:true},
  {id:'p2',name:'پنینی چیکن باربیکیو',en:'Chicken BBQ Panini',category:'پنینی',price:640,description:'نان چاباتا، مرغ گریل، سس باربیکیو، پیاز کاراملی، روکولا و پنیر موزارلا.',image:'/menu-images/panini-bbq-chicken.jpg',available:true},
  {id:'p3',name:'پنینی چیکن پلنت',en:'Chicken Plant Panini',category:'پنینی',price:659,description:'نان چاباتا، مرغ گریل، بادمجان، قارچ، کدو و پنیر موزارلا.',image:'/menu-images/panini-chicken-alfredo.jpg',available:true},
  {id:'p4',name:'پنینی بولونز پستو',en:'Bolognese Pesto Panini',category:'پنینی',price:749,description:'نان چاباتا، اسلایس بیکن، بولونز، سس پستو، پنیر موزارلا، گوجه خشک و روکولا.',image:'/menu-images/panini-bolognese-pesto.jpg',available:true},
  {id:'p5',name:'پنینی بوو',en:'Buono Panini',category:'پنینی',price:950,description:'نان چاباتا، گوشت، بیکن، پنیر چدار، پیاز کاراملی، قارچ، پنیر گودا و هالوپینو.',image:'/menu-images/panini-buono.jpg',available:true},
  {id:'p6',name:'پنینی هالومی سبزیجات',en:'Halloumi Vegetable Panini',category:'پنینی',price:640,description:'نان چاباتا، پنیر هالومی، سبزیجات گریل، روکولا و ریحان ایتالیایی.',image:'/menu-images/panini-halloumi.jpg',available:true},
  {id:'p7',name:'پنینی موزارلا توپی',en:'Mozzarella Panini',category:'پنینی',price:649,description:'نان چاباتا، پنیر موزارلا توپی، گوجه خشک، ریحان ایتالیایی، پستو و روکولا.',image:'/menu-images/panini-mozzarella.jpg',available:true},
  {id:'s1',name:'ساندویچ بوراتا و مارینارا',en:'Burrata Marinara Sandwich',category:'ساندویچ',price:980,description:'نان چاباتا، بوراتا، روکولا، مارینارا، سس خردل و پودر پسته.',image:'/menu-images/sandwich-burrata.jpg',available:true},
  {id:'s2',name:'ساندویچ کریسپی چیکن',en:'Crispy Chicken Sandwich',category:'ساندویچ',price:690,description:'نان چاباتا، سس چیلی، مرغ کریسپی، پنیر موزارلا، گوجه خشک و روکولا.',image:'/menu-images/sandwich-crispy-chicken.jpg',available:true},
  {id:'a1',name:'سالاد سزار گریل',en:'Grilled Caesar Salad',category:'سالاد',price:690,description:'کاهو، مرغ گریل‌شده، کروتان چاباتا، گوجه خشک، پنیر پارمسان، زیتون سیاه و سس سزار.',image:'/menu-images/salad-caesar.jpg',available:true},
  {id:'a2',name:'سالاد مدیترانه',en:'Mediterranean Salad',category:'سالاد',price:590,description:'کاهو، روکولا، خیار تازه، گوجه، زیتون سیاه، پنیر فتا و سس مدیترانه.',image:'/menu-images/salad-mediterranean.jpg',available:true},
  {id:'f1',name:'فیله بیف فرایز',en:'Beef Fries',category:'فرایز',price:490,description:'سیب‌زمینی سرخ‌شده، بیف و سس پنیر.',image:'/menu-images/fries-beef.jpg',available:true},
  {id:'f2',name:'کریسپی چیکن فرایز',en:'Crispy Chicken Fries',category:'فرایز',price:549,description:'سیب‌زمینی سرخ‌شده، مرغ سوخاری و سس کچاپ دست‌ساز.',image:'/menu-images/fries-crispy-chicken.jpg',available:true},
  {id:'f3',name:'فرایز',en:'French Fries',category:'فرایز',price:290,description:'سیب‌زمینی سرخ‌شده، ادویه مخصوص BUONO و سس کچاپ دست‌ساز.',image:'/menu-images/fries-regular.jpg',available:true},
  {id:'f4',name:'چیزی فرایز',en:'Cheesy Fries',category:'فرایز',price:460,description:'سیب‌زمینی سرخ‌شده، پنیر و ادویه مخصوص.',image:'/menu-images/fries-cheesy.jpg',available:true},
  {id:'d1',name:'تیرامیسو کلاسیک',en:'Classic Tiramisu',category:'دسر',price:380,description:'لیدی‌فینگر، کرم تیرامیسو، قهوه و پودر کاکائو.',image:'/menu-images/dessert-classic.jpg',available:true},
  {id:'d2',name:'تیرامیسو پسته',en:'Pistachio Tiramisu',category:'دسر',price:460,description:'لیدی‌فینگر، کرم پسته و پودر پسته.',image:'/menu-images/dessert-pistachio.jpg',available:true},
  {id:'b1',name:'لیموناد',en:'Lemonade',category:'نوشیدنی',price:290,description:'لیمو، سیروپ و آب گازدار.',image:'/menu-images/drink-lemonade.jpg',available:true},
  {id:'b2',name:'موهیتو',en:'Mojito',category:'نوشیدنی',price:300,description:'لیمو، نعناع، سیروپ، آب گازدار و یخ.',image:'/menu-images/drink-mojito.jpg',available:true}
];
const defaultSettings = {
  restaurantName:'PIATTO BUONO',
  phone:'09001243366', instagram:'https://www.instagram.com/buonodeli/',
  address:'', mapUrl:''
};
const money = value => `${Number(value || 0).toLocaleString('en-US')}T`;
const makeId = () => `item-${Math.random().toString(36).slice(2,10)}`;
function usePersistent(key, initialValue) {
  const [value, setValue] = useState(() => {
    try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : initialValue; }
    catch { return initialValue; }
  });
  React.useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, setValue];
}

export default function App() {
  const [products, setProducts] = usePersistent('buono-menu-v3-products', seed);
  React.useEffect(() => {
    if (products.some(item => item.category === 'تیرامیسو')) {
      setProducts(old => old.map(item => item.category === 'تیرامیسو' ? {...item, category:'دسر'} : item));
    }
  }, [products, setProducts]);
  const [settings, setSettings] = usePersistent('buono-menu-v3-settings', defaultSettings);
  const [page, setPage] = useState('welcome');
  const [adminPage, setAdminPage] = useState('dashboard');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [syncState, setSyncState] = useState(isSupabaseConfigured ? 'loading' : 'unconfigured');
  const [loginError, setLoginError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [category, setCategory] = useState('همه');
  const [search, setSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(null);
  const [toast, setToast] = useState('');

  const notify = message => { setToast(message); window.clearTimeout(notify.timer); notify.timer = window.setTimeout(() => setToast(''), 2600); };

  React.useEffect(() => {
    if (!isSupabaseConfigured) return;
    let alive = true;
    const load = async () => {
      const [{ data: rows, error: productsError }, { data: settingRows, error: settingsError }] = await Promise.all([
        supabase.from('products').select('*').order('sort_order', { ascending: true }),
        supabase.from('restaurant_settings').select('*').eq('id', 1).maybeSingle()
      ]);
      if (!alive) return;
      if (!productsError && rows?.length) {
        setProducts(rows.map(({ sort_order, created_at, updated_at, ...row }) => row));
      }
      if (!settingsError && settingRows) {
        const { id, updated_at, ...rest } = settingRows;
        setSettings(old => ({ ...old, ...rest }));
      }
      setSyncState(productsError || settingsError ? 'error' : 'connected');
    };
    load();
    supabase.auth.getSession().then(({ data }) => {
      if (alive && data.session) { setAdminUser(data.session.user); setIsAdmin(true); }
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      setAdminUser(session?.user || null);
      setIsAdmin(Boolean(session?.user));
      if (!session?.user && page === 'admin') setPage('welcome');
    });
    const channel = supabase.channel('buono-menu-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_settings' }, load)
      .subscribe();
    return () => { alive = false; authListener.subscription.unsubscribe(); supabase.removeChannel(channel); };
  }, []);

  const mapHref = settings.mapUrl?.trim() || (settings.address?.trim() ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}` : '');
  const instagramHref = settings.instagram?.startsWith('http') ? settings.instagram : `https://www.instagram.com/${(settings.instagram || '').replace(/^@/,'')}/`;
  const filteredProducts = useMemo(() => products.filter(p => p.available && (category === 'همه' || p.category === category) && `${p.name} ${p.en || ''} ${p.description || ''}`.toLowerCase().includes(search.toLowerCase())), [products, category, search]);

  const goMenu = () => { setPage('menu'); setCategory('همه'); setSearch(''); window.scrollTo(0,0); };
  const login = async event => {
    event.preventDefault();
    if (!isSupabaseConfigured) { setLoginError('اتصال دیتابیس هنوز تنظیم نشده است. فایل .env را طبق راهنما تکمیل کن.'); return; }
    const { data, error } = await supabase.auth.signInWithPassword({ email: adminEmail.trim(), password: adminPassword });
    if (error) { setLoginError('ورود ناموفق بود؛ ایمیل و رمز عبور را بررسی کن.'); return; }
    const { data: allowed, error: roleError } = await supabase.from('admin_users').select('user_id').eq('user_id', data.user.id).maybeSingle();
    if (roleError || !allowed) { await supabase.auth.signOut(); setLoginError('این حساب دسترسی مدیریت BUONO ندارد.'); return; }
    setAdminUser(data.user); setIsAdmin(true); setPage('admin'); setAdminPage('dashboard'); setAdminPassword(''); setLoginError('');
  };
  const logout = async () => { if (supabase) await supabase.auth.signOut(); setAdminUser(null); setIsAdmin(false); setPage('welcome'); };
  const saveProduct = async event => {
    event.preventDefault();
    const saved = {...form, price:Number(form.price), id:form.id || makeId()};
    if (!isSupabaseConfigured) { notify('ابتدا اتصال Supabase را تنظیم کن.'); return; }
    const { error } = await supabase.from('products').upsert(saved);
    if (error) { notify('ذخیره انجام نشد؛ دسترسی دیتابیس را بررسی کن.'); return; }
    setProducts(old => form.id ? old.map(item => item.id === form.id ? saved : item) : [saved, ...old]);
    setForm(null); notify('تغییرات برای همه مشتری‌ها ذخیره شد.');
  };
  const deleteProduct = async item => {
    if (!window.confirm(`«${item.name}» از منو حذف شود؟`)) return;
    if (!isSupabaseConfigured) { notify('اتصال دیتابیس تنظیم نشده است.'); return; }
    const { error } = await supabase.from('products').delete().eq('id', item.id);
    if (error) { notify('حذف انجام نشد؛ دسترسی دیتابیس را بررسی کن.'); return; }
    setProducts(old => old.filter(p => p.id !== item.id)); notify('غذا از منوی آنلاین حذف شد.');
  };
  const saveSettings = async event => {
    event.preventDefault();
    if (!isSupabaseConfigured) { notify('ابتدا اتصال Supabase را تنظیم کن.'); return; }
    const { error } = await supabase.from('restaurant_settings').upsert({ id: 1, ...settings });
    if (error) { notify('ذخیره تنظیمات انجام نشد.'); return; }
    notify('اطلاعات رستوران برای همه ذخیره شد.');
  };
  const toggleAvailability = async item => {
    const updated = { ...item, available: !item.available };
    const { error } = await supabase.from('products').upsert(updated);
    if (error) { notify('تغییر وضعیت ذخیره نشد.'); return; }
    setProducts(old => old.map(x => x.id === item.id ? updated : x));
  };
  const siteUrl = `${window.location.origin}${window.location.pathname}`;

  return <div className="app-shell">
    <header className={`site-header ${page === 'welcome' ? 'site-header-hidden' : ''}`}>
      <button className="wordmark" onClick={() => setPage('welcome')} aria-label="صفحه اصلی">
        <img src="/buono-logo.png" alt="PIATTO BUONO" />
      </button>
      <div className="header-right">
        {page === 'menu' && <button className="header-home" onClick={() => setPage('welcome')}><ArrowRight size={16}/> صفحه اصلی</button>}
      </div>
    </header>

    {page === 'welcome' && <main className="welcome-page">
      <div className="italian-stripe"><i/><i/><i/></div>
      <section className="welcome-content">
        <div className="welcome-kicker">BENVENUTI</div>
        <div className="logo-plaque"><img src="/buono-logo.png" alt="لوگوی PIATTO BUONO"/></div>
        <div className="home-actions">
          <button className="home-action menu-action" onClick={goMenu}>
            <span className="action-icon"><UtensilsCrossed/></span><b>مشاهده منو</b><small>IL NOSTRO MENU</small><ChevronLeft className="action-arrow"/>
          </button>
          <a className={`home-action location-action ${!mapHref ? 'not-ready' : ''}`} href={mapHref || '#'} target="_blank" rel="noreferrer" onClick={e => { if (!mapHref) { e.preventDefault(); notify('لینک لوکیشن را از پنل مدیریت وارد کن.'); } }}>
            <span className="action-icon"><MapPin/></span><b>لوکیشن رستوران</b><small className="location-caption" dir="ltr">RESTAURANT LOCATION</small>{settings.address && <span className="location-address">{settings.address}</span>}<ExternalLink className="action-arrow"/>
          </a>
          <a className="home-action instagram-action" href={instagramHref} target="_blank" rel="noreferrer">
            <span className="action-icon"><Instagram/></span><b>اینستاگرام</b><small className="instagram-handle" dir="ltr">@buonodeli</small><ExternalLink className="action-arrow"/>
          </a>
        </div>
        <div className="home-footer"><span>FATTO CON AMORE</span><i>✦</i><span>BUON APPETITO</span></div>
        <div className="welcome-admin-row">
          <button className="footer-admin-btn" onClick={() => setPage(isAdmin ? 'admin' : 'login')}><Settings size={14}/> مدیریت</button>
        </div>
      </section>
    </main>}

    {page === 'menu' && <main className="menu-page">
      <section className="menu-banner">
        <div className="banner-copy"><span className="eyebrow">IL NOSTRO MENU</span><h1><em>IL MENU DI BUONO</em></h1><p>طعم‌های ایتالیایی، تازه و با عشق آماده‌شده</p></div>
        <div className="banner-stamp"><span>BUON</span><b>APPETITO</b><i>✦</i></div>
      </section>
      <section className="menu-content">
        <div className="menu-title-row"><div><span className="eyebrow">SCOPRI I SAPORI</span><h2>انتخاب <em>خوشمزه</em> شما</h2></div><label className="search-field"><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="جستجوی غذا..."/></label></div>
        <div className="category-strip"><button className={category==='همه'?'category-chip active':'category-chip'} onClick={()=>setCategory('همه')}>همه</button>{categories.map(c=><button key={c} className={category===c?'category-chip active':'category-chip'} onClick={()=>setCategory(c)}>{c}</button>)}</div>
        <div className="dish-grid">{filteredProducts.map(p=><article className="dish-card" key={p.id}>
          <span className="u-page-mark" aria-hidden="true"/>
          <button className="dish-photo" onClick={()=>setSelected(p)} aria-label={`جزئیات ${p.name}`}>
            {p.image ? <img src={p.image} alt={p.name} onError={e=>{e.currentTarget.style.display='none';}}/> : <span className="food-placeholder">🍽️</span>}
            <span className="dish-category">{p.category}</span>
          </button>
          <div className="dish-details"><div className="dish-name-row"><div><h3>{p.name}</h3><small>{p.en}</small></div><b className="price-tag">{money(p.price)}</b></div><p>{p.description}</p><button className="details-link" onClick={()=>setSelected(p)}>جزئیات غذا <ArrowLeft size={14}/></button></div>
        </article>)}</div>
        {!filteredProducts.length && <div className="empty-state">غذایی با این مشخصات پیدا نشد.</div>}
      </section>
      <footer className="site-footer"><b>PIATTO BUONO</b><span>ITALIAN KITCHEN</span><small>BUON APPETITO ♥</small><button className="footer-admin-btn footer-admin-menu" onClick={() => setPage(isAdmin ? 'admin' : 'login')}><Settings size={14}/> مدیریت</button></footer>
    </main>}

    {page === 'login' && <main className="login-page"><form className="login-box" onSubmit={login}>
      <div className="login-icon"><Settings/></div><span className="eyebrow">AREA RISERVATA</span><h1>ورود مدیریت</h1><p>برای ویرایش منوی BUONO وارد شوید.</p>
      <label className="field"><span>ایمیل مدیر</span><input autoFocus type="email" dir="ltr" required value={adminEmail} onChange={e=>setAdminEmail(e.target.value)} placeholder="admin@example.com"/></label>
      <label className="field"><span>رمز عبور</span><input type="password" dir="ltr" required value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} placeholder="رمز عبور حساب مدیر"/></label>
      {loginError && <div className="error-text">{loginError}</div>}
      <button className="primary-btn">ورود امن به پنل <ArrowLeft size={17}/></button>
      <small className="demo-hint">ورود مدیریت از طریق حساب تأییدشده Supabase انجام می‌شود.</small>
      <button type="button" className="text-btn" onClick={()=>setPage('welcome')}>بازگشت به صفحه اصلی</button>
    </form></main>}

    {page === 'admin' && isAdmin && <main className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">BUONO<small>MENU CONTROL</small></div>
        <button className={adminPage==='dashboard'?'nav-item active':'nav-item'} onClick={()=>setAdminPage('dashboard')}><LayoutDashboard/> نمای کلی</button>
        <button className={adminPage==='products'?'nav-item active':'nav-item'} onClick={()=>setAdminPage('products')}><UtensilsCrossed/> مدیریت غذاها</button>
        <button className={adminPage==='settings'?'nav-item active':'nav-item'} onClick={()=>setAdminPage('settings')}><Settings/> اطلاعات رستوران</button>
        <button className={adminPage==='qr'?'nav-item active':'nav-item'} onClick={()=>setAdminPage('qr')}><QrCode/> کد QR منو</button>
        <div className="sidebar-bottom"><button className="nav-item" onClick={logout}><LogOut/> خروج</button><button className="nav-item" onClick={()=>setPage('welcome')}><Eye/> مشاهده سایت</button></div>
      </aside>
      <section className="admin-main">
        <div className="admin-top"><div><span className="eyebrow">BUONO / MENU CONTROL</span><h1>{({dashboard:'نمای کلی منو',products:'مدیریت غذاها',settings:'اطلاعات رستوران',qr:'کد QR اختصاصی'})[adminPage]}</h1></div><button className="outline-btn" onClick={()=>setPage('welcome')}><Eye size={16}/> مشاهده سایت</button></div>
        {adminPage==='dashboard' && <>
          <div className="stats-grid"><div className="stat-card"><span>کل غذاها</span><b>{products.length}</b><UtensilsCrossed/></div><div className="stat-card"><span>غذاهای فعال</span><b>{products.filter(p=>p.available).length}</b><Check/></div><div className="stat-card"><span>غذاهای ناموجود</span><b>{products.filter(p=>!p.available).length}</b><Eye/></div><div className="stat-card"><span>دسته‌بندی‌ها</span><b>{new Set(products.map(p=>p.category)).size}</b><LayoutDashboard/></div></div>
          <div className="admin-panel"><div className="panel-title"><div><h2>مدیریت سریع</h2><p>غذاها و قیمت‌های منو را از این بخش به‌روز کن.</p></div><button className="primary-btn small" onClick={()=>{setAdminPage('products');setForm({name:'',en:'',category:categories[0],price:'',description:'',image:'',available:true});}}><Plus/> افزودن غذا</button></div><div className="quick-note"><Leaf/><span>{syncState === 'connected' ? 'اتصال دیتابیس برقرار است؛ تغییرات برای همه مشتری‌ها همگام می‌شود.' : syncState === 'loading' ? 'در حال اتصال به دیتابیس...' : 'اتصال آنلاین تنظیم نشده یا با خطا روبه‌رو شده است.'}</span></div></div>
        </>}
        {adminPage==='products' && <div className="admin-panel">
          <div className="panel-title"><div><h2>غذاهای منو</h2><p>نام، دسته‌بندی، قیمت، عکس و وضعیت نمایش هر غذا را مدیریت کن.</p></div><button className="primary-btn small" onClick={()=>setForm({name:'',en:'',category:categories[0],price:'',description:'',image:'',available:true})}><Plus/> افزودن غذا</button></div>
          <label className="search-field admin-search"><Search/><input value={productSearch} onChange={e=>setProductSearch(e.target.value)} placeholder="جستجوی غذا..."/></label>
          <div className="product-admin-list">{products.filter(p=>`${p.name} ${p.category}`.includes(productSearch)).map(p=><div className="product-admin-row" key={p.id}>
            <img src={p.image} alt="" onError={e=>e.currentTarget.style.visibility='hidden'}/><div className="product-admin-info"><b>{p.name}</b><small>{p.category} · {money(p.price)}</small></div>
            <button className={p.available?'availability on':'availability off'} onClick={()=>toggleAvailability(p)}>{p.available?'نمایش':'مخفی'}</button>
            <button className="icon-action" onClick={()=>setForm({...p})} aria-label="ویرایش"><Pencil/></button><button className="icon-action delete" onClick={()=>deleteProduct(p)} aria-label="حذف"><Trash2/></button>
          </div>)}</div>
        </div>}
        {adminPage==='settings' && <form className="admin-panel settings-form" onSubmit={saveSettings}>
          <div className="panel-title"><div><h2>اطلاعات رستوران</h2><p>شماره تماس، آدرس و لینک‌های ارتباطی رستوران را از این بخش ویرایش کن.</p></div><button className="primary-btn small"><Save/> ذخیره</button></div>
          <div className="settings-grid">
            <label className="field"><span>نام رستوران</span><input value={settings.restaurantName} onChange={e=>setSettings({...settings,restaurantName:e.target.value})}/></label>
            <label className="field"><span>شماره تماس</span><input dir="ltr" value={settings.phone} onChange={e=>setSettings({...settings,phone:e.target.value})} placeholder="09001243366"/></label>
            <label className="field"><span>لینک اینستاگرام</span><input dir="ltr" value={settings.instagram} onChange={e=>setSettings({...settings,instagram:e.target.value})} placeholder="https://instagram.com/..."/></label>
            <label className="field full-field"><span>آدرس رستوران</span><textarea rows="2" value={settings.address} onChange={e=>setSettings({...settings,address:e.target.value})} placeholder="شهر، خیابان، پلاک..."/></label>
            <label className="field full-field"><span>لینک لوکیشن از نقشه</span><input dir="ltr" value={settings.mapUrl} onChange={e=>setSettings({...settings,mapUrl:e.target.value})} placeholder="https://maps.google.com/..."/><small>لینک Share مکان را از Google Maps، بلد یا نشان کپی کن.</small></label>
          </div>
          <div className="settings-tip"><MapPin/> شماره تماس و لینک اینستاگرام از اطلاعات روی منوی شما وارد شده‌اند. فقط آدرس و لینک دقیق نقشه را تکمیل کن.</div>
        </form>}
        {adminPage==='qr' && <div className="admin-panel qr-admin"><span className="eyebrow">SCAN · DISCOVER · ENJOY</span><h2>QR اختصاصی PIATTO BUONO</h2><p>این QR به صفحه اصلی منوی دیجیتال وصل می‌شود.</p><div className="qr-box"><QRCodeCanvas value={siteUrl} size={230} level="H" includeMargin/></div><b>PIATTO BUONO</b><small dir="ltr">{siteUrl}</small><button className="primary-btn" onClick={()=>window.print()}>چاپ یا ذخیره QR</button><div className="settings-tip"><QrCode/> برای استفاده مشتری‌ها، اول سایت را روی اینترنت منتشر کن و QR را با آدرس نهایی بساز.</div></div>}
      </section>
    </main>}

    {selected && <div className="modal-shade" onClick={()=>setSelected(null)}><div className="dish-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)}><X/></button><img src={selected.image} alt={selected.name}/><div className="dish-modal-body"><span className="eyebrow">{selected.category}</span><h2>{selected.name}</h2><p>{selected.description}</p><b className="price-tag">{money(selected.price)}</b></div></div></div>}
    {form && <div className="modal-shade" onClick={()=>setForm(null)}><form className="product-form-modal" onSubmit={saveProduct} onClick={e=>e.stopPropagation()}>
      <div className="drawer-head"><h2>{form.id?'ویرایش غذا':'افزودن غذای جدید'}</h2><button type="button" className="icon-action" onClick={()=>setForm(null)}><X/></button></div>
      <label className="field"><span>نام غذا *</span><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
      <label className="field"><span>نام انگلیسی</span><input value={form.en||''} onChange={e=>setForm({...form,en:e.target.value})}/></label>
      <div className="form-two"><label className="field"><span>دسته‌بندی</span><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select></label><label className="field"><span>قیمت (مثل 790T)</span><input required type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label></div>
      <label className="field"><span>توضیحات</span><textarea rows="3" value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}/></label>
      <label className="field"><span>آدرس عکس غذا</span><input dir="ltr" value={form.image||''} onChange={e=>setForm({...form,image:e.target.value})} placeholder="/menu-images/... یا لینک تصویر"/></label>
      <label className="availability-check"><input type="checkbox" checked={form.available} onChange={e=>setForm({...form,available:e.target.checked})}/> نمایش غذا در منوی مشتری</label>
      <button className="primary-btn">ذخیره غذا <Save/></button>
    </form></div>}
    {toast && <div className="toast-message">{toast}</div>}
  </div>;
}
