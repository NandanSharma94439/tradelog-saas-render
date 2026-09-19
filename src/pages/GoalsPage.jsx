import React, { useEffect, useState } from 'react';
import { Target, Plus, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DEMO_GOALS } from '../utils/mockData';

export const GoalsPage = () => {
  const { isDemo } = useAuth();
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState('30');
  const [currentVal, setCurrentVal] = useState('0');
  const [unit, setUnit] = useState('trades');
  const [deadline, setDeadline] = useState('2026-10-31');

  useEffect(() => { fetchGoals(); }, [isDemo]);

  async function fetchGoals() {
    setIsLoading(true);
    try {
      const res = await api.get('/goals');
      setGoals(res.data.goals);
    } catch (err) {
      setGoals(isDemo ? DEMO_GOALS : []);
    } finally { setIsLoading(false); }
  }

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!title || !targetValue) return;
    const status = parseFloat(currentVal) >= parseFloat(targetValue) ? 'Achieved' : 'In Progress';
    try {
      const res = await api.post('/goals', { title, description, targetValue: parseFloat(targetValue), currentVal: parseFloat(currentVal), unit, deadline, status });
      setGoals([res.data.goal, ...goals]);
    } catch (err) {
      const newGoal = { id: `g-local-${Date.now()}`, userId: 'demo', title, description, targetValue: parseFloat(targetValue), currentVal: parseFloat(currentVal), unit, deadline, status, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setGoals([newGoal, ...goals]);
    } finally { setShowAddModal(false); setTitle(''); setDescription(''); }
  };

  const handleDeleteGoal = async (id) => {
    try { await api.delete(`/goals/${id}`); } catch {}
    setGoals(goals.filter((g) => g.id !== id));
  };

  if (isLoading) {
    return <div className="p-8 space-y-6 max-w-5xl mx-auto"><Skeleton height="h-10" width="w-64" /><Skeleton height="h-40" /></div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-brand-400" /> Trading Goals & Milestones
          </h1>
          <p className="text-xs text-dark-muted mt-0.5">Set process-oriented discipline goals and track your execution progress.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="primary" size="md" icon={Plus}>Create New Goal</Button>
      </div>
      <div className="space-y-4">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.currentVal / (g.targetValue || 1)) * 100));
          const isAchieved = g.status === 'Achieved' || pct >= 100;
          return (
            <Card key={g.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{g.title}</h3>
                    <Badge variant={isAchieved ? 'profit' : 'warning'}>
                      {isAchieved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {isAchieved ? 'Achieved' : 'In Progress'}
                    </Badge>
                  </div>
                  {g.description && <p className="text-xs text-dark-muted mt-1">{g.description}</p>}
                </div>
                <button onClick={() => handleDeleteGoal(g.id)} className="text-dark-muted hover:text-rose-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between text-xs">
                  <span className="text-dark-muted">Progress: <strong className="text-white">{g.currentVal}</strong> / {g.targetValue} {g.unit}</span>
                  <span className={isAchieved ? 'text-emerald-400 font-bold' : 'text-brand-400 font-bold'}>{pct}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-dark-bg border border-dark-border overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${isAchieved ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-brand-600 to-indigo-400'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Trading Goal">
        <form onSubmit={handleAddGoal} className="space-y-4">
          <Input label="Goal Title *" placeholder="e.g. Follow trading plan for 30 trades" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Description" placeholder="No revenge trading, strict stop loss execution..." value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Target Value *" type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} required />
            <Input label="Current Progress" type="number" value={currentVal} onChange={(e) => setCurrentVal(e.target.value)} />
          </div>
          <Select label="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} options={[{ label: 'Trades', value: 'trades' }, { label: 'Ratio / R', value: 'ratio' }, { label: 'Percentage %', value: '%' }, { label: 'Journal Entries', value: 'entries' }]} />
          <Input label="Target Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" onClick={() => setShowAddModal(false)} variant="secondary">Cancel</Button>
            <Button type="submit" variant="primary">Save Goal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
