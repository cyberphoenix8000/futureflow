
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  Calendar,
  BookOpen,
  Target,
  BarChart3,
  Star, // Not used, but kept from original snippet
  AlertCircle, // Not used
  Minus,
  Edit3, // Not used
  Save, // Not used
  X, // Not used
  Clock,
  TrendingUp,
  Award,
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import { Task, Note, Goal, Priority, TaskFormState, NoteFormState, GoalFormState, ActiveTab, TabDefinition } from './types';

type TextVariant = 'primary' | 'secondary' | 'muted';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  
  const [pomodoroTime, setPomodoroTime] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  const [taskForm, setTaskForm] = useState<TaskFormState>({ title: '', priority: Priority.Medium, dueDate: '', subject: '' });
  const [noteForm, setNoteForm] = useState<NoteFormState>({ title: '', content: '', subject: '' });
  const [goalForm, setGoalForm] = useState<GoalFormState>({ title: '', target: '', current: 0, category: '' });
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (isRunning && pomodoroTime > 0) {
      timerRef.current = window.setTimeout(() => {
        setPomodoroTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsRunning(false);
      if (!isBreak) {
        setCompletedPomodoros(prev => prev + 1);
        setPomodoroTime(5 * 60); 
        setIsBreak(true);
      } else {
        setPomodoroTime(25 * 60); 
        setIsBreak(false);
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, pomodoroTime, isBreak]);

  const addTask = () => {
    if (taskForm.title.trim()) {
      const newTask: Task = {
        id: Date.now(),
        ...taskForm,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks(prevTasks => [newTask, ...prevTasks]); // Add to beginning
      setTaskForm({ title: '', priority: Priority.Medium, dueDate: '', subject: '' });
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addNote = () => {
    if (noteForm.title.trim() && noteForm.content.trim()) {
      const newNote: Note = {
        id: Date.now(),
        ...noteForm,
        createdAt: new Date().toISOString()
      };
      setNotes(prevNotes => [newNote, ...prevNotes]); // Add to beginning
      setNoteForm({ title: '', content: '', subject: '' });
    }
  };

  const addGoal = () => {
    if (goalForm.title.trim() && goalForm.target) {
      const targetValue = parseInt(goalForm.target, 10);
      if (isNaN(targetValue) || targetValue <= 0) {
        alert("Target must be a positive number."); // Basic validation
        return;
      }
      const newGoal: Goal = {
        id: Date.now(),
        title: goalForm.title,
        target: targetValue,
        current: 0, // Start current at 0 explicitly
        category: goalForm.category,
        createdAt: new Date().toISOString()
      };
      setGoals(prevGoals => [newGoal, ...prevGoals]); // Add to beginning
      setGoalForm({ title: '', target: '', current: 0, category: '' });
    }
  };

  const updateGoalProgress = (id: number, increment: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { 
        ...goal, 
        current: Math.max(0, Math.min(goal.target, goal.current + increment))
      } : goal
    ));
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setPomodoroTime(25 * 60);
    setIsBreak(false);
  };

  const getCompletionRate = (): number => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority: Priority): string => {
    const lightColors: Record<Priority, string> = {
      [Priority.High]: 'text-red-600 bg-red-100 border-red-200',
      [Priority.Medium]: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      [Priority.Low]: 'text-green-600 bg-green-100 border-green-200',
    };
    const darkColors: Record<Priority, string> = {
      [Priority.High]: 'text-red-400 bg-red-500/20 border-red-500/30',
      [Priority.Medium]: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      [Priority.Low]: 'text-green-400 bg-green-500/20 border-green-500/30',
    };
    const defaultLightColor = 'text-gray-600 bg-gray-100 border-gray-200';
    const defaultDarkColor = 'text-gray-400 bg-gray-500/20 border-gray-500/30';

    const colors = darkMode ? darkColors : lightColors;
    return colors[priority] || (darkMode ? defaultDarkColor : defaultLightColor);
  };

  const getInputClasses = (): string => {
    return darkMode 
      ? 'bg-slate-700/80 border-slate-600 text-slate-200 placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400/50' 
      : 'bg-white/80 border-slate-300 text-slate-800 placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50';
  };

  const getCardClasses = (): string => {
    return darkMode 
      ? 'bg-slate-800/70 border-slate-700/50' 
      : 'bg-white/70 border-slate-200/50';
  };

  const getTextClasses = (variant: TextVariant = 'primary'): string => {
    const variants: Record<TextVariant, string> = {
      primary: darkMode ? 'text-slate-200' : 'text-slate-800',
      secondary: darkMode ? 'text-slate-400' : 'text-slate-600',
      muted: darkMode ? 'text-slate-500' : 'text-slate-500',
    };
    return variants[variant];
  };
  
  const TABS: TabDefinition[] = [
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'pomodoro', label: 'Focus Timer', icon: Clock },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-800 text-slate-100' 
        : 'bg-gradient-to-br from-slate-100 via-sky-100/30 to-indigo-100 text-slate-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b shadow-sm transition-all duration-300 ${
        darkMode 
          ? 'bg-slate-800/80 border-slate-700/50' 
          : 'bg-white/80 border-slate-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                FutureFlow
              </h1>
            </div>
            <div className={`flex items-center space-x-4 text-xs sm:text-sm ${getTextClasses('secondary')}`}>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{tasks.filter(t => t.completed).length} Done</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{completedPomodoros} Focus</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  darkMode 
                    ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400 hover:text-yellow-300 focus:ring-slate-600 focus:ring-offset-slate-800' 
                    : 'bg-slate-100 hover:bg-slate-200 text-indigo-600 hover:text-indigo-700 focus:ring-slate-200 focus:ring-offset-white'
                }`}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`sticky top-[60px] z-40 backdrop-blur-md border-b transition-all duration-300 overflow-x-auto ${
        darkMode 
          ? 'bg-slate-800/70 border-slate-700/30' 
          : 'bg-white/70 border-slate-200/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-3 sm:px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:z-10 focus:ring-2 ${
                  activeTab === tab.id
                    ? darkMode
                      ? 'text-cyan-400 bg-slate-700/70 border-b-2 border-cyan-400 shadow-inner focus:ring-cyan-500'
                      : 'text-indigo-700 bg-indigo-100/70 border-b-2 border-indigo-500 shadow-inner focus:ring-indigo-500'
                    : darkMode
                      ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 border-b-2 border-transparent focus:ring-slate-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 border-b-2 border-transparent focus:ring-slate-400'
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className={`backdrop-blur-xl rounded-xl p-4 sm:p-6 border shadow-lg transition-all duration-300 ${getCardClasses()}`}>
              <h2 className={`text-lg sm:text-xl font-semibold mb-4 flex items-center space-x-2 ${getTextClasses()}`}>
                <Plus className="w-5 h-5 text-cyan-500" />
                <span>Add New Task</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <input
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder="Task title..."
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${getInputClasses()}`}
                />
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({...taskForm, priority: e.target.value as Priority})}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${getInputClasses()}`}
                >
                  <option value={Priority.Low}>Low Priority</option>
                  <option value={Priority.Medium}>Medium Priority</option>
                  <option value={Priority.High}>High Priority</option>
                </select>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${getInputClasses()}`}
                />
                <input
                  value={taskForm.subject}
                  onChange={(e) => setTaskForm({...taskForm, subject: e.target.value})}
                  placeholder="Subject/Category"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${getInputClasses()}`}
                />
              </div>
              <button
                onClick={addTask}
                className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-5 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                Add Task
              </button>
            </div>

            <div className="space-y-3">
              {tasks.length === 0 && <p className={`text-center py-8 ${getTextClasses('muted')}`}>No tasks yet. Add one above!</p>}
              {tasks.map(task => (
                <div key={task.id} className={`backdrop-blur-md rounded-lg p-3 sm:p-4 border hover:shadow-lg transition-all duration-200 ${getCardClasses()} ${task.completed ? (darkMode ? 'opacity-60' : 'opacity-70') : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`transition-colors focus:outline-none p-1 rounded-full ${task.completed ? 'text-green-500 hover:text-green-400' : (darkMode ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-500 hover:text-cyan-500')}`}
                        title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {task.completed ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <Circle className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </button>
                      <div className="flex-grow">
                        <h3 className={`font-medium text-sm sm:text-base ${task.completed ? `line-through ${getTextClasses('muted')}` : getTextClasses()}`}>
                          {task.title}
                        </h3>
                        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs sm:text-sm ${getTextClasses('secondary')}`}>
                          {task.subject && (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              darkMode ? 'bg-purple-500/30 text-purple-300' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {task.subject}
                            </span>
                          )}
                          {task.dueDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(task.dueDate + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className={`backdrop-blur-xl rounded-xl p-4 sm:p-6 border shadow-lg transition-all duration-300 ${getCardClasses()}`}>
              <h2 className={`text-lg sm:text-xl font-semibold mb-4 flex items-center space-x-2 ${getTextClasses()}`}>
                <BookOpen className="w-5 h-5 text-cyan-500" />
                <span>Create New Note</span>
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                    placeholder="Note title..."
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${getInputClasses()}`}
                  />
                  <input
                    value={noteForm.subject}
                    onChange={(e) => setNoteForm({...noteForm, subject: e.target.value})}
                    placeholder="Subject/Category"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${getInputClasses()}`}
                  />
                </div>
                <textarea
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                  placeholder="Write your note here..."
                  rows={5}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all duration-200 resize-y min-h-[100px] ${getInputClasses()}`}
                />
                <button
                  onClick={addNote}
                  className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-5 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Save Note
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {notes.length === 0 && <p className={`md:col-span-2 lg:col-span-3 text-center py-8 ${getTextClasses('muted')}`}>No notes yet. Create one above!</p>}
              {notes.map(note => (
                <div key={note.id} className={`backdrop-blur-md rounded-lg p-4 sm:p-5 border hover:shadow-xl transition-all duration-200 flex flex-col ${getCardClasses()}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`text-base sm:text-lg font-semibold ${getTextClasses()}`}>{note.title}</h3>
                    {note.subject && (
                      <span className={`flex-shrink-0 ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-indigo-500/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {note.subject}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${getTextClasses('secondary')} leading-relaxed mb-3 flex-grow whitespace-pre-wrap`}>{note.content}</p>
                  <div className={`text-xs ${getTextClasses('muted')} flex items-center space-x-1 pt-2 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(note.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pomodoro' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className={`backdrop-blur-xl rounded-2xl p-6 sm:p-8 border shadow-xl transition-all duration-300 ${getCardClasses()}`}>
              <div className="text-center space-y-6">
                <h2 className={`text-xl sm:text-2xl font-bold ${getTextClasses()}`}>
                  {isBreak ? 'Break Time!' : 'Focus Session'}
                </h2>
                <div className={`text-5xl sm:text-7xl font-mono font-bold tabular-nums transition-colors duration-300 ${
                  isBreak 
                    ? (darkMode ? 'text-green-400' : 'text-green-500')
                    : pomodoroTime < 300 
                      ? (darkMode ? 'text-red-400' : 'text-red-500')
                      : (darkMode ? 'text-cyan-400' : 'text-cyan-500')
                }`}>
                  {formatTime(pomodoroTime)}
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
                  <button
                    onClick={isRunning ? pauseTimer : startTimer}
                    className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isRunning 
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 focus:ring-red-500'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-500'
                    } ${darkMode ? 'focus:ring-offset-slate-800' : 'focus:ring-offset-white'}`}
                  >
                    {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <span>{isRunning ? 'Pause' : 'Start'}</span>
                  </button>
                  <button
                    onClick={resetTimer}
                    className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      darkMode 
                        ? 'bg-slate-600 hover:bg-slate-500 text-slate-200 focus:ring-slate-500 focus:ring-offset-slate-800' 
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700 focus:ring-slate-300 focus:ring-offset-white'
                    }`}
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset</span>
                  </button>
                </div>
                <div className={`flex items-center justify-center space-x-4 sm:space-x-6 text-sm ${getTextClasses('secondary')}`}>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>Sessions: {completedPomodoros}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Mode: {isBreak ? 'Break' : 'Focus'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className={`backdrop-blur-xl rounded-xl p-4 sm:p-6 border shadow-lg transition-all duration-300 ${getCardClasses()}`}>
              <h2 className={`text-lg sm:text-xl font-semibold mb-4 flex items-center space-x-2 ${getTextClasses()}`}>
                <Target className="w-5 h-5 text-cyan-500" />
                <span>Set New Goal</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <input
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({...goalForm, title: e.target.value})}
                  placeholder="Goal title..."
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${getInputClasses()}`}
                />
                <input
                  type="number"
                  value={goalForm.target}
                  onChange={(e) => setGoalForm({...goalForm, target: e.target.value})}
                  placeholder="Target (e.g., 100)"
                  min="1"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${getInputClasses()}`}
                />
                <input
                  value={goalForm.category}
                  onChange={(e) => setGoalForm({...goalForm, category: e.target.value})}
                  placeholder="Category (e.g., Fitness)"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${getInputClasses()}`}
                />
              </div>
              <button
                  onClick={addGoal}
                  className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-5 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Create Goal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {goals.length === 0 && <p className={`md:col-span-2 text-center py-8 ${getTextClasses('muted')}`}>No goals set. Aim high!</p>}
              {goals.map(goal => {
                const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                return (
                  <div key={goal.id} className={`backdrop-blur-md rounded-lg p-4 sm:p-5 border hover:shadow-xl transition-all duration-200 flex flex-col ${getCardClasses()}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className={`text-base sm:text-lg font-semibold ${getTextClasses()}`}>{goal.title}</h3>
                        {goal.category && (
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                            darkMode ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {goal.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <button
                          onClick={() => updateGoalProgress(goal.id, -1)}
                          disabled={goal.current <= 0}
                          className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            darkMode 
                              ? 'bg-slate-600 hover:bg-slate-500 text-slate-200 disabled:bg-slate-700 disabled:text-slate-500 focus:ring-slate-500 focus:ring-offset-slate-800' 
                              : 'bg-slate-200 hover:bg-slate-300 text-slate-700 disabled:bg-slate-100 disabled:text-slate-400 focus:ring-slate-300 focus:ring-offset-white'
                          }`}
                        >
                          <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => updateGoalProgress(goal.id, 1)}
                          disabled={goal.current >= goal.target}
                          className={`bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 p-1.5 sm:p-2 rounded-lg transition-all duration-200 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 ${darkMode ? 'focus:ring-offset-slate-800' : 'focus:ring-offset-white'}`}
                        >
                          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5 mt-auto">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className={getTextClasses('secondary')}>Progress</span>
                        <span className={getTextClasses()}>{goal.current} / {goal.target}</span>
                      </div>
                      <div className={`w-full rounded-full h-2 sm:h-2.5 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-purple-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="text-right">
                        <span className={`text-xs sm:text-sm font-medium ${getTextClasses()}`}>
                          {Math.round(progress)}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: 'Task Completion', value: `${getCompletionRate()}%`, icon: TrendingUp, colorClass: darkMode ? 'text-cyan-400' : 'text-cyan-500' },
                { title: 'Focus Sessions', value: completedPomodoros, icon: Clock, colorClass: darkMode ? 'text-purple-400' : 'text-purple-500' },
                { title: 'Active Goals', value: goals.filter(g => g.current < g.target).length, icon: Target, colorClass: darkMode ? 'text-emerald-400' : 'text-emerald-500' },
              ].map(item => (
                <div key={item.title} className={`backdrop-blur-xl rounded-xl p-4 sm:p-6 border shadow-lg transition-all duration-300 ${getCardClasses()}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm sm:text-base font-semibold ${getTextClasses()}`}>{item.title}</h3>
                      <p className={`text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 ${item.colorClass}`}>{item.value}</p>
                    </div>
                    <item.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${item.colorClass} opacity-70`} />
                  </div>
                </div>
              ))}
            </div>

            <div className={`backdrop-blur-xl rounded-xl p-4 sm:p-6 border shadow-lg transition-all duration-300 ${getCardClasses()}`}>
              <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${getTextClasses()}`}>Recently Completed Tasks</h3>
              <div className="space-y-2 sm:space-y-3 max-h-80 overflow-y-auto">
                {tasks.filter(task => task.completed).slice(0, 5).map(task => (
                  <div key={task.id} className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg ${
                    darkMode ? 'bg-slate-700/50 hover:bg-slate-700/80' : 'bg-slate-100/70 hover:bg-slate-200/70'
                  } transition-colors`}>
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                    <span className={`text-xs sm:text-sm ${getTextClasses()}`}>{task.title}</span>
                  </div>
                ))}
                {tasks.filter(task => task.completed).length === 0 && (
                  <p className={`text-center py-6 sm:py-8 text-sm ${getTextClasses('muted')}`}>
                    No tasks completed recently. Keep going!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className={`py-4 text-center text-xs ${getTextClasses('muted')} border-t ${darkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
        FutureFlow &copy; {new Date().getFullYear()} - Your Productivity Partner.
      </footer>
    </div>
  );
};

export default App;
