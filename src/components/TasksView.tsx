import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Plus, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  MoreVertical, 
  X,
  LayoutGrid,
  List,
  Check
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const TasksView: React.FC = () => {
  const { 
    tasks, 
    teamMembers, 
    addTask, 
    updateTask, 
    deleteTask, 
    showToast,
    formatDate,
    formatRelative,
    liveClock,
    userTimezone
  } = useApp();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Task state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssignee, setNewAssignee] = useState(teamMembers[0]?.id || '1');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newDueDate, setNewDueDate] = useState(liveClock.isoDate || new Date().toISOString().slice(0, 10));

  const filteredTasks = tasks.filter(t => {
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    return true;
  });

  const columns: { id: TaskStatus; label: string; tag: string }[] = [
    { id: 'todo', label: 'Backlog', tag: 'TODO' },
    { id: 'in_progress', label: 'In Progress', tag: 'WIP' },
    { id: 'review', label: 'Review & QA', tag: 'REVIEW' },
    { id: 'done', label: 'Completed', tag: 'DONE' },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const assigned = teamMembers.find(m => m.id === newAssignee);

    addTask({
      title: newTitle,
      description: newDesc,
      assignedTo: assigned?.name || 'Assigned Member',
      assignedToAvatar: assigned?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      priority: newPriority,
      status: 'todo',
      dueDate: newDueDate,
      tags: ['Socially', 'Campaign'],
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'high':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'medium':
        return 'bg-[#C8FF00]/10 text-[#C8FF00] border-[#C8FF00]/30';
      default:
        return 'bg-white/5 text-[#9A9A9A] border-white/10';
    }
  };

  return (
    <div id="tasks-view" className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">SPRINT DELIVERABLES</span>
            <span className="text-xs text-[#9A9A9A] font-mono">TASK KANBAN</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-[#F5F5F0] tracking-tight">
            Tasks & Production Board
          </h1>
          <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1 max-w-2xl">
            Manage asset pipelines, video editing queues, copy reviews, and creator assignments.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View toggle */}
          <div className="flex items-center bg-[#111111] p-1 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'board' ? 'bg-[#C8FF00] text-[#080808]' : 'text-[#9A9A9A] hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-[#C8FF00] text-[#080808]' : 'text-[#9A9A9A] hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            id="add-task-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="btn-lime px-5 py-2.5 text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-lg shadow-[#C8FF00]/10"
          >
            <Plus className="w-4 h-4 text-[#080808]" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Priority Filter */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="font-mono-tag text-[10px] text-[#707070] flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5 text-[#707070]" />
          <span>PRIORITY:</span>
        </span>
        {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`px-3 py-1 rounded-lg font-mono-tag text-[10px] transition-all cursor-pointer ${
              priorityFilter === p
                ? 'bg-[#C8FF00] text-[#080808] font-bold'
                : 'text-[#9A9A9A] hover:text-white bg-[#111111] border border-white/5'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Kanban Board View */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                className="p-4 rounded-2xl bg-[#0D0D0D] border border-white/10 space-y-3 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 py-1 border-b border-white/5 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-display text-xs font-bold text-[#F5F5F0]">{col.label}</span>
                    <span className="font-mono text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">
                      {colTasks.length}
                    </span>
                  </div>
                  <span className="font-mono-tag text-[9px] text-[#707070]">[{col.tag}]</span>
                </div>

                {/* Tasks Cards in Column */}
                <div className="space-y-3">
                  {colTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      whileHover={{ y: -2 }}
                      className="p-4 rounded-xl card-brivon space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <span className={`text-[9px] font-mono-tag px-2 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                        <div className="flex items-center space-x-1">
                          <select
                            value={task.status}
                            onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                            className="input-brivon text-[10px] font-mono rounded px-1.5 py-0.5"
                          >
                            <option value="todo" className="bg-[#111111] text-white">To Do</option>
                            <option value="in_progress" className="bg-[#111111] text-white">In Progress</option>
                            <option value="review" className="bg-[#111111] text-white">Review</option>
                            <option value="done" className="bg-[#111111] text-white">Done</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-[#F5F5F0] leading-snug">{task.title}</h4>
                        {task.description && (
                          <p className="text-[11px] text-[#9A9A9A] mt-1 line-clamp-2">{task.description}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <img
                            src={task.assignedToAvatar}
                            alt={task.assignedTo}
                            className="w-5 h-5 rounded-full object-cover border border-white/10"
                          />
                          <span className="text-[#9A9A9A] font-mono text-[11px] truncate max-w-[80px]">
                            {task.assignedTo.split(' ')[0]}
                          </span>
                        </div>
                        <span className="text-[#707070] font-mono text-[10px]" title={formatDate(task.dueDate, 'full')}>
                          {formatDate(task.dueDate, 'short-date')}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="p-4 rounded-2xl card-brivon divide-y divide-white/5">
          {filteredTasks.map((task) => (
            <div key={task.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  onChange={(e) => updateTask(task.id, { status: e.target.checked ? 'done' : 'todo' })}
                  className="rounded text-[#C8FF00] accent-[#C8FF00] focus:ring-[#C8FF00] w-4 h-4 cursor-pointer"
                />
                <div>
                  <h4 className={`text-xs font-bold ${task.status === 'done' ? 'line-through text-[#707070]' : 'text-[#F5F5F0]'}`}>
                    {task.title}
                  </h4>
                  <span className="text-[11px] font-mono text-[#707070]">
                    Assigned to: {task.assignedTo} • Due: {formatDate(task.dueDate, 'short-date')} ({formatRelative(task.dueDate)})
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`text-[9px] font-mono-tag px-2.5 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                  {task.priority}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-[#707070] hover:text-rose-400 font-mono text-xs p-1 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg card-brivon bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-lg font-display font-extrabold text-white">Create New Task</h3>
                  <p className="text-xs text-[#9A9A9A]">Define scope, team member, and deadline</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-[#9A9A9A] hover:text-white rounded-lg bg-[#151515]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">TASK TITLE</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Master Edit 4K Product Keynote Footage"
                    className="input-brivon w-full px-4 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">SPECIFICATION & INSTRUCTIONS</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Requirements, aspect ratios, brand assets to utilize..."
                    className="input-brivon w-full px-4 py-2.5 rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">ASSIGNEE</label>
                    <select
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                      className="input-brivon w-full px-3 py-2 rounded-xl text-xs"
                    >
                      {teamMembers.map((m) => (
                        <option key={m.id} value={m.id} className="bg-[#111111] text-white">
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">PRIORITY</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="input-brivon w-full px-3 py-2 rounded-xl text-xs"
                    >
                      <option value="low" className="bg-[#111111] text-white">Low</option>
                      <option value="medium" className="bg-[#111111] text-white">Medium</option>
                      <option value="high" className="bg-[#111111] text-white">High</option>
                      <option value="urgent" className="bg-[#111111] text-white">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">DUE DATE</label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="input-brivon w-full px-3 py-2 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn-secondary-dark px-4 py-2 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-lime px-5 py-2 text-xs font-bold cursor-pointer"
                  >
                    Assign Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
