"use strict";

/* =========================================================
   BALANCE
   Presupuesto familiar
========================================================= */

const STORAGE_KEY = "balance_budget_v1";

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const categoryIcons = {
  Depto: "🏢",
  Casa: "🏠",
  Parcela: "🌿",
  Otros: "🧾"
};


/* =========================================================
   ESTADO
========================================================= */

const today = new Date();

let selectedYear = today.getFullYear();
let selectedMonth = today.getMonth();
let selectedExpenseCategory = "Todos";

let database = loadDatabase();

let toastTimer;


/* =========================================================
   DOM
========================================================= */

const currentMonthElement =
  document.getElementById("currentMonth");

const currentMonthButton =
  document.getElementById("currentMonthButton");

const previousMonthButton =
  document.getElementById("previousMonth");

const nextMonthButton =
  document.getElementById("nextMonth");


const emptyMonthSection =
  document.getElementById("emptyMonthSection");

const emptyMonthTitle =
  document.getElementById("emptyMonthTitle");

const copyPreviousMonthButton =
  document.getElementById("copyPreviousMonth");

const startEmptyMonthButton =
  document.getElementById("startEmptyMonth");

const copyMonthButton =
  document.getElementById("copyMonthButton");


const totalIncomeElement =
  document.getElementById("totalIncome");

const totalExpensesElement =
  document.getElementById("totalExpenses");

const availableBalanceElement =
  document.getElementById("availableBalance");


const incomePanelTotalElement =
  document.getElementById("incomePanelTotal");

const expensePanelTotalElement =
  document.getElementById("expensePanelTotal");


const incomeListElement =
  document.getElementById("incomeList");

const expenseListElement =
  document.getElementById("expenseList");


const budgetMessageElement =
  document.getElementById("budgetMessage");

const budgetPercentageElement =
  document.getElementById("budgetPercentage");

const budgetProgressElement =
  document.getElementById("budgetProgress");

const spentAmountElement =
  document.getElementById("spentAmount");

const remainingAmountElement =
  document.getElementById("remainingAmount");


const totalDeptoElement =
  document.getElementById("totalDepto");

const totalCasaElement =
  document.getElementById("totalCasa");

const totalParcelaElement =
  document.getElementById("totalParcela");

const totalOtrosElement =
  document.getElementById("totalOtros");


/* =========================================================
   MODAL INGRESOS
========================================================= */

const incomeModal =
  document.getElementById("incomeModal");

const openIncomeModalButton =
  document.getElementById("openIncomeModal");

const incomeForm =
  document.getElementById("incomeForm");

const incomeEditId =
  document.getElementById("incomeEditId");

const incomeNameInput =
  document.getElementById("incomeName");

const incomeAmountInput =
  document.getElementById("incomeAmount");

const incomeModalTitle =
  document.getElementById("incomeModalTitle");

const incomeModalEyebrow =
  document.getElementById("incomeModalEyebrow");

const saveIncomeButton =
  document.getElementById("saveIncomeButton");


/* =========================================================
   MODAL GASTOS
========================================================= */

const expenseModal =
  document.getElementById("expenseModal");

const openExpenseModalButton =
  document.getElementById("openExpenseModal");

const expenseForm =
  document.getElementById("expenseForm");

const expenseEditId =
  document.getElementById("expenseEditId");

const expenseNameInput =
  document.getElementById("expenseName");

const expenseAmountInput =
  document.getElementById("expenseAmount");

const expenseCategoryInput =
  document.getElementById("expenseCategory");

const usualExpenseInput =
  document.getElementById("usualExpense");

const expenseModalTitle =
  document.getElementById("expenseModalTitle");

const expenseModalEyebrow =
  document.getElementById("expenseModalEyebrow");

const saveExpenseButton =
  document.getElementById("saveExpenseButton");


/* =========================================================
   MODAL COPIAR MES
========================================================= */

const copyMonthModal =
  document.getElementById("copyMonthModal");

