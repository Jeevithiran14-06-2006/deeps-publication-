import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaperReader from '../components/PaperReader';
import CitationModal from '../components/CitationModal';
import AudioOverviewModal from '../components/AudioOverviewModal';
import ChatPaperModal from '../components/ChatPaperModal';

export default function PaperReaderPage() {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCitationOpen, setIsCitationOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/manuscripts')
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id.toString() === paperId || p.trackingNumber === paperId);
        if (found) {
          setPaper(found);
        } else if (data.length > 0) {
          setPaper(data[0]); // Fallback to first paper
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [paperId]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontFamily: 'monospace' }}>
        LOADING PEER-REVIEWED MANUSCRIPT...
      </div>
    );
  }

  return (
    <div>
      <PaperReader
        paper={paper}
        onClose={() => navigate(-1)}
        onOpenCitation={() => setIsCitationOpen(true)}
        onOpenAudio={() => setIsAudioOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
      />

      <CitationModal
        paper={paper}
        isOpen={isCitationOpen}
        onClose={() => setIsCitationOpen(false)}
      />

      <AudioOverviewModal
        paper={paper}
        isOpen={isAudioOpen}
        onClose={() => setIsAudioOpen(false)}
      />

      <ChatPaperModal
        paper={paper}
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />
    </div>
  );
}