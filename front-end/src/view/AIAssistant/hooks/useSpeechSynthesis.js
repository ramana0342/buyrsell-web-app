import { useRef } from "react";

const useSpeechSynthesis = () => {
  const utteranceRef = useRef(null);

  const speak = (text, onEnd) => {
    if (!window.speechSynthesis) return;

    // Stop any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => {
    if (onEnd) {
        onEnd();
    }
};

    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utteranceRef.current = utterance;

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
  };

  const isSpeaking = () => {
    return window.speechSynthesis.speaking;
  };

  return {
    speak,
    stop,
    isSpeaking,
  };
};

export default useSpeechSynthesis;