const copyMonthMessage =
  document.getElementById("copyMonthMessage");

const copyIncomesCheckbox =
  document.getElementById("copyIncomes");

const copyExpensesCheckbox =
  document.getElementById("copyExpenses");

const confirmCopyMonthButton =
  document.getElementById("confirmCopyMonth");


/* =========================================================
   TOAST
========================================================= */

const toastElement =
  document.getElementById("toast");


/* =========================================================
   BASE DE DATOS
========================================================= */

function createEmptyDatabase() {
  return {
    months: {}
  };
}


function loadDatabase() {
  try {
    const storedData =
      localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return createEmptyDatabase();
    }

    const parsedData =
      JSON.parse(storedData);

    if (
      !parsedData ||
      typeof parsedData !== "object"
    ) {
      return createEmptyDatabase();
    }

    if (!parsedData.months) {
      parsedData.months = {};
    }

    return parsedData;

  } catch (error) {
    console.error(
      "No fue posible cargar Balance:",
      error
    );

    return createEmptyDatabase();
  }
}


function saveDatabase() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(database)
  );
}


/* =========================================================
   MESES
========================================================= */

function getMonthKey(
  year = selectedYear,
  month = selectedMonth
) {
  return (
    `${year}-${String(month + 1).padStart(2, "0")}`
  );
}


function createMonthData() {
  return {
    incomes: [],
    expenses: [],
    initialized: false
  };
}


function normalizeMonthData(monthData) {
  if (!monthData) {
    return createMonthData();
  }

  if (!Array.isArray(monthData.incomes)) {
    monthData.incomes = [];
  }

  if (!Array.isArray(monthData.expenses)) {
    monthData.expenses = [];
  }

  /*
    Compatibilidad con los datos de la
    versión anterior de Balance.
  */

  if (typeof monthData.initialized !== "boolean") {
    monthData.initialized =
      monthData.incomes.length > 0 ||
      monthData.expenses.length > 0;
  }

  return monthData;
}


function getCurrentMonthData(create = true) {
  const key = getMonthKey();

  if (!database.months[key]) {

    if (!create) {
      return null;
    }

    database.months[key] =
      createMonthData();
  }

  return normalizeMonthData(
    database.months[key]
  );
}


function getPreviousMonthInfo() {
  let year = selectedYear;
  let month = selectedMonth - 1;

  if (month < 0) {
    month = 11;
    year--;
  }

  const key =
    getMonthKey(year, month);

  const data =
    database.months[key]
      ? normalizeMonthData(database.months[key])
      : null;

  return {
    year,
    month,
    key,
    data
  };
}


function isMonthEmpty(monthData) {
  if (!monthData) {
    return true;
  }

  return (
    monthData.incomes.length === 0 &&
    monthData.expenses.length === 0
  );
}


function monthHasPreviousData() {
  const previous =
    getPreviousMonthInfo();

  return (
    previous.data &&
    (
      previous.data.incomes.length > 0 ||
      previous.data.expenses.length > 0
    )
  );
}


/* =========================================================
   FORMATO
========================================================= */

function formatCurrency(value) {
  const amount =
    Number(value) || 0;

  return new Intl.NumberFormat(
    "es-CL",
    {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0
    }
  ).format(amount);
}


function generateId() {
  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 9)
  );
}


function escapeHTML(value) {
  const element =
    document.createElement("div");

  element.textContent =
    String(value ?? "");

  return element.innerHTML;
}


/* =========================================================
   CÁLCULOS
========================================================= */

function calculateTotals() {
  const monthData =
    getCurrentMonthData();

  const totalIncome =
    monthData.incomes.reduce(
      (total, income) =>
        total + Number(income.amount || 0),
      0
    );

  const totalExpenses =
    monthData.expenses.reduce(
      (total, expense) =>
        total + Number(expense.amount || 0),
      0
    );

  const categoryTotals = {
    Depto: 0,
    Casa: 0,
    Parcela: 0,
    Otros: 0
  };

  monthData.expenses.forEach(
    (expense) => {

      if (
        Object.prototype.hasOwnProperty.call(
          categoryTotals,
          expense.category
        )
      ) {
        categoryTotals[expense.category] +=
          Number(expense.amount || 0);
      }

    }
  );

  return {
    totalIncome,
    totalExpenses,
    available:
      totalIncome - totalExpenses,
    categoryTotals
  };
}


