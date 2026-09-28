import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Report } from '../../types';
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileImage,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminReportsPage: React.FC = () => {
  const { reports, processReport, users, products } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PROCESSED'>('ALL');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [chosenSanction, setChosenSanction] = useState<
    'WARNING' | 'DOCK_TRUST' | 'LOCK_USER' | 'REMOVE_POST' | 'DISMISSED'
  >('LOCK_USER');

  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  const handleProcessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    processReport(
      selectedReport.id,
      chosenSanction,
      resolutionNote.trim() || 'Đã đối soát bằng chứng và xử lý chế tài theo quy chế hệ thống.'
    );

    setSelectedReport(null);
    setResolutionNote('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-charcoal-900">
          Xử lý Báo cáo Vi phạm & Tranh chấp (Report Management)
        </h1>
        <p className="text-xs text-sand-600 mt-0.5">
          Thẩm định bằng chứng người dùng đính kèm, đối soát với Hộp thư đề nghị và áp dụng biện pháp chế tài.
        </p>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 text-xs">
        {(['ALL', 'PENDING', 'PROCESSED'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              statusFilter === st
                ? 'bg-gradient-to-r from-eco-700 to-eco-600 text-white shadow-glow-emerald'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
            }`}
          >
            {st === 'ALL'
              ? `Tất cả (${reports.length})`
              : st === 'PENDING'
              ? `Chờ xử lý (${reports.filter((r) => r.status === 'PENDING').length})`
              : `Đã giải quyết (${reports.filter((r) => r.status === 'PROCESSED').length})`}
          </button>
        ))}
      </div>

      {/* REPORTS LIST */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-soft text-xs text-slate-500">
            Không có báo cáo vi phạm nào trong mục này.
          </div>
        ) : (
          filteredReports.map((rep) => {
            const reporter = users.find((u) => u.id === rep.reporterId);
            const targetUser =
              rep.targetType === 'USER' ? users.find((u) => u.id === rep.targetId) : undefined;
            const targetProd =
              rep.targetType === 'POST' ? products.find((p) => p.id === rep.targetId) : undefined;

            return (
              <div
                key={rep.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-4 hover:shadow-elevated transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                        rep.status === 'PENDING'
                          ? 'bg-rose-100 text-rose-800 animate-pulse border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {rep.status === 'PENDING' ? 'Chờ thẩm định' : 'Đã xử lý xong'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Mã báo cáo: #{rep.id}</span>
                  </div>

                  <span className="text-xs text-slate-400">
                    {new Date(rep.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block">Người gửi báo cáo:</span>
                    <span className="font-bold text-charcoal-900">{reporter?.fullName}</span>
                    <span className="text-[11px] text-slate-500 block">{reporter?.email}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block">Đối tượng bị báo cáo:</span>
                    {targetUser && (
                      <span className="font-bold text-rose-700">
                        Thành viên: {targetUser.fullName} ({targetUser.email})
                      </span>
                    )}
                    {targetProd && (
                      <span className="font-bold text-rose-700">
                        Bài đăng: {targetProd.title}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block">Lý do vi phạm:</span>
                    <span className="font-bold text-charcoal-900">{rep.reason}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-1 border border-slate-200/80">
                  <span className="font-bold text-charcoal-800">Nội dung tố cáo chi tiết:</span>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                    {rep.description}
                  </p>
                </div>

                {/* Evidence Images */}
                {rep.evidenceImages && rep.evidenceImages.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-charcoal-800 block mb-2">
                      Hình ảnh bằng chứng đính kèm ({rep.evidenceImages.length}):
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {rep.evidenceImages.map((img, i) => (
                        <a key={i} href={img} target="_blank" rel="noreferrer" className="group">
                          <img
                            src={img}
                            alt="Bằng chứng"
                            className="w-20 h-20 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform shadow-subtle"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resolution note if processed */}
                {rep.status === 'PROCESSED' && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Biện pháp đã áp dụng: [{rep.actionTaken}]
                    </span>
                    <p>{rep.resolutionNote}</p>
                    <span className="text-[10px] text-emerald-700 block">
                      Giải quyết lúc: {new Date(rep.resolvedAt || '').toLocaleString('vi-VN')}
                    </span>
                  </div>
                )}

                {/* Action button if pending */}
                {rep.status === 'PENDING' && (
                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => {
                        setSelectedReport(rep);
                        setChosenSanction(rep.targetType === 'USER' ? 'LOCK_USER' : 'REMOVE_POST');
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/25 flex items-center gap-1.5 transition-all"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Thẩm định & Áp dụng chế tài</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* RESOLUTION MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-elevated border border-slate-200 animate-slide-up">
            <h3 className="text-lg font-bold text-charcoal-900">
              Quyết định Xử lý Báo cáo #{selectedReport.id}
            </h3>

            <form onSubmit={handleProcessSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Lựa chọn biện pháp chế tài xử lý
                </label>
                <select
                  value={chosenSanction}
                  onChange={(e) => setChosenSanction(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold focus:outline-none focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500"
                >
                  <option value="LOCK_USER">Khóa tài khoản thành viên 30 ngày</option>
                  <option value="DOCK_TRUST">Trừ 15 điểm uy tín thành viên</option>
                  <option value="REMOVE_POST">Gỡ bỏ bài đăng vi phạm vĩnh viễn</option>
                  <option value="WARNING">Gửi cảnh cáo chính thức đến tài khoản</option>
                  <option value="DISMISSED">Bác bỏ báo cáo (Không đủ cơ sở / Báo cáo sai)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Ghi chú kết quả đối soát bằng chứng
                </label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Ghi rõ cơ sở pháp lý, bằng chứng đối soát với Hộp thư giao dịch..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/25"
                >
                  Thực thi quyết định
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
