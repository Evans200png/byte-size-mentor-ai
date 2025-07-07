
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Award, Calendar } from 'lucide-react';
import { useCertificates } from '@/hooks/useCertificates';
import CertificateModal from './CertificateModal';

interface CertificatesPageProps {
  onBack: () => void;
}

const CertificatesPage: React.FC<CertificatesPageProps> = ({ onBack }) => {
  const { certificates, loading } = useCertificates();
  const [selectedCertificate, setSelectedCertificate] = React.useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
            <p className="text-gray-600">Your earned achievements and completed courses</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{certificate.topic_title}</CardTitle>
                  <Badge variant="secondary" className="mx-auto">
                    Score: {certificate.score_achieved}%
                  </Badge>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Issued: {formatDate(certificate.issued_at)}</span>
                    </div>
                    <p className="mt-2">
                      Certificate ID: <span className="font-mono text-xs">{certificate.certificate_id}</span>
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedCertificate(certificate.id)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedCertificate(certificate.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Certificates Yet</h3>
              <p className="text-gray-500 mb-6">
                Complete courses and score 70% or higher on all quizzes to earn certificates!
              </p>
              <Button onClick={onBack}>
                Start Learning
              </Button>
            </CardContent>
          </Card>
        )}

        {selectedCertificate && (
          <CertificateModal
            certificate={certificates.find(c => c.id === selectedCertificate)!}
            onClose={() => setSelectedCertificate(null)}
          />
        )}
      </div>
    </div>
  );
};

export default CertificatesPage;