/* =========================================================
   RESUMEN
========================================================= */

function updateSummary() {
  const totals =
    calculateTotals();

  totalIncomeElement.textContent =
    formatCurrency(totals.totalIncome);

  totalExpensesElement.textContent =
    formatCurrency(totals.totalExpenses);

  availableBalanceElement.textContent =
    formatCurrency(totals.available);

  incomePanelTotalElement.textContent =
    formatCurrency(totals.totalIncome);

  expensePanelTotalElement.textContent =
    formatCurrency(totals.totalExpenses);

  spentAmountElement.textContent =
    formatCurrency(totals.totalExpenses);

  remainingAmountElement.textContent =
    formatCurrency(totals.available);

  totalDeptoElement.textContent =
    formatCurrency(
      totals.categoryTotals.Depto
    );

  totalCasaElement.textContent =
    formatCurrency(
      totals.categoryTotals.Casa
    );

  totalParcelaElement.textContent =
    formatCurrency(
      totals.categoryTotals.Parcela
    );

  totalOtrosElement.textContent =
    formatCurrency(
      totals.categoryTotals.Otros
    );

  updateBudgetStatus(
    totals.totalIncome,
    totals.totalExpenses,
    totals.available
  );
}


/* =========================================================
   ESTADO DEL PRESUPUESTO
========================================================= */

function updateBudgetStatus(
  totalIncome,
  totalExpenses,
  available
) {

  let percentage = 0;

  if (totalIncome > 0) {
    percentage =
      (totalExpenses / totalIncome) * 100;
  }

  const rounded =
    Math.round(percentage);

  budgetPercentageElement.textContent =
    `${rounded}%`;

  budgetProgressElement.style.width =
    `${Math.min(
      Math.max(percentage, 0),
      100
    )}%`;

  budgetPercentageElement.style.color =
    "var(--primary)";

  if (totalIncome === 0) {

    budgetMessageElement.textContent =
      totalExpenses > 0
        ? "Agrega los ingresos para calcular el presupuesto"
        : "Comienza agregando tus ingresos";

    budgetProgressElement.style.background =
      "var(--primary)";

    return;
  }

  if (available < 0) {

    budgetMessageElement.textContent =
      "Los gastos superan los ingresos";

    budgetProgressElement.style.background =
      "var(--expense)";

    budgetPercentageElement.style.color =
      "var(--expense)";

    return;
  }

  if (percentage >= 90) {

    budgetMessageElement.textContent =
      "Queda muy poco margen este mes";

    budgetProgressElement.style.background =
      "var(--expense)";

    budgetPercentageElement.style.color =
      "var(--expense)";

    return;
  }

  if (percentage >= 70) {

    budgetMessageElement.textContent =
      "El presupuesto está bastante utilizado";

    budgetProgressElement.style.background =
      "var(--warning)";

    budgetPercentageElement.style.color =
      "var(--warning)";

    return;
  }

  if (percentage >= 40) {

    budgetMessageElement.textContent =
      "El presupuesto avanza dentro de lo esperado";

    budgetProgressElement.style.background =
      "var(--primary)";

    return;
  }

  budgetMessageElement.textContent =
    "Tienen buen margen disponible este mes";

  budgetProgressElement.style.background =
    "var(--income)";
}


/* =========================================================
   MES ACTUAL
========================================================= */

function updateMonthDisplay() {
  currentMonthElement.textContent =
    `${monthNames[selectedMonth]} ${selectedYear}`;
}


