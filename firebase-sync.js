import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDskeGyZ01sJ3xXTtRRWz2C7BIB0SPIPsY",
  authDomain: "balance-46f7d.firebaseapp.com",
  projectId: "balance-46f7d",
  storageBucket: "balance-46f7d.firebasestorage.app",
  messagingSenderId: "998176549248",
  appId: "1:998176549248:web:872837e03733fbe2d7f965"
};

const FAMILY_CODE_KEY = "balance_family_code_v2";
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const openSyncModalButton = document.getElementById("openSyncModal");
const closeSyncModalButton = document.getElementById("closeSyncModal");
const syncModal = document.getElementById("syncModal");
const syncDot = document.getElementById("syncDot");
const syncStatusText = document.getElementById("syncStatusText");
const syncDisconnected = document.getElementById("syncDisconnected");
const syncConnected = document.getElementById("syncConnected");
const createFamilyButton = document.getElementById("createFamilyButton");
const showJoinFamilyButton = document.getElementById("showJoinFamilyButton");
const joinFamilyForm = document.getElementById("joinFamilyForm");
const familyCodeInput = document.getElementById("familyCodeInput");
const familyCodeDisplay = document.getElementById("familyCodeDisplay");
const copyFamilyCodeButton = document.getElementById("copyFamilyCode");
const disconnectFamilyButton = document.getElementById("disconnectFamilyButton");
const syncFeedback = document.getElementById("syncFeedback");

let currentUser = null;
let currentFamilyCode = normalizeCode(localStorage.getItem(FAMILY_CODE_KEY) || "");
let unsubscribeFamily = null;
let applyingRemoteChange = false;
let cloudReady = false;
let saveTimer = null;

function normalizeCode(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z2-9]/g, "")
    .replace(/[01IO]/g, "");
}

function formatCode(value) {
  const clean = normalizeCode(value);
  return clean.match(/.{1,4}/g)?.join("-") || "";
}

function generateFamilyCode() {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  let code = "";
  for (let i = 0; i < bytes.length; i++) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return code;
}

function familyRef(code = currentFamilyCode) {
  return doc(db, "families", normalizeCode(code));
}

function setFeedback(message, type = "") {
  syncFeedback.textContent = message || "";
  syncFeedback.dataset.type = type;
}

function setStatus(mode) {
  const connected = mode === "connected";
  const connecting = mode === "connecting";

  syncDot.classList.toggle("connected", connected);
  syncDot.classList.toggle("connecting", connecting);

  syncStatusText.textContent = connected
    ? "Sincronizado"
    : connecting
      ? "Conectando…"
      : "Sin vincular";

  syncDisconnected.hidden = connected;
  syncConnected.hidden = !connected;

  if (connected) {
    familyCodeDisplay.textContent = formatCode(currentFamilyCode);
  }
}

function openModal() {
  syncModal.hidden = false;
  document.body.classList.add("modal-open");
  setFeedback("");
}

function closeModal() {
  syncModal.hidden = true;
  document.body.classList.remove("modal-open");
  joinFamilyForm.hidden = true;
  setFeedback("");
}

async function ensureAnonymousUser() {
  if (auth.currentUser) return auth.currentUser;
  const result = await signInAnonymously(auth);
  return result.user;
}

function startFamilyListener() {
  if (unsubscribeFamily) unsubscribeFamily();
  if (!currentFamilyCode) return;

  setStatus("connecting");

  unsubscribeFamily = onSnapshot(
    familyRef(),
    (snapshot) => {
      if (!snapshot.exists()) {
        setStatus("disconnected");
        setFeedback("Ese presupuesto familiar ya no existe.", "error");
        return;
      }

      const payload = snapshot.data();
      cloudReady = true;
      setStatus("connected");

      if (payload.data && window.BalanceCloudBridge) {
        applyingRemoteChange = true;
        window.BalanceCloudBridge.replaceDatabase(payload.data);
        queueMicrotask(() => {
          applyingRemoteChange = false;
        });
      }
    },
    (error) => {
      console.error("Balance Firebase:", error);
      setStatus("disconnected");
      setFeedback("No fue posible sincronizar. Revisa las reglas de Firestore.", "error");
    }
  );
}

