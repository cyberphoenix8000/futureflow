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
  Star,
  AlertCircle,
  Minus,
  Edit3,
  Save,
  X,
  Clock,
  TrendingUp,
  Award,
  Zap,
  Sun,
  Moon
} from 'lucide-react';

const ProductivityApp = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  
  // Form states
  const [taskForm, setTaskForm] = useState({ title: '', priority: 'medium', dueDate: '', subject: '' });
  const [noteForm, setNoteForm] = useState({ title: '', content: '', subject: '' });
  const [goalForm, setGoalForm] = useState({ title: '', target: '', current: 0, category: '' });
  
  const timerRef = useRef(null);

  // Timer Effect
  useEffect(() => {
    if (isRunning && pomodoroTime > 0) {
      timerRef.current = setTimeout(() => {
        setPomodoroTime(pomodoroTime - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      if (!isBreak) {
        setCompletedPomodoros(prev => prev + 1);
        setPomodoroTime(5 * 60); // 5 minute break
        setIsBreak(true);
      } else {
        setPomodoroTime(25 * 60); // Back to 25 minutes
        setIsBreak(false);
      }
      setIsRunning(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isRunning, pomodoroTime, isBreak]);

  // Task Functions
  const addTask = () => {
    if (taskForm.title.trim()) {
      const newTask = {
        id: Date.now(),
        ...taskForm,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, newTask]);
      setTaskForm({ title: '', priority: 'medium', dueDate: '', subject: '' });
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Note Functions
  const addNote = () => {
    if (noteForm.title.trim() && noteForm.content.trim()) {
      const newNote = {
        id: Date.now(),
        ...noteForm,
        createdAt: new Date().toISOString()
      };
      setNotes([...notes, newNote]);
      setNoteForm({ title: '', content: '', subject: '' });
    }
  };

  // Goal Functions
  const addGoal = () => {
    if (goalForm.title.trim() && goalForm.target) {
      const newGoal = {
        id: Date.now(),
        ...goalForm,
        target: parseInt(goalForm.target),
        createdAt: new Date().toISOString()
      };
      setGoals([...goals, newGoal]);
      setGoalForm({ title: '', target: '', current: 0, category: '' });
    }
  };

  const updateGoalProgress = (id, increment) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { 
        ...goal, 
        current: Math.max(0, Math.min(goal.target, goal.current + increment))
      } : goal
    ));
  };

  // Timer Functions
  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setPomodoroTime(25 * 60);
    setIsBreak(false);
  };

  // Analytics Functions
  const getCompletionRate = () => {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority) => {
    const lightColors = {
      high: 'text-red-600 bg-red-100 border-red-200',
      medium: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      low: 'text-green-600 bg-green-100 border-green-200',
      default: 'text-gray-600 bg-gray-100 border-gray-200'
    };
    
    const darkColors = {
      high: 'text-red-400 bg-red-500/20 border-red-500/30',
      medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      low: 'text-green-400 bg-green-500/20 border-green-500/30',
      default: 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    };
    
    const colors = darkMode ? darkColors : lightColors;
    return colors[priority] || colors.default;
  };

  const getInputClasses = () => {
    return darkMode 
      ? 'bg-slate-700/80 border-slate-600 text-slate-200 placeholder-slate-400 focus:border-cyan-400/50' 
      : 'bg-white/80 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-cyan-400/50';
  };

  const getCardClasses = () => {
    return darkMode 
      ? 'bg-slate-800/70 border-slate-700/20' 
      : 'bg-white/70 border-white/20';
  };

  const getTextClasses = (variant = 'primary') => {
    const variants = {
      primary: darkMode ? 'text-slate-200' : 'text-slate-800',
      secondary: darkMode ? 'text-slate-400' : 'text-slate-600',
      muted: darkMode ? 'text-slate-500' : 'text-slate-500'
    };
    return variants[variant];
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 text-slate-100' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 text-slate-900'
    }`}>
      {/* Header */}
      <div className={`backdrop-blur-xl border-b shadow-sm transition-all duration-300 ${
        darkMode 
          ? 'bg-slate-800/80 border-slate-700/50' 
          : 'bg-white/80 border-slate-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FutureFlow
              </h1>
            </div>
            <div className={`flex items-center space-x-4 text-sm ${getTextClasses('secondary')}`}>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{tasks.filter(t => t.completed).length} completed</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>{completedPomodoros} focus sessions</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  darkMode 
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-slate-100' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800'
                }`}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={`backdrop-blur-xl border-b transition-all duration-300 ${
        darkMode 
          ? 'bg-slate-800/60 border-slate-700/30' 
          : 'bg-white/60 border-slate-200/30'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-1">
            {[
              { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
              { id: 'notes', label: 'Notes', icon: BookOpen },
              { id: 'pomodoro', label: 'Focus Timer', icon: Clock },
              { id: 'goals', label: 'Goals', icon: Target },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? darkMode
                      ? 'text-cyan-400 bg-slate-700/70 border-b-2 border-cyan-400 shadow-sm'
                      : 'text-indigo-700 bg-indigo-100/70 border-b-2 border-indigo-500 shadow-sm'
                    : darkMode
                      ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-700/50'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg transition-all duration-300 ${getCardClasses()}`}>
              <h2 className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${getTextClasses()}`}>
                <Plus className="w-5 h-5 text-cyan-500" />
                <span>Add New Task</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder="Task title..."
                  className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200 ${getInputClasses()}`}
                />
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                  className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200 ${getInputClasses()}`}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                  className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200 ${getInputClasses()}`}
                />
                <input
                  value={taskForm.subject}
                  onChange={(e) => setTaskForm({...taskForm, subject: e.target.value})}
                  placeholder="Subject/Category"
                  className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200 ${getInputClasses()}`}
                />
              </div>
              <button
                onClick={addTask}
                className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-white"
              >
                Add Task
              </button>
            </div>

            <div className="grid gap-4">
              {tasks.map(task => (
                <div key={task.id} className={`backdrop-blur-xl rounded-xl p-4 border hover:border-opacity-60 transition-all duration-200 shadow-md ${getCardClasses()}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="text-cyan-500 hover:text-cyan-400 transition-colors"
                      >
                        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <div>
                        <h3 className={`font-medium ${task.completed ? `line-through ${getTextClasses('muted')}` : getTextClasses()}`}>
                          {task.title}
                        </h3>
                        <div className={`flex items-center space-x-4 mt-1 text-sm ${getTextClasses('secondary')}`}>
                          {task.subject && (
                            <span className={`px-2 py-1 rounded text-xs ${
                              darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {task.subject}
                            </span>
                          )}
                          {task.dueDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg transition-all duration-300 ${getCardClasses()}`}>
              <h2 className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${getTextClasses()}`}>
                <BookOpen className="w-5 h-5 text-cyan-500" />
                <span>Create New Note</span>
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                    placeholder="Note title..."
                    className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200 ${getInputClasses()}`}
                  />
                  <input
                    value={noteForm.subject}
                    onChange={(e) => setNoteForm({...noteForm, subject: e.target.value})}
                    placeholder="Subject/Category"
                    className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200 ${getInputClasses()}`}
                  />
                </div>
                <textarea
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                  placeholder="Write your note here..."
                  rows={4}
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200 resize-none ${getInputClasses()}`}
                />
                <button
                  onClick={addNote}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-white"
                >
                  Save Note
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {notes.map(note => (
                <div key={note.id} className={`backdrop-blur-xl rounded-xl p-6 border hover:border-opacity-60 transition-all duration-200 shadow-md ${getCardClasses()}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={`text-lg font-semibold ${getTextClasses()}`}>{note.title}</h3>
                    {note.subject && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {note.subject}
                      </span>
                    )}
                  </div>
                  <p className={`${getTextClasses('secondary')} leading-relaxed mb-3`}>{note.content}</p>
                  <div className={`text-xs ${getTextClasses('muted')} flex items-center space-x-1`}>
                    <Calendar className="w-3 h-3" />
                    <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pomodoro Tab */}
        {activeTab === 'pomodoro' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className={`backdrop-blur-xl rounded-2xl p-8 border shadow-lg transition-all duration-300 ${getCardClasses()}`}>
              <div className="text-center space-y-6">
                <h2 className={`text-2xl font-bold ${getTextClasses()}`}>
                  {isBreak ? 'Break Time' : 'Focus Session'}
                </h2>
                <div className={`text-6xl font-mono font-bold ${
                  isBreak 
                    ? 'text-green-500' 
                    : pomodoroTime < 300 
                      ? 'text-red-500' 
                      : 'text-cyan-500'
                }`}>
                  {formatTime(pomodoroTime)}
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={isRunning ? pauseTimer : startTimer}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                      isRunning 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white'
                    }`}
                  >
                    {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <span>{isRunning ? 'Pause' : 'Start'}</span>
                  </button>
                  <button
                    onClick={resetTimer}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                      darkMode 
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-slate-100' 
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset</span>
                  </button>
                </div>
                <div className={`flex items-center justify-center space-x-6 text-sm ${getTextClasses('secondary')}`}>
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

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg transition-all duration-300 ${getCardClasses()}`}>
              <h2 className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${getTextClasses()}`}>
                <Target className="w-5 h-5 text-cyan-500" />
                <span>Set New Goal</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({...goalForm, title: e.target.value})}
                  placeholder="Goal title..."
                  className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200 ${getInputClasses()}`}
                />
                <input
                  type="number"
                  value={goalForm.target}
                  onChange={(e) => setGoalForm({...goalForm, target: e.target.value})}
                  placeholder="Target (e.g., 100)"
                  className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200 ${getInputClasses()}`}
                />
                <input
                  value={goalForm.category}
                  onChange={(e) => setGoalForm({...goalForm, category: e.target.value})}
                  placeholder="Category"
                  className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200 ${getInputClasses()}`}
                />
                <button
                  onClick={addGoal}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-white"
                >
                  Create Goal
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {goals.map(goal => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <div key={goal.id} className={`backdrop-blur-xl rounded-xl p-6 border hover:border-opacity-60 transition-all duration-200 shadow-md ${getCardClasses()}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className={`text-lg font-semibold ${getTextClasses()}`}>{goal.title}</h3>
                        {goal.category && (
                          <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                            darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {goal.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateGoalProgress(goal.id, -1)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            darkMode 
                              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-slate-100' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateGoalProgress(goal.id, 1)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 p-2 rounded-lg transition-all duration-200 text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={getTextClasses('secondary')}>Progress</span>
                        <span className={getTextClasses()}>{goal.current} / {goal.target}</span>
                      </div>
                      <div className={`w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-slate-700' : ''}`}>
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${getTextClasses()}`}>
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`backdrop-blur-xl rounded-xl p-6 border shadow-lg transition-all duration-300 ${getCardClasses()}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold ${getTextClasses()}`}>Task Completion</h3>
                    <p className={`text-3xl font-bold text-cyan-500 mt-2`}>{getCompletionRate()}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-cyan-500" />
                </div>
              </div>
              
              <div className={`backdrop-blur-xl rounded-xl p-6 border shadow-lg transition-all duration-300 ${getCardClasses()}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold ${getTextClasses()}`}>Focus Sessions</h3>
                    <p className={`text-3xl font-bold text-purple-500 mt-2`}>{completedPomodoros}</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className={`backdrop-blur-xl rounded-xl p-6 border shadow-lg transition-all duration-300 ${getCardClasses()}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold ${getTextClasses()}`}>Total Goals</h3>
                    <p className={`text-3xl font-bold text-emerald-500 mt-2`}>{goals.length}</p>
                  </div>
                  <Target className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
            </div>

            <div className={`backdrop-blur-xl rounded-xl p-6 border shadow-lg transition-all duration-300 ${getCardClasses()}`}>
              <h3 className={`text-lg font-semibold mb-4 ${getTextClasses()}`}>Recent Activity</h3>
              <div className="space-y-3">
                {tasks.filter(task => task.completed).slice(-5).map(task => (
                  <div key={task.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    darkMode ? 'bg-slate-700/50' : 'bg-slate-50'
                  }`}>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className={getTextClasses()}>Completed: {task.title}</span>
                  </div>
                ))}
                {tasks.filter(task => task.completed).length === 0 && (
                  <p className={`text-center py-8 ${getTextClasses('muted')}`}>
                    Complete some tasks to see your activity here!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductivityApp;
                            