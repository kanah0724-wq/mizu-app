import { useState, useEffect } from "react";

// ── 定数 ──────────────────────────────────────
const CATEGORIES_EXPENSE = ["食費","日用品","娯楽費","医療費","交通費","服飾美容","家電","通信費","保険","固定費","その他"];
const CATEGORIES_INCOME  = ["給料","ボーナス","タダカヨ収入","その他"];
const PETS       = ["共通","ウリ","ルル"];
const PAYMENTS   = ["現金","三井住友カード","楽天カード","PayPay"];
const CAT_COLOR  = {
  食費:"#4DB6C6", 日用品:"#7EE0C1", 娯楽費:"#9EDBE8", 医療費:"#f4a5a5",
  交通費:"#006B78", 服飾美容:"#b0dde8", 家電:"#5b8dee", 通信費:"#7c6fcd",
  保険:"#f4a261", 固定費:"#4a7a80", その他:"#CDEEF5",
  給料:"#2a9d6e", ボーナス:"#3bbf8a", タダカヨ収入:"#7EE0C1",
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function fmtDate(s) { return s ? s.replace(/-/g,"/") : ""; }
function fmtAmt(n)  { return "¥" + Math.abs(n).toLocaleString(); }

const EMPTY_FORM = {
  type:"expense", amount:"", category:"", name:"",
  date:todayStr(), payment:"", pet:"共通", memo:""
};

// ── SVGアイコン基礎 ────────────────────────────
function Ico({ size=18, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function DropIcon({ size=22, color="#006B78" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0C19 10 12 2 12 2z"/>
    </svg>
  );
}
function HomeIcon({ size=20, color="#9EDBE8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}
function TxIcon({ size=20, color="#9EDBE8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  );
}
function PlusIcon({ size=24, color="#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function ReportIcon({ size=20, color="#9EDBE8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
function SettingsIcon({ size=20, color="#9EDBE8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
  );
}
function CameraIcon({ size=22, color="#2a9d6e" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}
function ImageIcon({ size=22, color="#4DB6C6" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="M21 15l-5-5L5 21"/>
    </svg>
  );
}
function PasteIcon({ size=22, color="#7EE0C1" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  );
}
function DownloadIcon({ size=18, color="#2a9d6e" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
function TrashIcon({ size=18, color="#d9534f" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  );
}
function SearchIcon({ size=16, color="#9EDBE8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

// カテゴリアイコン（JSX要素として定義）
const CAT_ICON = {
  食費:     <Ico><path d="M3 3h18v4a9 9 0 01-18 0V3z"/><line x1="12" y1="12" x2="12" y2="21"/></Ico>,
  日用品:   <Ico><path d="M6 2h12l1 6H5L6 2z"/><path d="M5 8v12a1 1 0 001 1h12a1 1 0 001-1V8"/></Ico>,
  娯楽費:   <Ico><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></Ico>,
  医療費:   <Ico><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Ico>,
  交通費:   <Ico><path d="M5 17H3V7a2 2 0 012-2h10l4 4v6h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></Ico>,
  服飾美容: <Ico><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></Ico>,
  固定費:   <Ico><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></Ico>,
  家電:     <Ico><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></Ico>,
  通信費:   <Ico><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></Ico>,
  保険:     <Ico><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Ico>,
  その他:   <Ico><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Ico>,
  給料:     <Ico><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></Ico>,
  ボーナス:  <Ico><circle cx="12" cy="8" r="4"/><path d="M8 14l-2 7h12l-2-7"/><line x1="12" y1="12" x2="12" y2="14"/></Ico>,
  タダカヨ収入: <Ico><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></Ico>,
};
const PAY_ICON = {
  現金:           <Ico><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></Ico>,
  三井住友カード:  <Ico><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></Ico>,
  楽天カード:      <Ico><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><line x1="4" y1="15" x2="8" y2="15"/></Ico>,
  PayPay:          <Ico><circle cx="12" cy="12" r="10"/><path d="M8 12h4a2 2 0 000-4H8v8"/><line x1="14" y1="16" x2="14.01" y2="16"/></Ico>,
};

// ── ドーナツチャート ───────────────────────────
function DonutChart({ transactions }) {
  const r = 44, cx = 60, cy = 60, circ = 2 * Math.PI * r;
  const totals = {};
  transactions.filter(t => t.amount < 0).forEach(t => {
    totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount);
  });
  const total = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
  const data = Object.entries(totals).map(([name, amt]) => ({
    name, pct: amt / total * 100, color: CAT_COLOR[name] || "#9EDBE8"
  }));
  const totalExp = transactions.filter(t => t.amount < 0)
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  let offset = 0;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {data.length === 0
        ? <circle cx={cx} cy={cy} r={r} fill="none" stroke="#CDEEF5" strokeWidth="18"/>
        : data.map((d, i) => {
            const dash = (d.pct / 100) * circ;
            const sdo = -(offset / 100) * circ;
            offset += d.pct;
            return (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                stroke={d.color} strokeWidth="18"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={sdo}
                style={{ transform:"rotate(-90deg)", transformOrigin:"center" }}
              />
            );
          })
      }
      <text x={cx} y={cy-6} textAnchor="middle" fontSize="9" fill="#1a3a3f" fontWeight="600">支出合計</text>
      <text x={cx} y={cy+8} textAnchor="middle" fontSize="11" fill="#006B78" fontWeight="700">
        {fmtAmt(totalExp)}
      </text>
    </svg>
  );
}

// ── 共通パーツ ────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom:18 }}>
      <p style={s.fieldLbl}>{label}</p>
      {children}
      {error && <p style={s.errMsg}>{error}</p>}
    </div>
  );
}

// ── メインアプリ ──────────────────────────────
export default function MizuApp() {
  const [screen, setScreen] = useState("home");
  const [tab,    setTab]    = useState("home");
  const [txList, setTxList] = useState([]);
  const [petFilter, setPetFilter] = useState("すべて");
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  // 取引一覧用の月ナビ（ホームと独立）
  const [txYear,  setTxYear]  = useState(now.getFullYear());
  const [txMonth, setTxMonth] = useState(now.getMonth() + 1);
  // 編集対象ID
  const [editId, setEditId] = useState(null);
  // 削除確認モーダル
  const [deleteId, setDeleteId] = useState(null);
  const [txSearch, setTxSearch] = useState(""); // 取引検索ワード
  // レポート用アコーディオン
  const [openCat, setOpenCat]   = useState(null);
  const [openPay, setOpenPay]   = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAllTx, setShowAllTx] = useState(false);
  const [splash, setSplash] = useState(true);
  const [receiptImg, setReceiptImg]   = useState(null);
  const [analyzing,  setAnalyzing]    = useState(false);
  const [pasteText,  setPasteText]    = useState("");
  const [parsedTxs,  setParsedTxs]    = useState([]);

  // 設定
  const [petNames,  setPetNames]  = useState(() => {
    try { return JSON.parse(localStorage.getItem("mizu_pets")) || ["ウリ","ルル"]; } catch(e) { return ["ウリ","ルル"]; }
  });
  const [payNames,  setPayNames]  = useState(() => {
    try { return JSON.parse(localStorage.getItem("mizu_pays")) || ["現金","三井住友カード","楽天カード","PayPay"]; } catch(e) { return ["現金","三井住友カード","楽天カード","PayPay"]; }
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toast, setToast] = useState("");
  const [editPetNames, setEditPetNames] = useState(null);
  const [editPayNames, setEditPayNames] = useState(null);
  // 固定費リスト
  const [fixedList, setFixedList] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mizu_fixed")) || []; } catch(e) { return []; }
  });
  const [showFixedAlert, setShowFixedAlert] = useState(false);
  const [form,  setForm]  = useState({ ...EMPTY_FORM });
  const [error, setError] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizu_tx");
      if (saved) setTxList(JSON.parse(saved));
    } catch(e) {}
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  function saveTx(list) {
    setTxList(list);
    try { localStorage.setItem("mizu_tx", JSON.stringify(list)); } catch(e) {}
  }

  function setF(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setError(e => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) e.amount = "金額を入力してください";
    if (!form.category) e.category = "カテゴリを選択してください";
    if (!form.name.trim()) e.name = "内容を入力してください";
    if (form.type === "expense" && !form.payment) e.payment = "支払い方法を選択してください";
    return e;
  }

  function handleNext() {
    const e = validate();
    if (Object.keys(e).length > 0) { setError(e); return; }
    setScreen("confirm");
  }

  function goHome() {
    setForm({ ...EMPTY_FORM });
    setError({});
    setEditId(null);
    setTab("home");
    setScreen("home");
    setShowAllTx(false);
  }

  function goInput() {
    setForm({ ...EMPTY_FORM });
    setError({});
    setEditId(null);
    setTab("add");
    setScreen("input");
  }

  // 取引をタップして編集画面へ
  function goEdit(tx) {
    setForm({
      type: tx.amount > 0 ? "income" : "expense",
      amount: String(Math.abs(tx.amount)),
      category: tx.category,
      name: tx.name,
      date: tx.date,
      payment: tx.payment || "",
      pet: tx.pet,
      memo: tx.memo || "",
    });
    setError({});
    setEditId(tx.id);
    setScreen("input");
  }

  // 編集保存（既存データを上書き）
  function handleSave() {
    const updated = {
      id: editId || Date.now(),
      type: form.type,
      amount: form.type === "expense" ? -Math.abs(+form.amount) : +form.amount,
      category: form.category,
      name: form.name,
      date: form.date,
      payment: form.payment,
      pet: form.pet,
      memo: form.memo,
    };
    const newList = editId
      ? txList.map(t => t.id === editId ? updated : t)
      : [updated, ...txList];
    saveTx(newList);
    setScreen("done");
  }

  // 削除
  function handleDelete(id) {
    saveTx(txList.filter(t => t.id !== id));
    setDeleteId(null);
    setScreen("tx");
    setTab("tx");
  }

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const monthTx = txList.filter(t => {
    const [y, m] = t.date.split("-").map(Number);
    return y === year && m === month;
  });
  const viewTx = petFilter === "すべて" ? monthTx : monthTx.filter(t => t.pet === petFilter);
  const income  = monthTx.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = monthTx.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const balance = income - expense;

  const catTotals = {};
  monthTx.filter(t => t.amount < 0).forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + Math.abs(t.amount);
  });
  const catData = Object.entries(catTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amt]) => ({
      name,
      pct: expense > 0 ? Math.round(amt / expense * 100) : 0,
      color: CAT_COLOR[name] || "#9EDBE8"
    }));

  const TABS = [
    { id:"home",     label:"ホーム",   Icon:HomeIcon },
    { id:"tx",       label:"取引",     Icon:TxIcon },
    { id:"add",      label:"",         Icon:PlusIcon },
    { id:"report",   label:"レポート", Icon:ReportIcon },
    { id:"settings", label:"設定",     Icon:SettingsIcon },
  ];

  function saveFixedList(list) {
    setFixedList(list);
    try { localStorage.setItem("mizu_fixed", JSON.stringify(list)); } catch(e) {}
  }

  // 今月未登録の固定費を取得
  function getUnregisteredFixed() {
    const y = now.getFullYear(), m = now.getMonth() + 1;
    return fixedList.filter(f => {
      if (!f.name || !f.amount) return false;
      // 今月すでに登録済みか確認（同じ名前・同じ月）
      const alreadyDone = txList.some(t => {
        const [ty, tm] = t.date.split("-").map(Number);
        return ty === y && tm === m && t.name === f.name;
      });
      return !alreadyDone;
    });
  }

  // 固定費を一括登録
  function registerFixed(items) {
    const today = todayStr();
    const newTxs = items.map(f => ({
      id: Date.now() + Math.random(),
      type: "expense",
      amount: -Math.abs(Number(f.amount)),
      category: f.category || "固定費",
      name: f.name,
      date: today,
      payment: f.payment || "",
      pet: f.pet || "共通",
      memo: "固定費自動登録",
    }));
    saveTx([...newTxs, ...txList]);
    setShowFixedAlert(false);
    showToast(`${newTxs.length}件の固定費を登録しました`);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }

  function savePetNames(names) {
    setPetNames(names);
    try { localStorage.setItem("mizu_pets", JSON.stringify(names)); } catch(e) {}
  }
  function savePayNames(names) {
    setPayNames(names);
    try { localStorage.setItem("mizu_pays", JSON.stringify(names)); } catch(e) {}
  }

  function exportCSV() {
    const header = "日付,内容,金額,カテゴリ,支払い方法,対象,メモ";
    const rows = txList.map(t =>
      [t.date, t.name, t.amount, t.category, t.payment||"", t.pet, t.memo||""].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF"+csv], { type:"text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "mizu_export.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function importCSV(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const text = ev.target.result.replace(/^\uFEFF/, ""); // BOM除去
        const lines = text.split("\n").filter(l => l.trim());
        const header = lines[0];
        const rows = lines.slice(1);
        const imported = rows.map(row => {
          // カンマ区切り（ダブルクォート対応）
          const cols = row.match(/(".*?"|[^,]+)(?=,|$)/g) || row.split(",");
          const clean = cols.map(c => c.replace(/^"|"$/g, "").trim());
          const [date, name, amount, category, payment, pet, memo] = clean;
          if (!date || !name || !amount) return null;
          return {
            id: Date.now() + Math.random(),
            date: date || todayStr(),
            name: name || "",
            amount: Number(amount) || 0,
            category: category || "その他",
            payment: payment || "",
            pet: pet || "共通",
            memo: memo || "",
            type: Number(amount) >= 0 ? "income" : "expense",
          };
        }).filter(Boolean);

        if (imported.length === 0) {
          alert("読み込める取引がありませんでした");
          return;
        }
        // 既存データとマージ（重複はidで判断できないのでそのまま追加）
        saveTx([...imported, ...txList]);
        showToast(`${imported.length}件をインポートしました`);
      } catch(err) {
        alert("CSVの読み込みに失敗しました");
      }
      e.target.value = ""; // リセット
    };
    reader.readAsText(file, "UTF-8");
  }

  function resetAll() {
    saveTx([]);
    setShowResetConfirm(false);
    setScreen("home"); setTab("home");
  }

  function onTab(id) {
    if (id === "add")      { setShowAddMenu(true); return; }
    if (id === "tx")       { setTab("tx");       setScreen("tx");       return; }
    if (id === "report")   { setTab("report");   setScreen("report");   return; }
    if (id === "settings") { setTab("settings"); setScreen("settings"); return; }
    setTab(id); setScreen("home");
  }

  // 画像選択 → base64変換
  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setReceiptImg(ev.target.result); // data:image/...;base64,...
      setScreen("receipt");
      setShowAddMenu(false);
    };
    reader.readAsDataURL(file);
  }

  // ClaudeAPIでレシート解析
  async function analyzeReceipt() {
    if (!receiptImg) return;
    setAnalyzing(true);
    try {
      const base64 = receiptImg.split(",")[1];
      const mediaType = receiptImg.split(";")[0].split(":")[1];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: base64 }
              },
              {
                type: "text",
                text: `このレシートまたは画像から以下の情報を読み取ってJSON形式だけで返してください。余分なテキストは不要です。
{
  "name": "店名または内容（不明なら空文字）",
  "amount": 金額（数値のみ、不明なら0）,
  "date": "YYYY-MM-DD形式（不明なら今日の日付）",
  "category": "食費/日用品/娯楽費/医療費/交通費/服飾美容/固定費/その他 のいずれか",
  "memo": "その他気づいたこと（任意）"
}`
              }
            ]
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "{}";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setForm(f => ({
        ...f,
        name:     parsed.name     || "",
        amount:   parsed.amount   ? String(parsed.amount) : "",
        date:     parsed.date     || todayStr(),
        category: parsed.category || "",
        memo:     parsed.memo     || "",
        type:     "expense",
      }));
      setReceiptImg(null);
      setScreen("input");
    } catch(e) {
      alert("読み取りに失敗しました。手動で入力してください。");
      setScreen("input");
    } finally {
      setAnalyzing(false);
    }
  }

  // テキスト解析して取引リスト生成
  function parseText(text) {
    if (!text.trim()) return;
    const lines = text.split("\n").map(l => l.trim()).filter(l => l);
    const results = [];

    // 金額：カンマ区切り対応（例: 4,230円 / ¥4230 / 4230）
    const amtReg  = /[¥￥]([0-9,，]+)|([0-9,，]+)\s*円/;
    // 日付：5/20, 05/20, 2024/5/20, 5月20日 など
    const dateReg = /(?:(\d{4})[\/\-年])?(\d{1,2})[\/\-月](\d{1,2})日?/;
    // 支払い方法キーワード
    const payKeywords = ["現金","三井住友","楽天","paypay","PayPay","クレジット","カード","電子マネー","suica","Suica","nanaco","waon"];

    lines.forEach(line => {
      const amtMatch = line.match(amtReg);
      if (!amtMatch) return;
      // グループ1（¥付き）またはグループ2（円付き）
      const rawAmt = (amtMatch[1] || amtMatch[2] || "").replace(/[,，]/g, "");
      const amount = parseInt(rawAmt, 10);
      if (!amount || amount <= 0) return;

      // 日付
      let date = todayStr();
      const dm = line.match(dateReg);
      if (dm) {
        const y = dm[1] || now.getFullYear();
        const m = String(dm[2]).padStart(2,"0");
        const d = String(dm[3]).padStart(2,"0");
        date = `${y}-${m}-${d}`;
      }

      // 支払い方法を抽出（設定済みの支払い方法名と完全一致のみ）
      let payment = "";
      let lineForName = line;
      for (const p of payNames) {
        if (line.includes(p)) {
          payment = p;
          // 支払い方法名を行から除去（店名を壊さないよう最後の出現位置から除去）
          const idx = line.lastIndexOf(p);
          lineForName = (line.slice(0, idx) + line.slice(idx + p.length)).trim();
          break;
        }
      }

      // 店名：日付と金額だけを除去（支払い方法キーワードによる部分一致は行わない）
      let name = lineForName
        .replace(dateReg, "")
        .replace(amtReg, "")
        .replace(/[¥￥円\s　,，]+/g, " ")
        .trim() || "不明";

      // 収入かどうか判定
      const isIncome = /収入|入金|給与|給料|ボーナス|賞与|振込|タダカヨ|売上|報酬/.test(line);

      results.push({
        tempId: Date.now() + Math.random(),
        name, amount, date,
        category: isIncome ? "給料" : guessCategory(name),
        type: isIncome ? "income" : "expense",
        payment, pet:"共通", memo:"", checked:true,
      });
    });
    setParsedTxs(results);
    if (results.length > 0) setScreen("paste-confirm");
    else alert("読み取れる取引が見つかりませんでした。\n金額（例：4,230円 / ¥4230）が含まれているか確認してください。");
  }

  function guessCategory(name) {
    if (/スーパー|コンビニ|食|ランチ|カフェ|レストラン|マック|サミット|イオン|ライフ|マルミヤ|マルショク|トキハ|フードセンター|ローソン|セブン|ファミマ|ミニストップ|コープ|生協|東急ストア|西友|マックスバリュ|ピアゴ|バロー|ナフコ|アピタ/.test(name)) return "食費";
    if (/電車|バス|タクシー|ガソリン|駐車|交通|suica|icoca|高速|JAF/.test(name)) return "交通費";
    if (/携帯|スマホ|docomo|ドコモ|au|softbank|ソフトバンク|楽天モバイル|インターネット|wifi|光回線|NTT/.test(name)) return "通信費";
    if (/保険|共済|生命|医療保険|損保|火災/.test(name)) return "保険";
    if (/家電|電気屋|ヤマダ|ビックカメラ|ヨドバシ|エディオン|ケーズ|コジマ|PC|パソコン|スマート/.test(name)) return "家電";
    if (/電気|ガス|水道|光熱|NHK/.test(name)) return "固定費";
    if (/家賃|管理費|駐車場代|ローン/.test(name)) return "固定費";
    if (/薬|病院|クリニック|医療|歯科|調剤|ドラッグ|マツキヨ|ツルハ|スギ薬局|サンドラッグ/.test(name)) return "医療費";
    if (/日用|生活|ニトリ|無印|ホームセンター|カインズ|ケーヨー|コーナン/.test(name)) return "日用品";
    if (/映画|音楽|ゲーム|娯楽|netflix|amazon|書店|本屋|ブックオフ|カラオケ/.test(name)) return "娯楽費";
    if (/服|ユニクロ|zara|しまむら|美容|サロン|ヘア|アパレル/.test(name)) return "服飾美容";
    return "その他";
  }

  // 一括登録
  function bulkSave() {
    const toSave = parsedTxs
      .filter(t => t.checked)
      .map(t => ({
        id: Date.now() + Math.random(),
        type: t.type,
        amount: t.type === "expense" ? -Math.abs(t.amount) : t.amount,
        category: t.category,
        name: t.name,
        date: t.date,
        payment: t.payment,
        pet: t.pet,
        memo: t.memo,
      }));
    saveTx([...toSave, ...txList]);
    setParsedTxs([]);
    setPasteText("");
    setTab("home");
    setScreen("home");
  }

  if (splash) {
    return (
      <div style={{ minHeight:"100vh",
        background:"linear-gradient(160deg,#006B78 0%,#4DB6C6 60%,#7EE0C1 100%)",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        fontFamily:"'M PLUS 1p','Hiragino Sans',sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;700;800&display=swap');
          @keyframes dropIn {
            0% { transform: translateY(-40px) scale(0.8); opacity:0; }
            60% { transform: translateY(8px) scale(1.05); opacity:1; }
            100% { transform: translateY(0) scale(1); opacity:1; }
          }
          @keyframes fadeUp {
            0% { opacity:0; transform:translateY(16px); }
            100% { opacity:1; transform:translateY(0); }
          }
          @keyframes pulse {
            0%,100% { opacity:0.5; transform:scale(1); }
            50% { opacity:1; transform:scale(1.15); }
          }
        `}</style>
        <div style={{ animation:"dropIn 0.7s cubic-bezier(.34,1.56,.64,1) forwards" }}>
          <svg width="90" height="90" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0C19 10 12 2 12 2z" fill="rgba(255,255,255,0.25)"/>
          </svg>
        </div>
        <p style={{ fontSize:36, fontWeight:"800", color:"#fff", margin:"12px 0 4px",
          letterSpacing:2, animation:"fadeUp 0.5s 0.4s ease forwards", opacity:0 }}>MIZU</p>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.75)", margin:0,
          animation:"fadeUp 0.5s 0.6s ease forwards", opacity:0 }}>家計簿アプリ</p>
        <div style={{ display:"flex", gap:8, marginTop:40,
          animation:"fadeUp 0.5s 0.8s ease forwards", opacity:0 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:8, height:8, borderRadius:"50%",
              background:"rgba(255,255,255,0.7)",
              animation:`pulse 1.2s ${i*0.2}s ease-in-out infinite` }}/>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;500;700;800;900&display=swap');
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes wave1 { 0%,100%{ transform:translateX(0) translateY(0); } 50%{ transform:translateX(40px) translateY(-20px); } }
        @keyframes wave2 { 0%,100%{ transform:translateX(0) translateY(0); } 50%{ transform:translateX(-30px) translateY(-15px); } }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity:0.5; }
        input[type="date"] { box-sizing:border-box; }
      `}</style>
      <div style={s.phone}>

        {/* ═══ ホーム ═══ */}
        {screen === "home" && <>
          <div style={s.header}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <DropIcon size={22} color="#006B78"/>
              <span style={s.headerTitle}>MIZU</span>
            </div>
            <div/>
          </div>
          <div style={s.scroll}>
            {/* 固定費未登録バナー */}
            {getUnregisteredFixed().length > 0 && (
              <button
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  width:"100%", margin:"12px 0 0", padding:"12px 16px", borderRadius:16,
                  background:"rgba(0,107,120,0.08)", border:"1.5px solid rgba(0,107,120,0.2)",
                  cursor:"pointer", fontFamily:"inherit" }}
                onClick={() => setShowFixedAlert(true)}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:"rgba(0,107,120,0.15)",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006B78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div style={{ textAlign:"left" }}>
                    <p style={{ fontSize:13, fontWeight:"700", color:"#006B78", margin:"0 0 1px" }}>
                      今月の固定費が未登録です
                    </p>
                    <p style={{ fontSize:11, color:"#4a7a80", margin:0 }}>
                      {getUnregisteredFixed().length}件 · タップして登録
                    </p>
                  </div>
                </div>
                <span style={{ fontSize:18, color:"#006B78" }}>›</span>
              </button>
            )}
            <div style={s.monthNav}>
              <button style={s.arrowBtn} onClick={prevMonth}>‹</button>
              <span style={s.monthLbl}>{year}年{month}月</span>
              <button style={s.arrowBtn} onClick={nextMonth}>›</button>
            </div>
            <div style={s.summaryCard}>
              <p style={s.summaryLbl}>今月の収支</p>
              <p style={{ ...s.summaryAmt, color: balance >= 0 ? "#fff" : "#fca5a5" }}>
                {balance >= 0 ? "+" : "-"}{fmtAmt(balance)}
              </p>
              <div style={s.summaryRow}>
                {[["収入", income],["支出", expense],...(income > 0 ? [["貯蓄", balance]] : [])].map(([l, v]) => (
                  <div key={l} style={s.summaryCell}>
                    <p style={s.cellLbl}>{l}</p>
                    <p style={s.cellVal}>{fmtAmt(v)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.card}>
              <p style={s.cardTitle}>支出カテゴリ</p>
              {catData.length === 0
                ? <p style={s.emptyMsg}>まだ支出がありません</p>
                : <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <DonutChart transactions={monthTx}/>
                    <div style={{ flex:1 }}>
                      {catData.slice(0,5).map(d => (
                        <div key={d.name} style={s.legendRow}>
                          <span style={{ ...s.dot, background:d.color }}/>
                          <span style={s.legendName}>{d.name}</span>
                          <span style={s.legendPct}>{d.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
              }
            </div>
            <div style={s.filterRow}>
              {["すべて","ウリ","ルル","共通"].map(f => (
                <button key={f} style={{ ...s.chip, ...(petFilter===f ? s.chipOn : {}) }}
                  onClick={() => setPetFilter(f)}>{f}</button>
              ))}
            </div>
            <div style={s.card}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <p style={s.cardTitle}>最近の取引</p>
                {viewTx.length > 0 && <span style={s.badge}>{viewTx.length}件</span>}
              </div>
              {viewTx.length === 0
                ? <p style={s.emptyMsg}>＋ボタンから追加してください</p>
                : <>
                    {(showAllTx ? viewTx : viewTx.slice(0,8)).map((tx, i) => (
                      <button key={tx.id}
                        style={{ ...s.txRow, borderTop: i===0?"none":"1px solid rgba(158,219,232,0.2)",
                          width:"100%", background:"none", border:"none", cursor:"pointer",
                          fontFamily:"inherit", textAlign:"left",
                          borderTop: i===0?"none":"1px solid rgba(158,219,232,0.2)" }}
                        onClick={() => goEdit(tx)}>
                        <div style={{ ...s.txIconBox, background: CAT_COLOR[tx.category]||"#CDEEF5", color:"#fff" }}>
                          {CAT_ICON[tx.category]}
                        </div>
                        <div style={{ flex:1 }}>
                          <p style={s.txName}>{tx.name}</p>
                          <div style={{ display:"flex", gap:4 }}>
                            <span style={s.catBadge}>{tx.category}</span>
                            <span style={s.petBadge}>{tx.pet}</span>
                          </div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <p style={{ ...s.txAmt, color: tx.amount<0?"#e05555":"#2a9d6e" }}>
                            {tx.amount<0?"-":"+"}{fmtAmt(tx.amount)}
                          </p>
                          <p style={s.txDate}>{fmtDate(tx.date).slice(5)}</p>
                        </div>
                      </button>
                    ))}
                    {viewTx.length > 8 && (
                      <button
                        style={{ width:"100%", padding:"12px 0", background:"none", border:"none",
                          borderTop:"1px solid rgba(158,219,232,0.2)", cursor:"pointer",
                          fontSize:13, fontWeight:"700", color:"#006B78", fontFamily:"inherit" }}
                        onClick={() => setShowAllTx(v => !v)}>
                        {showAllTx ? "▲ 閉じる" : `▼ もっと見る（残り${viewTx.length - 8}件）`}
                      </button>
                    )}
                  </>
              }
            </div>
            <div style={{ height:100 }}/>
          </div>
        </>}

        {/* ═══ 入力 ═══ */}
        {screen === "input" && <>
          <div style={s.header}>
            <button style={s.backBtn} onClick={editId ? () => { setScreen("tx"); setTab("tx"); } : goHome}>‹ 戻る</button>
            <span style={s.headerTitle}>{editId ? "取引を編集" : "取引を追加"}</span>
            {editId
              ? <button style={s.deleteTextBtn} onClick={() => setDeleteId(editId)}>削除</button>
              : <div style={{ width:60 }}/>
            }
          </div>
          <div style={s.typeTab}>
            {[["expense","支出"],["income","収入"]].map(([id, lbl]) => (
              <button key={id}
                style={{ ...s.typeBtn, ...(form.type===id ? (id==="expense"?s.typeBtnExp:s.typeBtnInc) : {}) }}
                onClick={() => { setF("type", id); setForm(f => ({ ...f, type:id, category:"", payment:"" })); }}>{lbl}</button>
            ))}
          </div>
          <div style={s.scroll}>
            <div style={{ padding:"22px 20px 10px", display:"flex", alignItems:"baseline", gap:6 }}>
              <span style={s.amtSymbol}>¥</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={form.amount}
                onChange={e => {
                  const v = e.target.value.replace(/[^0-9]/g, "");
                  setF("amount", v);
                }}
                style={{
                  ...s.amtInput,
                  fontSize: form.amount.length > 7 ? 28 : form.amount.length > 5 ? 36 : 44,
                }}
              />
            </div>
            {error.amount && <p style={s.errMsg}>{error.amount}</p>}
            <div style={s.divider}/>
            <Field label="内容" error={error.name}>
              <input type="text" placeholder="例：サミットストア"
                value={form.name} onChange={e => setF("name", e.target.value)} style={s.textInput}/>
            </Field>
            <Field label="カテゴリ" error={error.category}>
              <div style={s.chipGrid}>
                {(form.type === "income" ? CATEGORIES_INCOME : CATEGORIES_EXPENSE).map(c => (
                  <button key={c} style={{ ...s.selChip, ...(form.category===c?s.selChipOn:{}) }}
                    onClick={() => setF("category", c)}>
                    <span style={s.chipIconBox}>{CAT_ICON[c]}</span>
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            </Field>
            <Field label={form.type === "income" ? "支払い方法（任意）" : "支払い方法"} error={error.payment}>
              <div style={s.chipGrid}>
                {PAYMENTS.map(p => (
                  <button key={p}
                    style={{ ...s.selChip, ...(form.payment===p?s.selChipOn:{}) }}
                    onClick={() => setF("payment", form.payment === p ? "" : p)}>
                    <span style={s.chipIconBox}>{PAY_ICON[p]}</span>
                    <span>{p}</span>
                  </button>
                ))}
              </div>
              {form.payment && (
                <button style={s.clearBtn} onClick={() => setF("payment", "")}>
                  × 選択を解除
                </button>
              )}
            </Field>
            <Field label="対象">
              <div style={{ display:"flex", gap:8 }}>
                {PETS.map(p => (
                  <button key={p} style={{ ...s.petBtn, ...(form.pet===p?s.petBtnOn:{}) }}
                    onClick={() => setF("pet", p)}>{p}</button>
                ))}
              </div>
            </Field>
            <Field label="日付">
              <input type="date" value={form.date}
                onChange={e => setF("date", e.target.value)}
                style={{ ...s.textInput, width:"auto", display:"inline-block",
                  padding:"8px 12px", fontSize:13 }}/>
            </Field>
            <Field label="メモ（任意）">
              <input type="text" placeholder="自由にメモ"
                value={form.memo} onChange={e => setF("memo", e.target.value)} style={s.textInput}/>
            </Field>
            <button style={s.primaryBtn} onClick={handleNext}>内容を確認する →</button>
            <button style={s.ghostBtn} onClick={goHome}>キャンセル</button>
            <div style={{ height:48 }}/>
          </div>
        </>}

        {/* ═══ 確認 ═══ */}
        {screen === "confirm" && <>
          <div style={s.header}>
            <button style={s.backBtn} onClick={() => setScreen("input")}>‹ 修正する</button>
            <span style={s.headerTitle}>入力確認</span>
            <div style={{ width:60 }}/>
          </div>
          <div style={s.scroll}>
            <div style={s.confirmAmtCard}>
              <p style={s.confirmAmtLbl}>{form.type==="expense"?"支出":"収入"}</p>
              <p style={s.confirmAmt}>
                {form.type==="expense"?"−":"+"}¥{Number(form.amount).toLocaleString()}
              </p>
              <p style={s.confirmDate}>{fmtDate(form.date)}</p>
            </div>
            <div style={s.confirmCard}>
              {[
                { label:"内容",     value:form.name,          icon:null },
                { label:"カテゴリ", value:form.category,      icon:CAT_ICON[form.category] },
                { label:"支払い",   value:form.payment,       icon:PAY_ICON[form.payment] },
                { label:"対象",     value:form.pet,           icon:null },
                { label:"メモ",     value:form.memo||"なし",  icon:null },
              ].map(({ label, value, icon }) => (
                <div key={label} style={s.confirmRow}>
                  <span style={s.confirmLbl}>{label}</span>
                  <span style={{ ...s.confirmVal, display:"flex", alignItems:"center", gap:5 }}>
                    {icon && <span style={{ color:"#4DB6C6" }}>{icon}</span>}
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ fontSize:11, color:"#7aacb5", textAlign:"center", margin:"0 0 14px" }}>
              内容を確認して「登録する」を押してください
            </p>
            <button style={s.primaryBtn} onClick={handleSave}>✓ 登録する</button>
            <button style={s.ghostBtn} onClick={() => setScreen("input")}>修正する</button>
            <div style={{ height:48 }}/>
          </div>
        </>}

        {/* ═══ 完了 ═══ */}
        {screen === "done" && <>
          <div style={s.header}>
            <div style={{ width:60 }}/>
            <span style={s.headerTitle}>登録完了</span>
            <div style={{ width:60 }}/>
          </div>
          <div style={s.doneWrap}>
            <div style={s.doneIcon}>
              <DropIcon size={40} color="#7EE0C1"/>
            </div>
            <p style={s.doneTitle}>登録しました！</p>
            <div style={s.doneCard}>
              <p style={s.doneAmt}>¥{Number(form.amount).toLocaleString()}</p>
              <p style={s.doneName}>{form.name}</p>
              <div style={{ height:1, background:"rgba(158,219,232,0.35)", margin:"10px 0 6px" }}/>
              {[
                { label:"カテゴリ", value:form.category,      icon:CAT_ICON[form.category] },
                { label:"支払い",   value:form.payment,       icon:PAY_ICON[form.payment] },
                { label:"日付",     value:fmtDate(form.date), icon:null },
                { label:"対象",     value:form.pet,           icon:null },
              ].map(({ label, value, icon }) => (
                <div key={label} style={s.doneRow}>
                  <span style={s.doneLbl}>{label}</span>
                  <span style={{ ...s.doneVal, display:"flex", alignItems:"center", gap:4 }}>
                    {icon && <span style={{ color:"#4DB6C6" }}>{icon}</span>}
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <button style={s.primaryBtn} onClick={goInput}>続けて入力する</button>
            <button style={s.ghostBtn}   onClick={goHome}>ホームに戻る</button>
          </div>
        </>}

        {/* ═══ 取引一覧 ═══ */}
        {screen === "tx" && <>
          <div style={s.header}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <DropIcon size={22} color="#006B78"/>
              <span style={s.headerTitle}>取引一覧</span>
            </div>
            <div/>
          </div>
          <div style={s.scroll}>
            {/* 検索バー */}
            <div style={{ padding:"12px 0 4px", position:"relative" }}>
              <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
                color:"#9EDBE8", pointerEvents:"none", paddingTop:2 }}>
                <SearchIcon size={16}/>
              </div>
              <input
                type="text"
                placeholder="店名・カテゴリ・メモで検索..."
                value={txSearch}
                onChange={e => setTxSearch(e.target.value)}
                style={{ ...s.textInput, paddingLeft:36, fontSize:13,
                  background:"rgba(255,255,255,0.8)" }}
              />
              {txSearch && (
                <button
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", color:"#9EDBE8", fontSize:16,
                    cursor:"pointer", padding:0 }}
                  onClick={() => setTxSearch("")}>×</button>
              )}
            </div>

            {/* 検索中は全期間・月ナビは非表示 */}
            {!txSearch && (
              <div style={s.monthNav}>
                <button style={s.arrowBtn} onClick={() => {
                  if (txMonth === 1) { setTxMonth(12); setTxYear(y => y-1); }
                  else setTxMonth(m => m-1);
                }}>‹</button>
                <span style={s.monthLbl}>{txYear}年{txMonth}月</span>
                <button style={s.arrowBtn} onClick={() => {
                  if (txMonth === 12) { setTxMonth(1); setTxYear(y => y+1); }
                  else setTxMonth(m => m+1);
                }}>›</button>
              </div>
            )}

            {/* 月集計バー */}
            {(() => {
              const mTx = txList.filter(t => {
                const [y, m] = t.date.split("-").map(Number);
                return y === txYear && m === txMonth;
              });
              const inc = mTx.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount,0);
              const exp = mTx.filter(t=>t.amount<0).reduce((s,t)=>s+Math.abs(t.amount),0);
              return (
                <div style={s.txSummaryBar}>
                  <div style={s.txSummaryItem}>
                    <span style={s.txSummaryLbl}>収入</span>
                    <span style={{ ...s.txSummaryVal, color:"#2a9d6e" }}>{fmtAmt(inc)}</span>
                  </div>
                  <div style={s.txSummaryDivider}/>
                  <div style={s.txSummaryItem}>
                    <span style={s.txSummaryLbl}>支出</span>
                    <span style={{ ...s.txSummaryVal, color:"#006B78" }}>{fmtAmt(exp)}</span>
                  </div>
                  <div style={s.txSummaryDivider}/>
                  <div style={s.txSummaryItem}>
                    <span style={s.txSummaryLbl}>件数</span>
                    <span style={s.txSummaryVal}>{mTx.length}件</span>
                  </div>
                </div>
              );
            })()}

            {/* 取引リスト */}
            {(() => {
              // 検索中は全期間、そうでなければ月フィルタ
              let mTx = txSearch
                ? txList.filter(t => {
                    const q = txSearch.toLowerCase();
                    return (t.name||"").toLowerCase().includes(q)
                      || (t.category||"").toLowerCase().includes(q)
                      || (t.memo||"").toLowerCase().includes(q)
                      || (t.payment||"").toLowerCase().includes(q)
                      || (t.pet||"").toLowerCase().includes(q);
                  })
                : txList.filter(t => {
                    const [y, m] = t.date.split("-").map(Number);
                    return y === txYear && m === txMonth;
                  });
              mTx = mTx.sort((a, b) => b.date.localeCompare(a.date));

              if (mTx.length === 0) return (
                <p style={{ ...s.emptyMsg, marginTop:32 }}>
                  {txSearch ? `「${txSearch}」は見つかりませんでした` : "この月の取引はありません"}
                </p>
              );

              // 検索中は件数表示、通常は日付グループ
              if (txSearch) {
                return (
                  <div>
                    <p style={{ fontSize:11, color:"#4a7a80", margin:"8px 0 10px",
                      fontWeight:"600" }}>{mTx.length}件見つかりました</p>
                    <div style={s.card}>
                      {mTx.map((tx, i) => (
                        <button key={tx.id}
                          style={{ ...s.txRowBtn, borderTop: i===0?"none":"1px solid rgba(158,219,232,0.2)" }}
                          onClick={() => goEdit(tx)}>
                          <div style={{ ...s.txIconBox, background: CAT_COLOR[tx.category]||"#CDEEF5", color:"#fff" }}>
                            {CAT_ICON[tx.category]}
                          </div>
                          <div style={{ flex:1, textAlign:"left" }}>
                            <p style={s.txName}>{tx.name}</p>
                            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                              <span style={s.catBadge}>{tx.category}</span>
                              <span style={s.petBadge}>{tx.pet}</span>
                              <span style={{ fontSize:10, color:"#7aacb5" }}>{fmtDate(tx.date)}</span>
                            </div>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            <p style={{ ...s.txAmt, color: tx.amount<0?"#e05555":"#2a9d6e" }}>
                              {tx.amount<0?"-":"+"}{fmtAmt(tx.amount)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }
              // 日付でグループ化
              const groups = {};
              mTx.forEach(t => {
                if (!groups[t.date]) groups[t.date] = [];
                groups[t.date].push(t);
              });
              return Object.entries(groups)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([date, txs]) => (
                  <div key={date} style={{ marginBottom:8 }}>
                    <p style={s.dateLabel}>{fmtDate(date)}</p>
                    <div style={s.card}>
                      {txs.map((tx, i) => (
                        <button key={tx.id}
                          style={{ ...s.txRowBtn, borderTop: i===0?"none":"1px solid rgba(158,219,232,0.2)" }}
                          onClick={() => goEdit(tx)}>
                          <div style={{ ...s.txIconBox, background: CAT_COLOR[tx.category]||"#CDEEF5", color:"#fff" }}>
                            {CAT_ICON[tx.category]}
                          </div>
                          <div style={{ flex:1, textAlign:"left" }}>
                            <p style={s.txName}>{tx.name}</p>
                            <div style={{ display:"flex", gap:4 }}>
                              <span style={s.catBadge}>{tx.category}</span>
                              <span style={s.petBadge}>{tx.pet}</span>
                              {tx.payment && <span style={s.payBadge}>{tx.payment}</span>}
                            </div>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            <p style={{ ...s.txAmt, color: tx.amount<0?"#e05555":"#2a9d6e" }}>
                              {tx.amount<0?"-":"+"}{fmtAmt(tx.amount)}
                            </p>
                            <p style={{ fontSize:10, color:"#7aacb5", margin:0 }}>タップで編集</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ));
            })()}
            <div style={{ height:100 }}/>
          </div>
        </>}

        {/* ═══ レポート ═══ */}
        {screen === "report" && (() => {
          // 過去12ヶ月のデータを生成
          const months12 = [];
          for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const y = d.getFullYear(), m = d.getMonth() + 1;
            const mTx = txList.filter(t => {
              const [ty, tm] = t.date.split("-").map(Number);
              return ty === y && tm === m;
            });
            const inc = mTx.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount,0);
            const exp = mTx.filter(t=>t.amount<0).reduce((s,t)=>s+Math.abs(t.amount),0);
            // 収入カテゴリ別集計
            const incByCat = {};
            mTx.filter(t=>t.amount>0).forEach(t=>{
              incByCat[t.category] = (incByCat[t.category]||0) + t.amount;
            });
            months12.push({ label:`${m}月`, y, m, inc, exp, bal: inc-exp, incByCat });
          }
          const months6 = months12.slice(6); // 後半6ヶ月（後方互換）
          const maxVal = Math.max(...months12.flatMap(d=>[d.inc, d.exp]), 1);
          const maxVal6 = Math.max(...months6.flatMap(d=>[d.inc, d.exp]), 1);

          // 今月カテゴリ集計
          const curMTx = txList.filter(t => {
            const [y2, m2] = t.date.split("-").map(Number);
            return y2 === now.getFullYear() && m2 === now.getMonth()+1;
          });
          const catMap = {};
          curMTx.filter(t=>t.amount<0).forEach(t=>{
            catMap[t.category] = (catMap[t.category]||0) + Math.abs(t.amount);
          });
          const catTotal = Object.values(catMap).reduce((a,b)=>a+b,0)||1;
          const catRanking = Object.entries(catMap)
            .sort((a,b)=>b[1]-a[1])
            .map(([name,amt])=>({ name, amt, pct: Math.round(amt/catTotal*100), color: CAT_COLOR[name]||"#9EDBE8" }));

          // 6ヶ月合計
          const total6inc = months6.reduce((s,d)=>s+d.inc,0);
          const total6exp = months6.reduce((s,d)=>s+d.exp,0);
          const avgExp    = Math.round(total6exp / 6);

          return <>
            <div style={s.header}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <DropIcon size={22} color="#006B78"/>
                <span style={s.headerTitle}>レポート</span>
              </div>
              <div/>
            </div>
            <div style={s.scroll}>

              {/* 12ヶ月サマリー */}
              <div style={{ ...s.summaryCard, marginTop:14 }}>
                <p style={s.summaryLbl}>過去12ヶ月の合計</p>
                <div style={s.summaryRow}>
                  {[
                    ["収入",  months12.reduce((s,d)=>s+d.inc,0)],
                    ["支出",  months12.reduce((s,d)=>s+d.exp,0)],
                    ["月平均支出", Math.round(months12.reduce((s,d)=>s+d.exp,0)/12)],
                  ].map(([l,v])=>(
                    <div key={l} style={s.summaryCell}>
                      <p style={s.cellLbl}>{l}</p>
                      <p style={{ ...s.cellVal, fontSize: l==="月平均支出"?10:13 }}>{fmtAmt(v)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 年間収入内訳 */}
              {(() => {
                const yearTx = txList.filter(t => {
                  const [y] = t.date.split("-").map(Number);
                  return y === now.getFullYear() && t.amount > 0;
                });
                const hongyoTotal = yearTx
                  .filter(t => t.category === "給料" || t.category === "ボーナス")
                  .reduce((s, t) => s + t.amount, 0);
                const tadakayoTotal = yearTx
                  .filter(t => t.category === "タダカヨ収入")
                  .reduce((s, t) => s + t.amount, 0);
                const otherTotal = yearTx
                  .filter(t => t.category !== "給料" && t.category !== "ボーナス" && t.category !== "タダカヨ収入")
                  .reduce((s, t) => s + t.amount, 0);
                const grandTotal = hongyoTotal + tadakayoTotal + otherTotal;

                // 月別内訳
                const monthlyData = [];
                for (let m = 1; m <= 12; m++) {
                  const mTx = txList.filter(t => {
                    const [ty, tm] = t.date.split("-").map(Number);
                    return ty === now.getFullYear() && tm === m && t.amount > 0;
                  });
                  const hongyo = mTx.filter(t => t.category === "給料" || t.category === "ボーナス").reduce((s,t)=>s+t.amount,0);
                  const tadakayo = mTx.filter(t => t.category === "タダカヨ収入").reduce((s,t)=>s+t.amount,0);
                  const total = mTx.reduce((s,t)=>s+t.amount,0);
                  if (total > 0) monthlyData.push({ m, hongyo, tadakayo, total });
                }

                if (grandTotal === 0) return null;
                return (
                  <div style={s.card}>
                    <p style={s.cardTitle}>{now.getFullYear()}年 収入内訳</p>

                    {/* 合計サマリー */}
                    <div style={{ background:"linear-gradient(135deg,#006B78,#4DB6C6)", borderRadius:16,
                      padding:"16px", marginBottom:14 }}>
                      <p style={{ fontSize:11, color:"rgba(255,255,255,0.75)", margin:"0 0 4px" }}>年間収入合計</p>
                      <p style={{ fontSize:28, fontWeight:"800", color:"#fff", margin:"0 0 12px", letterSpacing:-1 }}>
                        {fmtAmt(grandTotal)}
                      </p>
                      <div style={{ display:"flex", gap:8 }}>
                        {[
                          ["本業", hongyoTotal, "#7EE0C1"],
                          ["タダカヨ", tadakayoTotal, "#9EDBE8"],
                          ...(otherTotal > 0 ? [["その他", otherTotal, "#CDEEF5"]] : []),
                        ].map(([label, val, color]) => (
                          <div key={label} style={{ flex:1, background:"rgba(255,255,255,0.15)",
                            borderRadius:10, padding:"8px 6px", textAlign:"center" }}>
                            <p style={{ fontSize:10, color:"rgba(255,255,255,0.75)", margin:"0 0 2px" }}>{label}</p>
                            <p style={{ fontSize:12, fontWeight:"700", color:"#fff", margin:0 }}>{fmtAmt(val)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 割合バー */}
                    <div style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", height:12, borderRadius:6, overflow:"hidden", marginBottom:6 }}>
                        {hongyoTotal > 0 && (
                          <div style={{ width:`${Math.round(hongyoTotal/grandTotal*100)}%`,
                            background:"#006B78" }}/>
                        )}
                        {tadakayoTotal > 0 && (
                          <div style={{ width:`${Math.round(tadakayoTotal/grandTotal*100)}%`,
                            background:"#7EE0C1" }}/>
                        )}
                        {otherTotal > 0 && (
                          <div style={{ width:`${Math.round(otherTotal/grandTotal*100)}%`,
                            background:"#CDEEF5" }}/>
                        )}
                      </div>
                      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                        {[
                          ["本業", hongyoTotal, "#006B78"],
                          ["タダカヨ", tadakayoTotal, "#7EE0C1"],
                          ...(otherTotal > 0 ? [["その他", otherTotal, "#CDEEF5"]] : []),
                        ].map(([label, val, color]) => (
                          <div key={label} style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <div style={{ width:10, height:10, borderRadius:2, background:color }}/>
                            <span style={{ fontSize:11, color:"#4a7a80" }}>
                              {label} {grandTotal > 0 ? Math.round(val/grandTotal*100) : 0}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 月別テーブル */}
                    {monthlyData.length > 0 && (
                      <div>
                        <div style={{ display:"flex", borderBottom:"1px solid rgba(158,219,232,0.3)",
                          paddingBottom:6, marginBottom:4 }}>
                          {["月","本業","タダカヨ","合計"].map(h => (
                            <span key={h} style={{ flex:1, fontSize:10, color:"#4a7a80", fontWeight:"700",
                              textAlign: h==="月" ? "left" : "right" }}>{h}</span>
                          ))}
                        </div>
                        {monthlyData.map((d, i) => (
                          <div key={d.m} style={{ display:"flex", padding:"7px 0",
                            borderBottom:"1px solid rgba(158,219,232,0.15)" }}>
                            <span style={{ flex:1, fontSize:12, color:"#1a3a3f", fontWeight:"600" }}>{d.m}月</span>
                            <span style={{ flex:1, fontSize:12, color:"#006B78", textAlign:"right" }}>
                              {d.hongyo > 0 ? fmtAmt(d.hongyo) : "-"}
                            </span>
                            <span style={{ flex:1, fontSize:12, color:"#2a9d6e", textAlign:"right" }}>
                              {d.tadakayo > 0 ? fmtAmt(d.tadakayo) : "-"}
                            </span>
                            <span style={{ flex:1, fontSize:12, fontWeight:"700", color:"#1a3a3f", textAlign:"right" }}>
                              {fmtAmt(d.total)}
                            </span>
                          </div>
                        ))}
                        {/* 合計行 */}
                        <div style={{ display:"flex", padding:"10px 0",
                          borderTop:"2px solid rgba(158,219,232,0.4)", marginTop:4 }}>
                          <span style={{ flex:1, fontSize:13, color:"#1a3a3f", fontWeight:"700" }}>合計</span>
                          <span style={{ flex:1, fontSize:13, color:"#006B78", textAlign:"right", fontWeight:"700" }}>
                            {fmtAmt(hongyoTotal)}
                          </span>
                          <span style={{ flex:1, fontSize:13, color:"#2a9d6e", textAlign:"right", fontWeight:"700" }}>
                            {fmtAmt(tadakayoTotal)}
                          </span>
                          <span style={{ flex:1, fontSize:13, fontWeight:"800", color:"#006B78", textAlign:"right" }}>
                            {fmtAmt(grandTotal)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* 棒グラフ：月別収支（過去12ヶ月・金額表示付き） */}
              <div style={s.card}>
                <p style={s.cardTitle}>月別収支（過去12ヶ月）</p>
                <div style={{ display:"flex", gap:3, marginBottom:6, overflowX:"auto" }}>
                  {months12.map((d,i) => {
                    const incH = maxVal > 0 ? Math.max(Math.round(d.inc/maxVal*80), d.inc>0?4:0) : 0;
                    const expH = maxVal > 0 ? Math.max(Math.round(d.exp/maxVal*80), d.exp>0?4:0) : 0;
                    return (
                      <div key={i} style={{ minWidth:24, flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                        <div style={{ width:"100%", height:90, display:"flex", alignItems:"flex-end",
                          justifyContent:"center", gap:1 }}>
                          <div style={{ width:"44%", height:incH, background:"#2a9d6e",
                            borderRadius:"2px 2px 0 0", position:"relative" }}>
                            {d.inc > 0 && incH > 20 && (
                              <span style={{ position:"absolute", top:-14, left:"50%",
                                transform:"translateX(-50%)", fontSize:7, color:"#2a9d6e",
                                fontWeight:"700", whiteSpace:"nowrap" }}>
                                {Math.round(d.inc/10000)}万
                              </span>
                            )}
                          </div>
                          <div style={{ width:"44%", height:expH, background:"#e05555",
                            borderRadius:"2px 2px 0 0", position:"relative" }}>
                            {d.exp > 0 && expH > 20 && (
                              <span style={{ position:"absolute", top:-14, left:"50%",
                                transform:"translateX(-50%)", fontSize:7, color:"#e05555",
                                fontWeight:"700", whiteSpace:"nowrap" }}>
                                {Math.round(d.exp/10000)}万
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ height:1, width:"100%", background:"rgba(158,219,232,0.4)" }}/>
                        <span style={{ fontSize:8, color:"#4a7a80", marginTop:3 }}>{d.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:4 }}>
                  {[["#2a9d6e","収入"],["#e05555","支出"]].map(([c,l])=>(
                    <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <div style={{ width:10, height:10, borderRadius:2, background:c }}/>
                      <span style={{ fontSize:11, color:"#4a7a80", fontWeight:"600" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* カテゴリ別ランキング */}
              <div style={s.card}>
                <p style={s.cardTitle}>今月のカテゴリ別支出</p>
                {catRanking.length === 0
                  ? <p style={s.emptyMsg}>まだ支出がありません</p>
                  : catRanking.map((d,i)=>(
                      <div key={d.name} style={{ marginBottom:10 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontSize:13, fontWeight:"700", color:"#4a7a80" }}>{i+1}</span>
                            <span style={{ ...s.dot, background:d.color, width:10, height:10 }}/>
                            <span style={{ fontSize:13, color:"#1a3a3f", fontWeight:"600" }}>{d.name}</span>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            <span style={{ fontSize:13, fontWeight:"700", color:"#e05555" }}>{fmtAmt(d.amt)}</span>
                            <span style={{ fontSize:10, color:"#7aacb5", marginLeft:4 }}>{d.pct}%</span>
                          </div>
                        </div>
                        <div style={{ height:6, background:"rgba(158,219,232,0.25)", borderRadius:3 }}>
                          <div style={{ height:"100%", width:`${d.pct}%`, background:d.color,
                            borderRadius:3 }}/>
                        </div>
                      </div>
                    ))
                }
              </div>

              {/* 月別詳細テーブル */}
              <div style={s.card}>
                <p style={s.cardTitle}>月別サマリー（過去12ヶ月）</p>
                <div style={{ display:"flex", borderBottom:"1px solid rgba(158,219,232,0.3)", paddingBottom:6, marginBottom:4 }}>
                  {["月","収入","支出","収支"].map(h=>(
                    <span key={h} style={{ flex:1, fontSize:10, color:"#4a7a80", fontWeight:"700", textAlign:"right",
                      ...(h==="月"?{textAlign:"left"}:{}) }}>{h}</span>
                  ))}
                </div>
                {[...months12].reverse().map((d,i)=>(
                  <div key={i} style={{ display:"flex", padding:"7px 0",
                    borderBottom:"1px solid rgba(158,219,232,0.15)" }}>
                    <span style={{ flex:1, fontSize:12, color:"#1a3a3f", fontWeight:"600" }}>{d.y}/{d.label}</span>
                    <span style={{ flex:1, fontSize:12, color:"#2a9d6e", textAlign:"right" }}>{fmtAmt(d.inc)}</span>
                    <span style={{ flex:1, fontSize:12, color:"#e05555", textAlign:"right" }}>{fmtAmt(d.exp)}</span>
                    <span style={{ flex:1, fontSize:12, fontWeight:"700", textAlign:"right",
                      color: d.bal>=0?"#2a9d6e":"#d9534f" }}>
                      {d.bal>=0?"+":"-"}{fmtAmt(d.bal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* カテゴリ別明細（アコーディオン） */}
              <div style={s.card}>
                <p style={s.cardTitle}>カテゴリ別明細（今月）</p>
                {catRanking.length === 0
                  ? <p style={s.emptyMsg}>まだ支出がありません</p>
                  : catRanking.map(d => {
                      const isOpen = openCat === d.name;
                      const items = curMTx.filter(t => t.amount < 0 && t.category === d.name)
                        .sort((a,b) => b.date.localeCompare(a.date));
                      return (
                        <div key={d.name} style={{ borderBottom:"1px solid rgba(158,219,232,0.2)" }}>
                          <button
                            style={{
                              ...s.accordionBtn,
                              background: isOpen ? "rgba(0,107,120,0.04)" : "none",
                              borderRadius: isOpen ? "12px 12px 0 0" : 0,
                              padding:"14px 10px",
                            }}
                            onClick={() => setOpenCat(isOpen ? null : d.name)}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <span style={{ ...s.dot, background:d.color, width:12, height:12 }}/>
                              <span style={{ fontSize:14, fontWeight:"700", color:"#1a3a3f" }}>{d.name}</span>
                              <span style={{ fontSize:11, color:"#7aacb5" }}>{items.length}件</span>
                            </div>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <span style={{ fontSize:14, fontWeight:"700", color:"#006B78" }}>{fmtAmt(d.amt)}</span>
                              <div style={{
                                width:20, height:20, borderRadius:"50%",
                                background: isOpen ? "#006B78" : "rgba(158,219,232,0.4)",
                                display:"flex", alignItems:"center", justifyContent:"center",
                                transition:"background 0.2s",
                              }}>
                                <span style={{
                                  fontSize:10, color: isOpen ? "#fff" : "#4a7a80",
                                  display:"inline-block",
                                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                  transition:"transform 0.2s", lineHeight:1,
                                }}>▼</span>
                              </div>
                            </div>
                          </button>
                          {isOpen && (
                            <div style={s.accordionBody}>
                              {items.map((tx,i) => (
                                <div key={tx.id} style={{ ...s.accordionRow,
                                  borderTop: i===0?"none":"1px solid rgba(158,219,232,0.2)" }}>
                                  <div style={{ flex:1 }}>
                                    <p style={{ fontSize:13, fontWeight:"600", color:"#1a3a3f", margin:"0 0 3px" }}>{tx.name}</p>
                                    <p style={{ fontSize:11, color:"#7aacb5", margin:0 }}>{fmtDate(tx.date)} · {tx.pet}</p>
                                  </div>
                                  <span style={{ fontSize:14, fontWeight:"700", color:"#006B78" }}>
                                    -{fmtAmt(tx.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                }
              </div>

              {/* 支払い方法別明細（アコーディオン） */}
              {(() => {
                const payMap = {};
                curMTx.filter(t=>t.amount<0 && t.payment).forEach(t=>{
                  if (!payMap[t.payment]) payMap[t.payment] = { total:0, items:[] };
                  payMap[t.payment].total += Math.abs(t.amount);
                  payMap[t.payment].items.push(t);
                });
                const payList = Object.entries(payMap)
                  .sort((a,b)=>b[1].total-a[1].total);
                return (
                  <div style={s.card}>
                    <p style={s.cardTitle}>支払い方法別明細（今月）</p>
                    {payList.length === 0
                      ? <p style={s.emptyMsg}>まだ支出がありません</p>
                      : payList.map(([pay, data]) => {
                          const isOpen = openPay === pay;
                          const items = data.items.sort((a,b)=>b.date.localeCompare(a.date));
                          return (
                            <div key={pay} style={{ borderBottom:"1px solid rgba(158,219,232,0.2)" }}>
                              <button
                                style={{
                                  ...s.accordionBtn,
                                  background: isOpen ? "rgba(0,107,120,0.04)" : "none",
                                  borderRadius: isOpen ? "12px 12px 0 0" : 0,
                                  padding:"14px 10px",
                                }}
                                onClick={() => setOpenPay(isOpen ? null : pay)}>
                                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                  <span style={{ color:"#4DB6C6" }}>{PAY_ICON[pay]}</span>
                                  <span style={{ fontSize:14, fontWeight:"700", color:"#1a3a3f" }}>{pay}</span>
                                  <span style={{ fontSize:11, color:"#7aacb5" }}>{items.length}件</span>
                                </div>
                                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                  <span style={{ fontSize:14, fontWeight:"700", color:"#006B78" }}>{fmtAmt(data.total)}</span>
                                  <div style={{
                                    width:20, height:20, borderRadius:"50%",
                                    background: isOpen ? "#006B78" : "rgba(158,219,232,0.4)",
                                    display:"flex", alignItems:"center", justifyContent:"center",
                                    transition:"background 0.2s",
                                  }}>
                                    <span style={{
                                      fontSize:10, color: isOpen ? "#fff" : "#4a7a80",
                                      display:"inline-block",
                                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                      transition:"transform 0.2s", lineHeight:1,
                                    }}>▼</span>
                                  </div>
                                </div>
                              </button>
                              {isOpen && (
                                <div style={s.accordionBody}>
                                  {items.map((tx,i) => (
                                    <div key={tx.id} style={{ ...s.accordionRow,
                                      borderTop: i===0?"none":"1px solid rgba(158,219,232,0.2)" }}>
                                      <div style={{ flex:1 }}>
                                        <p style={{ fontSize:13, fontWeight:"600", color:"#1a3a3f", margin:"0 0 3px" }}>{tx.name}</p>
                                        <p style={{ fontSize:11, color:"#7aacb5", margin:0 }}>
                                          {fmtDate(tx.date)} · {tx.category} · {tx.pet}
                                        </p>
                                      </div>
                                      <span style={{ fontSize:14, fontWeight:"700", color:"#006B78" }}>
                                        -{fmtAmt(tx.amount)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })
                    }
                  </div>
                );
              })()}


              {/* 収入内訳アコーディオン */}
              {(() => {
                const incMap = {};
                curMTx.filter(t=>t.amount>0).forEach(t=>{
                  if (!incMap[t.category]) incMap[t.category] = { total:0, items:[] };
                  incMap[t.category].total += t.amount;
                  incMap[t.category].items.push(t);
                });
                const incList = Object.entries(incMap).sort((a,b)=>b[1].total-a[1].total);
                const incTotal = incList.reduce((s,[,d])=>s+d.total, 0);
                return (
                  <div style={s.card}>
                    <p style={s.cardTitle}>収入内訳（今月）</p>
                    {incList.length === 0
                      ? <p style={s.emptyMsg}>まだ収入がありません</p>
                      : incList.map(([cat, data]) => {
                          const key = "inc_" + cat;
                          const isOpen = openCat === key;
                          const pct = incTotal > 0 ? Math.round(data.total/incTotal*100) : 0;
                          const items = data.items.sort((a,b)=>b.date.localeCompare(a.date));
                          return (
                            <div key={cat} style={{ borderBottom:"1px solid rgba(42,157,110,0.15)" }}>
                              <button
                                style={{ ...s.accordionBtn, padding:"14px 10px",
                                  background: isOpen?"rgba(42,157,110,0.05)":"none" }}
                                onClick={() => setOpenCat(isOpen ? null : key)}>
                                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                  <span style={{ ...s.dot, background:"#2a9d6e", width:12, height:12 }}/>
                                  <span style={{ fontSize:14, fontWeight:"700", color:"#1a3a3f" }}>{cat}</span>
                                  <span style={{ fontSize:11, color:"#7aacb5" }}>{items.length}件</span>
                                </div>
                                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                  <span style={{ fontSize:14, fontWeight:"700", color:"#2a9d6e" }}>{fmtAmt(data.total)}</span>
                                  <div style={{ width:20, height:20, borderRadius:"50%",
                                    background:isOpen?"#2a9d6e":"rgba(158,219,232,0.4)",
                                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                                    <span style={{ fontSize:10, color:isOpen?"#fff":"#4a7a80",
                                      display:"inline-block", lineHeight:1,
                                      transform:isOpen?"rotate(180deg)":"rotate(0deg)" }}>▼</span>
                                  </div>
                                </div>
                              </button>
                              <div style={{ height:4, background:"rgba(42,157,110,0.12)",
                                borderRadius:2, margin:"0 10px 6px" }}>
                                <div style={{ height:"100%", width:`${pct}%`,
                                  background:"#2a9d6e", borderRadius:2 }}/>
                              </div>
                              {isOpen && (
                                <div style={{ ...s.accordionBody, background:"rgba(42,157,110,0.04)",
                                  border:"1px solid rgba(42,157,110,0.15)" }}>
                                  {items.map((tx,i) => (
                                    <div key={tx.id} style={{ ...s.accordionRow,
                                      borderTop:i===0?"none":"1px solid rgba(42,157,110,0.12)" }}>
                                      <div style={{ flex:1 }}>
                                        <p style={{ fontSize:13, fontWeight:"600", color:"#1a3a3f", margin:"0 0 3px" }}>{tx.name}</p>
                                        <p style={{ fontSize:11, color:"#7aacb5", margin:0 }}>{fmtDate(tx.date)} · {tx.pet}</p>
                                      </div>
                                      <span style={{ fontSize:14, fontWeight:"700", color:"#2a9d6e" }}>
                                        +{fmtAmt(tx.amount)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })
                    }
                  </div>
                );
              })()}
              <div style={{ height:100 }}/>
            </div>
          </>;
        })()}

        {/* ═══ ＋メニュー ═══ */}
        {showAddMenu && (
          <div style={s.modalOverlay} onClick={() => setShowAddMenu(false)}>
            <div style={{ ...s.modalBox, padding:"24px 20px" }} onClick={e => e.stopPropagation()}>
              <p style={s.modalTitle}>取引を追加</p>
              <p style={s.modalSub}>入力方法を選んでください</p>

              {/* 手動入力 */}
              <button style={s.menuBtn} onClick={() => { setShowAddMenu(false); goInput(); }}>
                <div style={s.menuBtnIcon}>
                  <TxIcon size={22} color="#006B78"/>
                </div>
                <div style={{ textAlign:"left" }}>
                  <p style={s.menuBtnTitle}>手動で入力</p>
                  <p style={s.menuBtnSub}>金額・カテゴリを自分で入力</p>
                </div>
              </button>

              {/* カメラ撮影 */}
              <label style={s.menuBtn}>
                <input type="file" accept="image/*" capture="environment"
                  style={{ display:"none" }} onChange={handleImageSelect}/>
                <div style={{ ...s.menuBtnIcon, background:"rgba(42,157,110,0.12)" }}>
                  <CameraIcon size={22} color="#2a9d6e"/>
                </div>
                <div style={{ textAlign:"left" }}>
                  <p style={{ ...s.menuBtnTitle, color:"#2a9d6e" }}>レシートを撮影</p>
                  <p style={s.menuBtnSub}>カメラで撮ってAIが自動読み取り</p>
                </div>
              </label>

              {/* テキスト貼り付け */}
              <button style={{ ...s.menuBtn }} onClick={() => { setShowAddMenu(false); setPasteText(""); setScreen("paste"); }}>
                <div style={{ ...s.menuBtnIcon, background:"rgba(126,224,193,0.15)" }}>
                  <PasteIcon size={22} color="#7EE0C1"/>
                </div>
                <div style={{ textAlign:"left" }}>
                  <p style={{ ...s.menuBtnTitle, color:"#2a9d8a" }}>テキストを貼り付け</p>
                  <p style={s.menuBtnSub}>明細をコピペして一括取り込み</p>
                </div>
              </button>

              {/* ライブラリから選択 */}
              <label style={{ ...s.menuBtn, marginBottom:0 }}>
                <input type="file" accept="image/*"
                  style={{ display:"none" }} onChange={handleImageSelect}/>
                <div style={{ ...s.menuBtnIcon, background:"rgba(77,182,198,0.12)" }}>
                  <ImageIcon size={22} color="#4DB6C6"/>
                </div>
                <div style={{ textAlign:"left" }}>
                  <p style={{ ...s.menuBtnTitle, color:"#4DB6C6" }}>写真から選ぶ</p>
                  <p style={s.menuBtnSub}>スクショや保存済み画像を読み取り</p>
                </div>
              </label>

              <button style={{ ...s.ghostBtn, marginTop:16 }}
                onClick={() => setShowAddMenu(false)}>キャンセル</button>
            </div>
          </div>
        )}

        {/* ═══ レシート確認画面 ═══ */}
        {screen === "receipt" && <>
          <div style={s.header}>
            <button style={s.backBtn} onClick={() => { setReceiptImg(null); setShowAddMenu(false); setScreen("home"); }}>
              ‹ 戻る
            </button>
            <span style={s.headerTitle}>レシート読み取り</span>
            <div style={{ width:60 }}/>
          </div>
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", padding:"20px", gap:16, overflowY:"auto" }}>

            {/* プレビュー */}
            {receiptImg && (
              <div style={{ width:"100%", borderRadius:20, overflow:"hidden",
                border:"2px solid rgba(158,219,232,0.4)",
                boxShadow:"0 4px 16px rgba(0,107,120,0.1)", maxHeight:340 }}>
                <img src={receiptImg} alt="レシート"
                  style={{ width:"100%", height:"100%", objectFit:"contain", display:"block" }}/>
              </div>
            )}

            {analyzing ? (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={s.loadingDot}/>
                <p style={{ fontSize:14, color:"#006B78", fontWeight:"600", margin:"12px 0 4px" }}>
                  AIが読み取り中...
                </p>
                <p style={{ fontSize:11, color:"#7aacb5", margin:0 }}>少々お待ちください</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize:13, color:"#4a7a80", textAlign:"center", margin:0 }}>
                  この画像からレシート情報を読み取ります
                </p>
                <button style={s.primaryBtn} onClick={analyzeReceipt}>
                  AIで読み取る
                </button>
                <button style={s.ghostBtn}
                  onClick={() => { setReceiptImg(null); goInput(); }}>
                  手動で入力する
                </button>
              </>
            )}
          </div>
        </>}

        {/* ═══ テキスト貼り付け画面 ═══ */}
        {screen === "paste" && <>
          <div style={s.header}>
            <button style={s.backBtn} onClick={() => setScreen("home")}>‹ 戻る</button>
            <span style={s.headerTitle}>テキスト取り込み</span>
            <div style={{ width:60 }}/>
          </div>
          <div style={s.scroll}>
            <div style={{ padding:"16px 0 8px" }}>
              <p style={{ fontSize:13, color:"#1a3a3f", fontWeight:"600", margin:"0 0 6px" }}>
                明細テキストを貼り付けてください
              </p>
              <p style={{ fontSize:11, color:"#7aacb5", margin:"0 0 14px", lineHeight:1.6 }}>
                銀行・カード明細、家計簿アプリのデータなど、1行1件の形式で貼り付けると自動で読み取ります
              </p>
              {/* サンプル */}
              <div style={{ background:"rgba(0,107,120,0.05)", borderRadius:12,
                padding:"10px 14px", marginBottom:16, border:"1px solid rgba(158,219,232,0.3)" }}>
                <p style={{ fontSize:10, color:"#4a7a80", fontWeight:"700", margin:"0 0 6px" }}>入力例</p>
                {["5/20 サミットストア 4,230円",
                  "5/19 電気料金 8,760円",
                  "5/18 カフェラテ 520円"].map((l,i) => (
                  <p key={i} style={{ fontSize:11, color:"#4a7a80", margin:"2px 0", fontFamily:"monospace" }}>{l}</p>
                ))}
              </div>
              <textarea
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder={"ここにテキストを貼り付け...\n\n例:\n5/20 サミットストア 4,230円\n5/19 電気料金 8,760円"}
                style={{ ...s.textInput, height:200, resize:"none",
                  fontFamily:"monospace", fontSize:13, lineHeight:1.6 }}
              />
            </div>
            <button style={s.primaryBtn}
              onClick={() => {
                if (!pasteText.trim()) {
                  alert("テキストを入力してください");
                  return;
                }
                parseText(pasteText);
              }}>
              読み取る →
            </button>
            <button style={s.ghostBtn} onClick={() => setScreen("home")}>キャンセル</button>
            <div style={{ height:48 }}/>
          </div>
        </>}

        {/* ═══ テキスト確認画面 ═══ */}
        {screen === "paste-confirm" && <>
          <div style={s.header}>
            <button style={s.backBtn} onClick={() => setScreen("paste")}>‹ 修正</button>
            <span style={s.headerTitle}>取り込み確認</span>
            <div style={{ width:60 }}/>
          </div>
          <div style={s.scroll}>
            <div style={{ padding:"12px 0 6px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <p style={{ fontSize:13, color:"#1a3a3f", fontWeight:"700", margin:0 }}>
                {parsedTxs.filter(t=>t.checked).length}件を登録します
              </p>
              <p style={{ fontSize:11, color:"#7aacb5", margin:0 }}>チェックを外すと除外</p>
            </div>

            {parsedTxs.map((tx, i) => (
              <div key={tx.tempId} style={{ ...s.card, padding:"12px 14px",
                marginBottom:8, opacity: tx.checked ? 1 : 0.4 }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  {/* チェックボックス */}
                  <button
                    style={{ width:22, height:22, borderRadius:6, flexShrink:0, marginTop:2,
                      background: tx.checked ? "#006B78" : "rgba(158,219,232,0.3)",
                      border: tx.checked ? "none" : "1.5px solid rgba(158,219,232,0.6)",
                      cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                    onClick={() => setParsedTxs(ps => ps.map((p,j) => j===i ? {...p, checked:!p.checked} : p))}>
                    {tx.checked && <span style={{ color:"#fff", fontSize:13, lineHeight:1 }}>✓</span>}
                  </button>

                  <div style={{ flex:1 }}>
                    {/* 収入/支出切り替え */}
                    <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                      {[["expense","支出"],["income","収入"]].map(([id, lbl]) => (
                        <button key={id}
                          style={{ flex:1, padding:"5px 0", borderRadius:8, border:"none",
                            fontSize:12, fontWeight:"700", cursor:"pointer", fontFamily:"inherit",
                            background: tx.type===id ? (id==="expense"?"#006B78":"#2a9d6e") : "rgba(158,219,232,0.3)",
                            color: tx.type===id ? "#fff" : "#4a7a80" }}
                          onClick={() => setParsedTxs(ps => ps.map((p,j) => j===i ? {
                            ...p, type:id,
                            category: id==="income" ? "その他" : p.category
                          } : p))}>
                          {lbl}
                        </button>
                      ))}
                    </div>
                    {/* 店名 */}
                    <input
                      value={tx.name}
                      onChange={e => setParsedTxs(ps => ps.map((p,j) => j===i ? {...p, name:e.target.value} : p))}
                      style={{ ...s.textInput, padding:"6px 10px", fontSize:13,
                        fontWeight:"600", marginBottom:6 }}
                    />
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {/* 金額 */}
                      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <span style={{ fontSize:11, color:"#4a7a80" }}>¥</span>
                        <input
                          value={tx.amount}
                          onChange={e => setParsedTxs(ps => ps.map((p,j) => j===i ? {...p, amount:e.target.value} : p))}
                          style={{ ...s.textInput, padding:"4px 8px", fontSize:13,
                            fontWeight:"700", color:"#e05555", width:90 }}
                        />
                      </div>
                      {/* 日付 */}
                      <input type="date" value={tx.date}
                        onChange={e => setParsedTxs(ps => ps.map((p,j) => j===i ? {...p, date:e.target.value} : p))}
                        style={{ ...s.textInput, padding:"4px 8px", fontSize:11, flex:1 }}
                      />
                    </div>
                    {/* カテゴリ */}
                    <select
                      value={tx.category}
                      onChange={e => setParsedTxs(ps => ps.map((p,j) => j===i ? {...p, category:e.target.value} : p))}
                      style={{ ...s.textInput, padding:"6px 10px", fontSize:12, marginTop:6, width:"100%" }}>
                      {(tx.type==="income" ? CATEGORIES_INCOME : CATEGORIES_EXPENSE).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {/* 支払い方法 */}
                    <select
                      value={tx.payment}
                      onChange={e => setParsedTxs(ps => ps.map((p,j) => j===i ? {...p, payment:e.target.value} : p))}
                      style={{ ...s.textInput, padding:"6px 10px", fontSize:12, marginTop:6, width:"100%",
                        color: tx.payment ? "#1a3a3f" : "#7aacb5" }}>
                      <option value="">支払い方法（任意）</option>
                      {payNames.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {/* 対象 */}
                    <div style={{ display:"flex", gap:6, marginTop:6 }}>
                      {PETS.map(p => (
                        <button key={p}
                          style={{ ...s.petBtn, padding:"5px 0", fontSize:11,
                            ...(tx.pet===p ? s.petBtnOn : {}) }}
                          onClick={() => setParsedTxs(ps => ps.map((q,j) => j===i ? {...q, pet:p} : q))}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button style={s.primaryBtn}
              disabled={parsedTxs.filter(t=>t.checked).length === 0}
              onClick={bulkSave}>
              ✓ {parsedTxs.filter(t=>t.checked).length}件をまとめて登録
            </button>
            <button style={s.ghostBtn} onClick={() => setScreen("paste")}>戻って修正</button>
            <div style={{ height:48 }}/>
          </div>
        </>}

        {/* ═══ 設定 ═══ */}
        {screen === "settings" && <>
          <div style={s.header}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <DropIcon size={22} color="#006B78"/>
              <span style={s.headerTitle}>設定</span>
            </div>
            <div/>
          </div>
          <div style={s.scroll}>

            {/* ペットの名前 */}
            <div style={{ ...s.card, marginTop:14 }}>
              <p style={s.cardTitle}>対象の名前</p>
              <p style={{ fontSize:11, color:"#7aacb5", margin:"0 0 12px" }}>
                ウリ・ルルの名前を変更できます
              </p>
              {(editPetNames || petNames).map((name, i) => (
                <div key={i} style={{ marginBottom:10 }}>
                  <p style={s.fieldLbl}>対象 {i+1}</p>
                  <input
                    value={name}
                    onChange={e => {
                      const n = [...(editPetNames || petNames)];
                      n[i] = e.target.value;
                      setEditPetNames(n);
                    }}
                    style={s.textInput}
                    placeholder={`名前 ${i+1}`}
                  />
                </div>
              ))}
              {editPetNames && (
                <button style={{ ...s.primaryBtn, marginTop:8 }}
                  onClick={() => {
                    savePetNames(editPetNames);
                    setEditPetNames(null);
                    showToast("対象の名前を保存しました");
                  }}>
                  保存する
                </button>
              )}
            </div>

            {/* 支払い方法 */}
            <div style={s.card}>
              <p style={s.cardTitle}>支払い方法</p>
              <p style={{ fontSize:11, color:"#7aacb5", margin:"0 0 12px" }}>
                名前を変更・追加できます
              </p>
              {(editPayNames || payNames).map((name, i) => (
                <div key={i} style={{ marginBottom:10, display:"flex", gap:8, alignItems:"center" }}>
                  <input
                    value={name}
                    onChange={e => {
                      const n = [...(editPayNames || payNames)];
                      n[i] = e.target.value;
                      setEditPayNames(n);
                    }}
                    style={{ ...s.textInput, margin:0 }}
                    placeholder={`支払い方法 ${i+1}`}
                  />
                  <button
                    style={{ flexShrink:0, background:"none", border:"none",
                      color:"#d9534f", fontSize:18, cursor:"pointer", padding:"0 4px" }}
                    onClick={() => {
                      const n = [...(editPayNames || payNames)];
                      n.splice(i, 1);
                      setEditPayNames(n);
                    }}>×</button>
                </div>
              ))}
              <button style={{ ...s.ghostBtn, marginTop:4 }}
                onClick={() => setEditPayNames([...(editPayNames || payNames), ""])}>
                ＋ 支払い方法を追加
              </button>
              {editPayNames && (
                <button style={{ ...s.primaryBtn, marginTop:8 }}
                  onClick={() => {
                    const cleaned = editPayNames.filter(p => p.trim());
                    savePayNames(cleaned);
                    setEditPayNames(null);
                    showToast("支払い方法を保存しました");
                  }}>
                  保存する
                </button>
              )}
            </div>

            {/* 固定費リスト */}
            <div style={s.card}>
              <p style={s.cardTitle}>固定費リスト</p>
              <p style={{ fontSize:11, color:"#7aacb5", margin:"0 0 12px" }}>
                毎月かかる費用を登録しておくと、未登録のときにお知らせします
              </p>
              {fixedList.map((f, i) => (
                <div key={i} style={{ background:"rgba(0,107,120,0.04)", borderRadius:12,
                  padding:"12px", marginBottom:10, border:"1px solid rgba(158,219,232,0.3)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <p style={{ fontSize:12, fontWeight:"700", color:"#4a7a80", margin:0 }}>固定費 {i+1}</p>
                    <button style={{ background:"none", border:"none", color:"#d9534f",
                      fontSize:13, cursor:"pointer", fontFamily:"inherit" }}
                      onClick={() => {
                        const n = [...fixedList];
                        n.splice(i, 1);
                        saveFixedList(n);
                        showToast("削除しました");
                      }}>削除</button>
                  </div>
                  <input placeholder="名前（例：通信費・家賃）" value={f.name}
                    onChange={e => {
                      const n = [...fixedList]; n[i] = {...n[i], name:e.target.value}; saveFixedList(n);
                    }}
                    style={{ ...s.textInput, marginBottom:6 }}/>
                  <div style={{ display:"flex", gap:6, marginBottom:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:4, flex:1 }}>
                      <span style={{ fontSize:12, color:"#4a7a80", flexShrink:0 }}>¥</span>
                      <input type="text" inputMode="numeric" placeholder="金額" value={f.amount}
                        onChange={e => {
                          const n = [...fixedList]; n[i] = {...n[i], amount:e.target.value.replace(/[^0-9]/g,"")}; saveFixedList(n);
                        }}
                        style={{ ...s.textInput, margin:0 }}/>
                    </div>
                  </div>
                  <select value={f.category||"固定費"}
                    onChange={e => {
                      const n = [...fixedList]; n[i] = {...n[i], category:e.target.value}; saveFixedList(n);
                    }}
                    style={{ ...s.textInput, marginBottom:6 }}>
                    {CATEGORIES_EXPENSE.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select value={f.payment||""}
                    onChange={e => {
                      const n = [...fixedList]; n[i] = {...n[i], payment:e.target.value}; saveFixedList(n);
                    }}
                    style={{ ...s.textInput, marginBottom:6 }}>
                    <option value="">支払い方法（任意）</option>
                    {payNames.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <div style={{ display:"flex", gap:6 }}>
                    {PETS.map(p => (
                      <button key={p}
                        style={{ ...s.petBtn, padding:"6px 0", fontSize:11,
                          ...(f.pet===p ? s.petBtnOn : {}) }}
                        onClick={() => {
                          const n = [...fixedList]; n[i] = {...n[i], pet:p}; saveFixedList(n);
                        }}>{p}</button>
                    ))}
                  </div>
                </div>
              ))}
              <button style={{ ...s.ghostBtn, marginTop:4 }}
                onClick={() => saveFixedList([...fixedList, { name:"", amount:"", category:"固定費", payment:"", pet:"共通" }])}>
                ＋ 固定費を追加
              </button>
            </div>

            {/* データ管理 */}
            <div style={s.card}>
              <p style={s.cardTitle}>データ管理</p>

              {/* 件数表示 */}
              <div style={{ display:"flex", justifyContent:"space-between",
                padding:"10px 0", borderBottom:"1px solid rgba(158,219,232,0.2)" }}>
                <span style={{ fontSize:13, color:"#1a3a3f", fontWeight:"600" }}>登録済み取引</span>
                <span style={{ fontSize:13, color:"#4a7a80", fontWeight:"700" }}>{txList.length}件</span>
              </div>

              {/* CSVエクスポート */}
              <button
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  width:"100%", padding:"12px 0", background:"none", border:"none",
                  cursor:"pointer", fontFamily:"inherit",
                  borderBottom:"1px solid rgba(158,219,232,0.2)" }}
                onClick={exportCSV}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10,
                    background:"rgba(42,157,110,0.1)", display:"flex",
                    alignItems:"center", justifyContent:"center" }}>
                    <DownloadIcon size={18} color="#2a9d6e"/>
                  </div>
                  <div style={{ textAlign:"left" }}>
                    <p style={{ fontSize:13, fontWeight:"600", color:"#1a3a3f", margin:"0 0 1px" }}>
                      CSVでエクスポート
                    </p>
                    <p style={{ fontSize:11, color:"#7aacb5", margin:0 }}>
                      Excelで開ける形式で保存
                    </p>
                  </div>
                </div>
                <span style={{ fontSize:16, color:"#9EDBE8" }}>›</span>
              </button>

              {/* CSVインポート */}
              <label
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  width:"100%", padding:"12px 0", cursor:"pointer",
                  borderBottom:"1px solid rgba(158,219,232,0.2)" }}>
                <input type="file" accept=".csv" style={{ display:"none" }} onChange={importCSV}/>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10,
                    background:"rgba(77,182,198,0.1)", display:"flex",
                    alignItems:"center", justifyContent:"center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4DB6C6"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <div style={{ textAlign:"left" }}>
                    <p style={{ fontSize:13, fontWeight:"600", color:"#1a3a3f", margin:"0 0 1px" }}>
                      CSVからインポート
                    </p>
                    <p style={{ fontSize:11, color:"#7aacb5", margin:0 }}>
                      バックアップから復元
                    </p>
                  </div>
                </div>
                <span style={{ fontSize:16, color:"#9EDBE8" }}>›</span>
              </label>

              {/* リセット */}
              <button
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  width:"100%", padding:"12px 0", background:"none", border:"none",
                  cursor:"pointer", fontFamily:"inherit" }}
                onClick={() => setShowResetConfirm(true)}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10,
                    background:"rgba(217,83,79,0.1)", display:"flex",
                    alignItems:"center", justifyContent:"center" }}>
                    <TrashIcon size={18} color="#d9534f"/>
                  </div>
                  <div style={{ textAlign:"left" }}>
                    <p style={{ fontSize:13, fontWeight:"600", color:"#d9534f", margin:"0 0 1px" }}>
                      全データを削除
                    </p>
                    <p style={{ fontSize:11, color:"#7aacb5", margin:0 }}>
                      取引データをすべて消去します
                    </p>
                  </div>
                </div>
                <span style={{ fontSize:16, color:"#9EDBE8" }}>›</span>
              </button>
            </div>

            {/* バージョン */}
            <p style={{ fontSize:11, color:"#9EDBE8", textAlign:"center",
              padding:"8px 0 32px" }}>MIZU 家計簿アプリ v1.0</p>

            <div style={{ height:100 }}/>
          </div>
        </>}

        {/* ═══ 固定費登録モーダル ═══ */}
        {showFixedAlert && (
          <div style={s.modalOverlay}>
            <div style={{ ...s.modalBox, maxHeight:"80vh", overflowY:"auto" }}>
              <p style={s.modalTitle}>今月の固定費を登録</p>
              <p style={s.modalSub}>内容を確認・修正してから登録してください</p>
              {getUnregisteredFixed().map((f, i) => (
                <div key={i} style={{ background:"rgba(0,107,120,0.04)", borderRadius:12,
                  padding:"12px", marginBottom:10, border:"1px solid rgba(158,219,232,0.3)" }}>
                  {/* 名前 */}
                  <input value={f.name}
                    onChange={e => {
                      const n = [...fixedList];
                      const idx = fixedList.indexOf(f);
                      n[idx] = {...n[idx], name: e.target.value};
                      saveFixedList(n);
                    }}
                    style={{ ...s.textInput, marginBottom:6, fontWeight:"600" }}/>
                  {/* 金額 */}
                  <div style={{ display:"flex", gap:6, marginBottom:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:4, flex:1 }}>
                      <span style={{ fontSize:12, color:"#4a7a80", flexShrink:0 }}>¥</span>
                      <input type="text" inputMode="numeric" value={f.amount}
                        onChange={e => {
                          const n = [...fixedList];
                          const idx = fixedList.indexOf(f);
                          n[idx] = {...n[idx], amount: e.target.value.replace(/[^0-9]/g,"")};
                          saveFixedList(n);
                        }}
                        style={{ ...s.textInput, margin:0, color:"#e05555", fontWeight:"700" }}/>
                    </div>
                  </div>
                  {/* メモ */}
                  <input placeholder="メモ（任意）" value={f.memo||""}
                    onChange={e => {
                      const n = [...fixedList];
                      const idx = fixedList.indexOf(f);
                      n[idx] = {...n[idx], memo: e.target.value};
                      saveFixedList(n);
                    }}
                    style={{ ...s.textInput, marginBottom:6, fontSize:12 }}/>
                  {/* 登録ボタン */}
                  <button style={{ ...s.primaryBtn, marginTop:4, padding:"10px 0", fontSize:13 }}
                    onClick={() => {
                      const today = todayStr();
                      const tx = {
                        id: Date.now() + Math.random(),
                        type: "expense",
                        amount: -Math.abs(Number(f.amount)),
                        category: f.category || "固定費",
                        name: f.name,
                        date: today,
                        payment: f.payment || "",
                        pet: f.pet || "共通",
                        memo: f.memo || "",
                      };
                      saveTx([tx, ...txList]);
                      showToast(`${f.name}を登録しました`);
                    }}>
                    この1件を登録
                  </button>
                </div>
              ))}
              <button style={s.ghostBtn} onClick={() => setShowFixedAlert(false)}>
                閉じる
              </button>
            </div>
          </div>
        )}

        {/* ═══ リセット確認モーダル ═══ */}
        {showResetConfirm && (
          <div style={s.modalOverlay}>
            <div style={s.modalBox}>
              <p style={s.modalTitle}>全データを削除しますか？</p>
              <p style={s.modalSub}>すべての取引データが消えます。この操作は元に戻せません。</p>
              <button style={{ ...s.primaryBtn, background:"#d9534f",
                boxShadow:"0 4px 12px rgba(217,83,79,0.3)" }}
                onClick={resetAll}>削除する</button>
              <button style={s.ghostBtn}
                onClick={() => setShowResetConfirm(false)}>キャンセル</button>
            </div>
          </div>
        )}

        {/* ═══ 削除確認モーダル ═══ */}
        {deleteId && (
          <div style={s.modalOverlay}>
            <div style={s.modalBox}>
              <p style={s.modalTitle}>この取引を削除しますか？</p>
              <p style={s.modalSub}>削除すると元に戻せません</p>
              <button style={{ ...s.primaryBtn, background:"#d9534f",
                boxShadow:"0 4px 12px rgba(217,83,79,0.3)" }}
                onClick={() => handleDelete(deleteId)}>削除する</button>
              <button style={s.ghostBtn} onClick={() => setDeleteId(null)}>キャンセル</button>
            </div>
          </div>
        )}

        {/* ═══ ボトムナビ ═══ */}
        <div style={s.bottomNav}>
          {TABS.map(({ id, label, Icon }) => {
            if (id === "add") return (
              <button key="add" style={s.addBtn} onClick={() => onTab("add")}>
                <PlusIcon size={24} color="#fff"/>
              </button>
            );
            const active = (id === "home"     && screen === "home")
              || (id === "tx"       && screen === "tx")
              || (id === "report"   && screen === "report")
              || (id === "settings" && screen === "settings");
            return (
              <button key={id} style={s.navItem} onClick={() => onTab(id)}>
                <Icon size={22} color={active ? "#006B78" : "#9EDBE8"}/>
                <span style={{ ...s.navLbl, color: active?"#006B78":"#9EDBE8", fontWeight: active?"700":"400" }}>
                  {label}
                </span>
                {active && <div style={s.navDot}/>}
              </button>
            );
          })}
        </div>

        {/* トースト通知 */}
        {toast && (
          <div style={{ position:"absolute", bottom:90, left:"50%",
            transform:"translateX(-50%)", background:"rgba(0,107,120,0.92)",
            color:"#fff", borderRadius:20, padding:"10px 20px",
            fontSize:13, fontWeight:"600", whiteSpace:"nowrap",
            zIndex:200, boxShadow:"0 4px 16px rgba(0,107,120,0.3)" }}>
            ✓ {toast}
          </div>
        )}

      </div>
      <div style={s.bg1}/><div style={s.bg2}/>
    </div>
  );
}

// ── スタイル ──────────────────────────────────
const s = {
  root:{ minHeight:"100vh",
    background:"linear-gradient(160deg,#d0f0f7 0%,#b8e8f3 30%,#9EDBE8 60%,#7cc8d8 100%)",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontFamily:"'M PLUS 1p','Hiragino Sans',sans-serif",
    position:"relative", padding:"24px 16px", overflow:"hidden" },
  bg1:{ position:"absolute", width:600, height:200,
    background:"rgba(255,255,255,0.18)",
    borderRadius:"50%", top:"60%", left:"-10%",
    animation:"wave1 8s ease-in-out infinite", pointerEvents:"none" },
  bg2:{ position:"absolute", width:500, height:160,
    background:"rgba(255,255,255,0.12)",
    borderRadius:"50%", top:"65%", left:"20%",
    animation:"wave2 10s ease-in-out infinite", pointerEvents:"none" },
  phone:{ width:375, maxWidth:"100%", height:780, maxHeight:"92vh",
    background:"rgba(235,249,252,0.92)",
    backdropFilter:"blur(20px)",
    borderRadius:40,
    boxShadow:"0 24px 64px rgba(0,107,120,0.25), 0 1px 0 rgba(255,255,255,0.9) inset",
    overflow:"hidden", display:"flex", flexDirection:"column", position:"relative",
    border:"1px solid rgba(255,255,255,0.6)" },
  header:{ display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"48px 16px 12px", background:"rgba(240,250,252,0.96)",
    borderBottom:"1px solid rgba(158,219,232,0.25)" },
  headerTitle:{ fontSize:17, fontWeight:"700", color:"#1a3a3f", letterSpacing:0.5 },
  backBtn:{ background:"none", border:"none", fontSize:14, color:"#006B78",
    cursor:"pointer", fontWeight:"600", padding:0, width:60, textAlign:"left" },
  scroll:{ flex:1, overflowY:"auto", padding:"0 16px", scrollbarWidth:"none" },
  monthNav:{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, padding:"14px 0 10px" },
  arrowBtn:{ background:"rgba(255,255,255,0.7)", border:"1px solid rgba(158,219,232,0.5)",
    borderRadius:"50%", width:32, height:32, fontSize:18, color:"#1a3a3f",
    cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" },
  monthLbl:{ fontSize:16, fontWeight:"600", color:"#1a3a3f" },
  summaryCard:{ background:"linear-gradient(135deg,#006B78,#4DB6C6)", borderRadius:24,
    padding:20, marginBottom:14, boxShadow:"0 8px 28px rgba(0,107,120,0.28)" },
  summaryLbl:{ fontSize:13, color:"rgba(255,255,255,0.7)", margin:"0 0 4px" },
  summaryAmt:{ fontSize:30, fontWeight:"700", color:"#fff", margin:"0 0 14px", letterSpacing:-1 },
  summaryRow:{ display:"flex", gap:8 },
  summaryCell:{ flex:1, background:"rgba(255,255,255,0.15)", borderRadius:12,
    padding:"10px 8px", textAlign:"center" },
  cellLbl:{ fontSize:12, color:"rgba(255,255,255,0.75)", margin:"0 0 2px" },
  cellVal:{ fontSize:13, fontWeight:"700", color:"#fff", margin:0 },
  card:{ background:"rgba(255,255,255,0.72)", borderRadius:20, padding:16,
    marginBottom:14, border:"1px solid rgba(158,219,232,0.3)",
    boxShadow:"0 4px 12px rgba(0,107,120,0.06)" },
  cardTitle:{ fontSize:15, fontWeight:"700", color:"#1a3a3f", margin:"0 0 12px" },
  emptyMsg:{ fontSize:14, color:"#7aacb5", textAlign:"center", padding:"14px 0" },
  legendRow:{ display:"flex", alignItems:"center", gap:6, marginBottom:5 },
  dot:{ width:8, height:8, borderRadius:"50%", flexShrink:0 },
  legendName:{ flex:1, fontSize:11, color:"#1a3a3f" },
  legendPct:{ fontSize:11, color:"#4a7a80", fontWeight:"600" },
  filterRow:{ display:"flex", gap:8, marginBottom:12, overflowX:"auto", scrollbarWidth:"none" },
  chip:{ background:"rgba(255,255,255,0.7)", border:"1px solid rgba(158,219,232,0.5)",
    borderRadius:20, padding:"5px 14px", fontSize:12, color:"#4a7a80",
    cursor:"pointer", whiteSpace:"nowrap", fontWeight:"500" },
  chipOn:{ background:"#006B78", color:"#fff", border:"1px solid #006B78", fontWeight:"700" },
  badge:{ fontSize:11, color:"#4a7a80", fontWeight:"600" },
  txRow:{ display:"flex", alignItems:"center", gap:10, padding:"10px 0" },
  txIconBox:{ width:38, height:38, borderRadius:12, display:"flex",
    alignItems:"center", justifyContent:"center", flexShrink:0 },
  txName:{ fontSize:14, fontWeight:"600", color:"#1a3a3f", margin:"0 0 3px" },
  catBadge:{ fontSize:11, background:"rgba(77,182,198,0.12)", color:"#006B78",
    borderRadius:6, padding:"1px 6px" },
  petBadge:{ fontSize:11, background:"rgba(126,224,193,0.18)", color:"#2a9d6e",
    borderRadius:6, padding:"1px 6px" },
  txAmt:{ fontSize:14, fontWeight:"700", margin:"0 0 2px" },
  txDate:{ fontSize:12, color:"#7aacb5", margin:0 },
  bottomNav:{ display:"flex", alignItems:"center", justifyContent:"space-around",
    padding:"10px 8px 20px", background:"rgba(255,255,255,0.9)",
    borderTop:"1px solid rgba(158,219,232,0.3)" },
  navItem:{ display:"flex", flexDirection:"column", alignItems:"center", gap:3,
    background:"none", border:"none", cursor:"pointer", padding:"4px 10px",
    position:"relative", minWidth:50 },
  navLbl:{ fontSize:11 },
  navDot:{ position:"absolute", bottom:-2, width:4, height:4,
    borderRadius:"50%", background:"#006B78" },
  addBtn:{ width:52, height:52, borderRadius:"50%",
    background:"linear-gradient(135deg,#006B78,#4DB6C6)", border:"none",
    cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
    boxShadow:"0 6px 20px rgba(0,107,120,0.38)", marginBottom:8 },
  typeTab:{ display:"flex", margin:"12px 16px 0", background:"rgba(255,255,255,0.6)",
    borderRadius:14, padding:4, gap:4, border:"1px solid rgba(158,219,232,0.3)" },
  typeBtn:{ flex:1, padding:"9px 0", border:"none", borderRadius:10, fontSize:14,
    fontWeight:"600", cursor:"pointer", background:"none", color:"#7aacb5", fontFamily:"inherit" },
  typeBtnExp:{ background:"#006B78", color:"#fff" },
  typeBtnInc:{ background:"#2a9d6e", color:"#fff" },
  amtRow:{ display:"flex", alignItems:"baseline", justifyContent:"center", gap:4, padding:"22px 0 10px" },
  amtSymbol:{ fontSize:22, fontWeight:"600", color:"#1a3a3f", flexShrink:0 },
  amtInput:{ border:"none", background:"none", fontWeight:"700",
    color:"#006B78", flex:1, minWidth:0, outline:"none", textAlign:"left",
    fontFamily:"inherit", letterSpacing:-1 },
  divider:{ height:1, background:"rgba(158,219,232,0.4)", margin:"0 0 12px" },
  fieldLbl:{ fontSize:13, fontWeight:"700", color:"#4a7a80", letterSpacing:0.8, margin:"0 0 8px" },
  textInput:{ width:"100%", maxWidth:"100%", padding:"11px 14px", borderRadius:12,
    border:"1.5px solid rgba(158,219,232,0.5)", background:"rgba(255,255,255,0.7)",
    fontSize:15, color:"#1a3a3f", outline:"none", fontFamily:"inherit",
    boxSizing:"border-box", display:"block" },
  errMsg:{ fontSize:11, color:"#d9534f", margin:"4px 0 0 2px" },
  chipGrid:{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7 },
  selChip:{ display:"flex", flexDirection:"column", alignItems:"center", gap:3,
    padding:"9px 4px 8px", borderRadius:12, border:"1.5px solid rgba(158,219,232,0.4)",
    background:"rgba(255,255,255,0.65)", fontSize:10, color:"#2a5a62",
    cursor:"pointer", fontFamily:"inherit", fontWeight:"500" },
  selChipOn:{ background:"#006B78", color:"#fff", border:"1.5px solid #006B78" },
  chipIconBox:{ display:"flex", alignItems:"center", justifyContent:"center", height:20 },
  clearBtn:{ marginTop:8, background:"none", border:"none", fontSize:12,
    color:"#d9534f", cursor:"pointer", fontFamily:"inherit", padding:"4px 0" },
  petBtn:{ flex:1, padding:"10px 0", borderRadius:12,
    border:"1.5px solid rgba(158,219,232,0.4)", background:"rgba(255,255,255,0.65)",
    fontSize:13, color:"#2a5a62", cursor:"pointer", fontWeight:"600", fontFamily:"inherit" },
  petBtnOn:{ background:"#7EE0C1", color:"#1a3a3f", border:"1.5px solid #7EE0C1" },
  primaryBtn:{ display:"block", width:"100%", padding:"18px 0", borderRadius:16,
    border:"none", background:"linear-gradient(135deg,#006B78,#4DB6C6)",
    color:"#fff", fontSize:17, fontWeight:"700", cursor:"pointer",
    fontFamily:"inherit", marginTop:12, boxShadow:"0 6px 20px rgba(0,107,120,0.3)", minHeight:56 },
  ghostBtn:{ display:"block", width:"100%", padding:"16px 0", borderRadius:16,
    border:"1.5px solid rgba(158,219,232,0.6)", background:"rgba(255,255,255,0.6)",
    color:"#4a7a80", fontSize:16, fontWeight:"600", cursor:"pointer",
    fontFamily:"inherit", marginTop:10, minHeight:52 },
  confirmAmtCard:{ margin:"16px 0 14px", padding:"22px 20px", borderRadius:24,
    background:"linear-gradient(135deg,#006B78,#4DB6C6)", textAlign:"center",
    boxShadow:"0 8px 24px rgba(0,107,120,0.26)" },
  confirmAmtLbl:{ fontSize:12, color:"rgba(255,255,255,0.72)", margin:"0 0 6px" },
  confirmAmt:{ fontSize:36, fontWeight:"700", color:"#fff", margin:"0 0 4px", letterSpacing:-1 },
  confirmDate:{ fontSize:12, color:"#7EE0C1", margin:0 },
  confirmCard:{ background:"rgba(255,255,255,0.72)", borderRadius:20, padding:"4px 16px",
    border:"1px solid rgba(158,219,232,0.3)", marginBottom:14 },
  confirmRow:{ display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"12px 0", borderBottom:"1px solid rgba(158,219,232,0.2)" },
  confirmLbl:{ fontSize:12, color:"#4a7a80", fontWeight:"600" },
  confirmVal:{ fontSize:14, color:"#1a3a3f", fontWeight:"600" },
  doneWrap:{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
    justifyContent:"center", padding:"24px 20px", gap:10, overflowY:"auto" },
  doneIcon:{ width:80, height:80, borderRadius:"50%",
    background:"rgba(126,224,193,0.15)", border:"2px solid rgba(126,224,193,0.4)",
    display:"flex", alignItems:"center", justifyContent:"center", marginBottom:4,
    boxShadow:"0 0 0 12px rgba(126,224,193,0.08)" },
  doneTitle:{ fontSize:20, fontWeight:"700", color:"#1a3a3f", margin:0 },
  doneCard:{ width:"100%", background:"rgba(255,255,255,0.75)", borderRadius:20,
    padding:"16px 20px", border:"1px solid rgba(158,219,232,0.3)", margin:"4px 0" },
  doneAmt:{ fontSize:32, fontWeight:"700", color:"#006B78", textAlign:"center",
    margin:"0 0 2px", letterSpacing:-1 },
  doneName:{ fontSize:13, color:"#4a7a80", textAlign:"center", margin:"0 0 10px" },
  doneRow:{ display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"8px 0", borderBottom:"1px solid rgba(158,219,232,0.2)" },
  doneLbl:{ fontSize:12, color:"#4a7a80", fontWeight:"600" },
  doneVal:{ fontSize:13, color:"#1a3a3f", fontWeight:"600" },

  // 取引一覧
  txSummaryBar:{ display:"flex", alignItems:"center", background:"rgba(255,255,255,0.72)",
    borderRadius:16, padding:"12px 16px", marginBottom:14,
    border:"1px solid rgba(158,219,232,0.3)" },
  txSummaryItem:{ flex:1, textAlign:"center" },
  txSummaryLbl:{ fontSize:10, color:"#4a7a80", display:"block", marginBottom:2 },
  txSummaryVal:{ fontSize:14, fontWeight:"700", color:"#1a3a3f" },
  txSummaryDivider:{ width:1, height:28, background:"rgba(158,219,232,0.4)" },
  dateLabel:{ fontSize:11, fontWeight:"700", color:"#4a7a80", margin:"0 0 6px 4px", letterSpacing:0.5 },
  txRowBtn:{ display:"flex", alignItems:"center", gap:10, padding:"10px 0",
    width:"100%", background:"none", border:"none", cursor:"pointer",
    fontFamily:"inherit", textDecoration:"none" },
  payBadge:{ fontSize:11, background:"rgba(0,107,120,0.08)", color:"#4a7a80",
    borderRadius:6, padding:"1px 6px" },
  deleteTextBtn:{ background:"none", border:"none", fontSize:13, color:"#d9534f",
    cursor:"pointer", fontWeight:"600", fontFamily:"inherit", width:60, textAlign:"right" },

  // 削除モーダル
  modalOverlay:{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)",
    display:"flex", alignItems:"center", justifyContent:"center", zIndex:100,
    borderRadius:40 },
  modalBox:{ background:"#f0fafc", borderRadius:24, padding:"28px 24px",
    width:"80%", boxShadow:"0 12px 40px rgba(0,107,120,0.2)" },
  modalTitle:{ fontSize:16, fontWeight:"700", color:"#1a3a3f", textAlign:"center", margin:"0 0 6px" },
  modalSub:{ fontSize:12, color:"#7aacb5", textAlign:"center", margin:"0 0 20px" },

  // ＋メニュー
  menuBtn:{ display:"flex", alignItems:"center", gap:14, width:"100%",
    padding:"14px 12px", borderRadius:16, border:"1.5px solid rgba(158,219,232,0.35)",
    background:"rgba(255,255,255,0.7)", cursor:"pointer", fontFamily:"inherit",
    marginBottom:10, textAlign:"left" },
  menuBtnIcon:{ width:44, height:44, borderRadius:12, flexShrink:0,
    background:"rgba(0,107,120,0.08)", display:"flex",
    alignItems:"center", justifyContent:"center" },
  menuBtnTitle:{ fontSize:14, fontWeight:"700", color:"#006B78", margin:"0 0 2px" },
  menuBtnSub:{ fontSize:11, color:"#7aacb5", margin:0 },

  // ローディング
  loadingDot:{ width:40, height:40, borderRadius:"50%",
    border:"3px solid rgba(0,107,120,0.15)",
    borderTop:"3px solid #006B78",
    animation:"spin 1s linear infinite",
    margin:"0 auto" },

  // アコーディオン
  accordionBtn:{ display:"flex", justifyContent:"space-between", alignItems:"center",
    width:"100%", padding:"14px 0", background:"none", border:"none",
    cursor:"pointer", fontFamily:"inherit" },
  accordionBody:{ background:"rgba(0,107,120,0.04)", borderRadius:14,
    padding:"6px 12px", margin:"0 0 10px",
    border:"1px solid rgba(158,219,232,0.35)" },
  accordionRow:{ display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"10px 0" },
};
