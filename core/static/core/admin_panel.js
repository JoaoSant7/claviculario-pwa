const state = {
	apiBase: localStorage.getItem("apiBase") || window.location.origin,
	token: localStorage.getItem("accessToken") || "",
	username: localStorage.getItem("username") || "",
	currentPage: "dashboard",
	currentResource: null,
	cache: {},
	ws: null,
};

const navItems = [
	{ id: "dashboard", label: "Dashboard", icon: "DB" },
	{ id: "usuarios", label: "Usuarios", icon: "US", resource: "usuarios" },
	{ id: "turmas", label: "Turmas", icon: "TU", resource: "turmas" },
	{ id: "salas", label: "Salas", icon: "SA", resource: "salas" },
	{ id: "chaves", label: "Chaves", icon: "CH", resource: "chaves" },
	{ id: "autorizacoes", label: "Autorizacoes", icon: "AU", resource: "autorizacoes" },
	{ id: "timetable", label: "Timetable", icon: "TT", resource: "timetable" },
	{ id: "eventos", label: "Eventos", icon: "EV", resource: "eventos" },
	{ id: "emprestimos", label: "Emprestimos", icon: "EM", resource: "emprestimos" },
	{ id: "operations", label: "Operacoes", icon: "OP" },
	{ id: "reports", label: "Relatorios", icon: "RE" },
	{ id: "hardware", label: "Hardware", icon: "HW" },
	{ id: "settings", label: "Configuracoes", icon: "CF" },
];

