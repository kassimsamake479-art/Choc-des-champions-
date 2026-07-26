import { db } from "./firebase-config.js";
import {
  doc, getDoc, collection, runTransaction, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const MAX_PLAYERS = 32;
const countRef = doc(db, "public", "count");

// ---------- Navigation ----------
const buttons = document.querySelectorAll("nav button");
const sections = document.querySelectorAll("main section");
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
    if (btn.dataset.tab === "inscription") loadCounter();
  });
});

// ---------- Compteur ----------
async function loadCounter() {
  const el = document.getElementById("reg-counter");
  const submitBtn = document.getElementById("submit-btn");
  try {
    const snap = await getDoc(countRef);
    const count = snap.exists() ? snap.data().count : 0;
    const remaining = MAX_PLAYERS - count;
    if (remaining <= 0) {
      el.innerHTML = "<b>0</b> place restante — inscriptions complètes";
      submitBtn.disabled = true;
    } else {
      el.innerHTML = "<b>" + remaining + "</b> place(s) restante(s) sur " + MAX_PLAYERS;
      submitBtn.disabled = false;
    }
  } catch (e) {
    el.textContent = "Impossible de charger le nombre de places.";
  }
}
loadCounter();

// ---------- Inscription ----------
document.getElementById("reg-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("reg-msg");
  const submitBtn = document.getElementById("submit-btn");
  msg.className = "msg";
  submitBtn.disabled = true;

  const pseudo = document.getElementById("pseudo").value.trim();
  const nom = document.getElementById("nom").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const plateforme = document.getElementById("plateforme").value;

  try {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(countRef);
      const current = snap.exists() ? snap.data().count : 0;
      if (current >= MAX_PLAYERS) {
        throw new Error("Les inscriptions sont complètes.");
      }
      const newRegRef = doc(collection(db, "registrations"));
      transaction.set(newRegRef, {
        pseudo, nom, whatsapp, plateforme,
        date: serverTimestamp()
      });
      transaction.set(countRef, { count: current + 1, max: MAX_PLAYERS }, { merge: true });
    });

    msg.textContent = "Inscription réussie ! Ta place est réservée.";
    msg.className = "msg ok";
    document.getElementById("reg-form").reset();
    loadCounter();
  } catch (err) {
    msg.textContent = err.message || "Une erreur est survenue, réessaie.";
    msg.className = "msg err";
    submitBtn.disabled = false;
  }
});
