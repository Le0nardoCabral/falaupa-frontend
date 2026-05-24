import { useEffect, useRef, useState } from "react";

const INITIAL_TEXT = "Toque no botão e diga o que está sentindo";

export default function PatientVoiceView() {
  const [isRecording, setIsRecording] = useState(false);
  const [statusText, setStatusText] = useState(INITIAL_TEXT);
  const [showTranscript, setShowTranscript] = useState(false);
  const [sent, setSent] = useState(false);
  const stopTimerRef = useRef(null);
  const resetTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  function stopRecording() {
    setIsRecording(false);
    setStatusText("A Inteligência Artificial está analisando seus sintomas...");

    stopTimerRef.current = setTimeout(() => {
      setStatusText("Confirme seus sintomas para gerar a classificação:");
      setShowTranscript(true);
    }, 1600);
  }

  function toggleMic() {
    if (isRecording) {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      stopRecording();
      return;
    }

    setIsRecording(true);
    setSent(false);
    setShowTranscript(false);
    setStatusText("Ouvindo... Fale de forma clara sua queixa.");
    stopTimerRef.current = setTimeout(stopRecording, 3200);
  }

  function handleCancel() {
    setShowTranscript(false);
    setSent(false);
    setStatusText(INITIAL_TEXT);
  }

  function handleConfirm() {
    setSent(true);
    resetTimerRef.current = setTimeout(() => {
      setShowTranscript(false);
      setSent(false);
      setStatusText(INITIAL_TEXT);
    }, 4000);
  }

  return (
    <main id="patient-view" className="view-container" aria-label="Visão do paciente">
      <header className="mobile-header">
        <div className="logo">
          <i className="fa-solid fa-notes-medical logo-icon" />
          <h1>
            Fala<span className="highlight">UPA</span>
          </h1>
        </div>
        <p>Seu assistente de triagem por voz</p>
      </header>

      <section className="voice-assistant-section">
        <div className="status-text">{statusText}</div>

        <div className={`mic-container ${isRecording ? "recording" : ""}`}>
          <div className="pulse-ring" />
          <button type="button" className="mic-button" onClick={toggleMic} aria-label="Ativar microfone">
            <i className="fa-solid fa-microphone" />
          </button>
        </div>

        {showTranscript && (
          <div className="transcript-box">
            {!sent ? (
              <>
                <p className="transcript-text">"Estou com dor no peito e falta de ar desde hoje de manhã..."</p>
                <div className="action-buttons">
                  <button type="button" className="btn-cancel" onClick={handleCancel}>Cancelar</button>
                  <button type="button" className="btn-confirm" onClick={handleConfirm}>Enviar e Aguardar</button>
                </div>
              </>
            ) : (
              <div className="confirm-state">
                <i className="fa-solid fa-circle-check" />
                <p className="confirm-title">Sintomas enviados!</p>
                <p className="confirm-copy">Fique atento ao painel da recepção.</p>
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="mobile-footer">
        <p>
          <i className="fa-solid fa-triangle-exclamation" /> Em caso de emergência grave, chame o SAMU (192)
        </p>
      </footer>
    </main>
  );
}
