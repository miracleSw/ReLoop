import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Layers,
  HeartHandshake,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  FolderTree,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { stats, users, products, transactions, reports } = useApp();

  const flaggedProducts = products.filter((p) => p.flagProhibited || p.status === 'LOCKED');
  const pendingReports = reports.filter((r) => r.status === 'PENDING');
  const completedMeetups = transactions.filter((t) => t.status === 'COMPLETED');

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
          Tổng quan thống kê
        </h1>
        <p className="text-xs sm:text-sm text-sand-600 mt-1">
          Tổng quan hoạt động và các chỉ số toàn sàn theo thời gian thực.
        </p>
      </div>

      {/* 1. MANDATORY 4 KPI GROUPS (BR-02: Users, Posts, Successful Transactions, Reports) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Số người dùng */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-sand-500 font-bold uppercase tracking-wider">
            <span>Tổng người dùng</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-eco-50 to-teal-100 text-eco-700 flex items-center justify-center shadow-subtle">
              <Users className="w-5 h-5 text-eco-700" />
            </div>
          </div>
          <div className="text-3xl font-black text-charcoal-900 tracking-tight">{stats.totalUsers}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold pt-1">
            <TrendingUp className="w-4 h-4" />
            <span>+18.4% so với tháng trước</span>
          </div>
        </div>

        {/* KPI 2: Số bài đăng */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-sand-500 font-bold uppercase tracking-wider">
            <span>Tổng bài đăng đồ cũ</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 text-sky-700 flex items-center justify-center shadow-subtle">
              <Layers className="w-5 h-5 text-sky-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-charcoal-900 tracking-tight">{stats.totalPosts}</div>
          <div className="flex items-center gap-1.5 text-xs text-sky-600 font-bold pt-1">
            <TrendingUp className="w-4 h-4" />
            <span>+24.1% tăng trưởng đồ tuần hoàn</span>
          </div>
        </div>

        {/* KPI 3: Số giao dịch thành công */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-sand-500 font-bold uppercase tracking-wider">
            <span>Giao dịch thành công</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-700 flex items-center justify-center shadow-subtle">
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-charcoal-900 tracking-tight">{stats.totalTransactions}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold pt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Tỷ lệ thành công: {stats.successRate}%</span>
          </div>
        </div>

        {/* KPI 4: Số báo cáo vi phạm */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-sand-500 font-bold uppercase tracking-wider">
            <span>Báo cáo vi phạm</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-50 to-red-100 text-rose-700 flex items-center justify-center shadow-subtle">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-charcoal-900 tracking-tight">{stats.totalReports}</div>
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold pt-1">
            <Clock className="w-4 h-4" />
            <span>{pendingReports.length} báo cáo đang chờ xử lý</span>
          </div>
        </div>
      </div>

      {/* 2. URGENT MODERATION ALERTS */}
      {(flaggedProducts.length > 0 || pendingReports.length > 0) && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
          {flaggedProducts.length > 0 && (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-subtle">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-5 h-5 text-amber-700" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-950 truncate">
                    Có {flaggedProducts.length} bài đăng nghi vấn hàng cấm
                  </h4>
                  <p className="text-[11px] text-amber-800 mt-0.5 line-clamp-1 sm:line-clamp-none">
                    Phát hiện từ khóa nhạy cảm trong chính sách kiểm duyệt tự động.
                  </p>
                </div>
              </div>
              <Link
                to="/admin/posts"
                className="w-full sm:w-auto text-center px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-soft transition-all flex-shrink-0"
              >
                Kiểm duyệt →
              </Link>
            </div>
          )}

          {pendingReports.length > 0 && (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-50 to-red-50/70 border border-rose-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-subtle">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-700" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-rose-950 truncate">
                    Có {pendingReports.length} báo cáo vi phạm cần đối soát
                  </h4>
                  <p className="text-[11px] text-rose-800 mt-0.5 line-clamp-1 sm:line-clamp-none">
                    Báo cáo thành viên bùng hẹn hoặc lừa đảo kèm hình ảnh bằng chứng.
                  </p>
                </div>
              </div>
              <Link
                to="/admin/reports"
                className="w-full sm:w-auto text-center px-4 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-soft transition-all flex-shrink-0"
              >
                Xử lý báo cáo →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 3. CHARTS: MONTHLY GROWTH TREND + CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Visualization (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-charcoal-900 tracking-tight">
                Xu hướng tăng trưởng qua các tháng
              </h3>
              <p className="text-xs text-sand-500 mt-0.5">Số lượng bài đăng mới & giao dịch hoàn tất</p>
            </div>
            <span className="text-xs font-bold text-eco-800 bg-emerald-50 px-3 py-1 rounded-full border border-eco-200 shadow-subtle">
              6 tháng gần nhất
            </span>
          </div>

          {/* Bar Chart Simulation */}
          <div className="pt-4 space-y-4 w-full max-w-full overflow-hidden">
            <div className="grid grid-cols-6 gap-1 sm:gap-2 md:gap-3 items-end h-48 border-b border-slate-200 pb-2 w-full">
              {stats.monthlyTrend.map((m, idx) => {
                const maxVal = 1600;
                const postHeight = Math.round((m.posts / maxVal) * 100);
                const txHeight = Math.round((m.transactions / maxVal) * 100);

                return (
                  <div key={idx} className="flex flex-col items-center gap-1 sm:gap-1.5 h-full justify-end group min-w-0">
                    <div className="w-full flex items-end justify-center gap-0.5 xs:gap-1 sm:gap-1.5 h-full">
                      {/* Posts bar */}
                      <div
                        style={{ height: `${postHeight}%` }}
                        className="w-2 xs:w-3 sm:w-4 bg-gradient-to-t from-eco-800 to-teal-500 rounded-t-md group-hover:brightness-110 transition-all relative shadow-subtle flex-shrink-0"
                        title={`${m.month}: ${m.posts} bài đăng`}
                      />
                      {/* Transactions bar */}
                      <div
                        style={{ height: `${txHeight}%` }}
                        className="w-2 xs:w-3 sm:w-4 bg-gradient-to-t from-clay-600 to-amber-500 rounded-t-md group-hover:brightness-110 transition-all relative shadow-subtle flex-shrink-0"
                        title={`${m.month}: ${m.transactions} giao dịch`}
                      />
                    </div>
                    <span className="text-[9px] xs:text-[10px] text-sand-600 font-bold truncate max-w-full">{m.month}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-sand-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-gradient-to-r from-eco-700 to-teal-500" />
                <span className="font-semibold text-charcoal-800">Số bài đăng</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-gradient-to-r from-clay-600 to-amber-500" />
                <span className="font-semibold text-charcoal-800">Giao dịch hoàn tất</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-soft space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-charcoal-900 tracking-tight">Phân bổ theo ngành hàng</h3>
            <FolderTree className="w-4 h-4 text-sand-400" />
          </div>

          <div className="space-y-4">
            {stats.categoryDistribution.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-charcoal-800">{item.name}</span>
                  <span className="text-sand-500 font-semibold">
                    {item.count} bài ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className="h-full bg-gradient-to-r from-eco-600 to-teal-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
