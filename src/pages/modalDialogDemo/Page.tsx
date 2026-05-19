import { useState } from 'react';
import ModalDialog from './Component';


function ModalDialogDemo() {
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayCaption, setDisplayCaption] = useState("");
  const [displayMessage, setDisplayMessage] = useState("");

  const handleSend = () => {
    if (caption.trim() || message.trim()) {
      setDisplayCaption(caption || "Message");
      setDisplayMessage(message || "(no message)");
      setIsModalOpen(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '560px', lineHeight: '1.55' }}>
        Build a controlled modal dialog. Manage open/close state, collect a caption and message
        via a form, and display them in a portal-style overlay. Support both button click and
        Ctrl+Enter as submit shortcuts.
      </p>

      <div style={{ display: 'grid', gap: '0.875rem', maxWidth: '28rem' }}>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <label htmlFor="caption">Caption:</label>
          <input
            id="caption"
            type="text"
            placeholder="Enter dialog caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ padding: '0.5rem 0.625rem', font: 'inherit' }}
          />
        </div>

        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            placeholder="Enter message (Ctrl+Enter to send)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={5}
            style={{ padding: '0.5rem 0.625rem', font: 'inherit', resize: 'vertical' }}
          />
        </div>

        <button style={{ width: 'fit-content', padding: '0.5rem 0.875rem' }} onClick={handleSend}>
          Send
        </button>
      </div>

      <ModalDialog
        caption={displayCaption}
        text={displayMessage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}


export default ModalDialogDemo;
