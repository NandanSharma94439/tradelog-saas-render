import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Save, AlertTriangle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export const SettingsPage = () => {
  const { user, updateUser, logout } = useAuth();
  const { currency, setCurrency } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Kolkata');
  const [defaultRiskPct, setDefaultRiskPct] = useState(String(user?.defaultRiskPct || 1.0));
  const [defaultAsset, setDefaultAsset] = useState(user?.defaultAsset || 'Stock');
  const [defaultQuantity, setDefaultQuantity] = useState(String(user?.defaultQuantity || 100));
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault(); setIsSaving(true);
    try {
      await updateUser({ name, avatar, currency, timezone, defaultRiskPct: parseFloat(defaultRiskPct) || 1.0, defaultAsset, defaultQuantity: parseFloat(defaultQuantity) || 100 });
      setCurrency(currency); alert('Settings saved successfully!');
    } catch (err) { alert('Profile updated locally.'); }
    finally { setIsSaving(false); }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try { await api.delete('/profile'); } catch {}
    finally { logout(); navigate('/login'); setIsDeletingAccount(false); }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Profile & Preferences</h1>
        <p className="text-xs text-dark-muted mt-0.5">Manage your account profile, default trading parameters, and security settings.</p>
      </div>
      <form onSubmit={handleSave} className="space-y-6">
        <Card title="Trader Profile" subtitle="Personal details and display information">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email Address" value={email} disabled helperText="Email address cannot be changed." />
            </div>
            <Input label="Avatar Image URL" placeholder="https://..." value={avatar} onChange={(e) => setAvatar(e.target.value)} />
          </div>
        </Card>
        <Card title="Trading Defaults" subtitle="Pre-fill defaults when logging new trades">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Default Base Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} options={[{ label: 'INR (₹)', value: 'INR' }, { label: 'USD ($)', value: 'USD' }, { label: 'EUR (€)', value: 'EUR' }, { label: 'GBP (£)', value: 'GBP' }]} />
            <Select label="Default Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} options={[{ label: 'Asia/Kolkata (IST)', value: 'Asia/Kolkata' }, { label: 'America/New_York (EST)', value: 'America/New_York' }, { label: 'Europe/London (GMT)', value: 'Europe/London' }]} />
            <Input label="Default Risk % per Trade" type="number" step="0.1" value={defaultRiskPct} onChange={(e) => setDefaultRiskPct(e.target.value)} />
            <Input label="Default Order Quantity" type="number" value={defaultQuantity} onChange={(e) => setDefaultQuantity(e.target.value)} />
          </div>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" isLoading={isSaving} icon={Save}>Save Preferences</Button>
        </div>
      </form>
      <Card title="Membership & Subscription" subtitle="Current SaaS subscription plan status">
        <div className="flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-dark-muted block">Active Tier:</span>
            <span className="text-white font-bold text-base">{user?.subscriptionPlan || 'FREE'} PLAN</span>
          </div>
          <Button onClick={() => navigate('/pricing')} variant="outline" size="sm" icon={CreditCard}>Manage Subscription</Button>
        </div>
      </Card>
      <Card title="Danger Zone" subtitle="Permanent account deletion flow" className="border-rose-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-400">Delete Account & Data</h4>
            <p className="text-xs text-dark-muted">Permanently remove your account, trade logs, screenshots, and goal history. This action cannot be reversed.</p>
          </div>
          <Button onClick={() => setShowDeleteModal(true)} variant="danger" size="md">Delete Account</Button>
        </div>
      </Card>
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete TRADELOG Account?">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
            <p>Warning: Deleting your account will permanently wipe all your trade journal entries, screenshots, strategy setups, and goal metrics from our database.</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={() => setShowDeleteModal(false)} variant="secondary">Cancel</Button>
            <Button onClick={handleDeleteAccount} variant="danger" isLoading={isDeletingAccount}>Confirm Permanent Deletion</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