async function createFamily() {
  try {
    setFeedback("Creando familia…");
    setStatus("connecting");
    await ensureAnonymousUser();

    let code;
    let reference;
    for (let attempt = 0; attempt < 5; attempt++) {
      code = generateFamilyCode();
      reference = familyRef(code);
      const existing = await getDoc(reference);
      if (!existing.exists()) break;
      code = null;
    }

    if (!code) throw new Error("No fue posible generar un código único.");

    const localData = window.BalanceCloudBridge?.getDatabase?.();
    await setDoc(reference, {
      data: localData || { months: {}, debts: [], goals: [], recurringExpenses: [] },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      version: 2
    });

    currentFamilyCode = code;
    localStorage.setItem(FAMILY_CODE_KEY, currentFamilyCode);
    startFamilyListener();
    setFeedback("Familia creada. Guarda este código para vincular otros dispositivos.", "success");
  } catch (error) {
    console.error(error);
    setStatus("disconnected");
    setFeedback("No se pudo crear la familia. Revisa la configuración de Firebase.", "error");
  }
}

async function joinFamily(codeValue) {
  try {
    const code = normalizeCode(codeValue);
    if (code.length !== 20) {
      setFeedback("El código debe tener 20 caracteres.", "error");
      return;
    }

    setFeedback("Buscando familia…");
    setStatus("connecting");
    await ensureAnonymousUser();

    const reference = familyRef(code);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      setStatus("disconnected");
      setFeedback("No encontramos una familia con ese código.", "error");
      return;
    }

    currentFamilyCode = code;
    localStorage.setItem(FAMILY_CODE_KEY, currentFamilyCode);

    const payload = snapshot.data();
    if (payload.data && window.BalanceCloudBridge) {
      applyingRemoteChange = true;
      window.BalanceCloudBridge.replaceDatabase(payload.data);
      applyingRemoteChange = false;
    }

    startFamilyListener();
    setFeedback("Dispositivo vinculado correctamente.", "success");
  } catch (error) {
    console.error(error);
    setStatus("disconnected");
    setFeedback("No fue posible vincular este dispositivo.", "error");
  }
}

async function pushLocalDatabase(database) {
  if (!currentFamilyCode || !currentUser || !cloudReady || applyingRemoteChange) return;

  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await setDoc(
        familyRef(),
        {
          data: database,
          updatedAt: serverTimestamp(),
          version: 2
        },
        { merge: true }
      );
    } catch (error) {
      console.error("No se pudo guardar en Firebase:", error);
      setFeedback("Hay cambios pendientes de sincronizar.", "error");
    }
  }, 350);
}

function disconnectFamily() {
  if (unsubscribeFamily) unsubscribeFamily();
  unsubscribeFamily = null;
  currentFamilyCode = "";
  cloudReady = false;
  localStorage.removeItem(FAMILY_CODE_KEY);
  setStatus("disconnected");
  setFeedback("Este dispositivo quedó desvinculado. Los datos locales se conservaron.", "success");
}

function bindSyncModalEvents() {
  const openButton = document.getElementById("openSyncModal");
  const closeButton = document.getElementById("closeSyncModal");
  const modalElement = document.getElementById("syncModal");

  openButton?.addEventListener("click", openModal);
  closeButton?.addEventListener("click", closeModal);

  modalElement?.addEventListener("click", (event) => {
    if (event.target === modalElement) closeModal();
  });
}

bindSyncModalEvents();

createFamilyButton?.addEventListener("click", createFamily);

showJoinFamilyButton?.addEventListener("click", () => {
  joinFamilyForm.hidden = false;
  familyCodeInput.focus();
});

joinFamilyForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  joinFamily(familyCodeInput.value);
});

familyCodeInput?.addEventListener("input", () => {
  familyCodeInput.value = formatCode(familyCodeInput.value);
});

copyFamilyCodeButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(formatCode(currentFamilyCode));
    setFeedback("Código copiado.", "success");
  } catch {
    setFeedback("No se pudo copiar automáticamente. Selecciona el código y cópialo.", "error");
  }
});

disconnectFamilyButton?.addEventListener("click", () => {
  if (window.confirm("¿Desvincular este dispositivo? Los datos guardados aquí no se borrarán.")) {
    disconnectFamily();
  }
});

window.addEventListener("balance:local-save", (event) => {
  pushLocalDatabase(event.detail?.database);
});

onAuthStateChanged(auth, async (user) => {
  currentUser = user;

  if (!user) {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("No fue posible iniciar sesión anónima:", error);
      setStatus("disconnected");
      return;
    }
  }

  if (currentFamilyCode) {
    startFamilyListener();
  } else {
    setStatus("disconnected");
  }
});