function changeMonth(direction) {
  selectedMonth += direction;

  if (selectedMonth < 0) {
    selectedMonth = 11;
    selectedYear--;
  }

  if (selectedMonth > 11) {
    selectedMonth = 0;
    selectedYear++;
  }

  selectedExpenseCategory = "Todos";

  updateFilterButtons();

  renderApp();
}


function goToCurrentMonth() {
  const now = new Date();

  selectedYear =
    now.getFullYear();

  selectedMonth =
    now.getMonth();

  selectedExpenseCategory =
    "Todos";

  updateFilterButtons();

  renderApp();
}


/* =========================================================
   MES VACÍO
========================================================= */

function updateEmptyMonthSection() {
  const monthData =
    getCurrentMonthData();

  const empty =
    isMonthEmpty(monthData);

  /*
    Si el usuario ya eligió comenzar
    desde cero, no mostramos el aviso.
  */

  const shouldShow =
    empty &&
    monthData.initialized !== true;

  emptyMonthSection.hidden =
    !shouldShow;

  if (!shouldShow) {
    return;
  }

  emptyMonthTitle.textContent =
    `${monthNames[selectedMonth]} todavía está vacío`;

  const previous =
    getPreviousMonthInfo();

  if (monthHasPreviousData()) {

    copyPreviousMonthButton.disabled =
      false;

    copyPreviousMonthButton.textContent =
      `Copiar ${monthNames[previous.month]}`;

  } else {

    copyPreviousMonthButton.disabled =
      true;

    copyPreviousMonthButton.textContent =
      "No hay mes anterior para copiar";
  }
}


/* =========================================================
   INGRESOS
========================================================= */

function renderIncomes() {
  const monthData =
    getCurrentMonthData();

  incomeListElement.innerHTML = "";

  if (monthData.incomes.length === 0) {

    incomeListElement.innerHTML = `
      <div class="empty-state">

        <div class="empty-icon">
          ＋
        </div>

        <h3>
          Aún no hay ingresos
        </h3>

        <p>
          Agrega sueldos, bonos, arriendos
          u otros ingresos del mes.
        </p>

      </div>
    `;

    return;
  }

  monthData.incomes.forEach(
    (income) => {

      const item =
        document.createElement("div");

      item.className =
        "transaction-item";

      item.innerHTML = `
        <div class="transaction-icon">
          💵
        </div>

        <div class="transaction-content">

          <strong>
            ${escapeHTML(income.name)}
          </strong>

          <span>
            Ingreso
          </span>

        </div>

        <div class="transaction-amount income">
          ${formatCurrency(income.amount)}
        </div>

        <div class="transaction-actions">

          <button
            class="edit-button"
            type="button"
            data-edit-income="${income.id}"
            aria-label="Editar ingreso"
            title="Editar"
          >
            ✎
          </button>

          <button
            class="delete-button"
            type="button"
            data-delete-income="${income.id}"
            aria-label="Eliminar ingreso"
            title="Eliminar"
          >
            ×
          </button>

        </div>
      `;

      incomeListElement.appendChild(item);
    }
  );
}


/* =========================================================
   GASTOS
========================================================= */

