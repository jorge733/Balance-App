"use strict";



/* =========================================================

   BALANCE

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



const debtIcons = {

  "Tarjeta de crédito": "💳",

  "Línea de crédito": "🏦",

  "Crédito": "📄",

  "Préstamo": "🤝",

  "Otro": "💰"

};





/* =========================================================

   ESTADO

========================================================= */



const today = new Date();



let selectedYear = today.getFullYear();

let selectedMonth = today.getMonth();

let selectedExpenseCategory = "Todos";

let currentView = "home";



let database = loadDatabase();



let toastTimer;





/* =========================================================

   DOM - GENERAL

========================================================= */



const currentMonthElement =

  document.getElementById("currentMonth");



const currentMonthButton =

  document.getElementById("currentMonthButton");



const previousMonthButton =

  document.getElementById("previousMonth");



const nextMonthButton =

  document.getElementById("nextMonth");



const navButtons =

  document.querySelectorAll(".nav-button:not(:disabled)");



const appViews =

  document.querySelectorAll(".app-view");





/* =========================================================

   DOM - MES VACÍO

========================================================= */



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

const applyRecurringFromActionsButton =
  document.getElementById("applyRecurringFromActions");

const startMonthFromZeroButton =
  document.getElementById("startMonthFromZero");





/* =========================================================

   DOM - RESUMEN

========================================================= */



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

   DOM - VISTAS DETALLE

========================================================= */



const incomeViewList =

  document.getElementById("incomeViewList");



const expenseViewList =

  document.getElementById("expenseViewList");



const incomeViewTotal =

  document.getElementById("incomeViewTotal");



const expenseViewTotal =

  document.getElementById("expenseViewTotal");



const openIncomeModalFromView =

  document.getElementById("openIncomeModalFromView");



const openExpenseModalFromView =

  document.getElementById("openExpenseModalFromView");





/* =========================================================

   DOM - INGRESOS

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

   DOM - GASTOS

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

const recurringExpenseInput =
  document.getElementById("recurringExpense");

const recurringExpensesPanel =
  document.getElementById("recurringExpensesPanel");

const recurringExpensesList =
  document.getElementById("recurringExpensesList");

const applyRecurringExpensesButton =
  document.getElementById("applyRecurringExpenses");

const recurringPendingNotice =
  document.getElementById("recurringPendingNotice");

const recurringPendingText =
  document.getElementById("recurringPendingText");

const applyPendingRecurringButton =
  document.getElementById("applyPendingRecurring");



const expenseModalTitle =

  document.getElementById("expenseModalTitle");



const expenseModalEyebrow =

  document.getElementById("expenseModalEyebrow");



const saveExpenseButton =

  document.getElementById("saveExpenseButton");





/* =========================================================

   DOM - DEUDAS

========================================================= */



const debtModal =

  document.getElementById("debtModal");



const openDebtModalButton =

  document.getElementById("openDebtModal");



const debtForm =

  document.getElementById("debtForm");



const debtEditId =

  document.getElementById("debtEditId");



const debtNameInput =

  document.getElementById("debtName");



const debtTypeInput =

  document.getElementById("debtType");



const debtAmountInput =

  document.getElementById("debtAmount");



const debtMonthlyPaymentInput =

  document.getElementById("debtMonthlyPayment");



const debtModalEyebrow =

  document.getElementById("debtModalEyebrow");



const debtModalTitle =

  document.getElementById("debtModalTitle");



const saveDebtButton =

  document.getElementById("saveDebtButton");



const debtListElement =

  document.getElementById("debtList");



const totalDebtElement =

  document.getElementById("totalDebt");



const totalDebtMonthlyPaymentElement =

  document.getElementById("totalDebtMonthlyPayment");



const debtCountElement =

  document.getElementById("debtCount");





/* =========================================================

   DOM - COPIAR MES

========================================================= */



/* =========================================================
   DOM - METAS
========================================================= */

const goalModal = document.getElementById("goalModal");
const openGoalModalButton = document.getElementById("openGoalModal");
const goalForm = document.getElementById("goalForm");
const goalEditId = document.getElementById("goalEditId");
const goalNameInput = document.getElementById("goalName");
const goalTargetAmountInput = document.getElementById("goalTargetAmount");
const goalSavedAmountInput = document.getElementById("goalSavedAmount");
const goalModalEyebrow = document.getElementById("goalModalEyebrow");
const goalModalTitle = document.getElementById("goalModalTitle");
const saveGoalButton = document.getElementById("saveGoalButton");
const goalListElement = document.getElementById("goalList");
const goalCountElement = document.getElementById("goalCount");
const totalGoalTargetElement = document.getElementById("totalGoalTarget");
const totalGoalSavedElement = document.getElementById("totalGoalSaved");
const totalGoalRemainingElement = document.getElementById("totalGoalRemaining");

/* =========================================================
   DOM - HISTORIAL
========================================================= */
const historyMonthCountElement = document.getElementById("historyMonthCount");
const historyTotalIncomeElement = document.getElementById("historyTotalIncome");
const historyTotalExpensesElement = document.getElementById("historyTotalExpenses");
const historyTotalBalanceElement = document.getElementById("historyTotalBalance");
const historyChartElement = document.getElementById("historyChart");
const historyListElement = document.getElementById("historyList");

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

    months: {},

    debts: [],

    goals: [],

    recurringExpenses: []

  };

}





