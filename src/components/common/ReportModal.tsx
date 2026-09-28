import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReportReason, ReportTargetType } from '../../types';
import { X, AlertTriangle, UploadCloud, CheckCircle2, Trash2, ShieldAlert } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  targetTitle: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle,
}) => {
  const { currentUser, submitReport } = useApp();

  const [reason, setReason] = useState<ReportReason>('Hàng cấm / Vi phạm pháp luật');
  const [description, setDescription] = useState('');
  const [evidenceImages, setEvidenceImages] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const remainingSlots = 3 - evidenceImages.length;
    const filesToRead = Array.from(files).slice(0, remainingSlots);

    filesToRead.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setEvidenceImages((prev) => {
            if (prev.length >= 3) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) {
      e.target.value = '';
    }
  };

  const handleAddSampleEvidence = (url: string) => {
    if (evidenceImages.length >= 3) return;
    setEvidenceImages([...evidenceImages, url]);
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidenceImages(evidenceImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMsg('Vui lòng đăng nhập để gửi báo cáo vi phạm.');
      return;
    }
    if (description.trim().length < 10) {
      setErrorMsg('Vui lòng mô tả chi tiết vi phạm ít nhất 10 ký tự để Admin đối soát.');
      return;
    }

    submitReport({
      targetType,
      targetId,
      reason,
      description,
      evidenceImages,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-elevated border border-sand-200 relative animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-sand-400 hover:text-charcoal-700 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-charcoal-900">Đã gửi báo cáo vi phạm</h3>
            <p className="text-sm text-sand-600 max-w-sm mx-auto leading-relaxed">
              Cảm ơn bạn đã chung tay bảo vệ môi trường giao dịch ReLoop. Ban Quản Trị sẽ đối soát bằng chứng và nhật ký hộp thư để xử lý trong 24 giờ.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 bg-eco-800 text-white rounded-xl font-semibold text-sm hover:bg-eco-700 transition-colors"
            >
              Hoàn tất & Đóng
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-charcoal-900">Báo cáo vi phạm</h3>
                <p className="text-xs text-sand-600 truncate max-w-xs">
                  Đối tượng: <span className="font-semibold text-charcoal-800">{targetTitle}</span>
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2 border border-rose-200">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                  Lý do vi phạm <span className="text-rose-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ReportReason)}
                  className="w-full text-sm bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600"
                >
                  <option value="Hàng cấm / Vi phạm pháp luật">
                    Hàng cấm / Vi phạm pháp luật (Vũ khí, rượu bia, chất cấm...)
                  </option>
                  <option value="Hàng giả / Sai mô tả nghiêm trọng">
                    Hàng giả / Hàng nhái / Sai mô tả thực tế
                  </option>
                  <option value="Lừa đảo / Chiếm đoạt tài sản">
                    Lừa đảo / Chiếm đoạt tài sản / Yêu cầu cọc tiền trước
                  </option>
                  <option value="Bùng hẹn / Không đến điểm hẹn">
                    Bùng hẹn / Không đến điểm hẹn công cộng không lý do
                  </option>
                  <option value="Quấy rối / Thái độ xúc phạm">
                    Quấy rối / Ngôn từ thù địch / Xúc phạm
                  </option>
                  <option value="Lý do khác">Lý do vi phạm khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                  Mô tả chi tiết vi phạm <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrorMsg('');
                  }}
                  rows={3}
                  placeholder="Vui lòng cung cấp chi tiết hành vi vi phạm, thời gian xảy ra để Admin thuận tiện đối soát..."
                  className="w-full text-sm bg-sand-50 border border-sand-200 rounded-xl p-3 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 placeholder:text-sand-400"
                />
              </div>

              {/* Evidence attachments */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                  Đính kèm ảnh bằng chứng (Tối đa 3 ảnh)
                </label>
                <div className="flex flex-wrap gap-2.5 mb-2">
                  {evidenceImages.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-sand-200 group">
                      <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveEvidence(i)}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Xóa ảnh"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {evidenceImages.length < 3 && (
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-16 h-16 rounded-xl border-2 border-dashed border-sand-300 hover:border-eco-500 hover:bg-eco-50 flex flex-col items-center justify-center text-sand-500 hover:text-eco-700 transition-colors text-[10px]"
                        title="Tải ảnh chụp từ máy"
                      >
                        <UploadCloud className="w-4 h-4 mb-0.5" />
                        <span>Chọn tệp</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleAddSampleEvidence(
                            'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=400&q=80'
                          )
                        }
                        className="px-2 py-1 text-[10px] text-sand-600 hover:text-eco-800 border border-sand-200 hover:border-eco-400 rounded-lg bg-sand-50 transition-colors"
                        title="Dùng ảnh mẫu nếu chưa có tệp"
                      >
                        + Ảnh mẫu
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-sand-500">
                  Hệ thống tự động liên kết toàn bộ lịch sử tin nhắn trong Hộp thư đề nghị làm bằng chứng đối soát chính thức.
                </p>
              </div>

              <div className="pt-3 border-t border-sand-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-sand-700 hover:bg-sand-100 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-soft transition-all"
                >
                  Gửi báo cáo
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