function renderExpenses() {
  const monthData =
    getCurrentMonthData();

  expenseListElement.innerHTML = "";

  let expenses =
    monthData.expenses;

  if (
    selectedExpenseCategory !== "Todos"
  ) {
    expenses =
      expenses.filter(
        (expense) =>
          expense.category ===
          selectedExpenseCategory
      );
  }

  if (expenses.length === 0) {

    const title =
      selectedExpenseCategory === "Todos"
        ? "Aún no hay gastos"
        : `No hay gastos en ${selectedExpenseCategory}`;

    expenseListElement.innerHTML = `
      <div class="empty-state">

        <div class="empty-icon">
          ＋
        </div>

        <h3>
          ${title}
        </h3>

        <p>
          Registra los gastos del mes
          para saber cuánto dinero queda disponible.
        </p>

      </div>
    `;

    return;
  }

  expenses.forEach(
    (expense) => {

      const item =
        document.createElement("div");

      item.className =
        "transaction-item";

      const icon =
        categoryIcons[expense.category] ||
        "🧾";

      item.innerHTML = `
        <div class="transaction-icon">
          ${icon}
        </div>

        <div class="transaction-content">

          <strong>
            ${escapeHTML(expense.name)}
          </strong>

          <span>
            ${escapeHTML(expense.category)}
          </span>

        </div>

        <div class="transaction-amount expense">
          ${formatCurrency(expense.amount)}
        </div>

        <div class="transaction-actions">

          <button
            class="edit-button"
            type="button"
            data-edit-expense="${expense.id}"
            aria-label="Editar gasto"
            title="Editar"
          >
            ✎
          </button>

          <button
            class="delete-button"
            type="button"
            data-delete-expense="${expense.id}"
            aria-label="Eliminar gasto"
            title="Eliminar"
          >
            ×
          </button>

        </div>
      `;

      expenseListElement.appendChild(item);
    }
  );
}


/* =========================================================
   MODALES
========================================================= */

function openModal(modal) {
  modal.classList.add("open");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );
}


function closeModal(modal) {
  modal.classList.remove("open");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  if (
    document.querySelectorAll(
      ".modal.open"
    ).length === 0
  ) {
    document.body.classList.remove(
      "modal-open"
    );
  }
}


function closeAllModals() {
  document
    .querySelectorAll(".modal.open")
    .forEach(closeModal);
}


/* =========================================================
   NUEVO INGRESO
========================================================= */

function prepareNewIncome() {
  incomeForm.reset();

  incomeEditId.value = "";

  incomeModalEyebrow.textContent =
    "Nuevo registro";

  incomeModalTitle.textContent =
    "Agregar ingreso";

  saveIncomeButton.textContent =
    "Guardar ingreso";

  openModal(incomeModal);

  setTimeout(
    () => incomeNameInput.focus(),
    100
  );
}


function saveIncome(event) {
  event.preventDefault();

  const name =
    incomeNameInput.value.trim();

  const amount =
    Number(incomeAmountInput.value);

  if (
    !name ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    showToast(
      "Ingresa una descripción y un monto válido."
    );

    return;
  }

  const monthData =
    getCurrentMonthData();

  const editId =
    incomeEditId.value;

  if (editId) {

    const income =
      monthData.incomes.find(
        (item) =>
          item.id === editId
      );

    if (income) {
      income.name = name;
      income.amount = amount;
      income.updatedAt =
        new Date().toISOString();
    }

    showToast(
      "Ingreso actualizado."
    );

  } else {

    monthData.incomes.push({
      id: generateId(),
      name,
      amount,
      createdAt:
        new Date().toISOString()
    });

    showToast(
      "Ingreso agregado."
    );
  }

  monthData.initialized = true;

  saveDatabase();

  closeModal(incomeModal);

  incomeForm.reset();

  incomeEditId.value = "";

  renderApp();
}


/* =========================================================
   EDITAR INGRESO
========================================================= */

function editIncome(id) {
  const monthData =
    getCurrentMonthData();

  const income =
    monthData.incomes.find(
      (item) => item.id === id
    );

  if (!income) {
    return;
  }

  incomeEditId.value =
    income.id;

  incomeNameInput.value =
    income.name;

  incomeAmountInput.value =
    income.amount;

  incomeModalEyebrow.textContent =
    "Editar registro";

  incomeModalTitle.textContent =
    "Editar ingreso";

  saveIncomeButton.textContent =
    "Guardar cambios";

  openModal(incomeModal);

  setTimeout(
    () => incomeNameInput.focus(),
    100
  );
}


/* =========================================================
   ELIMINAR INGRESO
========================================================= */

