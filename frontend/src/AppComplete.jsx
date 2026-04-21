/*
  FreshHarvest — Complete Frontend
  Stack: React 18 + react-router-dom v6 + react-hot-toast + axios
  Run inside the client/ folder: npm install && npm run dev
  All original files preserved; this is a single-file preview of the full app.
*/

// ─── To use as a self-contained preview in Claude Artifacts ──────────────────
// The code below re-implements all pages/components in one file using
// in-memory mocks so you can browse the UI without a backend.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useReducer, useEffect, useContext, createContext, useCallback } from "react";

// ────────────────────────────── DESIGN TOKENS ──────────────────────────────
const G = {
  greenDark:  "#1b4332",
  green:      "#2d6a4f",
  greenMid:   "#40916c",
  greenLight: "#52b788",
  greenPale:  "#d8f3dc",
  orange:     "#e76f51",
  orangeDark: "#c85d3e",
  cream:      "#fefae0",
  white:      "#ffffff",
  gray50:     "#f9fafb",
  gray100:    "#f3f4f6",
  gray200:    "#e5e7eb",
  gray400:    "#9ca3af",
  gray600:    "#6b7280",
  gray800:    "#1f2937",
  dark:       "#111827",
};

// ──────────────────────────── MOCK DATA ────────────────────────────────────
const PRODUCTS = [
  { _id:"p1", name:"Oyster Mushrooms", category:"mushroom", price:280, unit:"kg", emoji:"🍄", tag:"Locally Grown", description:"Tender, mild-flavoured clusters perfect for stir-fry and pasta.", organic:true, inStock:true },
  { _id:"p2", name:"Shiitake Mushrooms", category:"mushroom", price:420, unit:"kg", emoji:"🍄‍🟫", tag:"Premium", description:"Rich umami depth. Dried or fresh, these are a kitchen staple.", organic:true, inStock:true },
  { _id:"p3", name:"Button Mushrooms", category:"mushroom", price:160, unit:"kg", emoji:"🫒", tag:"Everyday Pick", description:"Versatile and mild. Great raw in salads or sautéed with butter.", organic:false, inStock:true },
  { _id:"p4", name:"Weekly Veggie Box", category:"box", price:599, unit:"box", emoji:"📦", tag:"Best Value", description:"Seasonal greens, tomatoes, beans & herbs curated fresh each week.", organic:true, inStock:true },
  { _id:"p5", name:"Organic Greens Box", category:"box", price:399, unit:"box", emoji:"🥬", tag:"New", description:"Spinach, methi, palak, and amaranth — iron-rich and farm-fresh.", organic:true, inStock:true },
  { _id:"p6", name:"King Oyster Mushrooms", category:"mushroom", price:560, unit:"kg", emoji:"🍄", tag:"Gourmet", description:"Thick stems, meaty texture. Spectacular pan-seared or grilled.", organic:true, inStock:false },
];

const MOCK_ORDERS = [
  {
    _id:"ord001abc",
    createdAt:"2024-03-15T08:22:00Z",
    status:"delivered",
    total:878,
    paymentMethod:"upi",
    address:{ street:"42, 5th Cross, Indiranagar", city:"Bengaluru", pincode:"560038" },
    items:[
      { name:"Oyster Mushrooms", qty:2, price:280, product:{ emoji:"🍄" } },
      { name:"Weekly Veggie Box", qty:1, price:599, product:{ emoji:"📦" } },
    ],
  },
  {
    _id:"ord002xyz",
    createdAt:"2024-04-01T11:05:00Z",
    status:"placed",
    total:449,
    paymentMethod:"cod",
    address:{ street:"12B, Koramangala 4th Block", city:"Bengaluru", pincode:"560034" },
    items:[
      { name:"Shiitake Mushrooms", qty:1, price:420, product:{ emoji:"🍄‍🟫" } },
      { name:"Organic Greens Box", qty:1, price:399, product:{ emoji:"🥬" } },
    ],
  },
];

// ──────────────────────────── CONTEXTS ─────────────────────────────────────
const AuthCtx = createContext();
const CartCtx = createContext();
const NavCtx  = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const ex = state.find(i => i._id === action.p._id);
      if (ex) return state.map(i => i._id === action.p._id ? { ...i, qty: i.qty+1 } : i);
      return [...state, { ...action.p, qty:1 }];
    }
    case "REMOVE": return state.filter(i => i._id !== action.id);
    case "QTY": {
      if (action.qty <= 0) return state.filter(i => i._id !== action.id);
      return state.map(i => i._id === action.id ? { ...i, qty:action.qty } : i);
    }
    case "CLEAR": return [];
    default: return state;
  }
}

