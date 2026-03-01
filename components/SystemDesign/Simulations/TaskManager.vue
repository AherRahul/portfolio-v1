<script setup lang="ts">
type Priority = 'High' | 'Medium' | 'Low'
type Status = 'todo' | 'inprogress' | 'done'

interface Assignee { name: string; color: string }
interface Task {
  id: string; title: string; priority: Priority
  due: string; assignee: Assignee; status: Status
}

const ASSIGNEES: Assignee[] = [
  { name: 'John',  color: 'bg-emerald-500' },
  { name: 'Sarah', color: 'bg-violet-500' },
  { name: 'Alex',  color: 'bg-amber-500' },
  { name: 'Maria', color: 'bg-rose-500' },
  { name: 'Dev',   color: 'bg-blue-500' },
]

function uid()  { return Math.random().toString(36).slice(2, 9) }
function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

function futureDay(d: number) {
  const dt = new Date(); dt.setDate(dt.getDate() + d)
  return dt.toISOString().split('T')[0]
}
function today() { return new Date().toISOString().split('T')[0] }

function relDay(iso: string) {
  const now = new Date(); now.setHours(0,0,0,0)
  const d   = new Date(iso); d.setHours(0,0,0,0)
  const diff = Math.round((d.getTime() - now.getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff < 0)   return 'Overdue'
  return `${diff}d left`
}
function isOverdue(iso: string) {
  const now = new Date(); now.setHours(0,0,0,0)
  return new Date(iso) < now
}

// ── Tasks ──────────────────────────────────────────────────────────────────────
const tasks = ref<Task[]>([
  { id: uid(), title: 'Write unit tests',           priority: 'Medium', due: futureDay(5),  assignee: ASSIGNEES[0], status: 'todo' },
  { id: uid(), title: 'Setup CI/CD pipeline',       priority: 'Low',    due: futureDay(9),  assignee: ASSIGNEES[2], status: 'todo' },
  { id: uid(), title: 'Implement authentication',   priority: 'High',   due: futureDay(1),  assignee: ASSIGNEES[1], status: 'inprogress' },
  { id: uid(), title: 'Design system architecture', priority: 'High',   due: futureDay(-2), assignee: ASSIGNEES[0], status: 'done' },
])

const logs = ref<string[]>([
  'TaskManager v2.0 initialized.',
  'Observer listeners registered: 3.',
  'Board ready: 2 todo · 1 in-progress · 1 done.',
])

// ── Add-task inline form ───────────────────────────────────────────────────────
const showAddForm  = ref(false)
const newTitle     = ref('')
const newPriority  = ref<Priority>('Medium')
const newDue       = ref(today())
const newAssignee  = ref<Assignee>(ASSIGNEES[0])
const addError     = ref('')

function openAdd()  { showAddForm.value = true; newTitle.value = ''; addError.value = '' }
function cancelAdd(){ showAddForm.value = false }

function confirmAdd() {
  if (!newTitle.value.trim()) { addError.value = 'Title required.'; return }
  const t: Task = { id: uid(), title: newTitle.value.trim(), priority: newPriority.value, due: newDue.value, assignee: newAssignee.value, status: 'todo' }
  tasks.value.push(t)
  logs.value.unshift(`TASK_CREATED: "${t.title}" [${t.priority}] → To Do`)
  showAddForm.value = false
}

// ── Drag & Drop ────────────────────────────────────────────────────────────────
const draggingId    = ref<string | null>(null)
const dragOverCol   = ref<Status | null>(null)

function onDragStart(id: string)  { draggingId.value = id }
function onDragOver(s: Status)    { dragOverCol.value = s }
function onDragLeave()            { dragOverCol.value = null }
function onDrop(s: Status) {
  const t = tasks.value.find(x => x.id === draggingId.value)
  if (t && t.status !== s) {
    const prev = t.status; t.status = s
    logs.value.unshift(`TASK_MOVE: "${t.title}" → ${colLabel(s)} (from ${colLabel(prev)})`)
  }
  draggingId.value = null; dragOverCol.value = null
}
function onDragEnd() { draggingId.value = null; dragOverCol.value = null }

function colTasks(s: Status) { return tasks.value.filter(t => t.status === s) }

// ── Delete ──────────────────────────────────────────────────────────────────────
function remove(id: string) {
  const t = tasks.value.find(x => x.id === id)
  if (!t) return
  tasks.value = tasks.value.filter(x => x.id !== id)
  logs.value.unshift(`TASK_DELETED: "${t.title}" removed`)
}

// ── Cycle status ───────────────────────────────────────────────────────────────
function cycle(task: Task) {
  const order: Status[] = ['todo','inprogress','done']
  task.status = order[(order.indexOf(task.status)+1)%3]
  logs.value.unshift(`TASK_UPDATE: "${task.title}" → ${colLabel(task.status)}`)
}

// ── Reset ──────────────────────────────────────────────────────────────────────
function reset() {
  tasks.value = []
  logs.value.unshift('BOARD_RESET: All tasks cleared.')
}

// ── Computed ───────────────────────────────────────────────────────────────────
const progressPct = computed(() =>
  tasks.value.length ? Math.round((tasks.value.filter(t => t.status==='done').length / tasks.value.length)*100) : 0
)

// ── Style helpers ──────────────────────────────────────────────────────────────
function colLabel(s: Status) {
  return s === 'todo' ? 'To Do' : s === 'inprogress' ? 'In Progress' : 'Done'
}
function colIcon(s: Status) {
  return s === 'todo' ? 'heroicons:queue-list' : s === 'inprogress' ? 'heroicons:clock' : 'heroicons:check-circle'
}
function colHeaderClass(s: Status) {
  return s === 'todo'
    ? 'bg-zinc-800/60 border-zinc-700'
    : s === 'inprogress'
      ? 'bg-amber-500/10 border-amber-500/30'
      : 'bg-emerald-500/10 border-emerald-500/30'
}
function colIconClass(s: Status) {
  return s === 'todo' ? 'text-zinc-400' : s === 'inprogress' ? 'text-amber-400' : 'text-emerald-400'
}
function colBadgeClass(s: Status) {
  return s === 'todo'
    ? 'bg-zinc-700 text-zinc-300'
    : s === 'inprogress'
      ? 'bg-amber-500/20 text-amber-400'
      : 'bg-emerald-500/20 text-emerald-400'
}
function colDropClass(s: Status) {
  return dragOverCol.value === s
    ? s === 'todo' ? 'ring-2 ring-zinc-500' : s === 'inprogress' ? 'ring-2 ring-amber-500/50' : 'ring-2 ring-emerald-500/50'
    : ''
}
function colBodyClass(s: Status) {
  return s === 'todo'
    ? 'bg-zinc-900/20'
    : s === 'inprogress'
      ? 'bg-amber-500/5'
      : 'bg-emerald-500/5'
}
function priorityClass(p: Priority) {
  return p === 'High'   ? 'text-red-400   bg-red-500/10   border-red-500/20'
       : p === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
       :                  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
}
function dueClass(iso: string, done: boolean) {
  if (done) return 'text-zinc-600 bg-zinc-800/40 border-zinc-700/30'
  return isOverdue(iso)
    ? 'text-red-400 bg-red-500/10 border-red-500/20'
    : 'text-zinc-400 bg-zinc-800/40 border-zinc-700/30'
}

const insights = [
  { title: 'Observer Pattern',  desc: 'State changes broadcast to all listeners in real-time.' },
  { title: 'State Machine',     desc: 'Tasks: Todo → In Progress → Done safely.' },
  { title: 'Command Pattern',   desc: 'Every mutation is a reversible command object.' },
]
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-zinc-950 min-h-[680px] rounded-2xl border border-white/5 overflow-hidden">

    <!-- ══════════════════ MAIN BOARD (2/3) ══════════════════ -->
    <div class="lg:col-span-2 flex flex-col border-r border-white/5 overflow-hidden">

      <!-- ── Top Bar ── -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0 gap-4 flex-wrap">
        <button
          @click="openAdd"
          class="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
        >
          <Icon name="heroicons:plus" class="text-sm" /> Add Task
        </button>

        <div class="flex items-center gap-3">
          <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Progress</span>
          <div class="w-28 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div class="h-full bg-emerald-500 rounded-full transition-all duration-500" :style="{ width: progressPct + '%' }" />
          </div>
          <span class="text-[10px] font-black text-white tabular-nums">{{ progressPct }}%</span>
          <button @click="reset" class="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-300 transition-colors" title="Reset">
            <Icon name="heroicons:arrow-path" class="text-sm" />
          </button>
        </div>
      </div>

      <!-- ── Inline Add-Task Form ── -->
      <Transition name="slide-down">
        <div v-if="showAddForm" class="px-6 py-4 bg-zinc-900/60 border-b border-white/5 space-y-3 shrink-0">
          <!-- Title -->
          <input
            v-model="newTitle"
            @keydown.enter="confirmAdd"
            @keydown.escape="cancelAdd"
            placeholder="Task title..."
            autofocus
            class="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
          />

          <!-- Row 2: priority + date + assignee + actions -->
          <div class="flex items-center gap-3 flex-wrap">
            <!-- Priority -->
            <select v-model="newPriority" class="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-[11px] font-black text-white outline-none focus:border-emerald-500/50 cursor-pointer">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <!-- Due date -->
            <input v-model="newDue" type="date" class="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-emerald-500/50 cursor-pointer" />

            <!-- Assignee -->
            <div class="flex items-center gap-1.5">
              <button
                v-for="a in ASSIGNEES" :key="a.name"
                @click="newAssignee = a"
                class="w-6 h-6 rounded-full flex items-center justify-center text-white font-black text-[8px] transition-all"
                :class="[a.color, newAssignee.name === a.name ? 'ring-2 ring-white scale-110' : 'opacity-40 hover:opacity-80']"
                :title="a.name"
              >{{ a.name[0] }}</button>
            </div>

            <div class="flex items-center gap-2 ml-auto">
              <button @click="confirmAdd" class="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
                <Icon name="heroicons:plus" class="text-xs" /> Add Task
              </button>
              <button @click="cancelAdd" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">Cancel</button>
            </div>
          </div>
          <p v-if="addError" class="text-[10px] text-red-400 font-bold">{{ addError }}</p>
        </div>
      </Transition>

      <!-- ── Kanban Columns ── -->
      <div class="flex-1 grid grid-cols-3 gap-0 divide-x divide-white/5 overflow-hidden">
        <div
          v-for="col in (['todo','inprogress','done'] as Status[])"
          :key="col"
          class="flex flex-col overflow-hidden transition-all"
          :class="colDropClass(col)"
          @dragover.prevent="onDragOver(col)"
          @dragleave.self="onDragLeave"
          @drop.prevent="onDrop(col)"
        >
          <!-- Column Header -->
          <div class="px-4 py-3 border-b border-white/5 shrink-0" :class="colHeaderClass(col)">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon :name="colIcon(col)" class="text-sm" :class="colIconClass(col)" />
                <span class="text-[11px] font-black text-white uppercase tracking-tight">{{ colLabel(col) }}</span>
              </div>
              <span class="text-[9px] font-black px-2 py-0.5 rounded-full" :class="colBadgeClass(col)">{{ colTasks(col).length }}</span>
            </div>
          </div>

          <!-- Cards -->
          <div class="flex-1 p-3 space-y-2.5 overflow-y-auto scrollbar-hide" :class="colBodyClass(col)">
            <div
              v-for="task in colTasks(col)"
              :key="task.id"
              draggable="true"
              @dragstart="onDragStart(task.id)"
              @dragend="onDragEnd"
              class="group relative bg-zinc-900 border border-white/5 rounded-xl p-3 cursor-grab active:cursor-grabbing active:opacity-50 active:scale-95 transition-all hover:border-white/10 hover:shadow-lg"
            >
              <!-- Grab handle + delete -->
              <div class="flex items-start gap-2 mb-2">
                <Icon name="heroicons:bars-2" class="text-zinc-700 text-xs mt-0.5 shrink-0" />
                <p class="flex-1 text-[11px] font-black text-white leading-snug" :class="task.status === 'done' ? 'line-through opacity-40' : ''">{{ task.title }}</p>
                <button @click.stop="remove(task.id)" class="opacity-0 group-hover:opacity-100 shrink-0 text-zinc-600 hover:text-red-400 transition-all">
                  <Icon name="heroicons:x-mark" class="text-xs" />
                </button>
              </div>

              <!-- Priority + due badges -->
              <div class="flex items-center gap-1.5 flex-wrap mb-2.5">
                <span class="inline-flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded border uppercase" :class="priorityClass(task.priority)">
                  <Icon name="heroicons:flag" class="text-[8px]" /> {{ task.priority }}
                </span>
                <span class="inline-flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded border uppercase" :class="dueClass(task.due, task.status === 'done')">
                  <Icon name="heroicons:calendar-days" class="text-[8px]" /> {{ relDay(task.due) }}
                </span>
              </div>

              <!-- Assignee + next btn -->
              <div class="flex items-center justify-between">
                <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-black shadow" :class="task.assignee.color" :title="task.assignee.name">
                  {{ task.assignee.name[0] }}
                </div>
                <button @click.stop="cycle(task)" class="opacity-0 group-hover:opacity-100 text-[8px] font-black uppercase text-zinc-600 hover:text-emerald-400 transition-all">Next →</button>
              </div>
            </div>

            <!-- Empty drop zone -->
            <div v-if="colTasks(col).length === 0" class="flex flex-col items-center justify-center py-10 opacity-25">
              <Icon name="heroicons:inbox" class="text-2xl text-zinc-600 mb-1" />
              <p class="text-[9px] font-black text-zinc-600 uppercase">Drop here</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Bottom Status Bar ── -->
      <div class="flex items-center justify-center gap-6 px-6 py-3 border-t border-white/5 shrink-0">
        <div v-for="col in (['todo','inprogress','done'] as Status[])" :key="col" class="flex items-center gap-1.5">
          <div class="w-2 h-2 rounded-full" :class="col==='todo'?'bg-zinc-500':col==='inprogress'?'bg-amber-500':'bg-emerald-500'" />
          <span class="text-[9px] font-black text-zinc-500 uppercase">{{ colTasks(col).length }} {{ colLabel(col) }}</span>
        </div>
      </div>
    </div>

    <!-- ══════════════════ RIGHT PANEL (1/3) ══════════════════ -->
    <div class="flex flex-col gap-5 p-5 bg-zinc-900/30 overflow-y-auto scrollbar-hide">

      <!-- Stats grid -->
      <div>
        <h4 class="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-3">Board Metrics</h4>
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-black/40 border border-white/5 rounded-xl p-3">
            <p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Total</p>
            <p class="text-lg font-black text-white tabular-nums">{{ tasks.length }}</p>
          </div>
          <div class="bg-black/40 border border-white/5 rounded-xl p-3">
            <p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Done</p>
            <p class="text-lg font-black text-emerald-500 tabular-nums">{{ tasks.filter(t=>t.status==='done').length }}</p>
          </div>
          <div class="bg-black/40 border border-white/5 rounded-xl p-3">
            <p class="text-[8px] font-black text-zinc-600 uppercase mb-1">High Pri</p>
            <p class="text-lg font-black text-red-400 tabular-nums">{{ tasks.filter(t=>t.priority==='High').length }}</p>
          </div>
          <div class="bg-black/40 border border-white/5 rounded-xl p-3">
            <p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Overdue</p>
            <p class="text-lg font-black text-amber-400 tabular-nums">{{ tasks.filter(t=>isOverdue(t.due)&&t.status!=='done').length }}</p>
          </div>
        </div>
      </div>

      <!-- Event Bus Terminal -->
      <div class="flex flex-col flex-1 min-h-[160px]">
        <h4 class="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2 flex items-center justify-between shrink-0">
          Event Bus Log <span class="font-mono text-[7px] opacity-30 animate-pulse">● LIVE</span>
        </h4>
        <div class="flex-1 bg-black/80 border border-white/5 rounded-xl p-3 font-mono text-[9px] overflow-y-auto scrollbar-hide shadow-inner">
          <div class="space-y-1">
            <div
              v-for="(log, i) in logs" :key="i"
              class="flex gap-2 leading-relaxed"
              :class="log.includes('CREATED')?'text-emerald-400':log.includes('DELETED')?'text-red-400':log.includes('MOVE')||log.includes('UPDATE')?'text-amber-400':log.includes('RESET')?'text-blue-400':'text-zinc-600'"
            >
              <span class="opacity-20 shrink-0">&gt;&gt;</span><span>{{ log }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Design Insights -->
      <div class="space-y-2 shrink-0">
        <h4 class="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Design Patterns</h4>
        <div v-for="ins in insights" :key="ins.title" class="flex gap-2.5 p-3 bg-zinc-900/40 border border-white/5 rounded-xl hover:bg-zinc-900/60 transition-all">
          <div class="w-5 h-5 shrink-0 rounded bg-zinc-800 border border-white/10 flex items-center justify-center">
            <Icon name="heroicons:bolt" class="text-emerald-500 text-xs" />
          </div>
          <div>
            <p class="text-[9px] font-black text-white uppercase mb-0.5">{{ ins.title }}</p>
            <p class="text-[8px] text-zinc-500 font-bold leading-snug">{{ ins.desc }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.slide-down-enter-active { animation: slide-down 0.2s ease-out; }
.slide-down-leave-active { animation: slide-down 0.15s reverse ease-in; }
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.3); }
</style>
