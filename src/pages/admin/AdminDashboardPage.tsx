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
          Dashboard Thống kê Hệ thống (UC22)
        </h1>
        <p className="text-xs sm:text-sm text-sand-600 mt-1">
          Báo cáo định lượng và chỉ số hoạt động toàn sàn ReLoop thời gian thực.
        </p>
      </div>

      {/* 1. MANDATORY 4 KPI GROUPS (BR-02: Users, Posts, Successful Transactions, Reports) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Số người dùng */}
        <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-sand-500 font-semibold">
            <span>Tổng người dùng</span>
            <div className="w-8 h-8 rounded-xl bg-eco-100 text-eco-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-charcoal-900">{stats.totalUsers}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium pt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% so với tháng trước</span>
          </div>
        </div>

        {/* KPI 2: Số bài đăng */}
        <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-sand-500 font-semibold">
            <span>Tổng bài đăng đồ cũ</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-charcoal-900">{stats.totalPosts}</div>
          <div className="flex items-center gap-1.5 text-xs text-sky-700 font-medium pt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.1% tăng trưởng đồ tuần hoàn</span>
          </div>
        </div>

        {/* KPI 3: Số giao dịch thành công */}
        <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-sand-500 font-semibold">
            <span>Giao dịch thành công</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-charcoal-900">{stats.totalTransactions}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tỷ lệ thành công: {stats.successRate}%</span>
          </div>
        </div>

        {/* KPI 4: Số báo cáo vi phạm */}
        <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-sand-500 font-semibold">
            <span>Báo cáo vi phạm</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-charcoal-900">{stats.totalReports}</div>
          <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium pt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingReports.length} báo cáo đang chờ xử lý</span>
          </div>
        </div>
      </div>

      {/* 2. URGENT MODERATION ALERTS */}
      {(flaggedProducts.length > 0 || pendingReports.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {flaggedProducts.length > 0 && (
            <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-amber-700 flex-shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                    Có {flaggedProducts.length} bài đăng nghi vấn hàng cấm
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    Phát hiện từ khóa nhạy cảm trong chính sách kiểm duyệt tự động.
                  </p>
                </div>
              </div>
              <Link
                to="/admin/posts"
                className="px-4 py-2 bg-amber-700 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-soft"
              >
                Kiểm duyệt →
              </Link>
            </div>
          )}

          {pendingReports.length > 0 && (
            <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-700 flex-shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-rose-950">
                    Có {pendingReports.length} báo cáo vi phạm cần đối soát
                  </h4>
                  <p className="text-[11px] text-rose-800">
                    Báo cáo thành viên bùng hẹn hoặc lừa đảo kèm hình ảnh bằng chứng.
                  </p>
                </div>
              </div>
              <Link
                to="/admin/reports"
                className="px-4 py-2 bg-rose-700 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-soft"
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
        <div className="lg:col-span-7 bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-charcoal-900">
                Xu hướng tăng trưởng qua các tháng
              </h3>
              <p className="text-xs text-sand-500">Số lượng bài đăng mới & giao dịch hoàn tất</p>
            </div>
            <span className="text-xs font-semibold text-eco-800 bg-eco-50 px-2.5 py-1 rounded-full border border-eco-200">
              6 tháng gần nhất
            </span>
          </div>

          {/* Bar Chart Simulation */}
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-6 gap-3 items-end h-48 border-b border-sand-200 pb-2">
              {stats.monthlyTrend.map((m, idx) => {
                const maxVal = 1600;
                const postHeight = Math.round((m.posts / maxVal) * 100);
                const txHeight = Math.round((m.transactions / maxVal) * 100);

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Posts bar */}
                      <div
                        style={{ height: `${postHeight}%` }}
                        className="w-3 sm:w-4 bg-eco-800 rounded-t-md group-hover:bg-eco-700 transition-all relative"
                        title={`${m.month}: ${m.posts} bài đăng`}
                      />
                      {/* Transactions bar */}
                      <div
                        style={{ height: `${txHeight}%` }}
                        className="w-3 sm:w-4 bg-clay-500 rounded-t-md group-hover:bg-clay-600 transition-all relative"
                        title={`${m.month}: ${m.transactions} giao dịch`}
                      />
                    </div>
                    <span className="text-[10px] text-sand-600 font-semibold">{m.month}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-sand-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-eco-800" />
                <span>Số bài đăng</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-clay-500" />
                <span>Giao dịch hoàn tất</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-charcoal-900">Phân bổ theo ngành hàng</h3>
            <FolderTree className="w-4 h-4 text-sand-400" />
          </div>

          <div className="space-y-3.5">
            {stats.categoryDistribution.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-charcoal-800">{item.name}</span>
                  <span className="text-sand-500 font-medium">
                    {item.count} bài ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-sand-100 overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className="h-full bg-eco-700 rounded-full"
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