function deleteIncome(id) {
  const monthData =
    getCurrentMonthData();

  const income =
    monthData.incomes.find(
      (item) => item.id === id
    );

  if (!income) {
    return;
  }

  const confirmed =
    window.confirm(
      `¿Eliminar el ingreso "${income.name}"?`
    );

  if (!confirmed) {
    return;
  }

  monthData.incomes =
    monthData.incomes.filter(
      (item) =>
        item.id !== id
    );

  saveDatabase();

  renderApp();

  showToast(
    "Ingreso eliminado."
  );
}


/* =========================================================
   NUEVO GASTO
========================================================= */

function prepareNewExpense() {
  expenseForm.reset();

  expenseEditId.value = "";

  expenseCategoryInput.value =
    "Casa";

  usualExpenseInput.value =
    "";

  expenseModalEyebrow.textContent =
    "Nuevo registro";

  expenseModalTitle.textContent =
    "Agregar gasto";

  saveExpenseButton.textContent =
    "Guardar gasto";

  openModal(expenseModal);

  setTimeout(
    () => expenseNameInput.focus(),
    100
  );
}


function saveExpense(event) {
  event.preventDefault();

  const name =
    expenseNameInput.value.trim();

  const amount =
    Number(expenseAmountInput.value);

  const category =
    expenseCategoryInput.value;

  if (
    !name ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    showToast(
      "Ingresa una descripción y un monto válido."
    );

    return;
  }

  const validCategories = [
    "Casa",
    "Depto",
    "Parcela",
    "Otros"
  ];

  if (
    !validCategories.includes(category)
  ) {
    showToast(
      "Selecciona una categoría válida."
    );

    return;
  }

  const monthData =
    getCurrentMonthData();

  const editId =
    expenseEditId.value;

  if (editId) {

    const expense =
      monthData.expenses.find(
        (item) =>
          item.id === editId
      );

    if (expense) {
      expense.name = name;
      expense.amount = amount;
      expense.category = category;
      expense.updatedAt =
        new Date().toISOString();
    }

    showToast(
      "Gasto actualizado."
    );

  } else {

    monthData.expenses.push({
      id: generateId(),
      name,
      amount,
      category,
      createdAt:
        new Date().toISOString()
    });

    showToast(
      "Gasto agregado."
    );
  }

  monthData.initialized = true;

  saveDatabase();

  closeModal(expenseModal);

  expenseForm.reset();

  expenseEditId.value = "";

  renderApp();
}


/* =========================================================
   EDITAR GASTO
========================================================= */

function editExpense(id) {
  const monthData =
    getCurrentMonthData();

  const expense =
    monthData.expenses.find(
      (item) => item.id === id
    );

  if (!expense) {
    return;
  }

  expenseEditId.value =
    expense.id;

  expenseNameInput.value =
    expense.name;

  expenseAmountInput.value =
    expense.amount;

  expenseCategoryInput.value =
    expense.category;

  /*
    No necesitamos seleccionar automáticamente
    el gasto habitual. La descripción ya aparece
    en el campo principal.
  */

  usualExpenseInput.value = "";

  expenseModalEyebrow.textContent =
    "Editar registro";

  expenseModalTitle.textContent =
    "Editar gasto";

  saveExpenseButton.textContent =
    "Guardar cambios";

  openModal(expenseModal);

  setTimeout(
    () => expenseNameInput.focus(),
    100
  );
}


/* =========================================================
   ELIMINAR GASTO
========================================================= */

function deleteExpense(id) {
  const monthData =
    getCurrentMonthData();

  const expense =
    monthData.expenses.find(
      (item) => item.id === id
    );

  if (!expense) {
    return;
  }

  const confirmed =
    window.confirm(
      `¿Eliminar el gasto "${expense.name}"?`
    );

  if (!confirmed) {
    return;
  }

  monthData.expenses =
    monthData.expenses.filter(
      (item) =>
        item.id !== id
    );

  saveDatabase();

  renderApp();

  showToast(
    "Gasto eliminado."
  );
}


/* =========================================================
   GASTOS HABITUALES
========================================================= */

