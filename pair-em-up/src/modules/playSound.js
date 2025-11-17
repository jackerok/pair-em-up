export const playSound = async (soundFile) => {
  try {
    const audio = new Audio(soundFile);
    await audio.play();
    return true;
  } catch (fallbackError) {
    console.error("Fallback audio also failed:", fallbackError);
    return false;
  }
};