function loadDatabase() {

  try {



    const stored =

      localStorage.getItem(STORAGE_KEY);



    if (!stored) {

      return createEmptyDatabase();

    }



    const parsed =

      JSON.parse(stored);



    if (

      !parsed ||

      typeof parsed !== "object"

    ) {

      return createEmptyDatabase();

    }



    if (

      !parsed.months ||

      typeof parsed.months !== "object"

    ) {

      parsed.months = {};

    }



    /*

      MIGRACIÓN AUTOMÁTICA



      La versión anterior no tenía deudas.

      Las agregamos sin modificar los meses existentes.

    */



    if (!Array.isArray(parsed.debts)) {

      parsed.debts = [];

    }

    if (!Array.isArray(parsed.goals)) {

      parsed.goals = [];

    }

    if (!Array.isArray(parsed.recurringExpenses)) {

      parsed.recurringExpenses = [];

    }

    // Compatibilidad con versiones que guardaban meses en la raíz.
    Object.keys(parsed).forEach((key) => {
      if (/^\d{4}-\d{2}$/.test(key) && parsed[key] && typeof parsed[key] === "object") {
        if (!parsed.months[key]) {
          parsed.months[key] = normalizeMonthData(parsed[key]);
        }
      }
    });



    return parsed;



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

  window.dispatchEvent(
    new CustomEvent("balance:local-save", {
      detail: { database }
    })
  );

}

window.BalanceCloudBridge = {
  getDatabase() {
    return JSON.parse(JSON.stringify(database));
  },

  replaceDatabase(cloudDatabase) {
    if (!cloudDatabase || typeof cloudDatabase !== "object") return;

    const nextDatabase = {
      months:
        cloudDatabase.months && typeof cloudDatabase.months === "object"
          ? cloudDatabase.months
          : {},
      debts: Array.isArray(cloudDatabase.debts)
        ? cloudDatabase.debts
        : [],
      goals: Array.isArray(cloudDatabase.goals)
        ? cloudDatabase.goals
        : [],
      recurringExpenses: Array.isArray(cloudDatabase.recurringExpenses)
        ? cloudDatabase.recurringExpenses
        : []
    };

    database = nextDatabase;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    renderApp();
  }
};







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



  if (

    typeof monthData.initialized !== "boolean"

  ) {

    monthData.initialized =

      monthData.incomes.length > 0 ||

      monthData.expenses.length > 0;

  }



  return monthData;

}





function getCurrentMonthData(create = true) {



  const key =

    getMonthKey();



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



  let year =

    selectedYear;



  let month =

    selectedMonth - 1;



  if (month < 0) {

    month = 11;

    year--;

  }



  const key =

    getMonthKey(year, month);



  const data =

    database.months[key]

      ? normalizeMonthData(

          database.months[key]

        )

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



  return Boolean(

    previous.data &&

    (

      previous.data.incomes.length > 0 ||

      previous.data.expenses.length > 0

    )

  );

}





/* =========================================================

   UTILIDADES

========================================================= */



function formatCurrency(value) {



  return new Intl.NumberFormat(

    "es-CL",

    {

      style: "currency",

      currency: "CLP",

      maximumFractionDigits: 0

    }

  ).format(Number(value) || 0);

}







function parseCurrencyInput(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

function formatCurrencyInputValue(value) {
  const amount = parseCurrencyInput(value);
  return amount ? new Intl.NumberFormat("es-CL").format(amount) : "";
}

function setupCurrencyInputs() {
  document.querySelectorAll("[data-currency-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const formatted = formatCurrencyInputValue(input.value);
      input.value = formatted;
    });

    input.addEventListener("focus", () => {
      requestAnimationFrame(() => input.select());
    });
  });
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

   NAVEGACIÓN

========================================================= */



function showView(viewName) {



  currentView =

    viewName;



  appViews.forEach((view) => {



    view.classList.toggle(

      "active",

      view.dataset.appView === viewName

    );



  });



  navButtons.forEach((button) => {



    button.classList.toggle(

      "active",

      button.dataset.view === viewName

    );



  });



  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });



  renderApp();

}





/* =========================================================

   CÁLCULOS PRESUPUESTO

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



  incomeViewTotal.textContent =

    formatCurrency(totals.totalIncome);



  expenseViewTotal.textContent =

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



  budgetPercentageElement.textContent =

    `${Math.round(percentage)}%`;



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

   MES

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



  selectedExpenseCategory =

    "Todos";



  updateFilterButtons();



  renderApp();

}





function goToCurrentMonth() {



  const now =

    new Date();



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



  const shouldShow =

    isMonthEmpty(monthData) &&

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

   HTML INGRESO

========================================================= */