function useUsualExpense() {
  const selected =
    usualExpenseInput.value;

  if (!selected) {
    return;
  }

  expenseNameInput.value =
    selected;

  /*
    Sugerimos categorías razonables,
    pero el usuario siempre puede cambiarlas.
  */

  const suggestedCategories = {
    "Dividendo": "Casa",
    "Gastos comunes": "Depto",
    "Contribuciones": "Casa",
    "Luz": "Casa",
    "Agua": "Casa",
    "Gas": "Casa",
    "Pellet": "Casa",
    "Colegio": "Otros",
    "Nana": "Casa",
    "Celulares": "Otros",
    "Internet": "Casa",
    "Bencina / TAG": "Otros",
    "Comida": "Otros",
    "Seguros": "Otros",
    "Auto": "Otros",
    "Jardinero": "Casa",
    "Clases": "Otros",
    "Vacaciones": "Otros",
    "Salidas a comer": "Otros",
    "Dentista": "Otros",
    "Doctores": "Otros",
    "Calefacción": "Casa"
  };

  if (suggestedCategories[selected]) {
    expenseCategoryInput.value =
      suggestedCategories[selected];
  }

  expenseAmountInput.focus();
}


/* =========================================================
   FILTROS
========================================================= */

function updateFilterButtons() {
  document
    .querySelectorAll(
      ".filter-button"
    )
    .forEach((button) => {

      button.classList.toggle(
        "active",
        button.dataset.category ===
          selectedExpenseCategory
      );

    });
}


/* =========================================================
   COMENZAR MES VACÍO
========================================================= */

function startEmptyMonth() {
  const monthData =
    getCurrentMonthData();

  monthData.initialized = true;

  saveDatabase();

  updateEmptyMonthSection();

  showToast(
    `${monthNames[selectedMonth]} listo para comenzar.`
  );
}


/* =========================================================
   COPIAR MES ANTERIOR
========================================================= */

function prepareCopyPreviousMonth() {
  const previous =
    getPreviousMonthInfo();

  if (
    !previous.data ||
    isMonthEmpty(previous.data)
  ) {
    showToast(
      "El mes anterior no tiene datos para copiar."
    );

    return;
  }

  copyMonthMessage.textContent =
    `Puedes usar ${monthNames[previous.month]} ${previous.year} como base para ${monthNames[selectedMonth]} ${selectedYear}.`;

  copyIncomesCheckbox.checked =
    true;

  copyExpensesCheckbox.checked =
    true;

  openModal(copyMonthModal);
}