function Providers({ children }) {
  const [user, setUser] = useState(null);
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [page, setPage] = useState("home");
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const login = (email) => {
    const u = { name:"Ravi Kumar", email, token:"mock-token" };
    setUser(u);
  };
  const logout = () => setUser(null);

  const addItem = p => dispatch({ type:"ADD", p });
  const removeItem = id => dispatch({ type:"REMOVE", id });
  const updateQty = (id, qty) => dispatch({ type:"QTY", id, qty });
  const clearCart = () => dispatch({ type:"CLEAR" });

  const itemCount = cart.reduce((s,i)=>s+i.qty, 0);
  const subtotal  = cart.reduce((s,i)=>s+i.price*i.qty, 0);
  const delivery  = subtotal >= 500 ? 0 : subtotal === 0 ? 0 : 50;
  const total     = subtotal + delivery;

  const placeOrder = (address, paymentMethod) => {
    const order = {
      _id: "ord" + Date.now(),
      createdAt: new Date().toISOString(),
      status: "placed",
      total,
      paymentMethod,
      address,
      items: cart.map(i => ({ name:i.name, qty:i.qty, price:i.price, product:{ emoji:i.emoji } })),
    };
    setOrders(prev => [order, ...prev]);
    clearCart();
    return order;
  };

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      <CartCtx.Provider value={{ cart, itemCount, subtotal, delivery, total, addItem, removeItem, updateQty, clearCart, placeOrder, orders }}>
        <NavCtx.Provider value={{ page, setPage }}>
          {children}
        </NavCtx.Provider>
      </CartCtx.Provider>
    </AuthCtx.Provider>
  );
}

function useAuth()  { return useContext(AuthCtx); }
function useCart()  { return useContext(CartCtx); }
function useNav()   { return useContext(NavCtx);  }

// ──────────────────────────── TOAST ────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type="success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
  }, []);
  return { toasts, show };
}

const ToastCtx = createContext();