const resources = {
	usuarios: {
		title: "Usuarios",
		endpoint: "/api/usuarios/",
		idField: "id",
		canCreate: true,
		canEdit: true,
		canDelete: true,
		search: true,
		columns: ["username", "nome", "sobrenome", "matricula", "email", "papel", "ativo"],
		fields: [
			{ name: "username", label: "Username", required: true },
			{ name: "password", label: "Senha", type: "password", hideOnEdit: true },
			{ name: "nome", label: "Nome", required: true },
			{ name: "sobrenome", label: "Sobrenome", required: true },
			{ name: "matricula", label: "Matricula", required: true },
			{ name: "email", label: "Email", type: "email", required: true },
			{ name: "rfid_tag", label: "RFID", hideOnEdit: true },
			{ name: "papel", label: "Papel", type: "select", options: [
				["professor", "Professor"],
				["aluno", "Aluno"],
				["porteiro", "Porteiro"],
				["coordenacao", "Coordenacao"],
				["funcionario", "Funcionario"],
			], required: true },
			{ name: "ativo", label: "Ativo", type: "checkbox", default: true },
		],
	},
	turmas: {
		title: "Turmas",
		endpoint: "/api/turmas/",
		canCreate: true,
		canEdit: true,
		canDelete: true,
		search: true,
		columns: ["codigo", "descricao", "ativa"],
		fields: [
			{ name: "codigo", label: "Codigo", required: true },
			{ name: "descricao", label: "Descricao" },
			{ name: "ativa", label: "Ativa", type: "checkbox", default: true },
		],
	},
	salas: {
		title: "Salas",
		endpoint: "/api/salas/",
		canCreate: true,
		canEdit: true,
		canDelete: true,
		search: true,
		columns: ["codigo", "andar", "numero", "tipo_sala", "descricao"],
		fields: [
			{ name: "codigo", label: "Codigo", required: true },
			{ name: "andar", label: "Andar", type: "number", required: true },
			{ name: "numero", label: "Numero", required: true },
			{ name: "descricao", label: "Descricao" },
			{ name: "tipo_sala", label: "Tipo", type: "select", options: [
				["LAB", "Laboratorio"],
				["SALA", "Sala de Aula"],
				["COZINHA", "Cozinha"],
				["AUDITORIO", "Auditorio"],
			], required: true },
		],
	},
	chaves: {
		title: "Chaves",
		endpoint: "/api/chaves/",
		canCreate: true,
		canEdit: true,
		canDelete: true,
		search: true,
		columns: ["numero", "sala", "status", "slot_x", "slot_y", "slot_ocupado"],
		fields: [
			{ name: "sala", label: "Sala", type: "select", source: "salas", required: true },
			{ name: "numero", label: "Numero", required: true },
			{ name: "rfid_tag", label: "RFID", hideOnEdit: true },
			{ name: "slot_x", label: "Slot X", type: "number", required: true },
			{ name: "slot_y", label: "Slot Y", type: "number", required: true },
			{ name: "slot_ocupado", label: "Slot ocupado", type: "checkbox", default: true },
			{ name: "descricao", label: "Descricao" },
			{ name: "status", label: "Status", type: "select", options: [
				["disponivel", "Disponivel"],
				["emprestada", "Emprestada"],
				["em_transito", "Em transito"],
				["manutencao", "Manutencao"],
			], required: true },
		],
	},
	autorizacoes: {
		title: "Autorizacoes",
		endpoint: "/api/autorizacoes/",
		canCreate: true,
		canEdit: true,
		canDelete: true,
		search: true,
		columns: ["usuario", "sala", "concedida_por", "ativa", "valida_de", "valida_ate"],
		fields: [
			{ name: "usuario", label: "Usuario autorizado", type: "select", source: "usuarios", required: true },
			{ name: "sala", label: "Sala", type: "select", source: "salas", empty: "Qualquer sala" },
			{ name: "concedida_por", label: "Concedida por", type: "select", source: "usuarios", required: true },
			{ name: "valida_de", label: "Valida de", type: "datetime-local", required: true },
			{ name: "valida_ate", label: "Valida ate", type: "datetime-local" },
			{ name: "ativa", label: "Ativa", type: "checkbox", default: true },
			{ name: "motivo", label: "Motivo", type: "textarea" },
		],
		extraActions: [{ label: "Revogar", action: "revogar" }],
	},
	timetable: {
		title: "Timetable",
		endpoint: "/api/timetable/",
		canCreate: true,
		canEdit: true,
		canDelete: true,
		columns: ["professor", "sala", "dia_semana", "hora_inicio", "hora_fim", "vigencia_inicio", "vigencia_fim"],
		fields: [
			{ name: "professor", label: "Professor", type: "select", source: "usuarios", required: true },
			{ name: "sala", label: "Sala", type: "select", source: "salas", required: true },
			{ name: "dia_semana", label: "Dia da semana", type: "select", options: [
				[0, "Segunda"],
				[1, "Terca"],
				[2, "Quarta"],
				[3, "Quinta"],
				[4, "Sexta"],
				[5, "Sabado"],
				[6, "Domingo"],
			], required: true },
			{ name: "hora_inicio", label: "Hora inicio", type: "time", required: true },
			{ name: "hora_fim", label: "Hora fim", type: "time", required: true },
			{ name: "vigencia_inicio", label: "Vigencia inicio", type: "date", required: true },
			{ name: "vigencia_fim", label: "Vigencia fim", type: "date" },
		],
	},
	eventos: {
		title: "Eventos",
		endpoint: "/api/eventos/",
		canCreate: false,
		canEdit: false,
		canDelete: false,
		columns: ["tipo", "usuario", "chave", "sala", "timestamp", "detalhes"],
		fields: [],
	},
	emprestimos: {
		title: "Emprestimos",
		endpoint: "/api/emprestimos/",
		canCreate: false,
		canEdit: false,
		canDelete: false,
		columns: ["usuario", "chave", "retirado_em", "devolvido_em", "limite_devolucao", "atraso_registrado"],
		fields: [],
	},
};

function qs(selector) {
	return document.querySelector(selector);
}

function setLoading(button, loading) {
	if (!button) return;
	button.disabled = loading;
	button.dataset.originalText = button.dataset.originalText || button.textContent;
	button.textContent = loading ? "Carregando..." : button.dataset.originalText;
}

