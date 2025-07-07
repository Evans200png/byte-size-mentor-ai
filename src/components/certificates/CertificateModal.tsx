
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Award } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';

interface Certificate {
  id: string;
  topic_id: string;
  topic_title: string;
  certificate_id: string;
  issued_at: string;
  score_achieved: number;
  lessons_completed: number;
  total_lessons: number;
}

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const { userProfile } = useUserData();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadCertificate = () => {
    // Create a printable certificate
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Certificate - ${certificate.topic_title}</title>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .certificate {
                background: white;
                padding: 60px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 800px;
                width: 100%;
                border: 8px solid #f8f9fa;
              }
              .header {
                color: #4f46e5;
                font-size: 48px;
                font-weight: bold;
                margin-bottom: 20px;
                text-transform: uppercase;
                letter-spacing: 3px;
              }
              .subheader {
                color: #6b7280;
                font-size: 18px;
                margin-bottom: 40px;
              }
              .recipient {
                font-size: 36px;
                color: #1f2937;
                margin: 30px 0;
                font-weight: bold;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 10px;
              }
              .course {
                font-size: 28px;
                color: #4f46e5;
                margin: 30px 0;
                font-weight: 600;
              }
              .details {
                display: flex;
                justify-content: space-between;
                margin: 40px 0;
                font-size: 16px;
                color: #6b7280;
              }
              .signature-section {
                margin-top: 60px;
                display: flex;
                justify-content: space-between;
                align-items: end;
              }
              .signature-line {
                border-top: 2px solid #d1d5db;
                width: 200px;
                padding-top: 10px;
                text-align: center;
                font-size: 14px;
                color: #6b7280;
              }
              .logo {
                font-size: 24px;
                font-weight: bold;
                color: #4f46e5;
                margin-bottom: 10px;
              }
              @media print {
                body { background: white; }
                .certificate { box-shadow: none; border: 2px solid #e5e7eb; }
              }
            </style>
          </head>
          <body>
            <div class="certificate">
              <div class="logo">🎓 TechBites</div>
              <div class="header">Certificate of Completion</div>
              <div class="subheader">This is to certify that</div>
              
              <div class="recipient">${userProfile?.name || 'Student'}</div>
              
              <div class="subheader">has successfully completed</div>
              <div class="course">${certificate.topic_title}</div>
              
              <div class="details">
                <div>
                  <strong>Score Achieved:</strong> ${certificate.score_achieved}%<br>
                  <strong>Lessons Completed:</strong> ${certificate.lessons_completed}/${certificate.total_lessons}
                </div>
                <div>
                  <strong>Date Issued:</strong> ${formatDate(certificate.issued_at)}<br>
                  <strong>Certificate ID:</strong> ${certificate.certificate_id}
                </div>
              </div>
              
              <div class="signature-section">
                <div class="signature-line">
                  TechBites Platform
                </div>
                <div class="signature-line">
                  ${formatDate(certificate.issued_at)}
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg">
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Award className="h-12 w-12 text-white" />
            </div>
            
            <div>
              <h1 className="text-4xl font-bold text-blue-900 mb-2">Certificate of Completion</h1>
              <p className="text-gray-600">This is to certify that</p>
            </div>
            
            <div className="text-3xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-4">
              {userProfile?.name || 'Student'}
            </div>
            
            <div>
              <p className="text-gray-600 mb-2">has successfully completed</p>
              <h2 className="text-2xl font-semibold text-blue-700">{certificate.topic_title}</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-8 text-sm text-gray-600 bg-white p-6 rounded-lg">
              <div>
                <p><strong>Score Achieved:</strong> {certificate.score_achieved}%</p>
                <p><strong>Lessons Completed:</strong> {certificate.lessons_completed}/{certificate.total_lessons}</p>
              </div>
              <div>
                <p><strong>Date Issued:</strong> {formatDate(certificate.issued_at)}</p>
                <p><strong>Certificate ID:</strong> <span className="font-mono text-xs">{certificate.certificate_id}</span></p>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={downloadCertificate}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateModal;