function ToastProvider({ children }) {
  const { toasts, show } = useToast();
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div style={{ position:"fixed", top:80, right:20, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type==="error" ? "#fef2f2" : G.white,
            border: `1.5px solid ${t.type==="error" ? "#fca5a5" : G.greenPale}`,
            color: t.type==="error" ? "#b91c1c" : G.greenDark,
            borderRadius:12, padding:"10px 18px",
            fontSize:14, fontWeight:500,
            boxShadow:"0 4px 20px rgba(0,0,0,0.12)",
            animation:"slideIn 0.25s ease",
            display:"flex", alignItems:"center", gap:8,
          }}>
            <span>{t.type==="error" ? "⚠️" : "✅"}</span> {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
function useToastCtx() { return useContext(ToastCtx); }

// ──────────────────────────── GLOBAL STYLES ────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body { font-family:'DM Sans',sans-serif; background:${G.gray50}; color:${G.dark}; -webkit-font-smoothing:antialiased; }
  a { text-decoration:none; color:inherit; }
  button { cursor:pointer; font-family:'DM Sans',sans-serif; border:none; outline:none; }
  input,select,textarea { font-family:'DM Sans',sans-serif; outline:none; }
  img { max-width:100%; display:block; }
  .container { max-width:1160px; margin:0 auto; padding:0 1.5rem; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes spin { to { transform:rotate(360deg); } }
  .fade-up { animation:fadeUp 0.5s ease both; }
  .product-card:hover { transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,0.12); }
  .product-card { transition:transform 0.2s, box-shadow 0.2s; }
`;

// ──────────────────────────── NAVBAR ───────────────────────────────────────
function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { page, setPage } = useNav();
  const toast = useToastCtx();
  const [open, setOpen] = useState(false);

  const go = p => { setPage(p); setOpen(false); };

  const handleLogout = () => {
    logout();
    toast("Logged out successfully");
    go("home");
  };

  const navLink = (label, target) => (
    <button onClick={() => go(target)} style={{
      background: page===target ? "rgba(255,255,255,0.18)" : "none",
      color: page===target ? "white" : "#95d5b2",
      border:"none", borderRadius:8,
      padding:"6px 15px", fontSize:14, fontWeight:500, cursor:"pointer",
    }}>
      {label}
    </button>
  );

  return (
    <nav style={{ background:G.greenDark, position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 16px rgba(0,0,0,0.18)" }}>
      <div className="container" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:70, gap:"1rem" }}>
        {/* Logo */}
        <button onClick={() => go("home")} style={{ display:"flex", alignItems:"center", gap:10, background:"none", border:"none" }}>
          <span style={{ fontSize:28 }}>🍄</span>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:19, color:"white", fontWeight:700, lineHeight:1.1 }}>FreshHarvest</div>
            <div style={{ fontSize:10, color:"#95d5b2", letterSpacing:"0.5px" }}>Mushrooms & Organic Veggies</div>
          </div>
        </button>

        {/* Desktop links */}
        <div style={{ display:"flex", gap:4, alignItems:"center" }}>
          {navLink("Home","home")}
          {navLink("Shop","shop")}
          {user && navLink("My Orders","orders")}
        </div>

        {/* Right */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => go("cart")} style={{ position:"relative", background:"none", border:"none", fontSize:22, cursor:"pointer" }}>
            🛒
            {itemCount > 0 && (
              <span style={{ position:"absolute", top:-6, right:-8, background:G.orange, color:"white", borderRadius:10, padding:"1px 6px", fontSize:11, fontWeight:700 }}>
                {itemCount}
              </span>
            )}
          </button>

          {user ? (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ color:"#d8f3dc", fontSize:14 }}>Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} style={{ background:"rgba(255,255,255,0.1)", color:"white", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", fontSize:13 }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => go("login")} style={{ color:"#d8f3dc", background:"none", border:"none", padding:"6px 14px", fontSize:14, fontWeight:500, cursor:"pointer" }}>Login</button>
              <button onClick={() => go("register")} style={{ background:G.greenLight, color:"white", border:"none", borderRadius:8, padding:"6px 16px", fontSize:14, fontWeight:600, cursor:"pointer" }}>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// ──────────────────────────── FOOTER ───────────────────────────────────────
function Footer() {
  const { setPage } = useNav();
  return (
    <footer style={{ background:G.greenDark, color:"#95d5b2", padding:"3rem 0 1.5rem", marginTop:"4rem" }}>
      <div className="container">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"2rem", marginBottom:"2rem" }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"white", marginBottom:"0.75rem" }}>🍄 FreshHarvest</div>
            <p style={{ fontSize:13, lineHeight:1.7, opacity:0.8 }}>Farm-fresh mushrooms & organic veggie boxes, delivered to your door in Bengaluru.</p>
          </div>
          <div>
            <div style={{ color:"white", fontWeight:600, fontSize:13, textTransform:"uppercase", letterSpacing:"1px", marginBottom:"1rem" }}>Quick Links</div>
            {[["Home","home"],["Shop","shop"],["My Orders","orders"]].map(([l,p]) => (
              <button key={p} onClick={() => setPage(p)} style={{ display:"block", color:"#95d5b2", background:"none", border:"none", fontSize:14, padding:"4px 0", cursor:"pointer", opacity:0.9 }}>{l}</button>
            ))}
          </div>
          <div>
            <div style={{ color:"white", fontWeight:600, fontSize:13, textTransform:"uppercase", letterSpacing:"1px", marginBottom:"1rem" }}>Contact</div>
            {["📞 +91 98765 43210","📧 hello@freshharvest.in","📍 Bengaluru, Karnataka"].map(t => (
              <div key={t} style={{ fontSize:14, padding:"4px 0", opacity:0.9 }}>{t}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:"1.5rem", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem", fontSize:13, opacity:0.7 }}>
          <span>© 2024 FreshHarvest. All rights reserved.</span>
          <span>Made with 🌿 for fresh food lovers</span>
        </div>
      </div>
    </footer>
  );
}

// ──────────────────────────── HOME PAGE ────────────────────────────────────
function Home() {
  const { setPage } = useNav();
  const features = [
    { icon:"🌱", title:"Farm Direct", desc:"Sourced directly from local mushroom farms and certified organic growers — zero middlemen." },
    { icon:"📦", title:"Weekly Boxes", desc:"Subscribe to our weekly veggie box and never worry about grocery shopping again." },
    { icon:"❄️", title:"Cold Chain", desc:"Maintained cold chain from farm to your door to ensure maximum freshness." },
    { icon:"♻️", title:"Eco Packaging", desc:"All packaging is biodegradable and eco-friendly. Good for you and the planet." },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ background:"linear-gradient(135deg,#1b4332 0%,#2d6a4f 60%,#40916c 100%)", padding:"5rem 0 4rem", overflow:"hidden" }}>
        <div className="container" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem", alignItems:"center" }}>
          <div className="fade-up">
            <span style={{ display:"inline-block", background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", color:"#d8f3dc", padding:"6px 18px", borderRadius:20, fontSize:13, marginBottom:"1.5rem", letterSpacing:"0.5px" }}>
              🌿 Farm Fresh, Delivered Daily
            </span>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,3.2rem)", color:"white", lineHeight:1.15, marginBottom:"1.2rem" }}>
              Fresh Mushrooms &<br />Organic Veggies
            </h1>
            <p style={{ color:"#95d5b2", fontSize:16, lineHeight:1.8, marginBottom:"2rem", maxWidth:420 }}>
              Premium quality mushrooms grown locally and organic veggie boxes curated weekly — delivered fresh to your door in Bengaluru.
            </p>
            <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
              <button onClick={() => setPage("shop")} style={{ background:G.orange, color:"white", border:"none", borderRadius:12, padding:"14px 32px", fontSize:16, fontWeight:600, cursor:"pointer" }}>
                Shop Now →
              </button>
              <button onClick={() => setPage("shop")} style={{ background:"rgba(255,255,255,0.12)", color:"white", border:"2px solid rgba(255,255,255,0.3)", borderRadius:12, padding:"14px 32px", fontSize:16, fontWeight:500, cursor:"pointer" }}>
                Subscribe Weekly
              </button>
            </div>
          </div>
          <div className="fade-up" style={{ display:"flex", alignItems:"center", justifyContent:"center", position:"relative", height:280 }}>
            <span style={{ fontSize:160, filter:"drop-shadow(0 20px 40px rgba(0,0,0,0.3))", animation:"float 3s ease-in-out infinite", display:"block" }}>🍄</span>
            <div style={{ position:"absolute", top:20, right:10, background:"white", borderRadius:12, padding:"8px 16px", fontSize:13, fontWeight:600, color:G.green, boxShadow:"0 4px 16px rgba(0,0,0,0.15)" }}>✅ Organic</div>
            <div style={{ position:"absolute", bottom:30, left:0, background:G.orange, borderRadius:12, padding:"8px 16px", fontSize:12, fontWeight:600, color:"white", boxShadow:"0 4px 16px rgba(0,0,0,0.15)" }}>🚚 Free delivery ₹500+</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background:"white", padding:"2rem 0", borderBottom:`1px solid ${G.gray200}` }}>
        <div className="container">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem" }}>
            {[["500+","Happy Customers"],["6","Fresh Products"],["2hr","Delivery Time"],["100%","Organic"]].map(([n,l]) => (
              <div key={l} style={{ textAlign:"center", padding:"1rem" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", color:G.green, fontWeight:700 }}>{n}</div>
                <div style={{ fontSize:13, color:G.gray400, marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section style={{ padding:"5rem 0" }}>
        <div className="container">
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", color:G.greenDark, textAlign:"center", marginBottom:"2.5rem" }}>Why FreshHarvest?</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1.5rem" }}>
            {features.map(f => (
              <div key={f.title} style={{ background:"white", borderRadius:16, border:`1px solid ${G.gray200}`, padding:"2rem 1.5rem", textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize:40, marginBottom:"1rem" }}>{f.icon}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", color:G.greenDark, marginBottom:"0.75rem" }}>{f.title}</h3>
                <p style={{ fontSize:14, color:G.gray600, lineHeight:1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:"linear-gradient(135deg,#1b4332,#2d6a4f)", padding:"5rem 0" }}>
        <div className="container" style={{ textAlign:"center" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", color:"white", marginBottom:"1rem" }}>Ready to eat fresh?</h2>
          <p style={{ color:"#95d5b2", marginBottom:"2rem", fontSize:16 }}>Join 500+ happy customers getting fresh produce every week.</p>
          <button onClick={() => setPage("shop")} style={{ background:G.orange, color:"white", border:"none", borderRadius:12, padding:"14px 40px", fontSize:16, fontWeight:600, cursor:"pointer" }}>
            Start Shopping →
          </button>
        </div>
      </section>
    </div>
  );
}

// ──────────────────────────── PRODUCT CARD ─────────────────────────────────
function ProductCard({ product }) {
  const { addItem } = useCart();
  const toast = useToastCtx();
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!product.inStock) return;
    setAdding(true);
    addItem(product);
    toast(`${product.name} added to cart!`);
    setTimeout(() => setAdding(false), 700);
  };

  const bg = product.category === "mushroom" ? "#d8f3dc" : "#fef3c7";

  return (
    <div className="product-card" style={{ background:"white", borderRadius:16, border:`1px solid ${G.gray200}`, overflow:"hidden" }}>
      <div style={{ height:110, background:bg, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
        <span style={{ fontSize:52 }}>{product.emoji}</span>
        {product.organic && <span style={{ position:"absolute", top:10, right:10, background:G.green, color:"white", fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20, textTransform:"uppercase", letterSpacing:"0.5px" }}>Organic</span>}
      </div>
      <div style={{ padding:14 }}>
        <div style={{ fontSize:10, fontWeight:700, color:G.greenLight, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:4 }}>{product.tag}</div>
        <h3 style={{ fontSize:15, fontWeight:600, color:G.dark, marginBottom:4, lineHeight:1.3 }}>{product.name}</h3>
        {product.description && <p style={{ fontSize:12, color:G.gray400, marginBottom:10, lineHeight:1.5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{product.description}</p>}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
          <div style={{ fontSize:17, fontWeight:700, color:G.green }}>₹{product.price} <span style={{ fontSize:12, fontWeight:400, color:G.gray400 }}>/{product.unit||"kg"}</span></div>
          <button onClick={handleAdd} disabled={!product.inStock} style={{
            background: !product.inStock ? G.gray200 : adding ? G.greenLight : G.green,
            color: !product.inStock ? G.gray600 : "white",
            border:"none", borderRadius:10, padding:"8px 16px", fontSize:13, fontWeight:600, cursor: product.inStock ? "pointer" : "default",
            transition:"all 0.2s", transform: adding ? "scale(0.96)" : "none",
          }}>
            {!product.inStock ? "Out of Stock" : adding ? "✓ Added" : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────── SHOP PAGE ────────────────────────────────────
function Shop() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  return (
    <div style={{ padding:"2.5rem 0 4rem" }}>
      <div className="container">
        <div style={{ marginBottom:"2rem" }} className="fade-up">
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2.2rem", color:G.greenDark, marginBottom:"0.4rem" }}>Our Products</h1>
          <p style={{ color:G.gray400, fontSize:15 }}>Fresh from the farm — {PRODUCTS.length} products available</p>
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:10, marginBottom:"2rem", flexWrap:"wrap" }}>
          {[["all","🌿 All Products"],["mushroom","🍄 Mushrooms"],["box","📦 Veggie Boxes"]].map(([k,l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              padding:"8px 20px", borderRadius:24, border:`1.5px solid ${filter===k ? G.green : G.gray200}`,
              background: filter===k ? G.green : "white",
              fontSize:14, fontWeight:500, cursor:"pointer",
              color: filter===k ? "white" : G.gray600, transition:"all 0.2s",
            }}>{l}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"4rem", color:G.gray400 }}>
            <div style={{ fontSize:56 }}>🌿</div>
            <h3 style={{ color:G.gray600, marginTop:"1rem" }}>No products found</h3>
          </div>
        ) : (
          <div className="fade-up" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:"1.5rem" }}>
            {filtered.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────── CART PAGE ────────────────────────────────────
function Cart() {
  const { cart, itemCount, subtotal, delivery, total, updateQty, removeItem } = useCart();
  const { user } = useAuth();
  const { setPage } = useNav();
  const toast = useToastCtx();

  const handleCheckout = () => {
    if (!user) { toast("Please login to continue checkout", "error"); setPage("login"); return; }
    setPage("checkout");
  };

  if (itemCount === 0) {
    return (
      <div style={{ padding:"4rem 0" }}>
        <div className="container">
          <div style={{ textAlign:"center", padding:"4rem 2rem", color:G.gray400 }}>
            <div style={{ fontSize:56 }}>🛒</div>
            <h3 style={{ fontSize:"1.2rem", color:G.gray600, margin:"1rem 0 0.5rem" }}>Your cart is empty</h3>
            <p style={{ fontSize:14 }}>Add some fresh items to get started!</p>
            <button onClick={() => setPage("shop")} style={{ marginTop:"1.5rem", background:G.green, color:"white", border:"none", borderRadius:10, padding:"12px 28px", fontSize:15, fontWeight:600, cursor:"pointer" }}>
              Browse Shop →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:"2.5rem 0 4rem" }}>
      <div className="container">
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", color:G.greenDark, marginBottom:"2rem" }}>Your Cart</h1>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:"2rem", alignItems:"start" }}>
          {/* Items */}
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            {cart.map(item => (
              <div key={item._id} style={{ background:"white", borderRadius:16, border:`1px solid ${G.gray200}`, display:"flex", alignItems:"center", gap:"1rem", padding:"1rem 1.25rem" }}>
                <div style={{ width:56, height:56, borderRadius:12, background:item.category==="mushroom"?"#d8f3dc":"#fef3c7", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:30 }}>{item.emoji}</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:15, color:G.dark }}>{item.name}</div>
                  <div style={{ fontSize:13, color:G.gray400, marginTop:2 }}>₹{item.price}/{item.unit||"kg"}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <button onClick={() => updateQty(item._id, item.qty-1)} style={{ width:30, height:30, border:`1.5px solid ${G.gray200}`, background:"white", borderRadius:8, fontSize:16, cursor:"pointer" }}>−</button>
                  <span style={{ fontWeight:600, fontSize:15, minWidth:20, textAlign:"center" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.qty+1)} style={{ width:30, height:30, border:`1.5px solid ${G.gray200}`, background:"white", borderRadius:8, fontSize:16, cursor:"pointer" }}>+</button>
                </div>
                <div style={{ fontWeight:700, fontSize:15, color:G.green, minWidth:64, textAlign:"right" }}>₹{item.price*item.qty}</div>
                <button onClick={() => { removeItem(item._id); toast("Item removed"); }} style={{ background:"none", border:"none", color:G.gray400, fontSize:16, cursor:"pointer", padding:4 }}>✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background:"white", borderRadius:16, border:`1px solid ${G.gray200}`, padding:"1.5rem", position:"sticky", top:90 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.3rem", color:G.greenDark, marginBottom:"1.5rem" }}>Order Summary</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:15, color:G.gray600 }}><span>Subtotal ({itemCount} items)</span><span>₹{subtotal}</span></div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:15, color:G.gray600 }}>
                <span>Delivery</span>
                <span style={{ color: delivery===0 ? G.green : G.dark }}>{delivery===0 ? "FREE" : `₹${delivery}`}</span>
              </div>
              {delivery > 0 && <div style={{ fontSize:12, color:G.orange, background:"#fff7f5", padding:"8px 12px", borderRadius:8, border:`1px solid #fde8e3` }}>Add ₹{500-subtotal} more for free delivery</div>}
              <div style={{ borderTop:`1px solid ${G.gray200}`, margin:"4px 0" }} />
              <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:17, color:G.dark }}><span>Total</span><span>₹{total}</span></div>
            </div>
            <button onClick={handleCheckout} style={{ marginTop:"1.5rem", width:"100%", background:G.orange, color:"white", border:"none", borderRadius:12, padding:"14px", fontSize:16, fontWeight:600, cursor:"pointer" }}>
              Proceed to Checkout →
            </button>
            <button onClick={() => setPage("shop")} style={{ display:"block", textAlign:"center", marginTop:"1rem", color:G.green, background:"none", border:"none", fontSize:14, cursor:"pointer", width:"100%" }}>
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────── CHECKOUT PAGE ────────────────────────────────
function Checkout() {
  const { cart, subtotal, delivery, total, placeOrder } = useCart();
  const { user } = useAuth();
  const { setPage } = useNav();
  const toast = useToastCtx();
  const [form, setForm] = useState({ street:"", city:"Bengaluru", state:"Karnataka", pincode:"", phone:user?.phone||"" });
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.street || !form.pincode || !form.phone) { toast("Please fill all address fields", "error"); return; }
    setLoading(true);
    setTimeout(() => {
      placeOrder(form, payment);
      toast("Order placed successfully! 🎉");
      setPage("orders");
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ padding:"2.5rem 0 4rem" }}>
      <div className="container">
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", color:G.greenDark, marginBottom:"2rem" }}>Checkout</h1>
        <form onSubmit={handleSubmit} style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:"2rem", alignItems:"start" }}>
          <div>
            {/* Address */}
            <div style={{ background:"white", borderRadius:16, border:`1px solid ${G.gray200}`, padding:"1.5rem" }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", color:G.greenDark, marginBottom:"1.5rem" }}>Delivery Address</h2>
              {[["street","Street / House / Flat No.","e.g. 12A, MG Road, Indiranagar"],["pincode","Pincode","560001"],["phone","Phone","+91 98765 43210"]].map(([n,l,ph]) => (
                <div key={n} style={{ marginBottom:"1.2rem" }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:600, color:G.gray600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>{l}</label>
                  <input name={n} value={form[n]} onChange={e=>setForm({...form,[n]:e.target.value})} placeholder={ph} required style={{ width:"100%", padding:"12px 16px", border:`1.5px solid ${G.gray200}`, borderRadius:10, fontSize:15, color:G.dark }} />
                </div>
              ))}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                {[["city","City"],["state","State"]].map(([n,l]) => (
                  <div key={n}>
                    <label style={{ display:"block", fontSize:12, fontWeight:600, color:G.gray600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>{l}</label>
                    <input name={n} value={form[n]} onChange={e=>setForm({...form,[n]:e.target.value})} required style={{ width:"100%", padding:"12px 16px", border:`1.5px solid ${G.gray200}`, borderRadius:10, fontSize:15, color:G.dark }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div style={{ background:"white", borderRadius:16, border:`1px solid ${G.gray200}`, padding:"1.5rem", marginTop:"1.5rem" }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", color:G.greenDark, marginBottom:"1.5rem" }}>Payment Method</h2>
              {[["cod","💵","Cash on Delivery"],["upi","📱","UPI"],["razorpay","💳","Card / Razorpay"]].map(([k,ic,lb]) => (
                <label key={k} onClick={() => setPayment(k)} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", border:`1.5px solid ${payment===k ? G.green : G.gray200}`, borderRadius:12, cursor:"pointer", marginBottom:10, background: payment===k ? "#f0faf5" : "white", transition:"all 0.2s" }}>
                  <span style={{ fontSize:20 }}>{ic}</span>
                  <span style={{ fontWeight:500, fontSize:15 }}>{lb}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background:"white", borderRadius:16, border:`1px solid ${G.gray200}`, padding:"1.5rem" }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", color:G.greenDark, marginBottom:"1.5rem" }}>Order Summary</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:"1rem" }}>
              {cart.map(item => (
                <div key={item._id} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:20 }}>{item.emoji}</span>
                  <span style={{ flex:1, fontSize:14 }}>{item.name} × {item.qty}</span>
                  <span style={{ fontWeight:600, color:G.green }}>₹{item.price*item.qty}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop:`1px solid ${G.gray200}`, margin:"1rem 0" }} />
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, color:G.gray600 }}><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, color:G.gray600 }}><span>Delivery</span><span style={{ color:delivery===0?G.green:undefined }}>{delivery===0?"FREE":`₹${delivery}`}</span></div>
              <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:17, color:G.dark, marginTop:8 }}><span>Total</span><span>₹{total}</span></div>
            </div>
            <button type="submit" disabled={loading} style={{ marginTop:"1.5rem", width:"100%", background: loading ? G.gray400 : G.orange, color:"white", border:"none", borderRadius:12, padding:"14px", fontSize:16, fontWeight:600, cursor: loading?"default":"pointer" }}>
              {loading ? "Placing Order..." : `Place Order ₹${total}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ──────────────────────────── ORDERS PAGE ─────────────────────────────────
const STATUS_STYLES = {
  placed:    { bg:"#fef3c7", color:"#92400e" },
  confirmed: { bg:"#dbeafe", color:"#1e40af" },
  packed:    { bg:"#ede9fe", color:"#5b21b6" },
  shipped:   { bg:"#fce7f3", color:"#9d174d" },
  delivered: { bg:"#d1fae5", color:"#065f46" },
  cancelled: { bg:"#fee2e2", color:"#991b1b" },
};

function Orders() {
  const { orders } = useCart();
  const toast = useToastCtx();

  return (
    <div style={{ padding:"2.5rem 0 4rem" }}>
      <div className="container">
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", color:G.greenDark, marginBottom:"2rem" }}>My Orders</h1>
        {orders.length === 0 ? (
          <div style={{ textAlign:"center", padding:"4rem", color:G.gray400 }}>
            <div style={{ fontSize:56 }}>📦</div>
            <h3 style={{ color:G.gray600, margin:"1rem 0 0.5rem" }}>No orders yet</h3>
            <p style={{ fontSize:14 }}>Place your first order from the shop!</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
            {orders.map(order => {
              const ss = STATUS_STYLES[order.status] || STATUS_STYLES.placed;
              return (
                <div key={order._id} style={{ background:"white", borderRadius:16, border:`1px solid ${G.gray200}`, padding:"1.5rem", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.25rem", paddingBottom:"1.25rem", borderBottom:`1px solid ${G.gray200}`, flexWrap:"wrap", gap:"1rem" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:G.dark, marginBottom:3 }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                      <div style={{ fontSize:13, color:G.gray400 }}>{new Date(order.createdAt).toLocaleDateString("en-IN",{ day:"numeric",month:"long",year:"numeric" })}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{ padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", background:ss.bg, color:ss.color }}>
                        {order.status.charAt(0).toUpperCase()+order.status.slice(1)}
                      </span>
                      <div style={{ fontWeight:700, fontSize:18, color:G.green }}>₹{order.total}</div>
                    </div>
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:"1.25rem" }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:G.gray50, borderRadius:10 }}>
                        <span style={{ fontSize:20 }}>{item.product?.emoji || "🍄"}</span>
                        <span style={{ flex:1, fontSize:14, fontWeight:500, color:"#374151" }}>{item.name}</span>
                        <span style={{ fontSize:13, color:G.gray400 }}>×{item.qty}</span>
                        <span style={{ fontSize:14, fontWeight:600, color:G.green }}>₹{item.price*item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:12, paddingTop:"1rem", borderTop:`1px solid ${G.gray200}` }}>
                    <div style={{ fontSize:13, color:G.gray600, flex:1 }}>📍 {order.address.street}, {order.address.city} — {order.address.pincode}</div>
                    <div style={{ fontSize:12, color:G.gray600, background:G.gray100, padding:"4px 10px", borderRadius:8 }}>
                      {order.paymentMethod==="cod" ? "💵 Cash on Delivery" : order.paymentMethod==="upi" ? "📱 UPI" : "💳 Card"}
                    </div>
                    {["placed","confirmed"].includes(order.status) && (
                      <button onClick={() => toast("Order cancelled")} style={{ background:"none", border:`1.5px solid ${G.orange}`, color:G.orange, borderRadius:8, padding:"6px 16px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────── LOGIN PAGE ───────────────────────────────────
function Login() {
  const { login } = useAuth();
  const { setPage } = useNav();
  const toast = useToastCtx();
  const [form, setForm] = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast("Please fill all fields","error"); return; }
    setLoading(true);
    setTimeout(() => {
      login(form.email);
      toast("Welcome back! 🌿");
      setPage("home");
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", background:"linear-gradient(135deg,#f0faf5 0%,#fefae0 100%)" }}>
      <div className="fade-up" style={{ width:"100%", maxWidth:420, background:"white", borderRadius:20, border:`1px solid ${G.gray200}`, padding:"2.5rem", textAlign:"center", boxShadow:"0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize:52, marginBottom:"1rem" }}>🍄</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", color:G.greenDark, marginBottom:"0.5rem" }}>Welcome back</h1>
        <p style={{ color:G.gray400, fontSize:14 }}>Sign in to your FreshHarvest account</p>

        <form onSubmit={handleSubmit} style={{ marginTop:"2rem", textAlign:"left" }}>
          {[["email","Email","email","you@example.com"],["password","Password","password","••••••••"]].map(([n,l,t,ph]) => (
            <div key={n} style={{ marginBottom:"1.2rem" }}>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:G.gray600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>{l}</label>
              <input type={t} value={form[n]} onChange={e=>setForm({...form,[n]:e.target.value})} placeholder={ph} required style={{ width:"100%", padding:"12px 16px", border:`1.5px solid ${G.gray200}`, borderRadius:10, fontSize:15, color:G.dark }} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width:"100%", background: loading?G.gray400:G.green, color:"white", border:"none", borderRadius:12, padding:"14px", fontSize:16, fontWeight:600, cursor:"pointer", marginTop:"0.5rem" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop:"1.5rem", fontSize:14, color:G.gray600 }}>
          Don't have an account?{" "}
          <button onClick={() => setPage("register")} style={{ color:G.green, fontWeight:600, background:"none", border:"none", cursor:"pointer", fontSize:14 }}>Sign up free</button>
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────── REGISTER PAGE ────────────────────────────────
function Register() {
  const { login } = useAuth();
  const { setPage } = useNav();
  const toast = useToastCtx();
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const set = f => e => setForm({...form,[f]:e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast("Passwords do not match","error"); return; }
    if (form.password.length < 6) { toast("Password must be at least 6 characters","error"); return; }
    setLoading(true);
    setTimeout(() => {
      login(form.email, form.name);
      toast("Account created! Welcome to FreshHarvest 🌿");
      setPage("home");
      setLoading(false);
    }, 900);
  };

  return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", background:"linear-gradient(135deg,#f0faf5 0%,#fefae0 100%)" }}>
      <div className="fade-up" style={{ width:"100%", maxWidth:440, background:"white", borderRadius:20, border:`1px solid ${G.gray200}`, padding:"2.5rem", textAlign:"center", boxShadow:"0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize:52, marginBottom:"1rem" }}>🌿</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", color:G.greenDark, marginBottom:"0.5rem" }}>Create account</h1>
        <p style={{ color:G.gray400, fontSize:14 }}>Join FreshHarvest — eat fresh, live healthy</p>

        <form onSubmit={handleSubmit} style={{ marginTop:"2rem", textAlign:"left" }}>
          {[["name","Full Name","text","Ravi Kumar"],["email","Email","email","ravi@example.com"],["phone","Phone","tel","+91 98765 43210"],["password","Password","password","Min. 6 characters"],["confirm","Confirm Password","password","Repeat password"]].map(([n,l,t,ph]) => (
            <div key={n} style={{ marginBottom:"1.1rem" }}>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:G.gray600, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.5px" }}>{l}</label>
              <input type={t} value={form[n]} onChange={set(n)} placeholder={ph} required={n!=="phone"} style={{ width:"100%", padding:"12px 16px", border:`1.5px solid ${G.gray200}`, borderRadius:10, fontSize:15, color:G.dark }} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width:"100%", background: loading?G.gray400:G.green, color:"white", border:"none", borderRadius:12, padding:"14px", fontSize:16, fontWeight:600, cursor:"pointer", marginTop:"0.5rem" }}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={{ marginTop:"1.5rem", fontSize:14, color:G.gray600 }}>
          Already have an account?{" "}
          <button onClick={() => setPage("login")} style={{ color:G.green, fontWeight:600, background:"none", border:"none", cursor:"pointer", fontSize:14 }}>Sign in</button>
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────── ROUTER ───────────────────────────────────────
function PageRouter() {
  const { page } = useNav();
  const { user } = useAuth();

  const pages = {
    home:     <Home />,
    shop:     <Shop />,
    cart:     <Cart />,
    checkout: user ? <Checkout /> : <Login />,
    orders:   user ? <Orders />  : <Login />,
    login:    <Login />,
    register: <Register />,
  };

  return pages[page] || <Home />;
}

// ──────────────────────────── APP ROOT ─────────────────────────────────────
export default function AppComplete() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Providers>
        <ToastProvider>
          <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
            <Navbar />
            <main style={{ flex:1 }}>
              <PageRouter />
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </Providers>
    </>
  );
}