function toast(title, message, type = "success") {
	const item = document.createElement("div");
	item.className = `toast ${type}`;
	item.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span>`;
	qs("#toastHost").appendChild(item);
	setTimeout(() => item.remove(), 4200);
}

function escapeHtml(value) {
	return String(value ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

function formatValue(value, column = "") {
	if (value === null || value === undefined || value === "") return "-";
	if (typeof value === "boolean") return value ? `<span class="badge green">Sim</span>` : `<span class="badge red">Nao</span>`;
	if (typeof value === "object") return `<code>${escapeHtml(JSON.stringify(value))}</code>`;
	if (column.includes("status")) {
		const className = value === "disponivel" ? "green" : value === "emprestada" ? "amber" : "";
		return `<span class="badge ${className}">${escapeHtml(value)}</span>`;
	}
	return escapeHtml(value);
}

function normalizeList(data) {
	if (Array.isArray(data)) return data;
	if (data && Array.isArray(data.results)) return data.results;
	return [];
}

function buildUrl(path) {
	if (path.startsWith("http")) return path;
	return `${state.apiBase.replace(/\/$/, "")}${path}`;
}

async function api(path, options = {}) {
	const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
	if (state.token) headers.Authorization = `Bearer ${state.token}`;
	const response = await fetch(buildUrl(path), { ...options, headers });
	const text = await response.text();
	let data = text;
	try {
		data = text ? JSON.parse(text) : null;
	} catch (error) {
		data = text;
	}
	if (!response.ok) {
		const detail = data?.detail || data?.erro || data?.mensagem || JSON.stringify(data);
		throw new Error(detail || `Erro HTTP ${response.status}`);
	}
	return data;
}

async function loadResource(name, force = false) {
	if (!force && state.cache[name]) return state.cache[name];
	const data = normalizeList(await api(resources[name].endpoint));
	state.cache[name] = data;
	return data;
}

function getLabel(resourceName, id) {
	const item = state.cache[resourceName]?.find((row) => row.id === id);
	if (!item) return id || "-";
	return item.codigo || item.username || item.nome || item.numero || item.id;
}

function showApp() {
	qs("#loginView").classList.add("hidden");
	qs("#appView").classList.remove("hidden");
	qs("#currentUser").textContent = state.username || "Usuario";
	qs("#userInitial").textContent = (state.username || "U").slice(0, 1).toUpperCase();
	qs("#apiBaseLabel").textContent = state.apiBase;
	renderNav();
	openPage(state.currentPage);
}

function showLogin() {
	qs("#loginView").classList.remove("hidden");
	qs("#appView").classList.add("hidden");
	qs("#loginApiBase").value = state.apiBase;
	qs("#loginUsername").value = state.username;
}

function renderNav() {
	qs("#navMenu").innerHTML = navItems.map((item) => `
		<button class="nav-btn ${state.currentPage === item.id ? "active" : ""}" data-page="${item.id}">
			<span class="badge">${item.icon}</span>
			${item.label}
		</button>
	`).join("");
	document.querySelectorAll(".nav-btn").forEach((button) => {
		button.addEventListener("click", () => openPage(button.dataset.page));
	});
}

function setSection(title, eyebrow = "Claviculario") {
	qs("#sectionTitle").textContent = title;
	qs("#sectionEyebrow").textContent = eyebrow;
}

function hidePages() {
	document.querySelectorAll(".page").forEach((page) => page.classList.add("hidden"));
}

async function openPage(pageId) {
	state.currentPage = pageId;
	renderNav();
	hidePages();
	const nav = navItems.find((item) => item.id === pageId);
	if (nav?.resource) {
		state.currentResource = nav.resource;
		qs("#resourcePage").classList.remove("hidden");
		setSection(resources[nav.resource].title, "Cadastros e dados");
		await renderResource(nav.resource);
		return;
	}
	if (pageId === "dashboard") return renderDashboard();
	if (pageId === "operations") return renderOperations();
	if (pageId === "reports") return renderReports();
	if (pageId === "hardware") return renderHardware();
	if (pageId === "settings") return renderSettings();
}

async function renderDashboard() {
	hidePages();
	qs("#dashboardPage").classList.remove("hidden");
	setSection("Visao geral", "Dashboard");
	const container = qs("#dashboardPage");
	container.innerHTML = `<div class="empty-state">Carregando dashboard...</div>`;
	try {
		const [statusChaves, eventos, emprestadas, atrasadas] = await Promise.all([
			api("/api/relatorios/status-chaves/"),
			api("/api/relatorios/eventos-recentes/?limite=8"),
			api("/api/relatorios/chaves-emprestadas/"),
			api("/api/relatorios/chaves-em-atraso/"),
		]);
		const disponiveis = statusChaves.filter((item) => item.status === "disponivel").length;
		container.innerHTML = `
			<div class="card-grid">
				${summaryCard("Chaves", statusChaves.length)}
				${summaryCard("Disponiveis", disponiveis)}
				${summaryCard("Emprestadas", emprestadas.length)}
				${summaryCard("Em atraso", atrasadas.length)}
			</div>
			<div class="dashboard-grid">
				<div class="panel-card">
					<div class="section-head"><h2>Status das chaves</h2><button class="secondary-btn" data-refresh-dashboard>Atualizar</button></div>
					${simpleTable(statusChaves, ["sala", "numero", "status", "slot_ocupado"])}
				</div>
				<div class="panel-card">
					<div class="section-head"><h2>Eventos recentes</h2></div>
					${simpleTable(eventos, ["tipo", "timestamp", "detalhes"])}
				</div>
			</div>
		`;
		qs("[data-refresh-dashboard]")?.addEventListener("click", renderDashboard);
	} catch (error) {
		container.innerHTML = `<div class="empty-state">Nao foi possivel carregar o dashboard: ${escapeHtml(error.message)}</div>`;
	}
}

function summaryCard(label, value) {
	return `<div class="summary-card"><span>${escapeHtml(label)}</span><strong>${value}</strong></div>`;
}

function simpleTable(rows, columns) {
	if (!rows?.length) return `<div class="empty-state">Nenhum registro encontrado.</div>`;
	return `
		<div class="table-wrap">
			<table>
				<thead><tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
				<tbody>
					${rows.map((row) => `<tr>${columns.map((column) => `<td>${formatValue(row[column], column)}</td>`).join("")}</tr>`).join("")}
				</tbody>
			</table>
		</div>
	`;
}

async function renderResource(name) {
	const config = resources[name];
	const container = qs("#resourcePage");
	container.innerHTML = `<div class="empty-state">Carregando ${escapeHtml(config.title)}...</div>`;
	try {
		await preloadSources(config);
		const rows = await loadResource(name, true);
		container.innerHTML = `
			<div class="table-card">
				<div class="section-head">
					<div>
						<h2>${escapeHtml(config.title)}</h2>
						<p class="muted">${rows.length} registro(s) encontrado(s)</p>
					</div>
					<div class="actions">
						<button class="secondary-btn" data-refresh>Atualizar</button>
						${config.canCreate ? `<button class="primary-btn" data-create>Novo registro</button>` : `<span class="badge amber">Somente leitura</span>`}
					</div>
				</div>
				<div class="toolbar">
					${config.search ? `<input data-search placeholder="Buscar nesta tabela...">` : ""}
				</div>
				<div id="resourceTable"></div>
			</div>
		`;
		const draw = () => {
			const term = qs("[data-search]")?.value?.toLowerCase() || "";
			const filtered = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(term));
			qs("#resourceTable").innerHTML = renderTable(name, filtered);
			bindRowActions(name);
		};
		qs("[data-refresh]")?.addEventListener("click", () => renderResource(name));
		qs("[data-create]")?.addEventListener("click", () => openForm(name));
		qs("[data-search]")?.addEventListener("input", draw);
		draw();
	} catch (error) {
		container.innerHTML = `<div class="empty-state">Erro ao carregar ${escapeHtml(config.title)}: ${escapeHtml(error.message)}</div>`;
	}
}

function renderTable(name, rows) {
	const config = resources[name];
	if (!rows.length) return `<div class="empty-state">Nenhum registro encontrado.</div>`;
	return `
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						${config.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}
						<th>Acoes</th>
					</tr>
				</thead>
				<tbody>
					${rows.map((row) => `
						<tr>
							${config.columns.map((column) => `<td>${formatRelatedValue(column, row[column])}</td>`).join("")}
							<td>
								<div class="row-actions">
									<button class="mini-btn" data-view="${row.id}">Ver</button>
									${config.canEdit ? `<button class="mini-btn" data-edit="${row.id}">Editar</button>` : ""}
									${config.canDelete ? `<button class="mini-btn danger" data-delete="${row.id}">Excluir</button>` : ""}
									${(config.extraActions || []).map((action) => `<button class="mini-btn" data-extra="${action.action}" data-id="${row.id}">${action.label}</button>`).join("")}
								</div>
							</td>
						</tr>
					`).join("")}
				</tbody>
			</table>
		</div>
	`;
}

function formatRelatedValue(column, value) {
	if (["sala"].includes(column)) return escapeHtml(getLabel("salas", value));
	if (["usuario", "professor", "concedida_por"].includes(column)) return escapeHtml(getLabel("usuarios", value));
	if (["chave"].includes(column)) return escapeHtml(getLabel("chaves", value));
	return formatValue(value, column);
}

function bindRowActions(name) {
	document.querySelectorAll("[data-view]").forEach((button) => {
		button.addEventListener("click", () => viewRecord(name, button.dataset.view));
	});
	document.querySelectorAll("[data-edit]").forEach((button) => {
		button.addEventListener("click", () => {
			const record = state.cache[name].find((row) => row.id === button.dataset.edit);
			openForm(name, record);
		});
	});
	document.querySelectorAll("[data-delete]").forEach((button) => {
		button.addEventListener("click", () => deleteRecord(name, button.dataset.delete));
	});
	document.querySelectorAll("[data-extra='revogar']").forEach((button) => {
		button.addEventListener("click", () => revokeAuthorization(button.dataset.id));
	});
}

async function preloadSources(config) {
	const sources = [...new Set((config.fields || []).map((field) => field.source).filter(Boolean))];
	await Promise.all(sources.map((source) => loadResource(source)));
	if (config.columns?.some((column) => ["sala", "usuario", "professor", "concedida_por", "chave"].includes(column))) {
		await Promise.allSettled(["salas", "usuarios", "chaves"].map((source) => loadResource(source)));
	}
}

function viewRecord(name, id) {
	const record = state.cache[name].find((row) => row.id === id);
	openModal(`Detalhes de ${resources[name].title}`, "Visualizacao", `
		<pre class="json-box">${escapeHtml(JSON.stringify(record, null, 2))}</pre>
		<div class="modal-actions"><button class="secondary-btn" type="button" data-close-modal>Fechar</button></div>
	`);
}

function openModal(title, eyebrow, body) {
	qs("#modalTitle").textContent = title;
	qs("#modalEyebrow").textContent = eyebrow;
	qs("#modalForm").innerHTML = body;
	qs("#modal").classList.remove("hidden");
	qs("[data-close-modal]")?.addEventListener("click", closeModal);
}

function closeModal() {
	qs("#modal").classList.add("hidden");
	qs("#modalForm").innerHTML = "";
}

async function openForm(name, record = null) {
	const config = resources[name];
	await preloadSources(config);
	const fields = config.fields.filter((field) => !(record && field.hideOnEdit));
	const html = `
		<div class="form-row">
			${fields.map((field) => renderField(field, record?.[field.name])).join("")}
		</div>
		<div class="modal-actions">
			<button class="ghost-btn" type="button" data-close-modal>Cancelar</button>
			<button class="primary-btn" type="submit">${record ? "Salvar alteracoes" : "Criar registro"}</button>
		</div>
	`;
	openModal(record ? `Editar ${config.title}` : `Novo ${config.title}`, config.endpoint, html);
	qs("#modalForm").onsubmit = async (event) => {
		event.preventDefault();
		const submit = event.submitter;
		setLoading(submit, true);
		try {
			const payload = collectFormPayload(fields);
			const path = record ? `${config.endpoint}${record.id}/` : config.endpoint;
			await api(path, { method: record ? "PATCH" : "POST", body: JSON.stringify(payload) });
			toast("Sucesso", "Registro salvo.");
			closeModal();
			await renderResource(name);
		} catch (error) {
			toast("Erro ao salvar", error.message, "error");
		} finally {
			setLoading(submit, false);
		}
	};
}

function renderField(field, value) {
	const id = `field_${field.name}`;
	const required = field.required ? "required" : "";
	if (field.type === "checkbox") {
		const checked = (value ?? field.default) ? "checked" : "";
		return `<label><span>${field.label}</span><select id="${id}" data-field="${field.name}" data-type="checkbox"><option value="true" ${checked ? "selected" : ""}>Sim</option><option value="false" ${!checked ? "selected" : ""}>Nao</option></select></label>`;
	}
	if (field.type === "select") {
		const options = field.source ? sourceOptions(field, value) : staticOptions(field, value);
		return `<label><span>${field.label}</span><select id="${id}" data-field="${field.name}" data-type="select" ${required}>${options}</select></label>`;
	}
	if (field.type === "textarea") {
		return `<label><span>${field.label}</span><textarea id="${id}" data-field="${field.name}" ${required}>${escapeHtml(value || "")}</textarea></label>`;
	}
	const type = field.type || "text";
	const prepared = prepareInputValue(type, value);
	return `<label><span>${field.label}</span><input id="${id}" data-field="${field.name}" type="${type}" value="${escapeHtml(prepared)}" ${required}></label>`;
}

function staticOptions(field, value) {
	return field.options.map(([key, label]) => `<option value="${key}" ${String(value) === String(key) ? "selected" : ""}>${label}</option>`).join("");
}

function sourceOptions(field, value) {
	const rows = state.cache[field.source] || [];
	const empty = field.empty ? `<option value="">${field.empty}</option>` : "";
	return empty + rows.map((row) => {
		const label = row.codigo || row.username || `${row.nome || ""} ${row.sobrenome || ""}`.trim() || row.numero || row.id;
		return `<option value="${row.id}" ${String(value || "") === String(row.id) ? "selected" : ""}>${escapeHtml(label)}</option>`;
	}).join("");
}

function prepareInputValue(type, value) {
	if (!value) return "";
	if (type === "datetime-local") return String(value).slice(0, 16);
	return value;
}

function collectFormPayload(fields) {
	const payload = {};
	fields.forEach((field) => {
		const input = qs(`[data-field="${field.name}"]`);
		if (!input) return;
		let value = input.value;
		if (value === "" && !field.required) return;
		if (field.type === "number") value = Number(value);
		if (field.type === "checkbox") value = value === "true";
		payload[field.name] = value;
	});
	return payload;
}

async function deleteRecord(name, id) {
	if (!confirm("Tem certeza que deseja excluir este registro?")) return;
	try {
		await api(`${resources[name].endpoint}${id}/`, { method: "DELETE" });
		toast("Excluido", "Registro removido.");
		await renderResource(name);
	} catch (error) {
		toast("Erro ao excluir", error.message, "error");
	}
}

async function revokeAuthorization(id) {
	try {
		await api(`/api/autorizacoes/${id}/revogar/`, { method: "POST", body: "{}" });
		toast("Autorizacao revogada", "A autorizacao foi desativada.");
		await renderResource("autorizacoes");
	} catch (error) {
		toast("Erro ao revogar", error.message, "error");
	}
}

function renderOperations() {
	hidePages();
	qs("#operationsPage").classList.remove("hidden");
	setSection("Operacoes", "Fluxos do claviculario");
	qs("#operationsPage").innerHTML = `
		<div class="dashboard-grid">
			${operationCard("Retirada de chave", "Validar usuario e liberar chave.", [
				["codigo_sala", "Codigo da sala", "301A"],
				["rfid_usuario", "RFID usuario opcional", ""],
				["usuario_id", "Usuario ID opcional", ""],
				["chave_id", "Chave ID opcional", ""],
			], "/api/operacoes/retirada/")}
			${operationCard("Devolucao", "Encerrar emprestimo ativo.", [
				["rfid_chave", "RFID chave opcional", ""],
				["chave_id", "Chave ID opcional", ""],
			], "/api/operacoes/devolucao/")}
			${operationCard("Panico", "Registrar alerta de panico.", [
				["codigo_sala", "Codigo da sala", "301A"],
				["origem", "Origem", "painel"],
			], "/api/operacoes/panico/")}
			<div class="panel-card">
				<div class="section-head"><h2>WebSocket</h2></div>
				<p class="muted">Conecta em <code>/ws/eventos/</code> para receber eventos em tempo real.</p>
				<div class="actions">
					<button class="primary-btn" data-ws-connect>Conectar</button>
					<button class="secondary-btn" data-ws-disconnect>Desconectar</button>
				</div>
				<pre id="wsOutput" class="json-box">Nenhum evento recebido.</pre>
			</div>
		</div>
	`;
	document.querySelectorAll("[data-operation]").forEach((form) => {
		form.addEventListener("submit", submitOperation);
	});
	qs("[data-ws-connect]").addEventListener("click", connectWebSocket);
	qs("[data-ws-disconnect]").addEventListener("click", disconnectWebSocket);
}

function operationCard(title, description, fields, endpoint) {
	return `
		<div class="panel-card">
			<div class="section-head"><h2>${title}</h2></div>
			<p class="muted">${description}</p>
			<form data-operation="${endpoint}" class="form-grid">
				${fields.map(([name, label, value]) => `<label><span>${label}</span><input name="${name}" value="${value}"></label>`).join("")}
				<button class="primary-btn" type="submit">Executar</button>
			</form>
		</div>
	`;
}

async function submitOperation(event) {
	event.preventDefault();
	const form = event.currentTarget;
	const submit = event.submitter;
	const payload = {};
	new FormData(form).forEach((value, key) => {
		if (value !== "") payload[key] = value;
	});
	setLoading(submit, true);
	try {
		const data = await api(form.dataset.operation, { method: "POST", body: JSON.stringify(payload) });
		toast("Operacao executada", "O backend respondeu com sucesso.");
		openModal("Resposta da operacao", form.dataset.operation, `<pre class="json-box">${escapeHtml(JSON.stringify(data, null, 2))}</pre><div class="modal-actions"><button class="secondary-btn" type="button" data-close-modal>Fechar</button></div>`);
	} catch (error) {
		toast("Erro na operacao", error.message, "error");
	} finally {
		setLoading(submit, false);
	}
}

function renderReports() {
	hidePages();
	qs("#reportsPage").classList.remove("hidden");
	setSection("Relatorios", "Consultas do backend");
	const reports = [
		["Status das chaves", "/api/relatorios/status-chaves/"],
		["Eventos recentes", "/api/relatorios/eventos-recentes/"],
		["Chaves emprestadas", "/api/relatorios/chaves-emprestadas/"],
		["Chaves em atraso", "/api/relatorios/chaves-em-atraso/"],
		["Uso por sala", "/api/relatorios/uso-por-sala/"],
		["Retiradas por periodo", "/api/relatorios/retiradas/"],
	];
	qs("#reportsPage").innerHTML = `
		<div class="panel-card">
			<div class="section-head"><h2>Relatorios disponiveis</h2></div>
			<div class="toolbar">
				${reports.map(([label, path]) => `<button class="secondary-btn" data-report="${path}">${label}</button>`).join("")}
			</div>
			<pre id="reportOutput" class="json-box">Escolha um relatorio.</pre>
		</div>
	`;
	document.querySelectorAll("[data-report]").forEach((button) => {
		button.addEventListener("click", async () => {
			setLoading(button, true);
			try {
				const data = await api(button.dataset.report);
				qs("#reportOutput").textContent = JSON.stringify(data, null, 2);
			} catch (error) {
				toast("Erro no relatorio", error.message, "error");
			} finally {
				setLoading(button, false);
			}
		});
	});
}

function renderHardware() {
	hidePages();
	qs("#hardwarePage").classList.remove("hidden");
	setSection("Hardware", "Endpoints tecnicos");
	qs("#hardwarePage").innerHTML = `
		<div class="dashboard-grid">
			<div class="panel-card">
				<div class="section-head"><h2>Token interno</h2></div>
				<label><span>X-HARDWARE-TOKEN</span><input id="hardwareToken" value="${escapeHtml(localStorage.getItem("hardwareToken") || "")}"></label>
				<button class="secondary-btn" data-save-hardware-token>Salvar token</button>
			</div>
			${hardwareCard("RFID usuario", "/api/hardware/rfid-usuario/", [["rfid_usuario", "RFID usuario", ""], ["codigo_sala", "Codigo sala", "301A"]])}
			${hardwareCard("RFID chave", "/api/hardware/rfid-chave/", [["rfid_chave", "RFID chave", ""]])}
			${hardwareCard("Panico hardware", "/api/hardware/panico/", [["codigo_sala", "Codigo sala", "301A"], ["origem", "Origem", "hardware"]])}
			${hardwareCard("Status slot", "/api/hardware/status-slot/", [["slot_x", "Slot X", "1"], ["slot_y", "Slot Y", "1"], ["ocupado", "Ocupado true/false", "true"]])}
		</div>
	`;
	qs("[data-save-hardware-token]").addEventListener("click", () => {
		localStorage.setItem("hardwareToken", qs("#hardwareToken").value);
		toast("Token salvo", "Token de hardware salvo no navegador.");
	});
	document.querySelectorAll("[data-hardware]").forEach((form) => form.addEventListener("submit", submitHardware));
}

function hardwareCard(title, endpoint, fields) {
	return `
		<div class="panel-card">
			<div class="section-head"><h2>${title}</h2></div>
			<form data-hardware="${endpoint}" class="form-grid">
				${fields.map(([name, label, value]) => `<label><span>${label}</span><input name="${name}" value="${value}"></label>`).join("")}
				<button class="primary-btn" type="submit">Enviar</button>
			</form>
		</div>
	`;
}

async function submitHardware(event) {
	event.preventDefault();
	const form = event.currentTarget;
	const submit = event.submitter;
	const payload = {};
	new FormData(form).forEach((value, key) => {
		if (value === "true") payload[key] = true;
		else if (value === "false") payload[key] = false;
		else if (["slot_x", "slot_y"].includes(key)) payload[key] = Number(value);
		else payload[key] = value;
	});
	setLoading(submit, true);
	try {
		const data = await api(form.dataset.hardware, {
			method: "POST",
			headers: { "X-HARDWARE-TOKEN": localStorage.getItem("hardwareToken") || "" },
			body: JSON.stringify(payload),
		});
		openModal("Resposta do hardware", form.dataset.hardware, `<pre class="json-box">${escapeHtml(JSON.stringify(data, null, 2))}</pre><div class="modal-actions"><button class="secondary-btn" type="button" data-close-modal>Fechar</button></div>`);
	} catch (error) {
		toast("Erro no hardware", error.message, "error");
	} finally {
		setLoading(submit, false);
	}
}

function renderSettings() {
	hidePages();
	qs("#settingsPage").classList.remove("hidden");
	setSection("Configuracoes", "Ambiente de API");
	qs("#settingsPage").innerHTML = `
		<div class="panel-card">
			<div class="section-head"><h2>API</h2></div>
			<form id="settingsForm" class="form-grid">
				<label><span>Base URL</span><input name="apiBase" value="${escapeHtml(state.apiBase)}"></label>
				<div class="modal-actions">
					<button class="primary-btn" type="submit">Salvar configuracao</button>
				</div>
			</form>
			<div class="not-implemented">
				<strong>Preparado, mas sem endpoint especifico:</strong>
				<p>Configuracoes persistentes no servidor nao existem no backend. Esta tela salva a URL apenas no navegador via localStorage.</p>
			</div>
		</div>
	`;
	qs("#settingsForm").addEventListener("submit", (event) => {
		event.preventDefault();
		state.apiBase = new FormData(event.currentTarget).get("apiBase").replace(/\/$/, "");
		localStorage.setItem("apiBase", state.apiBase);
		qs("#apiBaseLabel").textContent = state.apiBase;
		toast("Configuracao salva", "Base URL atualizada.");
	});
}

function connectWebSocket() {
	disconnectWebSocket();
	const wsBase = state.apiBase.replace(/^http/, "ws").replace(/\/$/, "");
	state.ws = new WebSocket(`${wsBase}/ws/eventos/`);
	state.ws.onopen = () => {
		qs("#connectionStatus").textContent = "WebSocket online";
		qs("#connectionStatus").classList.add("online-pill");
		toast("WebSocket conectado", "Eventos em tempo real ativados.");
	};
	state.ws.onclose = () => {
		qs("#connectionStatus").textContent = "WebSocket offline";
		qs("#connectionStatus").classList.remove("online-pill");
	};
	state.ws.onerror = () => toast("WebSocket", "Erro na conexao em tempo real.", "error");
	state.ws.onmessage = (event) => {
		const payload = JSON.parse(event.data);
		const target = qs("#wsOutput");
		if (target) target.textContent = JSON.stringify(payload, null, 2);
		toast("Evento recebido", payload.tipo || "Novo evento");
	};
}

function disconnectWebSocket() {
	if (state.ws) {
		state.ws.close();
		state.ws = null;
	}
}

qs("#loginForm").addEventListener("submit", async (event) => {
	event.preventDefault();
	const submit = event.submitter;
	setLoading(submit, true);
	state.apiBase = qs("#loginApiBase").value.replace(/\/$/, "");
	try {
		const data = await api("/api/auth/token/", {
			method: "POST",
			body: JSON.stringify({
				username: qs("#loginUsername").value,
				password: qs("#loginPassword").value,
			}),
		});
		state.token = data.access;
		state.username = qs("#loginUsername").value;
		localStorage.setItem("accessToken", state.token);
		localStorage.setItem("refreshToken", data.refresh);
		localStorage.setItem("username", state.username);
		localStorage.setItem("apiBase", state.apiBase);
		toast("Login realizado", "Token JWT salvo.");
		showApp();
	} catch (error) {
		toast("Falha no login", error.message, "error");
	} finally {
		setLoading(submit, false);
	}
});

qs("#logoutBtn").addEventListener("click", () => {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
	state.token = "";
	disconnectWebSocket();
	showLogin();
});

qs("#modalClose").addEventListener("click", closeModal);
qs("#modal").addEventListener("click", (event) => {
	if (event.target.id === "modal") closeModal();
});

if (state.token) showApp();
else showLogin();