function incomeItemHTML(income) {



  return `

    <div class="transaction-item">



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

          title="Editar"

          aria-label="Editar ingreso"

        >

          ✎

        </button>



        <button

          class="delete-button"

          type="button"

          data-delete-income="${income.id}"

          title="Eliminar"

          aria-label="Eliminar ingreso"

        >

          ×

        </button>



      </div>



    </div>

  `;

}





/* =========================================================

   RENDER INGRESOS

========================================================= */



function renderIncomes() {



  const monthData =

    getCurrentMonthData();



  if (monthData.incomes.length === 0) {



    const emptyHTML = `

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



    incomeListElement.innerHTML =

      emptyHTML;



    incomeViewList.innerHTML =

      emptyHTML;



    return;

  }



  const html =

    monthData.incomes

      .map(incomeItemHTML)

      .join("");



  incomeListElement.innerHTML =

    html;



  incomeViewList.innerHTML =

    html;

}





/* =========================================================

   HTML GASTO

========================================================= */



function expenseItemHTML(expense) {



  const icon =

    categoryIcons[expense.category] ||

    "🧾";



  return `

    <div class="transaction-item">



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

          title="Editar"

          aria-label="Editar gasto"

        >

          ✎

        </button>



        <button

          class="delete-button"

          type="button"

          data-delete-expense="${expense.id}"

          title="Eliminar"

          aria-label="Eliminar gasto"

        >

          ×

        </button>



      </div>



    </div>

  `;

}





/* =========================================================

   RENDER GASTOS

========================================================= */



function renderExpenses() {



  const monthData =

    getCurrentMonthData();



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



    const emptyHTML = `

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



    expenseListElement.innerHTML =

      emptyHTML;



    expenseViewList.innerHTML =

      emptyHTML;



    return;

  }



  const html =

    expenses

      .map(expenseItemHTML)

      .join("");



  expenseListElement.innerHTML =

    html;



  expenseViewList.innerHTML =

    html;

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

   INGRESOS - NUEVO

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

    parseCurrencyInput(incomeAmountInput.value);



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

        (item) => item.id === editId

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



  renderApp();

}





/* =========================================================

   INGRESOS - EDITAR

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

}





/* =========================================================

   INGRESOS - ELIMINAR

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



  if (

    !window.confirm(

      `¿Eliminar el ingreso "${income.name}"?`

    )

  ) {

    return;

  }



  monthData.incomes =

    monthData.incomes.filter(

      (item) => item.id !== id

    );



  saveDatabase();



  renderApp();



  showToast(

    "Ingreso eliminado."

  );

}





/* =========================================================

   GASTOS - NUEVO

========================================================= */



