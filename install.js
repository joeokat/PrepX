let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installLink').style.display = 'flex';
});

document.getElementById('installLink').addEventListener('click', async (event) => {
  document.getElementById('installLink').style.display = 'none';
  event.preventDefault();
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    deferredPrompt = null;
  }
});