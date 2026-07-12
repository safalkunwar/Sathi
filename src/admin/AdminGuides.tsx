import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Search, FileText } from 'lucide-react';
import { firestore } from '../services/firestore';
import { Companion } from '../types';

interface GuideApplication {
  id: string;
  name: string;
  email: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  idUrl?: string;
  companionId?: string;
}

export function AdminGuides() {
  const [selectedGuide, setSelectedGuide] = useState<GuideApplication | null>(null);
  const [guides, setGuides] = useState<Companion[]>([]);
  const [applications, setApplications] = useState<GuideApplication[]>([]);

  useEffect(() => {
    const unsubCompanions = firestore.subscribe<Companion>('companions', {}, (items) => {
      setGuides(items);
    });

    const unsubApplications = firestore.subscribe<GuideApplication>('guideApplications', { orderByField: 'appliedDate', orderDirection: 'desc' }, (items) => {
      setApplications(items);
    });

    return () => {
      unsubCompanions();
      unsubApplications();
    };
  }, []);

  const handleApprove = async (app: GuideApplication) => {
    if (app.companionId) {
      await firestore.updateDocument(`companions/${app.companionId}`, { isVerified: true, updatedAt: new Date().toISOString() });
    }
    await firestore.updateDocument(`guideApplications/${app.id}`, { status: 'approved' });
    setSelectedGuide(null);
  };

  const handleReject = async (app: GuideApplication) => {
    await firestore.updateDocument(`guideApplications/${app.id}`, { status: 'rejected' });
    setSelectedGuide(null);
  };

  return (
    <div className="space-y-6">
      {/* Pending Guides */}
      <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#222] flex justify-between items-center">
          <h3 className="font-semibold text-sm">Pending Guide Applications</h3>
        </div>

        <div className="divide-y divide-[#222]">
          {applications.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No pending applications.</p>}
          {applications.filter(a => a.status === 'pending').map(app => (
            <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#222]/30 transition-colors">
              <div>
                <p className="text-sm font-semibold">{app.name}</p>
                <p className="text-xs text-gray-400 mt-1">{app.email} • {app.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedGuide(app)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#222] text-gray-300 border border-[#333] rounded-lg text-xs font-medium hover:text-white hover:border-[#C8A25E] transition-colors"
                >
                  <Search className="w-3 h-3" /> Review KYC
                </button>
                <button onClick={() => handleApprove(app)} className="p-1.5 rounded-lg text-green-500 hover:bg-green-500/10 transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <button onClick={() => handleReject(app)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Guides */}
      <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden mt-8">
        <div className="px-5 py-4 border-b border-[#222] flex justify-between items-center">
          <h3 className="font-semibold text-sm">Active Guides ({guides.length})</h3>
        </div>
        <div className="divide-y divide-[#222]">
          {guides.map(guide => (
            <div key={guide.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#222]/30 transition-colors opacity-80">
              <div>
                <p className="text-sm font-semibold flex items-center gap-2">{guide.name} {guide.isVerified && <ShieldAlert className="w-3 h-3 text-green-500" />}</p>
                <p className="text-xs text-gray-400 mt-1">{guide.location} • {guide.isVerified ? 'Verified' : 'Unverified'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-[#222] text-gray-300 border border-[#333] rounded-lg text-xs font-medium hover:text-white hover:border-[#C8A25E] transition-colors">
                  Edit
                </button>
                <button className="px-3 py-1.5 rounded-lg text-red-500 text-xs border border-red-500/20 hover:bg-red-500/10 transition-colors">
                  Suspend
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KYC Review Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#222] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#222] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                KYC Review: {selectedGuide.name}
              </h2>
              <button onClick={() => setSelectedGuide(null)} className="text-[#8E9299] hover:text-white transition-colors">
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Basic Info</h4>
                <div className="bg-[#1a1a1a] border border-[#222] rounded-xl p-4 space-y-2">
                  <div className="flex justify-between"><span className="text-gray-400 text-sm">Name:</span><span className="text-sm">{selectedGuide.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 text-sm">Email:</span><span className="text-sm">{selectedGuide.email}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 text-sm">Location:</span><span className="text-sm">{selectedGuide.location}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 text-sm">Applied:</span><span className="text-sm">{selectedGuide.appliedDate}</span></div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Documents</h4>
                <div className="bg-[#1a1a1a] border border-[#222] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-[#C8A25E]" />
                    <div>
                      <p className="text-sm font-medium">Citizenship/Passport</p>
                      <p className="text-xs text-gray-500">doc_front_back.pdf</p>
                    </div>
                  </div>
                  <button className="text-xs text-[#C8A25E] font-medium border border-[#C8A25E]/50 px-3 py-1.5 rounded-lg hover:bg-[#C8A25E]/10">View</button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => handleReject(selectedGuide)}
                  className="flex-1 py-3 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500/20 transition-colors uppercase tracking-wider text-sm border border-red-500/20"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleApprove(selectedGuide)}
                  className="flex-1 py-3 bg-[#C8A25E] text-[#0F1113] rounded-xl font-bold hover:bg-[#B69150] transition-colors uppercase tracking-wider text-sm"
                >
                  Approve Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