function prepareNewExpense() {



  expenseForm.reset();



  expenseEditId.value = "";



  expenseCategoryInput.value =

    "Casa";



  usualExpenseInput.value =

    "";

  if (recurringExpenseInput) recurringExpenseInput.checked = false;



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

    parseCurrencyInput(expenseAmountInput.value);



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



  const monthData =

    getCurrentMonthData();



  const editId =

    expenseEditId.value;



  if (editId) {



    const expense =

      monthData.expenses.find(

        (item) => item.id === editId

      );



    if (expense) {



      expense.name = name;

      expense.amount = amount;

      expense.category = category;

      if (recurringExpenseInput && recurringExpenseInput.checked) {
        expense.recurringId = syncRecurringTemplate(name, amount, category, true);
      } else if (expense.recurringId) {
        delete expense.recurringId;
      }

      expense.updatedAt =

        new Date().toISOString();

    }



    showToast(

      "Gasto actualizado."

    );



  } else {

    const recurringId =
      recurringExpenseInput && recurringExpenseInput.checked
        ? syncRecurringTemplate(name, amount, category, true)
        : null;

    monthData.expenses.push({

      id: generateId(),

      name,

      amount,

      category,

      ...(recurringId ? { recurringId } : {}),

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



  renderApp();

}





/* =========================================================

   GASTOS - EDITAR

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



  usualExpenseInput.value = "";

  if (recurringExpenseInput) {
    recurringExpenseInput.checked = Boolean(
      expense.recurringId ||
      normalizeRecurringExpenses().some((item) =>
        recurringKey(item) === recurringKey(expense)
      )
    );
  }



  expenseModalEyebrow.textContent =

    "Editar registro";



  expenseModalTitle.textContent =

    "Editar gasto";



  saveExpenseButton.textContent =

    "Guardar cambios";



  openModal(expenseModal);

}





/* =========================================================

   GASTOS - ELIMINAR

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



  if (

    !window.confirm(

      `¿Eliminar el gasto "${expense.name}"?`

    )

  ) {

    return;

  }



  monthData.expenses =

    monthData.expenses.filter(

      (item) => item.id !== id

    );



  saveDatabase();



  renderApp();



  showToast(

    "Gasto eliminado."

  );

}





/* =========================================================
   GASTOS RECURRENTES
========================================================= */

function normalizeRecurringExpenses() {
  if (!Array.isArray(database.recurringExpenses)) {
    database.recurringExpenses = [];
  }
  return database.recurringExpenses;
}

function recurringKey(item) {
  return `${String(item.name || "").trim().toLowerCase()}|${item.category || ""}`;
}

function syncRecurringTemplate(name, amount, category, enabled = true) {
  const recurring = normalizeRecurringExpenses();
  const key = recurringKey({ name, category });
  const existing = recurring.find((item) => recurringKey(item) === key);

  if (existing) {
    existing.name = name;
    existing.amount = amount;
    existing.category = category;
    existing.enabled = enabled;
    existing.updatedAt = new Date().toISOString();
    return existing.id;
  }

  const item = {
    id: generateId(),
    name,
    amount,
    category,
    enabled,
    createdAt: new Date().toISOString()
  };
  recurring.push(item);
  return item.id;
}

function getPendingRecurringExpenses() {
  const monthData = getCurrentMonthData(false);
  const expenses = monthData && Array.isArray(monthData.expenses)
    ? monthData.expenses
    : [];

  return normalizeRecurringExpenses()
    .filter((item) => item.enabled !== false)
    .filter((item) => !expenses.some((expense) =>
      expense.recurringId === item.id ||
      (
        String(expense.name || "").trim().toLowerCase() === String(item.name || "").trim().toLowerCase() &&
        expense.category === item.category &&
        Number(expense.amount || 0) === Number(item.amount || 0)
      )
    ));
}

function renderRecurringPendingNotice() {
  if (!recurringPendingNotice || !recurringPendingText) return;

  const pending = getPendingRecurringExpenses();

  if (pending.length === 0) {
    recurringPendingNotice.hidden = true;
    return;
  }

  const total = pending.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  recurringPendingText.textContent =
    `Tienes ${pending.length} gasto${pending.length === 1 ? "" : "s"} recurrente${pending.length === 1 ? "" : "s"} pendiente${pending.length === 1 ? "" : "s"} por ${formatCurrency(total)} en este mes.`;

  recurringPendingNotice.hidden = false;
}

function renderRecurringExpenses() {
  renderRecurringPendingNotice();

  if (!recurringExpensesPanel || !recurringExpensesList) return;

  const recurring = normalizeRecurringExpenses();
  recurringExpensesPanel.hidden = recurring.length === 0;

  if (recurring.length === 0) {
    recurringExpensesList.innerHTML = "";
    return;
  }

  recurringExpensesList.innerHTML = recurring.map((item) => `
    <div class="recurring-item">
      <div class="recurring-main">
        <span class="recurring-icon">${categoryIcons[item.category] || "🧾"}</span>
        <div>
          <strong>${escapeHTML(item.name)}</strong>
          <span>${escapeHTML(item.category)} · ${formatCurrency(item.amount)}</span>
        </div>
      </div>
      <div class="recurring-actions">
        <label class="recurring-toggle">
          <input type="checkbox" data-recurring-toggle="${item.id}" ${item.enabled !== false ? "checked" : ""}>
          <span>${item.enabled !== false ? "Activo" : "Pausado"}</span>
        </label>
        <button class="delete-button" type="button" data-recurring-delete="${item.id}" aria-label="Eliminar gasto recurrente">×</button>
      </div>
    </div>
  `).join("");
}

function applyRecurringExpenses() {
  const recurring = normalizeRecurringExpenses().filter((item) => item.enabled !== false);

  if (recurring.length === 0) {
    showToast("No hay gastos recurrentes activos.");
    return;
  }

  const monthData = getCurrentMonthData();
  let added = 0;

  recurring.forEach((item) => {
    const alreadyExists = monthData.expenses.some((expense) =>
      expense.recurringId === item.id ||
      (
        String(expense.name || "").trim().toLowerCase() === String(item.name || "").trim().toLowerCase() &&
        expense.category === item.category &&
        Number(expense.amount || 0) === Number(item.amount || 0)
      )
    );

    if (!alreadyExists) {
      monthData.expenses.push({
        id: generateId(),
        name: item.name,
        amount: Number(item.amount || 0),
        category: item.category,
        recurringId: item.id,
        createdAt: new Date().toISOString()
      });
      added++;
    }
  });

  if (added > 0) {
    monthData.initialized = true;
    saveDatabase();
    renderApp();
    showToast(`${added} gasto${added === 1 ? "" : "s"} recurrente${added === 1 ? "" : "s"} agregado${added === 1 ? "" : "s"} al mes.`);
  } else {
    showToast("Los gastos recurrentes activos ya están en este mes.");
  }
}

function handleRecurringListClick(event) {
  const deleteButton = event.target.closest("[data-recurring-delete]");
  if (!deleteButton) return;

  const id = deleteButton.dataset.recurringDelete;
  const item = normalizeRecurringExpenses().find((entry) => entry.id === id);
  if (!item) return;

  if (!window.confirm(`¿Eliminar "${item.name}" de los gastos recurrentes? Los meses anteriores no se modificarán.`)) {
    return;
  }

  database.recurringExpenses = normalizeRecurringExpenses().filter((entry) => entry.id !== id);
  saveDatabase();
  renderRecurringExpenses();
  showToast("Gasto recurrente eliminado.");
}

function handleRecurringListChange(event) {
  const input = event.target.closest("[data-recurring-toggle]");
  if (!input) return;

  const item = normalizeRecurringExpenses().find((entry) => entry.id === input.dataset.recurringToggle);
  if (!item) return;

  item.enabled = input.checked;
  item.updatedAt = new Date().toISOString();
  saveDatabase();
  renderRecurringExpenses();
  showToast(item.enabled ? "Gasto recurrente activado." : "Gasto recurrente pausado.");
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



  const suggestions = {

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



  if (suggestions[selected]) {

    expenseCategoryInput.value =

      suggestions[selected];

  }



  expenseAmountInput.focus();

}





/* =========================================================

   DEUDAS - CÁLCULOS

========================================================= */



function calculateDebtTotals() {



  const total =

    database.debts.reduce(

      (sum, debt) =>

        sum + Number(debt.amount || 0),

      0

    );



  const monthlyPayment =

    database.debts.reduce(

      (sum, debt) =>

        sum +

        Number(debt.monthlyPayment || 0),

      0

    );



  return {

    total,

    monthlyPayment,

    count: database.debts.length

  };

}





/* =========================================================

   DEUDAS - RENDER

========================================================= */



function renderDebts() {



  const totals =

    calculateDebtTotals();



  totalDebtElement.textContent =

    formatCurrency(totals.total);



  totalDebtMonthlyPaymentElement.textContent =

    formatCurrency(totals.monthlyPayment);



  debtCountElement.textContent =

    String(totals.count);



  if (database.debts.length === 0) {



    debtListElement.innerHTML = `

      <div class="empty-state">



        <div class="empty-icon">

          ✓

        </div>



        <h3>

          No hay deudas registradas

        </h3>



        <p>

          Agrega tarjetas, líneas de crédito

          u otras obligaciones para llevar

          un control claro.

        </p>



      </div>

    `;



    return;

  }



  debtListElement.innerHTML =

    database.debts

      .map((debt) => {



        const icon =

          debtIcons[debt.type] ||

          "💰";



        return `

          <div class="debt-item">



            <div class="debt-main">



              <div class="debt-icon">

                ${icon}

              </div>



              <div class="debt-info">



                <strong>

                  ${escapeHTML(debt.name)}

                </strong>



                <span>

                  ${escapeHTML(debt.type)}

                </span>



              </div>



            </div>





            <div class="debt-value balance">



              <span>

                Saldo pendiente

              </span>



              <strong>

                ${formatCurrency(debt.amount)}

              </strong>



            </div>





            <div class="debt-value">



              <span>

                Pago mensual

              </span>



              <strong>

                ${

                  Number(debt.monthlyPayment) > 0

                    ? formatCurrency(debt.monthlyPayment)

                    : "—"

                }

              </strong>



            </div>





            <div class="transaction-actions">



              <button

                class="edit-button"

                type="button"

                data-edit-debt="${debt.id}"

                title="Editar"

                aria-label="Editar deuda"

              >

                ✎

              </button>



              <button

                class="delete-button"

                type="button"

                data-delete-debt="${debt.id}"

                title="Eliminar"

                aria-label="Eliminar deuda"

              >

                ×

              </button>



            </div>



          </div>

        `;



      })

      .join("");

}





/* =========================================================

   DEUDAS - NUEVA

========================================================= */



function prepareNewDebt() {



  debtForm.reset();



  debtEditId.value = "";



  debtTypeInput.value =

    "Tarjeta de crédito";



  debtModalEyebrow.textContent =

    "Nueva obligación";



  debtModalTitle.textContent =

    "Agregar deuda";



  saveDebtButton.textContent =

    "Guardar deuda";



  openModal(debtModal);



  setTimeout(

    () => debtNameInput.focus(),

    100

  );

}





function saveDebt(event) {



  event.preventDefault();



  const name =

    debtNameInput.value.trim();



  const type =

    debtTypeInput.value;



  const amount =

    parseCurrencyInput(debtAmountInput.value);



  const monthlyPayment =

    debtMonthlyPaymentInput.value === ""

      ? 0

      : Number(

          debtMonthlyPaymentInput.value

        );



  if (

    !name ||

    !Number.isFinite(amount) ||

    amount < 0

  ) {



    showToast(

      "Ingresa un nombre y un saldo válido."

    );



    return;

  }



  if (

    !Number.isFinite(monthlyPayment) ||

    monthlyPayment < 0

  ) {



    showToast(

      "El pago mensual no es válido."

    );



    return;

  }



  const editId =

    debtEditId.value;



  if (editId) {



    const debt =

      database.debts.find(

        (item) => item.id === editId

      );



    if (debt) {



      debt.name = name;

      debt.type = type;

      debt.amount = amount;

      debt.monthlyPayment =

        monthlyPayment;



      debt.updatedAt =

        new Date().toISOString();

    }



    showToast(

      "Deuda actualizada."

    );



  } else {



    database.debts.push({

      id: generateId(),

      name,

      type,

      amount,

      monthlyPayment,

      createdAt:

        new Date().toISOString()

    });



    showToast(

      "Deuda agregada."

    );

  }



  saveDatabase();



  closeModal(debtModal);



  debtForm.reset();



  renderApp();

}





/* =========================================================

   DEUDAS - EDITAR

========================================================= */



function editDebt(id) {



  const debt =

    database.debts.find(

      (item) => item.id === id

    );



  if (!debt) {

    return;

  }



  debtEditId.value =

    debt.id;



  debtNameInput.value =

    debt.name;



  debtTypeInput.value =

    debt.type;



  debtAmountInput.value =

    debt.amount;



  debtMonthlyPaymentInput.value =

    debt.monthlyPayment || "";



  debtModalEyebrow.textContent =

    "Editar obligación";



  debtModalTitle.textContent =

    "Editar deuda";



  saveDebtButton.textContent =

    "Guardar cambios";



  openModal(debtModal);

}





/* =========================================================

   DEUDAS - ELIMINAR

========================================================= */



function deleteDebt(id) {



  const debt =

    database.debts.find(

      (item) => item.id === id

    );



  if (!debt) {

    return;

  }



  if (

    !window.confirm(

      `¿Eliminar la deuda "${debt.name}"?`

    )

  ) {

    return;

  }



  database.debts =

    database.debts.filter(

      (item) => item.id !== id

    );



  saveDatabase();



  renderApp();



  showToast(

    "Deuda eliminada."

  );

}





/* =========================================================

   FILTROS

========================================================= */



/* =========================================================
   METAS - CÁLCULOS Y RENDER
========================================================= */

function calculateGoalTotals() {
  const target = database.goals.reduce((sum, goal) => sum + Number(goal.targetAmount || 0), 0);
  const saved = database.goals.reduce((sum, goal) => sum + Number(goal.savedAmount || 0), 0);

  return {
    target,
    saved,
    remaining: Math.max(target - saved, 0),
    count: database.goals.length
  };
}

function renderGoals() {
  if (!goalListElement) return;

  const totals = calculateGoalTotals();
  goalCountElement.textContent = String(totals.count);
  totalGoalTargetElement.textContent = formatCurrency(totals.target);
  totalGoalSavedElement.textContent = formatCurrency(totals.saved);
  totalGoalRemainingElement.textContent = formatCurrency(totals.remaining);

  if (database.goals.length === 0) {
    goalListElement.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎯</div>
        <h3>Aún no hay metas registradas</h3>
        <p>Agrega objetivos como reparaciones, muebles, refrigerador, viajes u otros proyectos familiares.</p>
      </div>
    `;
    return;
  }

  goalListElement.innerHTML = database.goals.map((goal) => {
    const target = Number(goal.targetAmount || 0);
    const saved = Number(goal.savedAmount || 0);
    const remaining = Math.max(target - saved, 0);
    const percentage = target > 0 ? (saved / target) * 100 : 0;
    const visualPercentage = Math.min(Math.max(percentage, 0), 100);
    const completed = target > 0 && saved >= target;

    return `
      <article class="goal-item ${completed ? "completed" : ""}">
        <div class="goal-header">
          <div class="goal-main">
            <div class="goal-icon">${completed ? "✓" : "🎯"}</div>
            <div class="goal-info">
              <strong>${escapeHTML(goal.name)}</strong>
              <span>${completed ? "Meta completada" : "En progreso"}</span>
            </div>
          </div>
          <div class="transaction-actions">
            <button class="edit-button" type="button" data-edit-goal="${goal.id}" title="Editar" aria-label="Editar meta">✎</button>
            <button class="delete-button" type="button" data-delete-goal="${goal.id}" title="Eliminar" aria-label="Eliminar meta">×</button>
          </div>
        </div>

        <div class="goal-values">
          <div><span>Objetivo</span><strong>${formatCurrency(target)}</strong></div>
          <div><span>Ahorrado</span><strong>${formatCurrency(saved)}</strong></div>
          <div><span>Pendiente</span><strong>${formatCurrency(remaining)}</strong></div>
        </div>

        <div class="goal-progress-track" aria-hidden="true">
          <div class="goal-progress-bar" style="width: ${visualPercentage}%"></div>
        </div>
        <div class="goal-progress-info">
          <span>${completed ? "Objetivo alcanzado" : "Avance"}</span>
          <strong class="goal-percentage">${Math.round(percentage)}%</strong>
        </div>
      </article>
    `;
  }).join("");
}

function prepareNewGoal() {
  goalForm.reset();
  goalEditId.value = "";
  goalSavedAmountInput.value = "0";
  goalModalEyebrow.textContent = "Nuevo objetivo";
  goalModalTitle.textContent = "Agregar meta";
  saveGoalButton.textContent = "Guardar meta";
  openModal(goalModal);
  setTimeout(() => goalNameInput.focus(), 100);
}

function saveGoal(event) {
  event.preventDefault();
  const name = goalNameInput.value.trim();
  const targetAmount = parseCurrencyInput(goalTargetAmountInput.value);
  const savedAmount = goalSavedAmountInput.value === "" ? 0 : parseCurrencyInput(goalSavedAmountInput.value);

  if (!name || !Number.isFinite(targetAmount) || targetAmount <= 0) {
    showToast("Ingresa un nombre y un monto objetivo válido.");
    return;
  }
  if (!Number.isFinite(savedAmount) || savedAmount < 0) {
    showToast("El monto ahorrado no es válido.");
    return;
  }

  const editId = goalEditId.value;
  if (editId) {
    const goal = database.goals.find((item) => item.id === editId);
    if (goal) {
      goal.name = name;
      goal.targetAmount = targetAmount;
      goal.savedAmount = savedAmount;
      goal.updatedAt = new Date().toISOString();
    }
    showToast("Meta actualizada.");
  } else {
    database.goals.push({ id: generateId(), name, targetAmount, savedAmount, createdAt: new Date().toISOString() });
    showToast("Meta agregada.");
  }

  saveDatabase();
  closeModal(goalModal);
  goalForm.reset();
  renderApp();
}

function editGoal(id) {
  const goal = database.goals.find((item) => item.id === id);
  if (!goal) return;
  goalEditId.value = goal.id;
  goalNameInput.value = goal.name;
  goalTargetAmountInput.value = formatCurrencyInputValue(goal.targetAmount);
  goalSavedAmountInput.value = goal.savedAmount || 0;
  goalModalEyebrow.textContent = "Editar objetivo";
  goalModalTitle.textContent = "Editar meta";
  saveGoalButton.textContent = "Guardar cambios";
  openModal(goalModal);
}

function deleteGoal(id) {
  const goal = database.goals.find((item) => item.id === id);
  if (!goal) return;
  if (!window.confirm(`¿Eliminar la meta "${goal.name}"?`)) return;
  database.goals = database.goals.filter((item) => item.id !== id);
  saveDatabase();
  renderApp();
  showToast("Meta eliminada.");
}


/* =========================================================
   HISTORIAL
========================================================= */
function getHistoryData() {
  return Object.entries(database.months || {})
    .map(([key, raw]) => {
      const data = normalizeMonthData(raw);
      if (data.incomes.length === 0 && data.expenses.length === 0) return null;
      const [year, monthNumber] = key.split("-").map(Number);
      const income = data.incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const expenses = data.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const categories = { Depto: 0, Casa: 0, Parcela: 0, Otros: 0 };
      data.expenses.forEach((item) => {
        if (Object.prototype.hasOwnProperty.call(categories, item.category)) {
          categories[item.category] += Number(item.amount || 0);
        }
      });
      return { key, year, month: monthNumber - 1, income, expenses, balance: income - expenses, categories };
    })
    .filter(Boolean)
    .sort((a, b) => b.key.localeCompare(a.key));
}

function renderHistory() {
  if (!historyListElement || !historyChartElement) return;
  const items = getHistoryData();
  const totals = items.reduce((acc, item) => {
    acc.income += item.income; acc.expenses += item.expenses; acc.balance += item.balance; return acc;
  }, { income: 0, expenses: 0, balance: 0 });
  historyMonthCountElement.textContent = String(items.length);
  historyTotalIncomeElement.textContent = formatCurrency(totals.income);
  historyTotalExpensesElement.textContent = formatCurrency(totals.expenses);
  historyTotalBalanceElement.textContent = formatCurrency(totals.balance);
  historyTotalBalanceElement.classList.toggle("negative", totals.balance < 0);

  if (!items.length) {
    const empty = `<div class="empty-state"><div class="empty-icon">📊</div><h3>Aún no hay historial</h3><p>Cuando registres ingresos o gastos en distintos meses, podrás compararlos aquí.</p></div>`;
    historyChartElement.innerHTML = empty; historyListElement.innerHTML = empty; return;
  }

  const chronological = [...items].reverse().slice(-12);
  const maxValue = Math.max(1, ...chronological.flatMap(i => [i.income, i.expenses]));
  historyChartElement.innerHTML = chronological.map(item => `
    <div class="history-chart-row">
      <div class="history-chart-label"><strong>${monthNames[item.month].slice(0,3)}</strong><span>${item.year}</span></div>
      <div class="history-bars">
        <div class="history-bar-line"><span>Ingresos</span><div class="history-bar-track"><div class="history-bar income-bar" style="width:${(item.income/maxValue)*100}%"></div></div><strong>${formatCurrency(item.income)}</strong></div>
        <div class="history-bar-line"><span>Gastos</span><div class="history-bar-track"><div class="history-bar expense-bar" style="width:${(item.expenses/maxValue)*100}%"></div></div><strong>${formatCurrency(item.expenses)}</strong></div>
      </div>
    </div>`).join("");

  historyListElement.innerHTML = items.map(item => {
    const categoryText = Object.entries(item.categories).filter(([,v]) => v > 0).map(([k,v]) => `${k}: ${formatCurrency(v)}`).join(" · ") || "Sin gastos por categoría";
    return `<article class="history-item">
      <div class="history-month"><div class="history-month-icon">📅</div><div><strong>${monthNames[item.month]} ${item.year}</strong><span>${categoryText}</span></div></div>
      <div class="history-values"><div><span>Ingresos</span><strong class="history-income">${formatCurrency(item.income)}</strong></div><div><span>Gastos</span><strong class="history-expense">${formatCurrency(item.expenses)}</strong></div><div><span>Disponible</span><strong class="${item.balance < 0 ? "history-negative" : "history-balance"}">${formatCurrency(item.balance)}</strong></div></div>
      <button class="secondary-button history-open-month" type="button" data-history-month="${item.key}">Ver mes</button>
    </article>`;
  }).join("");
}

function openHistoryMonth(key) {
  const [year, monthNumber] = key.split("-").map(Number);
  if (!year || !monthNumber) return;
  selectedYear = year; selectedMonth = monthNumber - 1; selectedExpenseCategory = "Todos";
  updateFilterButtons(); showView("home");
}

function updateFilterButtons() {



  document

    .querySelectorAll(".filter-button")

    .forEach((button) => {



      button.classList.toggle(

        "active",

        button.dataset.category ===

          selectedExpenseCategory

      );



    });

}





/* =========================================================

   COMENZAR MES

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

   COPIAR MES

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



  if (!isMonthEmpty(current)) {



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

   RENDER GENERAL

========================================================= */



function renderApp() {



  updateMonthDisplay();



  renderIncomes();



  renderExpenses();



  updateSummary();



  updateEmptyMonthSection();



  renderDebts();

  renderGoals();

  renderHistory();

  renderRecurringExpenses();

}





/* =========================================================

   EVENTOS - NAVEGACIÓN

========================================================= */



navButtons.forEach(

  (button) => {



    button.addEventListener(

      "click",

      () => {



        showView(

          button.dataset.view

        );



      }

    );



  }

);





/* =========================================================

   EVENTOS - MESES

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

   EVENTOS - INGRESOS

========================================================= */



openIncomeModalButton.addEventListener(

  "click",

  prepareNewIncome

);



openIncomeModalFromView.addEventListener(

  "click",

  prepareNewIncome

);



incomeForm.addEventListener(

  "submit",

  saveIncome

);





/* =========================================================

   EVENTOS - GASTOS

========================================================= */



openExpenseModalButton.addEventListener(

  "click",

  prepareNewExpense

);



openExpenseModalFromView.addEventListener(

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

if (applyRecurringExpensesButton) {
  applyRecurringExpensesButton.addEventListener("click", applyRecurringExpenses);
}

if (applyPendingRecurringButton) {
  applyPendingRecurringButton.addEventListener("click", applyRecurringExpenses);
}

if (recurringExpensesList) {
  recurringExpensesList.addEventListener("click", handleRecurringListClick);
  recurringExpensesList.addEventListener("change", handleRecurringListChange);
}





/* =========================================================

   EVENTOS - DEUDAS

========================================================= */



openDebtModalButton.addEventListener(

  "click",

  prepareNewDebt

);



debtForm.addEventListener(

  "submit",

  saveDebt

);





/* =========================================================

   EVENTOS - MES

========================================================= */



/* =========================================================
   EVENTOS - METAS
========================================================= */

if (openGoalModalButton) {
  openGoalModalButton.addEventListener("click", prepareNewGoal);
}

if (goalForm) {
  goalForm.addEventListener("submit", saveGoal);
}

startEmptyMonthButton.addEventListener(

  "click",

  startEmptyMonth

);

if (applyRecurringFromActionsButton) {
  applyRecurringFromActionsButton.addEventListener("click", applyRecurringExpenses);
}

if (startMonthFromZeroButton) {
  startMonthFromZeroButton.addEventListener("click", () => {
    const monthData = getCurrentMonthData();
    const hasData =
      monthData.incomes.length > 0 ||
      monthData.expenses.length > 0;

    if (hasData) {
      showToast("Este mes ya tiene movimientos. No se modificó nada.");
      return;
    }

    monthData.initialized = true;
    saveDatabase();
    renderApp();
    showToast("Mes preparado desde cero.");
  });
}




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

   EVENTOS - FILTROS

========================================================= */



document

  .querySelectorAll(".filter-button")

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

   EVENTOS - EDITAR / ELIMINAR

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



      return;

    }





    const editDebtButton =

      event.target.closest(

        "[data-edit-debt]"

      );



    if (editDebtButton) {



      editDebt(

        editDebtButton.dataset.editDebt

      );



      return;

    }





    const deleteDebtButton =

      event.target.closest(

        "[data-delete-debt]"

      );



    if (deleteDebtButton) {



      deleteDebt(

        deleteDebtButton.dataset.deleteDebt

      );



    }

    const historyMonthButton = event.target.closest("[data-history-month]");
    if (historyMonthButton) {
      openHistoryMonth(historyMonthButton.dataset.historyMonth);
      return;
    }

    const editGoalButton = event.target.closest("[data-edit-goal]");
    if (editGoalButton) {
      editGoal(editGoalButton.dataset.editGoal);
      return;
    }

    const deleteGoalButton = event.target.closest("[data-delete-goal]");
    if (deleteGoalButton) {
      deleteGoal(deleteGoalButton.dataset.deleteGoal);
    }




  }

);





/* =========================================================

   CERRAR MODALES

========================================================= */



document

  .querySelectorAll("[data-close-modal]")

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



setupCurrencyInputs();
updateFilterButtons();



showView(currentView);