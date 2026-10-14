import { useRef, useState } from "react";

const useSpeechRecognition = (onResult, onEnd) => {
  const recognitionRef = useRef(null);

  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      onResult(transcript);
    };

    recognition.onend = () => {
    setListening(false);

    if (onEnd) {
        onEnd();
    }
};

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.start();

    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return {
    listening,
    startListening,
    stopListening,
  };
};

export default useSpeechRecognition;
