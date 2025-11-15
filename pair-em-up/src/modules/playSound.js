export const playSound = async (soundFile) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    const response = await fetch(soundFile);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);

    return true;
  } catch (error) {
    console.error("Error playing sound:", error);
    try {
      const audio = new Audio(soundFile);
      await audio.play();
      return true;
    } catch (fallbackError) {
      console.error("Fallback audio also failed:", fallbackError);
      return false;
    }
  }
};