function confirmCopyPreviousMonth() {
  const copyIncomes =
    copyIncomesCheckbox.checked;

  const copyExpenses =
    copyExpensesCheckbox.checked;

  if (
    !copyIncomes &&
    !copyExpenses
  ) {
    showToast(
      "Selecciona qué quieres copiar."
    );

    return;
  }

  const previous =
    getPreviousMonthInfo();

  if (
    !previous.data ||
    isMonthEmpty(previous.data)
  ) {
    closeModal(copyMonthModal);

    showToast(
      "El mes anterior no tiene datos para copiar."
    );

    return;
  }

  const current =
    getCurrentMonthData();

  const currentHasData =
    !isMonthEmpty(current);

  if (currentHasData) {

    const confirmed =
      window.confirm(
        `Este mes ya tiene registros. Los elementos copiados se agregarán a ${monthNames[selectedMonth]}. ¿Continuar?`
      );

    if (!confirmed) {
      return;
    }
  }

  if (copyIncomes) {

    previous.data.incomes.forEach(
      (income) => {

        current.incomes.push({
          id: generateId(),
          name: income.name,
          amount: Number(income.amount),
          copiedFrom: previous.key,
          createdAt:
            new Date().toISOString()
        });

      }
    );
  }

  if (copyExpenses) {

    previous.data.expenses.forEach(
      (expense) => {

        current.expenses.push({
          id: generateId(),
          name: expense.name,
          amount: Number(expense.amount),
          category:
            expense.category || "Otros",
          copiedFrom: previous.key,
          createdAt:
            new Date().toISOString()
        });

      }
    );
  }

  current.initialized = true;

  saveDatabase();

  closeModal(copyMonthModal);

  selectedExpenseCategory =
    "Todos";

  updateFilterButtons();

  renderApp();

  showToast(
    `Presupuesto de ${monthNames[previous.month]} copiado.`
  );
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {
  clearTimeout(toastTimer);

  toastElement.textContent =
    message;

  toastElement.classList.add(
    "show"
  );

  toastTimer =
    setTimeout(
      () => {

        toastElement.classList.remove(
          "show"
        );

      },
      2600
    );
}


/* =========================================================
   RENDER
========================================================= */

function renderApp() {
  updateMonthDisplay();

  renderIncomes();

  renderExpenses();

  updateSummary();

  updateEmptyMonthSection();
}


/* =========================================================
   EVENTOS: MESES
========================================================= */

previousMonthButton.addEventListener(
  "click",
  () => changeMonth(-1)
);


nextMonthButton.addEventListener(
  "click",
  () => changeMonth(1)
);


currentMonthButton.addEventListener(
  "click",
  goToCurrentMonth
);


/* =========================================================
   EVENTOS: INGRESOS
========================================================= */

openIncomeModalButton.addEventListener(
  "click",
  prepareNewIncome
);


incomeForm.addEventListener(
  "submit",
  saveIncome
);


/* =========================================================
   EVENTOS: GASTOS
========================================================= */

openExpenseModalButton.addEventListener(
  "click",
  prepareNewExpense
);


expenseForm.addEventListener(
  "submit",
  saveExpense
);


usualExpenseInput.addEventListener(
  "change",
  useUsualExpense
);


/* =========================================================
   EVENTOS: MES VACÍO / COPIAR
========================================================= */

startEmptyMonthButton.addEventListener(
  "click",
  startEmptyMonth
);


copyPreviousMonthButton.addEventListener(
  "click",
  prepareCopyPreviousMonth
);


copyMonthButton.addEventListener(
  "click",
  prepareCopyPreviousMonth
);


confirmCopyMonthButton.addEventListener(
  "click",
  confirmCopyPreviousMonth
);


/* =========================================================
   EVENTOS: FILTROS
========================================================= */

document
  .querySelectorAll(
    ".filter-button"
  )
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        selectedExpenseCategory =
          button.dataset.category;

        updateFilterButtons();

        renderExpenses();
      }
    );

  });


/* =========================================================
   EVENTOS: EDITAR / ELIMINAR
========================================================= */

document.addEventListener(
  "click",
  (event) => {

    const editIncomeButton =
      event.target.closest(
        "[data-edit-income]"
      );

    if (editIncomeButton) {

      editIncome(
        editIncomeButton.dataset.editIncome
      );

      return;
    }


    const deleteIncomeButton =
      event.target.closest(
        "[data-delete-income]"
      );

    if (deleteIncomeButton) {

      deleteIncome(
        deleteIncomeButton.dataset.deleteIncome
      );

      return;
    }


    const editExpenseButton =
      event.target.closest(
        "[data-edit-expense]"
      );

    if (editExpenseButton) {

      editExpense(
        editExpenseButton.dataset.editExpense
      );

      return;
    }


    const deleteExpenseButton =
      event.target.closest(
        "[data-delete-expense]"
      );

    if (deleteExpenseButton) {

      deleteExpense(
        deleteExpenseButton.dataset.deleteExpense
      );

    }

  }
);


/* =========================================================
   EVENTOS: CERRAR MODALES
========================================================= */

document
  .querySelectorAll(
    "[data-close-modal]"
  )
  .forEach((element) => {

    element.addEventListener(
      "click",
      () => {

        const modal =
          element.closest(".modal");

        if (modal) {
          closeModal(modal);
        }

      }
    );

  });


document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {
      closeAllModals();
    }

  }
);


/* =========================================================
   INICIAR
========================================================= */

updateFilterButtons();

renderApp();