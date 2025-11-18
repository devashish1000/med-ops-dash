import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, MessageSquare, Layout, DollarSign, BarChart3, Users, Clock, AlertCircle, CheckCircle, Plus, Download, Filter, Trash2, Save, X, LogOut, Upload } from 'lucide-react';

const defaultKPIData = [
  { date: '2025-11-08', visits: 80, noShows: 10, cancellations: 5, avgWait: 15, providers: 8, throughput: 10.0, noShowRate: 10.5 },
  { date: '2025-11-09', visits: 95, noShows: 12, cancellations: 8, avgWait: 20, providers: 9, throughput: 10.6, noShowRate: 10.4 },
  { date: '2025-11-10', visits: 85, noShows: 8, cancellations: 6, avgWait: 18, providers: 8, throughput: 10.6, noShowRate: 8.1 },
  { date: '2025-11-11', visits: 90, noShows: 15, cancellations: 10, avgWait: 25, providers: 10, throughput: 9.0, noShowRate: 13.0 },
  { date: '2025-11-12', visits: 110, noShows: 20, cancellations: 7, avgWait: 22, providers: 9, throughput: 12.2, noShowRate: 14.6 },
];

const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

const ClinicOpsSuite = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [activeModule, setActiveModule] = useState('kpi');
  const [kpiData, setKpiData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showAddKPIForm, setShowAddKPIForm] = useState(false);
  const [showAddFeedbackForm, setShowAddFeedbackForm] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [selectedServiceLine, setSelectedServiceLine] = useState('all');
  
  const [newKPIEntry, setNewKPIEntry] = useState({
    date: '',
    visits: '',
    noShows: '',
    cancellations: '',
    avgWait: '',
    providers: ''
  });

  const [newFeedback, setNewFeedback] = useState({
    date: '',
    rating: 5,
    comments: '',
    serviceLine: 'Neurology'
  });

  const [newTask, setNewTask] = useState({
    title: '',
    status: 'ToDo',
    owner: '',
    dueDate: '',
    tags: ''
  });

  const [costParams, setCostParams] = useState({
    baselineVolume: 100,
    averageCost: 50,
    noShowReduction: 10,
    waitTimeReduction: 10,
    efficiencyGain: 10,
  });

  useEffect(() => {
    if (currentUser) {
      loadUserData(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      saveUserData(currentUser);
    }
  }, [kpiData, feedbackData, tasks, costParams, currentUser]);

  const loadUserData = (username) => {
    const stored = localStorage.getItem(`clinicops_${username}`);
    if (stored) {
      const data = JSON.parse(stored);
      setKpiData(data.kpiData || []);
      setFeedbackData(data.feedbackData || []);
      setTasks(data.tasks || []);
      setCostParams(data.costParams || costParams);
    } else {
      setKpiData(defaultKPIData);
      setFeedbackData([]);
      setTasks([]);
    }
  };

  const saveUserData = (username) => {
    const data = {
      kpiData,
      feedbackData,
      tasks,
      costParams
    };
    localStorage.setItem(`clinicops_${username}`, JSON.stringify(data));
  };

  const handleLogin = () => {
    if (loginForm.username.trim()) {
      setCurrentUser(loginForm.username);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginForm({ username: '', password: '' });
    setKpiData([]);
    setFeedbackData([]);
    setTasks([]);
  };

  const modules = [
    { id: 'kpi', name: 'KPI Tracker', icon: TrendingUp },
    { id: 'schedule', name: 'Schedule', icon: Calendar },
    { id: 'feedback', name: 'Feedback', icon: MessageSquare },
    { id: 'kanban', name: 'Kanban', icon: Layout },
    { id: 'cost', name: 'Cost Calculator', icon: DollarSign },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const filteredKPIData = useMemo(() => {
    if (filterDateRange === 'all') return kpiData;
    const days = filterDateRange === 'week' ? 7 : 30;
    return kpiData.slice(-days);
  }, [kpiData, filterDateRange]);

  const averageMetrics = useMemo(() => {
    if (filteredKPIData.length === 0) return { avgVisits: 0, avgNoShowRate: 0, avgWaitTime: 0, avgThroughput: 0 };
    
    const sum = filteredKPIData.reduce((acc, curr) => ({
      visits: acc.visits + (curr.visits || 0),
      noShowRate: acc.noShowRate + (curr.noShowRate || 0),
      avgWait: acc.avgWait + (curr.avgWait || 0),
      throughput: acc.throughput + (curr.throughput || 0)
    }), { visits: 0, noShowRate: 0, avgWait: 0, throughput: 0 });

    return {
      avgVisits: Math.round(sum.visits / filteredKPIData.length),
      avgNoShowRate: (sum.noShowRate / filteredKPIData.length).toFixed(1),
      avgWaitTime: Math.round(sum.avgWait / filteredKPIData.length),
      avgThroughput: (sum.throughput / filteredKPIData.length).toFixed(1)
    };
  }, [filteredKPIData]);

  const handleAddKPI = () => {
    if (!newKPIEntry.date || !newKPIEntry.visits || !newKPIEntry.providers) {
      alert('Please fill in required fields: Date, Visits, and Providers');
      return;
    }

    const visits = parseInt(newKPIEntry.visits) || 0;
    const noShows = parseInt(newKPIEntry.noShows) || 0;
    const cancellations = parseInt(newKPIEntry.cancellations) || 0;
    const avgWait = parseFloat(newKPIEntry.avgWait) || 0;
    const providers = parseInt(newKPIEntry.providers) || 1;

    const throughput = providers > 0 ? visits / providers : 0;
    const totalScheduled = visits + noShows + cancellations;
    const noShowRate = totalScheduled > 0 ? (noShows / totalScheduled) * 100 : 0;

    const newEntry = {
      date: newKPIEntry.date,
      visits,
      noShows,
      cancellations,
      avgWait,
      providers,
      throughput: parseFloat(throughput.toFixed(2)),
      noShowRate: parseFloat(noShowRate.toFixed(2))
    };

    setKpiData([...kpiData, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewKPIEntry({ date: '', visits: '', noShows: '', cancellations: '', avgWait: '', providers: '' });
    setShowAddKPIForm(false);
  };

  const handleDeleteKPI = (dateToDelete) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setKpiData(kpiData.filter(entry => entry.date !== dateToDelete));
    }
  };

  const handleAddFeedback = () => {
    if (!newFeedback.date || !newFeedback.comments.trim()) {
      alert('Please fill in Date and Comments');
      return;
    }

    const sentiment = newFeedback.rating >= 4 ? 'positive' : 
                      newFeedback.rating === 3 ? 'neutral' : 'negative';

    const feedback = {
      id: Date.now(),
      date: newFeedback.date,
      rating: newFeedback.rating,
      sentiment,
      comments: newFeedback.comments,
      serviceLine: newFeedback.serviceLine
    };

    setFeedbackData([...feedbackData, feedback].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setNewFeedback({ date: '', rating: 5, comments: '', serviceLine: 'Neurology' });
    setShowAddFeedbackForm(false);
  };

  const handleDeleteFeedback = (id) => {
    if (window.confirm('Delete this feedback?')) {
      setFeedbackData(feedbackData.filter(f => f.id !== id));
    }
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.owner.trim() || !newTask.dueDate) {
      alert('Please fill in Title, Owner, and Due Date');
      return;
    }

    const task = {
      id: Date.now(),
      title: newTask.title,
      status: newTask.status,
      owner: newTask.owner,
      dueDate: newTask.dueDate,
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', status: 'ToDo', owner: '', dueDate: '', tags: '' });
    setShowAddTaskForm(false);
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const filteredFeedback = useMemo(() => {
    if (selectedServiceLine === 'all') return feedbackData;
    return feedbackData.filter(f => f.serviceLine === selectedServiceLine);
  }, [feedbackData, selectedServiceLine]);

  const sentimentData = useMemo(() => {
    const counts = { positive: 0, neutral: 0, negative: 0 };
    filteredFeedback.forEach(f => {
      if (f.sentiment in counts) {
        counts[f.sentiment]++;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredFeedback]);

  const handleExportData = (dataType) => {
    let dataToExport = [];
    let filename = '';

    switch(dataType) {
      case 'kpi':
        dataToExport = kpiData;
        filename = 'kpi_data.json';
        break;
      case 'feedback':
        dataToExport = feedbackData;
        filename = 'feedback_data.json';
        break;
      case 'tasks':
        dataToExport = tasks;
        filename = 'tasks_data.json';
        break;
      default:
        return;
    }

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const calculateSavings = () => {
    const { baselineVolume, averageCost, noShowReduction, waitTimeReduction, efficiencyGain } = costParams;
    if (baselineVolume <= 0 || averageCost <= 0) return '0.00';
    const totalReduction = (noShowReduction + waitTimeReduction + efficiencyGain) / 100;
    return (baselineVolume * averageCost * totalReduction).toFixed(2);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">ClinicOps Suite</h1>
            <p className="text-gray-600">Healthcare Operations Management</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && loginForm.username && handleLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter any username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && loginForm.username && handleLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter any password"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Sign In
            </button>
            <p className="text-xs text-gray-500 text-center mt-4">
              Demo Mode: Use any username/password. Your data is saved per username.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const KPITracker = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddKPIForm(!showAddKPIForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Add Metrics
          </button>
          <button
            onClick={() => handleExportData('kpi')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            <Download size={18} />
            Export
          </button>
        </div>
        <select
          value={filterDateRange}
          onChange={(e) => setFilterDateRange(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="all">All Time</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      {showAddKPIForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Add Daily Metrics</h3>
            <button onClick={() => setShowAddKPIForm(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Date *</label>
              <input
                type="date"
                value={newKPIEntry.date}
                onChange={(e) => setNewKPIEntry({...newKPIEntry, date: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Visits *</label>
              <input
                type="number"
                value={newKPIEntry.visits}
                onChange={(e) => setNewKPIEntry({...newKPIEntry, visits: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">No-Shows</label>
              <input
                type="number"
                value={newKPIEntry.noShows}
                onChange={(e) => setNewKPIEntry({...newKPIEntry, noShows: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Cancellations</label>
              <input
                type="number"
                value={newKPIEntry.cancellations}
                onChange={(e) => setNewKPIEntry({...newKPIEntry, cancellations: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Avg Wait (min)</label>
              <input
                type="number"
                value={newKPIEntry.avgWait}
                onChange={(e) => setNewKPIEntry({...newKPIEntry, avgWait: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Providers *</label>
              <input
                type="number"
                value={newKPIEntry.providers}
                onChange={(e) => setNewKPIEntry({...newKPIEntry, providers: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddKPI}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              <Save size={18} />
              Save
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Avg Visits</p>
          <p className="text-2xl font-bold text-blue-600">{averageMetrics.avgVisits}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">No-Show Rate</p>
          <p className="text-2xl font-bold text-orange-600">{averageMetrics.avgNoShowRate}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Avg Wait</p>
          <p className="text-2xl font-bold text-purple-600">{averageMetrics.avgWaitTime} min</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Throughput</p>
          <p className="text-2xl font-bold text-green-600">{averageMetrics.avgThroughput}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Data Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm">Date</th>
                <th className="px-4 py-2 text-left text-sm">Visits</th>
                <th className="px-4 py-2 text-left text-sm">No-Shows</th>
                <th className="px-4 py-2 text-left text-sm">Wait</th>
                <th className="px-4 py-2 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredKPIData.map((entry, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm">{entry.date}</td>
                  <td className="px-4 py-3 text-sm">{entry.visits}</td>
                  <td className="px-4 py-3 text-sm">{entry.noShows}</td>
                  <td className="px-4 py-3 text-sm">{entry.avgWait}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDeleteKPI(entry.date)} className="text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredKPIData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="visits" stroke="#005DAA" name="Visits" />
            <Line dataKey="noShows" stroke="#F44336" name="No-Shows" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const FeedbackView = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddFeedbackForm(!showAddFeedbackForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            <Plus size={18} />
            Add Feedback
          </button>
          <button
            onClick={() => handleExportData('feedback')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded"
          >
            <Download size={18} />
            Export
          </button>
        </div>
        <select
          value={selectedServiceLine}
          onChange={(e) => setSelectedServiceLine(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="all">All Services</option>
          <option value="Neurology">Neurology</option>
          <option value="Pain Management">Pain Management</option>
          <option value="PM&R">PM&R</option>
        </select>
      </div>

      {showAddFeedbackForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Add Feedback</h3>
            <button onClick={() => setShowAddFeedbackForm(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Date *</label>
              <input
                type="date"
                value={newFeedback.date}
                onChange={(e) => setNewFeedback({...newFeedback, date: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Service Line</label>
              <select
                value={newFeedback.serviceLine}
                onChange={(e) => setNewFeedback({...newFeedback, serviceLine: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="Neurology">Neurology</option>
                <option value="Pain Management">Pain Management</option>
                <option value="PM&R">PM&R</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Rating *</label>
              <select
                value={newFeedback.rating}
                onChange={(e) => setNewFeedback({...newFeedback, rating: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Very Poor</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Comments *</label>
              <textarea
                value={newFeedback.comments}
                onChange={(e) => setNewFeedback({...newFeedback, comments: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>
          </div>
          <button
            onClick={handleAddFeedback}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            <Save size={18} />
            Save
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sentiment ({filteredFeedback.length})</h3>
          {sentimentData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No feedback data
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Feedback</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {filteredFeedback.length > 0 ? (
              filteredFeedback.map(f => (
                <div key={f.id} className="border-l-4 border-blue-500 pl-3 py-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{f.comments}</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          f.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          f.sentiment === 'neutral' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {f.sentiment}
                        </span>
                        <span className="ml-2 text-xs text-gray-600">Rating: {f.rating}/5</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteFeedback(f.id)} className="text-red-600 ml-2">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">No feedback</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const KanbanView = () => (
    <div className="space-y-6">
      <div className="flex gap-3 bg-white p-4 rounded-lg shadow">
        <button
          onClick={() => setShowAddTaskForm(!showAddTaskForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          <Plus size={18} />
          Add Task
        </button>
        <button
          onClick={() => handleExportData('tasks')}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded"
        >
          <Download size={18} />
          Export
        </button>
      </div>

      {showAddTaskForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Create Task</h3>
            <button onClick={() => setShowAddTaskForm(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Title *</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Owner *</label>
              <input
                type="text"
                value={newTask.owner}
                onChange={(e) => setNewTask({...newTask, owner: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Due Date *</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="ToDo">To-Do</option>
                <option value="InProgress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Tags</label>
              <input
                type="text"
                value={newTask.tags}
                onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                placeholder="efficiency, neurology"
              />
            </div>
          </div>
          <button
            onClick={handleAddTask}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            <Save size={18} />
            Create
          </button>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Workflow Board</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['ToDo', 'InProgress', 'Review', 'Done'].map(status => {
            const statusTasks = tasks.filter(t => t.status === status);
            return (
              <div key={status} className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                <div className="flex justify-between mb-3">
                  <h4 className="font-semibold text-sm">{status.replace(/([A-Z])/g, ' $1').trim()}</h4>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {statusTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {statusTasks.map(task => (
                    <div key={task.id} className="bg-white p-3 rounded shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm flex-1">{task.title}</p>
                        <button onClick={() => handleDeleteTask(task.id)} className="text-red-600 ml-2">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{task.owner}</p>
                      <select
                        value={task.status}
                        onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                        className="w-full text-xs px-2 py-1 border rounded"
                      >
                        <option value="ToDo">To-Do</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const CostCalculator = () => {
    const weekly = parseFloat(calculateSavings());
    const monthly = weekly * 4;
    const annual = weekly * 52;

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-6">Cost Savings Calculator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Volume: <span className="font-bold">{costParams.baselineVolume}</span></label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={costParams.baselineVolume}
                  onChange={(e) => setCostParams({...costParams, baselineVolume: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Cost: <span className="font-bold">${costParams.averageCost}</span></label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={costParams.averageCost}
                  onChange={(e) => setCostParams({...costParams, averageCost: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">No-Show Reduction: <span className="font-bold">{costParams.noShowReduction}%</span></label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={costParams.noShowReduction}
                  onChange={(e) => setCostParams({...costParams, noShowReduction: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
              <h4 className="text-lg font-semibold mb-4">Savings</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Weekly:</span>
                  <span className="text-3xl font-bold text-green-700">${weekly.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly:</span>
                  <span className="text-2xl font-semibold">${monthly.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual:</span>
                  <span className="text-2xl font-semibold">${annual.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Analytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Throughput</p>
          <p className="text-2xl font-bold text-blue-600">{averageMetrics.avgThroughput}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Wait Time</p>
          <p className="text-2xl font-bold text-purple-600">{averageMetrics.avgWaitTime} min</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">No-Show Rate</p>
          <p className="text-2xl font-bold text-orange-600">{averageMetrics.avgNoShowRate}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Satisfaction</p>
          <p className="text-2xl font-bold text-green-600">
            {sentimentData.length > 0 ? 
              ((sentimentData.find(s => s.name === 'positive')?.value || 0) / filteredFeedback.length * 100).toFixed(0) : 0}%
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
        {filteredKPIData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredKPIData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="throughput" fill="#005DAA" name="Throughput" />
              <Bar dataKey="noShowRate" fill="#F44336" name="No-Show %" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            Add KPI data to see trends
          </div>
        )}
      </div>
    </div>
  );

  const ScheduleView = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Provider Schedule (Coming Soon)</h3>
      <p className="text-gray-600">Schedule optimization module will be available in the next update.</p>
    </div>
  );

  const renderContent = () => {
    switch (activeModule) {
      case 'kpi': return <KPITracker />;
      case 'schedule': return <ScheduleView />;
      case 'feedback': return <FeedbackView />;
      case 'kanban': return <KanbanView />;
      case 'cost': return <CostCalculator />;
      case 'analytics': return <Analytics />;
      default: return <KPITracker />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">ClinicOps Suite</h1>
            <p className="text-blue-100 text-sm">Welcome, {currentUser}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 rounded hover:bg-blue-900"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {modules.map(m => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    activeModule === m.id ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'
                  }`}
                >
                  <Icon size={18} className="mr-2" />
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>

      <footer className="bg-white border-t mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
          ClinicOps Suite v1.0 | Data saved for: {currentUser}
        </div>
      </footer>
    </div>
  );
};

export default ClinicOpsSuite;
